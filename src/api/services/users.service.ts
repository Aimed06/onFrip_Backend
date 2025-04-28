import { IsNull, Not } from "typeorm";
import { User } from "../entities/User.entity";
import { CreateUserCommand } from "./commands/CreateUserCommand";
import { UpdateUserCommand } from "./commands/UpdateUserCommand";
import { ProductService } from "./products.service";
import { AppDataSource } from "../../config/typeorm";


export class UserService {
    public static async findAll() : Promise<User[]> {
        
        const users = await User.find();
        return users;
    }

    public static async findOne(id: number): Promise<User | null> {
        const user = await User.findOneBy({ id: id });
        return user;
    }

    public static async create(userData: CreateUserCommand): Promise<User | null> {
        const user = new User();
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.email = userData.email;
        user.phone = userData.phone;
        return user.save();
    }

    public static async delete(id: number) {
        return User.delete({ id: id });
    }

    public static async update(id: number, userData: UpdateUserCommand): Promise<User | null> {
        const user = await User.findOneBy({id:id});
        if (!user) {
          return null; // User not found
        }
    
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.phone = userData.phone;
        
        return user.save();
      }

      public static async setSocketId(id: number, socketId: string): Promise<User | null> {
        const user = await User.findOneBy({id: id});
        if (user) {
          user.socketId = socketId;
          return user.save();
        }
        return null;
      }
    
      public static async unsetSocketId(id: string): Promise<User | null> {
        const user = await User.findOneBy({socketId: id});
        if (user) {
          delete user.socketId;
          return user.save();
        }
        return null;
      }
    
      public static async findOneBySocketId(socketId: string): Promise<User | null> {
        const user = await User.findOneBy({ socketId: socketId });
        return user;
      }

      //i only have 1 seller for a specific product
      public static async getProductUserSocketId(productId: number): Promise<string | undefined> {
        const product = await ProductService.findOne(productId);
        if (!product) return "";
        const user = await User.findOneBy({ id: product.seller.id });
        if (!user) return "";
        return user.socketId;
      }

    
    


}