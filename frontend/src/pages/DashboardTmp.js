import React, { useState, useEffect } from 'react';
import { Typography, Stack, Box } from '@mui/material';
import Header from '../components/Header';
import Group from '../components/Group';
import AvailableLeds from '../components/AvailableLeds';
import ConnectedLeds from '../components/ConnectedLeds';
import { auth } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';

const DashboardTmp = () => {
    const user = auth.currentUser;
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch groups from Firebase
        const groupsRef = ref(db, 'groups');
        onValue(groupsRef, (snapshot) => {
            if (snapshot.exists()) {
                const groups = snapshot.val();
                const userGroups = Object.keys(groups)
                    .map((key) => ({ id: key, ...groups[key] })) // eslint-disable-next-line
                    .filter((group) => group.user === user.email)
                    .sort((a, b) => a.id.localeCompare(b.id)); // Sort by id

                if (userGroups.length > 0) {
                    setSelectedGroupId(userGroups[0].id); // Set the smallest group ID
                }
            }
        });
    }, [user, navigate]);

    if (!user) {
        navigate('/login');
    }

    return (
        <Stack sx={{ background: "#F4F6FF", height: "100vh" }}>
            <Header user={user} />
            <Stack sx={{ padding: '100px 100px 100px' }}>
                <Typography variant="h4">Smart Lighting System</Typography>

                <Box sx={{ marginTop: 3, marginBottom: 3 }}>
                    <Group onGroupChange={setSelectedGroupId} />
                </Box>

                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack spacing={4}>
                        <Stack>
                            {/* <Typography variant="h6">Connected LEDs</Typography> */}
                            <ConnectedLeds groupId={selectedGroupId} />
                        </Stack>
                        <Stack>
                            <Typography variant="h6">Available LEDs</Typography>
                            <AvailableLeds groupId={selectedGroupId} />
                        </Stack>
                    </Stack>

                </Stack>
            </Stack>
        </Stack>

    );
};

export default DashboardTmp;
