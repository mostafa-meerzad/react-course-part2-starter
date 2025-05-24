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
