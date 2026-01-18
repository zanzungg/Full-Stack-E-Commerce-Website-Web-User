import { LiaShippingFastSolid } from 'react-icons/lia';
import { PiKeyReturnLight } from 'react-icons/pi';
import { BsWallet2 } from 'react-icons/bs';
import { LiaGiftSolid } from 'react-icons/lia';
import { BiSupport } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { IoChatboxOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineYoutube } from 'react-icons/ai';
import { FaPinterestP } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <footer className="py-4 sm:py-5 lg:py-6 bg-[#fafafa]">
        <div className="container px-3 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center lg:justify-center gap-4 sm:gap-6 lg:gap-2 py-5 sm:py-6 lg:py-8">
            <div className="col flex items-center justify-center flex-col group lg:w-[15%]">
              <LiaShippingFastSolid
                className="text-[35px] sm:text-[40px] lg:text-[50px] transition-all duration-300
                         group-hover:text-primary group-hover:-translate-y-1"
              />
              <h3 className="text-[13px] sm:text-[14px] lg:text-[16px] font-semibold mt-2 sm:mt-2.5 lg:mt-3 text-center">
                Free Shipping
              </h3>
              <p className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-center px-1">
                For all Orders Over $100
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group lg:w-[15%]">
              <PiKeyReturnLight
                className="text-[35px] sm:text-[40px] lg:text-[50px] transition-all duration-300
                         group-hover:text-primary group-hover:-translate-y-1"
              />
              <h3 className="text-[13px] sm:text-[14px] lg:text-[16px] font-semibold mt-2 sm:mt-2.5 lg:mt-3 text-center">
                30 Days Returns
              </h3>
              <p className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-center px-1">
                For an Exchange Product
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group lg:w-[15%]">
              <BsWallet2
                className="text-[35px] sm:text-[40px] lg:text-[50px] transition-all duration-300
                         group-hover:text-primary group-hover:-translate-y-1"
              />
              <h3 className="text-[13px] sm:text-[14px] lg:text-[16px] font-semibold mt-2 sm:mt-2.5 lg:mt-3 text-center">
                Secured Payment
              </h3>
              <p className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-center px-1">
                Payment Cards Accepted
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group lg:w-[15%]">
              <LiaGiftSolid
                className="text-[35px] sm:text-[40px] lg:text-[50px] transition-all duration-300
                         group-hover:text-primary group-hover:-translate-y-1"
              />
              <h3 className="text-[13px] sm:text-[14px] lg:text-[16px] font-semibold mt-2 sm:mt-2.5 lg:mt-3 text-center">
                Special Gifts
              </h3>
              <p className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-center px-1">
                Our First Product Order
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group lg:w-[15%]">
              <BiSupport
                className="text-[35px] sm:text-[40px] lg:text-[50px] transition-all duration-300
                         group-hover:text-primary group-hover:-translate-y-1"
              />
              <h3 className="text-[13px] sm:text-[14px] lg:text-[16px] font-semibold mt-2 sm:mt-2.5 lg:mt-3 text-center">
                Support 24/7
              </h3>
              <p className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-center px-1">
                Contact us Anytime
              </p>
            </div>
          </div>

          <br className="hidden lg:block" />
          <hr className="border-[rgba(0,0,0,0.1)]" />

          <div className="footer flex flex-col lg:flex-row py-5 sm:py-6 lg:py-8 gap-6 lg:gap-0">
            <div className="part1 w-full lg:w-[25%] lg:border-r border-[rgba(0,0,0,0.1)] lg:pr-6">
              <h2 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold mb-3 sm:mb-3.5 lg:mb-4">
                Contact us
              </h2>
              <p className="text-[12px] sm:text-[12px] lg:text-[13px] font-normal pb-3 sm:pb-3.5 lg:pb-4">
                Classyshop - Mega Super Store
                <br />
                DHBK - DaNang, Vietnam
              </p>
              <Link
                className="link text-[11px] sm:text-[12px] lg:text-[13px]"
                to="mailto:someone@example.com"
              >
                nguyenvandung@ecommerce-demo.com
              </Link>
              <span className="text-[18px] sm:text-[20px] lg:text-[22px] font-semibold block w-full mt-2 sm:mt-2.5 lg:mt-3 mb-3 sm:mb-4 lg:mb-5 text-primary">
                (+84) 000 000 000
              </span>

              <div className="flex items-center gap-2">
                <IoChatboxOutline className="text-[32px] sm:text-[36px] lg:text-[40px] text-primary" />
                <span className="text-[13px] sm:text-[14px] lg:text-[16px] font-semibold">
                  Online Chat
                  <br />
                  Get Expert Help
                </span>
              </div>
            </div>

            <div className="part2 w-full lg:w-[40%] flex gap-6 sm:gap-8 lg:gap-0 lg:pl-8">
              <div className="part2_col1 w-[50%]">
                <h2 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold mb-3 sm:mb-3.5 lg:mb-4">
                  Products
                </h2>

                <ul className="list">
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Prices drop
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      New products
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Best sales
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Contact us
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Sitemap
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Stores
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="part2_col2 w-[50%]">
                <h2 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold mb-3 sm:mb-3.5 lg:mb-4">
                  Our company
                </h2>

                <ul className="list">
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Delivery
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Legal Notice
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Terms and conditions of use
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      About us
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Secure payment
                    </Link>
                  </li>
                  <li className="list-none text-[12px] sm:text-[13px] lg:text-[14px] w-full mb-1.5 sm:mb-2">
                    <Link to={'/'} className="link">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="part2 w-full lg:w-[35%] flex lg:pl-8 flex-col lg:pr-8">
              <h2 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold mb-3 sm:mb-3.5 lg:mb-4">
                Subscribe to newsletter
              </h2>
              <p className="text-[12px] sm:text-[12px] lg:text-[13px]">
                Subscribe to our latest newsletter to get news about special
                discounts.
              </p>

              <form className="mt-3 sm:mt-4 lg:mt-5">
                <input
                  type="text"
                  className="w-full h-10 sm:h-[42px] lg:h-[45px] border border-[rgba(0,0,0,0.1)] outline-none pl-3 sm:pl-3.5 lg:pl-4
                             rounded-sm mb-3 sm:mb-3.5 lg:mb-4 focus:border-[rgba(0,0,0,0.3)] text-[13px] sm:text-[14px]"
                  placeholder="Your Email Address"
                />

                <Button className="btn-org mr-4! text-[12px]! sm:text-[13px]! lg:text-[14px]! py-2! sm:py-2.5!">
                  SUBSCRIBE
                </Button>

                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="I agree to the terms and conditions and the privacy policy"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: { xs: '11px', sm: '12px', lg: '14px' },
                    },
                  }}
                />
              </form>
            </div>
          </div>
        </div>
      </footer>

      <div className="bottomStrip border-t border-[rgba(0,0,0,0.1)] py-3 sm:py-3.5 lg:py-3 bg-white">
        <div className="container px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <ul className="flex items-center gap-1.5 sm:gap-2">
            <li className="list-none">
              <Link
                to="/"
                className="w-[30px] h-[30px] sm:w-8 sm:h-8 lg:w-[35px] lg:h-[35px] rounded-full border
                        border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-primary
                        transition-all"
              >
                <FaFacebookF className="text-[13px] sm:text-[14px] lg:text-[15px] group-hover:text-white" />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to="/"
                className="w-[30px] h-[30px] sm:w-8 sm:h-8 lg:w-[35px] lg:h-[35px] rounded-full border
                        border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-primary
                        transition-all"
              >
                <AiOutlineYoutube className="text-[17px] sm:text-[18px] lg:text-[20px] group-hover:text-white" />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to="/"
                className="w-[30px] h-[30px] sm:w-8 sm:h-8 lg:w-[35px] lg:h-[35px] rounded-full border
                        border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-primary
                        transition-all"
              >
                <FaPinterestP className="text-[13px] sm:text-[14px] lg:text-[15px] group-hover:text-white" />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to="/"
                className="w-[30px] h-[30px] sm:w-8 sm:h-8 lg:w-[35px] lg:h-[35px] rounded-full border
                        border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-primary
                        transition-all"
              >
                <FaInstagram className="text-[13px] sm:text-[14px] lg:text-[15px] group-hover:text-white" />
              </Link>
            </li>
          </ul>

          <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-center mb-0">
            © 2025 - Ecommerce Website
          </p>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <img
              src="/carte_bleue.png"
              alt="image"
              className="w-[35px] sm:w-10 lg:w-auto"
            />
            <img
              src="/visa.png"
              alt="image"
              className="w-[35px] sm:w-10 lg:w-auto"
            />
            <img
              src="/master_card.png"
              alt="image"
              className="w-[35px] sm:w-10 lg:w-auto"
            />
            <img
              src="/american_express.png"
              alt="image"
              className="w-[35px] sm:w-10 lg:w-auto"
            />
            <img
              src="/paypal.png"
              alt="image"
              className="w-[35px] sm:w-10 lg:w-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
