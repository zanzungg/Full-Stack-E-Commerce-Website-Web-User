import React, { useState, useContext } from 'react';
import { MdOutlineCloudUpload } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { Button } from '@mui/material';
import { FaRegHeart } from "react-icons/fa6";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import TextField from "@mui/material/TextField";
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

const MyAccount = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [userInfo, setUserInfo] = useState({
        fullName: 'User Full Name',
        email: 'example@example.com',
        phone: '+1 234 567 8900',
        address: '123 Main Street, City, Country',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV1Mly7C6D_WWpPXTAO4dF52D9Wd9FKuC9zw&s'
    });

    const [formFields, setFormFields] = useState({ ...userInfo });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo({ ...userInfo, avatar: reader.result });
                context.openAlertBox("success", "Avatar updated successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    const onChangeField = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setUserInfo({ ...formFields });
        setIsEditMode(false);
        context.openAlertBox("success", "Profile updated successfully!");
    };

    const handleCancelEdit = () => {
        setFormFields({ ...userInfo });
        setIsEditMode(false);
    };

    const handleLogout = () => {
        context.setIsLogin(false);
        context.openAlertBox("success", "Logged out successfully!");
        setTimeout(() => {
            navigate('/signIn');
        }, 1000);
    };

    return (
        <section className='py-10 w-full'>
            <div className='container flex gap-5'>
                {/* Sidebar */}
                <div className='col1 w-[25%]'>
                    <div className='card bg-white shadow-md rounded-md overflow-hidden'>
                        <div className='w-full p-5 flex items-center justify-center flex-col'>
                            <div className='w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group'>
                                <img 
                                    src={userInfo.avatar}
                                    alt="User Avatar"
                                    className='w-full h-full object-cover' 
                                />

                                <div className='overlay w-full h-full absolute top-0 left-0
                                z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 
                                transition-all group-hover:opacity-100'>
                                    <MdOutlineCloudUpload className='text-white text-[25px]'/>
                                    <input 
                                        type='file' 
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                                    />
                                </div>
                            </div>

                            <h3 className='font-bold'>{userInfo.fullName}</h3>
                            <h6 className='text-[13px] font-medium'>{userInfo.email}</h6>
                        </div>

                        <ul className='list-none pb-5 bg-[#f1f1f1]'>
                            <li className='w-full'>
                                <Button 
                                    className={`w-full text-left! justify-start! py-2! px-5! capitalize! rounded-none! flex items-center gap-2 ${
                                        activeTab === 'profile' 
                                        ? 'bg-primary! text-white!' 
                                        : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]!'
                                    }`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <FaRegUser className='text-[17px]'/>
                                    <span className='font-semibold'>My Profile</span>
                                </Button>
                            </li>

                            <li className='w-full'>
                                <Button 
                                    className={`w-full text-left! justify-start! py-2! px-5! capitalize! rounded-none! flex items-center gap-2 ${
                                        activeTab === 'wishlist' 
                                        ? 'bg-primary! text-white!' 
                                        : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]!'
                                    }`}
                                    onClick={() => {
                                        setActiveTab('wishlist');
                                        navigate('/wishlist');
                                    }}
                                >
                                    <FaRegHeart className='text-[17px]'/>
                                    <span className='font-semibold'>My Wishlist</span>
                                </Button>
                            </li>

                            <li className='w-full'>
                                <Button 
                                    className={`w-full text-left! justify-start! py-2! px-5! capitalize! rounded-none! flex items-center gap-2 ${
                                        activeTab === 'orders' 
                                        ? 'bg-primary! text-white!' 
                                        : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]!'
                                    }`}
                                    onClick={() => {
                                        setActiveTab('orders');
                                        navigate('/orders');
                                    }}
                                >
                                    <IoBagCheckOutline className='text-[20px]'/>
                                    <span className='font-semibold'>My Orders</span>
                                </Button>
                            </li>

                            <li className='w-full'>
                                <Button 
                                    className="w-full text-left! justify-start! py-2! px-5! capitalize! text-[rgba(0,0,0,0.7)]! rounded-none! flex items-center gap-2 hover:bg-[rgba(0,0,0,0.05)]!"
                                    onClick={handleLogout}
                                >
                                    <IoLogOutOutline className='text-[20px]'/>
                                    <span className='font-semibold'>Logout</span>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className='col2 w-[75%]'>
                    <div className='card bg-white shadow-md rounded-md p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-[22px] font-bold'>My Profile</h2>
                            {!isEditMode && (
                                <Button 
                                    className='btn-org flex items-center gap-2'
                                    onClick={() => setIsEditMode(true)}
                                >
                                    <MdEdit className='text-[18px]'/>
                                    Edit Profile
                                </Button>
                            )}
                        </div>

                        {isEditMode ? (
                            <form onSubmit={handleSaveProfile} className='space-y-5'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <TextField
                                        label="Full Name"
                                        variant="outlined"
                                        name="fullName"
                                        value={formFields.fullName}
                                        onChange={onChangeField}
                                        fullWidth
                                        required
                                    />

                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        value={formFields.email}
                                        onChange={onChangeField}
                                        fullWidth
                                        required
                                    />

                                    <TextField
                                        label="Phone"
                                        variant="outlined"
                                        name="phone"
                                        value={formFields.phone}
                                        onChange={onChangeField}
                                        fullWidth
                                    />

                                    <TextField
                                        label="Address"
                                        variant="outlined"
                                        name="address"
                                        value={formFields.address}
                                        onChange={onChangeField}
                                        fullWidth
                                    />
                                </div>

                                <div className='flex gap-3 justify-end'>
                                    <Button 
                                        type="button"
                                        className='btn-outline'
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        className='btn-org'
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className='space-y-4'>
                                <div className='flex border-b pb-4'>
                                    <div className='w-[30%] font-semibold text-gray-600'>Full Name:</div>
                                    <div className='w-[70%]'>{userInfo.fullName}</div>
                                </div>

                                <div className='flex border-b pb-4'>
                                    <div className='w-[30%] font-semibold text-gray-600'>Email:</div>
                                    <div className='w-[70%]'>{userInfo.email}</div>
                                </div>

                                <div className='flex border-b pb-4'>
                                    <div className='w-[30%] font-semibold text-gray-600'>Phone:</div>
                                    <div className='w-[70%]'>{userInfo.phone}</div>
                                </div>

                                <div className='flex border-b pb-4'>
                                    <div className='w-[30%] font-semibold text-gray-600'>Address:</div>
                                    <div className='w-[70%]'>{userInfo.address}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Info Cards */}
                    <div className='grid grid-cols-3 gap-4 mt-5'>
                        <div className='card bg-white shadow-md rounded-md p-5 text-center'>
                            <div className='text-[32px] font-bold text-primary'>24</div>
                            <div className='text-gray-600'>Total Orders</div>
                        </div>

                        <div className='card bg-white shadow-md rounded-md p-5 text-center'>
                            <div className='text-[32px] font-bold text-primary'>12</div>
                            <div className='text-gray-600'>Wishlist Items</div>
                        </div>

                        <div className='card bg-white shadow-md rounded-md p-5 text-center'>
                            <div className='text-[32px] font-bold text-primary'>5</div>
                            <div className='text-gray-600'>Pending Orders</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyAccount;