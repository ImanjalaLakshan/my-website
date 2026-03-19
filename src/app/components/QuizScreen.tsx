import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { saveQuizResults } from "@/utils/api";

interface QuizScreenProps {
  onNext: () => void;
  onBack: () => void;
  onQuizComplete?: (score: number, answers: number[]) => void;
}

export function QuizScreen({ onNext, onBack, onQuizComplete }: QuizScreenProps) {
  const questions: Question[] = [
    {
      question: "What percentage of communication is non-verbal according to research?",
      options: [
        "About 25%",
        "About 50%",
        "About 70-93%",
        "About 10%"
      ],
      correctAnswer: 2,
      explanation: "Research suggests that 70-93% of communication is non-verbal, including body language, tone, and facial expressions."
    },
    {
      question: "Which of the following is an example of active listening?",
      options: [
        "Checking your phone while someone is speaking",
        "Interrupting to share your own experience",
        "Asking clarifying questions and providing feedback",
        "Thinking about what you'll say next"
      ],
      correctAnswer: 2,
      explanation: "Active listening involves fully engaging with the speaker by asking questions, providing feedback, and showing genuine interest."
    },
    {
      question: "When writing professional emails, you should:",
      options: [
        "Use informal language to be friendly",
        "Write long paragraphs with all details",
        "Be clear, concise, and use proper formatting",
        "Avoid proofreading to save time"
      ],
      correctAnswer: 2,
      explanation: "Professional emails should be clear, concise, well-formatted, and proofread to ensure effective communication."
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowFeedback(true);
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
      
      // Save quiz results to backend
      const score = calculateScore();
      const answers = selectedAnswers.filter((a): a is number => a !== null);
      
      try {
        await saveQuizResults(score, answers);
        if (onQuizComplete) {
          onQuizComplete(score, answers);
        }
      } catch (error) {
        console.error("Failed to save quiz results:", error);
        // Still allow progression even if save fails
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  if (quizCompleted) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quiz Complete!
              </h2>
              
              <div className="mb-8">
                <div className="text-5xl font-bold text-blue-600 mb-2">{score}%</div>
                <p className="text-gray-600">Your Score</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Results Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedAnswers.filter((a, i) => a === questions[i].correctAnswer).length}
                    </div>
                    <div className="text-xs text-gray-600">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedAnswers.filter((a, i) => a !== questions[i].correctAnswer && a !== null).length}
                    </div>
                    <div className="text-xs text-gray-600">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {questions.length}
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-8">
                {score >= 70 
                  ? "Great job! You've demonstrated a strong understanding of effective communication principles."
                  : "Good effort! Review the material to strengthen your communication skills."}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={onNext}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Complete Training
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Section 4 of 5 • Quick Assessment
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Knowledge Check
          </h1>
          <p className="text-lg text-gray-600">
            Test your understanding of effective communication
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQ.correctAnswer;
              const showCorrect = showFeedback && isCorrectAnswer;
              const showIncorrect = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && handleSelectAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : showIncorrect
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      showCorrect
                        ? "border-green-500 bg-green-500"
                        : showIncorrect
                        ? "border-red-500 bg-red-500"
                        : isSelected
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}>
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {showIncorrect && <XCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-semibold mb-1 ${isCorrect ? "text-green-900" : "text-red-900"}`}>
                    {isCorrect ? "Correct!" : "Not quite right"}
                  </h4>
                  <p className={`text-sm ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-medium rounded-full hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          {showFeedback && (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}