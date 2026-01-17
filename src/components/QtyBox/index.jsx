import { Button } from '@mui/material';
import { useState } from 'react';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

const QtyBox = ({ quantity = 1, onChange, max = 100 }) => {
  const [qtyVal, setQtyVal] = useState(1);
  const isControlled = typeof onChange === 'function';
  const currentQty = isControlled ? quantity : qtyVal;

  const updateQty = (newQty) => {
    if (newQty >= 1 && newQty <= max) {
      if (isControlled) onChange(newQty);
      else setQtyVal(newQty);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    updateQty(Math.max(1, Math.min(value, max)));
  };

  return (
    <div className="qtyBox flex items-center relative overflow-hidden border border-[rgba(0,0,0,0.2)] rounded-md h-9 md:h-10">
      <input
        type="number"
        className="no-spinner w-full h-full p-1.5 md:p-2 pl-3 md:pl-5 text-[13px] md:text-[15px] focus:outline-none border-none bg-transparent"
        value={currentQty}
        onChange={handleInputChange}
        min={1}
        max={max}
      />

      <div className="flex flex-col w-[26px] md:w-[30px] absolute top-0 right-0 h-full border-l border-[rgba(0,0,0,0.1)] bg-white">
        <Button
          className="min-w-full! flex-1! min-h-0! p-0! text-black! rounded-none! hover:bg-[#f1f1f1]! flex items-center justify-center"
          onClick={() => updateQty(currentQty + 1)}
          disabled={currentQty >= max}
        >
          <FaAngleUp className="text-[10px] md:text-[12px] opacity-55" />
        </Button>

        <Button
          className="min-w-full! flex-1! min-h-0! p-0! text-black! rounded-none! hover:bg-[#f1f1f1]! flex items-center justify-center border-t border-[rgba(0,0,0,0.1)]"
          onClick={() => updateQty(currentQty - 1)}
          disabled={currentQty <= 1}
        >
          <FaAngleDown className="text-[10px] md:text-[12px] opacity-55" />
        </Button>
      </div>
    </div>
  );
};

export default QtyBox;
