import { Types } from "mongoose";
import { HttpError } from "../../../errors/http-error";
import { BusinessRepository } from "../../auth/repo/businesss.repository";
import { CreateRestaurantDTO, EditRestaurantDTO } from "../dto/restaurant.dto";
import { IRestaurant } from "../model/restaurant.model";
import {
  RestaurantRepository,
  RestaurantRepositoryInterface,
} from "../repo/restaurant.repository";
import { promises } from "node:dns";

const restaurantRepo = new RestaurantRepository();
const businessRepo = new BusinessRepository();

export class RestaurantService {
  async createRestaurant(
    ownerId: string,
    data: CreateRestaurantDTO,
  ): Promise<IRestaurant> {
    const restaurantToCreate = {
      ownerId: new Types.ObjectId(ownerId),
      restaurantName: data.restaurantName,
      restaurantDescription: data.restaurantDescription,
      restaurantAddress: data.restaurantAddress,
      restaurantPhoneNumber: data.restaurantPhoneNumber,
    };

    const newRestaurant =
      await restaurantRepo.createRestaurant(restaurantToCreate);
    return newRestaurant;
  }

  async updateRestaurant(
    ownerId: string,
    restaurantId: string,
    updateData: EditRestaurantDTO,
  ): Promise<IRestaurant> {
    console.log("request service samma aayo hai");
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    console.log("owner check bhayo hai");
    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }
    const updatedRestaurant = await restaurantRepo.updateRestaurant(
      restaurantId,
      updateData,
    );

    if (!updatedRestaurant) {
      throw new HttpError(400, "Failed To Update Restaurant Details");
    }
    return updatedRestaurant;
  }

  async deleteRestaurant(
    ownerId: string,
    restaurantId: string,
  ): Promise<{ message: string }> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );

    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }
    await restaurantRepo.deleteRestaurant(restaurantId);
    return { message: "Restaurant Deleted Successfully" };
  }

  async getRestaurantsByBusiness(ownerId: string): Promise<IRestaurant[]> {
    return restaurantRepo.findRestaurantsByOwner(ownerId);
  }
}
