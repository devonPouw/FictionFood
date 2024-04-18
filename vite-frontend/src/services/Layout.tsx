import { ThemeProvider } from "@/components/theme-provider";
import ScrollToTop from "./ScrollToTop";
import { AuthProvider } from "./auth/AuthContext";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Outlet />
        <ScrollToTop />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
