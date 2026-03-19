import { Check, ArrowRight, ArrowLeft } from "lucide-react";

interface LearningObjectivesProps {
  onNext: () => void;
  onBack: () => void;
}

export function LearningObjectives({ onNext, onBack }: LearningObjectivesProps) {
  const objectives = [
    {
      icon: "🗣️",
      title: "Improve verbal and non-verbal communication",
      description: "Master the art of speaking clearly and using body language effectively"
    },
    {
      icon: "👂",
      title: "Practice active listening skills",
      description: "Learn techniques to truly understand and respond to colleagues"
    },
    {
      icon: "💼",
      title: "Handle workplace conversations professionally",
      description: "Navigate difficult conversations and professional interactions with confidence"
    },
    {
      icon: "🤖",
      title: "Receive AI-generated feedback",
      description: "Get personalized insights on your communication style and areas for improvement"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Check className="w-4 h-4" />
            Learning Objectives
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What You'll Learn
          </h1>
          <p className="text-lg text-gray-600">
            By the end of this training, you'll be able to:
          </p>
        </div>

        {/* Objectives Grid */}
        <div className="space-y-6 mb-12">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                    {objective.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {objective.title}
                  </h3>
                  <p className="text-gray-600">
                    {objective.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
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
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
