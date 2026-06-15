import { HttpError } from "../../../errors/http-error";
import { RestaurantRepository } from "../../restaurant/repository/restaurant.repository";
import { CreateMenuItemDTO, EditMenuItemDTO } from "../dto/menu.dto";
import { IMenuItem } from "../model/menu.model";
import { MenuRepository } from "../repository/menu.repository";

const menuRepo = new MenuRepository();
const restaurantRepo = new RestaurantRepository();

export class MenuService {
  async createMenuItem(
    ownerId: string,
    restaurantId: string,
    data: CreateMenuItemDTO,
  ): Promise<IMenuItem | null> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }
    if (!data.imageUrl) {
      throw new HttpError(400, "Menu Item Must Have Its Image");
    }
    const menuItemToCreate = {
      restaurantId: restaurant._id,
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      imageUrl: data.imageUrl,
      commonAllergens: data.commonAllergens,
    };

    const newMenuItem = await menuRepo.createMenuItem(menuItemToCreate);
    return newMenuItem;
  }

  async editMenuItem(
    ownerId: string,
    menuItemId: string,
    updateData: EditMenuItemDTO,
  ): Promise<IMenuItem | null> {
    const menuItem = await menuRepo.getMenuItemById(menuItemId);
    if (!menuItem) {
      throw new HttpError(404, "Menu Item Not Found");
    }
    const restaurantId = menuItem.restaurantId.toString();
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    if (!restaurant) {
      throw new HttpError(404, "restaurant Not Found");
    }
    const updatedMenuItem = await menuRepo.editMenuItem(menuItemId, updateData);
    if (!updatedMenuItem) {
      throw new HttpError(400, "Failed To Update Menu Item");
    }
    return updatedMenuItem;
  }

  async deleteMenuItem(
    ownerId: string,
    menuItemId: string,
  ): Promise<{ message: string }> {
    const menuItem = await menuRepo.getMenuItemById(menuItemId);
    if (!menuItem) {
      throw new HttpError(404, "Menu Item Not Found");
    }

    const restaurantId = menuItem.restaurantId.toString();
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    if (!restaurant) {
      throw new HttpError(404, "restaurant Not Found");
    }

    const deleteMenuItem = await menuRepo.deleteMenuItem(menuItemId);
    if (!deleteMenuItem) {
      throw new HttpError(400, "Failed To Delete Menu Item");
    }

    return { message: "Menu Item Deleted Successfully" };
  }

  async deleteMenuByRestaurant(
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
    const deleteMenu = await menuRepo.deleteMenuByRestaurant(restaurantId);
    if (!deleteMenu) {
      throw new HttpError(400, "Failed To Delete Menu");
    }

    return { message: "Menu Deleted Successfully" };
  }

  async getMenuByRestaurant(
    ownerId: string,
    restaurantId: string,
  ): Promise<IMenuItem[]> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }
    return menuRepo.getMenuByRestaurant(restaurantId);
  }

  async getAvailableMenu(
    ownerId: string,
    restaurantId: string,
  ): Promise<IMenuItem[]> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }
    return menuRepo.getAvailableMenu(restaurantId);
  }

  async getMenuByCategory(
    ownerId: string,
    restaurantId: string,
    category: IMenuItem["category"],
  ): Promise<IMenuItem[]> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }
    return await menuRepo.getMenuByCategory(restaurantId, category);
  }

  async toggleItemPopularity(
    ownerId: string,
    restaurantId: string,
    menuItemId: string,
  ): Promise<IMenuItem> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }

    const menuItem = await menuRepo.getMenuItemById(menuItemId);

    if (!menuItem) {
      throw new HttpError(404, "Menu Item Not Found");
    }
    if (menuItem.restaurantId.toString() !== restaurantId) {
      throw new HttpError(403, "Menu Item Does Not Belong To Restaurant");
    }
    if (menuItem.isPopular) {
      const unpopular = await menuRepo.removePopularFlag(menuItemId);
      if (!unpopular) {
        throw new HttpError(400, "Failed To Remove Popularity Flag");
      }
      return unpopular;
    }
    const popular = await menuRepo.markItemPopular(menuItemId);
    if (!popular) {
      throw new HttpError(400, "Failed To Add Popularity Flag");
    }
    return popular;
  }

  async toggleMenuItemAvailability(
    ownerId: string,
    restaurantId: string,
    menuItemId: string,
  ): Promise<IMenuItem> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );
    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }

    const menuItem = await menuRepo.getMenuItemById(menuItemId);

    if (!menuItem) {
      throw new HttpError(404, "Menu Item Not Found");
    }

    if (menuItem.restaurantId.toString() !== restaurantId) {
      throw new HttpError(403, "Menu Item Does Not Belong To Restaurant");
    }

    if (menuItem.isAvailable) {
      const unavailable = await menuRepo.setItemUnavailable(menuItemId);

      if (!unavailable) {
        throw new HttpError(400, "Failed To Make Item Unavailable");
      }

      return unavailable;
    }

    const available = await menuRepo.setItemAvailable(menuItemId);

    if (!available) {
      throw new HttpError(400, "Failed To Make Item Available");
    }

    return available;
  }
}
