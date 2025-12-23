import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Paper, Button } from "@mui/material";
import HowItWorksMobile from "../assets/howItWorksMobile.png"
import { ArrowCircleRight } from '@mui/icons-material';


export default function HowItWorks() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const steps = [
    {
      title: 'Crear tu cuenta',
      description: 'Registrate en nuestra plataforma en minutos y empieza a organizar tu negocio de manera profesional.'
    },
    {
      title: 'Crea tu empresa',
      description: 'Agrega los datos de tu empresa para personalizar tu perfil y ofrecer una experiencia única a tus clientes. ¡Así tu negocio tendrá su espacio dedicado!'
    },
    {
      title: 'Asigna tus servicios',
      description: 'Registra los servicios que ofreces para que tus clientes puedan ver las opciones disponibles y realizar reservas según lo que necesitan.'
    },
    {
      title: 'Comparte tu link',
      description: 'Obtén tu enlace personalizado y compártelo con tus clientes. ¡Ahora podrán agendar sus citas fácilmente, y tú estarás siempre organizado!'
    }
  ]
  return (
    <Box
      sx={{
        py: 2,
        px: { xs: 2, md: 8 },
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row"
        },
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          height: { xs: 'auto', md: '100vh' },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: { xs: 4, md: 0 }
        }}
      >
        <Box
          component="img"
          src={HowItWorksMobile}
          alt="Phone example"
          sx={{
            width: { xs: '80%', sm: '60%', md: '50%' },
            maxHeight: { xs: 300, sm: 400, md: '80%' },
            objectFit: 'contain'
          }}
        />
      </Box>

      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          height: { xs: 'auto', md: '100vh' },
          px: { xs: 1, md: 2 },
          overflowY: { xs: 'visible', md: 'auto' }
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            fontWeight: 500,
            display: 'block',
            mb: 1
          }}
        >
          ¿Cómo empezar?
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 4
          }}
        >
          Comenzá en Turn Now en solo 4 pasos
        </Typography>

        <Paper elevation={0} sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
          <List disablePadding>
            {steps.map((step, index) => {
              const selected = index === selectedIndex;

              return (
                <ListItem
                  key={step.title}
                  alignItems="flex-start"
                  onClick={() => setSelectedIndex(index)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selected ? 'green' : 'white',
                    color: selected ? 'white' : 'black',
                    py: 2,
                    px: 3,
                    borderBottom: index < steps.length - 1 ? '1px solid #ccc' : 'none',
                    transition: 'background 0.2s ease-in-out'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ArrowCircleRight
                      sx={{
                        transform: selected ? 'rotate(0deg)' : 'rotate(90deg)',
                        transition: 'transform 0.3s ease-in-out',
                        color: selected ? 'white' : 'primary.main',
                      }}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography
                        variant={selected ? "subtitle1" : "subtitle2"}
                        fontWeight={selected ? 600 : 500}
                        sx={{
                          fontSize: selected ? { xs: '1rem', md: '1.1rem' } : { xs: '0.95rem', md: '1rem' }
                        }}
                      >
                        {step.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ color: selected ? 'white' : 'text.secondary' }}
                      >
                        {step.description}
                      </Typography>
                    }
                  />
                </ListItem>
              )
            })}
          </List>
        </Paper>

        <Button
          variant="contained"
          sx={{ mt: 4 }}
        >
          Leer más
        </Button>
      </Box>
    </Box>
  )
}
