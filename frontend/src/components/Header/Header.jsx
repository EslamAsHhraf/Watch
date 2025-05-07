import React from "react";
import styles from "./header.module.css"; // adjust this if your styles file is named differently
import { Link, useNavigate } from "react-router-dom";


import { useAuth } from '../../context/AuthContext';

const genreMap = {
  popular: "Popular",
  top_rated: "Top Rated",
  upcoming: "Upcoming",
};

export default function Header ()
{
  // const genre = useGenreStore( ( state ) => state.genre );
  // const setGenre = useGenreStore( ( state ) => state.setGenre );
  const navigate = useNavigate();

      const { user, logout } = useAuth();
  
  const handleLogout = () =>
  {
    logout();
    navigate( '/login' ); // Redirect to login after logout
  };
  return (
    <header className={ styles.container }>
      <Link to="/" className={ styles.home }>
        <img src="/popcorn.png" alt="logo" width={ 50 } height={ 50 } />
        <h2>Watch</h2>
      </Link>

      <nav className={ styles.navigators }  aria-label="Main navigation">
        <div>
          <button className={ styles.logout }  onClick={ handleLogout }>Logout</button>
        </div>
      </nav>
    </header>
  );
}
