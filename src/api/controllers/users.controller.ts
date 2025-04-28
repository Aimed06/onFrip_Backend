import { NextFunction, Request, Response } from "express";
import { HttpErrors } from "../errors/httpErrors";
import { UserService } from "../services/users.service";
import { UpdateUserCommand } from "../services/commands/UpdateUserCommand";
import { CreateUserCommand } from "../services/commands/CreateUserCommand";

export class UsersController {

    // ----------------------------------- Get all users -----------------------------------
    public static async findAll(req: Request, res: Response, next: NextFunction) {
      try {
        const users = await UserService.findAll();
        if (!users) throw new HttpErrors.NotFound("There are no users yet")
        res.json(users);
      } catch (error) {
        next(error);
      }
    }
    public static async findOne(req: Request, res: Response, next: NextFunction) {
      const id = parseInt(req.params.id);
      try {
        const users = await UserService.findOne(id);
        if (!users) throw new HttpErrors.NotFound("Utilisateur introuvable")
        res.json(users);
      } catch (error) {
        next(error);
      }
    }

    // ----------------------------------- Create a new user -----------------------------------
  public static async create(req: Request, res: Response, next: NextFunction) {

    const { firstName, lastName, email, phone } = req.body

    try {
      if (!firstName) throw new HttpErrors.BadRequest("FirstName field required")
      if (!lastName) throw new HttpErrors.BadRequest("LastName field required")
      if (!email) throw new HttpErrors.BadRequest("Email field required")
      if (!phone) throw new HttpErrors.BadRequest("Phone field required")

      const data: CreateUserCommand = {
        firstName,
        lastName,
        email,
        phone
      };

      const createdUser = await UserService.create(data);
      res.json(createdUser);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------------------- Delete a user -----------------------------------
  public static async delete(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);

    try {
      const deletedUser = await UserService.delete(id);
      res.json(`User #${id} deleted.`);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------------------- Update a user -----------------------------------
  public static async update(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);

    const { firstName, lastName, phone } = req.body;
    try {
      if (!firstName) throw new HttpErrors.BadRequest("FirstName field required");
      if (!lastName) throw new HttpErrors.BadRequest("LastName field required");
      if (!phone) throw new HttpErrors.BadRequest("Phone field required");

      const data: UpdateUserCommand = {
        firstName,
        lastName,
        phone
      };

      const updatedUser = await UserService.update(id, data);
      if (!updatedUser) throw new HttpErrors.NotFound("Utilisateur introuvable");

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

}
export default UsersController;