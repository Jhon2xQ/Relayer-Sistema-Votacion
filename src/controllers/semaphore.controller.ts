import { injectable, inject } from "tsyringe";
import type { Context } from "hono";
import { TOKENS } from "../config/tokens";
import type { ISemaphoreService } from "../interfaces/semaphore-service.interface";
import {
  CreateGroupSchema,
  AddMemberSchema,
  AddMembersSchema,
  RemoveMemberSchema,
  UpdateMemberSchema,
  ValidateProofSchema,
  VerifyProofSchema,
  MemberQuerySchema,
} from "../dto/semaphore.dto";
import { HTTPException } from "hono/http-exception";

@injectable()
export class SemaphoreController {
  constructor(
    @inject(TOKENS.SemaphoreService)
    private readonly semaphoreService: ISemaphoreService,
  ) {}

  createGroup = async (c: Context) => {
    const body = await c.req.json();
    const dto = CreateGroupSchema.parse(body);

    if (dto.admin && !/^0x[a-fA-F0-9]{40}$/.test(dto.admin)) {
      throw new HTTPException(400, { message: "Invalid admin address format" });
    }

    const result = await this.semaphoreService.createGroup(dto as any);

    return c.json(
      {
        success: true,
        message: "Group created successfully",
        data: {
          groupId: result.groupId.toString(),
          admin: dto.admin || "msg.sender",
          merkleTreeDuration: dto.merkleTreeDuration?.toString(),
          transaction: {
            hash: result.result.txHash,
            blockNumber: Number(result.result.blockNumber),
            gasUsed: result.result.gasUsed.toString(),
            status: result.result.status,
          },
        },
      },
      201,
    );
  };

  acceptGroupAdmin = async (c: Context) => {
    const groupId = BigInt(c.req.param("groupId"));

    const result = await this.semaphoreService.acceptGroupAdmin(groupId);

    return c.json({
      success: true,
      message: "Group admin accepted",
      data: {
        groupId: groupId.toString(),
        transaction: result,
      },
    });
  };

  updateGroupAdmin = async (c: Context) => {
    const groupId = BigInt(c.req.param("groupId"));
    const body = await c.req.json();
    const { newAdmin } = body;

    if (!newAdmin || !/^0x[a-fA-F0-9]{40}$/.test(newAdmin)) {
      throw new HTTPException(400, { message: "Invalid newAdmin address" });
    }

    const result = await this.semaphoreService.updateGroupAdmin(groupId, newAdmin);

    return c.json({
      success: true,
      message: "Group admin updated",
      data: {
        groupId: groupId.toString(),
        newAdmin,
        transaction: result,
      },
    });
  };

  getGroupInfo = async (c: Context) => {
    const groupId = BigInt(c.req.param("groupId"));

    const info = await this.semaphoreService.getGroupInfo(groupId);

    return c.json({
      success: true,
      data: {
        id: info.id.toString(),
        admin: info.admin,
        merkleTreeDuration: info.merkleTreeDuration.toString(),
        merkleTreeDepth: Number(info.merkleTreeDepth),
        merkleTreeRoot: info.merkleTreeRoot.toString(),
        merkleTreeSize: info.merkleTreeSize.toString(),
      },
    });
  };

  addMember = async (c: Context) => {
    const body = await c.req.json();
    const dto = AddMemberSchema.parse(body);

    const result = await this.semaphoreService.addMember(dto);

    return c.json(
      {
        success: true,
        message: "Member added to group",
        data: {
          groupId: dto.groupId.toString(),
          identityCommitment: dto.identityCommitment.toString(),
          transaction: {
            hash: result.txHash,
            blockNumber: Number(result.blockNumber),
            gasUsed: result.gasUsed.toString(),
          },
        },
      },
      201,
    );
  };

  addMembers = async (c: Context) => {
    const body = await c.req.json();
    const dto = AddMembersSchema.parse(body);

    const result = await this.semaphoreService.addMembers(dto);

    return c.json(
      {
        success: true,
        message: `${dto.identityCommitments.length} members added to group`,
        data: {
          groupId: dto.groupId.toString(),
          count: dto.identityCommitments.length,
          identityCommitments: dto.identityCommitments.map((c) => c.toString()),
          transaction: {
            hash: result.txHash,
            blockNumber: Number(result.blockNumber),
            gasUsed: result.gasUsed.toString(),
          },
        },
      },
      201,
    );
  };

  removeMember = async (c: Context) => {
    const body = await c.req.json();
    const dto = RemoveMemberSchema.parse(body);

    const result = await this.semaphoreService.removeMember(dto);

    return c.json({
      success: true,
      message: "Member removed from group",
      data: {
        groupId: dto.groupId.toString(),
        identityCommitment: dto.identityCommitment.toString(),
        transaction: result,
      },
    });
  };

  updateMember = async (c: Context) => {
    const body = await c.req.json();
    const dto = UpdateMemberSchema.parse(body);

    const result = await this.semaphoreService.updateMember(dto);

    return c.json({
      success: true,
      message: "Member updated",
      data: {
        groupId: dto.groupId.toString(),
        oldIdentityCommitment: dto.identityCommitment.toString(),
        newIdentityCommitment: dto.newIdentityCommitment.toString(),
        transaction: result,
      },
    });
  };

  hasMember = async (c: Context) => {
    const query = c.req.query();
    const dto = MemberQuerySchema.parse({
      groupId: query.groupId,
      identityCommitment: query.identityCommitment,
    });

    const hasMember = await this.semaphoreService.hasMember(dto.groupId, dto.identityCommitment);

    return c.json({
      success: true,
      data: {
        groupId: dto.groupId.toString(),
        identityCommitment: dto.identityCommitment.toString(),
        hasMember,
      },
    });
  };

  validateProof = async (c: Context) => {
    const body = await c.req.json();
    const dto = ValidateProofSchema.parse(body);

    const result = await this.semaphoreService.validateProof(dto);

    return c.json({
      success: true,
      message: "Proof validated on-chain",
      data: {
        groupId: dto.groupId.toString(),
        nullifier: dto.proof.nullifier.toString(),
        message: dto.proof.message.toString(),
        scope: dto.proof.scope.toString(),
        transaction: {
          hash: result.txHash,
          blockNumber: Number(result.blockNumber),
          gasUsed: result.gasUsed.toString(),
          status: result.status,
        },
      },
    });
  };

  verifyProof = async (c: Context) => {
    const body = await c.req.json();
    const dto = VerifyProofSchema.parse(body);

    const isValid = await this.semaphoreService.verifyProof(dto);

    return c.json({
      success: true,
      data: {
        groupId: dto.groupId.toString(),
        isValid,
        proof: {
          nullifier: dto.proof.nullifier.toString(),
          message: dto.proof.message.toString(),
          scope: dto.proof.scope.toString(),
        },
      },
    });
  };

  getGroupCounter = async (c: Context) => {
    const counter = await this.semaphoreService.getGroupCounter();

    return c.json({
      success: true,
      data: {
        totalGroups: counter.toString(),
        nextGroupId: counter.toString(),
      },
    });
  };

  getVerifier = async (c: Context) => {
    const verifier = await this.semaphoreService.getVerifier();

    return c.json({
      success: true,
      data: {
        verifierAddress: verifier,
      },
    });
  };
}
