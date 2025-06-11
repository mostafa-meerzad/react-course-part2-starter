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
