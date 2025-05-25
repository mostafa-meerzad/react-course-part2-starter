# React Query

## What is React Query

**React Query** (now officially called **TanStack Query**) is a powerful data-fetching and state management library for React applications. It helps developers efficiently manage server state in their applications — meaning data that comes from an external source (like an API) and is not directly controlled by the client.

Let’s break it down in **detail**:

---

### 🔍 What Problem Does React Query Solve?

React by itself only manages **local state** (via `useState`, `useReducer`, etc.), but many real-world applications also need to deal with:

- Fetching data from APIs (e.g., `fetch('/api/posts')`)
- Caching that data for performance
- Handling loading and error states
- Refetching data when it becomes stale
- Keeping multiple components in sync with the server
- Background updates and polling
- Pagination and infinite scrolling

Traditionally, developers handled all this manually using `useEffect`, `useState`, and some extra logic. This often led to:

- Repetitive code
- Bugs and stale data
- Over-fetching or under-fetching
- Poor UX with slow updates

**React Query automates and improves all of this.**

---

### ⚙️ How React Query Works

React Query provides a set of hooks like:

- `useQuery` – for fetching and caching data
- `useMutation` – for sending data to the server (POST, PUT, DELETE)
- `useInfiniteQuery` – for infinite scrolling
- `QueryClient` – for global configuration and cache management

---

### 🧠 Key Concepts

#### 1. **Query Keys**

Every query in React Query is identified by a **key** — usually a string or array:

```ts
useQuery(["todos"], fetchTodos);
```

This key is used internally for caching and refetching logic.

#### 2. **Caching**

React Query caches your API response in memory. If another component tries to fetch the same data (same key), it will **reuse the cached result** unless it’s stale.

#### 3. **Stale Time & Refetching**

React Query considers data “fresh” for a certain time (default 0 ms). After that, it's **stale** and can be refetched automatically when:

- Component remounts
- Window regains focus
- You manually trigger a refetch

You can customize this with `staleTime`, `cacheTime`, `refetchOnWindowFocus`, etc.

#### 4. **Automatic Background Updates**

Out of the box, React Query can:

- Refetch data in the background
- Update only changed parts
- Provide loading indicators
- Retry failed requests

#### 5. **Mutations**

Use `useMutation` when changing server-side data:

```ts
const mutation = useMutation(addTodo);
mutation.mutate({ title: "New Todo" });
```

React Query manages:

- Optimistic updates
- Error handling
- Rollbacks on failure
- Refetching affected queries

---

### ✅ Example

```tsx
import { useQuery } from "@tanstack/react-query";

function Todos() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

---

### 🧰 Benefits of React Query

- 🔄 **Real-time updates** (background refetching)
- ⚡ **Performance** (caching and deduping)
- 📦 **Zero-boilerplate** (no need for `useEffect`/`useState`)
- 💡 **Declarative APIs** (just describe what you need)
- 💬 **DevTools** for debugging queries
- 📡 **Supports pagination, infinite scroll, SSR, etc.**

---

### 🚫 What React Query is Not

- Not a global state manager like Redux (though it _can_ replace it for many use cases)
- Not a replacement for `useState` for UI state (modals, form inputs, etc.)
- Not for managing form state, animations, etc.

---

### 🔗 Comparison with Other Tools

| Feature          | React Query | Axios + useEffect | Redux Toolkit Query |
| ---------------- | ----------- | ----------------- | ------------------- |
| Caching          | ✅ Yes      | ❌ No             | ✅ Yes              |
| Refetch on focus | ✅ Yes      | ❌ No             | ✅ Yes              |
| DevTools         | ✅ Yes      | ❌ No             | ✅ Yes              |
| Infinite queries | ✅ Yes      | ❌ No             | ✅ Yes              |
| Boilerplate      | 🚫 Minimal  | 🔥 High           | ⚠ Medium            |

---

### 📚 When Should You Use React Query?

Use React Query when:

- You fetch data from APIs
- You want caching and background updates
- You need better UX with fewer bugs
- You want to simplify your data fetching logic

## Set Up React Query

Inside the 'main.tsx' component, import `QueryClient` and `QueryClientProvider` then create a new `queryClient` object

```tsx
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## Using React Query to Fetch Data

To use React Query, we use `useQuery` hook.

`useQuery` takes a configuration object `{queryKey: [uniqueQueryId], queryFn: ()=> function to fetch data}`.

- `queryKey`: is a unique identifier which tells what type of data we're fetching, for each query and is internally used for caching data.
- `queryFn`: is just a callback function that fetch data! React Query doesn't care how we fetch the data so we can use `fetch` API, `axios` or anything else you want.

```tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const fetchTodos = () =>
  axios
    .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.data);
    // in this fetch function we return the actual data, that we receive from the server

const TodoList = () => {
  // here we destructure the object provided by `useQuery` and get data, for convenience we rename it as `todos`
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // if (error) return <p>{error}</p>;

  return (
    <ul className="list-group">
     /*{todos might be undefined in case call to server fails, so use optional chaining}*/
      {todos?.map((todo) => (
        <li key={todo.id} className="list-group-item">
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
```

## Handling Errors

The `useQuery` hook also gives an "error" property which represents the error happened wile fetching data.

if we don't specify the type of error React-Query doesn't know what type of error it is, and that is very dependant on what library we're using or just 'fetch' function is used

```tsx
const TodoList = () => {
  const {data: todos, error} = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos
  });

  if (error) return <p>{error}</p>;

```

In `Axios` all errors are instances of `Error` interface that is available on all browsers.

so for `useQuery` hook we need to specify the type of errors that might happen while fetching data.

`useQuery<APICallDataType, ErrorDataType>({queryKey:["yourKey"], queryFn:()=>doSomeThing})`

```tsx
const TodoList = () => {
  const {data: todos, error} = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos
  });
```

---

### full Example

```tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const fetchTodos = () =>
  axios
    .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.data);

const TodoList = () => {
  const { data: todos, error } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (error) return <p>{error.message}</p>;

  return (
    <ul className="list-group">
      {todos?.map((todo) => (
        <li key={todo.id} className="list-group-item">
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
```

## Handle Loading State

Handling loading state with RQ is straightforward and easy, just grab `isLoading` from `useQuery` hook, which is a boolean value indicating loading state

```tsx
const TodoList = () => {
  const {data: todos, error, isLoading} = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos
  });

   if (isLoading) return <p>loading...</p>

```

## Create a Custom Query Hook

With our current implementation we are doing separate things in one place, there is no Separation Of Concerns.

```tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const fetchTodos = () =>
  axios
    .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.data);

const TodoList = () => {
  const { data: todos, error } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (error) return <p>{error.message}</p>;

  return (
    <ul className="list-group">
      {todos?.map((todo) => (
        <li key={todo.id} className="list-group-item">
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
```

so let's move our query logic into a custom hook `useTodos.ts`

```tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const useTodos = () => {
  const fetchTodos = () =>
    axios
      .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.data);

  return useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
};

export default useTodos;
```

and update our `TodoList.tsx` component

```tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useTodos from "../hooks/useTodos";

const TodoList = () => {
  const { data: todos, error, isLoading } = useTodos();

  if (isLoading) return <p>loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <ul className="list-group">
      {todos?.map((todo) => (
        <li key={todo.id} className="list-group-item">
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
```

see how beautiful 😎 is it!
