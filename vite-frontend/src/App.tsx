 //   return (
//     <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
//        <Header />
//     <Routes>
//     <Route path="/login" element={<Login />} />
//     <Route path="/register" element={<Register />} />
//     <Route path="/profile" element={<Profile />} />
//     <Route path="/" element={<Home />} />
//     <Route path="recipes/new" element={<AddRecipe />} />
//   </Routes>
//   <Footer />
//   </ThemeProvider>
// );
// }
    
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
    
