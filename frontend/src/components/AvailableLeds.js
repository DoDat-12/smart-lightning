import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { Button, Card, CardContent, Typography, Grid2 } from '@mui/material';
import { db } from '../config/firebaseConfig';
import { getAuth } from 'firebase/auth';

const AvailableLed = () => {
    const [leds, setLeds] = useState(null);

    useEffect(() => {
        const ledsRef = ref(db, '/');
        onValue(ledsRef, (snapshot) => {
            const data = snapshot.val();
            setLeds(data);
        });
    }, []);

    const connectLed = (ledId) => {
        const user = getAuth().currentUser;
        if (user) {
            const userId = user.uid;  // user UID
            console.log(`Connecting to ${ledId} as user ${userId}`);

            const ledRef = ref(db, `${ledId}`);
            set(ledRef, {
                ...leds[ledId],
                user: userId
            });
        } else {
            console.log("No user logged in");
        }
    };

    if (!leds) {
        return <div>Loading...</div>;
    }

    // LED with user === ""
    const availableLeds = Object.keys(leds).filter((ledId) => leds[ledId].user === "");

    if (availableLeds.length === 0) {
        return <div>No Led Available</div>;
    }

    return (
        <div>
            <Grid2 container spacing={2}>
                {availableLeds.map((ledId) => {
                    // const led = leds[ledId];
                    return (
                        <Grid2 item xs={12} sm={6} md={4} lg={3} key={ledId}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6">{ledId}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => connectLed(ledId)}
                                    >
                                        Connect
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid2>
                    );
                })}
            </Grid2>
        </div>
    );
};

export default AvailableLed;
