import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Common malicious paths to monitor
  const MALICIOUS_PATTERNS = [
    /(\/wp-admin|\/wp-login\.php)/, // Common WordPress attack paths
    /\.env|\.git|\.htaccess/i, // Sensitive file probes
    /(\/admin|\/administrator|\/backoffice)/i, // Admin panel probes
    /(\/phpmyadmin|\/mysql|\/dbadmin)/i, // Database admin probes
    /(\.\.\/|\.\.%2f)/i, // Directory traversal attempts
    /(\/shell|\/cmd|\/command)/i, // Command injection patterns
    /(\/api\/|\/graphql|\/swagger)/i, // API endpoint probes
    /(SELECT|UNION|DROP|INSERT|DELETE|EXEC)/i // SQL injection patterns
  ];

  useEffect(() => {
    const checkMaliciousAttempt = () => {
      const currentPath = location.pathname.toLowerCase();
      
      // Detect malicious patterns
      const isMalicious = MALICIOUS_PATTERNS.some(pattern => 
        pattern.test(currentPath) || pattern.test(decodeURIComponent(currentPath))
      );

      if (isMalicious) {
        // Log malicious attempt details
        console.error(`🚨 Malicious attempt detected:`, {
          path: location.pathname,
          timestamp: new Date().toISOString(),
          ip: "{{CLIENT_IP}}" // Replace with actual IP from your backend
        });

        // Optional: Send to security logging service
        // logSecurityEvent({ type: 'MALICIOUS_PATH_ATTEMPT', path: location.pathname });

        // Redirect to 404 after short delay
        setTimeout(() => navigate("/", { replace: true }), 3000);
        return;
      }

      // Regular 404 logging
      console.warn(`⚠️ 404 Error for path:`, location.pathname);
    };

    checkMaliciousAttempt();
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <img
          src="/lovable-uploads/404error.png"
          alt="404 Error: Page Not Found"
          className="mx-auto mb-6 max-w-xs rounded-lg shadow-lg"
        />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          Oops! The page you're looking for doesn't exist
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;