import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { Card, CardContent, Typography, Button, Stack, Switch } from '@mui/material';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const ConnectedLeds = ({ groupId }) => {
    const [leds, setLeds] = useState([]);
    const user = getAuth().currentUser;

    useEffect(() => {
        if (groupId) {
            const ledsRef = ref(db, 'leds');
            onValue(ledsRef, (snapshot) => {
                const data = snapshot.val();
                const filteredLeds = Object.keys(data)
                    .filter((ledId) =>
                        data[ledId].group_id.toString() === groupId &&
                        data[ledId].user === user?.uid
                    ) // Only show LEDs belonging to current group and logged-in user
                    .map((ledId) => ({ id: ledId, ...data[ledId] }));
                setLeds(filteredLeds);
            });
        }
    }, [groupId, user]);

    const disconnectLed = (ledId) => {
        const ledRef = ref(db, `leds/${ledId}`);
        set(ledRef, {
            ...leds.find((led) => led.id === ledId),
            group_id: 0,
        });
    };

    if (leds.length === 0) {
        return <div>No Connected LEDs for this group.</div>;
    }

    return (
        <Stack spacing={3} direction={"row"}>
            {leds.map((led) => (
                <Card key={led.id} variant="elevation" style={{ backgroundColor: "#EB8317" }}
                    sx={{ height: 150, width: 200, borderRadius: 5 }}>
                    <CardContent>
                        <Stack direction={"column"} spacing={6}>
                            <Stack paddingInline={1} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <LightbulbIcon sx={{ color: "#F4F6FF" }} />
                                <Switch />
                            </Stack>
                            <Stack paddingLeft={1} direction={"row"} alignItems={"baseline"} spacing={1}>
                                <Typography variant="h5" component="div" color='white'>
                                    {led.name}
                                </Typography>
                                <Typography gutterBottom sx={{ color: '#fdbdbd', fontSize: 14 }}>
                                    #{led.id}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
};

export default ConnectedLeds;


// <Button variant="contained" color="error" sx={{ width: 100 }}
// onClick = {() => disconnectLed(led.id)}>
//     Disconnect
