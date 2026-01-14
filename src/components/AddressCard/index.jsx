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
      className={`border-2 rounded-lg p-4 relative transition-all ${
        isDeleted
          ? 'border-red-200 bg-red-50 opacity-75'
          : address.selected
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {address.selected && !isDeleted && (
        <div className="absolute top-3 right-3">
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <MdCheckCircle /> Default
          </span>
        </div>
      )}

      {isDeleted && (
        <div className="absolute top-3 right-3">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Deleted
          </span>
        </div>
      )}

      <div className="mb-3">
        {address.addressType && (
          <div className="mb-2">
            <Chip
              icon={getAddressTypeIcon(address.addressType)}
              label={address.addressType}
              size="small"
              color={getAddressTypeColor(address.addressType)}
              variant="outlined"
            />
          </div>
        )}

        <p className="font-semibold text-gray-800">{address.address_line}</p>
        {address.landmark && (
          <p className="text-sm text-gray-500 italic">
            Landmark: {address.landmark}
          </p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          {address.city}, {address.state}
        </p>
        <p className="text-sm text-gray-600">
          {address.country} - {address.pincode}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-medium">Phone:</span> {address.mobile}
        </p>
      </div>

      <div className="flex gap-2 mt-4 border-t pt-3">
        {!isDeleted ? (
          <>
            {!address.selected && (
              <Button
                size="small"
                className="text-xs! text-blue-600! hover:bg-blue-50!"
                onClick={() => onSetDefault(address._id)}
              >
                Set as Default
              </Button>
            )}
            <Button
              size="small"
              className="text-xs! text-gray-600! hover:bg-gray-100!"
              onClick={() => onEdit(address)}
            >
              <MdEdit className="mr-1" /> Edit
            </Button>
            <Button
              size="small"
              className="text-xs! text-red-600! hover:bg-red-50!"
              onClick={() => onDelete(address)}
              disabled={address.selected}
              title={
                address.selected
                  ? 'Cannot delete default address'
                  : 'Delete address'
              }
            >
              <MdDelete className="mr-1" /> Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              size="small"
              className="text-xs! text-green-600! hover:bg-green-50! flex-1!"
              onClick={() => onRestore(address)}
            >
              <MdRestore className="mr-1" /> Restore
            </Button>
            <Button
              size="small"
              className="text-xs! text-red-600! hover:bg-red-50! flex-1!"
              onClick={() => onHardDelete(address)}
            >
              <MdDeleteForever className="mr-1" /> Delete Forever
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
