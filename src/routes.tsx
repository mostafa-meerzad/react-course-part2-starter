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
