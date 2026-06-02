import { IRestaurant, RestaurantModel } from "../model/restaurant.model";

export interface RestaurantRepositoryInterface {
  createRestaurant(restaurant: Partial<IRestaurant>): Promise<IRestaurant>;

  findRestaurantById(restaurantId: string): Promise<IRestaurant | null>;

  findRestaurantsByOwner(
    ownerId: string,
    skip?: number,
    limit?: number,
  ): Promise<IRestaurant[]>;

  updateRestaurant(
    restaurantId: string,
    updateData: Partial<IRestaurant>,
  ): Promise<IRestaurant | null>;

  deleteRestaurant(restaurantId: string): Promise<IRestaurant | null>;

  findRestaurantByOwnerAndId(
    ownerId: string,
    restaurantId: string,
  ): Promise<IRestaurant | null>;
}

export class RestaurantRepository implements RestaurantRepositoryInterface {
  createRestaurant(restaurant: Partial<IRestaurant>): Promise<IRestaurant> {
    const newRestaurant = new RestaurantModel(restaurant);
    return newRestaurant.save();
  }
  findRestaurantById(restaurantId: string): Promise<IRestaurant | null> {
    return RestaurantModel.findById(restaurantId).exec();
  }
  findRestaurantsByOwner(
    ownerId: string,
    skip = 0,
    limit = 10,
  ): Promise<IRestaurant[]> {
    return RestaurantModel.find({ ownerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
  updateRestaurant(
    restaurantId: string,
    updateData: Partial<IRestaurant>,
  ): Promise<IRestaurant | null> {
    return RestaurantModel.findByIdAndUpdate(
      restaurantId,
      {
        $set: updateData,
      },
      { new: true },
    ).exec();
  }
  deleteRestaurant(restaurantId: string): Promise<IRestaurant | null> {
    return RestaurantModel.findByIdAndDelete(restaurantId).exec();
  }

  findRestaurantByOwnerAndId(
    ownerId: string,
    restaurantId: string,
  ): Promise<IRestaurant | null> {
    return RestaurantModel.findOne({
      _id: restaurantId,
      ownerId,
    }).exec();
  }
}
