import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/LoginPage.module.css'; // Importing CSS module

function LoginPage ()
{
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ error, setError ] = useState( '' );
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || "/video";

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();
        setError( '' );
        const success = await login( email, password );
        if ( success )
        {
            navigate( from, { replace: true } );
        } else
        {
            setError( 'Login failed. Please check your credentials.' );
        }
    };

    return (
        <div className={ styles.container }>
            <h2 className={ styles.heading }>Login</h2>
            <form onSubmit={ handleSubmit }>
                <div className={ styles.formGroup }>
                    <label htmlFor="email" className={ styles.label }>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={ email }
                        onChange={ ( e ) => setEmail( e.target.value ) }
                        className={ styles.input }
                        required
                    />
                </div>
                <div className={ styles.formGroup }>
                    <label htmlFor="password" className={ styles.label }>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={ password }
                        onChange={ ( e ) => setPassword( e.target.value ) }
                        className={ styles.input }
                        required
                    />
                </div>
                { error && <p className={ styles.error }>{ error }</p> }
                <button type="submit" className={ styles.button }>Login</button>
            </form>
            <p className={ styles.loginLink }>
                Don't have an account?
                <button className={ styles.loginButton } onClick={ () => navigate( '/register' ) }>
                    Register here
                </button>
            </p>
        </div>
    );
}

export default LoginPage;
