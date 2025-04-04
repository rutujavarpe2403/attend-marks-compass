
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-3xl font-bold text-edu-blue">EduTrack</h1>
        <p className="text-lg text-muted-foreground">
          Student Attendance & Marks Management System
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
