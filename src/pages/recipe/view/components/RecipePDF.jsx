import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Create styles for the PDF
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
    color: "#D97706", // Warm orange
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#9A3412", // Darker orange
    textDecoration: "underline",
  },
  section: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#FDE68A", // Light orange border
    borderRadius: 8,
    backgroundColor: "#FFEDD5", // Soft orange background
  },
  contentText: {
    fontSize: 14,
    color: "#7C2D12", // Dark brown-orange
    marginLeft: 10,
    marginBottom: 4, // Reduced spacing
    lineHeight: 1.3,
  },

  contentText1: {
    fontSize: 14,
    color: "#7C2D12", // Dark brown-orange
    marginLeft: 10,
    marginBottom: 4, // Reduced spacing
    lineHeight: 1.5,
  },

  image: {
    width: "100%",
    height: 180,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FB923C", // Medium orange border
    borderRadius: 10,
  },
});

const RecipePDF = ({ recipe }) => {
  // Check if recipe is defined
  if (!recipe) {
    return <Text style={{ color: "red", textAlign: "center" }}>Recipe data is not available.</Text>;
  }

  // Set the document title in the browser's tab
  document.title = recipe.title;

  return (
    <Document>
      <Page style={{ padding: 20, backgroundColor: "#FFF7ED" }}> {/* Soft warm background */}
        {/* Title */}
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Image */}
        {/*recipe.mainPictureUrl && <Image style={styles.image} src={recipe.mainPictureUrl} />*/}

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.contentText}>
              • {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </Text>
          ))}
        </View>

        {/* Procedure Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Procedure:</Text>
          {recipe.procedure.map((step, index) => (
            <Text key={index} style={styles.contentText1}>
              <Text style={{ fontWeight: "bold" }}>Step {step.stepNumber}:</Text> {step.content}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default RecipePDF;
