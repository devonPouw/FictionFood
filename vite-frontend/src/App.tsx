import AuthProvider from "./services/auth/auth-context";
import Routes from "./Routes";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <AuthProvider>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
    
