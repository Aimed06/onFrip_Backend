import { VerificationRequest } from "../entities/VerificationRequest.entity"

import { CreateVerificationRequestCommand } from "./commands/verificationRequests/CreateVerificationRequest";

export class VerificationRequestService {
  public static async findAll(): Promise<VerificationRequest[]> {
    const verification_requests = await VerificationRequest.find();
    return verification_requests;
  }

  public static async findOne(id: number): Promise<VerificationRequest | null> {
    const verification_request = await VerificationRequest.findOneBy({ id: id });
    return verification_request;
  }

  public static async create(reviewData: CreateVerificationRequestCommand): Promise<VerificationRequest | null> {
    const verification_request = new VerificationRequest();
    verification_request.document = reviewData.document;
    verification_request.user = reviewData.user;
    return verification_request.save();
  }

  public static async delete(id: number) {
    return VerificationRequest.delete({ id: id });
  }

  //   public static async update(id: number, userData: UpdateUserCommand): Promise<User | null> {
  //     const user = await User.findOneBy({id:id});
  //     if (!user) {
  //       return null; // User not found
  //     }

  //     user.firstName = userData.firstName;
  //     user.lastName = userData.lastName;
  //     user.phone = userData.phone;

  //     return user.save();
  //   }

}
