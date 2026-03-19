import { ArrowRight, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Effective Communication<br />at Work
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Communicate clearly, confidently, and professionally
            </p>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Learning</h3>
              <p className="text-sm text-gray-600">Practice real workplace scenarios</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Feedback</h3>
              <p className="text-sm text-gray-600">Get instant personalized insights</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">30 Minutes</h3>
              <p className="text-sm text-gray-600">Complete at your own pace</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStart}
            className="mt-12 inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Training
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Duration Note */}
          <p className="text-sm text-gray-500 mt-4">
            Estimated time: 30 minutes • Certificate upon completion
          </p>
        </div>
      </div>
    </div>
  );
}
