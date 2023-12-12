import app from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 8000;

  

app.listen({ port: FASTIFY_PORT });

console.log(`🚀  Fastify server running on port http://localhost:${FASTIFY_PORT}`);

