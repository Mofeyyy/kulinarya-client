import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// Function to fetch active announcements
const fetchActiveAnnouncements = async () => {
  const response = await handleApiRequest(() =>
    API.get("/announcements/activeAnnouncements")
  );
  
  return response?.announcements?.slice(0, 5) || [];
};

// Custom hook to use active announcements
const useActiveAnnouncements = () => {
  return useQuery({
    queryKey: ["activeAnnouncements"],
    queryFn: fetchActiveAnnouncements,
    retry: 3,
  });
};

export default useActiveAnnouncements;
