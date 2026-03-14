#!/bin/bash
# Final Deployment Script
# Final Deployment Script
npx vercel link --yes
npx vercel env add VIDEO_API_KEY "$VIDEO_API_KEY" production --yes
npx vercel env add VOICE_API_KEY "$VOICE_API_KEY" production --yes
npx vercel env add IMAGE_API_KEY "$IMAGE_API_KEY" production --yes
npx vercel env add RAZORPAY_KEY_ID "$RAZORPAY_KEY_ID" production --yes
npx vercel env add RAZORPAY_KEY_SECRET "$RAZORPAY_KEY_SECRET" production --yes
npx vercel deploy --prod --yes
