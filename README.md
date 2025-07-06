# Koo - AI Kitchen Assistant

A voice-enabled AI kitchen assistant built with Lit and Google's Gemini AI.

## Features

- Real-time voice conversation with AI
- 3D audio visualizations
- Hinglish language support
- Kitchen planning and meal coordination

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

## Deployment

### Free Hosting Options

#### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Import your GitHub repository
4. Add your `GEMINI_API_KEY` as an environment variable in Vercel dashboard
5. Deploy!

#### Option 2: Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up
3. Connect your GitHub repository
4. Add your `GEMINI_API_KEY` as an environment variable
5. Deploy!

#### Option 3: GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Set source to GitHub Actions
4. Add your `GEMINI_API_KEY` as a repository secret
5. Create a GitHub Actions workflow for deployment

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```
