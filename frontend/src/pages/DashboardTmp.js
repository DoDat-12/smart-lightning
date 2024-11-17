import React, { useState } from 'react';
import { Typography, Stack, Box } from '@mui/material';
import Header from '../components/Header';
import Group from '../components/Group';
import AvailableLeds from '../components/AvailableLeds';
import ConnectedLeds from '../components/ConnectedLeds';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const DashboardTmp = () => {
    const user = auth.currentUser;
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const navigate = useNavigate();

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
