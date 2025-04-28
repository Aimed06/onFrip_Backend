import { User } from "../../../entities/User.entity";

export interface CreateVerificationRequestCommand {
  document: string;
  user: User;
}
