import React from 'react'
import { Link, List, ListItem, Box, Button, ListItemText } from '@mui/material'
import logoKairos from '../assets/logoKairosApp.png'

export default function Header({ onLoginClick, onSignupClick }) {
  return (
    <Box sx={{height: '64px' , width: '100vw', py: 1, bgcolor: '#002C15', position: 'fixed', zIndex: 1000, top: 0, left: 0}}>
      <Box sx={{display: 'flex', flexDirection: 'row', height: '40px', px: 3, justifyContent: 'space-between', alignItems: 'center'}}>
        <Link href="#">
          <Box
            component='img'
            src={logoKairos}
            alt='logo KAIROS'
            sx={{
              height: '40px'
            }}
          />
        </Link>
        <List sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 2 }}>
          <ListItem sx={{height: '40px', p: 1}}>
            <Link href="#" sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, color: "white", textDecorationColor: "white" }}>Help</Link>
          </ListItem>
          <ListItem sx={{height: '40px', p: 1}}>
            <Button variant='outlined'>
              <ListItemText 
                primary='Login'
                sx={{color: "white"}}
                onClick={onLoginClick}
              />
            </Button>
          </ListItem>
          <ListItem sx={{height: '40px', p: 1}}>
            <Button variant='contained'>
              <ListItemText 
                primary='Signup' 
                sx={{color: "white"}}
                onClick={onSignupClick}
              />
            </Button>
          </ListItem>
        </List>   
      </Box>
    </Box>
  )
}
