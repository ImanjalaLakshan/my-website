import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-753d7fd6/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-753d7fd6/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    console.log("Signup request received:", { email, name });

    if (!email || !password || !name) {
      console.log("Missing required fields");
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    if (password.length < 6) {
      console.log("Password too short");
      return c.json({ error: "Password must be at least 6 characters" }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log("Environment check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Missing Supabase environment variables");
      return c.json({ error: "Server configuration error" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Creating user with admin API...");
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error from Supabase: ${error.message}`, error);
      
      // Handle specific errors
      if (error.message.includes('already registered')) {
        return c.json({ error: "An account with this email already exists" }, 400);
      }
      
      return c.json({ error: error.message }, 400);
    }

    console.log("User created successfully:", data.user?.id);
    return c.json({ user: data.user, message: "User created successfully" });
  } catch (error: any) {
    console.log(`Signup exception: ${error.message}`, error);
    return c.json({ error: `Failed to create user: ${error.message}` }, 500);
  }
});

// Save user progress
app.post("/make-server-753d7fd6/progress", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { currentScreen, completedModules, quizAnswers } = await c.req.json();

    const progressData = {
      currentScreen,
      completedModules: completedModules || [],
      quizAnswers: quizAnswers || [],
      lastUpdated: new Date().toISOString()
    };

    await kv.set(`progress:${user.id}`, progressData);

    return c.json({ success: true, progress: progressData });
  } catch (error) {
    console.log(`Progress save error: ${error}`);
    return c.json({ error: "Failed to save progress" }, 500);
  }
});

// Get user progress
app.get("/make-server-753d7fd6/progress", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const progress = await kv.get(`progress:${user.id}`);

    return c.json({ progress: progress || null });
  } catch (error) {
    console.log(`Progress fetch error: ${error}`);
    return c.json({ error: "Failed to fetch progress" }, 500);
  }
});

// Save quiz results
app.post("/make-server-753d7fd6/quiz-results", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { score, answers, completedAt } = await c.req.json();

    const quizData = {
      userId: user.id,
      score,
      answers,
      completedAt: completedAt || new Date().toISOString()
    };

    await kv.set(`quiz:${user.id}`, quizData);

    return c.json({ success: true, quizData });
  } catch (error) {
    console.log(`Quiz results save error: ${error}`);
    return c.json({ error: "Failed to save quiz results" }, 500);
  }
});

// Complete training and generate certificate
app.post("/make-server-753d7fd6/complete-training", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { score } = await c.req.json();

    const completionData = {
      userId: user.id,
      email: user.email,
      name: user.user_metadata?.name || "Learner",
      completedAt: new Date().toISOString(),
      score,
      certificateId: `CERT-${user.id.substring(0, 8).toUpperCase()}-${Date.now()}`
    };

    await kv.set(`completion:${user.id}`, completionData);

    return c.json({ 
      success: true, 
      certificate: completionData,
      message: "Training completed successfully"
    });
  } catch (error) {
    console.log(`Training completion error: ${error}`);
    return c.json({ error: "Failed to complete training" }, 500);
  }
});

// Get certificate
app.get("/make-server-753d7fd6/certificate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const certificate = await kv.get(`completion:${user.id}`);

    if (!certificate) {
      return c.json({ error: "Certificate not found" }, 404);
    }

    return c.json({ certificate });
  } catch (error) {
    console.log(`Certificate fetch error: ${error}`);
    return c.json({ error: "Failed to fetch certificate" }, 500);
  }
});

// Get all user data (progress + quiz + completion)
app.get("/make-server-753d7fd6/user-data", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [progress, quiz, completion] = await Promise.all([
      kv.get(`progress:${user.id}`),
      kv.get(`quiz:${user.id}`),
      kv.get(`completion:${user.id}`)
    ]);

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name
      },
      progress,
      quiz,
      completion
    });
  } catch (error) {
    console.log(`User data fetch error: ${error}`);
    return c.json({ error: "Failed to fetch user data" }, 500);
  }
});

// Submit feedback
app.post("/make-server-753d7fd6/feedback", async (c) => {
  try {
    console.log("=== FEEDBACK SUBMISSION START ===");
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.log("No access token provided");
      return c.json({ error: "No authorization token provided" }, 401);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    console.log("Getting user from token...");
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.log("Auth error:", authError.message);
      return c.json({ error: "Authentication failed: " + authError.message }, 401);
    }
    
    if (!user?.id) {
      console.log("No user ID found");
      return c.json({ error: "User not found" }, 401);
    }

    console.log("User authenticated:", user.id);

    const { rating, category, message, submittedAt } = await c.req.json();
    console.log("Received data:", { rating, category, messageLength: message?.length, submittedAt });

    if (!rating || !category || !message) {
      console.log("Missing required fields");
      return c.json({ error: "Rating, category, and message are required" }, 400);
    }

    // Get existing feedback list
    console.log("Getting existing feedback...");
    let existingFeedback = await kv.get(`feedback:${user.id}`);
    console.log("Existing feedback:", existingFeedback ? `Found ${Array.isArray(existingFeedback) ? existingFeedback.length : 'invalid'} items` : "None");
    
    const feedbackItem = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.user_metadata?.name || "Anonymous",
      rating,
      category,
      message,
      submittedAt: submittedAt || new Date().toISOString()
    };

    console.log("Created feedback item:", feedbackItem.id);

    // Add new feedback to the list
    const updatedFeedback = Array.isArray(existingFeedback) 
      ? [feedbackItem, ...existingFeedback]
      : [feedbackItem];

    console.log("Saving feedback to KV store...");
    await kv.set(`feedback:${user.id}`, updatedFeedback);

    console.log("Feedback submitted successfully:", feedbackItem.id);
    console.log("=== FEEDBACK SUBMISSION END ===");
    return c.json({ success: true, feedback: feedbackItem });
  } catch (error: any) {
    console.log("=== FEEDBACK SUBMISSION ERROR ===");
    console.log(`Feedback submission exception: ${error.message}`, error);
    return c.json({ error: `Failed to submit feedback: ${error.message}` }, 500);
  }
});

// Get user feedback
app.get("/make-server-753d7fd6/feedback", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const feedback = await kv.get(`feedback:${user.id}`) || [];

    return c.json({ feedback });
  } catch (error) {
    console.log(`Feedback fetch error: ${error}`);
    return c.json({ error: "Failed to fetch feedback" }, 500);
  }
});

Deno.serve(app.fetch);