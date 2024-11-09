import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { Typography, Stack, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AvailableLeds from '../components/AvailableLeds';
import ConnectedLeds from '../components/ConnectedLeds';
import { faker } from '@faker-js/faker';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        auth.signOut();
        navigate('/login');
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    if (!user) {
        navigate('/login');
    }

    return (
        <div style={{ padding: '20px' }}>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">Smart Lightning System</Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {user && <Typography variant="h6">{user.email}</Typography>}
                        <Avatar
                            src={faker.image.avatar()}
                            onClick={handleMenuClick}  // open menu
                            sx={{ cursor: 'pointer' }}  // cursor pointer
                        />
                    </Stack>
                </Stack>

                <Typography variant="h6">Available Leds</Typography>
                <AvailableLeds />

                <Typography variant="h6">Connected Leds</Typography>
                <ConnectedLeds />

                {/* <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Logout
                </Button> */}

                {/* Menu for Avatar */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>  {/* Logout menu item */}
                </Menu>
            </Stack>
        </div>
    );
};

export default Dashboard;
