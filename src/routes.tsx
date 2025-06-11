import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routing/HomePage";
import UserListPage from "./routing/UserListPage";
import ContactPage from "./routing/ContactPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/users", element: <UserListPage /> },
  {path: "/contact", element: <ContactPage/>}
]);

export default router;
