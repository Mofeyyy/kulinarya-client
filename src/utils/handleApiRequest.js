const handleApiRequest = async (fn) => {
  try {
    const response = await fn();
    return response.data;
  } catch (error) {
    console.error(
      "API Error:",
      error?.response?.data?.message || "Something went wrong"
    );

    if (error.response) {
      // Extract the status and message from the response
      const { data } = error.response;

      // Throw the response data or a custom error message
      throw data || new Error("An unexpected error occurred");
    } else if (error.request) {
      // No response was received (e.g., network error)
      throw new Error("Network error, please try again.");
    } else {
      // Something else happened in setting up the request
      throw new Error(error.message);
    }
  }
};

export default handleApiRequest;