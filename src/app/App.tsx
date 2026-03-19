import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/app/components/WelcomeScreen";
import { LearningObjectives } from "@/app/components/LearningObjectives";
import { ModuleOverview } from "@/app/components/ModuleOverview";
import { ContentScreen } from "@/app/components/ContentScreen";
import { AIScenarioScreen } from "@/app/components/AIScenarioScreen";
import { QuizScreen } from "@/app/components/QuizScreen";
import { CompletionScreen } from "@/app/components/CompletionScreen";
import { AuthScreen } from "@/app/components/AuthScreen";
import { getSession, saveProgress, getProgress } from "@/utils/api";

type Screen = 
  | "auth"
  | "welcome"
  | "objectives"
  | "overview"
  | "content"
  | "scenario"
  | "quiz"
  | "completion";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Save progress whenever screen changes (if authenticated)
  useEffect(() => {
    if (isAuthenticated && currentScreen !== "auth") {
      saveUserProgress();
    }
  }, [currentScreen, isAuthenticated]);

  const checkSession = async () => {
    try {
      const session = await getSession();
      if (session) {
        setIsAuthenticated(true);
        // Load saved progress
        const savedProgress = await getProgress();
        if (savedProgress) {
          setCurrentScreen(savedProgress.currentScreen as Screen);
          setCompletedModules(savedProgress.completedModules || []);
        } else {
          setCurrentScreen("welcome");
        }
      } else {
        setCurrentScreen("auth");
      }
    } catch (error) {
      console.error("Session check error:", error);
      setCurrentScreen("auth");
    } finally {
      setLoading(false);
    }
  };

  const saveUserProgress = async () => {
    try {
      await saveProgress(currentScreen, completedModules);
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentScreen("welcome");
  };

  const handleScreenChange = (screen: Screen) => {
    // Add current screen to completed modules
    if (currentScreen !== "auth" && !completedModules.includes(currentScreen)) {
      setCompletedModules([...completedModules, currentScreen]);
    }
    setCurrentScreen(screen);
  };

  const handleRestart = () => {
    setCompletedModules([]);
    setCurrentScreen("welcome");
  };

  const handleQuizComplete = (score: number, answers: number[]) => {
    setQuizScore(score);
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {currentScreen === "auth" && (
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      )}
      
      {currentScreen === "welcome" && (
        <WelcomeScreen onStart={() => handleScreenChange("objectives")} />
      )}
      
      {currentScreen === "objectives" && (
        <LearningObjectives
          onNext={() => handleScreenChange("overview")}
          onBack={() => handleScreenChange("welcome")}
        />
      )}
      
      {currentScreen === "overview" && (
        <ModuleOverview
          onNext={() => handleScreenChange("content")}
          onBack={() => handleScreenChange("objectives")}
        />
      )}
      
      {currentScreen === "content" && (
        <ContentScreen
          onNext={() => handleScreenChange("scenario")}
          onBack={() => handleScreenChange("overview")}
        />
      )}
      
      {currentScreen === "scenario" && (
        <AIScenarioScreen
          onNext={() => handleScreenChange("quiz")}
          onBack={() => handleScreenChange("content")}
        />
      )}
      
      {currentScreen === "quiz" && (
        <QuizScreen
          onNext={() => handleScreenChange("completion")}
          onBack={() => handleScreenChange("scenario")}
          onQuizComplete={handleQuizComplete}
        />
      )}
      
      {currentScreen === "completion" && (
        <CompletionScreen onRestart={handleRestart} quizScore={quizScore} />
      )}
    </div>
  );
}