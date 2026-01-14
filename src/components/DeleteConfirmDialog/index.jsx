import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import { MdHome, MdBusiness, MdLocationOn } from 'react-icons/md';

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  address,
  title = 'Delete Address',
  message = 'Are you sure you want to delete this address?',
  subMessage = "Don't worry! You can restore it later from the Deleted Addresses tab.",
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmColor = 'red',
}) => {
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
      PaperProps={{ sx: { borderRadius: '8px', minWidth: '400px' } }}
    >
      <DialogTitle className="font-bold">{title}</DialogTitle>
      <DialogContent>
        <p className="text-[14px] text-gray-600 mb-2">{message}</p>
        {subMessage && (
          <p className="text-[12px] text-gray-500 mb-3">{subMessage}</p>
        )}
        {address && (
          <div className="mt-3 p-3 bg-gray-50 rounded">
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
            <p className="text-sm font-semibold">{address.address_line}</p>
            {address.landmark && (
              <p className="text-xs text-gray-500 italic">{address.landmark}</p>
            )}
            <p className="text-xs text-gray-600">
              {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        )}
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button onClick={onClose} className="capitalize!">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          className={`capitalize! ${
            confirmColor === 'red'
              ? 'bg-red-500! hover:bg-red-600!'
              : 'bg-blue-500! hover:bg-blue-600!'
          }`}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
