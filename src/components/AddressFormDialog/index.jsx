import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { MdHome, MdBusiness, MdLocationOn } from 'react-icons/md';

const AddressFormDialog = ({ open, onClose, onSave, editingAddress }) => {
  const [formFields, setFormFields] = useState({
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    mobile: '',
    landmark: '',
    addressType: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingAddress) {
      setFormFields({
        address_line: editingAddress.address_line || '',
        city: editingAddress.city || '',
        state: editingAddress.state || '',
        pincode: editingAddress.pincode || '',
        country: editingAddress.country || '',
        mobile: editingAddress.mobile || '',
        landmark: editingAddress.landmark || '',
        addressType: editingAddress.addressType || '',
      });
    } else {
      setFormFields({
        address_line: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        mobile: '',
        landmark: '',
        addressType: '',
      });
    }
    setErrors({});
  }, [editingAddress, open]);

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
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
    } else if (!/^\d{5,10}$/.test(formFields.pincode.trim())) {
      newErrors.pincode = 'Invalid pincode format (5-10 digits)';
    }

    if (!formFields.country?.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formFields.mobile?.trim()) {
      newErrors.mobile = 'Mobile is required';
    } else if (!/^\d{10,15}$/.test(formFields.mobile.replace(/[\s\-]/g, ''))) {
      newErrors.mobile = 'Invalid mobile number (10-15 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const addressData = {
        address_line: formFields.address_line.trim(),
        city: formFields.city.trim(),
        state: formFields.state.trim(),
        pincode: formFields.pincode.trim(),
        country: formFields.country.trim(),
        mobile: formFields.mobile.trim(),
        landmark: formFields.landmark.trim(),
        addressType: formFields.addressType || undefined,
      };
      await onSave(addressData);
    } catch (error) {
      console.error('Save address error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '8px', margin: { xs: '16px', sm: '32px' } },
      }}
    >
      <DialogTitle className="font-bold text-[16px] sm:text-[18px] px-4 sm:px-6">
        {editingAddress ? 'Edit Address' : 'Add New Address'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
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
              disabled={loading}
              multiline
              rows={2}
              placeholder="Street, Building, Apartment"
            />

            <TextField
              label="Landmark (Optional)"
              variant="outlined"
              name="landmark"
              value={formFields.landmark}
              onChange={onChangeField}
              error={!!errors.landmark}
              helperText={
                errors.landmark || 'E.g., Near City Mall, Opposite School'
              }
              fullWidth
              disabled={loading}
              placeholder="Near City Mall"
              sx={{ mt: 1.5 }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-5 sm:gap-x-6 mt-2">
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-5 sm:gap-x-6">
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
              placeholder="0123456789"
            />

            <div className="mt-3 sm:mt-4">
              <h6 className="mb-2 text-[13px] sm:text-sm font-medium text-gray-700">
                Address Type (Optional)
              </h6>
              <RadioGroup
                row
                name="addressType"
                value={formFields.addressType}
                onChange={onChangeField}
                sx={{
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                <FormControlLabel
                  value="Home"
                  control={<Radio size="small" />}
                  label={
                    <span className="flex items-center gap-1 text-[13px] sm:text-[14px]">
                      <MdHome className="text-[16px]" /> Home
                    </span>
                  }
                  disabled={loading}
                  sx={{ mr: { xs: 1, sm: 2 } }}
                />
                <FormControlLabel
                  value="Office"
                  control={<Radio size="small" />}
                  label={
                    <span className="flex items-center gap-1 text-[13px] sm:text-[14px]">
                      <MdBusiness className="text-[16px]" /> Office
                    </span>
                  }
                  disabled={loading}
                  sx={{ mr: { xs: 1, sm: 2 } }}
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio size="small" />}
                  label={
                    <span className="flex items-center gap-1 text-[13px] sm:text-[14px]">
                      <MdLocationOn className="text-[16px]" /> Other
                    </span>
                  }
                  disabled={loading}
                  sx={{ mr: { xs: 1, sm: 2 } }}
                />
              </RadioGroup>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="px-4 sm:px-6 pb-3 sm:pb-4 flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            onClick={onClose}
            className="capitalize! w-full sm:w-auto text-[13px] sm:text-[14px]"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="capitalize! bg-blue-600! hover:bg-blue-700! w-full sm:w-auto text-[13px] sm:text-[14px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={16} className="mr-2" color="inherit" />
                Saving...
              </>
            ) : editingAddress ? (
              'Update Address'
            ) : (
              'Add Address'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddressFormDialog;
