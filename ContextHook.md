# React Context

## 🔁 **Prop Drilling**

### **What is it?**

**Prop drilling** is the process of passing data from a parent component down to child components through props—even if intermediate components don't need the data.

### **Example:**

```jsx
function App() {
  const user = { name: "Mostafa" };
  return <Parent user={user} />;
}

function Parent({ user }) {
  return <Child user={user} />;
}

function Child({ user }) {
  return <p>Hello, {user.name}</p>;
}
```

Even though only `Child` needs the `user`, we had to pass it through `Parent`. This becomes messy when you have many nested components.

---

## 🌐 **React Context**

### **What is it?**

**React Context** is a way to **share data globally** across components, without having to pass props manually at every level. It solves the prop drilling problem.

### **Use Cases:**

- User authentication
- Theme settings (dark/light mode)
- Language selection
- Any global app state

### **How it works:**

1. **Create** a context.
2. **Provide** a value at the top level.
3. **Consume** the value in deeply nested components.

### **Example:**

```jsx
import React, { createContext, useContext } from "react";

// 1. Create the context
const UserContext = createContext();

function App() {
  const user = { name: "Mostafa" };

  // 2. Provide the context value
  return (
    <UserContext.Provider value={user}>
      <Parent />
    </UserContext.Provider>
  );
}

function Parent() {
  return <Child />;
}

function Child() {
  // 3. Consume the context value
  const user = useContext(UserContext);
  return <p>Hello, {user.name}</p>;
}
```

No need to pass `user` through `Parent` anymore!

---

## 🔄 Summary

| Feature      | Prop Drilling                    | React Context                      |
| ------------ | -------------------------------- | ---------------------------------- |
| Data Passing | Via props through each component | Global access via Provider/Context |
| Easy to use? | For shallow trees                | Better for deep trees              |
| Drawbacks    | Repetitive, cluttered code       | Might add complexity if overused   |
| Best For     | Simple data flow                 | App-wide/shared state              |

---

Let me know if you'd like a visual diagram or to build a mini app using both!

## Best Practices

Great question! A **clean, reusable, and scalable structure** for creating and using React Context involves creating a **dedicated context module** for each context. This pattern keeps your code **modular**, **testable**, and **easier to reason about**.

---

## ✅ Best Practice Structure for a Context Component

### 🗂 Folder/File Structure

```
src/
  contexts/
    UserContext.tsx  (or .js)
```

---

### 📦 Example: `UserContext.tsx`

```tsx
// src/contexts/UserContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

// 1. Define types (optional but highly recommended with TypeScript)
type User = {
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// 2. Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// 3. Create the provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 4. Custom hook for consuming context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
```

---

### ✅ How to Use in App

```tsx
// App.tsx or layout.tsx (Next.js)
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <MyComponent />
    </UserProvider>
  );
}
```

```tsx
// MyComponent.tsx
import { useUser } from "./contexts/UserContext";

function MyComponent() {
  const { user, setUser } = useUser();

  return (
    <div>
      <p>Welcome {user?.name || "Guest"}</p>
      <button
        onClick={() => setUser({ name: "Mostafa", email: "test@example.com" })}
      >
        Login
      </button>
    </div>
  );
}
```

---

## 🧼 Summary: Best Practices

| Practice            | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| ✅ Modular File     | One file for context: defines context, provider, and custom hook |
| ✅ Custom Hook      | Encapsulate `useContext` in a hook like `useUser()`              |
| ✅ Error Guard      | Warn when context is used outside its provider                   |
| ✅ Type Safety      | Strongly type context value if using TypeScript                  |
| ✅ Provider Wrapper | Wrap the app or a subtree with the provider at a high level      |

---

Let me know if you want a template or want to adapt this to your `Promptopia` or `Issue Tracker` projects!

## Example and Why

Yes — **all three (context, provider, and custom hook)** are typically defined in **a single module/file**, not a single _component_. This module acts as a **self-contained context unit**, which is a widely accepted best practice for clean and scalable React codebases.

---

### 🔁 Here's what lives in that **single file** (e.g., `UserContext.tsx`):

| Piece          | What it is         | Purpose                                               |
| -------------- | ------------------ | ----------------------------------------------------- |
| `UserContext`  | The actual context | Used to share data across components                  |
| `UserProvider` | A React component  | Wraps part of your app and provides the context value |
| `useUser`      | A custom hook      | A cleaner, safer way to access context in components  |

---

### ✅ This pattern is clean because:

1. 🔒 **Encapsulation**: Everything related to `UserContext` lives in one file.
2. 🧠 **Reusability**: You just import `useUser()` wherever you need the data.
3. 🛡️ **Safety**: You can throw a helpful error if someone forgets to wrap with `UserProvider`.
4. 🚀 **Scalability**: Easy to manage multiple contexts (e.g. `ThemeContext`, `AuthContext`, `SettingsContext`) without mixing responsibilities.

---

### 📦 Example (Recap):

```tsx
// src/contexts/UserContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

// Context Type
type User = { name: string; email: string };
type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
```

Then just:

```tsx
// App.tsx
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <HomePage />
    </UserProvider>
  );
}
```

```tsx
// HomePage.tsx
import { useUser } from "./contexts/UserContext";

function HomePage() {
  const { user, setUser } = useUser();
  return <div>Hello, {user?.name || "Guest"}</div>;
}
```

---
