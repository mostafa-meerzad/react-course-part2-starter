import { useReducer } from "react";
import "./App.css";
import AuthProvider from "./state-management/AuthProvider";
import NavBar from "./state-management/NavBar";
import TaskList from "./state-management/TaskList";
import TasksContext from "./state-management/context/tasksContext";
import taskReducer from "./state-management/reducers/taskReducer";

function App() {
  const [tasks, taskDispatch] = useReducer(taskReducer, []);

  return (
    <AuthProvider>
      <TasksContext.Provider value={{ tasks, dispatch: taskDispatch }}>
        <NavBar />
        <TaskList />
      </TasksContext.Provider>
    </AuthProvider>
  );
}

export default App;
