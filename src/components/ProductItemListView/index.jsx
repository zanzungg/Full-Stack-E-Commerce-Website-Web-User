import React, { useContext } from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import { Button } from "@mui/material";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MdZoomOutMap } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MyContext } from "../../App";

const ProductItemListView = () => {
    const context = useContext(MyContext)

    return (
        <div className="productItem shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)] flex items-center">
            <div className="group imgWrapper w-[25%] overflow-hidden rounded-md relative">
                <Link>
                    <div className="img h-90% overflow-hidden">
                        <img src="https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg"
                            className="w-full"/>

                        <img src="https://serviceapi.spicezgold.com/download/1753722939207_5107b7b1-ba6d-473c-9195-8576a6a0a9611749366193848-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-3.jpg"
                            className="w-full absolute transition-all duration-700 top-0 left-0 
                            opacity-0 group-hover:opacity-100 group-hover:scale-105"/>
                    </div>
                    
                </Link>
                <span className="discount flex items-center absolute top-2.5 left-2.5
                z-50 bg-primary text-white rounded-lg p-1 text-[12px] font-medium">
                    10%
                </span>

                <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2
                 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
                    <Button className="w-[35px]! h-[35px]! min-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group" onClick={() => context.setOpenProductDetailsModal(true)}>
                        <MdZoomOutMap className="text-[18px] text-black! group-hover:text-white hover:text-white!"/>
                    </Button>

                    <Button className="w-[35px]! h-[35px]! min-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group">
                        <IoGitCompareOutline className="text-[18px] text-black! group-hover:text-white hover:text-white!"/>
                    </Button>

                    <Button className="w-[35px]! h-[35px]! min-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group">
                        <FaRegHeart className="text-[18px] text-black! group-hover:text-white hover:text-white!"/>
                    </Button>
                </div>

                
            </div>

            <div className="info p-3 py-5 px-8 w-[75%]">
                <h6 className="text-[15px]">
                    <Link to="/" className="link transition-all">Flying Machine</Link>
                </h6>
                <h3 className="text-[18px] title mt-5 font-medium mb-3 text-black">
                    <Link to="/" className="link transition-all">Women Wide Leg</Link>
                </h3>

                <p className="text-[14px] mb-3 ">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </p>

                <Rating name="size-small" defaultValue={2} size="small" readOnly/>

                <div className="flex items-center mt-3 gap-4">
                    <span className="oldPrice line-through text-gray-500 text-[16px] font-medium">$58.00</span >
                    <span className="price text-primary font-semibold">$58.00</span>
                </div>

                <div className="mt-4">
                    <Button className="btn-org flex gap-2">
                        <MdOutlineShoppingCart className="text-[20px]" />
                        Add To Cart
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductItemListView;