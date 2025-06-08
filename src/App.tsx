import "./App.css";
import AuthProvider from "./state-management/AuthProvider";
import NavBar from "./state-management/NavBar";
import TaskList from "./state-management/TaskList";
import TasksProvider from "./state-management/TasksProvider";

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
