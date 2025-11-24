import { Button, TextField } from '@mui/material';
import React from 'react';
import { BsFillBagCheckFill } from 'react-icons/bs';

const Checkout = () => {
  return (
    <section className='py-10'>
        <div className='container flex gap-5'>
            <div className='leftCol w-[70%]'>
                <div className='card bg-white shadow-md p-5 rounded-md w-full' >
                    <h1 className='text-[16px] font-semibold uppercase'>Billing Details</h1>

                    <form className='w-full mt-5'>
                        <div className='flex items-center gap-5 pb-5'>
                            <div className='col w-[50%]'>
                                <TextField
                                    label="Full Name"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                            <div className='col w-[50%]'>
                                <TextField
                                    type='email'
                                    label="Email"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                        </div>

                        <h6 className='text-[14px] font-medium mb-3'>Street Address *</h6>

                        <div className='flex items-center gap-5 pb-5'>
                            <div className='col w-full'>
                                <TextField
                                    label="House No. and Street Name"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                        </div>

                        <div className='flex items-center gap-5 pb-5'>
                            <div className='col w-full'>
                                <TextField
                                    label="Apartment, Suite, Unit etc. (optional)"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                        </div>

                        <h6 className='text-[14px] font-medium mb-3'>Town / City *</h6>

                        <div className='flex items-center gap-5 pb-5'>
                            <div className='col w-full'>
                                <TextField
                                    label="Town / City"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                        </div>

                        <h6 className='text-[14px] font-medium mb-3'>State / County *</h6>

                        <div className='flex items-center gap-5 pb-5'>
                            <div className='col w-full'>
                                <TextField
                                    label="State / County"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                        </div>

                        <h6 className='text-[14px] font-medium mb-3'>Postcode / ZIP *</h6>

                        <div className='flex items-center gap-5 pb-5'>
                            <div className='col w-full'>
                                <TextField
                                    label="Postcode / ZIP"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                        </div>

                        <div className='flex items-center gap-5 pb-5'>
                            <div className='col w-[50%]'>
                                <TextField
                                    label="Phone Number"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                            <div className='col w-[50%]'>
                                <TextField
                                    label="Email Address"
                                    variant="outlined"
                                    className='w-full'
                                    size='small'
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className='rightCol w-[30%]'>
                <div className='card bg-white shadow-md p-5 rounded-md' >
                    <h2 className='text-[16px] font-semibold uppercase mb-4'>Your Order</h2>
                    
                    <div className='flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]'>
                        <span className='text-[14px] font-semibold'>Product</span>
                        <span className='text-[14px] font-semibold'>Subtotal</span>
                    </div>

                    <div className='scroll max-h-[250px] overflow-y-scroll overflow-x-hidden my-4'>
                        <div className='flex items-center justify-between py-2'>
                            <div className='part1 flex items-center gap-3'>
                                <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group'>
                                    <img src='https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg'
                                    className='w-full transition-all group-hover:scale-105'/>
                                </div>
                                <div className='info'>
                                    <h4 className='text-[14px] font-medium'>Product Name</h4>
                                    <span className='text-[13px]'>Qty: 1</span>
                                </div>
                            </div>
                            <span className='text-[14px] font-medium'>$25.00</span>
                        </div>

                        <div className='flex items-center justify-between py-2'>
                            <div className='part1 flex items-center gap-3'>
                                <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group'>
                                    <img src='https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg'
                                    className='w-full transition-all group-hover:scale-105'/>
                                </div>
                                <div className='info'>
                                    <h4 className='text-[14px] font-medium'>Product Name</h4>
                                    <span className='text-[13px]'>Qty: 1</span>
                                </div>
                            </div>
                            <span className='text-[14px] font-medium'>$25.00</span>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                            <div className='part1 flex items-center gap-3'>
                                <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group'>
                                    <img src='https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg'
                                    className='w-full transition-all group-hover:scale-105'/>
                                </div>
                                <div className='info'>
                                    <h4 className='text-[14px] font-medium'>Product Name</h4>
                                    <span className='text-[13px]'>Qty: 1</span>
                                </div>
                            </div>
                            <span className='text-[14px] font-medium'>$25.00</span>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                            <div className='part1 flex items-center gap-3'>
                                <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group'>
                                    <img src='https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg'
                                    className='w-full transition-all group-hover:scale-105'/>
                                </div>
                                <div className='info'>
                                    <h4 className='text-[14px] font-medium'>Product Name</h4>
                                    <span className='text-[13px]'>Qty: 1</span>
                                </div>
                            </div>
                            <span className='text-[14px] font-medium'>$25.00</span>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                            <div className='part1 flex items-center gap-3'>
                                <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group'>
                                    <img src='https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg'
                                    className='w-full transition-all group-hover:scale-105'/>
                                </div>
                                <div className='info'>
                                    <h4 className='text-[14px] font-medium'>Product Name</h4>
                                    <span className='text-[13px]'>Qty: 1</span>
                                </div>
                            </div>
                            <span className='text-[14px] font-medium'>$25.00</span>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                            <div className='part1 flex items-center gap-3'>
                                <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group'>
                                    <img src='https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg'
                                    className='w-full transition-all group-hover:scale-105'/>
                                </div>
                                <div className='info'>
                                    <h4 className='text-[14px] font-medium'>Product Name</h4>
                                    <span className='text-[13px]'>Qty: 1</span>
                                </div>
                            </div>
                            <span className='text-[14px] font-medium'>$25.00</span>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                            <div className='part1 flex items-center gap-3'>
                                <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group'>
                                    <img src='https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg'
                                    className='w-full transition-all group-hover:scale-105'/>
                                </div>
                                <div className='info'>
                                    <h4 className='text-[14px] font-medium'>Product Name</h4>
                                    <span className='text-[13px]'>Qty: 1</span>
                                </div>
                            </div>
                            <span className='text-[14px] font-medium'>$25.00</span>
                        </div>
                    </div>

                    <Button className='btn-org btn-lg w-full flex gap-2 items-center'>
                        <BsFillBagCheckFill className='inline-block mr-2 text-[20px]' />
                            Checkout
                    </Button>
                </div>
            </div>
        </div>
    </section>
    )
}

export default Checkout