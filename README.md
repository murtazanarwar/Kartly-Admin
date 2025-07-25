# E-Commerce Admin Platform 🚀

![Version](https://img.shields.io/badge/version-0.1.0-blue)  
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🔗 Table of Contents

- [Live Demo](#-live-demo)  
- [Tech Stack](#-tech-stack)  
- [Features (MVP)](#-features-mvp)  
- [Installation](#-installation)  
- [Usage](#-usage)  
- [Contributing](#-contributing)  
- [License](#-license)

---

## 🎬 Live Demo

Embed your demo videos or GIFs below—replace each \`path/to/demo.*\` with your actual file or URL.

| Feature                              | Demo Preview                                                                 |
|--------------------------------------|-------------------------------------------------------------------------------|
| **Authorization & Authentication** 🔐 | ![Auth Demo](path/to/auth-demo.gif)<br>[Watch Full Video](path/to/auth-demo.mp4) |
| **Multi‑Store Creation & Switching** 🏬 | ![Store Demo](path/to/store-demo.gif)<br>[Watch Full Video](path/to/store-demo.mp4) |
| **Billboard Management** 📋          | ![Billboard Demo](path/to/billboard-demo.gif)<br>[Watch Full Video](path/to/billboard-demo.mp4) |
| **Coupon System** 🎟️                | ![Coupon Demo](path/to/coupon-demo.gif)<br>[Watch Full Video](path/to/coupon-demo.mp4) |
| **Categories, Size & Color** 🎨      | ![Category Demo](path/to/category-demo.gif)<br>[Watch Full Video](path/to/category-demo.mp4) |
| **Product CMS** 🛠️                  | ![CMS Demo](path/to/cms-demo.gif)<br>[Watch Full Video](path/to/cms-demo.mp4) |
| **Order Table** 📊                   | ![Order Demo](path/to/order-demo.gif)<br>[Watch Full Video](path/to/order-demo.mp4) |
| **Settings Panel** ⚙️               | ![Settings Demo](path/to/settings-demo.gif)<br>[Watch Full Video](path/to/settings-demo.mp4) |
| **API Copy Functionality** 📋        | ![API Demo](path/to/api-demo.gif)<br>[Watch Full Video](path/to/api-demo.mp4) |
| **Analytics Dashboard** 📈           | ![Analytics Demo](path/to/analytics-demo.gif)<br>[Watch Full Video](path/to/analytics-demo.mp4) |

---

## 🛠️ Tech Stack

- **Next.js 14** 🌐  
- **React 18** ⚛️  
- **Tailwind CSS 3** 🎨  
- **Prisma 6** 🗄️  
- **Clerk (Auth)** 🛡️  
- **Zustand (State)** 🔄  
- **React Hook Form & Zod** 📝  
- **Tiptap (Rich Text Editor)** ✍️  
- **Recharts (Analytics)** 📊  
- **Razorpay (Payments)** 💳  
- **Resend (Email)** ✉️  
- **Radix UI (Components)** 🧩

---

## 🚀 Features (MVP)

| Feature                              | Description                                                    | Icon |
|--------------------------------------|----------------------------------------------------------------|------|
| Authorization & Authentication       | Secure signup, signin, and session management.                 | 🔐   |
| Multi‑Store Creation & Switching     | Create multiple stores and switch seamlessly.                  | 🏬   |
| Billboard Management                 | Manage promotional banners and announcements.                  | 📋   |
| Coupon System                        | Create and apply discount coupons.                             | 🎟️  |
| Categories, Size & Color Management  | Organize products by category, size, and color.                | 🎨   |
| Product CMS                          | CRUD operations for product listings with rich-text support.   | 🛠️   |
| Order Table                          | View and manage orders in a table.                             | 📊   |
| Settings Panel                       | Configure store and global settings.                           | ⚙️   |
| API Copy Functionality               | Copy API endpoints & payload examples with one click.          | 📋   |
| Analytics Dashboard                  | Interactive charts for sales and performance.                  | 📈   |

---

## 📥 Installation

1. **Clone the repository**  
   \`\`\`bash
   git clone https://github.com/your-username/e-commerce-admin.git
   cd e-commerce-admin
   \`\`\`

2. **Install dependencies**  
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Configure environment**  
   Create a \`.env\` file in the project root:
   \`\`\`env
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   RAZORPAY_KEY_ID=your_razorpay_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_API_KEY=your_resend_key
   \`\`\`

4. **Run database migrations**  
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

5. **Start the development server**  
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

Visit [http://localhost:3000](http://localhost:3000) to explore your admin platform.

---

## 🎉 Usage

- Navigate the sidebar to manage stores, products, coupons, billboards, and settings.  
- Use the “API” section to copy endpoints and payload examples for integrations.  
- Monitor real‑time charts and metrics in the analytics dashboard.

---

## 🤝 Contributing

1. Fork this repository.  
2. Create a new branch:  
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`  
3. Make your changes and commit:  
   \`\`\`bash
   git commit -m "feat: add your-feature-name"
   \`\`\`  
4. Push to your branch:  
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`  
5. Open a Pull Request.

Please run \`npm run lint\` and include tests when applicable.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
EOF