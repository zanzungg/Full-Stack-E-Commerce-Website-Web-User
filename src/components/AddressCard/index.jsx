import { Button, Chip } from '@mui/material';
import {
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdRestore,
  MdHome,
  MdBusiness,
  MdLocationOn,
  MdDeleteForever,
} from 'react-icons/md';

const AddressCard = ({
  address,
  isDeleted = false,
  onEdit,
  onDelete,
  onRestore,
  onSetDefault,
  onHardDelete,
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
    <div
      className={`border-2 rounded-lg p-3 sm:p-4 relative transition-all ${
        isDeleted
          ? 'border-red-200 bg-red-50 opacity-75'
          : address.selected
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {address.selected && !isDeleted && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="bg-green-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1">
            <MdCheckCircle className="text-[12px] sm:text-[14px]" /> Default
          </span>
        </div>
      )}

      {isDeleted && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            Deleted
          </span>
        </div>
      )}

      <div className="mb-2.5 sm:mb-3 pr-16 sm:pr-20">
        {address.addressType && (
          <div className="mb-1.5 sm:mb-2">
            <Chip
              icon={getAddressTypeIcon(address.addressType)}
              label={address.addressType}
              size="small"
              color={getAddressTypeColor(address.addressType)}
              variant="outlined"
              sx={{
                fontSize: { xs: '11px', sm: '13px' },
                height: { xs: '22px', sm: '24px' },
              }}
            />
          </div>
        )}

        <p className="font-semibold text-gray-800 text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed">
          {address.address_line}
        </p>
        {address.landmark && (
          <p className="text-[12px] sm:text-sm text-gray-500 italic mt-0.5">
            Landmark: {address.landmark}
          </p>
        )}
        <p className="text-[12px] sm:text-sm text-gray-600 mt-1">
          {address.city}, {address.state}
        </p>
        <p className="text-[12px] sm:text-sm text-gray-600">
          {address.country} - {address.pincode}
        </p>
        <p className="text-[12px] sm:text-sm text-gray-600 mt-1.5 sm:mt-2">
          <span className="font-medium">Phone:</span> {address.mobile}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 border-t pt-2 sm:pt-3">
        {!isDeleted ? (
          <>
            {!address.selected && (
              <Button
                size="small"
                className="text-[11px]! sm:text-xs! text-blue-600! hover:bg-blue-50! px-2! sm:px-3! py-1! min-w-0!"
                onClick={() => onSetDefault(address._id)}
              >
                <span className="hidden sm:inline">Set as Default</span>
                <span className="sm:hidden">Set Default</span>
              </Button>
            )}
            <Button
              size="small"
              className="text-[11px]! sm:text-xs! text-gray-600! hover:bg-gray-100! px-2! sm:px-3! py-1! min-w-0!"
              onClick={() => onEdit(address)}
            >
              <MdEdit className="mr-0.5 sm:mr-1 text-[14px] sm:text-[16px]" />{' '}
              Edit
            </Button>
            <Button
              size="small"
              className="text-[11px]! sm:text-xs! text-red-600! hover:bg-red-50! px-2! sm:px-3! py-1! min-w-0!"
              onClick={() => onDelete(address)}
              disabled={address.selected}
              title={
                address.selected
                  ? 'Cannot delete default address'
                  : 'Delete address'
              }
            >
              <MdDelete className="mr-0.5 sm:mr-1 text-[14px] sm:text-[16px]" />{' '}
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              size="small"
              className="text-[11px]! sm:text-xs! text-green-600! hover:bg-green-50! flex-1! px-2! sm:px-3! py-1! min-w-0!"
              onClick={() => onRestore(address)}
            >
              <MdRestore className="mr-0.5 sm:mr-1 text-[14px] sm:text-[16px]" />{' '}
              Restore
            </Button>
            <Button
              size="small"
              className="text-[11px]! sm:text-xs! text-red-600! hover:bg-red-50! flex-1! px-2! sm:px-3! py-1! min-w-0!"
              onClick={() => onHardDelete(address)}
            >
              <MdDeleteForever className="mr-0.5 sm:mr-1 text-[14px] sm:text-[16px]" />
              <span className="hidden sm:inline">Delete Forever</span>
              <span className="sm:hidden">Delete</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
