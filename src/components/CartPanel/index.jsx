import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Button } from "@mui/material";

const CartPanel = () => {
    return (
        <>
        <div className='srcoll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden py-3 px-4'>
          <div className='cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4'>
            <div className='img w-[25%] overflow-hidden h-[90px] rounded-md'>
                <Link to="/product/312" className="block group">
                    <img src='https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg'
                className='w-full group-hover:scale-105'/>
                </Link>
            </div>

            <div className='info w-[75%] pr-5 relative'>
                <h4 className='text-[14px] font-medium'>
                    <Link to="/product/312" className="link transition-all">Women Wide Leg</Link>
                </h4>

              <p className="flex items-center gap-5 mt-2 mb-2">
                <span>Qty: <span>2</span></span>
                <span className="text-primary font-bold">Price: $25</span>
              </p>

              <MdOutlineDeleteOutline className="absolute top-2.5 right-2.5 cursor-pointer text-[20px] link transition-all"/>
            </div>
          </div>
        </div>

        <br />

        <div className="bottomSec absolute bottom-2.5 left-2.5 w-full pr-5">
            <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
                <div className="flex items-center justify-between w-full">
                    <span className="text-[14px] font-semibold">1 item</span>
                    <span className="text-primary font-bold">$86.00</span>
                </div>

                <div className="flex items-center justify-between w-full">
                    <span className="text-[14px] font-semibold">Shipping</span>
                    <span className="text-primary font-bold">$8.00</span>
                </div>

            </div>

            <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
                <div className="flex items-center justify-between w-full">
                    <span className="text-[14px] font-semibold">Total (tax excl.)</span>
                    <span className="text-primary font-bold">$94.00</span>
                </div>

                <br/>

                <div className="flex items-center justify-between w-full gap-5">
                    <Link to="/cart" className="w-[50%] d-block"><Button className="btn-org btn-lg w-full">View Cart</Button></Link>
                    <Link to="/checkout" className="w-[50%] d-block"><Button className="btn-org btn-lg w-full">Checkout</Button></Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default CartPanel;