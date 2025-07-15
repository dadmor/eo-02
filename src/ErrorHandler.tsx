import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner"; // lub inny system powiadomień

export const ErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sprawdź błędy w hash tylko na stronie głównej
    if (location.pathname === '/' && location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const error = hashParams.get('error');
      const errorCode = hashParams.get('error_code');
      const errorDescription = hashParams.get('error_description');

      if (error) {
        let message = "An error occurred";
        
        switch (errorCode) {
          case 'otp_expired':
            message = "Password reset link has expired. Please request a new one.";
            break;
          case 'invalid_request':
            message = "Invalid request. Please try again.";
            break;
          case 'user_not_found':
            message = "User not found.";
            break;
          default:
            message = errorDescription?.replace(/\+/g, ' ') || error;
        }

        // Pokaż błąd
        toast.error(message);
        
        // Wyczyść hash z URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Przekieruj do logowania
        navigate("/login");
      }
    }
  }, [location, navigate]);

  return <>{children}</>;
};