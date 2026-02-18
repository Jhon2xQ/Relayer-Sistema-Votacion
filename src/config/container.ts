import "reflect-metadata";
import { container } from "tsyringe";
import { TOKENS } from "./tokens";
import { BlockchainService } from "../services/blockchain.service";
import { SemaphoreService } from "../services/semaphore.service";
import { SemaphoreController } from "../controllers/semaphore.controller";

container.registerSingleton(TOKENS.BlockchainService, BlockchainService);
container.registerSingleton(TOKENS.SemaphoreService, SemaphoreService);
container.registerSingleton(SemaphoreController);

export { container, TOKENS };
