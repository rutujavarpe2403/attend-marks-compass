
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";

interface AttendanceRecord {
  date: string;
  morning?: boolean;
  afternoon?: boolean;
  evening?: boolean;
  [key: string]: any;
}

interface MarksRecord {
  subject_id: string;
  marks: number;
  exam_type: string;
  student_id?: string;
}

export const useReportsData = () => {
  const [reportType, setReportType] = useState("attendance");
  const [period, setPeriod] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    summary: { present: 0, absent: 0, percentage: 0 },
    byDate: [] as { date: string; present: number; absent: number; total: number }[],
  });
  const [marksData, setMarksData] = useState({
    bySubject: [] as { subject: string; average: number }[],
    byExamType: [] as { name: string; value: number; color: string }[]
  });

  const fetchAttendanceData = async (timePeriod: string) => {
    try {
      setIsLoading(true);
      
      // Calculate date range based on selected period
      const today = new Date();
      let fromDate;
      let toDate = today;
      
      switch (timePeriod) {
        case "weekly":
          fromDate = startOfWeek(today);
          toDate = endOfWeek(today);
          break;
        case "monthly":
          fromDate = startOfMonth(today);
          toDate = endOfMonth(today);
          break;
        case "yearly":
          fromDate = new Date(today.getFullYear(), 0, 1);
          toDate = new Date(today.getFullYear(), 11, 31);
          break;
        default:
          fromDate = subDays(today, 30);
          break;
      }
      
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .gte("date", format(fromDate, "yyyy-MM-dd"))
        .lte("date", format(toDate, "yyyy-MM-dd"));
        
      if (error) throw error;
      
      if (data) {
        // Process attendance data
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalSessions = 0;
        
        // Aggregate attendance by date
        const byDate = (data as AttendanceRecord[]).reduce((acc, record) => {
          const date = record.date;
          
          if (!acc[date]) {
            acc[date] = {
              date,
              present: 0,
              absent: 0,
              total: 0,
            };
          }
          
          // Each record has morning, afternoon, evening sessions
          const sessions = ['morning', 'afternoon', 'evening'];
          sessions.forEach(session => {
            acc[date].total += 1;
            totalSessions += 1;
            
            if (record[session]) {
              acc[date].present += 1;
              totalPresent += 1;
            } else {
              acc[date].absent += 1;
              totalAbsent += 1;
            }
          });
          
          return acc;
        }, {} as Record<string, { date: string; present: number; absent: number; total: number }>);
        
        const byDateArray = Object.values(byDate).sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setAttendanceData({
          summary: {
            present: totalPresent,
            absent: totalAbsent,
            percentage: totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0,
          },
          byDate: byDateArray,
        });
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Failed to fetch attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarksData = async (timePeriod: string) => {
    try {
      setIsLoading(true);
      
      // Calculate date range based on selected period
      const today = new Date();
      let fromDate;
      let toDate = today;
      
      switch (timePeriod) {
        case "weekly":
          fromDate = startOfWeek(today);
          toDate = endOfWeek(today);
          break;
        case "monthly":
          fromDate = startOfMonth(today);
          toDate = endOfMonth(today);
          break;
        case "yearly":
          fromDate = new Date(today.getFullYear(), 0, 1);
          toDate = new Date(today.getFullYear(), 11, 31);
          break;
        default:
          fromDate = subDays(today, 30);
          break;
      }
      
      const { data, error } = await supabase
        .from("marks")
        .select("*")
        .gte("created_at", format(fromDate, "yyyy-MM-dd"))
        .lte("created_at", format(toDate, "yyyy-MM-dd"));
        
      if (error) throw error;
      
      if (data) {
        // Process marks data by subject
        const subjectMap = {} as Record<string, { total: number; count: number }>;
        const examTypeMap = {} as Record<string, number>;
        
        (data as MarksRecord[]).forEach(record => {
          // Process by subject
          if (!subjectMap[record.subject_id]) {
            subjectMap[record.subject_id] = { total: 0, count: 0 };
          }
          subjectMap[record.subject_id].total += record.marks;
          subjectMap[record.subject_id].count += 1;
          
          // Process by exam type
          if (!examTypeMap[record.exam_type]) {
            examTypeMap[record.exam_type] = 0;
          }
          examTypeMap[record.exam_type] += 1;
        });
        
        // Convert to array format for charts
        const bySubject = Object.entries(subjectMap).map(([subject, data]) => ({
          subject,
          average: Math.round(data.total / data.count),
        }));
        
        // Define colors for pie chart
        const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
        
        const byExamType = Object.entries(examTypeMap).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length],
        }));
        
        setMarksData({
          bySubject,
          byExamType,
        });
      }
    } catch (error) {
      console.error("Error fetching marks data:", error);
      toast.error("Failed to fetch marks data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (reportType === "attendance") {
      fetchAttendanceData(period);
    } else if (reportType === "marks") {
      fetchMarksData(period);
    }
    toast.success(`Generated ${reportType} report for ${period} period`);
  };

  const handleDownloadReport = () => {
    let csvContent = "";
    let filename = "";
    
    if (reportType === "attendance") {
      // Create attendance CSV
      csvContent = "Date,Present,Absent,Total\n";
      attendanceData.byDate.forEach(day => {
        csvContent += `${day.date},${day.present},${day.absent},${day.total}\n`;
      });
      filename = `attendance_report_${period}_${format(new Date(), 'yyyyMMdd')}.csv`;
    } else {
      // Create marks CSV
      csvContent = "Subject,Average Marks\n";
      marksData.bySubject.forEach(subject => {
        csvContent += `${subject.subject},${subject.average}\n`;
      });
      filename = `marks_report_${period}_${format(new Date(), 'yyyyMMdd')}.csv`;
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success(`Downloaded ${reportType} report`);
  };

  return {
    reportType,
    setReportType,
    period,
    setPeriod,
    isLoading,
    attendanceData,
    marksData,
    handleGenerateReport,
    handleDownloadReport,
  };
};
