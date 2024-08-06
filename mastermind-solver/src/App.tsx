import {NavLink, Outlet} from "react-router-dom";

function App() {

  return (
      <div className="app">
          <div className="navbar">
              <nav>
                  <ul className="">
                      <li>
                          <NavLink to='/play'>Play</NavLink>
                      </li>
                      <li>
                          <NavLink to='/solve'>Solve</NavLink>
                      </li>
                      <li>
                          <NavLink to='/info'>Info</NavLink>
                      </li>
                  </ul>
              </nav>
          </div>

          <div className="app-child">
              <Outlet></Outlet>
          </div>
      </div>
  )
}

export default App
