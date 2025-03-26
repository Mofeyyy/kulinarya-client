import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/config/axios";

const AnnouncementForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/announcements/create", { title, content });
      navigate("/"); // Redirect to home or announcements page after success
    } catch (err) {
      console.error("Error creating announcement:", err);
      setError("Failed to create announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">📢 Create Announcement</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Announcement Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Announcement Content */}
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg resize-none h-28"
            placeholder="Enter announcement details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full p-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}`}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Announcement"}
        </button>
      </form>
    </div>
  );
};

export default AnnouncementForm;
