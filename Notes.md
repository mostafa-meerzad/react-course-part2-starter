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

## Paginated Queries

**Pagination** is the process of dividing a large set of data into smaller chunks (called "pages") to make it easier to display and navigate.

For example:
If you have 100 blog posts and only want to show **10 per page**, you’ll end up with **10 pages**.

---

## 🧠 Why Use Pagination?

- 🔄 Avoid loading all data at once (which is slow and heavy).
- 📱 Improve user experience (faster, easier to scroll).
- ⚙️ Reduce server load and API bandwidth.

---

## 📦 Common Concepts

Let’s break it down with a real example:

Assume:

- Total items = 100
- Items per page = 10

We use:

| Term     | Meaning                 | Example          |
| -------- | ----------------------- | ---------------- |
| `limit`  | How many items per page | 10               |
| `offset` | How many items to skip  | Page 2 → skip 10 |
| `page`   | Which page we're on     | Page 2           |

There are **two common styles** of pagination.

### Implement Pagination with RQ

first we need to define a `state` variable to keep track of current page
and a since the page-size doesn't change we can declare it as a local variable.

then remove passing separate arguments to the `usePosts` and replace it with a `Query Object`, this query object is nothing specific to RQ but it is a Design Pattern, to make our code much cleaner and readable plus future-proof.

```tsx
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// this PostQuery object saves us a lot of time and refactoring in the future. but for now it's only about pagination, later we can add more to it.
interface PostQuery {
  page: number;
  pageSize: number;
}
const usePosts = (query: PostQuery) => {
  return useQuery<Post[], Error>({
    // again we change our queryKey, now the query object is part of our queryKey and whenever that object changes it
    queryKey: ["posts", query],
    queryFn: () =>
      axios
        .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
          params: {
            _start: (query.page - 1) * query.pageSize,
            _limit: query.pageSize,
          },
        })
        .then((res) => res.data),
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    // now we need to have "keepPreviousData" config option to deliver a better UX so our page content doesn't jump all over the place. this option tells RQ to show the old data while fetching the next-page content
  });
};
```

## Infinite Queries

To fetch data as user reaches the end of the page, we can implement this feature either by clicking "show more" or just scrolling which we'll get to that latter.

### Implement Infinite Query

1. use `useInfiniteQuery` instead of `useQuery`, with `infinite query` we cannot use `state hook` to track pages, it can cause conflicts with cache and data consistency, by the way `useInfiniteQuery` handle page numbers itself.
2. now how to calculate the page number with `infinite query`, well it has `getNextPageParam` property. `(lastPage, pages)=>nextPageNumber`

`lastPage` and `pages` do seem weird at first if you haven’t seen how `useInfiniteQuery` works internally. Let’s break them down **clearly and visually** so they make perfect sense.

## 🔍 What Are `lastPage` and `pages` in `getNextPageParam`?

These are the arguments passed to the `getNextPageParam` function in `useInfiniteQuery`.

```tsx
getNextPageParam: (lastPage, pages) => {
  // so if we're in page 1 we should return 2
  // 1 -> 2
  // this implementation varies from backend to backend
  // for some backend we can do:
  // "pages" contain all the fetched pages in an array
  // lastPage is the last fetched page
  // so if we're in page 1, then lastPage is undefined and we can return pages.length + 1
  // but we don't want to return nextPage number for ever!
  // ------
  // for jsonplaceholder api we can do
  // lastPage.length > 0 ? pages.length + 1 : undefined
  //
  // NOTE: a good backend should return the number of pages ahead of time so we can calculate the next page number
  return lastPage.nextPage; // this logic is for different api that provides the next pageNumber
};
```

### ▶️ 1. `lastPage`

- This is the **last result** your query function (`queryFn`) returned.
- It's **one single page of data** — the most recently fetched one.

For example:

```json
{
  "posts": [ ...10 posts... ],
  "nextPage": 4,
  "hasMore": true
}
```

So `lastPage.nextPage` might be `4`.

---

### ▶️ 2. `pages`

- This is an **array of all fetched pages so far**.
- React Query stores and combines each `queryFn` result here.

Example:

```ts
pages = [
  { posts: [...10 posts...], nextPage: 2 },
  { posts: [...10 posts...], nextPage: 3 },
  { posts: [...10 posts...], nextPage: 4 }
]
```

