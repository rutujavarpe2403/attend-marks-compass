
import { useState, useEffect } from "react";
import { fetchDashboardData } from "./DashboardData";
import { TeacherDashboardData } from "./types";

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData>({
    stats: {
      totalStudents: 0,
      attendanceRate: 0,
      averageGrade: 0,
    },
    recentAttendanceData: [],
    recentMarksData: [],
    attendanceBySlot: {
      morning: { present: 0, absent: 0 },
      afternoon: { present: 0, absent: 0 },
      evening: { present: 0, absent: 0 },
    },
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setDashboardData({
          stats: data.stats,
          recentAttendanceData: data.recentAttendanceData,
          recentMarksData: data.recentMarksData,
          attendanceBySlot: data.attendanceBySlot,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  return {
    isLoading,
    ...dashboardData
  };
};
