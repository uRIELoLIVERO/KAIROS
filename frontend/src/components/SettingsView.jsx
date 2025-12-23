import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Email as EmailIcon, CameraAlt, Edit } from "@mui/icons-material";
import axios from "axios";

export default function SettingsTemplate() {
  const [tabValue, setTabValue] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    specialities: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: meData } = await axios.get(
          "http://localhost:3000/auth/me",
          {
            withCredentials: true,
          }
        );

        const userId = meData.user.id;

        const { data: professionalData } = await axios.get(
          `http://localhost:3000/professionals/user/${userId}`,
          { withCredentials: true }
        );

        const userData = {
          id: professionalData.id,
          firstname: professionalData.user.firstName,
          surname: professionalData.user.lastName,
          email: professionalData.user.email,
          bio: professionalData.bio || "",
          specialities: professionalData.specialities || "",
          profilePicture: professionalData.profilePicture,
        };

        setUser(userData);
        setFormData({
          firstName: professionalData.user.firstName,
          lastName: professionalData.user.lastName,
          email: professionalData.user.email,
          bio: professionalData.bio || "",
          specialities: professionalData.specialities || "",
        });

        if (professionalData.profilePicture) {
          setPreviewImage(
            `http://localhost:3000${professionalData.profilePicture}?v=${imageVersion}`
          );
        } else {
          setPreviewImage(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showSnackbar("Error al cargar los datos del usuario", "error");
      }
    };

    fetchUserData();
  }, [imageVersion]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showSnackbar("Por favor, selecciona una imagen válida", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("La imagen no debe superar los 5MB", "error");
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setHasChanges(true);
    showSnackbar(
      "Imagen seleccionada. Haz clic en Guardar Cambios para aplicarla.",
      "info"
    );
  };

  const handleSaveAll = async () => {
    if (!user || uploading) return;

    try {
      setUploading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("specialities", formData.specialities);

      if (selectedFile) {
        formDataToSend.append("profilePicture", selectedFile);
      }

      if (user.profilePicture && selectedFile) {
        formDataToSend.append("oldProfilePicture", user.profilePicture);
      }

      const response = await axios.patch(
        `http://localhost:3000/professionals/${user.id}/profile`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updatedData = response.data;
      setUser((prev) => ({
        ...prev,
        firstname: updatedData.user?.firstName || prev.firstname,
        surname: updatedData.user?.lastName || prev.surname,
        email: updatedData.user?.email || prev.email,
        bio: updatedData.bio || prev.bio,
        specialities: updatedData.specialities || prev.specialities,
        profilePicture: updatedData.profilePicture || prev.profilePicture,
      }));

      setSelectedFile(null);
      setHasChanges(false);
      setImageVersion((prev) => prev + 1);

      if (updatedData.profilePicture) {
        setPreviewImage(
          `http://localhost:3000${updatedData.profilePicture}?v=${
            imageVersion + 1
          }`
        );
      }

      showSnackbar("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error saving profile:", error);
      if (error.response) {
        showSnackbar(
          `Error: ${error.response.data?.error || "al guardar el perfil"}`,
          "error"
        );
      } else {
        showSnackbar("Error al guardar los cambios", "error");
      }
    } finally {
      setUploading(false);
    }
  };

  const getImageUrl = () => {
    if (previewImage) return previewImage;
    if (user?.profilePicture)
      return `http://localhost:3000${user.profilePicture}`;
    return null;
  };

  return (
    <Box sx={{ bgcolor: "#f5f6f8", minHeight: "100vh", p: 2 }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
          mx: "auto",
          maxWidth: 800,
        }}
      >
        <Box
          sx={{
            height: { xs: 120, sm: 180 },
            background: "linear-gradient(135deg, #3f51b5, #00bcd4)",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: -36, sm: -48 },
              left: { xs: "50%", sm: 32 },
              transform: { xs: "translateX(-50%)", sm: "none" },
            }}
          >
            <Avatar
              src={getImageUrl()}
              sx={{
                width: { xs: 72, sm: 96 },
                height: { xs: 72, sm: 96 },
                border: "3px solid white",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={handleImageClick}
            />
            <IconButton
              sx={{
                position: "absolute",
                bottom: 4,
                right: 4,
                backgroundColor: "primary.main",
                color: "white",
                width: 28,
                height: 28,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              onClick={handleImageClick}
              disabled={uploading}
            >
              {uploading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Edit sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 5, sm: 6 },
            px: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              Configuración
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
          >
            Ver Perfil
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          sx={{
            px: { xs: 1, sm: 3 },
            mt: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab label="Datos personales" />
          <Tab label="Perfil" />
          <Tab label="Contraseña" />
        </Tabs>

        {/* Datos personales */}
        {tabValue === 0 && (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Mis datos personales
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Aquí puedes editar tu información básica para que tu perfil esté
              siempre actualizado.
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nombre"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Apellido"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
                onClick={handleSaveAll}
                disabled={uploading || !hasChanges}
              >
                {uploading ? <CircularProgress size={24} /> : "Guardar Cambios"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Perfil */}
        {tabValue === 1 && (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Mi Perfil
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Personaliza la información de tu perfil público.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar src={getImageUrl()} sx={{ width: 64, height: 64 }} />
                  <Button
                    variant="outlined"
                    startIcon={<CameraAlt />}
                    onClick={handleImageClick}
                    disabled={uploading}
                  >
                    Cambiar foto
                  </Button>
                  {selectedFile && (
                    <Typography variant="caption" color="text.secondary">
                      Imagen seleccionada: {selectedFile.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Biografía"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Especialidades"
                  value={formData.specialities}
                  onChange={(e) =>
                    handleInputChange("specialities", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
                onClick={handleSaveAll}
                disabled={uploading || !hasChanges}
              >
                {uploading ? <CircularProgress size={24} /> : "Guardar Cambios"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Contraseña */}
        {tabValue === 2 && (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Cambiar Contraseña
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Aquí puedes cambiar tu contraseña, recuerda no compartirla y
              hacerla segura.
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Contraseña actual"
                  type="password"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Nueva Contraseña" type="password" fullWidth />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
              >
                Guardar Cambios
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
