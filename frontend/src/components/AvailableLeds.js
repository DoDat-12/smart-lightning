import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const AvailableLeds = ({ groupId }) => {
    const [leds, setLeds] = useState([]);
    const user = getAuth().currentUser;

    useEffect(() => {
        if (groupId && user?.uid) {
            const ledsRef = ref(db, 'leds');
            onValue(ledsRef, (snapshot) => {
                const data = snapshot.val();
                const filteredLeds = Object.keys(data)
                    .filter((ledId) => data[ledId].group_id === 0 && data[ledId].user === user?.uid) // Only show user's LEDs with group_id = 0
                    .map((ledId) => ({ id: ledId, ...data[ledId] }));
                setLeds(filteredLeds);
            });
        }
    }, [groupId, user?.uid]);

    const connectLed = (ledId) => {
        if (user) {
            // const userId = user.uid;
            const ledRef = ref(db, `leds/${ledId}`);
            set(ledRef, {
                ...leds.find((led) => led.id === ledId),
                group_id: Number(groupId),
            });
        }
    };

    if (leds.length === 0) {
        return <div>No Available LEDs</div>;
    }

    return (
        <Grid container spacing={2}>
            {leds.map((led) => (
                <Grid item xs={12} sm={6} md={4} key={led.id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{led.id}</Typography>
                            <Button variant="contained" onClick={() => connectLed(led.id)}>
                                Connect
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default AvailableLeds;
