import {NavLink, Outlet} from "react-router-dom";

function App() {

  return (
      <>
        <nav className="bg-slate-200 p-1 mt-2">
          <ul className="flex justify-center gap-4 my-3 text-2xl font-semibold uppercase">
            <li>
              <NavLink to='/play'>Play</NavLink>
            </li>
            <li>
              <NavLink to='/solve'>Solve</NavLink>
            </li>
          </ul>

        </nav>
        <Outlet></Outlet>
      </>
  )
}

export default App
