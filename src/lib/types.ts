export interface Session {
  id: string;
  orgId: string;
  name: string;
  email: string;
  permission: string;
  role: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}
