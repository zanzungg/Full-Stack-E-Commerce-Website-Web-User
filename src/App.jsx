import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import { createContext } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from './components/ProductZoom';
import { IoCloseSharp } from "react-icons/io5";
import { Button } from '@mui/material';
import ProductDetailsComponent from './components/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/Cart';
import Verify from './pages/Verify';

import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from "./pages/ResetPassword";
import Checkout from './pages/Checkout';
import MyAccount from './pages/MyAccount';

const MyContext = createContext();

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');

  const [isLogin, setIsLogin] = useState(true);

  const [openCartPanel, setOpenCartPanel] = useState(false);

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const openAlertBox = (status , msg) => {
    if (status === "success") {
      toast.success(msg, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#f0fdf4',
          color: '#166534',
        },
      });
    } else if (status === "error") {
      toast.error(msg, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
        },
      });
    }
  }

  const values = {
    setOpenProductDetailsModal,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
    openAlertBox,
    isLogin,
    setIsLogin
  }

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header/>
          <Routes>
            <Route path={"/"} exact={true} element={<Home/>} />
            <Route path={"/product-listing"} exact={true} element={<ProductListing/>} />
            <Route path={"/product/:id"} exact={true} element={<ProductDetails/>} />
            <Route path={"/login"} exact={true} element={<Login/>} />
            <Route path={"/register"} exact={true} element={<Register/>} />
            <Route path={"/cart"} exact={true} element={<CartPage/>} />
            <Route path={"/verify"} exact={true} element={<Verify/>} />
            <Route path="/forgot-password" exact={true} element={<ForgotPassword />} />
            <Route path="/reset-password" exact={true} element={<ResetPassword />} />
            <Route path="/checkout" exact={true} element={<Checkout />} />
            <Route path="/my-account" exact={true} element={<MyAccount />} />
          </Routes>
          <Footer />
        </MyContext.Provider>
      </BrowserRouter>

      <Toaster />

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openProductDetailsModal}
        onClose={handleCloseProductDetailsModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className='productDetailsModal'
      >
        <DialogContent>
          <div className='flex items-center w-full productDetailsModalContainer relative'>
            <Button className='w-10! h-10! min-w-10! rounded-full! text-black!
            absolute! top-[15px] right-[15px] bg-[#f1f1f1]!' onClick={handleCloseProductDetailsModal}>
              <IoCloseSharp className='text-[20px]'/>
            </Button>
            <div className='col1 w-[40%] px-3'>
              <ProductZoom />
            </div>
            <div className='col2 w-[60%] py-8 px-8 pr-16 productContent'>
              <ProductDetailsComponent />
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}

export default App;

export {MyContext};
