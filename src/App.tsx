import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardShell } from "./features/dashboard/DashboardShell";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <DashboardShell /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