It grows every time you call `fetchNextPage()`.

---

## 📦 How React Query Uses Them

When you call `fetchNextPage()`, React Query needs to know what to pass next.

```tsx
getNextPageParam: (lastPage, pages) => {
  return lastPage.nextPage;
};
```

- `lastPage` is the most recently fetched page — you inspect it.
- If you return a value (like `4`), it gets passed as `pageParam` into your `queryFn`.
- If you return `undefined`, React Query **stops fetching** more pages.

---

## 🧠 Flow in Your Head

Let’s say your app fetches 3 pages of posts using:

```tsx
queryFn: ({ pageParam = 1 }) => fetch(`/posts?page=${pageParam}`);
```

Here's the flow:

1. Page 1 loads
   → `lastPage = page1`, `pages = [page1]`
   → `getNextPageParam(page1, [page1])` → returns `2`

2. Page 2 loads
   → `lastPage = page2`, `pages = [page1, page2]`
   → `getNextPageParam(page2, [page1, page2])` → returns `3`

3. Page 3 loads
   → `lastPage = page3`, `pages = [page1, page2, page3]`
   → `getNextPageParam(page3, [...])` → returns `undefined`
   → No more pages to fetch

---

## ✅ Summary

| Name       | Type                            | What it is                    |
| ---------- | ------------------------------- | ----------------------------- |
| `lastPage` | `object`                        | The last fetched page         |
| `pages`    | `array`                         | All previously fetched pages  |
| Returned   | `number \| string \| undefined` | The next `pageParam` to fetch |

3. now when we call `fetchNextPage` function to load more data `RQ` passes the `pageNumber` to our `queryFn` so we need to accept that argument which we need it to pass to the backend so we can get the next page data.

that `pageNumber` is passed in an object as `{pageParam}` se in out `queryFn` we destructure it and grab `pageParam` then it is initialized to `1` so we get the first page as our first fetch results

```ts
 queryFn: ({pageParam = 1}) =>
      axios
        .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
          params: {
            _start: (pageParam - 1) * query.pageSize,
            _limit: query.pageSize,
          },
        })
        .then((res) => res.data),
```

4. now to fetch data for the next page we need to call `fetchNextPage` which is provided by `useInfiniteQuery`

```ts
const {
  data: posts,
  error,
  isLoading,
  fetchNextPage,
  isFetchingNextPage,//  this one
} = usePosts({ pageSize });

const Component()=>{
  return (

      <button
        className="btn btn-primary me-3"
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? "loading..." : "load more"}
      </button>
  )
}
```

5. now as final step to show all fetched data to the user

```tsx
<ul className="list-group my-5">
// see here we want to iterate over the fetched data but it's no longer an array of posts `Post[]`
// it is `const posts: InfiniteData<Post[]> | undefined` of type `InfiniteData | undefined`
// in this object we have a couple of properties `pageParams` and `pages` data for all the pages
//

  {posts?.map((post) => (
    <li key={post.id} className="list-group-item">
      {post.title}
    </li>
  ))}
</ul>
```

now the `data` we get is no longer an array of Posts, it's of type `InfiniteData | undefined` which is an object with `pages` "all the fetched data" and `pageParams`, which needs a different approach for rendering the fetched data

in other words instead of iterating over `data` we should loop over `data.pages` and render the data for each page separately

### full example UI render

```tsx
import React, { useState } from "react";
import usePosts from "../hooks/usePosts";

const PostList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // const { data: posts, error, isLoading } = usePosts({ page, pageSize });

  const { data, error, isLoading, fetchNextPage, isFetchingNextPage } =
    usePosts({ pageSize }); // remove page number

  if (isLoading) return <p>loading...</p>;

  return (
    <>
      <ul className="list-group my-5">
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((post) => (
              <li key={post.id} className="list-group-item">
                {post.title}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>

      <button
        className="btn btn-primary me-3"
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? "loading..." : "load more"}
      </button>
    </>
  );
};

export default PostList;
```

### full example custom hook

