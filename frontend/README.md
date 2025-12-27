# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


-- Folder Structure
Frontend/
├── public/                  # Chứa file tĩnh (favicon, robots.txt...)
├── src/
│   ├── assets/              # Chứa tài nguyên (Logo, hình ảnh, CSS global)
│   ├── components/          # Các thành phần UI nhỏ dùng lại (Button, Modal, Loading...)
│   ├── config/              # Cấu hình hệ thống (Axios, Hằng số)
│   ├── hooks/               # Logic tái sử dụng (Auth, Fetch dữ liệu)
│   ├── layouts/             # Các bộ khung trang web (Layout khách, Layout quản trị)
│   ├── pages/               # GIAO DIỆN CHÍNH (Chia theo 5 phân hệ người dùng)
│   │   ├── admin/           # Phân hệ Quản lý (Báo cáo, Nhân sự)
│   │   ├── auth/            # Phân hệ Xác thực (Login, Register)
│   │   ├── customer/        # Phân hệ Khách hàng (Đặt lịch, Thú cưng)
│   │   ├── medical/         # Phân hệ Y tế (Bác sĩ, Khám bệnh)
│   │   └── staff/           # Phân hệ Lễ tân/Bán hàng (Check-in, POS)
│   ├── App.jsx              # Định nghĩa Router (Đường dẫn)
│   └── main.jsx             # File khởi chạy ứng dụng (Render App)
├── index.html               # File HTML chính
├── package.json             # Quản lý thư viện
└── vite.config.js           # Cấu hình Vite