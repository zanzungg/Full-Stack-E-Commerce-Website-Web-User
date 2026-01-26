<div align="center">

# 🛒 Full Stack E-Commerce Website

### Website Thương Mại Điện Tử Hiện Đại

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.16-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Material-UI](https://img.shields.io/badge/MUI-7.3.4-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

[Demo](#) • [Báo Lỗi](../../issues) • [Góp Ý](../../issues)

</div>

---

## 📑 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [Demo & Screenshots](#-demo--screenshots)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Bắt Đầu](#-bắt-đầu)
  - [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
  - [Cài Đặt](#cài-đặt)
  - [Cấu Hình](#cấu-hình)
  - [Chạy Dự Án](#chạy-dự-án)
- [Scripts](#-scripts)
- [Kiến Trúc & Design Patterns](#-kiến-trúc--design-patterns)
- [Đóng Góp](#-đóng-góp)
- [License](#-license)
- [Liên Hệ](#-liên-hệ)

---

## 🎯 Giới Thiệu

**Full Stack E-Commerce Website** là một ứng dụng thương mại điện tử hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Dự án frontend này cung cấp giao diện người dùng hiện đại, responsive và trải nghiệm mua sắm trực tuyến mượt mà.

### ✨ Điểm Nổi Bật

- 🔐 Xác thực người dùng (Email/Password & Google OAuth)
- 🛍️ Quản lý giỏ hàng và danh sách yêu thích
- 📦 Đặt hàng và theo dõi đơn hàng
- 💳 Thanh toán trực tuyến (VNPay)
- 📍 Quản lý địa chỉ giao hàng
- 🏷️ Danh mục sản phẩm đa cấp
- 📱 Thiết kế responsive, tương thích mọi thiết bị
- 🎨 Giao diện hiện đại với Material-UI và TailwindCSS

---

## 🚀 Công Nghệ Sử Dụng

### Core Stack

| Công Nghệ                                                                                                      | Phiên Bản | Mô Tả                             |
| -------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------- |
| ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=flat)                      | 19.1.1    | Thư viện UI component-based       |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat)                         | 7.1.7     | Build tool & dev server cực nhanh |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white&style=flat)      | 4.1.16    | Utility-first CSS framework       |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white&style=flat) | 7.9.4     | Client-side routing               |

### UI & Styling

- **Material-UI (MUI)** `7.3.4` - Component library cao cấp
- **Emotion** - CSS-in-JS styling engine
- **Styled Components** `6.1.19` - Component-level styling
- **React Icons** `5.5.0` - Bộ icon phong phú
- **Swiper** `12.0.3` - Slider/carousel hiện đại

### State Management & API

- **TanStack React Query** `5.90.16` - Server state & caching
- **Axios** `1.13.2` - HTTP client với interceptors
- **React Context API** - Global state management

### Authentication & Services

- **Firebase** `12.7.0` - Google OAuth authentication
- **JWT** - Token-based authentication
- **RESTful API** - Backend integration

### Additional Libraries

- **React Hot Toast** `2.6.0` - Toast notifications
- **React Inner Image Zoom** `3.0.2` - Product image zoom
- **React Range Slider** `3.2.1` - Price range filter
- **React Collapse** `5.1.1` - Collapsible components

---

## 📁 Cấu Trúc Dự Án

```
my-project/
├── public/                      # Static assets
├── src/
│   ├── api/                    # API configuration
│   │   ├── axiosConfig.js      # Axios instance với interceptors
│   │   └── services/           # API service functions
│   │       ├── authService.js
│   │       ├── productService.js
│   │       ├── cartService.js
│   │       ├── orderService.js
│   │       ├── paymentService.js
│   │       ├── wishlistService.js
│   │       ├── addressService.js
│   │       ├── categoryService.js
│   │       ├── blogService.js
│   │       └── ...
│   │
│   ├── assets/                 # Images, icons, media files
│   │
│   ├── components/             # Reusable components
│   │   ├── Header/            # Header navigation
│   │   ├── Footer/            # Footer
│   │   ├── ProductItem/       # Product card
│   │   ├── CartPanel/         # Shopping cart drawer
│   │   ├── ProductZoom/       # Product image zoom modal
│   │   ├── AddressCard/       # Address display card
│   │   ├── HomeSlider/        # Homepage slider/banner
│   │   ├── CategoryCollapse/  # Category navigation
│   │   ├── Search/            # Search functionality
│   │   ├── ProtectedRoute/    # Route authentication guard
│   │   └── ...
│   │
│   ├── config/
│   │   └── constants.js        # API endpoints & constants
│   │
│   ├── contexts/               # React Context providers
│   │   ├── AuthContext.jsx     # Authentication context
│   │   └── CategoryContext.jsx # Category data context
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js          # Authentication logic
│   │   ├── useCart.js          # Cart management
│   │   ├── useWishlist.js      # Wishlist management
│   │   ├── useProduct.js       # Product data fetching
│   │   ├── useOrder.js         # Order management
│   │   ├── useAddress.js       # Address management
│   │   ├── useDebounce.js      # Debounce utility
│   │   └── ...
│   │
│   ├── pages/                  # Page components (routes)
│   │   ├── Home/               # Homepage
│   │   ├── Login/              # Login page
│   │   ├── Register/           # Registration page
│   │   ├── Verify/             # Email verification
│   │   ├── ForgotPassword/     # Password recovery
│   │   ├── ResetPassword/      # Password reset
│   │   ├── ChangePassword/     # Change password
│   │   ├── ProductListing/     # Product list/search
│   │   ├── ProductDetails/     # Product detail page
│   │   ├── Cart/               # Shopping cart page
│   │   ├── Checkout/           # Checkout process
│   │   ├── MyAccount/          # User profile
│   │   ├── MyAddress/          # Address management
│   │   ├── MyOrders/           # Order history
│   │   ├── MyWishList/         # Wishlist page
│   │   ├── BlogDetail/         # Blog post detail
│   │   └── ...
│   │
│   ├── store/                  # State management
│   │   ├── index.js
│   │   └── slices/             # Redux slices (nếu có)
│   │
│   ├── types/                  # TypeScript types/PropTypes
│   │   └── index.js
│   │
│   ├── utils/                  # Utility functions
│   │   ├── currency.js         # Currency formatting
│   │   ├── errorHandler.js     # Error handling
│   │   ├── formatters.js       # Data formatters
│   │   ├── mapHttpError.js     # HTTP error mapping
│   │   ├── query.js            # Query string utilities
│   │   ├── storage.js          # LocalStorage helpers
│   │   └── validation.js       # Form validation
│   │
│   ├── App.jsx                 # Root component
│   ├── App.css                 # App styles
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   ├── mobileResponsive.css    # Mobile responsive styles
│   └── firebase.jsx            # Firebase configuration
│
├── index.html                  # HTML template
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── README.md                   # Documentation

```

---

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x hoặc **yarn** >= 1.22.x
- **Git** ([Download](https://git-scm.com/))
- **Backend API** đang chạy

### Cài Đặt

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ecommerce-frontend.git
cd ecommerce-frontend
```

<details>
<summary><b>📝 Chi tiết các biến môi trường</b></summary>

| Biến                                | Mô Tả                        | Ví Dụ                       |
| ----------------------------------- | ---------------------------- | --------------------------- |
| `VITE_API_BASE_URL`                 | URL của Backend API          | `http://localhost:5000/api` |
| `VITE_FIREBASE_API_KEY`             | Firebase API Key             | `AIzaSy...`                 |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Auth Domain         | `project.firebaseapp.com`   |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase Project ID          | `project-id`                |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage Bucket      | `project.appspot.com`       |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789`                 |
| `VITE_FIREBASE_APP_ID`              | Firebase App ID              | `1:123:web:abc`             |

</details>

> ⚠️ **Quan trọng:**
>
> - **KHÔNG** commit file `.env` vào Git
> - Thêm `.env` vào file `.gitignore`
> - Sử dụng `.env.example` để tham khảo
> - Đảm bảo backend API đang chạy trước khi start frontend

### Chạy Dự Án

#### 🔥 Development Mode

Chạy ứng dụng

```bash
git clone <repository-url>
cd my-project
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cấu hình biến môi trường**

```bash
# Tạo file .env và điền thông tin
cp .env.example .env
```

4. **Đảm bảo backend API đang chạy**
   - Backend API cần chạy trước khi start frontend
   - Kiểm tra `VITE_API_BASE_URL` trong file `.env` trỏ đúng địa chỉ

---

## Chạy dự án

### Development mode

Chạy ứng dụng ở chế độ development với hot-reload:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

### Preview production build

Xem trước bản build production:

```bash
npm run preview
```

---

## Build

### Build cho production

Tạo bản build tối ưu cho production:

✅ Ứng dụng sẽ chạy tại: **http://localhost:5173**

#### 🏗️ Production Build

```bash
# Build cho production
npm run build

# Preview production build
npm run preview
```

Build output sẽ được tạo trong thư mục `dist/`

#### 🧹 Lint Code

````bash
npm run lint
```📜 Scripts

| Script | Lệnh | Mô Tả |
|--------|------|-------|
| **Development** | `npm run dev` | Chạy development server (port 5173) |
| **Build** | `npm run build` | Build production-ready app |
| **Preview** | `npm run preview` | Preview production build locally |
| **Lint** | `npm run lint` | Kiểm tra code quality với ESLint |

## 🚢 Deployment

Dự án có thể deploy lên các nền tảng sau:

<table>
<tr>
<td align="center" width="25%">
<img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" width="48" height="48" />
<br /><b>Vercel</b>
<br />(Recommended)
</td>
<td align="center" width="25%">
<img src="https://www.netlify.com/v3/img/components/logomark.png" width="48" height="48" />
<br /><b>Netlify</b>
</td>
<td align="center" width="25%">
<img src="https://firebase.google.com/static/images/brand-guidelines/logo-logomark.png" width="48" height="48" />
<br /><b>Firebase</b>
</td>
<td align="center" width="25%">
<img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" width="48" height="48" />
<br /><b>AWS S3</b>
</td>
</tr>
</table>

### Deploy lên Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
``` caching & synchronization
- **React Context** - global state (Auth, Category)
- **Local component state** - UI state

### Custom Hooks

- Tái sử dụng logic nghiệp vụ
- Separation of concerns
- Clean component code

### Routing

- Client-side routing với React Router
- Protected routes
- Lazy loading components (nếu có)
- Scroll to top on route change

---

## Ghi chú

### Performance Optimization

- React Query caching (stale time: 5 phút)
- Image optimization với lazy loading
- Code splitting khả thi cho production

###🏗️ Kiến Tity

- JWT token được lưu trong localStorage
- Automatic token refresh
- Protected API routes
- Input validation
- XSS protection

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Development Notes

- ESLint configured cho code quality
- Vite HMR cho development experience tốt
- Environment variables với `import.meta.env`
- Font: Montserrat (Google Fonts)

---

## Liên hệ & Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên repository.

---
📝 Ghi Chú Kỹ Thuật

### ⚡ Performance

- ✅ React Query caching (stale time: 5 phút)
- ✅ Image lazy loading
- ✅ Code splitting cho production
- ✅ Vite's lightning-fast HMR

### 🔒 Security

- ✅ JWT token với secure storage
- ✅ Automatic token refresh
- ✅ Protected API routes
- ✅ Input validation & sanitization
- ✅ XSS protection

### 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### 🎨 Design System

- Font: **Montserrat** (Google Fonts)
- Design Language: **Material Design 3**
- Icons: **React Icons**

---

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Nếu bạn muốn đóng góp:

1. **Fork** repository này
2. Tạo **branch** mới (`git checkout -b feature/AmazingFeature`)
3. **Commit** thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. Tạo **Pull Request**

### 🐛 Báo Lỗi

Nếu phát hiện bug, vui lòng [tạo issue](../../issues/new) với thông tin chi tiết:
- Mô tả lỗi
- Các bước tái hiện
- Screenshots (nếu có)
- Environment (Browser, OS, Node version)

---

## 📄 License

Dự án này được phân phối dưới **Private License**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 📧 Liên Hệ

- **Email:** your-email@example.com
- **GitHub:** [@your-username](https://github.com/your-username)
- **Issues:** [Tạo issue mới](../../issues)

---

<div align="center">

### ⭐ Nếu thấy hữu ích, hãy cho một Star nhé!

**Made with ❤️ using MERN Stack**

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

**[⬆ Back to Top](#-mục-lục)**

</div>
````
