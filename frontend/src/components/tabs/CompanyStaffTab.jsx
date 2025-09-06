import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Skeleton,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StaffMemberAPI from '../../services/staffMemberAPI';
import AddMemberModal from '../modal/AddMemberModal';
import EditRoleModal from '../modal/EditRoleModal';

const CompanyStaffTab = ({ companyId, canManage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [addingMember, setAddingMember] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [removingMember, setRemovingMember] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await StaffMemberAPI.getCompanyStaff(companyId);
        const resolvedData = await Promise.all(data);
        setStaff(resolvedData);
      } catch (err) {
        setError(err?.response?.data?.message || 'Error al cargar el personal');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [companyId]);

  const handleAddMember = () => setOpenAdd(true);

  const handleEditRole = (member) => {
    setSelectedMember(member);
    setOpenEdit(true);
  };

  const handleInviteSubmit = async (email) => {
    try {
      setAddingMember(true);
      await StaffMemberAPI.addMember(companyId, email);
      const updatedStaff = await StaffMemberAPI.getCompanyStaff(companyId);
      setStaff(await Promise.all(updatedStaff));
      setOpenAdd(false);
    } catch (err) {
      console.error('Error adding member:', err);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRoleSubmit = async (role) => {
    try {
      setUpdatingRole(true);
      await StaffMemberAPI.updateRole(selectedMember.staffMemberId, role);
      const updatedStaff = await StaffMemberAPI.getCompanyStaff(companyId);
      setStaff(await Promise.all(updatedStaff));
      setOpenEdit(false);
    } catch (err) {
      console.error('Error updating role:', err);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setRemovingMember(true);
      await StaffMemberAPI.deleteStaffMember(memberId);
      const updatedStaff = await StaffMemberAPI.getCompanyStaff(companyId);
      setStaff(await Promise.all(updatedStaff));
    } catch (err) {
      console.error('Error removing member:', err);
    } finally {
      setRemovingMember(false);
    }
  };

  const renderSkeletonRows = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <TableRow key={idx}>
        <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
        <TableCell><Skeleton width="60%" /></TableCell>
        <TableCell><Skeleton width="40%" /></TableCell>
        <TableCell><Skeleton width="30%" /></TableCell>
      </TableRow>
    ));

  return (
    <Paper variant="outlined" sx={{ p: 2, width: '100%', height: '100%' }}>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'flex-start' : 'center'}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={800}>
          Personal
        </Typography>
        {canManage && (
          <Button
            variant="contained"
            onClick={handleAddMember}
            startIcon={<AddIcon />}
          >
            Agregar miembro
          </Button>
        )}
      </Stack>

      <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Operaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => (
                <TableRow
                  key={member.id}
                  hover
                  sx={{
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        src={member.user.avatarUrl}
                        alt={`${member.user.firstName} ${member.user.lastName}`}
                      />
                      <Typography>
                        {member.user.firstName} {member.user.lastName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {canManage && member.role !== 'OWNER' ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() => handleEditRole(member)}
                          disabled={updatingRole}
                        >
                          Editar rol
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveMember(member.staffMemberId)}
                          disabled={removingMember}
                        >
                          {removingMember ? 'Removiendo...' : 'Eliminar'}
                        </Button>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString()
                          : ''}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddMemberModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleInviteSubmit}
        loading={addingMember}
        isMobile={isMobile}
      />

      <EditRoleModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleRoleSubmit}
        currentRole={selectedMember?.role}
        loading={updatingRole}
        isMobile={isMobile}
      />
    </Paper>
  );
};

export default CompanyStaffTab;
