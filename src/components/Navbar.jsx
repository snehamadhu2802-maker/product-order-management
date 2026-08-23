import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <NavLink to="/"
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2">
          <i className="bi bi-bag-heart-fill"></i>SimpleGoods 
        </NavLink>

        {/* Mobile Button */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"
        aria-controls="mainNavbar" aria-expanded="false"aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse"id="mainNavbar">
          <div className="navbar-nav ms-auto">
            <NavLink to="/" className={({ isActive }) =>
            `nav-link px-3 ${isActive ? "active fw-bold text-warning" : ""
                }`
              }
            >Dashboard
            </NavLink>

            <NavLink
              to="/products" className={({ isActive }) =>
                `nav-link px-3 ${isActive ? "active fw-bold text-warning" : ""
                }`
              }
            >Products
            </NavLink>

            <NavLink
              to="/orders" className={({ isActive }) =>
                `nav-link px-3 ${isActive ? "active fw-bold text-warning" : ""
                }`
              }
            >Orders
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;