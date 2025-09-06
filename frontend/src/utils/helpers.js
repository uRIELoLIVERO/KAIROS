import { ROLES } from '../constants/roles';

/**
 * Genera las iniciales de un nombre completo
 * @param {string} name - El nombre completo
 * @returns {string} - Las iniciales en mayúsculas
 */
export const getInitials = (name = '') => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('');
};

/**
 * Formatea un número como moneda
 * @param {number} amount - El monto a formatear
 * @returns {string} - El monto formateado como moneda
 */
export const formatCurrency = (amount) => {
  const num = Number(amount);

  if (isNaN(num)) return "$0.00"; // fallback si no se puede convertir

  return `$${num.toFixed(2)}`;
};


/**
 * Verifica si un rol tiene permisos específicos
 * @param {string} userRole - El rol del usuario
 * @param {string[]} allowedRoles - Los roles permitidos
 * @returns {boolean} - Si el usuario tiene permisos
 */
export const hasPermission = (roleName, allowedRoleIds) => {
  try {
    if (!roleName || !allowedRoleIds) return false;
    const roleId = ROLES[roleName];
    if (typeof roleId === 'undefined') return false;
    return allowedRoleIds.includes(roleId);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

