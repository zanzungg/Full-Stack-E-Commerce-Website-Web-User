import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import { MdRestore, MdHome, MdBusiness, MdLocationOn } from 'react-icons/md';

const RestoreConfirmDialog = ({ open, onClose, onConfirm, address }) => {
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
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: '8px', margin: '16px' } }}
    >
      <DialogTitle className="font-bold text-[16px] sm:text-[18px]">
        Restore Address
      </DialogTitle>
      <DialogContent>
        <p className="text-[13px] sm:text-[14px] text-gray-600 mb-3">
          Do you want to restore this address?
        </p>
        {address && (
          <div className="mt-3 p-2.5 sm:p-3 bg-green-50 rounded border border-green-200">
            {address.addressType && (
              <Chip
                icon={getAddressTypeIcon(address.addressType)}
                label={address.addressType}
                size="small"
                color={getAddressTypeColor(address.addressType)}
                variant="outlined"
                className="mb-2"
                sx={{
                  fontSize: { xs: '10px', sm: '12px' },
                  height: { xs: '22px', sm: '24px' },
                }}
              />
            )}
            <p className="text-[13px] sm:text-sm font-semibold text-green-900">
              {address.address_line}
            </p>
            {address.landmark && (
              <p className="text-[11px] sm:text-xs text-green-700 italic">
                {address.landmark}
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-green-700">
              {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        )}
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button onClick={onClose} className="capitalize!">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          className="capitalize! bg-green-500! hover:bg-green-600!"
          startIcon={<MdRestore />}
        >
          Restore Address
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreConfirmDialog;
