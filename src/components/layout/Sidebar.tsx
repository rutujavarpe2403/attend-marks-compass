import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  CalendarDays, 
  ChevronLeft, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  User, 
  Users 
} from "lucide-react";

type SidebarProps = {
  isMobile: boolean;
  toggleSidebar: () => void;
};

export const Sidebar = ({ isMobile, toggleSidebar }: SidebarProps) => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    await logout();
  };

  const teacherNavItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Users size={20} />,
      label: "Students",
      href: "/students",
    },
    {
      icon: <CalendarDays size={20} />,
      label: "Attendance",
      href: "/attendance",
    },
    {
      icon: <BookOpen size={20} />,
      label: "Marks",
      href: "/marks",
    },
    {
      icon: <FileText size={20} />,
      label: "Reports",
      href: "/reports",
    },
  ];

  const studentNavItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <CalendarDays size={20} />,
      label: "Attendance",
      href: "/attendance",
    },
    {
      icon: <BookOpen size={20} />,
      label: "Marks",
      href: "/marks",
    },
  ];

  const navItems = profile?.role === "teacher" ? teacherNavItems : studentNavItems;

  return (
    <div
      className={cn(
        "h-full bg-sidebar transition-all duration-300 border-r flex flex-col",
        isCollapsed ? "w-[70px]" : "w-[250px]",
        isMobile && "absolute z-50 shadow-xl"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b h-[60px]">
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="text-lg font-semibold text-edu-blue ml-1">EduTrack</span>
          </div>
        )}
        <div className="flex ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={isMobile ? toggleSidebar : toggleCollapse}
            className="h-8 w-8"
          >
            {isMobile ? (
              <Menu size={18} />
            ) : isCollapsed ? (
              <Menu size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </Button>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col flex-1 py-4 overflow-y-auto scrollbar-hide">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center py-2 px-3 rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  isCollapsed && "justify-center"
                )
              }
            >
              <span className="flex items-center justify-center">
                {item.icon}
              </span>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Profile */}
      <div className="mt-auto border-t p-4">
        <div className="flex items-center">
          <div
            className={cn(
              "flex items-center flex-1",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User size={16} />
            </div>
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {profile?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {profile?.role || "Role"}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 ml-2"
              title="Logout"
            >
              <LogOut size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
