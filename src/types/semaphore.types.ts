import type { Address, Hash } from "viem";

export interface SemaphoreProof {
  merkleTreeDepth: bigint;
  merkleTreeRoot: bigint;
  nullifier: bigint;
  message: bigint;
  scope: bigint;
  points: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
}

export interface CreateGroupDto {
  admin?: Address;
  merkleTreeDuration?: bigint;
}

export interface AddMemberDto {
  groupId: bigint;
  identityCommitment: bigint;
}

export interface AddMembersDto {
  groupId: bigint;
  identityCommitments: bigint[];
}

export interface RemoveMemberDto {
  groupId: bigint;
  identityCommitment: bigint;
  merkleProofSiblings: bigint[];
}

export interface UpdateMemberDto {
  groupId: bigint;
  identityCommitment: bigint;
  newIdentityCommitment: bigint;
  merkleProofSiblings: bigint[];
}

export interface ValidateProofDto {
  groupId: bigint;
  proof: SemaphoreProof;
}

export interface VerifyProofDto {
  groupId: bigint;
  proof: SemaphoreProof;
}

export interface GroupInfo {
  id: bigint;
  admin: Address;
  merkleTreeDuration: bigint;
  merkleTreeDepth: bigint;
  merkleTreeRoot: bigint;
  merkleTreeSize: bigint;
}

export interface TransactionResult {
  txHash: Hash;
  blockNumber: bigint;
  gasUsed: bigint;
  status: "success" | "reverted";
}
