import { useMutation } from "@tanstack/react-query";
import API from "@/config/axios"; // Adjust the path as needed
import handleApiRequest from "@/utils/handleApiRequest"; // Adjust the path as needed

const createAnnouncement = async (announcementData) => {
  try {
    const response = await handleApiRequest(() =>
      API.post("/announcements/create", announcementData, {})
    );
    console.log("Announcement Created: ", response);
    return response;
  } catch (error) {
    console.error("Error creating announcement: ", error);
    throw error; // Make sure to throw the error so react-query can handle it
  }
};

const useCreateAnnouncement = () => {
  return useMutation({
    mutationFn: createAnnouncement,
  });
};

export default useCreateAnnouncement;
