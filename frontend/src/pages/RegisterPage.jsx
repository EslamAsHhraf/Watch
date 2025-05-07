import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from '../styles/RegisterPage.module.css'; // 👈 Import CSS module

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await api.post('/auth/register', { email, password });
            setMessage(response.data.message + ". Please log in.");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error("Registration error:", err.response || err);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.message}>{message}</p>}
                <button type="submit" className={styles.button}>Register</button>
            </form>
            <div className={styles.loginLink}>
                <p>Already have an account? <button onClick={() => navigate('/login')} className={styles.loginButton}>Login here</button></p>
            </div>
        </div>
    );
}

export default RegisterPage;
