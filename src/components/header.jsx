import { Link } from "react-router-dom";
import React, {useState, useEffect} from 'react';

function Header(props) {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('role');
    props.data?.length ? setUserRole(props.data) : setUserRole(data);
  }, [props.data, userRole]);

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link to="/home" className="navbar-brand " >Food Donation Locator</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="home" className="nav-link">
                Home
              </Link>
            </li>
            { userRole === 'admin' &&
              <li className="nav-item">
              <Link to="adminPortal" className="nav-link">
                Admin Portal
              </Link>
            </li>
            }
            <li className="nav-item">
              <Link to="foodbank-locator" className="nav-link">
                Food Bank Locator
              </Link>
            </li>
            <li className="nav-item">
              <Link to="donations" className="nav-link">
                Donations
              </Link>
            </li>
            <li className="nav-item">
              <Link to="logout" className="nav-link">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Header;
