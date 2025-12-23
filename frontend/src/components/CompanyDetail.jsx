import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Chip,
  Alert,
} from "@mui/material";

// --- HOOKS ---
import { useCompany } from "../hooks/useCompany";
import { useUserStaffMembers } from "../hooks/useUserStaffMembers";
import { useCompanyServices } from "../hooks/useCompanyServices";

// --- COMPONENTES ---
import CancelReservationDialog from "./CancelReservationDialog";

// --- ICONOS ---
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import InstagramIcon from "@mui/icons-material/Instagram";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";

// --- PALETA DE COLORES ---
const COLORS = {
  bg: "#F1F5F8",
  greenSuccess: "#63a247",
  white: "#FFFFFF",
  textDark: "#212529",
  textLight: "#6c757d",
  brandDark: "#002C15",
  brandLime: "#C1F43D",
  error: "#d32f2f",
  border: "rgba(0,0,0,0.06)",
};

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Hook de Empresa
  const {
    company,
    loading: loadingCompany,
    error: errorCompany,
  } = useCompany(id);

  // 2. Hook de Staff (Lazy Load)
  const { getCompanyStaff } = useUserStaffMembers();
  const [companyStaff, setCompanyStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  // 3. Hook de Servicios Ofrecidos
  const {
    services,
    loading: loadingServices,
    error: errorServices,
  } = useCompanyServices(id);

  // 4. Estado para el diálogo de cancelación
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // --- EFECTOS ---

  // Cargar Staff
  useEffect(() => {
    let isMounted = true;
    const loadStaff = async () => {
      if (!id) {
        setLoadingStaff(false);
        return;
      }

      setLoadingStaff(true);
      const result = await getCompanyStaff(id);

      if (isMounted) {
        if (result.success) {
          setCompanyStaff(result.data);
        }
        setLoadingStaff(false);
      }
    };
    loadStaff();
    return () => {
      isMounted = false;
    };
  }, [id, getCompanyStaff]);

  // --- HANDLERS ---
  const handleServiceClick = (serviceId) => {
    navigate(`/reservar/${id}/${serviceId}`);
  };

  const handleCancelReservation = () => {
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  // --- RENDERIZADO DE ESTADOS ---
  const isLoading = loadingCompany || loadingStaff || loadingServices;

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: COLORS.bg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: COLORS.brandDark }} />
      </Box>
    );
  }

  if (errorCompany || !company) {
    return (
      <Box sx={{ minHeight: "100vh", p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          No se pudo cargar la información de la empresa.
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    company.address || company.location || "Argentina"
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.bg,
        color: COLORS.textDark,
        pb: 10,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: { xs: 140, md: 220 },
          bgcolor: COLORS.brandDark,
          background: `linear-gradient(180deg, ${COLORS.brandDark} 0%, #001a0c 100%)`,
          p: 2,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: COLORS.white, bgcolor: "rgba(255,255,255,0.1)" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, position: "relative", zIndex: 2 }}>
        {/* 1. Tarjeta Perfil Superior */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 4,
            bgcolor: COLORS.white,
            boxShadow: "0px 10px 40px rgba(0,0,0,0.04)",
            textAlign: "center",
            maxWidth: 800,
            mx: "auto",
            overflow: "visible",
          }}
        >
          <Avatar
            src={company.logo}
            alt={company.name}
            sx={{
              width: 120,
              height: 120,
              border: `6px solid ${COLORS.white}`,
              bgcolor: COLORS.brandLime,
              color: COLORS.brandDark,
              fontSize: "3rem",
              fontWeight: "bold",
              position: "absolute",
              top: -60,
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0px 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            {company.name ? company.name[0].toUpperCase() : "C"}
          </Avatar>

          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h3"
              sx={{
                color: COLORS.brandDark,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              {company.name}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 1, mb: 3, color: COLORS.textLight }}
            >
              <LocationOnIcon
                sx={{ fontSize: 18, color: COLORS.greenSuccess }}
              />
              <Typography variant="body1">
                {company.address ||
                  company.location ||
                  "Dirección no disponible"}
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<DeleteOutlineIcon />}
                onClick={handleCancelReservation}
                sx={{
                  borderRadius: "20px",
                  fontWeight: 600,
                  bgcolor: "rgba(211, 47, 47, 0.05)",
                }}
              >
                Cancelar reserva existente
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* 2. Layout Grid */}
        <Grid container justifyContent="space-evenly" spacing={0}>
          {/* Columna Izquierda (Info) */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={4}>
              {/* Equipo */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: COLORS.brandDark,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PersonIcon
                    sx={{
                      mr: 1,
                      color: COLORS.brandLime,
                      bgcolor: COLORS.brandDark,
                      borderRadius: "50%",
                      p: 0.5,
                      fontSize: 24,
                    }}
                  />
                  Nuestro Equipo
                </Typography>
                {companyStaff.length > 0 ? (
                  <Stack spacing={1.5}>
                    {companyStaff.map((member) => (
                      <Paper
                        key={member.id || member.staffMemberId}
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: COLORS.white,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          border: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <Avatar
                          src={member.profilePicture}
                          sx={{
                            width: 45,
                            height: 45,
                            mr: 2,
                            bgcolor: COLORS.bg,
                            color: COLORS.textDark,
                          }}
                        >
                          {member.firstName
                            ? member.firstName[0]
                            : member.user?.firstName
                            ? member.user.firstName[0]
                            : "P"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color={COLORS.textDark}
                          >
                            {member.firstName || member.user?.firstName}{" "}
                            {member.lastName || member.user?.lastName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: COLORS.greenSuccess, fontWeight: 600 }}
                          >
                            {member.role || "Profesional"}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No se encontró personal asignado.
                  </Typography>
                )}
              </Box>

              {/* Mapa */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: COLORS.brandDark,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MapIcon
                    sx={{
                      mr: 1,
                      color: COLORS.brandLime,
                      bgcolor: COLORS.brandDark,
                      borderRadius: "50%",
                      p: 0.5,
                      fontSize: 24,
                    }}
                  />
                  Ubicación
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    height: 220,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={mapSrc}
                    title="Mapa"
                    style={{ border: 0 }}
                  ></iframe>
                </Paper>
              </Box>
            </Stack>
          </Grid>

          {/* Columna Derecha (Servicios) */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{ position: { md: "sticky" }, top: 20, mt: { xs: 4, md: 0 } }}
            >
              <Typography
                variant="h5"
                sx={{ color: COLORS.brandDark, mb: 2, fontWeight: 700 }}
              >
                Qué ofrecemos
              </Typography>
              <Typography
                variant="body2"
                color={COLORS.textLight}
                sx={{ mb: 3 }}
              >
                Seleccioná un servicio para reservar.
              </Typography>

              {/* Alerta de Error en Servicios */}
              {errorServices && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorServices}
                </Alert>
              )}

              {/* Lista de Servicios REALES */}
              {!loadingServices && errorServices ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  No se pudieron cargar los servicios. {errorServices}
                </Alert>
              ) : services && services.length > 0 ? (
                <Stack spacing={2}>
                  {services.map((service) => (
                    <Paper
                      key={service.id}
                      elevation={0}
                      onClick={() => handleServiceClick(service.id)}
                      sx={{
                        height: 85,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2.5,
                        bgcolor: COLORS.white,
                        borderRadius: 3,
                        border: `1px solid ${COLORS.border}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: COLORS.brandLime,
                          boxShadow: `0px 4px 20px rgba(193, 244, 61, 0.25)`,
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                        <Typography
                          variant="h6"
                          color={COLORS.textDark}
                          noWrap
                          sx={{ fontSize: "0.95rem", fontWeight: 700 }}
                        >
                          {service.name}
                        </Typography>
                        {/* Subtítulo con info del staff y duración */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                            color: COLORS.textLight,
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          <Box display="flex" alignItems="center">
                            <PersonIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            <Typography variant="caption" fontWeight={500}>
                              {service.staffName}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center">
                            <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            <Typography variant="caption" fontWeight={500}>
                              {service.duration
                                ? `${service.duration} min`
                                : "Consultar"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Chip
                          label={
                            service.price
                              ? `$ ${Number(service.price).toLocaleString()}`
                              : "Consultar"
                          }
                          size="small"
                          sx={{
                            bgcolor: COLORS.bg,
                            fontWeight: 800,
                            color: COLORS.brandDark,
                            mr: 1.5,
                            height: 28,
                          }}
                        />
                        <ArrowForwardIosIcon
                          sx={{ fontSize: 14, color: COLORS.brandLime }}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                !loadingServices && (
                  <Typography variant="body2" color="text.secondary">
                    No hay servicios disponibles en este momento.
                  </Typography>
                )
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Diálogo de cancelación de reserva */}
      <CancelReservationDialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
        companyId={id}
        companyName={company.name}
      />
    </Box>
  );
}
