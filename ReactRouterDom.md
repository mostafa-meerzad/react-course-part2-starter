# React Router Dom

React Router DOM is a library that enables navigation between different components in a React application. It allows developers to create single-page applications (SPAs) where the content of the page changes without requiring a full page reload.

## Install React Router Dom

`npm i react-router-dom@6.10.0`

## Setup Routes

in the `src` folder create a `routes.tsx` file which holds all the routes.

in this file we first need to create a `router` using `createBrowserRouter` so we call this function and give it an array of `RouteObject` in which each element can have many properties but two of them are mandatory `path` which is the route and `element` which will be rendered when the user is in this `path` location

```tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routing/HomePage";
import UserListPage from "./routing/UserListPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/users", element: <UserListPage /> },
]);

export default router;
```

## Render Routes

In the `main.tsx` file replace `App` component with `RouterProvider` which comes from `react-router-dom` and give it's `router` param our `router` object from the `routes.tsx` file.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./routes";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
```

here we're allowing react-router to decide which component to render, instead of rendering a specific component like `App`.

## Navigation

### Use Link Component Between Page Navigation

To allow uses to navigate between pages use `Link` component which comes from `react-router-dom` to navigate efficiently.

You see the default behavior for `a` ("the anchor element") in HTML is to load the entire page. which is not good when all the data for all the pages are already shipped to the client.

so use `Link` component and give it a `to` prop which is the URL for the target page.

```tsx
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,
        mollitia!
      </p>
      <Link to="/users">Users</Link>
    </>
  );
};

export default HomePage;
```

this way we avoid unnecessary reloads on the client-side.

### Programmatically Navigate Between Pages

To navigate between pages use `useNavigate` hook from `react-router-dom` which return a `navigate` function, to navigate to a specific route all you need is to give this function a path, when you call it.

```tsx
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        // Redirect the user to the home page
        navigate("/");
      }}
    >
      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default ContactPage;
```

## Passing Data with Route Parameters

Sometimes we need to handle dynamic routes and pass data to our components through `URL`. for example when a we click on a user we want to pass the `user id` to the `URL`.

### here is how

In the `routes.tsx` we need to define route object/s which `parameters` as needed.

**NOTE**: All parameters must be prefixed with `:` as shown below.

```tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routing/HomePage";
import UserListPage from "./routing/UserListPage";
import ContactPage from "./routing/ContactPage";
import UserDetailPage from "./routing/UserDetailPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/users", element: <UserListPage /> },
  { path: "/users/:id", element: <UserDetailPage /> },
  { path: "/posts/:year/:month", element: <SomeComponent /> }, // just for demonstration
  { path: "/contact", element: <ContactPage /> },
]);

export default router;
```

and just like this you can pass data in route parameters

```tsx
import { Link } from "react-router-dom";

const UserListPage = () => {
  const users = [
    { id: 1, name: "Mosh" },
    { id: 2, name: "John" },
    { id: 3, name: "Alice" },
  ];
  return (
    <ul className="list-group">
      {users.map((user) => (
        <li className="list-group-item" key={user.id}>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default UserListPage;
```

## Getting Data from Route Parameters
