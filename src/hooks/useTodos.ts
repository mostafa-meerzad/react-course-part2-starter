import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CACHE_KEY_TODOS } from "../react-query/constants";
import APIClient from "../react-query/services/apiClient";
import todoService, { Todo } from "../react-query/services/todoService";

// create a new instance of APIClient and provide the generic datatype
// const apiClient = new APIClient<Todo[]>("/todos")
const useTodos = () => {
  // now with APIClient class we don't need to handle api calls here
  // const fetchTodos = () =>
  //   axios
  //     .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
  //     .then((response) => response.data);

  return useQuery<Todo[], Error>({
    queryKey: CACHE_KEY_TODOS,
    queryFn: todoService.getAll,
  });
};

export default useTodos;
