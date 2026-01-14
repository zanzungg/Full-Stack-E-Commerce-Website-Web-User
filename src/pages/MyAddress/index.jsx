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
    <section className="py-10 w-full">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[25%]">
            <AccountSidebar />
          </div>

          <div className="w-full lg:w-[75%]">
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
