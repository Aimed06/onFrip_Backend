import { Request, Response } from "express";
import { CategoryService } from "../services/categories.service";
import { CreateCategoryCommand } from "../services/commands/categories/CreateCategoryCommand";

export class CategoryController {
  /**
   * Récupère toutes les catégories
   */
  public static async getAllCategories(req: any, res: any) {
    try {
      const categories = await CategoryService.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * Récupère une catégorie par son ID
   */
  public static async getCategoryById(req: any, res: any) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: "ID de catégorie requis" });
      }

      const category = await CategoryService.findById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error("Erreur lors de la récupération de la catégorie:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * Récupère des catégories par leurs noms
   */
  public static async getCategoriesByName(req: any, res: any) {
    try {
      const { names } = req.body;
      
      if (!names || !Array.isArray(names) || names.length === 0) {
        return res.status(400).json({ message: "Liste de noms de catégories requise" });
      }

      const categories = await CategoryService.findByName(names);
      
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: "Aucune catégorie trouvée" });
      }
      
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories par nom:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * Récupère des catégories par leurs IDs
   */
  public static async getCategoriesByIds(req: any, res: any) {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Liste d'IDs de catégories requise" });
      }

      const categories = await CategoryService.findByIds(ids);
      
      if (categories.length === 0) {
        return res.status(404).json({ message: "Aucune catégorie trouvée" });
      }
      
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories par IDs:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * Crée une nouvelle catégorie
   */
  public static async createCategory(req: any, res: any) {
    try {
      const { id, displayName } = req.body;
      
      if (!id || !displayName) {
        return res.status(400).json({ message: "ID et nom d'affichage requis" });
      }

      const categoryCommand: CreateCategoryCommand = {
        id,
        displayName
      };

      const existingCategory = await CategoryService.findById(id);
      if (existingCategory) {
        return res.status(409).json({ message: "Une catégorie avec cet ID existe déjà" });
      }

      const category = await CategoryService.create(categoryCommand);
      
      if (!category) {
        return res.status(500).json({ message: "Échec de la création de la catégorie" });
      }
      
      return res.status(201).json(category);
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * Supprime une catégorie
   */
  public static async deleteCategory(req: any, res: any) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: "ID de catégorie requis" });
      }

      const existingCategory = await CategoryService.findById(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }

      const result = await CategoryService.delete(id);
      
      if (result.affected === 0) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      
      return res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}
