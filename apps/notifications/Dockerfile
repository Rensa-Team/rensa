FROM oven/bun:1.3.5 AS deps
WORKDIR /repo

COPY package.json pnpm-workspace.yaml ./
COPY apps/notifications/package.json apps/notifications/package.json
COPY packages/cache/package.json packages/cache/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/rate-limit/package.json packages/rate-limit/package.json

COPY package.json .
RUN bun install

FROM deps AS build
ENV NODE_ENV=production

COPY apps/notifications apps/notifications
COPY packages packages

WORKDIR /repo/apps/notifications
RUN bun build --compile --outfile server src/index.ts
RUN bun build --compile --outfile healthcheck src/healthcheck.ts

FROM deps AS dev
ENV NODE_ENV=development

COPY apps/notifications apps/notifications
COPY packages packages

WORKDIR /repo/apps/notifications
EXPOSE 3002
CMD ["bun", "run", "--watch", "src/index.ts"]

FROM gcr.io/distroless/base AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /repo/apps/notifications/server ./server
COPY --from=build /repo/apps/notifications/healthcheck ./healthcheck

EXPOSE 3002
CMD ["./server"]
