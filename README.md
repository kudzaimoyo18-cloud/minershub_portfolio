# Miners Hub Portfolio Website

A modern, professional portfolio website for Miners Hub - the leading cryptocurrency mining solution provider in UAE and Oman.

## 🚀 Features

- **Interactive 3D Globe** - Built with Cobe library showing mining operations across UAE and Oman
- **Premium UI Components** - Metal buttons and liquid glass effects
- **Video Showcase** - Demonstrates three cooling technologies:
  - Hydro Cooling
  - Air Cooling
  - Immersion Cooling
- **Responsive Design** - Fully responsive on all devices
- **Modern Stack** - Next.js 14, TypeScript, Tailwind CSS

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **3D Graphics**: Cobe (Globe visualization)
- **UI Components**: Custom Metal Button & Liquid Glass Button
- **Icons**: Lucide React (inline SVGs)

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
miners-hub-portfolio/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main portfolio page
├── components/
│   └── ui/
│       ├── globe.tsx        # Interactive 3D globe component
│       └── liquid-glass-button.tsx  # Premium button components
├── lib/
│   └── utils.ts            # Utility functions (cn)
├── public/
│   ├── water-cooled.MOV     # Hydro cooling video
│   ├── air-cooled.MOV       # Air cooling video
│   └── emmersion.MOV       # Immersion cooling video
└── tailwind.config.ts       # Tailwind configuration
```

## 🌐 Deployment to Vercel

This project is ready for Vercel deployment:

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Option 2: Deploy via Git

1. Push to GitHub/GitLab/Bitbucket

2. Go to [vercel.com](https://vercel.com)

3. Click "Add New Project"

4. Import your repository

5. Deploy!

## 📄 Environment Variables

No environment variables required for basic functionality.

## 🎨 Customization

### Globe Configuration

Edit the markers in `components/ui/globe.tsx`:
```typescript
const GLOBE_CONFIG: COBEOptions = {
  // ... other config
  markers: [
    { location: [lat, lng], size: 0.15 }, // Add markers
  ],
}
```

### Colors

Customize colors in `app/globals.css`:
```css
:root {
  --primary: #3b82f6;
  --background: #0f172a;
  /* ... other colors */
}
```

## 📞 Contact Information

The website includes:
- Phone: +971 58 862 2898, +971 56 266 3665
- Email: team@minershub.ae
- Location: Abu Dhabi, UAE

## 🎯 Key Sections

1. **Hero Section** - 40MW capacity highlight with interactive globe
2. **Value Propositions** - Key benefits (4 cards)
3. **ASIC Miners** - Showcase of major miner brands (Antminer, Whatsminer, KS3)
4. **Cooling Solutions** - Tabbed video showcase with detailed explanations
5. **CTA Section** - Call to action with gradient background
6. **Contact Section** - Form and contact details
7. **Footer** - Navigation and social links

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 License

Copyright © 2024 Miners Hub. All rights reserved.
