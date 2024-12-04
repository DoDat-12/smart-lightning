import React from 'react';
import { AppBar, Toolbar, Typography, Stack, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import DehazeRoundedIcon from '@mui/icons-material/DehazeRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Header = ({ user }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

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

    return (
        <AppBar position="fixed" sx={{ width: '100vw', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#10375C" }}>
            <Toolbar>
                <IconButton sx={{ marginRight: 2, color: '#F4F6FF' }}>
                    <DehazeRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }} color='#F4F6FF'>
                    Smart Lightning System
                </Typography>
                {user && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body1">{user.email}</Typography>
                        <Avatar
                            onClick={handleMenuClick}
                            sx={{ cursor: 'pointer' }}
                        >
                            <AccountCircleRoundedIcon />
                        </Avatar>

                    </Stack>
                )}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
