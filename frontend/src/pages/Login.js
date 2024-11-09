// src/Login.js
import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: '50px' }}>
            <Typography variant="h4" gutterBottom>Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginTop: '20px' }}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    style={{ marginTop: '20px' }}
                >
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;
