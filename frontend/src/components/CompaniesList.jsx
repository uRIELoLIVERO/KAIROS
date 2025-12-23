// src/components/CompanyList.js
import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Alert,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";

import { useAllCompanies } from "../hooks/useAllCompanies";

// Nueva paleta de colores
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

export default function CompaniesList() {
  const navigate = useNavigate();
  const { companies, loading, error } = useAllCompanies();
  const [query, setQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    if (!query) return companies;
    const lowerQuery = query.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        (c.location && c.location.toLowerCase().includes(lowerQuery))
    );
  }, [companies, query]);

  const handleCompanyClick = (id) => navigate(`/company/${id}`);
  const handleGoBack = () => navigate(-1);

  const getIconContent = (name) => {
    if (name && typeof name === "string" && name.length > 0) {
      return name[0].toUpperCase();
    }
    return "?";
  };

  // Contador de resultados
  const resultsCount = filteredCompanies.length;
  const totalCount = companies.length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.bg,
        color: COLORS.textDark,
        py: { xs: 4, md: 6 },
        px: 2,
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="md">
        {/* ---------- BOTÓN DE VOLVER ---------- */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            mb: 4,
            color: COLORS.textLight,
            "&:hover": {
              backgroundColor: "rgba(33, 37, 41, 0.04)",
              color: COLORS.brandDark,
            },
            transition: "all 0.2s ease",
          }}
        >
          Volver
        </Button>

        {/* ---------- HEADER CON TÍTULO Y CONTADOR ---------- */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              p: 1.5,
              borderRadius: "50%",
              backgroundColor: "rgba(193, 244, 61, 0.1)",
            }}
          >
            <BusinessIcon
              sx={{
                fontSize: 40,
                color: COLORS.brandDark,
              }}
            />
          </Box>

          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              mb: 2,
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
              },
              color: COLORS.brandDark,
              lineHeight: 1.2,
            }}
          >
            Empresas Disponibles
          </Typography>

          <Typography
            variant="h6"
            color={COLORS.textLight}
            fontWeight={400}
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            Encontrá la empresa ideal para tu próximo turno y descubrí todos sus
            servicios disponibles.
          </Typography>

          {/* Contador de resultados */}
          <Chip
            label={`${resultsCount} de ${totalCount} empresas`}
            sx={{
              backgroundColor: resultsCount > 0 ? COLORS.brandLime : "#e9ecef",
              color: resultsCount > 0 ? COLORS.brandDark : COLORS.textLight,
              fontWeight: 600,
              px: 2,
              py: 1,
            }}
          />
        </Box>

        {/* ---------- BUSCADOR MEJORADO ---------- */}
        <Paper
          elevation={0}
          sx={{
            mb: 6,
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="Buscar por nombre o ubicación…"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: COLORS.white,
                borderRadius: "12px",
                color: COLORS.textDark,
                transition: "all 0.3s ease",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.border,
                borderWidth: "2px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.brandLime,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.brandDark,
                borderWidth: "2px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: query ? COLORS.brandDark : COLORS.textLight,
                      transition: "color 0.3s ease",
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => setQuery("")}
                    sx={{
                      color: COLORS.textLight,
                      minWidth: "auto",
                      "&:hover": {
                        color: COLORS.brandDark,
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    Limpiar
                  </Button>
                </InputAdornment>
              ),
            }}
          />

          {/* Sugerencias de búsqueda (opcional) */}
          {!query && companies.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Typography
                variant="caption"
                color={COLORS.textLight}
                sx={{ mr: 1 }}
              >
                Sugerencias:
              </Typography>
              {companies.slice(0, 3).map((company) => (
                <Chip
                  key={company.id}
                  label={company.name}
                  size="small"
                  onClick={() => setQuery(company.name)}
                  sx={{
                    backgroundColor: "rgba(193, 244, 61, 0.1)",
                    color: COLORS.brandDark,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(193, 244, 61, 0.2)",
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* ---------- ESTADOS DE CARGA Y ERROR ---------- */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: 2,
              backgroundColor: "#fdeded",
              color: COLORS.error,
              border: `1px solid ${COLORS.error}20`,
            }}
            onClose={() => {}}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
            }}
          >
            <CircularProgress
              size={60}
              sx={{
                color: COLORS.brandLime,
                mb: 3,
              }}
            />
            <Typography variant="body1" color={COLORS.textLight}>
              Cargando empresas...
            </Typography>
          </Box>
        ) : filteredCompanies.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <SearchIcon
              sx={{
                fontSize: 60,
                color: COLORS.textLight,
                mb: 3,
                opacity: 0.5,
              }}
            />
            <Typography variant="h5" color={COLORS.textDark} gutterBottom>
              {query
                ? "No se encontraron empresas"
                : "No hay empresas disponibles"}
            </Typography>
            <Typography variant="body1" color={COLORS.textLight} sx={{ mb: 3 }}>
              {query
                ? `No encontramos resultados para "${query}". Intentá con otro término.`
                : "Próximamente se agregarán nuevas empresas."}
            </Typography>
            {query && (
              <Button
                variant="outlined"
                onClick={() => setQuery("")}
                sx={{
                  color: COLORS.brandDark,
                  borderColor: COLORS.brandDark,
                  "&:hover": {
                    backgroundColor: "rgba(0, 44, 21, 0.04)",
                    borderColor: COLORS.brandDark,
                  },
                }}
              >
                Ver todas las empresas
              </Button>
            )}
          </Paper>
        ) : (
          /* ---------- LISTA DE EMPRESAS ---------- */
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.white,
              mb: 4,
            }}
          >
            <List disablePadding>
              {filteredCompanies.map((company, index) => (
                <ListItem
                  key={company.id}
                  disablePadding
                  sx={{
                    backgroundColor: index % 2 === 0 ? COLORS.white : "#f8f9fa",
                    borderBottom: `1px solid ${COLORS.border}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(193, 244, 61, 0.05)",
                      transform: "translateX(4px)",
                      cursor: "pointer",
                    },
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                  onClick={() => handleCompanyClick(company.id)}
                >
                  <ListItemAvatar sx={{ minWidth: 70, p: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: COLORS.brandLime,
                        color: COLORS.brandDark,
                        fontWeight: 800,
                        fontSize: "1.5rem",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {company.icon || getIconContent(company.name)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: COLORS.brandDark,
                          mb: 0.5,
                        }}
                      >
                        {company.name}
                      </Typography>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: COLORS.textLight,
                          mb: 1,
                        }}
                      >
                        <LocationOnIcon
                          sx={{
                            fontSize: 16,
                            mr: 1,
                            color: COLORS.greenSuccess,
                          }}
                        />
                        <Typography variant="body2" component="span">
                          {company.location || "Ubicación no especificada"}
                        </Typography>
                      </Box>
                    }
                    sx={{ py: 1 }}
                  />

                  {/* Tags adicionales (si existen) */}
                  <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
                    {company.category && (
                      <Chip
                        label={company.category}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(99, 162, 71, 0.1)",
                          color: COLORS.greenSuccess,
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </Box>

                  <IconButton
                    edge="end"
                    aria-label="ir a empresa"
                    sx={{
                      color: COLORS.brandLime,
                      backgroundColor: "rgba(193, 244, 61, 0.1)",
                      mr: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: COLORS.brandLime,
                        color: COLORS.brandDark,
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* ---------- FOOTER INFORMATIVO ---------- */}
        {!loading && filteredCompanies.length > 0 && (
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${COLORS.border}`,
            }}
          >
            <Typography variant="body2" color={COLORS.textLight}>
              ¿No encontrás la empresa que buscás?{" "}
              <Button
                variant="text"
                size="small"
                sx={{
                  color: COLORS.brandDark,
                  fontWeight: 600,
                  textDecoration: "underline",
                  p: 0,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: COLORS.greenSuccess,
                  },
                }}
              >
                Contactanos
              </Button>
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
