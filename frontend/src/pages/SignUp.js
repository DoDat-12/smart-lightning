import React, { useState } from 'react';
import { TextField, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { set, ref } from 'firebase/database';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(db, `users/${user.uid}`), {
                name: name,
                mail: email
            });

            setSuccess('Account created successfully! You can now log in.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('Failed to create account. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: '100px' }}>
            <Stack alignItems={"center"}>
                <Typography variant="h4" gutterBottom>Sign Up</Typography>
                <form onSubmit={handleSignUp}>
                    <TextField
                        label="Name"
                        type="text"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
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
                    {success && <Typography color="success">{success}</Typography>}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        style={{ marginTop: '20px' }}
                    >
                        Sign Up
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        style={{ marginTop: '20px' }}
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </Button>
                </form>
            </Stack>
        </div>
    );
};

export default SignUp;