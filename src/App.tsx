import { useReducer } from "react";
import "./App.css";
import NavBar from "./state-management/NavBar";
import TaskList from "./state-management/TaskList";
import TasksContext from "./state-management/context/tasksContext";
import taskReducer from "./state-management/reducers/taskReducer";

function App() {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  return (
    <TasksContext.Provider value={{ tasks, dispatch }}>
      <NavBar />
      <TaskList />
    </TasksContext.Provider>
  );
}

export default App;
