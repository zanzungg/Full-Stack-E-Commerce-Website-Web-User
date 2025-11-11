import React, { useState } from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from "react-router-dom";
import ProductZoom from "../../components/ProductZoom";
import Rating from '@mui/material/Rating';
import { Button } from "@mui/material";
import QtyBox from "../../components/QtyBox";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import TextField from "@mui/material/TextField";
import ProductsSlider from "../../components/ProductsSlider";

const ProductDetails = () => {
    const [productActionIndex, setProductActionIndex] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    return (
        <>
        <div className="py-5">
            <div className="container">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/" className="link transition">
                    Home
                    </Link>
                    <Link
                    underline="hover"
                    color="inherit"
                    href="/"
                    className="link transition"
                    >
                    Fashion
                    </Link>
                </Breadcrumbs>
            </div>
        </div>

        <section className="bg-white py-5">
            <div className="container flex gap-8 items-center">
                <div className="productZoomContainer w-[40%]">
                    <ProductZoom />
                </div>

                <div className="productContent w-[60%] pr-10 pl-10">
                    <h1 className="text-[24px] font-semibold mb-2">
                        Women Wide Leg
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-[13px]">
                            Brands : 
                            <span className="font-medium text-black opacity-75">
                                Flying Machine
                            </span>
                        </span>

                        <Rating name="size-small" defaultValue={2} size="small" readOnly/>
                        <span className="text-[13px] cursor-pointer">
                            Review (5)
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="oldPrice line-through text-gray-500 text-[20px] font-medium">
                            $58.00
                        </span >
                        <span className="price text-primary font-semibold text-[20px]">
                            $58.00
                        </span>
                        <span className="text-[14px]">
                            Available In Stock: <span className="text-green-600 text-[14px] font-bold">-23 Items</span>
                        </span>
                    </div>

                    <p className="mt-3 pr-10 mb-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

                    <div className="flex items-center gap-3">
                        <span className="text-[16px]">Size: </span>
                        <div className="flex items-center gap-1 actions">
                            <Button className={`${productActionIndex === 0 ? 'bg-primary! text-white!' : ''}`} onClick={()=>setProductActionIndex(0)}>S</Button>
                            <Button className={`${productActionIndex === 1 ? 'bg-primary! text-white!' : ''}`} onClick={()=>setProductActionIndex(1)}>M</Button>
                            <Button className={`${productActionIndex === 2 ? 'bg-primary! text-white!' : ''}`} onClick={()=>setProductActionIndex(2)}>L</Button>
                        </div>
                    </div>

                    <p className="text-[14px] mt-5 mb-2">Free Shipping (Est. Delivery Time 2-3 Days)</p>

                    <div className="flex items-center gap-4 py-4">
                        <div className="qtyBoxWrapper w-[70px]">
                            <QtyBox />
                        </div>

                        <Button className="btn-org flex gap-2">
                            <MdOutlineShoppingCart className="text-[22px]" />
                            Add To Cart
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-medium">
                            <FaRegHeart className="text-[18px]"/>Add To Wishlist
                        </span>
                        <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-medium">
                            <IoGitCompareOutline className="text-[18px]"/>Add To Compare
                        </span>
                    </div>   
                </div>
            </div>

            <div className="container pt-8">
                <div className="flex items-center gap-8 mb-5">
                    <span className={`link text-[17px] cursor-pointer font-medium ${activeTab === 0 && 'text-primary'}`}
                    onClick={() => setActiveTab(0)}>Description</span>
                    <span className={`link text-[17px] cursor-pointer font-medium ${activeTab === 1 && 'text-primary'}`}
                    onClick={() => setActiveTab(1)}>Product Details</span>
                    <span className={`link text-[17px] cursor-pointer font-medium ${activeTab === 2 && 'text-primary'}`}
                    onClick={() => setActiveTab(2)}>Reviews (9)</span>
                </div>

                {
                    activeTab === 0 && (
                        <div className="shadow-md w-full py-5 px-8 rounded-md">
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        </div>
                    )
                }

                {
                    activeTab === 1 && (
                        <div className="shadow-md w-full py-5 px-8 rounded-md">
                            <div class="relative overflow-x-auto">
                                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" class="px-6 py-3">
                                                Stand Up
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Folded (w/o wheels)
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Folded (w/ wheels)
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Door Pass Through
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="bg-white border-b border-gray-200">
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                Apple MacBook Pro 17"
                                            </th>
                                            <td class="px-6 py-4">
                                                Silver
                                            </td>
                                            <td class="px-6 py-4">
                                                Laptop
                                            </td>
                                            <td class="px-6 py-4">
                                                $2999
                                            </td>
                                        </tr>
                                        <tr class="bg-white border-b border-gray-200">
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                Microsoft Surface Pro
                                            </th>
                                            <td class="px-6 py-4">
                                                White
                                            </td>
                                            <td class="px-6 py-4">
                                                Laptop PC
                                            </td>
                                            <td class="px-6 py-4">
                                                $1999
                                            </td>
                                        </tr>
                                        <tr class="bg-white">
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                Magic Mouse 2
                                            </th>
                                            <td class="px-6 py-4">
                                                Black
                                            </td>
                                            <td class="px-6 py-4">
                                                Accessories
                                            </td>
                                            <td class="px-6 py-4">
                                                $99
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 2 && (
                        <div className="shadow-md w-[80%] py-5 px-8 rounded-md">
                            <div className="w-full productReviewsContainer">
                                <h2 className="text-[18px] font-semibold">Customer questions & answers</h2>
                                <div className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden mt-5 pr-5">
                                    <div className="review pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between">
                                        <div className="info w-[60%] flex items-center gap-3">
                                            <div className="img w-20 h-20 overflow-hidden rounded-full">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHOyweUERP_PkAHflHnp-jMxGTx_D-DD638A&s"
                                                className="w-full"/>
                                            </div>

                                            <div className="w-[80%]">
                                                <h4 className="text-[16px] font-semibold">MD MERAJ</h4>
                                                <h5 className="text-[13px] mb-0 font-medium">2025-08-18</h5>
                                                <p className="mt-0 mb-0 font-normal">This website is osm ☺️</p>
                                            </div>
                                        </div>
                                        <Rating name="size-small" defaultValue={2} size="small" readOnly/>
                                    </div>

                                    
                                </div>

                                <br/>

                                <div className="reviewForm bg-[#fafafa] p-4 rounded-md">
                                    <h2 className="text-[18px] font-medium">Add a review</h2>

                                    <form className="w-full mt-5">
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            label="Write a review..."
                                            className="w-full"
                                            multiline
                                            rows={5}
                                        />
                                        <br/>
                                        <br/>
                                        <Rating name="size-small" defaultValue={1} size="small"/>

                                        <div className="flex items-center mt-5">
                                            <Button className="btn-org">
                                                Submit Review
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>

            <div className="container pt-8">
                <h2 className="font-semibold text-[20px] pb-0">Related Products</h2>
                    <ProductsSlider items={6} />
            </div>
        </section>
        </>
    )
}

export default ProductDetails;