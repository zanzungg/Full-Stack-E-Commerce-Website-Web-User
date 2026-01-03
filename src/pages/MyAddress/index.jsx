import React, { useState } from 'react';
import { Box, Tabs, Tab, Button, CircularProgress, Chip } from '@mui/material';
import { MdAdd } from 'react-icons/md';
import { useAddress } from '../../hooks/useAddress';
import { MyContext } from '../../App';
import AccountSidebar from '../../components/AccountSidebar';
import AddressGrid from '../../components/AddressGrid';
import AddressFormDialog from '../../components/AddressFormDialog';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import RestoreConfirmDialog from '../../components/RestoreConfirmDialog';

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

  const getFilteredAddresses = (addresses) => {
    if (filterType === 'All') return addresses;
    return addresses.filter((addr) => addr.addressType === filterType);
  };

  const filteredActiveAddresses = getFilteredAddresses(activeAddresses);
  const filteredDeletedAddresses = getFilteredAddresses(deletedAddresses);

  if (loading && activeAddresses.length === 0) {
    return (
      <section className="py-10 w-full">
        <div className="container flex items-center justify-center min-h-[400px]">
          <CircularProgress size={50} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 w-full">
      <div className="container flex gap-5">
        <div className="col1 w-[25%]">
          <AccountSidebar />
        </div>

        <div className="col2 w-[75%]">
          <div className="card bg-white shadow-md rounded-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[22px] font-bold">My Addresses</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {statistics.total} total addresses ({statistics.active}{' '}
                  active, {statistics.deleted} deleted)
                </p>
              </div>
              <Button
                className="btn-org flex items-center gap-2"
                onClick={handleOpenAddDialog}
              >
                <MdAdd className="text-[20px]" />
                Add New Address
              </Button>
            </div>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab
                  label={`Active Addresses (${statistics.active})`}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
                <Tab
                  label={`Deleted Addresses (${statistics.deleted})`}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
              </Tabs>
            </Box>

            {/* Filters */}
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Filter by type:
              </span>
              <div className="flex gap-2 flex-wrap">
                {['All', 'Home', 'Office', 'Other'].map((type) => {
                  const count =
                    type === 'All'
                      ? tabValue === 0
                        ? statistics.active
                        : statistics.deleted
                      : statistics.byType[type] || 0;

                  return (
                    <Chip
                      key={type}
                      label={`${type} (${count})`}
                      onClick={() => setFilterType(type)}
                      color={filterType === type ? 'primary' : 'default'}
                      variant={filterType === type ? 'filled' : 'outlined'}
                      size="small"
                      className="cursor-pointer"
                    />
                  );
                })}
              </div>
            </div>

            {/* Address Grid */}
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
              onSetDefault={handleSetDefault}
              onAddNew={handleOpenAddDialog}
            />
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
    </section>
  );
};

export default MyAddress;
