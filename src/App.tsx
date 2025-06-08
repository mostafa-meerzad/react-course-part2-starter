import { useReducer } from "react";
import "./App.css";
import NavBar from "./state-management/NavBar";
import TaskList from "./state-management/TaskList";
import TasksContext from "./state-management/context/tasksContext";
import taskReducer from "./state-management/reducers/taskReducer";
import AuthContext from "./state-management/context/authContext";
import authReducer from "./state-management/reducers/authReducer";

function App() {
  const [tasks, taskDispatch] = useReducer(taskReducer, []);
    const [user, authDispatch] = useReducer(authReducer, "");
 
  return (
    <AuthContext.Provider value={{user, dispatch: authDispatch}}>

    <TasksContext.Provider value={{ tasks, dispatch:taskDispatch }}>
      <NavBar />
      <TaskList />
    </TasksContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
