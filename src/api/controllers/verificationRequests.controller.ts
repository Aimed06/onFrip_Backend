import { NextFunction, Request, Response } from "express";
import { CreateVerificationRequestCommand } from "../services/commands/verificationRequests/CreateVerificationRequest";
import { HttpErrors } from "../errors/httpErrors";
import { VerificationRequestService } from "../services/verificationRequest.service";
import { UserService } from "../services/users.service";
import { User, verificationStatus } from "../entities/User.entity";
import { VerificationRequest } from "../entities/VerificationRequest.entity";
import path from 'path';
import fs from 'fs';

export class VerificationRequestsController {
  public static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const verification_requests = await VerificationRequestService.findAll();
      res.json(verification_requests);
    } catch (error) {
      next(error);
    }
  }

  public static async findOne(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const verification_request = await VerificationRequestService.findOne(id);
      if (!verification_request) throw new HttpErrors.NotFound("Verification Request not Found");
      res.json(verification_request);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;
    const file = req.file;
    if (!file) throw new HttpErrors.NotFound("file field required");

    try {
      if (user.verificationStatus === verificationStatus.VERIFIED) throw new HttpErrors.Conflict("User is already verified");
      if (user.verificationStatus === verificationStatus.WAITING) throw new HttpErrors.Conflict("User is already waiting for verification");

      const data: CreateVerificationRequestCommand = {
        document: file.filename,
        user,
      };

      await User.update({ id: user.id }, { verificationStatus: verificationStatus.WAITING });

      const createdVerificationService = await VerificationRequestService.create(data);
      res.json({
        success: true,
        message: "Verification Request sent successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public static async acceptVerificationRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const admin = res.locals.admin;

      if (!admin) throw new HttpErrors.Forbidden("You are not allowed to accept this request");
      const verificationRequest = await VerificationRequestService.findOne(id);
      if (!verificationRequest) throw new HttpErrors.NotFound("Verification Request not Found");
      if (verificationRequest.isValid) throw new HttpErrors.Conflict("Verification Request is already accepted");

      const userId = verificationRequest.user_id;
      await User.update({ id: userId }, { verificationStatus: verificationStatus.VERIFIED });
      await VerificationRequest.update({ id: id }, { isValid: true });
      await VerificationRequest.delete(id);

      // Delete the associated file
      const filePath = path.join(__dirname, '../public/uploads/', verificationRequest.document);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
      }})
    

      res.json({
        success: true,
        message: "Verification Request accepted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public static async rejectVerificationRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const admin = res.locals.admin;

      if (!admin) throw new HttpErrors.Forbidden("You are not allowed to reject this request");
      const verificationRequest = await VerificationRequestService.findOne(id);
      if (!verificationRequest) throw new HttpErrors.NotFound("Verification Request not Found");
      if (verificationRequest.isValid) throw new HttpErrors.Conflict("Verification Request is already accepted");

      const userId = verificationRequest.user_id;
      await User.update({ id: userId }, { verificationStatus: verificationStatus.REFUSED });
      await VerificationRequest.update({ id: id }, { isValid: false });
      await VerificationRequest.delete(id);

      // Delete the associated file
      const filePath = path.join(__dirname, '../public/uploads/', verificationRequest.document);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } 
      });

      res.json({
        success: true,
        message: "Verification Request rejected successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);

    try {
      const deletedVerificationRequest = await VerificationRequestService.delete(id);
      res.json(`Verification Request with id ${id} deleted`);
    } catch (error) {
      next(error);
    }
  }
}

export default VerificationRequestsController;
