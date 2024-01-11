
import Routes from "./Routes";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes />
      </ThemeProvider>
  );
}

export default App;
    
