import { useState } from "react";
import { Megaphone } from "lucide-react"; // New icon for announcements
import Modal from "../AnnouncementModal/AnnouncementModal"; // Import Modal
import useAuthStore from "@/hooks/stores/useAuthStore"; // Import the auth store

const AnnouncementFloatingButton = ({ announcements, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for create announcement modal

  // Get the isLoggedIn state from useAuthStore
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); // Use the store to check if user is logged in

  // Handle opening the modal to create an announcement
  const handleCreateAnnouncement = () => {
    setIsCreateModalOpen(true); // Open create modal
  };

  // If the user is not logged in, return null to hide the button
  if (!isLoggedIn) return null;

  return (
    <>
      {/* Floating Button for Viewing Announcements */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-10 bottom-10 z-50 rounded-full bg-orange-500 p-4 text-white shadow-lg transition-all hover:bg-orange-600"
      >
        <Megaphone size={24} />
      </button>

      {/* Create Announcement Button - Only visible for Admin or Creator */}
      {(userRole === "Admin" || userRole === "Creator") && (
        <button
          onClick={handleCreateAnnouncement}
          className="fixed right-10 bottom-24 z-50 rounded-full bg-blue-500 p-4 text-white shadow-lg transition-all hover:bg-blue-600"
        >
          Create Announcement
        </button>
      )}

      {/* Modal for Viewing Announcements */}
      {isOpen && (
        <Modal
          announcements={announcements}
          onClose={() => setIsOpen(false)}
          isCreateModal={false} // Passing false for viewing announcements
        />
      )}

      {/* Modal for Creating Announcement */}
      {isCreateModalOpen && (
        <Modal
          announcements={[]}
          onClose={() => setIsCreateModalOpen(false)}
          isCreateModal={true} // Passing true for creating announcement
        />
      )}
    </>
  );
};

export default AnnouncementFloatingButton;
