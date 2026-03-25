import { AuthProvider } from "./auth/context/AuthContext";
import AppRouter from "./auth/router/AppRouter";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
