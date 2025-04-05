import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { FileText } from "lucide-react";

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Helvetica",
    backgroundColor: "#fafafa", // soft neutral background
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#e67e22", // orange accent
  },
  sectionContainer: {
    marginBottom: 15,
    padding: 14,
    borderRadius: 10,
    border: "1px solid #ddd", // subtle gray border
    backgroundColor: "#ffffff", // clean white section
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2c3e50", // dark neutral text
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  statBox: {
    width: "30%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9", // light gray background
    textAlign: "center",
    marginBottom: 10,
    border: "1px solid #eaeaea",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e67e22", // orange accent for value
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d", // soft grey for labels
  },
});

  

const AnalyticsPDF = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}> Site Analytics Report</Text>

        {/* Total Site Visits */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}> Total Site Visits</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}> User Visits</Text>
              <Text style={styles.statValue}>{data.userVisits}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}> Guest Visits</Text>
              <Text style={styles.statValue}>{data.guestVisits}</Text>
            </View>
          </View>
        </View>

        {/* Total Recipe Post Views */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}> Total Recipe Post Views</Text>
          <Text style={[styles.statValue, { textAlign: "center" }]}>{data.totalPostViews}</Text>
        </View>

        {/* Total Comments */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}> Total Comments</Text>
          <Text style={[styles.statValue, { textAlign: "center" }]}>{data.totalComments}</Text>
        </View>

        {/* Total Reactions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}> Total Reactions</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}> Heart</Text>
              <Text style={styles.statValue}>{data.heart}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}> Drool</Text>
              <Text style={styles.statValue}>{data.drool}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}> Neutral</Text>
              <Text style={styles.statValue}>{data.neutral}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Download Button Component
const PrintAnalytics = ({ data }) => {
  return (
    <PDFDownloadLink document={<AnalyticsPDF data={data} />} fileName="analytics-report.pdf">
      {({ loading }) =>
        loading ? (
          <button className="px-4 py-2 bg-gray-400 text-white rounded-md">Loading...</button>
        ) : (
          <button className="px-4 py-2 bg-orange-500 text-white rounded-md flex items-center gap-2">
            <FileText size={18} /> Download PDF
          </button>
        )
      }
    </PDFDownloadLink>
  );
};

export default PrintAnalytics;
