import { useState } from "react";
import useCreateAnnouncement from "../../../../hooks/mutations/useCreateAnnouncement"; 
import AnnouncementForm from "../form/AnnouncementForm"; 
import ModalWrapper from "../ui/ModalWrapper";

const AnnouncementCreateView = ({ onClose, onAnnouncementCreated }) => {
  const { mutate: createAnnouncement, isLoading } = useCreateAnnouncement();
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data) => {
    setIsSubmitting(true);

    createAnnouncement(data, {
      onSuccess: (newAnnouncement) => {
        setSuccessMessage("Announcement successfully posted!");
        setTimeout(() => {
          if (typeof onAnnouncementCreated === "function") {
            onAnnouncementCreated(newAnnouncement); 
          }
          // Close the modal after the success message is shown
          onClose();
        }, 2000); 
      },
      onError: (error) => {
        console.error("Error creating announcement: ", error);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="p-6 space-y-6 bg-background  rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          ✍️ Create Announcement
        </h2>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 mb-6 rounded-md shadow-sm dark:bg-green-800 dark:text-green-300">
            {successMessage}
          </div>
        )}

        <AnnouncementForm onSubmit={handleSubmit} />
      </div>
    </ModalWrapper>
  );
};

export default AnnouncementCreateView;
