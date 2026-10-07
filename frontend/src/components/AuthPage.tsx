import { useState } from "react";
import logo from '../../assets/logo.png';

interface AuthResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

interface AuthPageProps {
  onLogin: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  onRegister: (
    username: string,
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<AuthResult>;
  onForgotPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  onMessage: (type: "success" | "error", text: string) => void;
}

type AuthView = "login" | "register" | "forgot";

export function AuthPage({ onLogin, onRegister, onForgotPassword, onMessage }: AuthPageProps) {
  const [view, setView] = useState<AuthView>("login");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (view === "login") {
      const result = await onLogin(formData.username, formData.password);
      if (!result.success) {
        setError(result.error || "Login failed");
      }
    } else if (view === "register") {
      const result = await onRegister(
        formData.username,
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      if (result.success) {
        onMessage("success", "Account created successfully. Please log in.");
        setView("login");
        setFormData({
          username: "",
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setError(result.error || "Registration failed");
        if (result.fieldErrors) {
          const fe: Record<string, string> = {};
          Object.entries(result.fieldErrors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              fe[key] = value[0] as string;
            }
          });
          setFieldErrors(fe);
        }
      }
    } else if (view === "forgot") {
      const result = await onForgotPassword(formData.email);
      if (result.success) {
        onMessage("success", "Password reset email sent successfully!");
        setView("login");
      } else {
        setError(result.error || "Failed to send reset link");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="LinkedInk AI"
            className="w-16 h-16 rounded-2xl mb-3"
          />
          <h1 className="text-gray-900 text-center">LinkedInk AI</h1>
          <p className="text-gray-600 text-sm text-center mt-1">
            Generate LinkedIn posts in your voice
          </p>
        </div>

        {/* Hide Top tabs when viewing forgot password request view */}
        {view !== "forgot" && (
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setView("login");
                setError("");
                setFieldErrors({});
              }}
              className={`flex-1 py-2 rounded-md transition-all ${
                view === "login"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setView("register");
                setError("");
                setFieldErrors({});
              }}
              className={`flex-1 py-2 rounded-md transition-all ${
                view === "register"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Create account
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-gray-900 mb-4">
            {view === "login" && "Log in to LinkedInk AI"}
            {view === "register" && "Create your LinkedInk AI account"}
            {view === "forgot" && "Reset your password"}
          </h2>

          {view !== "forgot" && (
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Panda"
              />
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.username}
                </p>
              )}
            </div>
          )}

          {view === "register" && (
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={view === "register"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Umanshi Gupta"
              />
            </div>
          )}

          {(view === "register" || view === "forgot") && (
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Panda@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          )}

          {view !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                {view === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError("");
                      setFieldErrors({});
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>
          )}

          {view === "register" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 mb-2"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={view === "register"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
          >
            {view === "login" && "Log in"}
            {view === "register" && "Sign up"}
            {view === "forgot" && "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            {view === "login" && (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="text-blue-600 hover:underline"
                >
                  Create an account
                </button>
              </>
            )}
            {view === "register" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-blue-600 hover:underline"
                >
                  Log in
                </button>
              </>
            )}
            {view === "forgot" && (
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-blue-600 hover:underline font-medium"
              >
                Back to Log in
              </button>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}