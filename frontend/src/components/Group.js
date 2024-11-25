import React, { useEffect, useState } from 'react';
import { Tabs, Tab, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Stack, Button, DialogContentText, Tooltip } from '@mui/material';
import { ref, onValue, set, get } from 'firebase/database';
import { db } from '../firebaseConfig';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const Group = ({ onGroupChange }) => {
    const [groups, setGroups] = useState([]);
    const [value, setValue] = useState(0); // Default to the first group (group_id = 1)
    const [openDialog, setOpenDialog] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    // Fetch groups from Firebase
    useEffect(() => {
        const groupsRef = ref(db, 'groups');
        onValue(groupsRef, (snapshot) => {
            const data = snapshot.val();
            // Convert the groups object into an array of [groupId, groupName]
            const groupArray = Object.keys(data).map((key) => ({
                groupId: key,
                groupName: data[key].group_name
            }));
            setGroups(groupArray);

            // Set the default group to group_id = 1 (if available)
            const defaultGroupIndex = groupArray.findIndex(group => group.groupId === '1');
            if (defaultGroupIndex !== -1) {
                setValue(defaultGroupIndex);
                onGroupChange(groupArray[defaultGroupIndex].groupId);
            }
        });
    }, [onGroupChange]);

    // Handle tab change
    const handleChange = (event, newValue) => {
        setValue(newValue);
        // Pass selected group_id to the parent component
        onGroupChange(groups[newValue].groupId);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewGroupName('');
    };

    const handleAddGroup = () => {
        const groupsRef = ref(db, 'groups');
        get(groupsRef).then((snapshot) => {
            const data = snapshot.val();
            const groupIds = Object.keys(data);
            const newGroupId = Math.max(...groupIds.map(id => parseInt(id))) + 1;

            // Add the new group to Firebase
            const newGroup = {
                group_id: newGroupId,
                group_name: newGroupName
            };
            set(ref(db, `groups/${newGroupId}`), newGroup)
                .then(() => {
                    // Close the dialog and reset the input field
                    setNewGroupName('');
                    handleCloseDialog();
                });
        });
    };

    return (
        <div>
            <Stack direction={"row"} spacing={1}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ marginBottom: 2 }}
                >
                    {groups.map((group, index) => (
                        <Tab key={group.groupId} label={group.groupName} />
                    ))}
                </Tabs>
                <Tooltip title="Add new group">
                    <IconButton
                        color="primary"
                        onClick={handleOpenDialog}
                    >
                        <AddBoxOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}>
                <DialogTitle>Add new group</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add new group, please enter your group's name here.
                    </DialogContentText>
                    <TextField
                        required
                        margin="dense"
                        label="Group name"
                        value={newGroupName}
                        fullWidth
                        variant="standard"
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button type="submit" onClick={handleAddGroup}>Add group</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Group;
