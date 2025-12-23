// Main components exports
export { default as CompanySelectView } from './components/company/CompanySelectView';
export { default as CompanyView } from './components/company/CompanyView';

// Common components exports
export { default as RoleChip } from './components/common/RoleChip';
export { default as ErrorPaper } from './components/common/ErrorPaper';
export { default as LoadingGrid } from './components/common/LoadingGrid';

// Company-specific components
export { default as CompanyCard } from './components/company/CompanyCard';
export { default as CreateCompanyDialog } from './components/company/CreateCompanyDialog';

// Tab components
export { default as CompanyStaffTab } from './components/tabs/CompanyStaffTab';
export { default as CompanyCashTab } from './components/tabs/CompanyCashTab';
export { default as CompanyServicesTab } from './components/tabs/CompanyServicesTab';
export { default as CompanySettingsTab } from './components/tabs/CompanySettingsTab';

// Hooks exports
export { useCompany } from './hooks/useCompany';
export { useCompanies } from './hooks/useCompanies';

// Constants exports
export { ROLES, TABS_BY_ROLE, ROLE_PERMISSIONS } from './constants/roles';

// Utils exports
export { getInitials, formatCurrency, hasPermission } from './utils/helpers';

// Services exports
export { default as CompanyAPI } from './services/companyAPI';