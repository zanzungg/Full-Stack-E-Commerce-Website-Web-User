import { Button } from '@mui/material';
import { IoLocationSharp } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import AddressCard from '../AddressCard';

const AddressGrid = ({
  addresses,
  isDeleted,
  filterType,
  onEdit,
  onDelete,
  onRestore,
  onSetDefault,
  onHardDelete,
  onAddNew,
}) => {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-10 sm:py-12 lg:py-16">
        {isDeleted ? (
          <>
            <MdDelete className="text-[60px] sm:text-[70px] lg:text-[80px] text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold text-gray-600 mb-2">
              {filterType === 'All'
                ? 'No Deleted Addresses'
                : `No Deleted ${filterType} Addresses`}
            </h3>
            <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 px-4">
              {filterType === 'All'
                ? 'Deleted addresses will appear here'
                : 'Try changing the filter'}
            </p>
          </>
        ) : (
          <>
            <IoLocationSharp className="text-[60px] sm:text-[70px] lg:text-[80px] text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold text-gray-600 mb-2">
              {filterType === 'All'
                ? 'No Addresses Found'
                : `No ${filterType} Addresses Found`}
            </h3>
            <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 mb-4 sm:mb-5 lg:mb-6 px-4">
              {filterType === 'All'
                ? 'Add your first address to get started'
                : `Try changing the filter or add a new ${filterType.toLowerCase()} address`}
            </p>
            {filterType === 'All' && (
              <Button
                className="btn-org text-[13px] sm:text-[14px] px-4 sm:px-6"
                onClick={onAddNew}
              >
                Add Address
              </Button>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {isDeleted && (
        <div className="bg-blue-50 p-2.5 sm:p-3 rounded-md mb-3 sm:mb-4 border border-blue-200">
          <p className="text-[12px] sm:text-sm text-blue-800">
            <strong>Note:</strong> You can restore deleted addresses or
            permanently delete them. Permanent deletion cannot be undone.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            isDeleted={isDeleted}
            onEdit={onEdit}
            onDelete={onDelete}
            onRestore={onRestore}
            onSetDefault={onSetDefault}
            onHardDelete={onHardDelete}
          />
        ))}
      </div>
    </>
  );
};

export default AddressGrid;
