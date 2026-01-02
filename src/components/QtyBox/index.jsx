import { Button } from '@mui/material';
import React, { useState } from 'react';
import { FaAngleUp } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa';

const QtyBox = ({ quantity = 1, onChange, max = 100 }) => {
  const [qtyVal, setQtyVal] = useState(1);

  // Use controlled mode if onChange is provided, otherwise use internal state
  const isControlled = typeof onChange === 'function';
  const currentQty = isControlled ? quantity : qtyVal;

  const plusQty = () => {
    const newQty = currentQty + 1;
    if (newQty <= max) {
      if (isControlled) {
        onChange(newQty);
      } else {
        setQtyVal(newQty);
      }
    }
  };

  const minusQty = () => {
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      if (isControlled) {
        onChange(newQty);
      } else {
        setQtyVal(newQty);
      }
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const newQty = Math.max(1, Math.min(value, max));
    if (isControlled) {
      onChange(newQty);
    } else {
      setQtyVal(newQty);
    }
  };

  return (
    <div className="qtyBox flex items-center relative">
      <input
        type="number"
        className="no-spinner w-full h-10 p-2 pl-5 text-[15px] focus:outline-none
                border border-[rgba(0,0,0,0.2)] rounded-md"
        value={currentQty}
        onChange={handleInputChange}
        min={1}
        max={max}
      />

      <div
        className="flex items-center flex-col justify-between h-10 absolute
            top-0 right-0 z-50"
      >
        <Button
          className="min-w-[30px]! w-[30px]! h-5! text-black! rounded-none! hover:bg-[#f1f1f1]!"
          onClick={plusQty}
          disabled={currentQty >= max}
        >
          <FaAngleUp className="text-[12px] opacity-55" />
        </Button>
        <Button
          className="min-w-[30px]! w-[30px]! h-5! text-black! rounded-none! hover:bg-[#f1f1f1]!"
          onClick={minusQty}
          disabled={currentQty <= 1}
        >
          <FaAngleDown className="text-[12px] opacity-55" />
        </Button>
      </div>
    </div>
  );
};

export default QtyBox;
