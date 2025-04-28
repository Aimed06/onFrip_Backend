import { Category } from "../entities/Category.entity";     
import { CreateCategoryCommand } from "../services/commands/categories/CreateCategoryCommand"
import { AppDataSource } from "../../config/typeorm";


export class CategoryService {
  public static async findAll(): Promise<Category[]> {
    const categories = await Category.find();
    return categories;
  }

  public static async findById(id: string): Promise<Category | null> {
    const category = await Category.findOne({ where: { id } });
    return category;
  }

  public static async findByName(categoryNames: string[] ): Promise<Category []| null> {
    const categories =  await AppDataSource.getRepository(Category)
    .createQueryBuilder('category')
    .where('category.name IN (:...names)', { names: categoryNames })
    .getMany();
    return categories;
  }

  public static async findByIds(categoryIds: string[]): Promise<Category[]> {
    const categories = await AppDataSource.getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id IN (:...ids)', { ids: categoryIds })
      .getMany();
    return categories;
  }

  public static async create(categoryData: CreateCategoryCommand): Promise<Category | null> {
    const category = new Category();
    category.id = categoryData.id;
    category.name = categoryData.displayName;
    const createdCategory = await category.save();
    return createdCategory;
  }

  public static async delete(id: string) {
    const categoryRepository = AppDataSource.getRepository(Category);
    const deletedCategory = await categoryRepository.delete(id);
    return deletedCategory;
  }
}
