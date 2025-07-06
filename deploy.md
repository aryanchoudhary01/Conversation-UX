# Deployment Guide for Koo AI Assistant

## Quick Deploy Options (All Free!)

### 🚀 Option 1: Vercel (Easiest - 2 minutes)
1. **Push to GitHub**: Upload your code to a GitHub repository
2. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign up with GitHub
3. **Import Project**: Click "New Project" → Import your GitHub repo
4. **Add Environment Variable**: In project settings, add:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
5. **Deploy**: Click "Deploy" - your app will be live in 2 minutes!

### 🌐 Option 2: Netlify (Also Easy)
1. **Push to GitHub**: Upload your code to GitHub
2. **Go to Netlify**: Visit [netlify.com](https://netlify.com) and sign up
3. **Connect Repo**: Click "New site from Git" → Connect your GitHub repo
4. **Add Environment Variable**: In site settings → Environment variables:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
5. **Deploy**: Your site will be live automatically!

### 📄 Option 3: GitHub Pages (Free Forever)
1. **Push to GitHub**: Upload your code to GitHub
2. **Add Secret**: Go to repo Settings → Secrets → Add `GEMINI_API_KEY`
3. **Enable Pages**: Go to Settings → Pages → Source: GitHub Actions
4. **Push Changes**: The workflow will auto-deploy your site!

## What You Need

### 1. Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/)
- Create a new API key
- Copy the key (starts with `AIza...`)

### 2. GitHub Account
- Create a free account at [github.com](https://github.com)
- Create a new repository
- Upload your code

## Environment Variables

All platforms need this environment variable:
```
GEMINI_API_KEY=your_actual_api_key_here
```

## Features After Deployment

✅ **Free Hosting** - No cost ever  
✅ **Custom Domain** - Add your own domain  
✅ **Auto-Deploy** - Updates when you push code  
✅ **HTTPS** - Secure by default  
✅ **Global CDN** - Fast worldwide  

## Troubleshooting

### If the app doesn't work:
1. Check that `GEMINI_API_KEY` is set correctly
2. Make sure your API key has credits/quota
3. Check browser console for errors
4. Try in an incognito window

### If build fails:
1. Check that all files are committed to GitHub
2. Verify `package.json` has correct scripts
3. Check that Node.js version is 18+

## Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Netlify**: [netlify.com/support](https://netlify.com/support)
- **GitHub**: [github.com/support](https://github.com/support)

Your app will be live at a URL like:
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- GitHub Pages: `https://username.github.io/repo-name` 