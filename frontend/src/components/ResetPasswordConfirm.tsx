import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { authApi } from "../api/client";

interface ResetPasswordConfirmProps {
  onMessage: (type: "success" | "error", text: string) => void;
  onNavigateToAuth: () => void;
}

export function ResetPasswordConfirm({ onMessage, onNavigateToAuth }: ResetPasswordConfirmProps) {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Extract the token from the URL parameter or query string on mount
  useEffect(() => {
    // Option A: If using standard URL query params (?token=xyz)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromQuery = urlParams.get("token");
    
    // Option B: If your path is /reset-password/:token without a router, fallback to pathname split
    const tokenFromPath = window.location.pathname.split("/").pop();

    const finalToken = tokenFromQuery || tokenFromPath || "";
    setToken(finalToken);

    if (!finalToken) {
      setError("Invalid or missing password reset token.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Cannot submit: Missing reset token.");
      return;
    }

    setIsLoading(true);
    try {
      // Execute the password reset confirmation endpoint added to your client.ts
      (authApi as any).confirmPasswordReset(token, password);
      onMessage("success", "Your password has been successfully reset. Please log in.");
      onNavigateToAuth();
    } catch (err: any) {
      const data = err.response?.data || {};
      setError(data.detail || data.password?.[0] || "Failed to reset password. Link may be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="LinkedInk AI"
            className="w-16 h-16 rounded-2xl mb-3"
          />
          <h1 className="text-gray-900 text-center">LinkedInk AI</h1>
          <p className="text-gray-600 text-sm text-center mt-1">
            Create a strong new password for your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-gray-900 mb-4">Set New Password</h2>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              disabled={!token || isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
              required
              disabled={!token || isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={!token || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            <button
              type="button"
              onClick={onNavigateToAuth}
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}