export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}
export enum Status {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}
export enum agentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  SUSPENDED = "suspended",
}

export interface IUser {
  _id?: string;
  agentstatus: agentStatus;
  name: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  isDeleted?: string;
  commissionRate?: number; // Only for agents
  createdAt?: Date;
  updatedAt?: Date;
}
