import { AuthProvider } from "./contexts/AuthContext";
import { StudyProvider } from "./contexts/StudyContext";
import AppRouter from "./components/Routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <StudyProvider>
        <AppRouter />
      </StudyProvider>
    </AuthProvider>
  );
}

export default App;