```tsx
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostQuery {
  // remove "page" from our interface
  // page: number;
  pageSize: number;
}
const usePosts = (query: PostQuery) => {
  return useInfiniteQuery<Post[], Error>({
    queryKey: ["posts", query],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
          params: {
            _start: (pageParam - 1) * query.pageSize,
            _limit: query.pageSize,
          },
        })
        .then((res) => res.data),
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      // for jsonplacdholder api we don't know that we've reached the last page! but if we ask for a page that doesn't exist we'll get 'undefined'

      // also if we return "undefined" as the nextPage number RQ stops fetching data for the nextPage
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export default usePosts;
```

Let’s dive into **infinite queries** with React Query — one of its most powerful and fun features, especially for things like:

- Infinite scrolling (Reddit-style feed)
- “Load more” buttons (game lists, search results, etc.)
- Pagination where pages depend on previous results

---

### 🔁 What Is `useInfiniteQuery`?

`useInfiniteQuery` is like `useQuery`, but it’s designed for **paginated data** where you load more pages dynamically — either on scroll or on user action.

Instead of just `queryFn`, you use `getNextPageParam` to tell React Query **how to fetch the next page**.

---

### 🧱 Basic Structure

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ["games"],
    queryFn: ({ pageParam = 1 }) => fetchGames(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextPage ?? false;
    },
  });
```

---

### 🔍 How It Works

- `pageParam` is passed to your `queryFn` — defaulting to `1`
- `getNextPageParam` inspects the last page and decides if there’s another page
- You call `fetchNextPage()` to load the next page
- React Query appends new results to `data.pages`

---

### 🧠 Real Example (with a Fake API)

#### 👨‍🍳 `fetchGames.js`

```ts
export const fetchGames = async (page = 1) => {
  const res = await fetch(`/api/games?page=${page}`);
  const data = await res.json();
  return {
    games: data.results,
    nextPage: data.nextPage, // e.g. 2, 3, or null
  };
};
```

#### 🎮 `GamesList.tsx`

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  useInfiniteQuery({
    queryKey: ["games"],
    queryFn: ({ pageParam = 1 }) => fetchGames(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

if (status === "loading") return <p>Loading...</p>;
if (status === "error") return <p>Error loading games</p>;

return (
  <>
    {data.pages.map((page, i) => (
      <React.Fragment key={i}>
        {page.games.map((game) => (
          <div key={game.id}>{game.title}</div>
        ))}
      </React.Fragment>
    ))}

    <button
      onClick={() => fetchNextPage()}
      disabled={!hasNextPage || isFetchingNextPage}
    >
      {isFetchingNextPage
        ? "Loading more..."
        : hasNextPage
        ? "Load More"
        : "No more games"}
    </button>
  </>
);
```

---

### 🔁 Want to Use **Infinite Scrolling Instead of a Button**?

Use an **Intersection Observer** to auto-fetch when a "sentinel" div is visible:

```tsx
const observerRef = useRef();
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  });

  if (observerRef.current) observer.observe(observerRef.current);
  return () => observer.disconnect();
}, [hasNextPage, fetchNextPage]);
```

Then in JSX:

```tsx
<div ref={observerRef}></div>
```

---

### 🛠 When to Use It in GameHub

Perfect for:

- Loading games page by page
- Loading genres, reviews, or search results
- Infinite scroll in a grid or list layout

## Mutations, 🧠 What Is a Mutation?

A **mutation** is used when you're changing data:

| Action        | Use Query? | Use Mutation? |
| ------------- | ---------- | ------------- |
| Fetching data | ✅ Yes     | ❌ No         |
| Creating data | ❌ No      | ✅ Yes        |
| Updating data | ❌ No      | ✅ Yes        |
| Deleting data | ❌ No      | ✅ Yes        |

React Query handles:

- Sending the request ✅
- Showing loading & error state ✅
- Optionally refreshing your cache ✅
- Rolling back on errors ✅

---

to use `useMutation` hook we need to do:

### 1.

call `useMutation()` which takes a configuration object, it takes a `mutationFn` just like the `useQuery` which takes a `queryFn`. this function takes the data that needs to be sent to the backend as an argument and then makes a backend call (e.x. axios or fetch) post/put/delete-ing that data and the result is just returned, this result is the server response as shown here

```ts
useMutation({
  mutationFn: (data) => {
    return axios.post("backend/api", data).then((res) => res.data);
  },
});
```

