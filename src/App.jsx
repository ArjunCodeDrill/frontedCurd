import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import ProductList from "./components/ProductList/ProductList";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Signup";

function App() {
   const router = createBrowserRouter([
     {
       path: "/",
       element: <Signin />,
     },
     {
       path: "/sign-up",
       element: <Signup />,
     },
     {
       path: "/product-list",
       element: <ProductList />,
     },
   ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
