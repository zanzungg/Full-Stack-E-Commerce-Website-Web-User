import { useState } from 'react';
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
import Drawer from '@mui/material/Drawer';
import ProductZoom from './components/ProductZoom';
import { IoCloseSharp } from 'react-icons/io5';
import { Button } from '@mui/material';
import ProductDetailsComponent from './components/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/Cart';
import CartPanel from './components/CartPanel';
import Verify from './pages/Verify';

import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/Checkout/success';
import PaymentFailed from './pages/Checkout/failed';
import VNPayReturn from './pages/Checkout/vnpay-return';
import MyAccount from './pages/MyAccount';
import MyAddress from './pages/MyAddress';
import MyWishList from './pages/MyWishList';
import MyOrders from './pages/MyOrders';
import BlogDetail from './pages/BlogDetail';

// Import AuthProvider
import { AuthProvider } from './contexts/AuthContext';
import { CategoryProvider } from './contexts/CategoryContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ChangePassword from './pages/ChangePassword';

// Import React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const MyContext = createContext();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');

  const [openCartPanel, setOpenCartPanel] = useState(false);

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
    setSelectedProduct(null);
  };

  const handleOpenProductDetailsModal = (product) => {
    setSelectedProduct(product);
    setOpenProductDetailsModal(true);
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const openAlertBox = (status, msg) => {
    if (status === 'success') {
      toast.success(msg, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#f0fdf4',
          color: '#166534',
        },
      });
    } else if (status === 'error') {
      toast.error(msg, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
        },
      });
    }
  };

  const values = {
    setOpenProductDetailsModal: handleOpenProductDetailsModal,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
    openAlertBox,
  };

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />

        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CategoryProvider>
              <MyContext.Provider value={values}>
                <Header />
                <Routes>
                  <Route path={'/'} exact={true} element={<Home />} />
                  <Route
                    path={'/product-listing'}
                    exact={true}
                    element={<ProductListing />}
                  />
                  <Route
                    path={'/product/:id'}
                    exact={true}
                    element={<ProductDetails />}
                  />
                  <Route
                    path={'/blog/:id'}
                    exact={true}
                    element={<BlogDetail />}
                  />

                  {/* Public Routes */}
                  <Route path={'/login'} exact={true} element={<Login />} />
                  <Route
                    path={'/register'}
                    exact={true}
                    element={<Register />}
                  />
                  <Route path={'/verify'} exact={true} element={<Verify />} />
                  <Route
                    path="/forgot-password"
                    exact={true}
                    element={<ForgotPassword />}
                  />
                  <Route
                    path="/reset-password"
                    exact={true}
                    element={<ResetPassword />}
                  />
                  <Route
                    path="/change-password"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <ChangePassword />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path={'/cart'}
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment/vnpay/return"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <VNPayReturn />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment/success"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <PaymentSuccess />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment/failure"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <PaymentFailed />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-account"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <MyAccount />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-address"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <MyAddress />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-wishlist"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <MyWishList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-orders"
                    exact={true}
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <Footer />

                {/* Product Details Dialog */}
                <Dialog
                  fullWidth={fullWidth}
                  maxWidth={maxWidth}
                  open={openProductDetailsModal}
                  onClose={handleCloseProductDetailsModal}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  className="productDetailsModal"
                >
                  <DialogContent>
                    <div className="flex items-start mt-2 w-full productDetailsModalContainer relative">
                      <Button
                        className="w-10! h-10! min-w-10! rounded-full! text-black!
          absolute! top-[15px] right-[15px] bg-[#f1f1f1]!"
                        onClick={handleCloseProductDetailsModal}
                      >
                        <IoCloseSharp className="text-[20px]" />
                      </Button>
                      <div className="col1 w-[40%] px-3">
                        <ProductZoom images={selectedProduct?.images || []} />
                      </div>
                      <div className="col2 w-[60%] py-8 px-8 pr-16 productContent">
                        <ProductDetailsComponent product={selectedProduct} />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Cart Drawer Panel */}
                <Drawer
                  anchor="right"
                  open={openCartPanel}
                  onClose={toggleCartPanel(false)}
                  className="cartDrawer"
                  PaperProps={{
                    sx: {
                      width: '400px',
                      padding: 0,
                    },
                  }}
                >
                  <div className="relative h-full">
                    <div className="flex items-center justify-between p-4 border-b border-[rgba(0,0,0,0.1)]">
                      <h3 className="text-[18px] font-bold">Shopping Cart</h3>
                      <Button
                        className="w-8! h-8! min-w-8! rounded-full! bg-[#f1f1f1]!"
                        onClick={toggleCartPanel(false)}
                      >
                        <IoCloseSharp className="text-[18px]" />
                      </Button>
                    </div>
                    <CartPanel />
                  </div>
                </Drawer>
              </MyContext.Provider>
            </CategoryProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>

      <Toaster />
    </>
  );
}

export default App;

export { MyContext };
