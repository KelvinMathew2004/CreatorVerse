import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className='navbar-logo'>CREATORVERSE</h1>
                <div className="nav-links">
                    <NavLink to="/" role="button">
                        VIEW ALL CREATORS
                    </NavLink>
                    <NavLink to="/new" role="button">
                        ADD A CREATOR
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;