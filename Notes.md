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

`useQuery<APICallbackReturnDataType, ErrorDataType>({queryKey:["yourKey"], queryFn:()=>doSomeThing})`

so when providing the "error" type we have to provide data type for the query callback function as well, as part of Typescript generics requirements

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

## Using React Query Devtools

RQ comes with a devtools library that allows us to really inspect our query data and check different related states.

### Installation

run `npm i @tanstack/react-query-devtools` or `npm i @tanstack/react-query-devtools@4.28` for a specific version.

then import `ReactQueryDevtools` component into the `main.tsx` component

```tsx
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
```

now you are done! really brilliant! 😎😎

## Customize React Query Settings

this is where you really start to take control of behavior like **when** and **how** data is fetched, **how long** it's cached, **retry strategies**, and more.

---

### 🎛️ Common Query Settings

When you use `useQuery`, you can pass a **configuration object** like this:

```tsx
useQuery({
  queryKey: ["games"],
  queryFn: fetchGames,
  staleTime: 1000 * 60, // 1 minute
  cacheTime: 1000 * 300, // 5 minutes
  refetchOnWindowFocus: false,
  retry: 2,
  enabled: true,
});
```

Here’s a breakdown of the most important settings:

---

### ⏰ `staleTime`

- Time in **ms** that data is considered "fresh"
- Until this time passes, React Query won’t refetch automatically
- Prevents over-fetching

**Example:**

```ts
staleTime: 1000 * 60; // 1 minute
```

**Note**: `staleTime` is `0` by default so you might see the same request repeated multiple times, in the browser. and that is because change of focus on that browser tab

---

### 🗃️ `cacheTime`

- How long unused data stays in memory
- After this time, it’s garbage collected
- Used when a component **unmounts**, then remounts

**Example:**

```ts
cacheTime: 1000 * 300; // 5 minutes
```

---

### 🔁 `refetchOnWindowFocus`

- Automatically refetches when user returns to the tab/window
- Great for real-time-ish apps
- Default: `true`

**Example:**

```ts
refetchOnWindowFocus: false;
```

---

### 🔄 `refetchInterval`

- Enables **polling**
- Data is automatically refetched every X milliseconds

**Example:**

```ts
refetchInterval: 10000; // every 10 seconds
```

---

### ✅ `enabled`

- Controls **whether the query should run**
- Useful for **conditional fetching**

**Example:**

```ts
enabled: !!userId;
```

---

### 🔁 `retry` and `retryDelay`

- Retry failed requests
- Customize how many times and how long between retries

**Example:**

```ts
retry: 3,
retryDelay: attempt => attempt * 1000
```

### `refetchOnWindowFocus`

- refetch data as you come back to the tab, that the app is open
- default value `true`, you don't need to alter this unless your app requires such behavior

### `refetchOnReconnect`

- fetch data when you've lost internet connection at the moment you reconnect
- default `true` you can alter as needed

### `refetchOnMount`

- fetch data when the component is mounted in the DOM
- default `true` you can alter as needed

---

### 🛠 Example with Multiple Custom Settings

```tsx
useQuery({
  queryKey: ["games"],
  queryFn: fetchGames,
  staleTime: 60 * 1000,
  cacheTime: 5 * 60 * 1000,
  refetchOnWindowFocus: true,
  refetchInterval: 30000,
  retry: 2,
  enabled: true,
});
```

---

### 🧠 Tip: Set Defaults Globally

If you want to apply these settings across your whole app, use `QueryClient`:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Note**: when data is `stale` RQ tries to fetch fresh data, and at the mean time it show the old/cached data to the user, as soon as it successfully gets fresh data it update UI, thus showing fresh data.

## Parameterized Queries

Let's fetch hierarchical/nested resources, like a situation where you have: three users and each user has ten posts, and you want to fetch posts specific for that user, dynamically.

### Implement User selection component

```tsx
import { useState } from "react";
import usePosts from "../hooks/usePosts";

const PostList = () => {
  const { data: posts, error, isLoading } = usePosts();
  // define a state to keep track of selected user
  const [userId, setUserId] = useState<number>();

  if (isLoading) return <p>loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <select
        name="users"
        id="users"
        className="form-select mb-3"
        onChange={(event) => setUserId(parseInt(event.target.value))}
        value={userId}
      >
        <option value=""></option>
        <option value="1">user 1</option>
        <option value="2">user 2</option>
        <option value="3">user 3</option>
      </select>
      <ul className="list-group">
        {posts?.map((post) => (
          <li key={post.id} className="list-group-item">
            {post.title}
          </li>
        ))}
      </ul>
    </>
  );
};

export default PostList;
```

### Fetch data for selected user

now that we have a state tracking the selected user, we need to pass `userId` to our `usePosts` hook so we can filter users, like so

```ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
// userId can be either a selected number or undefined when no user is selected
const usePosts = (userId: number | undefined) => {
  const fetchPosts = () =>
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.data);

  return useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default usePosts;
```

so far we're dealing with simple data but, now we're dealing with hierarchical data and need to structure our `queryKey` differently, so we should follow a hierarchical structure that represents the relationship between our objects.

1. we start with top-level object, `users`
2. add `userId` as the second one
3. add `posts` as the last part

`queryKey:["users", userId, "posts"]`

just like the structure we follow in `Restful API's`, if we were to build an API to get posts for a specific user, `/users/1/posts`, as you can see it gets more specific as we go from left to right.

now for our `queryKey:["users", userId, "posts"]`, `userId` is a parameter for this query and every time `userId` changes `RQ` will automatically fetch the post for that user from the backend, think of it like the `dependency array` for `useEffect` hook, every time one of the dependency array items change the hook is rerendered.

we could do something like the following

```ts
const fetchPosts = () =>
  axios
    .get<Post[]>("https://jsonplaceholder.typicode.com/posts?userId=1")
    .then((res) => res.data);
```

but that is ugly and in the long run make it hard to read.

instead, to as follows, by the way, it is `Axios` so we need to use it's capabilities!

```ts
const fetchPosts = () =>
  axios
    .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
      params: { userId },
    })
    .then((res) => res.data);
```

### full example

```ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const usePosts = (userId: number | undefined) => {
  const fetchPosts = () =>
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
        params: { userId },
      })
      .then((res) => res.data);

  return useQuery<Post[], Error>({
    queryKey: ["users", userId, "posts"],
    queryFn: fetchPosts,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default usePosts;
```

**Notice**: here we have a tiny issue that can be improved, when no user is selected we get `["users",null,"posts"]` and if a user is selected `["users",1,"posts"]`. wouldn't it be nice that there was not null value.

here is the solution

use an expression in the `queryKey` that evaluates to different keys based on selected `userId`

`queryKey: userId ? ["users", userId, "posts"] : ["posts"],`

```ts
return useQuery<Post[], Error>({
  queryKey: userId ? ["users", userId, "posts"] : ["posts"],
  queryFn: fetchPosts,
  staleTime: 60 * 1000,
  cacheTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
});
```
