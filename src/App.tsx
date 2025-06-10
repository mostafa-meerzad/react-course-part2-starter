import "./App.css";
import Counter from "./state-management/counter/Counter";
import NavBar from "./state-management/NavBar";
import { TaskList, TasksProvider } from "./state-management/task";

function App() {
  return (
      <TasksProvider>
        <Counter/>
        <NavBar />
        <TaskList />
      </TasksProvider>
  );
}

export default App;
