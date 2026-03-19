import { projectId, publicAnonKey } from '/utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-753d7fd6`;

// Create Supabase client singleton
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
  return supabaseClient;
}

// Helper function to get auth header
async function getAuthHeader(): Promise<{ Authorization: string }> {
  const supabase = getSupabaseClient();
  
  // First try to get the current session
  let { data: { session } } = await supabase.auth.getSession();
  
  // If no session or token is expired, try to refresh
  if (!session || !session.access_token) {
    console.log("No active session found, attempting to refresh...");
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error("Session refresh failed:", refreshError);
      throw new Error('Your session has expired. Please sign in again.');
    }
    
    session = refreshData.session;
  }
  
  if (!session?.access_token) {
    throw new Error('No active session. Please sign in again.');
  }
  
  console.log("Auth token retrieved successfully");
  return { Authorization: `Bearer ${session.access_token}` };
}

// Auth functions
export async function signUp(email: string, password: string, name: string) {
  try {
    console.log("Calling signup API endpoint...", { email, name });
    
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, name })
    });

    console.log("Signup response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to create account' }));
      console.error("Signup failed:", errorData);
      throw new Error(errorData.error || `Signup failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Signup response data:", data);
    
    return data;
  } catch (error: any) {
    console.error('Signup error details:', error);
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check your connection and try again.');
    }
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log("Calling signin with Supabase client...", { email });
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Sign in response:", { data: data ? "success" : "null", error });

    if (error) {
      console.error("Sign in error from Supabase:", error);
      
      // Provide more user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      
      throw new Error(error.message);
    }

    if (!data.session) {
      throw new Error('Failed to create session. Please try again.');
    }

    console.log("Sign in successful, session created");
    return data;
  } catch (error: any) {
    console.error('Sign in error details:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getSession() {
  try {
    const supabase = getSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

// Progress tracking
export async function saveProgress(
  currentScreen: string,
  completedModules: string[],
  quizAnswers?: number[]
) {
  try {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({ currentScreen, completedModules, quizAnswers })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save progress');
    }

    return data;
  } catch (error) {
    console.error('Save progress error:', error);
    throw error;
  }
}

export async function getProgress() {
  try {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/progress`, {
      method: 'GET',
      headers: authHeader
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch progress');
    }

    return data.progress;
  } catch (error) {
    console.error('Get progress error:', error);
    return null;
  }
}

// Quiz results
export async function saveQuizResults(score: number, answers: number[]) {
  try {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/quiz-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({ score, answers, completedAt: new Date().toISOString() })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save quiz results');
    }

    return data;
  } catch (error) {
    console.error('Save quiz results error:', error);
    throw error;
  }
}

// Training completion
export async function completeTraining(score: number) {
  try {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/complete-training`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({ score })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to complete training');
    }

    return data;
  } catch (error) {
    console.error('Complete training error:', error);
    throw error;
  }
}

// Get certificate
export async function getCertificate() {
  try {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/certificate`, {
      method: 'GET',
      headers: authHeader
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch certificate');
    }

    return data.certificate;
  } catch (error) {
    console.error('Get certificate error:', error);
    return null;
  }
}

// Get all user data
export async function getUserData() {
  try {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/user-data`, {
      method: 'GET',
      headers: authHeader
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user data');
    }

    return data;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
}

// Submit feedback
export async function submitFeedback(rating: number, category: string, message: string) {
  try {
    console.log("=== submitFeedback START ===");
    console.log("submitFeedback called with:", { rating, category, messageLength: message.length });
    
    const supabase = getSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      throw new Error('Please sign in to submit feedback');
    }
    
    console.log("User authenticated:", user.id);
    
    // Insert feedback directly into Supabase
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: user.id,
        rating,
        category,
        message,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message || 'Failed to submit feedback');
    }

    console.log("=== submitFeedback SUCCESS ===");
    console.log("Feedback saved:", data);
    return data;
  } catch (error: any) {
    console.error("=== submitFeedback ERROR ===");
    console.error('Submit feedback error:', error);
    console.error('Error message:', error.message);
    throw error;
  }
}

// Get feedback history
export async function getFeedback() {
  try {
    console.log("=== getFeedback START ===");
    
    const supabase = getSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      throw new Error('Please sign in to view feedback');
    }
    
    console.log("Fetching feedback for user:", user.id);
    
    // Get feedback directly from Supabase
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error("Supabase select error:", error);
      throw new Error(error.message || 'Failed to fetch feedback');
    }

    console.log("=== getFeedback SUCCESS ===");
    console.log("Feedback count:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Get feedback error:', error);
    return [];
  }
}