or it can be an async function

```ts
const addTodo = useMutation({
  mutationFn: async (todo: Todo) => {
    const res = await axios.post(
      "https://jsonplaceholder.typicode.com/todos",
      todo
    );
    return res.data;
  },
});
```

### 2.

calling `useMutation` hook returns a `mutation` object "here we get it as `addTodo`", it has a `mutate` function which takes the data that needs to be sent to the backend, it literally is our `mutationFn` and here we provide that data as argument.

```ts
addTodo.mutate({
  id: 0,
  completed: true,
  title: ref.current.value, // if ref.current is null this expression would be undefined as the result
  userId: 1,
});
```

### full example

```tsx
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";

const TodoForm = () => {
  const ref = useRef<HTMLInputElement>(null);
  const addTodo = useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        todo
      );
      return res.data;
    },
  });

  return (
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
        <button className="btn btn-primary">Add</button>
      </div>
    </form>
  );
};

export default TodoForm;
```

### 3.

`useMutation` hook also takes other callbacks for situations like "onSuccess", "onError" and "onSettle"

```ts
const addTodo = useMutation({
  mutationFn: async (todo: Todo) => {
    const res = await axios.post<Todo>(
      "https://xjsonplaceholder.typicode.com/todos",
      todo
    );
    return res.data;
  },
  onSuccess: (data: Todo) => {
    //gets called on success
    console.log("success! got data back: ", data);
  },
  onError: (error: Error) => {
    //gets called on fail
    console.log("something went wrong: ", error.message);
  },
  onSettled: () => {
    //gets called either ways
    console.log("reached the end of mutation");
  },
});
```

`onSuccess(data, variables)` data is what we get from the server, and variables is the data we sent to the server.

### 4.

updating the data:

for updating data we have two ways:

#### 1 invalidating the cache

invalidating the cache, so RQ refetch data so we get the all fresh data, to do so we need to access our `queryClient` the one we initialized in our `main.tsx`, to get access to it `RQ` provides `useQueryClient` hook so we call it to get our `queryClient`

and then we can call `invalidateQueries` with `queryKey` that we want to get refreshed. inside our `onSuccess` callback

```ts
queryClient.invalidateQueries({
  queryKey: ["todos"],
});
```

```tsx
const queryClient = useQueryClient();
const ref = useRef<HTMLInputElement>(null);
const addTodo = useMutation({
  mutationFn: async (todo: Todo) => {
    const res = await axios.post<Todo>(
      "https://xjsonplaceholder.typicode.com/todos",
      todo
    );
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["todos"],
    });
  },
});
```

#### 2 updating data in the cache directly

updating data in the cache directly, using `setQueryData` which takes `setQueryData(queryKey, updater)` queryKey of which to be updated here `["todos"]`, updater which is a function to update the data.

here is how to specify the types, because TS doesn't know what kind of data we're dealing with.

so we use generics:

```ts
queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
  savedTodos,
  ...(todos || []),
]);
```

now for the `updater` function: it takes an array of `Todos` and returns an array of `Todos`, it know about `Todos` because we provided `Todo[]` as a generic. the most important part is that this function should return updated data in an immutable way just like updating state.

`queryClient.setQueryData<Todo[]>(["todos"], (todos) => [savedTodos, ...(todos || []),]);` here `savedTodos` is just data we get in the `onSuccess` callback we just renamed it.

so we're adding the server's response in our array and then separating the `todos` we get as "argument" to this "updater" function and because it might be "undefined" we use `...(todos || [])` so we don't get compilation errors.

### Handing Errors

to handle errors when our request to the backend fails. the mutation object we get from calling `useMutation` hook has a `error` property which represents the failure error.

```tsx
{
  addTodo.error && (
    <div className="alert alert.danger">{addTodo.error?.message}</div>
  );
}
```

for type safety we need to provide generic types to our `useMutation` hook like so `useMutation<SendDataType, ErrorType, ReceiveDataType>()` in our example it is `useMutation<Todo, Error, Todo>()` but this part can be different from backend to backend

```tsx
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
        <div className="alert alert.danger">{addTodo.error?.message}</div>
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
          <button className="btn btn-primary">Add</button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
```
