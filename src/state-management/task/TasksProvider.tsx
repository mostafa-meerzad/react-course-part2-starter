import React, { ReactNode, useReducer } from "react";
import TasksContext from "./tasksContext";

export interface Task {
  id: number;
  title: string;
}

interface Add {
  type: "ADD";
  task: Task;
}

interface Delete {
  type: "Delete";
  taskId: number;
}

export type TaskAction = Add | Delete;

const taskReducer = (tasks: Task[], action: TaskAction) => {
  switch (action.type) {
    case "ADD":
      return [...tasks, action.task];
    case "Delete":
      return tasks.filter((task) => task.id !== action.taskId);
    default:
      return tasks;
  }
};

interface Props {
  children: ReactNode;
}

const TasksProvider = ({ children }: Props) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  return (
    <TasksContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};

export default TasksProvider;
