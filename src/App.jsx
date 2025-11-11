import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetails from './pages/ProductDetails'
function App() {

  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path={"/"} exact={true} element={<Home/>} />
          <Route path={"/productListing"} exact={true} element={<ProductListing/>} />
          <Route path={"/product/:id"} exact={true} element={<ProductDetails/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
