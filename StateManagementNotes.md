# State Management

In React, **Reducers** and the `useReducer` hook provide a structured way to manage **state logic**, especially for **complex state updates**, **multiple related state variables**, or when **state transitions depend on previous state**.

---

## ✅ What is a Reducer?

A **reducer** is a **pure function** that determines changes to an application's state.
In other words, is a function that allows us to centralize state updates in a component. It takes in:

- The **current state**
- An **action** (which describes what happened)

And returns:

- A **new state**

### ➤ Syntax of a Reducer Function

```js
function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

The function must be **pure** — it should:

- Not modify the original state object (immutability)
- Not have side effects (e.g., API calls, logging, etc.)

---

## 🧠 Why use a Reducer?

You might choose a reducer over `useState` when:

- Your state logic is **complex**
- You have **multiple sub-values** in one state object
- State updates are **closely related**
- You want **predictable state transitions**

---

## 🪝 What is `useReducer`?

`useReducer` is a React hook that lets you use the **reducer pattern** for state management in a component.

### ➤ Syntax

```js
const [state, dispatch] = useReducer(reducer, initialState);
```

- `reducer`: Your reducer function (see above)
- `initialState`: The initial value for your state
- `state`: The current state object
- `dispatch`: A function to send an action to the reducer

---

### 🧪 Example: Simple Counter

```js
import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
    </div>
  );
}
```

---

## 🔍 Action Object

The `action` passed to the reducer can be any object, but by convention, it has:

```js
{ type: 'ACTION_TYPE', payload: someData }
```

This makes it scalable and easier to debug.

### Example with payload:

```js
function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        todos: [...state.todos, action.payload],
      };
    default:
      return state;
  }
}
```

Usage:

```js
dispatch({ type: "ADD_TODO", payload: { id: 1, text: "Learn useReducer" } });
```

---

## ⚙️ Comparison: `useState` vs `useReducer`

| Feature         | `useState`             | `useReducer`                           |
| --------------- | ---------------------- | -------------------------------------- |
| Simplicity      | Great for simple state | Better for complex logic               |
| State structure | Single variable        | Structured objects                     |
| Action types    | None                   | Supports action types                  |
| Related updates | Harder to group        | Grouped in a single reducer            |
| Testability     | Moderate               | Reducers are easy to test in isolation |

---

## 📦 Summary

- A **reducer** is a pure function that takes the current state and an action, then returns a new state.
- `useReducer` is a hook for using reducers in React.
- Great for managing **complex, multi-step, or shared state logic**.
- `dispatch()` is used to send actions to the reducer.

### example 

In our example if we pass a different "action" object our reducer wouldn't work!
for fix it we can use TypeScript magic, by using "literal values" as our "action" type
```ts

interface Action{
    type: string;
}

const counterReducer = (state: number, action: Action): number =>{
 if (action.type === "INCREMENT") return state + 1;
 if (action.type === "RESET") return 0;
 return state;
}

export default counterReducer;
```

```tsx
import { useReducer, useState } from 'react';
import counterReducer from './reducers/counterReducer';

const Counter = () => {
  // const [value, setValue] = useState(0);
  const [value, dispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      Counter ({value})
      <button
        onClick={() => dispatch({type: "INCREMENT"})}
        className="btn btn-primary mx-1"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch({type:"RESET"})}
        className="btn btn-primary mx-1"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;

```

