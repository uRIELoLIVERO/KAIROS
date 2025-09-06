import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  CircularProgress,
  Avatar
} from "@mui/material";

/**
 * Tab para gestionar la configuración de la empresa
 * @param {Object} props - Props del componente
 * @param {Object} props.company - Datos de la empresa
 * @param {boolean} props.canEdit - Si el usuario puede editar la configuración
 * @param {Function} props.onUpdate - Función para actualizar la empresa (recibe FormData si hay archivo)
 * @returns {JSX.Element} Tab de configuración
 */
const CompanySettingsTab = ({ company, canEdit, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    icon: null, // Puede ser URL inicial o File
  });
  const [preview, setPreview] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar el formulario con los datos de la empresa
  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        location: company.location || "",
        icon: null, // el archivo no se carga aquí
      });
      setPreview(company.icon || null); // mostramos el icono actual si existe
      setHasChanges(false);
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
      setForm((prev) => ({ ...prev, icon: file }));
      setPreview(URL.createObjectURL(file));
      setHasChanges(true);
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

      // Usamos FormData para enviar archivos + datos
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("location", form.location);
      if (form.icon) {
        formData.append("icon", form.icon);
      }

      await onUpdate(formData);

      setHasChanges(false);
    } catch (error) {
      console.error("Error updating company:", error);
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
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
        Configuración de la empresa
      </Typography>

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
            <Button
              variant="outlined"
              component="label"
              disabled={!canEdit}
            >
              Cambiar icono
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
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
