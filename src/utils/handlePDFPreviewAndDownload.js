import { pdf } from "@react-pdf/renderer";
import RecipePDF from "./RecipePDF"; // Ensure correct import

/**
 * Handles the preview of the PDF in a new tab and starts the download.
 * @param {Object} recipe - The recipe object to generate the PDF from.
 */
const handlePDFPreviewAndDownload = async (recipe) => {
  try {
    if (!recipe || !recipe.title) {
      console.error("Invalid recipe data.");
      return;
    }

    // Generate the PDF blob
    const pdfBlob = await pdf(<RecipePDF recipe={recipe} />).toBlob();

    // Sanitize the recipe title to remove invalid filename characters
    const sanitizedTitle = recipe.title.replace(/[\/\\:*?"<>|]/g, "").trim() || "Recipe";

    // Create a Blob URL for the generated PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open the generated PDF in a new tab for preview
    window.open(pdfUrl, "_blank");

    // Create a download link and trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = pdfUrl;
    downloadLink.download = `${sanitizedTitle}.pdf`; // Set the correct file name
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Revoke the URL after some time to free memory
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 500);
  } catch (error) {
    console.error("Error generating or downloading the PDF:", error);
  }
};

export default handlePDFPreviewAndDownload;
