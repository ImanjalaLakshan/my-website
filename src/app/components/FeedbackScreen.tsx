import { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle, Star, X, Eye, PenSquare, XCircle } from "lucide-react";
import { submitFeedback, getFeedback } from "@/utils/api";

interface FeedbackScreenProps {
  onClose: () => void;
}

interface FeedbackItem {
  id: string;
  rating: number;
  category: string;
  message: string;
  submittedAt: string;
  userName: string;
}

export function FeedbackScreen({ onClose }: FeedbackScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [viewMode, setViewMode] = useState<"form" | "history">("form");

  const categories = [
    { value: "general", label: "General Feedback" },
    { value: "content", label: "Course Content" },
    { value: "technical", label: "Technical Issues" },
    { value: "suggestion", label: "Suggestions" },
  ];

  useEffect(() => {
    loadFeedbackHistory();
  }, []);

  const loadFeedbackHistory = async () => {
    try {
      const history = await getFeedback();
      setFeedbackHistory(history || []);
    } catch (error) {
      console.error("Failed to load feedback history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!message.trim()) {
      setError("Please enter your feedback");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      console.log("Submitting feedback:", { rating, category, message: message.substring(0, 50) });
      await submitFeedback(rating, category, message);
      console.log("Feedback submitted successfully");
      setSubmitted(true);
      
      // Reload feedback history
      console.log("Reloading feedback history...");
      await loadFeedbackHistory();
      
      // After submission, switch to history view after a brief delay
      setTimeout(() => {
        setViewMode("history");
      }, 1500);
    } catch (err: any) {
      console.error("Feedback submission error:", err);
      
      // Check if it's a session error
      if (err.message && (err.message.includes('session') || err.message.includes('sign in'))) {
        setError("Your session has expired. Please refresh the page and sign in again.");
      } else {
        setError(err.message || "Failed to submit feedback. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewFeedback = () => {
    setRating(0);
    setCategory("general");
    setMessage("");
    setSubmitted(false);
    setError("");
    setViewMode("form");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Training Feedback</h2>
              <p className="text-blue-100 text-sm">Share your thoughts and suggestions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode("form")}
              className={`px-4 py-3 font-medium text-sm transition-colors relative ${
                viewMode === "form"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <PenSquare className="w-4 h-4" />
                Submit Feedback
              </div>
              {viewMode === "form" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setViewMode("history")}
              className={`px-4 py-3 font-medium text-sm transition-colors relative ${
                viewMode === "history"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View History
                {feedbackHistory.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">
                    {feedbackHistory.length}
                  </span>
                )}
              </div>
              {viewMode === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "form" ? (
            // Feedback Form
            <div className="max-w-2xl mx-auto">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Thank You for Your Feedback!
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Your feedback has been submitted successfully and helps us improve the training experience.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setViewMode("history")}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      View Your Feedback
                    </button>
                    <button
                      onClick={handleNewFeedback}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all"
                    >
                      <PenSquare className="w-5 h-5" />
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How would you rate this training?
                    </label>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-10 h-10 ${
                              star <= (hoveredRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-center text-sm text-gray-600 mt-2">
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Tell us what you think about the training... What did you like? What could be improved?"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            // Feedback History
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Feedback History</h3>
                <p className="text-gray-600">Review all the feedback you've submitted</p>
              </div>
              
              {loadingHistory ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : feedbackHistory.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Yet</h4>
                  <p className="text-gray-500 mb-6">You haven't submitted any feedback yet</p>
                  <button
                    onClick={() => setViewMode("form")}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <PenSquare className="w-5 h-5" />
                    Submit Feedback
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbackHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= item.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(item.submittedAt)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          {categories.find(c => c.value === item.category)?.label || item.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          {viewMode === "history" && !submitted && (
            <button
              onClick={() => setViewMode("form")}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              ← Back to Form
            </button>
          )}
          <div className={viewMode === "history" && !submitted ? "" : "ml-auto"}>
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}