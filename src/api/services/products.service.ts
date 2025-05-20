import { Not } from "typeorm";
import { Product, ProductStatus } from "../entities/Product.entity";
import { User } from "../entities/User.entity";
import { CreateProductCommand } from "../services/commands/CreateProductCommand";
import { UpdateProductCommand } from "../services/commands/UpdateProductCommand";

export class ProductService {
  public static async findAll(): Promise<Product[]> {
    const products = await Product.find({
      relations: ["seller"], where : { status: Not(ProductStatus.SOLD) } // Only get available products
      })
       // Include seller and category relations);
    return products;
  }

  public static async findOne(id: number): Promise<Product | null> {
    const product = await Product.findOne({
      where: { id }
    });
    return product;
  }

  public static async create(productData: CreateProductCommand, user: User): Promise<Product> {
    const product = new Product();
    product.name = productData.name;
    product.price = productData.price;
    product.image = productData.image;
    product.seller = user; // Assign the seller to the product
    product.category = productData.productCategory;
    return product.save();
  }

  public static async delete(id: number) {
    return Product.delete({ id });
  }

  public static async update(id: number, productData: UpdateProductCommand): Promise<Product | null> {
    const product = await Product.findOneBy({ id });
    if (!product) {
      return null;
    }

     if(productData.name) product.name = productData.name;
     if(productData.price) product.price = productData.price;
     if(productData.image)  product.image = productData.image;
     if(productData.category) product.category = productData.category;

    return product.save();
  }

  // Example extra function: add a user to favorites
  //get a products seller

  public static async findseller(productId: number): Promise<User | null> {
    const product = await Product.findOne({
      where: { id: productId },
      relations: ["seller"]
    });
    if (!product) {
      return null;
    }
    return product.seller;

  }

  // get seller products
  public static async findSellerProducts(sellerId: number): Promise<Product[]> {
    const products = await Product.find({
      where: { seller: { id: sellerId } },
      relations: ["seller"]
    });
    return products;
  }

  public static async isProductOwned (userId:number, productId:number): Promise<Boolean>
    {
      try{
        const ownedProduct=  await Product.findOne({
      where: { id:productId,  seller: { id: userId } },
     });
     return !!ownedProduct;
      }catch (error) {
        console.error("Error checking product ownership:", error);
        return false;
      }
    }

  public static async deleteUserProduct(id: number, userId: number): Promise<Product | null> {
    const product = await Product.findOne({
      where: { id: id, seller: { id: userId } },
    });
    if (!product) return null;
    await Product.delete({ id: id });
    return product;
  }

 
}
