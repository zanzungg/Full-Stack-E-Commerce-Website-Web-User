import React, { useState } from 'react';
import { Box, Tabs, Tab, Button, CircularProgress, Chip } from '@mui/material';
import { MdAdd } from 'react-icons/md';
import AccountSidebar from '../../components/AccountSidebar';
import AddressGrid from '../../components/AddressGrid';
import AddressFormDialog from '../../components/AddressFormDialog';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import RestoreConfirmDialog from '../../components/RestoreConfirmDialog';
import HardDeleteConfirmDialog from '../../components/HardDeleteConfirmDialog';
import { MyContext } from '../../App';
import { useAddress } from '../../hooks/useAddress';

const MyAddress = () => {
  const context = React.useContext(MyContext);

  // Custom hook
  const {
    activeAddresses,
    deletedAddresses,
    loading,
    statistics,
    createAddress,
    updateAddress,
    selectAddress: selectAddressAPI,
    deactivateAddress,
    restoreAddress,
    deleteAddressPermanent,
  } = useAddress({
    onSuccess: (message) => context.openAlertBox('success', message),
    onError: (message) => context.openAlertBox('error', message),
    autoFetch: true,
  });

  // UI State
  const [tabValue, setTabValue] = useState(0);
  const [filterType, setFilterType] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState(null);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [restoringAddress, setRestoringAddress] = useState(null);
  const [openHardDeleteDialog, setOpenHardDeleteDialog] = useState(false);
  const [hardDeletingAddress, setHardDeletingAddress] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFilterType('All');
  };

  const handleOpenAddDialog = () => {
    setEditingAddress(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (address) => {
    setEditingAddress(address);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (addressData) => {
    if (editingAddress) {
      await updateAddress(editingAddress._id, addressData);
    } else {
      await createAddress(addressData);
    }
    handleCloseDialog();
  };

  const handleSetDefault = async (addressId) => {
    await selectAddressAPI(addressId);
  };

  const handleDeleteAddress = async () => {
    if (!deletingAddress) return;
    await deactivateAddress(deletingAddress._id);
    setOpenDeleteDialog(false);
    setDeletingAddress(null);
  };

  const handleRestoreAddress = async () => {
    if (!restoringAddress) return;
    await restoreAddress(restoringAddress._id);
    setOpenRestoreDialog(false);
    setRestoringAddress(null);
    setTabValue(0);
  };

  const handleHardDeleteAddress = async () => {
    if (!hardDeletingAddress) return;
    await deleteAddressPermanent(hardDeletingAddress._id);
    setOpenHardDeleteDialog(false);
    setHardDeletingAddress(null);
  };

  const getFilteredAddresses = (addresses) => {
    if (filterType === 'All') return addresses;
    return addresses.filter((addr) => addr.addressType === filterType);
  };

  const filteredActiveAddresses = getFilteredAddresses(activeAddresses);
  const filteredDeletedAddresses = getFilteredAddresses(deletedAddresses);

  return (
    <section className="py-5 sm:py-8 lg:py-10 w-full">
      <div className="container px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
          <div className="w-full lg:w-[25%]">
            <AccountSidebar />
          </div>

          <div className="w-full lg:w-[75%]">
            <div className="card bg-white shadow-md rounded-md p-4 sm:p-5 lg:p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-5 lg:mb-6">
                <div>
                  <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold">
                    My Addresses
                  </h2>
                  <p className="text-[12px] sm:text-sm text-gray-500 mt-1">
                    {statistics.total} total ({statistics.active} active,{' '}
                    {statistics.deleted} deleted)
                  </p>
                </div>
                <Button
                  className="btn-org flex items-center gap-1 sm:gap-2 text-[13px] sm:text-[14px] px-3 sm:px-4 py-2 w-full sm:w-auto"
                  onClick={handleOpenAddDialog}
                >
                  <MdAdd className="text-[18px] sm:text-[20px]" />
                  <span className="sm:inline">Add New Address</span>
                </Button>
              </div>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                >
                  <Tab
                    label={`Active (${statistics.active})`}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '13px', sm: '14px' },
                      minWidth: { xs: 'auto', sm: 160 },
                      px: { xs: 2, sm: 3 },
                    }}
                  />
                  <Tab
                    label={`Deleted (${statistics.deleted})`}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '13px', sm: '14px' },
                      minWidth: { xs: 'auto', sm: 160 },
                      px: { xs: 2, sm: 3 },
                    }}
                  />
                </Tabs>
              </Box>

              {/* Filters */}
              <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                <span className="text-[12px] sm:text-sm font-medium text-gray-700">
                  Filter by type:
                </span>
                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                  {['All', 'Home', 'Office', 'Other'].map((type) => {
                    const count =
                      type === 'All'
                        ? tabValue === 0
                          ? statistics.active
                          : statistics.deleted
                        : tabValue === 0
                          ? statistics.byType.active[type] || 0
                          : statistics.byType.deleted[type] || 0;

                    return (
                      <Chip
                        key={type}
                        label={`${type} (${count})`}
                        onClick={() => setFilterType(type)}
                        color={filterType === type ? 'primary' : 'default'}
                        variant={filterType === type ? 'filled' : 'outlined'}
                        size="small"
                        className="cursor-pointer"
                        sx={{
                          fontSize: { xs: '11px', sm: '13px' },
                          height: { xs: '26px', sm: '32px' },
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Address Grid */}
              {loading &&
              activeAddresses.length === 0 &&
              deletedAddresses.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <CircularProgress size={40} />
                </div>
              ) : (
                <AddressGrid
                  addresses={
                    tabValue === 0
                      ? filteredActiveAddresses
                      : filteredDeletedAddresses
                  }
                  isDeleted={tabValue === 1}
                  filterType={filterType}
                  onEdit={handleOpenEditDialog}
                  onDelete={(addr) => {
                    setDeletingAddress(addr);
                    setOpenDeleteDialog(true);
                  }}
                  onRestore={(addr) => {
                    setRestoringAddress(addr);
                    setOpenRestoreDialog(true);
                  }}
                  onHardDelete={(addr) => {
                    setHardDeletingAddress(addr);
                    setOpenHardDeleteDialog(true);
                  }}
                  onSetDefault={handleSetDefault}
                  onAddNew={handleOpenAddDialog}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddressFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteAddress}
        address={deletingAddress}
      />

      <RestoreConfirmDialog
        open={openRestoreDialog}
        onClose={() => setOpenRestoreDialog(false)}
        onConfirm={handleRestoreAddress}
        address={restoringAddress}
      />

      <HardDeleteConfirmDialog
        open={openHardDeleteDialog}
        onClose={() => setOpenHardDeleteDialog(false)}
        onConfirm={handleHardDeleteAddress}
        address={hardDeletingAddress}
      />
    </section>
  );
};

export default MyAddress;
