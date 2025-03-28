import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// --------------------------------------------------------

const fetchTopSharers = async () => {
  const response = await handleApiRequest(() => API.get("/users/top-sharers"));

  return response?.topSharers || [];
};

const useTopSharers = () => {
  return useQuery({
    queryKey: ["topSharers"],
    queryFn: fetchTopSharers,
    retry: 3,
  });
};

export default useTopSharers;
