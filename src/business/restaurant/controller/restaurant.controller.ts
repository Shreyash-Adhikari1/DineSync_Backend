import { Request, Response } from "express";
import { RestaurantService } from "../service/restaurant.service";
import { CreateRestaurantDTO, EditRestaurantDTO } from "../dto/restaurant.dto";

const restaurantService = new RestaurantService();

export class RestaurantController {
  createRestaurant = async (req: Request, res: Response) => {
    try {
      const owner = (req as any).business?.id;

      if (!owner) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access denied",
        });
      }

      const createDetailsParsed = CreateRestaurantDTO.safeParse(req.body);

      if (!createDetailsParsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid Create Data",
        });
      }

      const restaurant = await restaurantService.createRestaurant(
        owner,
        createDetailsParsed.data,
      );

      return res.status(200).json({
        success: true,
        message: "Restaurant Created Successfully",
        restaurant,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  updateRestaurant = async (req: Request, res: Response) => {
    try {
      const updateDetailsParsed = EditRestaurantDTO.safeParse(req.body);

      if (!updateDetailsParsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid Update Data",
        });
      }
      const owner = (req as any).business?.id;
      console.log("Try bhitra aayo hai");
      if (!owner) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access denied",
        });
      }

      const restaurantId = String(req.params.restaurantId);

      if (!restaurantId) {
        return res.status(404).json({
          success: false,
          message: "Restaurant Not Found",
        });
      }

      const updatedRestaurant = await restaurantService.updateRestaurant(
        owner,
        restaurantId,
        updateDetailsParsed.data,
      );

      return res.status(200).json({
        success: true,
        message: "Restaurant Updated Successfully",
        restaurant: updatedRestaurant,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  deleteRestaurant = async (req: Request, res: Response) => {
    try {
      const owner = (req as any).business?.id;

      if (!owner) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access denied",
        });
      }

      const restaurantId = String(req.params.restaurantId);

      if (!restaurantId) {
        return res.status(404).json({
          success: false,
          message: "Restaurant Not Found",
        });
      }
      await restaurantService.deleteRestaurant(owner, restaurantId);

      return res.status(200).json({
        success: true,
        message: "Restaurant Deleted Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  getRestaurantsByBusiness = async (req: Request, res: Response) => {
    try {
      const owner = (req as any).business?.id;

      if (!owner) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access denied",
        });
      }

      const restaurants =
        await restaurantService.getRestaurantsByBusiness(owner);

      return res.status(200).json({
        success: true,
        message: "Restaurants Fetched Successfully",
        restaurants,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
}
