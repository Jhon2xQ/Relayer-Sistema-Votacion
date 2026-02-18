import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, sepolia, hardhat } from "viem/chains";
import { env } from "./env";

const getChain = () => {
  if (env.RPC_URL.includes("sepolia")) return sepolia;
  if (env.RPC_URL.includes("localhost") || env.RPC_URL.includes("127.0.0.1")) return hardhat;
  return mainnet;
};

export const chain = getChain();
export const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`);

export const publicClient = createPublicClient({
  chain,
  transport: http(env.RPC_URL),
});

export const walletClient = createWalletClient({
  account,
  chain,
  transport: http(env.RPC_URL),
});

export const blockchainConfig = {
  chain,
  account,
  contractAddress: env.CONTRACT_ADDRESS as `0x${string}`,
  rpcUrl: env.RPC_URL,
};
