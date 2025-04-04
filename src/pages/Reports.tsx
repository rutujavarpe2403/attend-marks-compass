
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";

const Reports = () => {
  const [reportType, setReportType] = useState("attendance");
  const [period, setPeriod] = useState("monthly");
  
  const handleGenerateReport = () => {
    toast.success(`Generated ${reportType} report for ${period} period`);
  };

  const handleDownloadReport = () => {
    toast.success(`Downloaded ${reportType} report`);
  };

  const handlePrintReport = () => {
    toast.success(`Printing ${reportType} report`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and export attendance and marks reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Generator
            </CardTitle>
            <CardDescription>
              Generate various reports based on your requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="type">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance Report</SelectItem>
                  <SelectItem value="marks">Marks Report</SelectItem>
                  <SelectItem value="performance">Performance Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="period">
                Time Period
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Recent Reports
            </CardTitle>
            <CardDescription>
              Your recently generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="attendance" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="attendance" className="flex-1">Attendance</TabsTrigger>
                <TabsTrigger value="marks" className="flex-1">Marks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="attendance" className="mt-4">
                <ul className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">Monthly Attendance Report</p>
                        <p className="text-xs text-muted-foreground">Generated 2025-04-0{i}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={handlePrintReport}>
                          <Printer className="h-4 w-4" />
                          <span className="sr-only">Print</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownloadReport}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="marks" className="mt-4">
                <ul className="space-y-3">
                  {[1, 2].map((i) => (
                    <li key={i} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">Midterm Marks Report</p>
                        <p className="text-xs text-muted-foreground">Generated 2025-03-2{i}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={handlePrintReport}>
                          <Printer className="h-4 w-4" />
                          <span className="sr-only">Print</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownloadReport}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>
            Pre-designed report templates for various purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {["Student Performance Report", "Class Attendance Summary", "Exam Analysis Report"].map((template) => (
              <Card key={template} className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-sm font-medium">{template}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Comprehensive {template.toLowerCase()}
                    </p>
                    <Button size="sm" variant="outline" className="mt-4">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
