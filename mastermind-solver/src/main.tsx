import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import './index.css'
import Play from "./components/Play.tsx";
import Solve from "./components/Solve.tsx";
import Info from "./components/Info.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {index: true, element: <Navigate replace to='/Play' />},
            {path: '/play', element: <Play />},
            {path: '/solve', element: <Solve />},
            {path: '/info', element: <Info />},
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)