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

Sometimes we need to know which page we're on or what parameter values are passed in the URL, we have a bunch of hooks for that.

### The useParams Hook

the `useParams` hook is used to extract `parameter` values from the `URL`.

you call it and it returns the `URL parameters` in an object.

```tsx
import { useParams } from "react-router-dom";

const UserDetailPage = () => {
  const params = useParams();
  console.log(params);

  return <p>User</p>;
};

export default UserDetailPage;
```

### The useSearchParams Hook

We can access and update `query string parameters` with `useSearchParams`. similar to `useState` it returns an array of two elements `[searchParams, setSearchParams] = useSearchParams()`.

`searchParams` by default might render as `{}` empty object

`searchParams.toString()` to get query-string as a string

`searchParams.get(parameterName)` if parameterName exists in the query-string, it is returned otherwise `null`

**Note:** the `setSearchParams` function has `sideeffect` which is against react components laws, we need to be careful when using it, if we need to use it we should only use it within `eventHandlers` or inside an `effect`

```tsx
import { useParams, useSearchParams } from "react-router-dom";

const UserDetailPage = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log(params)
  console.log(searchParams);
  console.log(searchParams.toString());
  console.log(searchParams.get("name"));
  console.log(searchParams.get("age"));

  return <p>User</p>;
};

export default UserDetailPage;
```

### The useLocation Hook

with `useLocation` hook we can access the current location for example in this `http://localhost:5173/users/1?name=mostafa&password=123` route if we use `useLocation` hook we'll get an object like

```js
{
    "pathname": "/users/1",
    "search": "?name=mostafa&password=123",
    "hash": "",
    "state": null,
    "key": "default"
}
```

which contains information about `pathname`, `search` or `query-string` and much more.

to use it, you just call it and it returns an object which you can store in a variable and use it as you need.

```tsx
import { useLocation, useParams, useSearchParams } from "react-router-dom";

const UserDetailPage = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log(params)
  console.log(searchParams);
  console.log(searchParams.toString());
  console.log(searchParams.get("name"));
  console.log(searchParams.get("age"));
  const location = useLocation();
  console.log(location);

  return <p>User</p>;
};

export default UserDetailPage;
```

## Nested Routes

In a real world application we typically have a `NavBar` and depending on which page the user's in, we render different components in the content area.

### Apply Nested Routes

#### The Outlet Component

To render different components based on user's location we use the `Outlet` component, which is like a placeholder for `child` component, so at runtime based on user's current location different components will be rendered inside this `Outlet` component.

#### Apply Nested Routes in the Routes.ts file

In the `routes.ts` file we define a new `route object` just as usual, with `children` property which is an array of `route objects` and the path for child routes will be relative to the parent route.

##### Before

```tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routing/HomePage";
import UserListPage from "./routing/UserListPage";
import ContactPage from "./routing/ContactPage";
import UserDetailPage from "./routing/UserDetailPage";
import Layout from "./routing/Layout";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/users", element: <UserListPage /> },
  { path: "/users/:id", element: <UserDetailPage /> },
  { path: "/contact", element: <ContactPage /> },
]);

export default router;
```

#### Create the parent/root route

```tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routing/HomePage";
import UserListPage from "./routing/UserListPage";
import ContactPage from "./routing/ContactPage";
import UserDetailPage from "./routing/UserDetailPage";
import Layout from "./routing/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/users", element: <UserListPage /> },
      { path: "/users/:id", element: <UserDetailPage /> },
      { path: "/contact", element: <ContactPage /> },
    ],
  },
]);

export default router;
```

#### Final route object

```tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routing/HomePage";
import UserListPage from "./routing/UserListPage";
import ContactPage from "./routing/ContactPage";
import UserDetailPage from "./routing/UserDetailPage";
import Layout from "./routing/Layout";

const router = createBrowserRouter([
  {
    path: "/", // now this is our root
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> }, // so now our homepage route is relative to the root, and we don't need "/" just "" (empty) string is enough
      // and because the path is an empty string we can replace it with `index: true`
      { path: "users", element: <UserListPage /> }, // and for these routes we no longer need "/" at the beginning of each route
      { path: "users/:id", element: <UserDetailPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);

export default router;
```

#### Final Final route object

```tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routing/HomePage";
import UserListPage from "./routing/UserListPage";
import ContactPage from "./routing/ContactPage";
import UserDetailPage from "./routing/UserDetailPage";
import Layout from "./routing/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "users", element: <UserListPage /> },
      { path: "users/:id", element: <UserDetailPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);

export default router;
```

## Styling the Active Link

To apply some styles to the active link all we have to do is to use `NavLink` instead of `Link`, they are exactly the same but `NavLink` can apply styles to the currently active like via `className` prop. by default it add `active` css-class to the `className` and the good thing is that we can customize it! to return our custom css-class, all we have to to is `<NavLink className={({isActive})=> isActive ? "customActive": "blank/customInactive"}>`, provide an arrow function to the `className` and destructure `isActive` in the arguments which is a boolean, so based on this value you can get your custom css-class or anything according to your needs.

