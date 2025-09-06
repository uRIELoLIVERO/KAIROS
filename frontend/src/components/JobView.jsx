import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Skeleton,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Hooks
import { useAuth } from "../hooks/useAuth";
import { useUserStaffMembers } from "../hooks/useUserStaffMembers";

// Servicios/API
import OfferedServiceAPI from "../services/offeredServiceAPI";
import { formatCurrency } from "../utils/helpers";

// --- Modal de edición de OfferedService ---
function OfferedServiceEditDialog({ open, onClose, onSubmit, offeredService }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const firstFieldRef = useRef(null);

  const [form, setForm] = useState({
    customPrice: "",
    customDuration: "",
    customDescription: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && offeredService) {
      // Extraer valores de manera segura con valores por defecto
      console.log(offeredService)
      const suggestedPrice = offeredService.service?.suggestedPrice || 0;
      const suggestedDuration = offeredService.service?.suggestedDuration || 0;
      const serviceDescription = offeredService.service?.description || "";
      
      setForm({
        customPrice: offeredService.customPrice ?? suggestedPrice,
        customDuration: offeredService.customDuration ?? suggestedDuration,
        customDescription: offeredService.customDescription ?? serviceDescription,
      });
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [open, offeredService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.customPrice === "" || Number(form.customPrice) <= 0)
      e.customPrice = "El precio debe ser mayor a 0";
    if (form.customDuration === "" || Number(form.customDuration) <= 0)
      e.customDuration = "La duración debe ser mayor a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      customPrice: Number(form.customPrice),
      customDuration: Number(form.customDuration),
      customDescription: form.customDescription?.trim() || null,
    };
    onSubmit(payload);
  };

  // Extraer valores para mostrar en los helper texts
  const suggestedPrice = offeredService?.service?.suggestedPrice ?? 0;
  const suggestedDuration = offeredService?.service?.suggestedDuration ?? "-";
  const serviceDescription = offeredService?.service?.description || "Sin descripción";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle>Editar servicio ofrecido</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            inputRef={firstFieldRef}
            label="Precio personalizado"
            name="customPrice"
            type="number"
            value={form.customPrice}
            onChange={handleChange}
            error={!!errors.customPrice}
            helperText={
              errors.customPrice ||
              `Precio sugerido: ${formatCurrency(suggestedPrice)}`
            }
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />

          <TextField
            label="Duración personalizada (minutos)"
            name="customDuration"
            type="number"
            value={form.customDuration}
            onChange={handleChange}
            error={!!errors.customDuration}
            helperText={
              errors.customDuration ||
              `Duración sugerida: ${suggestedDuration} min`
            }
            fullWidth
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Descripción personalizada"
            name="customDescription"
            value={form.customDescription}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Agrega detalles específicos sobre cómo ofreces este servicio (opcional)"
            helperText={`Descripción base: ${serviceDescription}`}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<EditIcon />}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// --- Tarjeta de servicio ofrecido ---
function OfferedServiceCard({ item, onEdit, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Extraer valores de manera segura con operador de encadenamiento opcional y valores por defecto
  const price = item.customPrice ?? item.service?.suggestedPrice ?? 0;
  const duration = item.customDuration ?? item.service?.suggestedDuration ?? "-";
  const description = item.customDescription || item.service?.description || "";
  
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(item);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(item);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        height: '100%',
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": { 
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)" 
        },
        position: "relative",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          p: { xs: 2, sm: 3 },
          "&:last-child": { pb: { xs: 2, sm: 3 } },
        }}
      >
        {/* Header con título y menú */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            fontWeight={600}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              flex: 1,
              pr: 1,
              lineHeight: 1.3,
              minHeight: "3.2em",
            }}
          >
            {item.service?.name || "Servicio sin nombre"}
          </Typography>
          
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ ml: 1, flexShrink: 0 }}
          >
            <MoreVertIcon />
          </IconButton>
          
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Eliminar</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        {/* Información del servicio */}
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
          <Chip
            label={`${duration} min`}
            size="small"
            sx={{ backgroundColor: theme.palette.grey[100] }}
          />
          <Chip
            label={formatCurrency(price)}
            size="small"
            color="success"
            variant="outlined"
          />
        </Stack>

        {/* Descripción */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              fontStyle: item.customDescription ? "normal" : "italic",
              flex: 1,
              minHeight: "4.5em",
            }}
          >
            {description}
          </Typography>
        )}

        {/* Botón de acción */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit(item)}
          sx={{ mt: "auto" }}
        >
          Editar servicio
        </Button>
      </CardContent>
    </Card>
  );
}

