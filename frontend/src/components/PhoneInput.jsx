// components/PhoneInput.jsx
import {
  TextField,
  MenuItem,
  Select,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";

const countryCodes = [
  {
    code: "+54",
    country: "Argentina",
    flag: "🇦🇷",
    pattern: /^(\d{2,3})?(\d{4})?(\d{4})?$/,
  },
  {
    code: "+1",
    country: "USA/Canada",
    flag: "🇺🇸",
    pattern: /^(\d{3})?(\d{3})?(\d{4})?$/,
  },
  {
    code: "+52",
    country: "México",
    flag: "🇲🇽",
    pattern: /^(\d{2,3})?(\d{4})?(\d{4})?$/,
  },
  {
    code: "+34",
    country: "España",
    flag: "🇪🇸",
    pattern: /^(\d{3})?(\d{3})?(\d{3})?$/,
  },
  {
    code: "+55",
    country: "Brasil",
    flag: "🇧🇷",
    pattern: /^(\d{2})?(\d{4,5})?(\d{4})?$/,
  },
  {
    code: "+56",
    country: "Chile",
    flag: "🇨🇱",
    pattern: /^(\d{1,2})?(\d{4})?(\d{4})?$/,
  },
  {
    code: "+51",
    country: "Perú",
    flag: "🇵🇪",
    pattern: /^(\d{1,3})?(\d{3})?(\d{3})?$/,
  },
  {
    code: "+57",
    country: "Colombia",
    flag: "🇨🇴",
    pattern: /^(\d{3})?(\d{3})?(\d{4})?$/,
  },
  {
    code: "+44",
    country: "UK",
    flag: "🇬🇧",
    pattern: /^(\d{3,4})?(\d{3})?(\d{4})?$/,
  },
  {
    code: "+33",
    country: "Francia",
    flag: "🇫🇷",
    pattern: /^(\d{1,3})?(\d{2})?(\d{2})?(\d{2})?$/,
  },
  {
    code: "+49",
    country: "Alemania",
    flag: "🇩🇪",
    pattern: /^(\d{3,5})?(\d{3,8})?$/,
  },
  {
    code: "+39",
    country: "Italia",
    flag: "🇮🇹",
    pattern: /^(\d{3,4})?(\d{6,7})?$/,
  },
  {
    code: "+7",
    country: "Rusia",
    flag: "🇷🇺",
    pattern: /^(\d{3})?(\d{3})?(\d{2})?(\d{2})?$/,
  },
  {
    code: "+81",
    country: "Japón",
    flag: "🇯🇵",
    pattern: /^(\d{1,4})?(\d{1,4})?(\d{3,4})?$/,
  },
  {
    code: "+86",
    country: "China",
    flag: "🇨🇳",
    pattern: /^(\d{3,4})?(\d{4})?(\d{4})?$/,
  },
  {
    code: "+61",
    country: "Australia",
    flag: "🇦🇺",
    pattern: /^(\d{1})?(\d{4})?(\d{4})?$/,
  },
  {
    code: "+64",
    country: "NZ",
    flag: "🇳🇿",
    pattern: /^(\d{1})?(\d{3})?(\d{4})?$/,
  },
  {
    code: "+506",
    country: "Costa Rica",
    flag: "🇨🇷",
    pattern: /^(\d{4})?(\d{4})?$/,
  },
  {
    code: "+598",
    country: "Uruguay",
    flag: "🇺🇾",
    pattern: /^(\d{2})?(\d{3})?(\d{3})?$/,
  },
  {
    code: "+595",
    country: "Paraguay",
    flag: "🇵🇾",
    pattern: /^(\d{2,3})?(\d{3})?(\d{3})?$/,
  },
  {
    code: "+591",
    country: "Bolivia",
    flag: "🇧🇴",
    pattern: /^(\d{1,4})?(\d{4})?(\d{4})?$/,
  },
  {
    code: "+593",
    country: "Ecuador",
    flag: "🇪🇨",
    pattern: /^(\d{1,3})?(\d{3})?(\d{4})?$/,
  },
];

const formatPhoneNumber = (value, countryCode) => {
  if (!value) return value;

  const numbers = value.replace(/\D/g, "");
  const country = countryCodes.find((c) => c.code === countryCode);

  if (!country || !country.pattern) return numbers;

  // Aplicar formato basado en el patrón del país
  const match = numbers.match(country.pattern);
  if (!match) return numbers;

  // Filtrar grupos undefined
  const groups = match.slice(1).filter((group) => group);

  // Unir con espacios según el formato
  return groups.join(" ");
};

export const PhoneInput = ({
  value = "",
  onChange,
  error = false,
  helperText = "",
  fullWidth = true,
  ...props
}) => {
  // Parsear el valor inicial si viene completo
  const initialCountryCode = value?.startsWith("+")
    ? countryCodes.find((c) => value.startsWith(c.code))?.code || "+54"
    : "+54";

  const initialLocalNumber = value?.startsWith("+")
    ? value.replace(initialCountryCode, "").trim()
    : value;

  const [selectedCountry, setSelectedCountry] = useState(initialCountryCode);
  const [localNumber, setLocalNumber] = useState(initialLocalNumber);
  const [formattedNumber, setFormattedNumber] = useState("");

  // Efecto para formatear el número
  useEffect(() => {
    const formatted = formatPhoneNumber(localNumber, selectedCountry);
    setFormattedNumber(formatted);
  }, [localNumber, selectedCountry]);

  // Efecto para notificar cambios al padre
  useEffect(() => {
    if (onChange) {
      const fullNumber = selectedCountry + " " + formattedNumber;
      onChange(fullNumber.trim());
    }
  }, [selectedCountry, formattedNumber, onChange]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    // Limpiar formato al cambiar país
    const cleanNumber = localNumber.replace(/\D/g, "");
    setLocalNumber(cleanNumber);
  };

  const handleNumberChange = (e) => {
    // Solo permitir números y espacios para formato
    const input = e.target.value.replace(/[^\d\s]/g, "");
    setLocalNumber(input.replace(/\s/g, ""));
  };

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
        {/* Selector de país */}
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          error={error}
          sx={{
            width: "35%",
            height: "56px",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 1.5,
            },
          }}
        >
          {countryCodes.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: "1.2rem" }}>{country.flag}</span>
                <Typography variant="body2">{country.code}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>

        {/* Campo de número */}
        <TextField
          {...props}
          value={formattedNumber}
          onChange={handleNumberChange}
          error={error}
          fullWidth
          placeholder={
            selectedCountry === "+54"
              ? "11 1234 5678"
              : selectedCountry === "+1"
              ? "123 456 7890"
              : selectedCountry === "+34"
              ? "123 456 789"
              : "Número local"
          }
          sx={{
            width: "65%",
            "& .MuiOutlinedInput-root": {
              height: "56px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2" color="text.secondary">
                  {selectedCountry}
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          color={error ? "error" : "text.secondary"}
          sx={{
            display: "block",
            ml: 1.5,
            mt: 0.5,
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

// Hook de validación opcional
export const usePhoneValidation = () => {
  const validatePhone = (phoneNumber, countryCode = "+54") => {
    if (!phoneNumber || phoneNumber.trim() === "") {
      return "El teléfono es requerido";
    }

    // Eliminar código de país y espacios
    const cleanNumber = phoneNumber
      .replace(countryCode, "")
      .replace(/\s/g, "")
      .replace(/\D/g, "");

    // Validaciones básicas por país
    const validations = {
      "+54": /^\d{6,12}$/, // Argentina: 6-12 dígitos
      "+1": /^\d{10}$/, // USA/Canada: 10 dígitos
      "+52": /^\d{10}$/, // México: 10 dígitos
      "+34": /^\d{9}$/, // España: 9 dígitos
      "+55": /^\d{10,11}$/, // Brasil: 10-11 dígitos
      "+56": /^\d{8,9}$/, // Chile: 8-9 dígitos
      "+57": /^\d{10}$/, // Colombia: 10 dígitos
    };

    const pattern = validations[countryCode] || /^\d{6,15}$/; // Pattern genérico

    if (!pattern.test(cleanNumber)) {
      return `Ingrese un número válido para ${countryCode}`;
    }

    return "";
  };

  return { validatePhone };
};
