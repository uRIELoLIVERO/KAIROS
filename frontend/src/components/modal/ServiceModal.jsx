import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

/**
 * Modal para crear o editar un servicio
 */
const ServiceModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    suggestedPrice: "",
    suggestedDuration: "",
    suggestedBuffer: "0",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos iniciales cuando el modal se abre o cambian los initialData
  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
          suggestedPrice: initialData.suggestedPrice?.toString() || "",
          suggestedDuration: initialData.suggestedDuration?.toString() || "",
          suggestedBuffer: initialData.suggestedBuffer?.toString() || "0",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          suggestedPrice: "",
          suggestedDuration: "",
          suggestedBuffer: "0",
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";

    const price = parseFloat(formData.suggestedPrice);
    if (isNaN(price) || price <= 0)
      newErrors.suggestedPrice = "El precio debe ser mayor a 0";

    const duration = parseInt(formData.suggestedDuration);
    if (isNaN(duration) || duration <= 0)
      newErrors.suggestedDuration = "La duración debe ser mayor a 0";

    const buffer = parseInt(formData.suggestedBuffer || "0");
    if (isNaN(buffer) || buffer < 0)
      newErrors.suggestedBuffer = "El tiempo de buffer no puede ser negativo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // Prevenir el comportamiento por defecto del botón
    if (e) e.preventDefault();

    console.log("Botón clickeado - Iniciando submit...");

    if (isSubmitting) {
      console.log("Ya se está enviando, evitando doble submit");
      return;
    }

    const isValid = validateForm();
    console.log("¿Formulario válido?", isValid);
    console.log("Datos del formulario:", formData);

    if (!isValid) {
      console.log("Errores de validación:", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Preparando datos para enviar...");
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        suggestedPrice: parseFloat(formData.suggestedPrice),
        suggestedDuration: parseInt(formData.suggestedDuration),
        suggestedBuffer: parseInt(formData.suggestedBuffer || "0"),
      };

      console.log("Datos finales a enviar:", submissionData);
      console.log("Llamando onSubmit callback...");

      // Llamar al callback del padre
      await onSubmit(submissionData);

      console.log("onSubmit completado exitosamente");

      // Cerrar el modal después de enviar exitosamente
      onClose();
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      // Mostrar error al usuario si es necesario
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar la tecla Enter en el formulario
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      onKeyPress={handleKeyPress}
    >
      <DialogTitle>
        {isEdit ? "Editar Servicio" : "Crear Nuevo Servicio"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <TextField
            label="Nombre del servicio"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <TextField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            disabled={isSubmitting}
          />

          <TextField
            label="Precio sugerido"
            name="suggestedPrice"
            type="number"
            value={formData.suggestedPrice}
            onChange={handleChange}
            error={!!errors.suggestedPrice}
            helperText={errors.suggestedPrice}
            fullWidth
            required
            InputProps={{
              inputProps: { min: 0, step: 0.01 },
            }}
            disabled={isSubmitting}
          />

          <TextField
            label="Duración sugerida (minutos)"
            name="suggestedDuration"
            type="number"
            value={formData.suggestedDuration}
            onChange={handleChange}
            error={!!errors.suggestedDuration}
            helperText={errors.suggestedDuration}
            fullWidth
            required
            InputProps={{
              inputProps: { min: 1 },
            }}
            disabled={isSubmitting}
          />

          <TextField
            label="Buffer sugerido (minutos)"
            name="suggestedBuffer"
            type="number"
            value={formData.suggestedBuffer}
            onChange={handleChange}
            error={!!errors.suggestedBuffer}
            helperText={
              errors.suggestedBuffer ||
              "Tiempo de descanso entre citas (opcional)"
            }
            fullWidth
            InputProps={{
              inputProps: { min: 0 },
            }}
            disabled={isSubmitting}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            isSubmitting || Object.keys(errors).some((key) => errors[key])
          }
        >
          {isSubmitting
            ? "Procesando..."
            : isEdit
            ? "Guardar Cambios"
            : "Crear Servicio"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceModal;
