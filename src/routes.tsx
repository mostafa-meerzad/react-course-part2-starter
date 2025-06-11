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
