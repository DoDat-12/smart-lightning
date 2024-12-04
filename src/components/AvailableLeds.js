import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { Button, Card, CardContent, Typography, Grid2, Stack } from '@mui/material';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const AvailableLeds = ({ groupId }) => {
    const [leds, setLeds] = useState([]);
    const user = getAuth().currentUser;

    useEffect(() => {
        if (groupId && user?.uid) {
            const ledsRef = ref(db, 'leds'); // eslint-disable-next-line
            onValue(ledsRef, (snapshot) => {
                const data = snapshot.val();
                const filteredLeds = Object.keys(data) // eslint-disable-next-line
                    .filter((ledId) => data[ledId].group_id === 0 && data[ledId].user === user?.email) // Only show user's LEDs with group_id = 0
                    .map((ledId) => ({ id: ledId, ...data[ledId] }));
                setLeds(filteredLeds);
            });
        } // eslint-disable-next-line
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
        return <div><Typography variant='caption'>No Available LEDs</Typography></div>;
    }

    return (
        <Grid2 marginTop={2} container spacing={3} direction={"row"}>
            {leds.map((led) => (
                <Card key={led.id} variant="elevation" style={{ backgroundColor: "#EB8317" }}
                    sx={{ height: 70, width: 300, borderRadius: 5 }}>
                    <CardContent>
                        <Stack direction={"row"} spacing={6} justifyContent={"space-between"} alignItems={"center"}>
                            <Stack direction={"row"} alignItems={"center"} color={"white"} spacing={1}>
                                <LightbulbIcon />
                                <Typography variant="h5" component="div" color='white'>
                                    {led.name}
                                </Typography>
                            </Stack>
                            <Button variant="text" onClick={() => connectLed(led.id)} color="success">
                                Connect
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Grid2>
    );
};

export default AvailableLeds;
