import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  Avatar,
  Typography,
  Button,
  Stack,
  Container,
  Paper,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import { useCompanies } from "../../hooks/useCompanies.js";
import CompanyCard from "./CompanyCard";
import CreateCompanyDialog from "./CreateCompanyDialog";
import ErrorPaper from "../common/ErrorPaper";
import LoadingGrid from "../common/LoadingGrid";

// Constantes para el diseño
const COLORS = {
  bg: "#F1F5F8",
  brandDark: "#002C15",
  brandLime: "#C1F43D",
  textDark: "#212529",
  textLight: "#6c757d",
  border: "rgba(0,0,0,0.06)",
};

const CompanySelectView = () => {
  const navigate = useNavigate();
  const { loading, companies, error, createCompany } = useCompanies();
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreateCompany = async (companyName) => {
    try {
      setCreating(true);
      const newCompany = await createCompany(companyName);
      setOpenCreate(false);
      navigate(`/app/company/${newCompany.id}`);
    } catch (err) {
      console.error("Error creating company:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleEnterCompany = (companyId) => {
    navigate(`/app/my-company/${companyId}`);
  };

  // Función para renderizar todas las tarjetas (incluyendo la de crear)
  const renderCards = () => {
    const allCards = [...companies];

    // Si hay menos de 4 tarjetas, añadimos la de crear como parte del grid
    if (companies.length < 4) {
      return (
        <>
          {companies.map((company) => (
            <Fade in key={company.id} timeout={500}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CompanyCard
                  name={company.name}
                  logoUrl={company.icon}
                  onEnter={() => handleEnterCompany(company.id)}
                  sx={{
                    height: "100%",
                    width: "100%",
                    minHeight: 280,
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                  }}
                />
              </Grid>
            </Fade>
          ))}

          <Fade in timeout={700}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: "100%",
                  width: "100%",
                  minHeight: 280,
                  borderRadius: 3,
                  border: `2px dashed ${COLORS.border}`,
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 4,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(193, 244, 61, 0.05)",
                    borderColor: COLORS.brandLime,
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px rgba(0, 44, 21, 0.1)`,
                  },
                }}
                onClick={() => setOpenCreate(true)}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "rgba(193, 244, 61, 0.1)",
                    color: COLORS.brandDark,
                    mb: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  <AddIcon fontSize="large" />
                </Avatar>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color={COLORS.textDark}
                  textAlign="center"
                  gutterBottom
                >
                  Crear nueva empresa
                </Typography>
                <Typography
                  variant="body2"
                  color={COLORS.textLight}
                  textAlign="center"
                  sx={{ mb: 2 }}
                >
                  Comenzá tu gestión empresarial
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: COLORS.brandDark,
                    color: COLORS.brandLime,
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#001A0C",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Comenzar
                </Button>
              </Card>
            </Grid>
          </Fade>
        </>
      );
    }

    // Si hay 4 o más tarjetas, renderizamos las empresas en grid y el botón aparte
    return (
      <>
        {companies.map((company) => (
          <Fade in key={company.id} timeout={500}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <CompanyCard
                name={company.name}
                logoUrl={company.icon}
                onEnter={() => handleEnterCompany(company.id)}
                sx={{
                  height: "100%",
                  width: "100%",
                  minHeight: 280,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                }}
              />
            </Grid>
          </Fade>
        ))}
      </>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.bg,
        pt: { xs: 3, md: 6 },
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header con diseño mejorado */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 6,
            borderRadius: 3,
            bgcolor: COLORS.brandDark,
            backgroundImage:
              "linear-gradient(135deg, #002C15 0%, #001A0C 100%)",
            color: "white",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={3}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: COLORS.brandLime,
                  color: COLORS.brandDark,
                  width: 48,
                  height: 48,
                }}
              >
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  Tus Empresas
                </Typography>
                <Typography variant="body1" color="rgba(255,255,255,0.8)">
                  {companies.length} empresa{companies.length !== 1 ? "s" : ""}{" "}
                  disponible{companies.length !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </Stack>

            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setOpenCreate(true)}
              size="large"
              sx={{
                bgcolor: COLORS.brandLime,
                color: COLORS.brandDark,
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#A8E02A",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(193, 244, 61, 0.3)",
                },
              }}
            >
              Crear Empresa
            </Button>
          </Stack>
        </Paper>

        {/* Error Display */}
        {error && <ErrorPaper message={error} sx={{ mb: 4 }} />}

        {/* Grid de empresas - Mejorado para simetría */}
        {loading ? (
          <LoadingGrid />
        ) : companies.length === 0 ? (
          // Estado vacío
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              px: 2,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(193, 244, 61, 0.1)",
                color: COLORS.textLight,
                mx: "auto",
                mb: 3,
              }}
            >
              <BusinessIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color={COLORS.textDark} gutterBottom>
              No tenés empresas creadas
            </Typography>
            <Typography
              variant="body1"
              color={COLORS.textLight}
              sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
            >
              Creá tu primera empresa para comenzar a gestionar turnos y
              servicios
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setOpenCreate(true)}
              size="large"
              sx={{
                bgcolor: COLORS.brandDark,
                color: COLORS.brandLime,
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#001A0C",
                },
              }}
            >
              Crear Primera Empresa
            </Button>
          </Box>
        ) : (
          <>
            {/* Grid de tarjetas */}
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 4 }}
              justifyContent={companies.length < 3 ? "center" : "flex-start"}
              sx={{
                mb: 6,
              }}
            >
              {renderCards()}
            </Grid>

            {/* Botón adicional para crear si hay muchas empresas */}
            {companies.length >= 4 && (
              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                }}
              >
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  onClick={() => setOpenCreate(true)}
                  size="large"
                  sx={{
                    borderColor: COLORS.brandDark,
                    color: COLORS.brandDark,
                    borderWidth: 2,
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: COLORS.brandDark,
                      bgcolor: "rgba(0, 44, 21, 0.04)",
                      borderWidth: 2,
                    },
                  }}
                >
                  Agregar Otra Empresa
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Create Company Dialog */}
        <CreateCompanyDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSubmit={handleCreateCompany}
          loading={creating}
        />
      </Container>
    </Box>
  );
};

export default CompanySelectView;
