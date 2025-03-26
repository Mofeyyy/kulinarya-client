import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/config/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Loader, ArrowLeft } from "lucide-react";

dayjs.extend(relativeTime);

const AnnouncementView = () => {
  const { announcementId } = useParams(); // Get the announcement ID from the URL
  const navigate = useNavigate(); // Navigation hook
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the announcement
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await API.get(`/announcements/${announcementId}`);
        setAnnouncement(response.data.announcement);
      } catch (err) {
        setError("Failed to load announcement. Please try again.");
        console.error("Error fetching announcement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [announcementId]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader className="animate-spin text-orange-500 w-8 h-8" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        announcement && (
          <>
            {/* Announcement Title */}
            <h1 className="text-2xl font-bold text-gray-800">{announcement.title}</h1>

            {/* Meta Info */}
            <p className="text-sm text-gray-500 mt-1">
              Posted {dayjs(announcement.createdAt).fromNow()}
            </p>

            {/* Announcement Content */}
            <p className="text-gray-700 mt-4 leading-relaxed">{announcement.content}</p>
          </>
        )
      )}
    </div>
  );
};

export default AnnouncementView;
