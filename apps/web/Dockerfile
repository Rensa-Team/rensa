FROM node:20-alpine AS deps
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/cache/package.json packages/cache/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/rate-limit/package.json packages/rate-limit/package.json

RUN pnpm install --frozen-lockfile --ignore-scripts

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# ===== Dependencies =====
FROM base AS deps
COPY apps/web/package*.json .
COPY packages ./packages
RUN npm install --package-lock-only
RUN npm ci

# ===== Build =====
FROM deps AS build
WORKDIR /repo

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_ELYSIA_WS_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_EXPLORE_SOURCE

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_EXPLORE_SOURCE=$NEXT_PUBLIC_EXPLORE_SOURCE

COPY apps/web .
RUN npm run build

FROM deps AS dev

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY apps/web .
EXPOSE 3000
CMD ["pnpm", "--filter", "@rensa/web", "dev", "--", "-H", "0.0.0.0"]

FROM node:20-alpine AS prod
WORKDIR /repo

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/cache/package.json packages/cache/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/rate-limit/package.json packages/rate-limit/package.json

COPY apps/web/package*.json .
COPY packages ./packages
RUN npm install --package-lock-only
RUN npm ci --omit=dev

COPY --from=build /repo/apps/web/.next apps/web/.next
COPY --from=build /repo/apps/web/public apps/web/public
COPY --from=build /repo/apps/web/next.config.* apps/web/

EXPOSE 3000
CMD ["pnpm", "--filter", "@rensa/web", "start"]