import "./App.css";
import AuthProvider from "./state-management/auth/AuthProvider";
import Counter from "./state-management/counter/Counter";
import NavBar from "./state-management/NavBar";
import { TaskList, TasksProvider } from "./state-management/task";

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <Counter/>
        <NavBar />
        <TaskList />
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
