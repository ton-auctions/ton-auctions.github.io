# Build stage
FROM denoland/deno:2.3.1 AS builder
ENV DENO_DIR=/var/deno_cache
WORKDIR /app
COPY . .
RUN deno cache ./src/main.ts

# Production stage
FROM denoland/deno:2.3.1
WORKDIR /app

ENV DENO_DIR=/var/deno_cache

COPY --from=builder /var/deno_cache /var/deno_cache
COPY --from=builder /app .

RUN chown -R deno:deno /var/deno_cache
RUN chown -R deno:deno /app

USER deno

CMD ["deno", "run", "--allow-env", "--allow-ffi" ,"--unstable-ffi", "-R", "-W=./db,/var/deno_cache", "--allow-net=api.telegram.org:443,testnet.toncenter.com:443,toncenter.com:443,github.com:443,objects.githubusercontent.com:443", "src/main.ts"]
