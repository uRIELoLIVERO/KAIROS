export const ROLES = Object.freeze({
  PROFESSIONAL: 1,
  CASHIER: 2,
  PARTNER: 3,
  OWNER: 4
});

export const TABS_BY_ROLE = Object.freeze({
  OWNER: ['Personal', 'Caja', 'Servicios', 'Configuración'],
  PARTNER: ['Personal', 'Caja', 'Servicios'],
  CASHIER: ['Caja'],
  PROFESSIONAL: ['Personal']
});

export const ROLE_PERMISSIONS = Object.freeze({
  canManageStaff: [ROLES.OWNER, ROLES.PARTNER],
  canManageCash: [ROLES.CASHIER, ROLES.PARTNER, ROLES.OWNER],
  canManageServices: [ROLES.PARTNER, ROLES.OWNER],
  canEditSettings: [ROLES.OWNER]
});