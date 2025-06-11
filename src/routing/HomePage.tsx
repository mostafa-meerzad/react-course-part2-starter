import { Link, useRouteError } from "react-router-dom";

const HomePage = () => {
throw new Error("something went wrong");
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,
        mollitia!
      </p>
      <Link to="/users">Users</Link> <Link to="/contact">Contact</Link>
    </>
  );
};

export default HomePage;
