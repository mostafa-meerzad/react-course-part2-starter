
 interface Task {
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

type Action = Add | Delete; 

const taskReducer = (tasks: Task[], action: Action) => {

    switch(action.type) {
        case "ADD":
            return [...tasks, action.task]
        case "Delete":
            return tasks.filter(task => task.id !== action.taskId)
        return tasks
    }
}

export default taskReducer