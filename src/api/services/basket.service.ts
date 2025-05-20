import { Basket } from "../entities/Basket.entity";
import { CreateBasketCommand } from "./commands/basket/CreateBasketCommand"
import { AppDataSource } from "../../config/typeorm";

export class BasketService {
  public static async findAll(): Promise<Basket[]> {
    const basket = await Basket.find();
    return basket;
  }

  public static async isBasket(userId: number,productId:number): Promise<boolean> {
    const basket = await Basket.exists({where:{userId:userId,productId:productId}});
    return basket;
  }

  public static async getUserBasket(userId: number): Promise<Basket[]> {
    
    const basket = await Basket.find({
      where: { userId },relations:["product"]
      })
      return basket;
    }

    public static async deleteAll(userId: number) {
      const basket = await Basket.delete({ userId });
      return basket;
    }



  public static async create(BasketData: CreateBasketCommand): Promise<Basket | null> {
    const basket = new Basket();

    basket.user=BasketData.user
    basket.product = BasketData.product;
    const createdBasket = await basket.save();
    return createdBasket;
}


  public static async delete(userId: number,productId:number) {
    const basketHotelRepository = AppDataSource.getRepository(Basket);

       const deletedBasket = await basketHotelRepository.delete({ userId, productId });
       return deletedBasket;
  }

}
