# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Declare Build Arguments (EasyPanel passes these as --build-arg)
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

# Set them as Environment Variables for the build process
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies based on the preferred package manager.
# npm install (not npm ci): sharp's optional wasm32 fallback
# (@img/sharp-wasm32 -> @emnapi/core, @emnapi/runtime) isn't fully
# expanded in package-lock.json by npm on Windows, which makes npm ci's
# stricter lockfile-completeness check fail here with "Missing: X from
# lock file" even though the resolved versions are correct.
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# Copy all files
COPY . .

# Invalidate cache for production build
ARG CACHEBUST=1

# Build the application
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-privileged user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Pre-create cache and data directories and grant permissions to nextjs user
RUN mkdir -p .next/cache && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
