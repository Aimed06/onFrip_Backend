export interface CreateNotificationCommand {
  userId?: number;
  productId?: number;
  type: string;
  data: object;
  isSeen?: boolean;
  createdAt?: Date;
}
