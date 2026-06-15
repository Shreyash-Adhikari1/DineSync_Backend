import { Request, Response } from "express";
import { CreateMenuItemDTO, EditMenuItemDTO } from "../dto/menu.dto";
import { MenuService } from "../service/menu.service";

const menuService = new MenuService();

export class MenuController {
  createMenuItem = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;
      const { restaurantId } = req.params;
      //   console.log("request aata aako data", req.body);
      const parsed = CreateMenuItemDTO.safeParse(req.body);

      if (!parsed.success) {
        // console.log(parsed.error.flatten());
        return res
          .status(400)
          .json({ success: false, message: "Invalid Menu Item Data" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Menu Item Image is required" });
      }
      const menuFileName = (req.file as any)?.filename;
      const menuItem = await menuService.createMenuItem(
        ownerId,
        restaurantId as string,
        {
          ...parsed.data,
          imageUrl: menuFileName,
        },
      );

      return res.status(201).json({
        success: true,
        message: "Menu Item Created Successfully",
        menuItem,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  updateMenuItem = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;
      const { menuItemId } = req.params;

      const parsed = EditMenuItemDTO.safeParse(req.body);

      if (!parsed.success) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Update Data" });
      }

      const menuFileName = (req.file as any)?.filename;

      const menuItem = await menuService.editMenuItem(
        ownerId,
        menuItemId as string,
        { ...parsed.data, imageUrl: menuFileName },
      );

      return res.status(200).json({
        success: true,
        message: "Menu Item Updated Successfully",
        menuItem,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  deleteMenuItem = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;
      const { menuItemId } = req.params;

      const result = await menuService.deleteMenuItem(
        ownerId,
        menuItemId as string,
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  deleteMenuyRestaurant = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;
      const { restaurantId } = req.params;

      const result = await menuService.deleteMenuByRestaurant(
        ownerId,
        restaurantId as string,
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getMenuByRestaurant = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;
      const { restaurantId } = req.params;

      const menu = await menuService.getMenuByRestaurant(
        ownerId,
        restaurantId as string,
      );

      return res.status(200).json({
        success: true,
        menu,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAvailableMenu = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;
      const { restaurantId } = req.params;

      const menu = await menuService.getAvailableMenu(
        ownerId,
        restaurantId as string,
      );

      return res.status(200).json({
        success: true,
        menu,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getMenuByCategory = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { restaurantId, category } = req.params;

      const menu = await menuService.getMenuByCategory(
        ownerId,
        restaurantId as string,
        category as "mains" | "starters" | "drinks",
      );

      return res.status(200).json({
        success: true,
        menu,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  toggleItemPopularity = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { restaurantId, menuItemId } = req.params;

      const menuItem = await menuService.toggleItemPopularity(
        ownerId,
        restaurantId as string,
        menuItemId as string,
      );

      return res.status(200).json({
        success: true,
        message: "Popularity Updated Successfully",
        menuItem,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  toggleMenuItemAvailability = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { restaurantId, menuItemId } = req.params;

      const menuItem = await menuService.toggleMenuItemAvailability(
        ownerId,
        restaurantId as string,
        menuItemId as string,
      );

      return res.status(200).json({
        success: true,
        message: "Availability Updated Successfully",
        menuItem,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
}
