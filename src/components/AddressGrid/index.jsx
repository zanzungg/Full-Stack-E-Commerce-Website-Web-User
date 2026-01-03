import React from 'react';
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
  onAddNew,
}) => {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-16">
        {isDeleted ? (
          <>
            <MdDelete className="text-[80px] text-gray-300 mx-auto mb-4" />
            <h3 className="text-[18px] font-semibold text-gray-600 mb-2">
              {filterType === 'All'
                ? 'No Deleted Addresses'
                : `No Deleted ${filterType} Addresses`}
            </h3>
            <p className="text-gray-500">
              {filterType === 'All'
                ? 'Deleted addresses will appear here'
                : 'Try changing the filter'}
            </p>
          </>
        ) : (
          <>
            <IoLocationSharp className="text-[80px] text-gray-300 mx-auto mb-4" />
            <h3 className="text-[18px] font-semibold text-gray-600 mb-2">
              {filterType === 'All'
                ? 'No Addresses Found'
                : `No ${filterType} Addresses Found`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filterType === 'All'
                ? 'Add your first address to get started'
                : `Try changing the filter or add a new ${filterType.toLowerCase()} address`}
            </p>
            {filterType === 'All' && (
              <Button className="btn-org" onClick={onAddNew}>
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
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can restore deleted addresses anytime.
            Restored addresses will be moved back to Active Addresses.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            isDeleted={isDeleted}
            onEdit={onEdit}
            onDelete={onDelete}
            onRestore={onRestore}
            onSetDefault={onSetDefault}
          />
        ))}
      </div>
    </>
  );
};

export default AddressGrid;
