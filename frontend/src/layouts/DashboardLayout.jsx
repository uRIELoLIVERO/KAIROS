// src/layouts/DashboardLayout.jsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/SideBar'
import { Box } from '@mui/material'

export default function DashboardLayout() {
  const [open, setOpen] = useState(true)
  
  const drawerWidth = open ? 260 : 64

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar open={open} setOpen={setOpen} />
      <Box
        component="main" 
        sx={{ 
          flexGrow: 1, 
          padding: '1rem',
          marginLeft: `${drawerWidth}px`,
          transition: 'margin-left 0.3s ease',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box >
    </Box>
  )
}
