import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";

const TodoForm = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);
  const addTodo = useMutation<Todo, Error, Todo>({
    mutationFn: async (todo: Todo) => {
      const res = await axios.post<Todo>(
        "https://jsonplaceholder.typicode.com/todos",
        todo
      );
      return res.data;
    },
    onSuccess: (savedTodos, newTodo) => {
      // console.log("success! got data back: ", data);
      // queryClient.invalidateQueries({queryKey: ["todos"]});

      queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
        savedTodos,
        ...(todos || []),
      ]);

      if (ref.current) ref.current.value = "";
    },
    onError: (error: Error) => {
      console.log("something went wrong: ", error.message);
    },
    onSettled: () => {
      console.log("reached the end of mutation");
    },
  });

  return (
    <>
      {addTodo.error && (
        <div className="alert alert-danger">{addTodo.error?.message}</div>
      )}
      <form
        className="row mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (ref.current && ref.current.value)
            addTodo.mutate({
              id: 0,
              completed: true,
              title: ref.current.value, // if ref.current is null this expression would be undefined as the result
              userId: 1,
            });
        }}
      >
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          <button className="btn btn-primary" disabled={addTodo.isLoading}>
            {addTodo.isLoading ? "...loading" : "Add"}
          </button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
