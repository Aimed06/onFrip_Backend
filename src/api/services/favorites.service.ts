import { Favorite } from "../entities/Favorite.entity";
import { CreateFavoriteCommand } from "../services/commands/favorites/CreateFavoriteCommand"
import { AppDataSource } from "../../config/typeorm";

export class FavoriteService {
  public static async findAll(): Promise<Favorite[]> {
    const Favorites = await Favorite.find();
    return Favorites;
  }

  public static async isFavorite(userId: number,productId:number): Promise<boolean> {
    const favorite = await Favorite.exists({where:{userId:userId,productId:productId}}); ;
    return favorite;
  }

  public static async getUserFavorites(userId: number): Promise<Favorite[]> {
    
    const favorites = await Favorite.find({
      where: { userId },relations:["product"]
      })
      return favorites;
    }

    



    
  public static async create(FavoriteData: CreateFavoriteCommand): Promise<Favorite | null> {
    const favorite = new Favorite();
  
    favorite.user=FavoriteData.user
    favorite.product = FavoriteData.product;
    const createdFavorite = await favorite.save();
    return createdFavorite;
}


  public static async delete(userId: number,productId:number) {
    const favoriteHotelRepository = AppDataSource.getRepository(Favorite);

       const deletedFavorite = await favoriteHotelRepository.delete({ userId, productId });
       return deletedFavorite;
  }

}
