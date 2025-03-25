const convertToFormData = (formValues) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(formValues)) {
    if (value === undefined || value === null) continue; // Skip empty values

    if (Array.isArray(value)) {
      if (key === "additionalPictures") {
        const urls = [];
        const files = [];

        value.forEach((item) => {
          if (item instanceof File) {
            files.push(item); // Collect files
          } else if (typeof item === "string") {
            urls.push(item); // Collect URLs
          }
        });

        // Append existing URLs as a JSON string
        if (urls.length > 0) {
          formData.append("additionalPicturesUrls", JSON.stringify(urls));
        }

        // Append new file uploads
        files.forEach((file) => {
          formData.append("additionalPictures", file);
        });
      } else {
        // Convert other arrays (ingredients, procedure) to JSON string
        formData.append(key, JSON.stringify(value));
      }
    } else if (value instanceof File) {
      formData.append(key, value); // Append single file
    } else {
      formData.append(key, value); // Append text fields
    }
  }

  console.log("Form Data:");
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  return formData;
};

export default convertToFormData;
