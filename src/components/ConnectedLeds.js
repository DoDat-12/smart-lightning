import React, { useEffect, useState } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { Card, CardContent, Typography, Stack, Grid2, ToggleButtonGroup, ToggleButton, Box, Button, Slider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip } from '@mui/material';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';

const ConnectedLeds = ({ groupId }) => {
    const [leds, setLeds] = useState([]);
    const user = getAuth().currentUser;
    const [selectedOption, setSelectedOption] = useState('OFF');
    const [threshold, setThreshold] = useState(2000);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [healthyCount, setHealthyCount] = useState(0);
    const [unhealthyCount, setUnhealthyCount] = useState(0);

    const handleChange = (event, newOption) => {
        if (newOption !== null) {
            setSelectedOption(newOption);

            const modeValue = newOption === 'ON' ? 1 : newOption === 'OFF' ? 0 : 2;

            // Update mode for all LEDs in the selected group
            leds.forEach((led) => {
                const ledRef = ref(db, `leds/${led.id}`);
                set(ledRef, {
                    ...led,
                    mode: modeValue,
                });
            });
        }
    };

    const handleSliderChange = (sliderEvent, newThreshold) => {
        setThreshold(newThreshold);
        updateThresholdInDatabase(newThreshold);
    };

    const updateThresholdInDatabase = (newThreshold) => {
        leds.forEach((led) => {
            const ledRef = ref(db, `leds/${led.id}`);
            set(ledRef, {
                ...led,
                threshold: newThreshold,
            });
        });
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteGroup = () => {
        const groupRef = ref(db, `groups/${groupId}`);
        remove(groupRef)
            .then(() => {
                setOpenDeleteDialog(false);
            })
            .catch((error) => {
                console.error("Error deleting group: ", error);
            })
    };

    useEffect(() => {
        if (groupId) {
            const ledsRef = ref(db, 'leds');
            onValue(ledsRef, (snapshot) => {
                const data = snapshot.val();
                const filteredLeds = Object.keys(data)
                    .filter((ledId) =>
                        data[ledId].group_id.toString() === groupId &&
                        data[ledId].user === user?.email
                    )
                    .map((ledId) => ({ id: ledId, ...data[ledId] }));
                setLeds(filteredLeds);
            });
        }
    }, [groupId, user]);

    useEffect(() => {
        if (leds.length > 0) {
            const healthy = leds.filter(led => led.mode === led.status).length;
            const unhealthy = leds.length - healthy;

            setHealthyCount(healthy);
            setUnhealthyCount(unhealthy);
        }
    }, [leds]);

    const disconnectLed = (ledId) => {
        const ledRef = ref(db, `leds/${ledId}`);
        set(ledRef, {
            ...leds.find((led) => led.id === ledId),
            group_id: 0,
        });
    };

    const renderLedList = (leds) => {
        return leds.map((led) => (
            <Typography key={led.id} variant="body2">
                {led.name} (ID: {led.id})
            </Typography>
        ));
    };

    if (leds.length === 0 && groupId !== null) {
        return (
            <div>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography>No Connected LEDs for this group.</Typography>
                    <Typography color="error" onClick={handleOpenDeleteDialog}
                        sx={{ cursor: 'pointer' }}>
                        Delete this group?
                    </Typography>
                </Stack>

                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>
                        Confirm Delete Group
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this group? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                        <Button onClick={handleDeleteGroup} autoFocus>
                            Delete group
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    if (leds.length > 0) {
        return (
            <Stack spacing={5}>
                <Stack spacing={2}>
                    <Stack spacing={5} direction={"row"} alignItems={"normal"}>
                        <Stack direction={"row"} spacing={3} alignItems={"center"}>
                            <Typography variant="h6">Mode</Typography>
                            <ToggleButtonGroup value={selectedOption} exclusive onChange={handleChange}>
                                <ToggleButton value="ON" sx={{ width: 100 }}>
                                    ON
                                </ToggleButton>
                                <ToggleButton value="OFF" sx={{ width: 100 }}>
                                    OFF
                                </ToggleButton>
                                <ToggleButton value="AUTO" sx={{ width: 100 }}>
                                    AUTO
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>
                    </Stack>
                    <Stack direction={"column"} spacing={2}>
                        <Typography variant='h6'>Intensity threshold: {threshold}</Typography>
                        <Slider
                            value={threshold}
                            onChange={handleSliderChange}
                            defaultValue={2000}
                            valueLabelDisplay="auto"
                            min={0}
                            max={4000}
                            step={100}
                            sx={{ width: 300 }}
                        />

                    </Stack>
                    <Stack direction={"row"} spacing={8}>
                        <Stack direction={"row"} spacing={1}>
                            <Typography variant="button" color="success.main">
                                Healthy LEDs: {healthyCount}
                            </Typography>
                            <Tooltip
                                title={
                                    <Box>
                                        <Typography variant="subtitle1">Healthy LEDs:</Typography>
                                        {renderLedList(leds.filter((led) => led.mode === led.status))}
                                    </Box>
                                }
                                arrow
                            >
                                <HelpOutlinedIcon sx={{ color: "success.main", cursor: "pointer", height: 18 }} />
                            </Tooltip>
                        </Stack>
                        <Stack direction={"row"} spacing={1}>
                            <Typography variant="button" color="error.main">
                                Unhealthy LEDs: {unhealthyCount}
                            </Typography>
                            <Tooltip
                                title={
                                    <Box>
                                        <Typography variant="subtitle1">Unhealthy LEDs:</Typography>
                                        {renderLedList(leds.filter((led) => led.mode !== led.status))}
                                    </Box>
                                }
                                arrow
                            >
                                <HelpOutlinedIcon sx={{ color: "error.main", cursor: "pointer", height: 18 }} />
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Stack>

                <Grid2 container spacing={3} direction={"row"}>
                    {leds.map((led) => (
                        <Card key={led.id} variant="elevation" sx={{ height: 190, width: 500, borderRadius: 5 }}>
                            {/* header */}
                            <Box sx={{ backgroundColor: "#EB8317", p: 2, color: "#F4F6FF" }}>
                                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                        <LightbulbIcon />
                                        <Typography variant="h5" component="div">{led.name}</Typography>
                                    </Stack>
                                </Stack>
                            </Box>

                            <CardContent>
                                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"end"}>
                                    <Stack direction={"column"} p={1}>
                                        <Typography>
                                            Led ID: {led.id}
                                        </Typography>
                                        <Typography>
                                            Status: {led.status === 0 ? "OFF" : "ON"}
                                        </Typography>
                                        <Typography>
                                            Intensity: {led.intensity}
                                        </Typography>
                                    </Stack>
                                    <Button variant="contained" onClick={() => disconnectLed(led.id)}>DISCONNECT</Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Grid2>
            </Stack>
        );
    }
};

export default ConnectedLeds;


// <Button variant="contained" color="error" sx={{ width: 100 }}
// onClick = {() => disconnectLed(led.id)}>
//     Disconnect
