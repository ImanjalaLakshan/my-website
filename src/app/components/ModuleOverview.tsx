import { ArrowRight, ArrowLeft, BookOpen, MessageSquare, Brain, HelpCircle, Award } from "lucide-react";

interface ModuleOverviewProps {
  onNext: () => void;
  onBack: () => void;
}

export function ModuleOverview({ onNext, onBack }: ModuleOverviewProps) {
  const modules = [
    {
      icon: BookOpen,
      title: "Introduction to Communication",
      duration: "5 min",
      completed: false
    },
    {
      icon: MessageSquare,
      title: "Types of Communication",
      duration: "8 min",
      completed: false
    },
    {
      icon: Brain,
      title: "AI Scenario Practice",
      duration: "10 min",
      completed: false
    },
    {
      icon: HelpCircle,
      title: "Quick Quiz",
      duration: "5 min",
      completed: false
    },
    {
      icon: Award,
      title: "Key Takeaways",
      duration: "2 min",
      completed: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header with Progress */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Module Overview
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Complete all sections to finish your training
          </p>

          {/* Progress Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Training Progress</span>
              <span className="text-sm font-medium text-gray-700">0% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">0 of 5 sections completed</span>
              <span className="text-xs text-gray-500">⏱️ 30 minutes total</span>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4 mb-12">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center font-semibold text-blue-600 transition-colors">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {module.duration}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    {module.completed ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600">✓</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 border-2 border-gray-200 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Pro Tip</h4>
              <p className="text-sm text-blue-800">
                Take your time with each section. You can pause and resume at any time. 
                The AI scenarios will adapt to your responses for personalized learning.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Begin Training
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
