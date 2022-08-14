import { lazy, Suspense } from 'react';
import './App.css';

import {  Link, Route, Routes } from 'react-router-dom';
import CubeLoader from './components/CubeLoader';
// import MainPage from './pages/MainPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';

const routes = [
  {
    path: '/',
    exact: true,
    element: lazy(() => import('./pages/MainPage')),
  },
  {
    path: '/login',
    exact: true,
    element: lazy(() => import('./pages/LoginPage')),
  },
  {
    path: '/register',
    exact: true,
    element: lazy(() => import('./pages/RegisterPage')),
  },
  {
    path: '/setProfile',
    exact: true,
    element: lazy(() => import('./pages/SetProfilePage')),
  },
];

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/setProfile">setProfile</Link></li>
          
        </ul>
      </nav>
      <Routes>
        {routes.map((route, i) => {
          return (
            <Route
              key={i.toString() + route.path}
              path={route.path}
              element={
                <Suspense fallback={<CubeLoader/>}>
                  <route.element />
                </Suspense>
              }
            />
          );
        })}
      </Routes>
    </div>
  );
}

export default App
