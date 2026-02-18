import "reflect-metadata";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { app } from "./routes";
import { errorHandler } from "./middleware/error-handler";

// CORS
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Error handler global
app.onError(errorHandler);

// Not Found
app.notFound((c) => {
  return c.json({ success: false, error: "Not Found" }, 404);
});

const port = process.env.PORT || 3000;

console.log(`
🚀 Server running at http://localhost:${port}
📦 Dependency Injection: tsyringe active
🔧 Contract: Semaphore ZK
`);

export default {
  port,
  fetch: app.fetch,
};
