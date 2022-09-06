import { lazy, Suspense } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import "./App.css";

import CubeLoader from "./components/CubeLoader";

const routes = [
  {
    path: "/",
    exact: true,
    element: lazy(() => import("./pages/MainPage")),
  },
  {
    path: "/login",
    exact: true,
    element: lazy(() => import("./pages/LoginPage")),
  },
  {
    path: "/register",
    exact: true,
    element: lazy(() => import("./pages/RegisterPage")),
  },
  {
    path: "/setProfile",
    exact: true,
    element: lazy(() => import("./pages/SetProfilePage")),
  },
  {
    path: "/chat",
    exact: true,
    element: lazy(() => import("./pages/ChatPage")),
  },
];

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavContainer>
          <Link to="/" className='nav-link'>Home</Link>
          <Link to="/register" className='nav-link'>Register</Link>
          <Link to="/login" className='nav-link'>Login</Link>
          <Link to="/setProfile" className='nav-link'>SetProfile</Link>
          <Link to="/chat" className='nav-link'>Chat</Link>
        </NavContainer>
        <Routes>
          {routes.map((route, i) => {
            return (
              <Route
                key={i.toString() + route.path}
                path={route.path}
                element={
                  <Suspense fallback={<CubeLoader />}>
                    <route.element />
                  </Suspense>
                }
              />
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content:space-around ;
  .nav-link{
    font-size:2rem;
    margin-right:1rem;
  }
`;

export default App;
