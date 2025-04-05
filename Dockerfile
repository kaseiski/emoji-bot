FROM node:23.11.0-slim

RUN corepack enable
RUN corepack install -g pnpm

WORKDIR /emoji-bot

COPY --link pnpm-lock.yaml package.json ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked \
	pnpm install --frozen-lockfile --aggregate-output

COPY --link . ./

CMD ["pnpm", "start"]