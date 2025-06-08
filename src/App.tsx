import "./App.css";
import AuthProvider from "./state-management/AuthProvider";
import NavBar from "./state-management/NavBar";
import { TaskList, TasksProvider } from "./state-management/task";

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <NavBar />
        <TaskList />
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