```tsx
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ background: "#f0f0f0", marginBottom: "1rem" }}
    >
      <div className="container-fluid">
        <Link to={"/"} className="navbar-brand">
          My App
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="/users"
              >
                Users
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
```

## Handling Errors

When the user hits an invalid page `react-router-dom` returns a generic errorpage, but we can customize it with ease.

in the `routes.tsx` file you set `errorElement` to a component that renders an error message, to the route you want the error to render to.

```tsx
import { createBrowserRouter } from "react-router-dom";
import ContactPage from "./routing/ContactPage";
import HomePage from "./routing/HomePage";
import Layout from "./routing/Layout";
import UserDetail from "./routing/UserDetail";
import UsersPage from "./routing/UsersPage";
import ErrorPage from "./routing/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />, // here we set ErrorPage to render when something goes wrong
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "users",
        element: <UsersPage />,
        children: [{ path: ":id", element: <UserDetail /> }],
      },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);

export default router;
```

**Note:** this approach not only renders the `ErrorPage` for `Not Found` error but also renders when our app throws an error.

in a real world application we want to log errors somewhere permanently, so we can debug it later.

`Sentry` is one of these services that offer error logging for future diagnosis.

### Getting the Errors

to get the errors use `useRouteError` hook which returns the error object, which we can log it in the console or Sentry

```tsx
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <>
      <h1>Oops...</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </>
  );
};

export default ErrorPage;
```

#### Differentiate between User Error vs Application Error

we can use `isRouteErrorResponse(error)` that takes the error object returned by `useRouteError` hook and returns boolean if `true` it means the user is trying to access an invalid route.

```tsx
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  // console.log(error);
  return (
    <>
      <h1>Oops...</h1>
      <p>
        {isRouteErrorResponse(error) ? "page not found" : "something failed"}
      </p>
      {/* <p>Sorry, an unexpected error has occurred.</p> */}
    </>
  );
};

export default ErrorPage;
```

## Private Routes

In real world applications we often need to restrict access to certain routes to authenticated or logged in users. which are called `private routes`

### The Navigate component

Use this component to redirect unauthorized users to page like "login" or somewhere.

DO NOT use "useNavigate" hook to redirect users, it's a hook and calling a hook conditionally is against hooks rules. on top of that it causes unexpected bugs like infinite-renders.

```tsx
import { createBrowserRouter } from "react-router-dom";
import ContactPage from "./routing/ContactPage";
import HomePage from "./routing/HomePage";
import Layout from "./routing/Layout";
import UserDetail from "./routing/UserDetail";
import UsersPage from "./routing/UsersPage";
import ErrorPage from "./routing/ErrorPage";
import LoginPage from "./routing/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      {
        path: "users",
        element: <UsersPage />,
        children: [{ path: ":id", element: <UserDetail /> }],
      },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);

export default router;
```

```tsx
import { Navigate, Outlet } from "react-router-dom";
import UserList from "./UserList";
import useAuth from "./hooks/useAuth";

const UsersPage = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to={"/login"} />;

  return (
    <div className="row">
      <div className="col">
        <UserList />
      </div>
      <div className="col">
        <Outlet />
      </div>
    </div>
  );
};

export default UsersPage;
```

### Layout Routes

Sometimes we need to group routes for enforcing layouts or business-rules, this is where we can use Layout Routes.

now we need to move the redirection logic from

```tsx
import { Navigate, Outlet } from "react-router-dom";
import UserList from "./UserList";
import useAuth from "./hooks/useAuth";

const UsersPage = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to={"/login"} />;

  return (
    <div className="row">
      <div className="col">
        <UserList />
      </div>
      <div className="col">
        <Outlet />
      </div>
    </div>
  );
};

export default UsersPage;
```

to

`PrivateRoutes.tsx` by the way as a best practice create this file in the `src`

```tsx
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const PrivateRoutes = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to={"/login"} />;

  // and return an outlet
  return <Outlet />;
};

export default PrivateRoutes;
```

we're done with this component.

inside the `routes.tsx` we need to create a new route next to our root-route, this route doesn't need the `path` because it is a layout-route and it's purpose is to group routes for enforcing layout or business-rules.

so as it's element it takes the `PrivateRoutes.tsx` component we created. and takes `children` array we put any route that needs to be protected. like the `users` route

```tsx
import { createBrowserRouter } from "react-router-dom";
import ContactPage from "./routing/ContactPage";
import HomePage from "./routing/HomePage";
import Layout from "./routing/Layout";
import UserDetail from "./routing/UserDetail";
import UsersPage from "./routing/UsersPage";
import ErrorPage from "./routing/ErrorPage";
import LoginPage from "./routing/LoginPage";
import PrivateRoutes from "./routing/PrivateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "users",
        element: <UsersPage />,
        children: [{ path: ":id", element: <UserDetail /> }],
      },
    ],
  },
]);

export default router;
```

now if you try to reach `/users` or any subroutes in `/users` route, you're redirected to "/login" page
