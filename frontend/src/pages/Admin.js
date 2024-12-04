import React, { useEffect, useState } from 'react';
import { Typography, Stack, Button, Grid2 } from '@mui/material';
// import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Header from '../components/Header';
import { auth, db } from '../firebaseConfig';
import { ref, get, update } from 'firebase/database';
// import { deleteUser, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    // Check logined
    const user = auth.currentUser;
    const navigate = useNavigate();
    if (!user) {
        navigate('/login');
    }

    const [users, setUsers] = useState([]);
    const [leds, setLeds] = useState([]);
    const [loading, setLoading] = useState(true);

    // const [openAddDialog, setOpenAddDialog] = useState(false);
    // const [newUser, setNewUser] = useState({
    //     mail: '',
    //     password: '',
    //     name: ''
    // });

    // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    // const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch users
            const usersRef = ref(db, 'users');
            // Fetch leds
            const ledsRef = ref(db, 'leds');
            try {
                const userSnapshot = await get(usersRef);
                const ledSnapshot = await get(ledsRef);

                if (userSnapshot.exists() && ledSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    const ledData = ledSnapshot.val();

                    // Map users
                    const userList = Object.keys(userData).map((key) => ({
                        id: key,
                        ...userData[key],
                    }));

                    // Map LEDs
                    const ledList = Object.keys(ledData).map((key) => ({
                        id: key,
                        ...ledData[key],
                    }));

                    setUsers(userList);
                    setLeds(ledList);
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error("Error fetching users: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleRemoveLed = async (ledId) => {
        try {
            const ledRef = ref(db, `leds/${ledId}`);
            await update(ledRef, { user: "" });
            setLeds((prevLeds) =>
                prevLeds.map((led) =>
                    led.id === ledId ? { ...led, user: "" } : led)
            );
        } catch (error) {
            console.error("Error removing LED: ", error);
        }
    };

    const handleAssignLed = async (ledId, userMail) => {
        try {
            const ledRef = ref(db, `leds/${ledId}`);
            await update(ledRef, { user: userMail });
            setLeds((prevLeds) =>
                prevLeds.map((led) =>
                    led.id === ledId ? { ...led, user: userMail } : led)
            );
        } catch (error) {
            console.error("Error assigning LED: ", error);
        }
    };

    // const handleAddUser = async () => {
    //     const { email, password, name } = newUser;
    //     const currentUser = auth.currentUser;
    //     const currentUserId = auth.currentUser?.uid;

    //     try {
    //         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //         const uid = userCredential.user.uid;

    //         const userRef = ref(db, `users/${uid}`);

    //         await set(userRef, {
    //             mail: email,
    //             name: name
    //         });

    //         setUsers((prevUsers) => [
    //             ...prevUsers.filter(user => user.id !== currentUserId),
    //             { id: uid, name, mail: email }
    //         ]);

    //         setOpenAddDialog(false);
    //     } catch (error) {
    //         console.error("Error adding user:", error.message);
    //     }

    //     await signInWithEmailAndPassword(auth, currentUser.email, currentUser.password);
    // };

    // const handleDeleteUser = async () => {
    //     const auth = getAuth();
    //     // const user = auth.currentUser;
    //     try {
    //         const userRef = ref(db, `users/${userToDelete.id}`);
    //         await remove(userRef);

    //         const userAuth = await auth.getUser(userToDelete.id);
    //         await deleteUser(userAuth);

    //         setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));

    //         setOpenDeleteDialog(false);
    //     } catch (error) {
    //         console.error("Error deleting user:", error.message);
    //     }
    // };

    return (
        <div sx={{ background: "#F4F6FF", height: "100vh" }}>
            <Header user={user} />
            <Stack sx={{ padding: '100px 100px 100px' }}>
                <Stack marginBottom={'20px'}>
                    <Typography variant="h4">Admin Panel</Typography>
                    <Typography variant="h6">Welcome, Admin</Typography>
                </Stack>

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <Stack spacing={2}>
                        {/* <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginBottom: "20px", width: "150px" }}
                            onClick={() => setOpenAddDialog(true)}
                        >
                            Add User
                        </Button> */}
                        {users.map(user => (
                            <Stack sx={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", width: '60%' }}>
                                <Stack direction={"row"} justifyContent={"space-between"}>
                                    <Typography variant="h6">{user.name}</Typography>
                                    {/* Show Delete User Button if No LEDs Assigned */}
                                    {/* {leds.filter((led) => led.user === user.mail).length === 0 && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{ width: "150px" }}
                                            onClick={() => {
                                                setUserToDelete(user);
                                                setOpenDeleteDialog(true);
                                            }}
                                        >
                                            Delete User
                                        </Button>
                                    )} */}
                                </Stack>
                                <Typography>Email: {user.mail}</Typography>
                                <Typography>Leds assigned:</Typography>
                                <Grid2 container spacing={2} marginLeft={"10px"}>
                                    {leds.filter((led) => led.user === user.mail).length > 0 ? (
                                        leds
                                            .filter((led) => led.user === user.mail)
                                            .map((led) => (
                                                <Stack
                                                    key={led.id} alignItems="center" justifyContent="space-between" direction={"row"}
                                                    sx={{
                                                        border: "1px solid #aaa",
                                                        padding: "10px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "#fff",
                                                        width: "150px",
                                                    }}>
                                                    <Typography variant="body1">{led.name}</Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleRemoveLed(led.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Stack>
                                            ))) : (
                                        <Typography>No leds assigned</Typography>
                                    )}
                                </Grid2>
                                <Typography>Leds unassigned:</Typography>
                                <Grid2 container spacing={2} marginLeft={"10px"}>
                                    {leds.filter((led) => led.user === "").length > 0 ? (
                                        leds
                                            .filter((led) => led.user === "")
                                            .map((led) => (
                                                <Stack
                                                    key={led.id} alignItems="center" justifyContent="space-between" direction={"row"}
                                                    sx={{
                                                        border: "1px solid #aaa",
                                                        padding: "10px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "#fff",
                                                        width: "150px",
                                                    }}>
                                                    <Typography variant="body1">{led.name}</Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleAssignLed(led.id, user.mail)}
                                                    >
                                                        Assign
                                                    </Button>
                                                </Stack>
                                            ))) : (
                                        <Typography>No leds unassigned</Typography>
                                    )}
                                </Grid2>
                            </Stack>
                        ))}
                    </Stack>)}
            </Stack>

            {/* Add User */}
            {/* <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <TextField
                        label="Password"
                        fullWidth
                        type="password"
                        margin="normal"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleAddUser} color="primary">Add</Button>
                </DialogActions>
            </Dialog> */}

            {/* Delete User */}
            {/* <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteUser} color="error">Delete</Button>
                </DialogActions>
            </Dialog> */}
        </div>
    );
};

export default Admin;
