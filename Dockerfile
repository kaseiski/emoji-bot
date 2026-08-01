FROM node:26.5.1-slim

RUN npm install -g corepack
RUN corepack enable
RUN corepack install -g pnpm

WORKDIR /emoji-bot

COPY --link pnpm-lock.yaml pnpm-workspace.yaml package.json ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked \
	pnpm install --frozen-lockfile --aggregate-output

COPY --link . ./

CMD ["pnpm", "start"]