
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LoginForm = () => {
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("student");
  const [loginFormError, setLoginFormError] = useState("");

  // Registration state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("teacher");
  const [registerFormError, setRegisterFormError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFormError("");

    if (!loginEmail || !loginPassword) {
      setLoginFormError("Email and password are required");
      return;
    }

    try {
      await login(loginEmail, loginPassword, loginRole);
      navigate("/dashboard");
    } catch (error) {
      setLoginFormError((error as Error).message || "Login failed");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterFormError("");

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterFormError("All fields are required");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterFormError("Passwords do not match");
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterFormError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(registerEmail, registerPassword, registerName, registerRole);
      navigate("/dashboard");
    } catch (error) {
      setRegisterFormError((error as Error).message || "Registration failed");
    }
  };

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <Tabs defaultValue="login" className="w-full">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <TabsList>
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="login">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </TabsContent>
          
          <TabsContent value="register">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Register as a teacher to manage students and classes
            </CardDescription>
          </TabsContent>
        </CardHeader>

        <CardContent>
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginFormError && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {loginFormError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@school.edu"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <RadioGroup 
                  defaultValue="student" 
                  value={loginRole}
                  onValueChange={setLoginRole}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="login-student" />
                    <Label htmlFor="login-student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="login-teacher" />
                    <Label htmlFor="login-teacher">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                Demo accounts:
                <br />
                Teacher: teacher@school.edu / password
                <br />
                Student: student@school.edu / password
              </p>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {registerFormError && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {registerFormError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Smith"
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="email@school.edu"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  required
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-600">
                Note: Only teachers can register for now. Students will be added by teachers.
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
