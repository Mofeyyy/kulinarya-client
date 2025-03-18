import axios from "axios";
import handleApiRequest from "@/utils/handleApiRequest";
import { useQuery } from "@tanstack/react-query";
import provinces from "@/data/provinces.json";

// ----------------------------------------------------------------

const fetchProvinces = () => provinces;

const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Cache provinces forever since it's static data
    cacheTime: Infinity, // Avoid unnecessary re-fetch
  });
};

export default useProvinces;
