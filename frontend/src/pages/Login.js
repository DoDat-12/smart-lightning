// src/Login.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Stack, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (isAdmin) {
                if (email !== 'admin@gmail.com') {
                    setError('Only admin can login as admin');
                    return;
                } else {
                    navigate('/admin');
                }
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: '100px' }}>
            <Stack alignItems={"center"}>
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                        }
                        label="Login as Admin"
                        style={{ marginTop: '20px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        style={{ marginTop: '20px' }}
                    >
                        Login
                    </Button>
                    <Stack direction={"row"} spacing={1} alignItems={"center"} marginTop={"20px"}>
                        <Typography>Need an account?</Typography>
                        <Typography
                            variant="body2"
                            color="primary"
                            style={{ textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </Typography>
                    </Stack>
                </form>
            </Stack>
        </div>
    );
};

export default Login;
