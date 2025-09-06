import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Avatar,
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
  Apartment,
  Badge,
  HelpOutline,
  Settings,
  Logout,
} from '@mui/icons-material'
import logoKairos from '../assets/logoKairosApp.png'
import { alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const navSections = [
  {
    title: 'Menu',
    items: [
      { icon: <CalendarMonth />, label: 'Calendario', to: '/app/calendar' },
      { icon: <Apartment />, label: 'Empresa', to: '/app/company' },
      { icon: <Badge />, label: 'Trabajo', to: '/app/job' },
    ],
  },
  {
    title: 'Apoyo',
    items: [
      { icon: <HelpOutline />, label: 'Ayuda', to: '/app/help/' },
    ]
  },
  {
    title: 'Usuario',
    items: [
      { icon: <Settings />, label: 'Configuracion', to: '/app/settings' },
      { icon: <Logout />, label: 'Cerrar Sesion', to: '/' },
    ]
  }
]

export default function Sidebar({ open, setOpen }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [user, setUser] = useState(null) 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: meData } = await axios.get('http://localhost:3000/auth/me', {
          withCredentials: true
        });

        const userId = meData.user.id;

        const { data: professionalData } = await axios.get(
          `http://localhost:3000/professionals/user/${userId}`,
          { withCredentials: true }
        );

        setUser({
          name: `${professionalData.user.firstName} ${professionalData.user.lastName}`,
          email: professionalData.user.email,
          avatar:
            professionalData.profilePicture ||
            'https://www.pngkey.com/maxpic/u2q8u2w7e6y3r5y3/'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:3000/auth/logout',
        {},
        { withCredentials: true }
      );
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          bgcolor: '#1e1e1e',
          width: open ? 260 : 64,
          overflowX: 'hidden',
          transition: 'width 0.3s',
          borderRight: 'none',
        },
      }}
    >
    {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        pl={open ? 2 : 1}
      >
        {open && (
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              component="img"
              src={logoKairos}
              sx={{ width: 32, height: 32 }}
            />
            <Typography
              variant="h6"
              fontWeight={600}
              color="white"
            >
              KAIROS
            </Typography>
          </Box>
        )}
        <IconButton onClick={() => setOpen(!open)}>
          {open ? (
            <ChevronLeft sx={{ color: 'white' }} />
          ) : (
            <ChevronRight sx={{ color: 'white' }} />
          )}
        </IconButton>
      </Box>

    {/*Secciones*/}
      {navSections.map((section) => (
        <Box key={section.title} px={open ? 2 : 1} >
          {open 
          ?  <Typography
              variant="subtitle2"
              color="gray"
              fontWeight={500}
              sx={{ mt: 2, mb: 1 }}
              
            >
              {section.title}
            </Typography>
            : <Typography
              variant="body2"
              color="gray"
              fontWeight={400}
              sx={{ mt: 2, mb: 1, fontSize: "typography.md.fontSize", textAlign: "center" }}
            >
              {section.title}
            </Typography>
          }
          <List disablePadding>
            {section.items.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={item.label === 'Cerrar Sesion' ? handleLogout : undefined}
                to={item.to}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  color: 'white',
                  '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.label} sx={{ color: 'inherit'}}/>}
              </ListItemButton>
            ))}
          </List>
        </Box>
      ))}
      <Box flexGrow={1} />

    {/*Usuario*/}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        p={2}
        borderTop="1px solid rgba(255,255,255,0.1)"
      >
        <Avatar
          src={user?.avatar}
          sx={{ width: 36, height: 36 }}
        />
        {open && (
          <Box>
            <Typography
              variant="subtitle2"
              color="white"
              noWrap
            >
              {user?.name || 'Cargando...'}
            </Typography>
            <Typography
              variant="md"
              color="gray"
              noWrap
              sx={{ fontSize: '0.75rem' }}
            >
              {user?.email || ''}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}
