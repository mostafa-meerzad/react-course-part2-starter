import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  // console.log(error);
  return (
    <>
      <h1>Oops...</h1>
      <p>{isRouteErrorResponse(error) ? "page not found": "something failed"}</p>
      {/* <p>Sorry, an unexpected error has occurred.</p> */}
    </>
  );
};

export default ErrorPage;
