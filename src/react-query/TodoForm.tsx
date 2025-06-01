import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";

interface AddTodoContext {
  previousTodos?: Todo[];
}

const TodoForm = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);
  const addTodo = useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: async (todo: Todo) => {
      const res = await axios.post<Todo>(
        "https://jsonplaceholder.typicode.com/todosx",
        todo
      );
      return res.data;
    },
    onMutate: (newTodo: Todo) => {
      //1. let's call "variables" to newTodo
      //2. now we need to update the cache
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]); // now we have all our todos before getting updated

      queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
        newTodo,
        ...(todos || []),
      ]);

      if (ref.current) ref.current.value = "";

      return { previousTodos };
    },
    onSuccess: (savedTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(["todos"], (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
      );
    },
    // here the context is still "unknown" and we need to provide it's type in the generic section
    onError: (error, newTodo, context) => {
      if (!context) return;
      queryClient.setQueryData(["todos"], context.previousTodos);
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
