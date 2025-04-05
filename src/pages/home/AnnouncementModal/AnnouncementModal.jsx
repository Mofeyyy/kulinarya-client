import { useState } from "react";
import useCreateAnnouncement from "@/hooks/mutations/useCreateAnnouncement"; // Import the hook
import useAuthStore from "@/hooks/stores/useAuthStore";
import useActiveAnnouncements from "@/hooks/queries/useAnnouncements";
import AnnouncementListView from "./views/AnnouncementListView";
import AnnouncementCreateView from "./views/AnnouncementCreateView";
import AnnouncementFullView from "./views/AnnouncementFullView";
import { useQueryClient } from "@tanstack/react-query";

const AnnouncementModal = ({ onClose }) => {
  const { userDetails } = useAuthStore();
  const canCreate = userDetails?.role === "admin" || userDetails?.role === "creator";

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showListModal, setShowListModal] = useState(true);
  const [ setIsSubmitting] = useState(false);

  const { data: announcements = [], refetch } = useActiveAnnouncements();

  const { mutate: createAnnouncement } = useCreateAnnouncement();

  const queryClient = useQueryClient();

const handleFormSubmit = async (data) => {
  setIsSubmitting(true);

  try {
    const response = await createAnnouncement(data);
    console.log("Announcement created:", response);

    // Invalidate the 'activeAnnouncements' query cache to force a refetch
    queryClient.invalidateQueries(["activeAnnouncements"]);

    setIsSubmitting(false);
    setIsCreateOpen(false);
    setShowListModal(true); // Go back to the list view
  } catch (error) {
    console.error("Error creating announcement: ", error);
    setIsSubmitting(false);
  }
};
  

  return (
    <>
      {showListModal && !isCreateOpen && !selectedAnnouncement && (
        <AnnouncementListView
          announcements={announcements}
          canCreate={canCreate}
          onClose={onClose}
          onCreateClick={() => {
            setIsCreateOpen(true);
            setShowListModal(false);
          }}
          onItemClick={(announcement) => {
            setSelectedAnnouncement(announcement);
            setShowListModal(false);
          }}
        />
      )}

      {isCreateOpen && (
        <AnnouncementCreateView
          title={title}
          content={content}
          onChangeTitle={(e) => setTitle(e.target.value)}
          onChangeContent={(e) => setContent(e.target.value)}
          onSubmit={handleFormSubmit} // Pass handleFormSubmit as onSubmit
          onClose={() => {
            setIsCreateOpen(false);
            setShowListModal(true);
          }}
        />
      )}

      {selectedAnnouncement && (
        <AnnouncementFullView
          announcement={selectedAnnouncement}
          onClose={() => {
            setSelectedAnnouncement(null);
            setShowListModal(true);
          }}
        />
      )}
    </>
  );
};

export default AnnouncementModal;
