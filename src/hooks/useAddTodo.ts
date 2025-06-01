import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CACHE_KEY_TODOS } from "../react-query/constants";
import APIClient from "../react-query/services/apiClient";
import todoService, { Todo } from "../react-query/services/todoService";

interface AddTodoContext {
  previousTodos?: Todo[];
}

// const apiClient = new APIClient<Todo>("/todos")

export const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn:todoService.post,
    onMutate: (newTodo: Todo) => {
      //1. let's call "variables" to newTodo
      //2. now we need to update the cache
      const previousTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS); // now we have all our todos before getting updated

      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) => [
        newTodo,
        ...(todos || []),
      ]);
      // modifying the ref value here is not ideal and is against Separation of Concerns rule
      // to avoid such thing we can provide a function which the consumer of this hook calls and modifies the ref value as needed
      // by the way this value is piece of UI and we should avoid modifying it here
      //   if (ref.current) ref.current.value = "";
      onAdd();

      return { previousTodos };
    },
    onSuccess: (savedTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
      );
    },
    // here the context is still "unknown" and we need to provide it's type in the generic section
    onError: (error, newTodo, context) => {
      if (!context) return;
      queryClient.setQueryData(CACHE_KEY_TODOS, context.previousTodos);
    },
    onSettled: () => {
      console.log("reached the end of mutation");
    },
  });
};


// on important thing, we're repeating ["todos"] key, which opens room for errors and bugs in the future
// if we need to update it then we would have to update all instances.
// as the solution we need to create a "constants.ts" file which then export this key