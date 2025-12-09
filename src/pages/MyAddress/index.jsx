import React, { useState, useContext, useEffect } from 'react';
import { Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, Box } from '@mui/material';
import TextField from "@mui/material/TextField";
import { MdAdd, MdEdit, MdDelete, MdCheckCircle, MdRestore } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { MyContext } from '../../App';
import { useAuthContext } from '../../contexts/AuthContext';
import { addressService } from '../../api/services/addressService';
import AccountSidebar from '../../components/AccountSidebar';

const MyAddress = () => {
    const context = useContext(MyContext);
    const { user, refreshUserProfile } = useAuthContext();
    
    const [allAddresses, setAllAddresses] = useState([]);
    const [activeAddresses, setActiveAddresses] = useState([]);
    const [deletedAddresses, setDeletedAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
    const [restoringAddress, setRestoringAddress] = useState(null);
    const [tabValue, setTabValue] = useState(0); // 0: Active, 1: Deleted
    
    const [formFields, setFormFields] = useState({
        address_line: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        mobile: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await refreshUserProfile();
            const addresses = response.address_details || [];
            
            setAllAddresses(addresses);
            // Filter active addresses (status: true)
            setActiveAddresses(addresses.filter(addr => addr.status === true));
            // Filter deleted addresses (status: false)
            setDeletedAddresses(addresses.filter(addr => addr.status === false));
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            context.openAlertBox("error", "Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const onChangeField = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formFields.address_line?.trim()) {
            newErrors.address_line = 'Address is required';
        }

        if (!formFields.city?.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formFields.state?.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formFields.pincode?.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{5,6}$/.test(formFields.pincode.trim())) {
            newErrors.pincode = 'Invalid pincode format';
        }

        if (!formFields.country?.trim()) {
            newErrors.country = 'Country is required';
        }

        if (!formFields.mobile?.trim()) {
            newErrors.mobile = 'Mobile is required';
        } else if (!/^[\d\s\-\+\(\)]{10,15}$/.test(formFields.mobile.trim())) {
            newErrors.mobile = 'Invalid mobile number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpenDialog = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormFields({
                address_line: address.address_line || '',
                city: address.city || '',
                state: address.state || '',
                pincode: address.pincode || '',
                country: address.country || '',
                mobile: address.mobile || ''
            });
        } else {
            setEditingAddress(null);
            setFormFields({
                address_line: '',
                city: '',
                state: '',
                pincode: '',
                country: '',
                mobile: ''
            });
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAddress(null);
        setFormFields({
            address_line: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            mobile: ''
        });
        setErrors({});
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setFormLoading(true);

            const addressData = {
                address_line: formFields.address_line.trim(),
                city: formFields.city.trim(),
                state: formFields.state.trim(),
                pincode: formFields.pincode.trim(),
                country: formFields.country.trim(),
                mobile: formFields.mobile.trim()
            };

            let response;
            if (editingAddress) {
                response = await addressService.updateAddress(editingAddress._id, addressData);
                context.openAlertBox("success", response.message || "Address updated successfully!");
            } else {
                response = await addressService.createAddress(addressData);
                context.openAlertBox("success", response.message || "Address added successfully!");
            }

            handleCloseDialog();
            fetchAddresses();

        } catch (error) {
            console.error('Save address error:', error);

            let errorMessage = 'Failed to save address';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server';
            }

            context.openAlertBox("error", errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const response = await addressService.selectAddress(addressId);
            context.openAlertBox("success", response.message || "Default address updated!");
            fetchAddresses();
        } catch (error) {
            console.error('Set default error:', error);
            
            let errorMessage = 'Failed to set default address';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            context.openAlertBox("error", errorMessage);
        }
    };

    const handleOpenDeleteDialog = (address) => {
        setDeletingAddress(address);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingAddress(null);
    };

    const handleDeleteAddress = async () => {
        if (!deletingAddress) return;

        try {
            const response = await addressService.deactivateAddress(deletingAddress._id);
            context.openAlertBox("success", response.message || "Address deleted successfully!");
            handleCloseDeleteDialog();
            fetchAddresses();
        } catch (error) {
            console.error('Delete address error:', error);
            
            let errorMessage = 'Failed to delete address';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            context.openAlertBox("error", errorMessage);
        }
    };

    const handleOpenRestoreDialog = (address) => {
        setRestoringAddress(address);
        setOpenRestoreDialog(true);
    };

    const handleCloseRestoreDialog = () => {
        setOpenRestoreDialog(false);
        setRestoringAddress(null);
    };

    const handleRestoreAddress = async () => {
        if (!restoringAddress) return;

        try {
            const response = await addressService.restoreAddress(restoringAddress._id);
            context.openAlertBox("success", response.message || "Address restored successfully!");
            handleCloseRestoreDialog();
            fetchAddresses();
            // Switch to active tab
            setTabValue(0);
        } catch (error) {
            console.error('Restore address error:', error);
            
            let errorMessage = 'Failed to restore address';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            context.openAlertBox("error", errorMessage);
        }
    };

    if (loading) {
        return (
            <section className='py-10 w-full'>
                <div className='container flex items-center justify-center min-h-[400px]'>
                    <CircularProgress size={50} />
                </div>
            </section>
        );
    }

    const renderAddressCard = (address, isDeleted = false) => (
        <div 
            key={address._id}
            className={`border-2 rounded-lg p-4 relative ${
                isDeleted 
                ? 'border-red-200 bg-red-50 opacity-75' 
                : address.selected 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200'
            }`}
        >
            {address.selected && !isDeleted && (
                <div className='absolute top-3 right-3'>
                    <span className='bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                        <MdCheckCircle /> Default
                    </span>
                </div>
            )}

            {isDeleted && (
                <div className='absolute top-3 right-3'>
                    <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                        Deleted
                    </span>
                </div>
            )}

            <div className='mb-3'>
                <p className='font-semibold text-gray-800'>
                    {address.address_line}
                </p>
                <p className='text-sm text-gray-600'>
                    {address.city}, {address.state}
                </p>
                <p className='text-sm text-gray-600'>
                    {address.country} - {address.pincode}
                </p>
                <p className='text-sm text-gray-600 mt-2'>
                    Phone: {address.mobile}
                </p>
            </div>

            <div className='flex gap-2 mt-4 border-t pt-3'>
                {!isDeleted ? (
                    <>
                        {!address.selected && (
                            <Button
                                className='text-xs! text-blue-600! hover:bg-blue-50!'
                                onClick={() => handleSetDefault(address._id)}
                            >
                                Set as Default
                            </Button>
                        )}
                        <Button
                            className='text-xs! text-gray-600! hover:bg-gray-100!'
                            onClick={() => handleOpenDialog(address)}
                        >
                            <MdEdit className='mr-1'/> Edit
                        </Button>
                        <Button
                            className='text-xs! text-red-600! hover:bg-red-50!'
                            onClick={() => handleOpenDeleteDialog(address)}
                            disabled={address.selected}
                            title={address.selected ? "Cannot delete default address" : "Delete address"}
                        >
                            <MdDelete className='mr-1'/> Delete
                        </Button>
                    </>
                ) : (
                    <Button
                        className='text-xs! text-green-600! hover:bg-green-50! w-full!'
                        onClick={() => handleOpenRestoreDialog(address)}
                    >
                        <MdRestore className='mr-1'/> Restore Address
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <section className='py-10 w-full'>
            <div className='container flex gap-5'>
                {/* Sidebar */}
                <div className='col1 w-[25%]'>
                    <AccountSidebar />
                </div>

                {/* Main Content */}
                <div className='col2 w-[75%]'>
                    <div className='card bg-white shadow-md rounded-md p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-[22px] font-bold'>My Addresses</h2>
                            <Button 
                                className='btn-org flex items-center gap-2'
                                onClick={() => handleOpenDialog()}
                            >
                                <MdAdd className='text-[20px]'/>
                                Add New Address
                            </Button>
                        </div>

                        {/* Tabs */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab 
                                    label={`Active Addresses (${activeAddresses.length})`}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                />
                                <Tab 
                                    label={`Deleted Addresses (${deletedAddresses.length})`}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                />
                            </Tabs>
                        </Box>

                        {/* Active Addresses Tab */}
                        {tabValue === 0 && (
                            <>
                                {activeAddresses.length === 0 ? (
                                    <div className='text-center py-16'>
                                        <IoLocationSharp className='text-[80px] text-gray-300 mx-auto mb-4'/>
                                        <h3 className='text-[18px] font-semibold text-gray-600 mb-2'>
                                            No Addresses Found
                                        </h3>
                                        <p className='text-gray-500 mb-6'>
                                            Add your first address to get started
                                        </p>
                                        <Button 
                                            className='btn-org'
                                            onClick={() => handleOpenDialog()}
                                        >
                                            Add Address
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-2 gap-4'>
                                        {activeAddresses.map((address) => renderAddressCard(address, false))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Deleted Addresses Tab */}
                        {tabValue === 1 && (
                            <>
                                {deletedAddresses.length === 0 ? (
                                    <div className='text-center py-16'>
                                        <MdDelete className='text-[80px] text-gray-300 mx-auto mb-4'/>
                                        <h3 className='text-[18px] font-semibold text-gray-600 mb-2'>
                                            No Deleted Addresses
                                        </h3>
                                        <p className='text-gray-500'>
                                            Deleted addresses will appear here
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className='bg-blue-50 p-3 rounded-md mb-4'>
                                            <p className='text-sm text-blue-800'>
                                                <strong>Note:</strong> You can restore deleted addresses anytime. 
                                                Restored addresses will be moved back to Active Addresses.
                                            </p>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            {deletedAddresses.map((address) => renderAddressCard(address, true))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Address Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '8px'
                    }
                }}
            >
                <DialogTitle className='font-bold'>
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <form onSubmit={handleSaveAddress}>
                    <DialogContent>
                        <div className='space-y-4'>
                            <TextField
                                label="Address Line"
                                variant="outlined"
                                name="address_line"
                                value={formFields.address_line}
                                onChange={onChangeField}
                                error={!!errors.address_line}
                                helperText={errors.address_line}
                                fullWidth
                                required
                                disabled={formLoading}
                                multiline
                                rows={2}
                                placeholder="Street, Building, Apartment"
                            />

                            <div className='grid grid-cols-2 gap-4 mt-4'>
                                <TextField
                                    label="City"
                                    variant="outlined"
                                    name="city"
                                    value={formFields.city}
                                    onChange={onChangeField}
                                    error={!!errors.city}
                                    helperText={errors.city}
                                    fullWidth
                                    required
                                    disabled={formLoading}
                                />

                                <TextField
                                    label="State/Province"
                                    variant="outlined"
                                    name="state"
                                    value={formFields.state}
                                    onChange={onChangeField}
                                    error={!!errors.state}
                                    helperText={errors.state}
                                    fullWidth
                                    required
                                    disabled={formLoading}
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <TextField
                                    label="Pincode/Zipcode"
                                    variant="outlined"
                                    name="pincode"
                                    value={formFields.pincode}
                                    onChange={onChangeField}
                                    error={!!errors.pincode}
                                    helperText={errors.pincode}
                                    fullWidth
                                    required
                                    disabled={formLoading}
                                    placeholder="530000"
                                />

                                <TextField
                                    label="Country"
                                    variant="outlined"
                                    name="country"
                                    value={formFields.country}
                                    onChange={onChangeField}
                                    error={!!errors.country}
                                    helperText={errors.country}
                                    fullWidth
                                    required
                                    disabled={formLoading}
                                />
                            </div>

                            <TextField
                                label="Mobile Number"
                                variant="outlined"
                                name="mobile"
                                value={formFields.mobile}
                                onChange={onChangeField}
                                error={!!errors.mobile}
                                helperText={errors.mobile}
                                fullWidth
                                required
                                disabled={formLoading}
                                placeholder="0123456789"
                            />
                        </div>
                    </DialogContent>
                    <DialogActions className='px-6 pb-4'>
                        <Button 
                            onClick={handleCloseDialog}
                            className='capitalize!'
                            disabled={formLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            variant="contained"
                            className='capitalize! bg-blue-600! hover:bg-blue-700!'
                            disabled={formLoading}
                        >
                            {formLoading ? (
                                <>
                                    <CircularProgress size={16} className='mr-2' color="inherit" />
                                    Saving...
                                </>
                            ) : editingAddress ? 'Update Address' : 'Add Address'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        minWidth: '400px'
                    }
                }}
            >
                <DialogTitle className='font-bold'>
                    Delete Address
                </DialogTitle>
                <DialogContent>
                    <p className='text-[14px] text-gray-600 mb-2'>
                        Are you sure you want to delete this address?
                    </p>
                    <p className='text-[12px] text-gray-500 mb-3'>
                        Don't worry! You can restore it later from the Deleted Addresses tab.
                    </p>
                    {deletingAddress && (
                        <div className='mt-3 p-3 bg-gray-50 rounded'>
                            <p className='text-sm font-semibold'>{deletingAddress.address_line}</p>
                            <p className='text-xs text-gray-600'>
                                {deletingAddress.city}, {deletingAddress.state} - {deletingAddress.pincode}
                            </p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className='px-6 pb-4'>
                    <Button 
                        onClick={handleCloseDeleteDialog}
                        className='capitalize!'
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteAddress}
                        variant="contained"
                        className='capitalize! bg-red-500! hover:bg-red-600!'
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Restore Confirmation Dialog */}
            <Dialog
                open={openRestoreDialog}
                onClose={handleCloseRestoreDialog}
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        minWidth: '400px'
                    }
                }}
            >
                <DialogTitle className='font-bold'>
                    Restore Address
                </DialogTitle>
                <DialogContent>
                    <p className='text-[14px] text-gray-600'>
                        Do you want to restore this address?
                    </p>
                    {restoringAddress && (
                        <div className='mt-3 p-3 bg-green-50 rounded border border-green-200'>
                            <p className='text-sm font-semibold text-green-900'>{restoringAddress.address_line}</p>
                            <p className='text-xs text-green-700'>
                                {restoringAddress.city}, {restoringAddress.state} - {restoringAddress.pincode}
                            </p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className='px-6 pb-4'>
                    <Button 
                        onClick={handleCloseRestoreDialog}
                        className='capitalize!'
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleRestoreAddress}
                        variant="contained"
                        className='capitalize! bg-green-500! hover:bg-green-600!'
                        startIcon={<MdRestore />}
                    >
                        Restore Address
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
}

export default MyAddress;