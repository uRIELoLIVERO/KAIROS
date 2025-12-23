import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const steps = ["Fecha y hora", "Tus datos", "Confirmación"];

const ClientDataPage = () => {
  const { companyId, serviceId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Nombre es requerido";
    if (!formData.lastName.trim()) newErrors.lastName = "Apellido es requerido";
    if (!formData.email.trim()) newErrors.email = "Email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";
    if (!formData.phone.trim()) newErrors.phone = "Teléfono es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const reservationData = JSON.parse(
        localStorage.getItem("reservationData") || "{}"
      );
      const completeData = {
        ...reservationData,
        clientData: formData,
      };
      localStorage.setItem("reservationData", JSON.stringify(completeData));
      navigate(`/reservar/${companyId}/${serviceId}/confirmar`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={1} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Tus datos personales
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Completa tus datos para continuar con la reserva
      </Typography>

      <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notas adicionales (opcional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Comentarios, necesidades especiales, etc."
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button type="submit" variant="contained" size="large">
              Verificar reserva
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ClientDataPage;
