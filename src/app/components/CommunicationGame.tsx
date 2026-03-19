import { useState } from "react";
import { Gamepad2, Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";

interface Scenario {
  id: number;
  situation: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: "Your colleague interrupts you during a team meeting while you're presenting your ideas.",
    question: "What's the best way to respond?",
    options: [
      {
        text: "Stop immediately and let them speak",
        isCorrect: false,
        feedback: "While being polite is important, allowing interruptions can undermine your authority and message."
      },
      {
        text: "Politely acknowledge them: 'I appreciate your input, can I finish this point first?'",
        isCorrect: true,
        feedback: "Perfect! This maintains professionalism while asserting your need to complete your thought."
      },
      {
        text: "Ignore them and continue speaking louder",
        isCorrect: false,
        feedback: "This creates conflict and poor team dynamics. Communication should be respectful."
      },
      {
        text: "Say 'You're always interrupting me!'",
        isCorrect: false,
        feedback: "This is confrontational and unprofessional. Avoid accusatory language in workplace settings."
      }
    ]
  },
  {
    id: 2,
    situation: "You receive an email from a client with an unclear request.",
    question: "What should you do?",
    options: [
      {
        text: "Make your best guess about what they want",
        isCorrect: false,
        feedback: "Assumptions can lead to errors. Always clarify unclear requests."
      },
      {
        text: "Reply asking for clarification with specific questions",
        isCorrect: true,
        feedback: "Excellent! Asking specific questions shows professionalism and prevents misunderstandings."
      },
      {
        text: "Ignore the email until they send a clearer one",
        isCorrect: false,
        feedback: "Ignoring emails is unprofessional and damages client relationships."
      },
      {
        text: "Forward it to your manager to handle",
        isCorrect: false,
        feedback: "Unless it's beyond your scope, take ownership and seek clarification directly."
      }
    ]
  },
  {
    id: 3,
    situation: "During a video call, you notice a team member seems distracted and not engaging.",
    question: "What's the best approach?",
    options: [
      {
        text: "Call them out publicly: 'Are you even paying attention?'",
        isCorrect: false,
        feedback: "Public criticism damages relationships. Address concerns privately and professionally."
      },
      {
        text: "Do nothing and continue the meeting",
        isCorrect: false,
        feedback: "Ignoring disengagement means missing important cues and reducing meeting effectiveness."
      },
      {
        text: "Ask engaging questions: 'What are your thoughts on this approach?'",
        isCorrect: true,
        feedback: "Great! Engaging questions re-involve participants without calling them out negatively."
      },
      {
        text: "End the meeting early",
        isCorrect: false,
        feedback: "This doesn't address the issue and wastes everyone's time."
      }
    ]
  },
  {
    id: 4,
    situation: "You need to deliver negative feedback to a team member about missed deadlines.",
    question: "How should you frame the conversation?",
    options: [
      {
        text: "Focus on the behavior and impact, not the person: 'I noticed the last three deadlines were missed. Let's discuss what's happening.'",
        isCorrect: true,
        feedback: "Perfect! This approach is constructive, specific, and opens dialogue for solutions."
      },
      {
        text: "Send a brief text message: 'You keep missing deadlines. Fix it.'",
        isCorrect: false,
        feedback: "Text is impersonal and doesn't allow for discussion. Serious matters need face-to-face conversations."
      },
      {
        text: "Say: 'You're lazy and don't care about your work.'",
        isCorrect: false,
        feedback: "Personal attacks are never appropriate. Focus on specific behaviors, not character judgments."
      },
      {
        text: "Don't mention it and hope it improves",
        isCorrect: false,
        feedback: "Avoiding difficult conversations allows problems to worsen and shows poor leadership."
      }
    ]
  },
  {
    id: 5,
    situation: "A coworker shares an idea in a brainstorming session that you think won't work.",
    question: "What's the most effective response?",
    options: [
      {
        text: "Say nothing to avoid conflict",
        isCorrect: false,
        feedback: "Withholding valuable feedback prevents the team from making the best decisions."
      },
      {
        text: "Say 'That's a terrible idea because...'",
        isCorrect: false,
        feedback: "Harsh criticism shuts down creativity and damages collaboration."
      },
      {
        text: "Acknowledge their idea, then offer constructive concerns: 'Interesting approach! I wonder if we've considered X challenge?'",
        isCorrect: true,
        feedback: "Excellent! This validates their contribution while introducing important considerations diplomatically."
      },
      {
        text: "Roll your eyes and wait for someone else to disagree",
        isCorrect: false,
        feedback: "Non-verbal negativity damages team morale and is unprofessional."
      }
    ]
  }
];

