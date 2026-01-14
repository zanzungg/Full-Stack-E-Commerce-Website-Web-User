import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  MdHome,
  MdBusiness,
  MdLocationOn,
  MdDeleteForever,
  MdWarning,
} from 'react-icons/md';

const HardDeleteConfirmDialog = ({ open, onClose, onConfirm, address }) => {
  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'Home':
        return <MdHome className="text-[16px]" />;
      case 'Office':
        return <MdBusiness className="text-[16px]" />;
      case 'Other':
        return <MdLocationOn className="text-[16px]" />;
      default:
        return null;
    }
  };

  const getAddressTypeColor = (type) => {
    switch (type) {
      case 'Home':
        return 'default';
      case 'Office':
        return 'primary';
      case 'Other':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '8px', minWidth: '450px' } }}
    >
      <DialogTitle className="font-bold text-red-600 flex items-center gap-2">
        <MdDeleteForever className="text-[24px]" />
        Permanently Delete Address
      </DialogTitle>
      <DialogContent>
        <Alert severity="error" icon={<MdWarning />} className="mb-4">
          <AlertTitle className="font-bold">
            Warning: This action cannot be undone!
          </AlertTitle>
          This will permanently delete the address from the system. You will not
          be able to restore it.
        </Alert>

        <p className="text-[14px] text-gray-600 mb-3 font-semibold">
          Are you absolutely sure you want to permanently delete this address?
        </p>

        {address && (
          <div className="mt-3 p-3 bg-red-50 rounded border-2 border-red-300">
            {address.addressType && (
              <Chip
                icon={getAddressTypeIcon(address.addressType)}
                label={address.addressType}
                size="small"
                color={getAddressTypeColor(address.addressType)}
                variant="outlined"
                className="mb-2"
              />
            )}
            <p className="text-sm font-semibold text-red-900">
              {address.address_line}
            </p>
            {address.landmark && (
              <p className="text-xs text-red-700 italic">
                Landmark: {address.landmark}
              </p>
            )}
            <p className="text-xs text-red-700">
              {address.city}, {address.state}
            </p>
            <p className="text-xs text-red-700">
              {address.country} - {address.pincode}
            </p>
            <p className="text-xs text-red-600 mt-1">
              <span className="font-medium">Phone:</span> {address.mobile}
            </p>
          </div>
        )}
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button onClick={onClose} className="capitalize!" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          className="capitalize! bg-red-600! hover:bg-red-700!"
          startIcon={<MdDeleteForever />}
        >
          Delete Permanently
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HardDeleteConfirmDialog;
