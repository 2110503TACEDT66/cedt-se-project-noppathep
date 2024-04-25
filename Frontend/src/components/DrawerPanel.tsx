"use client"
import React, { useState } from 'react';
import { Drawer, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import CloseIcon from '@mui/icons-material/Close';

export default function DrawerPanel ({children}:{children:React.ReactNode}) {

  const [open, setOpen] = useState(false);
  const toggleDrawerOpen = ()=> setOpen(!open)

  return (
    <>
      <div className='w-fit mr-auto flex flex-row'>
        <Button onClick={toggleDrawerOpen}>
          <MenuIcon className='text-black' fontSize='large'/>
        </Button>
      </div>

      <Drawer anchor="left" open={open} onClose={toggleDrawerOpen} sx={{
        '& .MuiDrawer-paper': {
          backgroundColor:"#101010",
          width:'80%',
        },
      }}
      >
        <div className="flex flex-col justify-center first:items-start items-center py-2 gap-y-5">
          <Button onClick={toggleDrawerOpen}>
            <CloseIcon className='text-gray-100 ml-5' fontSize='large' />
          </Button>
          {children}
        </div>
      </Drawer>
    </>
  );
};