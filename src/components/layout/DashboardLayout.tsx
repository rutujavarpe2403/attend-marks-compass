
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const DashboardLayout = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      {showSidebar && <Sidebar isMobile={isMobile} toggleSidebar={toggleSidebar} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <header className="h-[60px] border-b bg-background flex items-center px-4">
          {isMobile && !showSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2"
            >
              <Menu size={20} />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-edu-blue">
            Student Attendance & Marks Management
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/30 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
