// src/routes/semaphore.routes.ts
import { Hono } from "hono";
import { container } from "../config/container";
import { SemaphoreController } from "../controllers/semaphore.controller";

const semaphoreRoutes = new Hono();
const controller = container.resolve(SemaphoreController);

// Grupos
semaphoreRoutes.post("/groups", controller.createGroup);
semaphoreRoutes.get("/groups/counter", controller.getGroupCounter);
semaphoreRoutes.get("/groups/:groupId", controller.getGroupInfo);
semaphoreRoutes.post("/groups/:groupId/accept-admin", controller.acceptGroupAdmin);
semaphoreRoutes.put("/groups/:groupId/admin", controller.updateGroupAdmin);

// Miembros
semaphoreRoutes.post("/members", controller.addMember);
semaphoreRoutes.post("/members/batch", controller.addMembers);
semaphoreRoutes.delete("/members", controller.removeMember);
semaphoreRoutes.put("/members", controller.updateMember);
semaphoreRoutes.get("/members/check", controller.hasMember);

// Pruebas ZK
semaphoreRoutes.post("/proofs/validate", controller.validateProof);
semaphoreRoutes.post("/proofs/verify", controller.verifyProof);

// Utilidades
semaphoreRoutes.get("/verifier", controller.getVerifier);

export { semaphoreRoutes };
