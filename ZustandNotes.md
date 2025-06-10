# Zustand

## 🔰 What is Zustand?

**Zustand** is a **minimal, unopinionated state management library** for React, built by the creators of Jotai and React Spring. The word "Zustand" means _"state"_ in German.

It offers a simpler alternative to tools like Redux, Context API, and Recoil, with less boilerplate and better performance in many cases.

---

## ⚙️ Key Features

- **Tiny** (\~1kB gzipped)
- **No boilerplate**
- **React-free** state (can be used outside components)
- **Built-in middleware** support
- **Selectors** for performance optimization
- Works well with **TypeScript**

---

## 🧠 When to Use Zustand?

- Global state (e.g., user auth, theme, cart)
- Sharing state across deeply nested components
- Avoiding context re-renders
- Lightweight alternative to Redux

---

## 🧱 Core Concepts

Zustand uses:

1. A **store** (created via `create`)
2. A **hook** to use and interact with the store
3. **Setters**, **getters**, and **selectors**

---

## 🧪 Basic Example with TypeScript From the Course

first define an interface to specify the shape of the store.

in this case we need a "counter", "increment" a function to increment the counter and a "reset" function to reset the counter

```ts
interface CounterStore {
  counter: number;
  increment: () => void;
  reset: () => void;
}
```

then we call `create` function and pass the shape of the our "store", we call this function and give it an arrow function `create(set=>())` which should have a parameter `set` which is a function for updating the state of store. so the arrow function should return an object which is the initial state of the store.

now inside this arrow function we implement our "store"

`counter: 0` we give counter an initial value of 0

then implement functions mentioned above

`increment: ()=>`

in the body of this function we use "set" to update the state of the store and give it an arrow function
which should take the current sate and return the next state. kinda similar to reducers.

so we're updating the state in an immutable way. "we don't need to use spread operator" to copy the other properties. so the `set` function will merge this property into our next state object

`reset: ()=>`

just like before we call `set` inside this function and give it an arrow function which should return our next state, we don't need to get access to the previous state value so we can ignore "store" parameter and just return {counter: 0}

```ts
create<CounterStore>((set) => ({
  increment: () => set((store) => ({ counter: store.counter + 1 })),
  reset: () => set(() => ({ counter: 0 })),
}));
```

```ts
import { create } from "zustand";

interface CounterStore {
  counter: number;
  increment: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  counter: 0,
  increment: () => set((store) => ({ counter: store.counter + 1 })),
  reset: () => set(() => ({ counter: 0 })),
}));

export default useCounterStore
```

the `create` function returns a `custom hook` which we can use anywhere in our application.

## 🧪 Basic Example with TypeScript Outside the Course

### 1. Install Zustand

```bash
npm install zustand
```

---

### 2. Create a Store (`store.ts`)

```ts
import { create } from "zustand";

type BearState = {
  bears: number;
  increase: (by: number) => void;
  reset: () => void;
};

export const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  reset: () => set({ bears: 0 }),
}));
```

✅ This store holds:

- A **state** (`bears`)
- A **setter** function (`increase`)
- A **reset function**

---

### 3. Use in a React Component

```tsx
"use client";
import React from "react";
import { useBearStore } from "./store";

export default function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  const increase = useBearStore((state) => state.increase);
  const reset = useBearStore((state) => state.reset);

  return (
    <div>
      <h1>{bears} 🐻</h1>
      <button onClick={() => increase(1)}>Increase</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

- `useBearStore((state) => state.bears)` is called a **selector**.
- Zustand only re-renders components if the selected slice of state changes.

---

## 🧩 Advanced Features

### ✅ Immer Support

You can use **Immer** to write immutable logic in a mutable style:

```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Todo = { id: number; title: string; done: boolean };

type Store = {
  todos: Todo[];
  toggleDone: (id: number) => void;
};

export const useTodoStore = create<Store>()(
  immer((set) => ({
    todos: [],
    toggleDone: (id) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === id);
        if (todo) todo.done = !todo.done;
      }),
  }))
);
```

Install with:

```bash
npm install immer
```

---

### 🧠 Persisting Store to LocalStorage

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: "auth-storage", // name of the item in storage
    }
  )
);
```

✅ Now your auth state will persist even after refresh.

---

### 🧼 Resetting Store State

You can define a reset function that restores default values:

```ts
const initialState = {
  bears: 0,
};

type BearState = typeof initialState & {
  increase: (by: number) => void;
  reset: () => void;
};

export const useBearStore = create<BearState>((set) => ({
  ...initialState,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  reset: () => set(initialState),
}));
```

---

## 🧠 Best Practices

- Use selectors to prevent unnecessary re-renders.
- Keep stores small and focused (like "authStore", "cartStore").
- You can share stores across files.
- Avoid using Zustand for local component-only state (use `useState` instead).

---

## 🧱 Real-world Use Case Example

```ts
// authStore.ts
type AuthStore = {
  user: { id: string; name: string } | null;
  setUser: (user: AuthStore["user"]) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

```tsx
// Navbar.tsx
const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav>
      {user ? (
        <>
          <span>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <span>Please login</span>
      )}
    </nav>
  );
};
```

---

## 🛠 Zustand vs Redux vs Context

| Feature            | Zustand                       | Redux                | Context API                 |
| ------------------ | ----------------------------- | -------------------- | --------------------------- |
| Boilerplate        | Very low                      | High                 | Low                         |
| Performance        | High (fine-grained selectors) | Good (with Reselect) | Low (re-renders everything) |
| Middleware Support | ✅ Built-in                   | ✅ Advanced          | ❌                          |
| Async logic        | ✅ (in store)                 | ✅ (thunks/sagas)    | Manual                      |
| Learning curve     | Very low                      | Moderate             | Low                         |
| Best for           | Simple–medium apps            | Complex apps         | Theme/lang etc.             |

---

## ✅ Summary

- Zustand is **simple, fast, and scalable**.
- It works great with **TypeScript**, localStorage, and advanced patterns like Immer.
- Use Zustand when you want **global state** without heavy boilerplate.
