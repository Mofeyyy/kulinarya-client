import { useState } from "react";
import useCreateAnnouncement from "../../../../hooks/mutations/useCreateAnnouncement"; 
import AnnouncementForm from "../form/AnnouncementForm"; 
import ModalWrapper from "../ui/ModalWrapper";

const AnnouncementCreateView = ({ onClose, onAnnouncementCreated }) => {
  const { mutate: createAnnouncement, isLoading } = useCreateAnnouncement();
  const [successMessage, setSuccessMessage] = useState("");
  const [ setIsSubmitting] = useState(false);

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
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        ✍️ Create Announcement
      </h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded-md">
          {successMessage}
        </div>
      )}

      <AnnouncementForm onSubmit={handleSubmit} />
    </ModalWrapper>
  );
};


export default AnnouncementCreateView;
