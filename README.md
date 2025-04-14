# CamGuard Portal - Admin Dashboard & E-commerce Platform

A modern admin dashboard and e-commerce platform built with React, TypeScript, and shadcn-ui components.

## Features

- **Admin Dashboard** with statistics, product management, and market trends
- **E-commerce** functionality with product listings and checkout
- **Responsive Design** built with Tailwind CSS
- **UI Components** from shadcn-ui library
- **Authentication** for admin and user login

## Technologies Used

- ⚡ [Vite](https://vitejs.dev/) - Next generation frontend tooling
- 🚀 [React](https://reactjs.org/) - JavaScript library for building user interfaces
- 💻 [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- ✨ [shadcn-ui](https://ui.shadcn.com/) - Beautifully designed components
- 📊 [React Charts](https://react-charts.tanstack.com/) - Data visualization

## Project Structure

```
camguard-portal/
├── public/            # Static files
├── src/
│   ├── components/    # Reusable components
│   │   ├── admin/     # Admin-specific components
│   │   ├── ui/        # UI components from shadcn-ui
│   ├── data/          # Mock data and constants
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   │   ├── admin/     # Admin pages
│   └── App.tsx        # Main application component
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TristanBrian/camguard-portal.git
cd camguard-portal
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `lint` - Run ESLint
- `typecheck` - Run TypeScript type checking

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=your_api_url
VITE_ADMIN_TOKEN=your_admin_token
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - Tristan.Dev

Email - lessusbrian7@gmail.com

Project Link:  https://camguard.netlify.app/
