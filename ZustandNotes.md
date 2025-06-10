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

export default useCounterStore;
```

the `create` function returns a `custom hook` which we can use anywhere in our application.

## Another example

```ts
import { create } from "zustand";

interface AuthStore {
  user: string;
  login: (username: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: "",
  login: (username) => set(() => ({ user: username })),
  logout: () => set(() => ({ user: "" })),
}));

export default useAuthStore;
```

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

## Avoid Unnecessary Re-Renders

Great question — **preventing unnecessary re-renders** is one of Zustand’s biggest advantages over other state management tools like React Context or Redux (without Reselect). Zustand is designed with **performance in mind**, and it gives you fine control over which components re-render.

Let’s walk through **how Zustand prevents re-renders**, how **you can control re-renders using selectors**, and **some advanced techniques** like `shallow` comparison.

---

## 🧠 The Problem

In many global state tools, when **any part** of the state updates, **all subscribed components** re-render — even if they don’t use the changed part of the state.

🔁 This leads to **wasted renders**.

---

## ✅ Zustand’s Solution: **Selectors**

Zustand lets you **select only the slice of state** your component needs:

```tsx
const count = useCounterStore((state) => state.count);
```

> ✅ The component will only re-render if `count` changes — not if something else in the store changes.

This is the **#1 best practice** for preventing unnecessary re-renders.

---

## ❌ Bad Practice: No Selector

```tsx
// ❌ This re-renders whenever *any* state changes
const state = useStore(); // Avoid this pattern
```

---

## ✅ Good Practice: Use a Selector Function

```tsx
// ✅ This re-renders only when `count` changes
const count = useStore((state) => state.count);
```

---

## 📘 Example Store

```ts
type State = {
  count: number;
  name: string;
  increment: () => void;
};

export const useStore = create<State>((set) => ({
  count: 0,
  name: "Zustand",
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

### Usage

```tsx
// ✅ Only re-renders when `count` changes
const count = useStore((s) => s.count);

// ✅ Only re-renders when `name` changes
const name = useStore((s) => s.name);
```

---

## 🔍 Fine-Grained Renders with `shallow`

Sometimes you want to select **multiple values**, but **only re-render if one of them changes**.

### ✅ Solution: Use `shallow` comparison

```ts
import { shallow } from "zustand/shallow";

const { count, name } = useStore(
  (state) => ({ count: state.count, name: state.name }),
  shallow // compare selected props with shallow equality
);
```

✅ This avoids re-rendering unless either `count` or `name` actually changes (object identity is ignored — shallow compare is used).

---

## 🛠 When to Use `shallow`

Use `shallow` **when selecting multiple properties**:

```tsx
const { a, b } = useStore((s) => ({ a: s.a, b: s.b }), shallow);
```

Otherwise, Zustand would re-render the component every time any part of the store updates — even if `a` and `b` didn't change — because the returned object is always a new object reference.

---

## 🧪 Custom Comparison Function

If you need **even more control**, Zustand supports **custom equality functions**:

```ts
const someValue = useStore(
  (state) => computeHeavyThing(state),
  (a, b) => deepEqual(a, b) // Custom comparison
);
```

But keep in mind:

- Custom equality functions run on every state change
- They're slower than `shallow`
- Use only when needed

---

## 🚫 Pitfall: Updating Too Much

Avoid placing unnecessary state in your store. Only global, shared state should go into Zustand.

✅ Use React’s `useState` for local, isolated UI state — it’s faster and simpler.

---

## 🚀 Summary: Best Practices to Avoid Re-Renders

| Tip                       | Description                                                                       |
| ------------------------- | --------------------------------------------------------------------------------- |
| ✅ Use Selectors          | Always use `(state) => state.someValue` instead of subscribing to the whole state |
| ✅ Use `shallow`          | When selecting multiple properties from the store                                 |
| ✅ Keep Store Focused     | Don’t put unrelated state in one store                                            |
| ✅ Avoid Large Objects    | Don’t select large objects (they create new references)                           |
| ⚠️ Avoid Inline Selectors | Don’t write `useStore(() => state.count + 1)` — recomputes every render           |

## Inspect Stores with Zustand DevTools

You're in for a treat — **Zustand DevTools** are super helpful for debugging and understanding state changes, especially in larger apps. Let's break it down step by step, no assumptions made. 😊

---

## ✅ What Are Zustand DevTools?

Zustand DevTools are **browser development tools integration** (like Redux DevTools). They let you:

- 🔍 Inspect your store's state
- 🔄 See state changes over time (like a timeline)
- 🧪 Dispatch actions manually (for testing)
- 📚 Track what caused each update

It uses the **Redux DevTools extension** under the hood, so you’ll need that installed.

---

## 🛠 How to Enable DevTools in Zustand

Zustand doesn’t include devtools by default — it comes from a **middleware** called `devtools`.

### 1. Install Zustand (if not already)

```bash
npm install zustand
```

### 2. Import `devtools` middleware

```ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
```

### 3. Wrap Your Store

Here’s how it looks with TypeScript:

```ts
type BearState = {
  bears: number;
  increase: () => void;
};

export const useBearStore = create<BearState>()(
  devtools(
    (set) => ({
      bears: 0,
      increase: () => set((state) => ({ bears: state.bears + 1 })),
    }),
    { name: "BearStore" }
  ) // 👈 optional name for DevTools
);
```

> ✅ Now every state change is logged in the Redux DevTools tab in your browser.

---

## 🧪 How to Use It

1. **Install Redux DevTools Extension** in Chrome or Firefox:

   - [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

2. Open your app → **DevTools → Redux tab**

3. You’ll see:

   - The current state (`bears: 0`)
   - A log of actions (`increase`)
   - You can even **dispatch fake actions** to test state changes

---

## ✍️ Naming Actions

By default, actions show up as `anonymous`. You can **label actions** manually using an optional third argument to `set`:

```ts
increase: () =>
  set((state) => ({ bears: state.bears + 1 }), false, "bear/increase");
```

> 🔎 This helps make the devtools log easier to understand.

---

## 💡 Tips for TypeScript

If you get TS errors with middleware, make sure you **call `create()` before wrapping**:

```ts
const useStore = create<State>()(devtools((set) => ({})));
```

This avoids TypeScript inference issues with middleware.

---

## 💡 When to Use DevTools

| Situation           | Use DevTools?                         |
| ------------------- | ------------------------------------- |
| Small toy project   | ❌ Not needed                         |
| Medium or large app | ✅ Yes                                |
| Team debugging      | ✅ Definitely                         |
| Complex stores      | ✅ Helps a lot                        |
| Production          | ⚠️ Disable for performance & security |

---

## 🚫 Disabling in Production

You can wrap it conditionally:

```ts
const useStore = create<State>()(
  devtools(
    (set) => ({
      // state/actions
    }),
    { enabled: process.env.NODE_ENV === "development" }
  )
);
```

---

## ✅ Summary

| Feature               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `devtools` middleware | Adds Redux DevTools support                           |
| `name` option         | Labels the store in the DevTools                      |
| Action labels         | Use 3rd arg in `set` to name actions                  |
| Conditional use       | Only enable in development builds                     |
| DevTools UI           | Timeline, actions, manual dispatch, and state preview |

---

Would you like a working demo of a Zustand store with DevTools that you can copy and run? I can also show you how to combine DevTools with `persist` or `immer` middleware if you're interested.
