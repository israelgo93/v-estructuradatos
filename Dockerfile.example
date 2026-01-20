FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN \
	if [ -f pnpm-lock.yaml ]; then \
		corepack enable pnpm && pnpm install --frozen-lockfile; \
	elif [ -f package-lock.json ]; then \
		npm ci --legacy-peer-deps; \
	else \
		npm install --legacy-peer-deps; \
	fi

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
