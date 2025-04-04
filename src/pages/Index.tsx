
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-edu-light-blue to-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-edu-blue tracking-tight mb-4">
          Student Attendance & Marks Management System
        </h1>
        <p className="text-xl text-edu-dark-gray max-w-3xl mb-8">
          A comprehensive solution for educational institutions to efficiently manage attendance and academic records.
        </p>
        <Button 
          size="lg"
          className="text-lg px-8"
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>
      </div>

      {/* Features */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <div className="p-3 bg-edu-light-blue rounded-full mb-4">
                <Layers className="h-8 w-8 text-edu-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Attendance Tracking</h3>
              <p className="text-edu-dark-gray">
                Efficiently track student attendance with real-time reporting and analytics.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <div className="p-3 bg-edu-light-blue rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-edu-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Marks Management</h3>
              <p className="text-edu-dark-gray">
                Record, analyze and report student academic performance across subjects.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <div className="p-3 bg-edu-light-blue rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-edu-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Role-Based Access</h3>
              <p className="text-edu-dark-gray">
                Secure access for teachers and students with appropriate permissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-12 px-4 bg-edu-light-blue">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to streamline your academic management?</h2>
          <p className="text-edu-dark-gray mb-8">
            Join educational institutions worldwide that use our system to simplify attendance tracking and marks management.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-edu-dark-gray">
            Student Attendance & Marks Management System © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
