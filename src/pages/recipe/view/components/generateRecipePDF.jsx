import { pdf } from "@react-pdf/renderer";
import RecipePDF from "./RecipePDF";

/**
 * Generates a PDF, opens it in a new tab for preview, and returns the Blob for download.
 * @param {Object} recipe - The recipe data to include in the PDF.
 * @returns {Blob} - The Blob object for the generated PDF.
 */
const generateRecipePDF = async (recipe) => {
  if (!recipe) {
    console.error("No recipe data available.");
    return;
  }

  // Generate the PDF blob asynchronously
  const blob = await pdf(<RecipePDF recipe={recipe} />).toBlob();

  // Open the generated PDF in a new tab for preview
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");

  // Return the blob so it can be used for downloading
  return blob;
};

export default generateRecipePDF;
