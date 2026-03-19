import { useState, useEffect } from "react";
import { Award, Download, Share2, RefreshCw, CheckCircle, LogOut, MessageSquare, Gamepad2 } from "lucide-react";
import { completeTraining, getCertificate, signOut } from "@/utils/api";
import { FeedbackScreen } from "./FeedbackScreen";
import { CommunicationGame } from "./CommunicationGame";

interface CompletionScreenProps {
  onRestart: () => void;
  quizScore?: number;
}

export function CompletionScreen({ onRestart, quizScore = 85 }: CompletionScreenProps) {
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const keyTakeaways = [
    "Effective communication combines verbal, non-verbal, written, and listening skills",
    "Active listening is crucial for understanding and responding appropriately",
    "Professional communication requires clarity, appropriate tone, and proper etiquette",
    "AI-powered feedback can help identify areas for improvement in real-time",
    "Practice and self-awareness are key to becoming a better communicator"
  ];

  useEffect(() => {
    loadOrCreateCertificate();
  }, []);

  const loadOrCreateCertificate = async () => {
    try {
      // Try to get existing certificate
      let cert = await getCertificate();
      
      // If no certificate exists, create one
      if (!cert) {
        const result = await completeTraining(quizScore);
        cert = result.certificate;
      }
      
      setCertificate(cert);
    } catch (error) {
      console.error("Failed to load certificate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (!certificate) {
      alert("Certificate not available");
      return;
    }

    // Create a simple text certificate (in production, you'd generate a PDF)
    const certificateText = `
═══════════════════════════════════════════════════
          CERTIFICATE OF COMPLETION
═══════════════════════════════════════════════════

This certifies that

${certificate.name}

has successfully completed the training program:

"Effective Communication in the Workplace"

Completed on: ${new Date(certificate.completedAt).toLocaleDateString()}
Score: ${certificate.score}%
Certificate ID: ${certificate.certificateId}

═══════════════════════════════════════════════════
    AI-Powered Corporate Training Platform
═══════════════════════════════════════════════════
    `;

    // Create and download the certificate
    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${certificate.certificateId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    // Mock share functionality
    if (navigator.share && certificate) {
      navigator.share({
        title: 'Training Completed!',
        text: `I just completed "Effective Communication in the Workplace" training with a score of ${certificate.score}%!`,
      }).catch(() => {
        alert("Share your achievement on social media!");
      });
    } else {
      alert("Share your achievement on social media!");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your certificate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6">
      <div className="max-w-4xl mx-auto py-8">
        {/* Sign Out Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-full hover:bg-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Celebration Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Award className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-2xl">🎉</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Congratulations{certificate?.name ? `, ${certificate.name}` : ''}!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            You've completed the training
          </p>
          <p className="text-lg text-gray-500">
            Effective Communication in the Workplace
          </p>
        </div>

        {/* Completion Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">Training Complete</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5/5</div>
            <div className="text-sm text-gray-600">Modules Finished</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{certificate?.score || quizScore}%</div>
            <div className="text-sm text-gray-600">Quiz Score</div>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-2xl mb-8">
          <div className="bg-white p-8 rounded-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Certificate of Completion
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Achievement is Ready
              </h2>
              <p className="text-gray-600 mb-2">
                Download your certificate and share your accomplishment
              </p>
              {certificate && (
                <p className="text-sm text-gray-500">
                  Certificate ID: {certificate.certificateId}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDownloadCertificate}
                disabled={!certificate}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-full border-2 border-gray-200 transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share Achievement
              </button>
            </div>
          </div>
        </div>

        {/* Communication Skills Game */}
        <div className="mb-8">
          <CommunicationGame />
        </div>

        {/* Key Takeaways */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Key Takeaways
          </h3>
          <div className="space-y-4">
            {keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-sm text-green-600 font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700 flex-1">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Continue Your Learning Journey
          </h3>
          <p className="text-gray-600 mb-6">
            Keep developing your skills with more training modules and practice scenarios
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-1">Advanced Communication</h4>
              <p className="text-sm text-gray-600">Master complex conversations</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-1">Leadership Skills</h4>
              <p className="text-sm text-gray-600">Develop your leadership style</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-full border-2 border-gray-200 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Retake Training
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all">
            Browse More Courses
          </button>
        </div>

        {/* Feedback Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowFeedback(true)}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full border-2 border-gray-200 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Provide Feedback
          </button>
        </div>

        {/* Feedback Screen */}
        {showFeedback && (
          <FeedbackScreen
            onClose={() => setShowFeedback(false)}
          />
        )}
      </div>
    </div>
  );
}