import { ArrowRight, ArrowLeft, MessageCircle, Users, FileText, Volume2 } from "lucide-react";

interface ContentScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function ContentScreen({ onNext, onBack }: ContentScreenProps) {
  const communicationTypes = [
    {
      icon: Volume2,
      title: "Verbal Communication",
      description: "The words we choose and how we deliver them",
      points: [
        "Choose clear and concise language",
        "Adjust tone based on context",
        "Use appropriate professional vocabulary",
        "Practice active speaking techniques"
      ],
      color: "blue"
    },
    {
      icon: Users,
      title: "Non-Verbal Communication",
      description: "Body language, gestures, and facial expressions",
      points: [
        "Maintain appropriate eye contact",
        "Use open and confident body language",
        "Be aware of facial expressions",
        "Respect personal space boundaries"
      ],
      color: "purple"
    },
    {
      icon: FileText,
      title: "Written Communication",
      description: "Emails, messages, and documentation",
      points: [
        "Write clearly and professionally",
        "Structure messages logically",
        "Proofread before sending",
        "Use appropriate formatting"
      ],
      color: "green"
    },
    {
      icon: MessageCircle,
      title: "Active Listening",
      description: "Fully engaging with and understanding others",
      points: [
        "Give full attention to the speaker",
        "Ask clarifying questions",
        "Provide appropriate feedback",
        "Avoid interrupting unnecessarily"
      ],
      color: "orange"
    }
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
    green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-100" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-100" }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Section 2 of 5
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Types of Communication
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding different communication styles helps you choose the right approach for every situation
          </p>
        </div>

        {/* Communication Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {communicationTypes.map((type, index) => {
            const Icon = type.icon;
            const colors = colorClasses[type.color as keyof typeof colorClasses];
            
            return (
              <div
                key={index}
                className={`bg-white p-6 rounded-2xl shadow-sm border ${colors.border} hover:shadow-lg transition-all duration-200`}
              >
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {type.description}
                    </p>
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-3 mt-4">
                  {type.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 ${colors.bg} rounded-full flex items-center justify-center mt-0.5`}>
                        <span className={`text-xs ${colors.icon}`}>✓</span>
                      </div>
                      <p className="text-sm text-gray-700 flex-1">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Insight */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-2xl mb-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🎯</span>
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Insight</h3>
              <p className="text-blue-50 leading-relaxed">
                Effective workplace communication combines all four types. The best communicators 
                know when to use each style and can seamlessly switch between them based on the 
                situation, audience, and desired outcome.
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
            Next: Practice Scenario
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
