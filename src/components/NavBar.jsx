import { NavLink } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className='navbar-logo'>CREATORVERSE</h1>
                <div className="nav-links">
                    <NavLink to="/" role="button">
                        View all creators
                    </NavLink>
                    <NavLink to="/new" role="button">
                        Add a creator
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;