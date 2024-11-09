import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { Card, CardContent, Typography, Box, Button, Stack } from '@mui/material';
import { db } from '../config/firebaseConfig';
import { getAuth } from 'firebase/auth';

const ConnectedLeds = () => {
    const [leds, setLeds] = useState(null);

    const user = getAuth().currentUser;

    useEffect(() => {
        const ledsRef = ref(db, '/');
        onValue(ledsRef, (snapshot) => {
            const data = snapshot.val();
            setLeds(data);
        });
    }, []);

    if (!leds) {
        return <div>Loading...</div>;
    }

    const userLeds = Object.keys(leds).filter((ledId) => leds[ledId].user === user?.uid);

    const disconnectLed = (ledId) => {
        const ledRef = ref(db, `${ledId}`);
        set(ledRef, {
            ...leds[ledId],
            user: ""
        });
    };

    const updateMode = (ledId, mode) => {
        const ledRef = ref(db, `${ledId}`);
        set(ledRef, {
            ...leds[ledId],
            mode: mode
        });
    };

    if (userLeds.length === 0) {
        return <div>No LEDs connected to your account.</div>;
    }

    return (
        <div>
            {userLeds.map((ledId) => {
                const led = leds[ledId];
                return (
                    <Card sx={{ marginBottom: 2 }} key={ledId}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {ledId}
                            </Typography>
                            <Box sx={{ marginTop: 1 }}>
                                <Typography variant="body1">
                                    <strong>Intensity:</strong> {led.intensity}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Mode:</strong> {led.mode}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Status:</strong> {led.status}
                                </Typography>
                                <Stack direction="row" justifyContent="space-between" >
                                    <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
                                        <Button
                                            variant={led.mode === 0 ? "contained" : "outlined"}
                                            color="error"
                                            onClick={() => updateMode(ledId, 0)}
                                        >
                                            OFF
                                        </Button>
                                        <Button
                                            variant={led.mode === 1 ? "contained" : "outlined"}
                                            color="success"
                                            onClick={() => updateMode(ledId, 1)}
                                        >
                                            ON
                                        </Button>
                                        <Button
                                            variant={led.mode === 2 ? "contained" : "outlined"}
                                            color="warning"
                                            onClick={() => updateMode(ledId, 2)}
                                        >
                                            AUTO
                                        </Button>
                                    </Stack>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => disconnectLed(ledId)}
                                        sx={{ marginTop: 2 }}
                                    >
                                        Disconnect
                                    </Button>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default ConnectedLeds;