export function CommunicationGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentScenario(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setGameComplete(false);
  };

  const handleOptionSelect = (index: number) => {
    if (showFeedback) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
    if (scenarios[currentScenario].options[index].isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setGameComplete(true);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / scenarios.length) * 100;
    if (percentage === 100) return "Perfect! You're a communication master! 🌟";
    if (percentage >= 80) return "Excellent work! You have strong communication skills! 🎯";
    if (percentage >= 60) return "Good job! Keep practicing to improve further! 👍";
    return "Keep learning! Practice makes perfect! 💪";
  };

  if (!gameStarted) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6">
          <Gamepad2 className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Communication Skills Challenge
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Test your workplace communication skills with real-world scenarios! 
          Choose the best responses and see how well you handle different communication challenges.
        </p>
        
        <div className="bg-white rounded-xl p-4 mb-6 inline-block">
          <div className="flex items-center gap-8 text-sm">
            <div>
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-gray-600">Scenarios</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-blue-600">~3</div>
              <div className="text-gray-600">Minutes</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-gray-600">Choices Each</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleStartGame}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Gamepad2 className="w-5 h-5" />
          Start Challenge
        </button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Challenge Complete!
        </h3>
        
        <div className="bg-white rounded-xl p-6 mb-6 inline-block min-w-[300px]">
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {score}/{scenarios.length}
          </div>
          <div className="text-gray-600 mb-4">Correct Answers</div>
          <div className="text-lg font-semibold text-gray-900">
            {getScoreMessage()}
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartGame}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Scenario {currentScenario + 1} of {scenarios.length}
          </span>
          <span className="text-sm font-medium text-purple-600">
            Score: {score}/{currentScenario + (showFeedback && selectedOption !== null && scenario.options[selectedOption].isCorrect ? 1 : 0)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Scenario */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentScenario + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Situation</h4>
              <p className="text-gray-700">{scenario.situation}</p>
            </div>
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mb-4">{scenario.question}</h4>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {scenario.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const showCorrect = showFeedback && option.isCorrect;
          const showIncorrect = showFeedback && isSelected && !option.isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                showCorrect
                  ? "border-green-500 bg-green-50"
                  : showIncorrect
                  ? "border-red-500 bg-red-50"
                  : isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  showCorrect
                    ? "border-green-500 bg-green-500"
                    : showIncorrect
                    ? "border-red-500 bg-red-500"
                    : isSelected
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}>
                  {showCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                  {showIncorrect && <XCircle className="w-4 h-4 text-white" />}
                  {!showFeedback && isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    showCorrect
                      ? "text-green-900"
                      : showIncorrect
                      ? "text-red-900"
                      : "text-gray-900"
                  }`}>
                    {option.text}
                  </p>
                  {showFeedback && (isSelected || option.isCorrect) && (
                    <p className={`text-sm mt-2 ${
                      option.isCorrect ? "text-green-700" : "text-red-700"
                    }`}>
                      {option.feedback}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      {showFeedback && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {currentScenario < scenarios.length - 1 ? "Next Scenario" : "View Results"}
          </button>
        </div>
      )}
    </div>
  );
}