// --- Sección de empresa ---
function CompanySection({ company, onEdit, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        mb: 3,
      }}
    >
      {/* Header de la empresa - Ahora es clickeable */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: theme.palette.primary.main,
          color: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={toggleExpand}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <BusinessIcon />
          <Box flex={1}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight={700}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {company.companyName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {company.items.length} servicio{company.items.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Stack>
        
        <IconButton 
          onClick={toggleExpand} 
          sx={{ color: "white" }}
          size="large"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Contenido - Grid de servicios con Collapse */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {company.items.map((item) => {
              return (
                <Grid key={item.id} item xs={12} sm={6} lg={4}>
                  <OfferedServiceCard
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
}

// --- Vista principal ---
export default function JobView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user } = useAuth();
  const { staffMembers, loading: loadingStaff } = useUserStaffMembers(user?.id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await OfferedServiceAPI.getMyOfferedServices();
      setData(Array.isArray(res) ? res : res?.data ?? []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Error al cargar tus servicios ofrecidos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => fetchData();

  // Normalización y agrupación mejorada
  const groupedServices = useMemo(() => {
    if (!data.length) return [];

    // Normalizar datos
    const normalized = data.map((item) => {
      const service = item.service ?? item.Service ?? {};
      const companyId = service?.companyId ?? item.companyId ?? "unknown";
      const companyName = service?.company?.name ?? item.service?.company?.name ?? "Empresa sin nombre";

      return {
        id: item.id,
        staffMemberId: item.staffMemberId ?? null,
        companyId,
        companyName,
        service,
        serviceId: item.serviceId ?? service?.id ?? null,
        customPrice: item.customPrice,
        customDuration: item.customDuration,
        customDescription: item.customDescription,
        createdAt: item.createdAt,
      };
    });

    // Filtrar por búsqueda
    const filtered = query.trim() 
      ? normalized.filter((item) => {
          const searchTerm = query.toLowerCase();
          const serviceName = (item.service?.name || "").toLowerCase();
          const companyName = (item.companyName || "").toLowerCase();
          
          return (
            serviceName.includes(searchTerm) ||
            companyName.includes(searchTerm)
          );
        })
      : normalized;

    // Agrupar por empresa
    const grouped = new Map();
    filtered.forEach((item) => {
      const key = item.companyId;
      if (!grouped.has(key)) {
        grouped.set(key, {
          companyId: key,
          companyName: item.companyName,
          items: [],
        });
      }
      grouped.get(key).items.push(item);
    });

    // Ordenar empresas por nombre y servicios por fecha
    return Array.from(grouped.values())
      .sort((a, b) => a.companyName.localeCompare(b.companyName))
      .map((group) => ({
        ...group,
        items: group.items.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        ),
      }));
  }, [data, query]);

  const handleOpenEdit = (item) => {
    setEditing(item);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };

  const handleSubmitEdit = async (payload) => {
    try {
      await OfferedServiceAPI.updateOfferedService(editing.id, payload);
      setSuccessMessage("Servicio actualizado correctamente");
      handleCloseEdit();
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Error al actualizar el servicio");
    }
  };

  const handleDeleteService = (item) => {
    console.log("Eliminar servicio", item);
    setServiceToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await OfferedServiceAPI.deleteOfferedService(serviceToDelete.id);
      setSuccessMessage("Servicio eliminado correctamente");
      setDeleteConfirmOpen(false);
      setServiceToDelete(null);
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Error al eliminar el servicio");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setServiceToDelete(null);
  };

  const renderSkeletons = () => (
    <Stack spacing={3}>
      {Array.from({ length: 2 }).map((_, i) => (
        <Paper key={i} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Skeleton variant="rectangular" height={80} />
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {Array.from({ length: 3 }).map((_, j) => (
                <Grid key={j} item xs={12} sm={6} lg={4}>
                  <Skeleton variant="rounded" height={200} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      ))}
    </Stack>
  );

  const isLoading = loading || loadingStaff;

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: "1400px",
      mx: "auto"
    }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight={700}
            gutterBottom
          >
            Mis servicios ofrecidos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona todos los servicios que ofreces en diferentes empresas
          </Typography>
        </Box>

        <TextField
          placeholder="Buscar por servicio, empresa o personal..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size={isMobile ? "small" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Actualizar">
                  <IconButton onClick={handleRetry} edge="end">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{ 
            minWidth: { xs: "100%", md: 350 },
            backgroundColor: "background.paper"
          }}
        />
      </Stack>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Contenido principal */}
      {isLoading ? (
        renderSkeletons()
      ) : groupedServices.length === 0 ? (
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <BusinessIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {query ? "No se encontraron servicios" : "No tienes servicios ofrecidos aún"}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {query 
              ? "Intenta con otros términos de búsqueda"
              : "Cuando registres servicios en empresas, aparecerán aquí organizados por compañía"
            }
          </Typography>
          {query && (
            <Button
              variant="outlined"
              onClick={() => setQuery("")}
              sx={{ mt: 2 }}
            >
              Limpiar búsqueda
            </Button>
          )}
        </Paper>
      ) : (
        <Stack spacing={0}>
          {groupedServices.map((company) => (
            <CompanySection
              key={company.companyId}
              company={company}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteService}
            />
          ))}
        </Stack>
      )}

      {/* Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Modal editar */}
      <OfferedServiceEditDialog
        open={editOpen}
        onClose={handleCloseEdit}
        onSubmit={handleSubmitEdit}
        offeredService={editing}
      />

      {/* Modal confirmación eliminación */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el servicio{" "}
            <strong>"{serviceToDelete?.service?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}