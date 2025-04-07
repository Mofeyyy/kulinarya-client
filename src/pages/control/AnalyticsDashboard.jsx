import { useEffect, useState } from "react";
import API from "@/config/axios";
import PrintAnalytics from "./PrintAnalytics";
import { Eye, MessageSquare, Heart, BarChart2 } from "lucide-react";

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    totalVisits: 0,
    totalPostViews: 0,
    totalComments: 0,
    heart: 0,
    drool: 0,
    neutral: 0,
    userVisits: 0,
    guestVisits: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitsRes, viewsRes, commentsRes, reactionsRes] = await Promise.all([
          API.get("/platform-visits"),
          API.get("/post-views/top"),
          API.get("/comments/overall-comments"),
          API.get("/reactions/overall-reactions"),
        ]);

        setData({
          userVisits: visitsRes.data.userVisits,
          guestVisits: visitsRes.data.guestVisits,
          totalPostViews: viewsRes.data.totalPostViews,
          totalComments: commentsRes.data.totalComments,
          heart: reactionsRes.data.heart,
          drool: reactionsRes.data.drool,
          neutral: reactionsRes.data.neutral,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        📊 Site Analytics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BarChart2 className="text-orange-400 dark:text-orange-300" size={24} />}
          title="Total Site Visits"
          value={
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-400">
                <span>User:</span> <span className="font-semibold">{data.userVisits}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-400">
                <span>Guest:</span> <span className="font-semibold">{data.guestVisits}</span>
              </div>
            </div>
          }
        />
        <StatCard
          icon={<Eye className="text-orange-400 dark:text-orange-300" size={24} />}
          title="Total Post Views"
          value={<span className="text-gray-900 dark:text-gray-200">{data.totalPostViews}</span>}
        />
        <StatCard
          icon={<MessageSquare className="text-orange-400 dark:text-orange-300" size={24} />}
          title="Total Comments"
          value={<span className="text-gray-900 dark:text-gray-200">{data.totalComments}</span>}
        />
        <StatCard
          icon={<Heart className="text-orange-400 dark:text-orange-300" size={24} />}
          title="Total Reactions"
          value={
            <div className="flex justify-center space-x-4 text-gray-700 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <span>❤️</span> <span className="font-semibold">{data.heart}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🤤</span> <span className="font-semibold">{data.drool}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>😐</span> <span className="font-semibold">{data.neutral}</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Print Button */}
      <div className="mt-6 text-center">
        <PrintAnalytics data={data} />
      </div>
    </div>
  );
};

// Reusable Stat Card with Balanced Styling
const StatCard = ({ icon, title, value }) => (
  <div className="p-4 bg-background rounded-lg shadow-md text-center flex flex-col items-center">
    {/* Orange Accent Icon */}
    <div className="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-700 rounded-lg mb-2">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</div>
  </div>
);

export default AnalyticsDashboard;
