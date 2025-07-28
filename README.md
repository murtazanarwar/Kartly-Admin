## 📖 Project Overview

🛒 **Kartly Admin Platform** is a fully‑featured back‑office dashboard for running one or multiple e‑commerce storefronts. It provides:

- 🔐 Secure user authentication & authorization
- 🏬 Multi‑store creation & seamless switching  
- 🛠️ Rich Product CMS with billboard, category, size & color management  
- 📋 Coupon management for promotions  
- 📊 Order table and live analytics dashboard (Recharts)
- ⚙️ One‑click API endpoint copying
- 💳 Built‑in payment (Razorpay) and email (Resend) integrations

## 👥 Who It's For

- **👩‍💼 Online Store Owners & Managers**  
  Need a single pane of glass to manage catalogs, pricing, promotions & orders across multiple shops.

- **👨‍💻 Developers & Agencies**  
  Building white‑label or multi‑tenant e‑commerce solutions that require a customizable, extensible admin interface out of the box.

- **🚀 SaaS Product Teams**  
  Want to stand up a polished e‑commerce admin with minimal boilerplate—complete with payments, emails, form validation, and charts pre‑wired.


## 🛠 Tech Stack

**Client & Framework:**  
- ⚛️ **Next.js (React 18)**  
- 🎨 **Tailwind CSS** (`tailwindcss-animate`, `tailwind-merge`)  
- 🧩 **Radix UI** (`@radix-ui/react-*` components)  
- 📊 **TanStack React Table**  
- ✍️ **TipTap rich‑text editor** (`@tiptap/react`, `@tiptap/starter-kit`)  
- 🌙 **Next Themes** (dark/light mode)  

**State & Forms:**  
- 🐻 **Zustand** (state management)  
- 📝 **React Hook Form + Zod** (form handling & validation)  
- 🔔 **React Hot Toast** (notifications)  

**Authentication & Security:**  
- 🛂 **Clerk** (`@clerk/nextjs`)  
- 🔐 **bcryptjs** (password hashing)  
- 🏷️ **jsonwebtoken** (JWTs)  

**Data & API:**  
- 🚧 **Next.js API Routes** (Node.js + Express‑style handlers)  
- 🌐 **Axios** (HTTP client)  
- 🔄 **CORS**  

**Database & ORM:**  
- 🗄️ **Prisma** + PostgreSQL  

**File Uploads & Media:**  
- ☁️ **Next‑Cloudinary**  

**Payments & Email:**  
- 💳 **Razorpay** (`razorpay`, webhooks)  
- 📧 **Resend** (transactional email API)  
- ✉️ **Nodemailer** (SMTP)  

**Utilities & Misc:**  
- 📅 **date‑fns** (date manipulation)  
- 🆎 **clsx** (conditional class names)  
- ⌨️ **cmdk** (command‑menu)  
- 📈 **recharts** (charts & graphs)  

**Dev & CI:**  
- ⚙️ **TypeScript**  
- 🔍 **ESLint** (`eslint-config-next`) & Prettier  
- 🛠️ **Prisma migrations & client generation**  
## 🚀 Demo

Here are quick walkthroughs of various features of the Kartly Admin Portal.  
📺 Tip: Watch at 2x speed for a faster overview!

### 🔐 Authentication
- [▶️ Kartly Admin Authentication Demo (3:33)](https://youtu.be/fADBSu2OnkI)

### 🛒 User Side
- [▶️ Order Placement and Coupon Apply (1:24)](https://youtu.be/MJbRMUFfMtI)

### 🔄 Product Management
- [▶️ Kartly Product Update Flow (1:01)](https://youtu.be/FUNmRlNzPtw)

### 🧩 API Management
- [▶️ Kartly Admin Endpoint Copy (0:20)](https://youtu.be/X0l5CO-uuUs)

### ❌ Data Handling
- [▶️ Kartly Delete Constraints (0:51)](https://youtu.be/KvRSkk8lalU)

## Environment Variables

To run this project, create a `.env` file in the root directory and add the following:

```env
# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://yourdomain.com/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=https://yourdomain.com/sign-up

# Database (insert your connection string)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Cloudinary (for media uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Frontend store URL (for CORS / redirects)
FRONTEND_STORE_URL=https://store.yourdomain.com

# JWT signing secret
TOKEN_SECRET=your_jwt_secret

# Email (SMTP) settings
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

# Resend (transactional email API)
RESEND_API_KEY=your_resend_api_key

# Razorpay (payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_public
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# WebSocket
SOCKET_SERVICE_URL=wss://socket.yourdomain.com
```
## Run Locally

Clone the project

```bash
  git clone https://github.com/murtazanarwar/E-Commerce-Admin
```

Go to the project directory

```bash
  cd e-commerce-admin
```

Install dependencies


## Deployment

To deploy this project run
### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

```bash
npx prisma generate
```

### 3. Build the Next.js application

```bash
npm run build
```

### 4. Start the production server

```bash
npm start
```


## License

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)  

## Badges
[![Version](https://img.shields.io/npm/v/e-commerce-platform.svg)](https://www.npmjs.com/package/e-commerce-platform)  
[![Build Status](https://img.shields.io/github/actions/workflow/status/your-username/e-commerce-platform/ci.yml?branch=main)](https://github.com/your-username/e-commerce-platform/actions)  
[![Coverage Status](https://img.shields.io/codecov/c/gh/your-username/e-commerce-platform/main.svg)](https://codecov.io/gh/your-username/e-commerce-platform)  
[![Dependencies](https://img.shields.io/librariesio/release/npm/e-commerce-platform)](https://libraries.io/npm/e-commerce-platform)  
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/GPL-3.0)  
[![License: AGPL](https://img.shields.io/badge/License-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)  
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-username/e-commerce-platform/pulls)  