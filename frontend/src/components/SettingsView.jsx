import React, { useState } from 'react'
import {
  Box,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Grid,
  Paper
} from '@mui/material'
import { Email as EmailIcon } from '@mui/icons-material'

export default function SettingsTemplate() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ bgcolor: '#f5f6f8', minHeight: '100vh'}}>
      {/* Card principal */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box
          sx={{
            height: {xs: 120, sm: 180},
            background: 'linear-gradient(135deg, #3f51b5, #00bcd4)',
            position: 'relative'
          }}
        >
          <Avatar
            src="https://i.pravatar.cc/150"
            sx={{
              width: {xs: 72, sm: 96},
              height: {xs: 72, sm: 96},
              border: '3px solid white',
              position: 'absolute',
              bottom: {xs: -36, sm: -48},
              left: {xs: '50%', sm: 32},
              transform: {xs: 'translateX(-50%)', sm: 'none'},
            }}
          />
        </Box>

        {/* Info usuario y botón */}
        <Box sx={{ 
          mt: {xs: 5, sm: 6}, 
          px: {xs: 2, sm: 3}, 
          display: 'flex', 
          flexDirection: {xs: 'column', sm: 'row'},
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 1 
        }}>
          
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{textAlign: {xs: 'center', sm: 'left'}}}>
              Configuracion
            </Typography>
            <Typography variant="body2" color="text.secondary">
              samwheeler@example.com
            </Typography>
          </Box>
          <Button variant="outlined" sx={{ borderRadius: 2, width: {xs: '100%' , sm: 'auto'} }} >Ver Perfil</Button>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant= 'scrollable'
          scrollButon= 'auto'
          sx={{ 
            px: {xs: 1, sm: 3}, 
            mt: 2, 
            borderBottom: 1, 
            borderColor: 'divider' 
          }}
        >
          <Tab label="datos personales" />
          <Tab label="Perfil" />
          <Tab label="Contraseña" />
        </Tabs>

        {/* Contenido */}
        {tabValue === 0 && (
          <Box sx={{ p: {xs: 2, sm: 3} }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Mis datos personales
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Aquí puedes editar tu información básica para que tu perfil esté siempre actualizado.
            </Typography>

            <Grid container spacing={2} 
              sx={{
                display: 'flex',
                flexDirection: 'column' ,
              }}>
              <Grid item xs={12} sm={6}>
                <TextField label="First name" defaultValue="Killian" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Last name" defaultValue="James" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  defaultValue="killianjames@gmail.com"
                  fullWidth
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
            </Grid>

            {/* Botones */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button 
                variant="contained" 
                color="success" 
                sx={{ 
                  borderRadius: 2 ,
                  widht: {xs: '100%', sm: 'auto'}
                  }}>
                Guardar Cambios
              </Button>
            </Box>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: {xs: 2, sm: 3} }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Mi Perfil
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Aquí puedes editar tu información básica para que tu perfil esté siempre actualizado.
            </Typography>

            <Grid container spacing={2} 
              sx={{
                display: 'flex',
                flexDirection: 'column' ,
              }}>
              <Grid item xs={12} sm={6}>
                <TextField label="First name" defaultValue="Killian" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Last name" defaultValue="James" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  defaultValue="killianjames@gmail.com"
                  fullWidth
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
            </Grid>

            {/* Botones */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button 
                variant="contained" 
                color="success" 
                sx={{ 
                  borderRadius: 2 ,
                  widht: {xs: '100%', sm: 'auto'}
                  }}>
                Guardar Cambios
              </Button>
            </Box>
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ p: {xs: 2, sm: 3} }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Mi Contraseña
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Aquí puedes cambiar tu contraseña, recuerda no compartirla y hacerla segura.
            </Typography>

            <Grid container spacing={2} 
              sx={{
                display: 'flex',
                flexDirection: 'column' ,
              }}>
              <Grid item xs={12} sm={6}>
                <TextField label="Contraseña actual"  fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Nueva Contraseña" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirmar Nueva Contraseña"
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Botones */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button 
                variant="contained" 
                color="success" 
                sx={{ 
                  borderRadius: 2 ,
                  widht: {xs: '100%', sm: 'auto'}
                  }}>
                Guardar Cambios
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
