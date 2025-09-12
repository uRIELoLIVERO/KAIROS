import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  CircularProgress,
  Avatar,
  Alert
} from "@mui/material";

const CompanySettingsTab = ({ company, canEdit, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    icon: null,
  });
  const [preview, setPreview] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar el formulario con los datos de la empresa
  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        location: company.location || "",
        icon: null,
      });
      setPreview(company.icon || null);
      setHasChanges(false);
      setError(null);
    }
  }, [company]);

  const handleFieldChange = (field) => (event) => {
    const newValue = event.target.value;
    setForm((prev) => {
      const newForm = { ...prev, [field]: newValue };
      checkChanges(newForm);
      return newForm;
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return;
      }
      
      // Validar tamaño de archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }
      
      setForm((prev) => ({ ...prev, icon: file }));
      setPreview(URL.createObjectURL(file));
      setHasChanges(true);
      setError(null);
    }
  };

  const checkChanges = (newForm) => {
    const hasFieldChanges =
      newForm.name !== (company?.name || "") ||
      newForm.location !== (company?.location || "") ||
      newForm.icon !== null;
    setHasChanges(hasFieldChanges);
  };

  const handleSave = async () => {
    if (!canEdit || !hasChanges || saving) return;

    try {
      setSaving(true);
      setError(null);

      // Usamos FormData para enviar archivos + datos
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("location", form.location);
      
      // Si hay una imagen nueva, agregarla
      if (form.icon) {
        formData.append("icon", form.icon);
      }
      
      // Si hay una imagen anterior, enviar su referencia para posible eliminación
      if (company?.icon) {
        formData.append("oldIcon", company.icon);
      }

      await onUpdate(formData);
      setHasChanges(false);
    } catch (err) {
      setError(err.message || "Error al actualizar la empresa");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setForm({
        name: company.name || "",
        location: company.location || "",
        icon: null,
      });
      setPreview(company.icon || null);
      setHasChanges(false);
      setError(null);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
        Configuración de la empresa
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre de la empresa"
            value={form.name}
            onChange={handleFieldChange("name")}
            fullWidth
            disabled={!canEdit}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Ubicación"
            value={form.location}
            onChange={handleFieldChange("location")}
            fullWidth
            disabled={!canEdit}
            variant="outlined"
          />
        </Grid>

        {/* Campo para subir icono */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={preview || ""}
              alt="Icono empresa"
              sx={{ width: 64, height: 64 }}
            />
            <Stack>
              <Button
                variant="outlined"
                component="label"
                disabled={!canEdit}
                sx={{ mb: 1 }}
              >
                Cambiar icono
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Formatos: JPG, PNG, GIF. Máximo: 5MB
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {canEdit && (
        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            disabled={saving || !hasChanges}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            startIcon={saving ? <CircularProgress size={18} /> : null}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Stack>
      )}

      {!canEdit && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, fontStyle: "italic" }}
        >
          Solo el propietario puede modificar la configuración de la empresa.
        </Typography>
      )}
    </Paper>
  );
};

export default CompanySettingsTab;