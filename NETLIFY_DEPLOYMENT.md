# 🚀 Netlify Deployment Guide for Rahoot

## 📋 **Prerequisites**

1. **GitHub Repository** - Push your code to GitHub
2. **Netlify Account** - Sign up at [netlify.com](https://netlify.com)
3. **Domain (Optional)** - Custom domain for your app

## 🔧 **Files Created for Deployment**

### **Configuration Files**
- ✅ `netlify.toml` - Main Netlify configuration
- ✅ `packages/web/.env.production` - Production environment variables
- ✅ `packages/web/public/_redirects` - SPA routing redirects
- ✅ `packages/web/.netlify/functions/socket.js` - Socket.IO serverless function
- ✅ `packages/web/socket-handlers.js` - Game logic for serverless
- ✅ Updated `next.config.mjs` - Netlify-optimized settings
- ✅ Updated `package.json` - Added build:web script

## 🚀 **Deployment Steps**

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

### **Step 2: Connect to Netlify**
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `packages/web`
   - **Build command**: `cd ../.. && pnpm install && pnpm build:web`
   - **Publish directory**: `packages/web/.next`

### **Step 3: Environment Variables**
In Netlify dashboard, go to Site settings > Environment variables:
```
NEXT_PUBLIC_SOCKET_URL=wss://your-app-name.netlify.app/.netlify/functions/socket
NEXT_PUBLIC_WEB_ORIGIN=https://your-app-name.netlify.app
```

### **Step 4: Deploy**
1. Click "Deploy site"
2. Wait for build to complete
3. Your app will be available at `https://your-app-name.netlify.app`

## ⚠️ **Important Limitations**

### **Socket.IO Challenges**
Netlify Functions have limitations for real-time WebSocket connections:

1. **Function Timeout** - 10 seconds max execution time
2. **No Persistent Connections** - Functions are stateless
3. **Cold Starts** - Delay on first request

### **Recommended Alternative: Hybrid Deployment**

**Option 1: Frontend on Netlify + Backend on Railway/Render**
- Deploy Next.js frontend to Netlify
- Deploy Socket.IO server to Railway/Render/Heroku
- Update environment variables to point to external socket server

**Option 2: Full Stack on Vercel**
- Vercel has better WebSocket support
- Can handle both frontend and serverless functions
- Better for real-time applications

## 🔄 **Alternative: Vercel Deployment**

If Netlify doesn't work well for the socket server, use Vercel instead:

### **Vercel Configuration**
```json
// vercel.json
{
  "builds": [
    {
      "src": "packages/web/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "packages/socket/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/socket.io/(.*)",
      "dest": "/packages/socket/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/packages/web/$1"
    }
  ]
}
```

## 🌐 **Production URLs**

After deployment, your app will be available at:
- **Main App**: `https://your-app-name.netlify.app`
- **Manager**: `https://your-app-name.netlify.app/manager`
- **Socket API**: `https://your-app-name.netlify.app/.netlify/functions/socket`

## 📱 **Mobile Access**

Once deployed, students can access on mobile:
1. **Share URL**: `https://your-app-name.netlify.app`
2. **Enter PIN** from manager
3. **Play on phone** with virtual keyboard

## 🔧 **Troubleshooting**

### **Build Errors**
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check build logs in Netlify dashboard

### **Socket Connection Issues**
- Verify environment variables are set
- Check browser console for WebSocket errors
- Consider using external socket server

### **Mobile Issues**
- Test on different browsers (Safari, Chrome)
- Check responsive design on various screen sizes
- Verify touch events work properly

## 🎯 **Best Practices**

1. **Test Locally First**
   ```bash
   pnpm build:web
   pnpm start
   ```

2. **Monitor Performance**
   - Use Netlify Analytics
   - Check Core Web Vitals
   - Monitor function execution times

3. **Optimize for Mobile**
   - Test on real devices
   - Check network performance
   - Verify audio works on mobile

## 📊 **Expected Performance**

### **Netlify Advantages**
- ✅ **Fast CDN** - Global edge locations
- ✅ **Automatic HTTPS** - SSL certificates
- ✅ **Custom Domains** - Easy setup
- ✅ **Branch Previews** - Test deployments

### **Potential Issues**
- ⚠️ **WebSocket Limitations** - May need external server
- ⚠️ **Function Timeouts** - 10-second limit
- ⚠️ **Cold Starts** - Initial delay

---

## 🚀 **Ready to Deploy!**

All configuration files are created. Follow the steps above to deploy your Rahoot spelling game to Netlify!

**For best results with real-time features, consider using Vercel or a hybrid approach with external socket server.** 🎯