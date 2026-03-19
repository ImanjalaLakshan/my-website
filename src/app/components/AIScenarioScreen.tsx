import { useState } from "react";
import { ArrowRight, ArrowLeft, Send, Sparkles, User, Bot } from "lucide-react";

interface AIScenarioScreenProps {
  onNext: () => void;
  onBack: () => void;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Feedback {
  clarity: number;
  tone: number;
  professionalism: number;
  suggestions: string[];
}

export function AIScenarioScreen({ onNext, onBack }: AIScenarioScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Scenario: You need to discuss a project deadline extension with your manager."
    },
    {
      role: "assistant",
      content: "Hi! Thanks for meeting with me. I wanted to discuss the status of the Q1 report project. How are things progressing on your end?"
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const quickResponses = [
    "I'd like to request a deadline extension for the project.",
    "The project is going well, but I've encountered some challenges.",
    "I need to discuss timeline adjustments with you."
  ];

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const newUserMessage: Message = { role: "user", content };
    setMessages([...messages, newUserMessage]);
    setInputValue("");

    // Generate AI feedback
    const newFeedback: Feedback = {
      clarity: Math.floor(Math.random() * 20) + 75,
      tone: Math.floor(Math.random() * 20) + 75,
      professionalism: Math.floor(Math.random() * 20) + 80,
      suggestions: [
        "Good use of professional language",
        "Consider being more specific about timeline needs",
        "Maintain a solution-oriented approach"
      ]
    };
    setFeedback(newFeedback);
    setShowFeedback(true);

    // Add AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: "I appreciate you bringing this up. Can you help me understand what specific challenges you're facing? That way, we can work together to find the best solution."
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Section 3 of 5 • AI Practice
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Scenario Practice
          </h1>
          <p className="text-lg text-gray-600">
            Practice your communication skills with AI-powered feedback
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Scenario Header */}
              <div className="bg-blue-50 border-b border-blue-100 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💼</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Workplace Scenario
                    </h3>
                    <p className="text-sm text-gray-600">
                      You need to discuss a project deadline extension with your manager
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => {
                  if (message.role === "system") {
                    return (
                      <div key={index} className="text-center">
                        <div className="inline-block bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full">
                          {message.content}
                        </div>
                      </div>
                    );
                  }

                  const isUser = message.role === "user";
                  return (
                    <div key={index} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isUser ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        {isUser ? (
                          <User className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Bot className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className={`flex-1 max-w-md ${isUser ? "text-right" : ""}`}>
                        <div className={`inline-block px-4 py-3 rounded-2xl ${
                          isUser 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-100 text-gray-900"
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Responses */}
              <div className="border-t border-gray-100 p-4">
                <p className="text-xs text-gray-500 mb-3">Quick responses:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickResponses.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(response)}
                      className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {response}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                    placeholder="Type your response..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Feedback Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Feedback</h3>
              </div>

              {showFeedback && feedback ? (
                <div className="space-y-6">
                  {/* Scores */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Clarity</span>
                        <span className="text-sm font-semibold text-gray-900">{feedback.clarity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${feedback.clarity}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Tone</span>
                        <span className="text-sm font-semibold text-gray-900">{feedback.tone}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${feedback.tone}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Professionalism</span>
                        <span className="text-sm font-semibold text-gray-900">{feedback.professionalism}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${feedback.professionalism}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Suggestions</h4>
                    <div className="space-y-2">
                      {feedback.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs text-purple-600">✓</span>
                          </div>
                          <p className="text-sm text-gray-600 flex-1">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Send a message to receive AI-powered feedback on your communication
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-medium rounded-full hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Continue to Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
