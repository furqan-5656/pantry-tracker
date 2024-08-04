'use client';

import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Stack, Typography, Button, Modal, TextField, AppBar, Toolbar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HomeIcon from '@mui/icons-material/Home'; // Import HomeIcon
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // State to track the selected item

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" bgcolor={'rgb(202, 202, 202)'}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home" sx={{ mr: 2 }}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        width="100%"
        height="calc(100vh - 64px)"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        paddingTop={2}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={inventory} // Pass the entire item object
          getOptionLabel={(option) => `${option.name} `} // Customize the label
          sx={{ width: 800 }}
          renderInput={(params) => <TextField {...params} label="Search Item" />}
          onChange={(event, value) => {
            setItemName(value ? value.name : '');
            setSelectedItem(value); // Set the selected item
          }}
        />
        {selectedItem && (
          <Box
            mt={2}
            p={2}
            border="4px solid #333"
            borderRadius="4px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="800px"
            bgcolor="#f0f0f0"
          >
            <Typography variant="h6">
              {selectedItem.name.charAt(0).toUpperCase() + selectedItem.name.slice(1)}
            </Typography>
            <Typography variant="h6">Quantity: {selectedItem.quantity}</Typography>
          </Box>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Box border={'2px solid #333'}>
          <Box
            width="800px"
            height="100px"
            bgcolor={'#000'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'white'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
            {inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button color="error" variant="contained" startIcon={<DeleteIcon />} onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
        <Button size='large' startIcon={<CloudUploadIcon />} paddingY={3} color="success" sx={{ width: 800 }} variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
      </Box>
    </Box>
  );
}
