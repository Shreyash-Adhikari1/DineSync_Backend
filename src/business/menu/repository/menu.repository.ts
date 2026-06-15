import { IMenuItem, MenuItemModel } from "../model/menu.model";

export interface MenuRepositoryInterface {
  createMenuItem(menuItem: Partial<IMenuItem>): Promise<IMenuItem | null>;

  editMenuItem(
    menuItemId: string,
    updateData: Partial<IMenuItem>,
  ): Promise<IMenuItem | null>;

  getMenuByRestaurant(restaurantId: string): Promise<IMenuItem[]>;

  getMenuItemByName(
    restaurantId: string,
    name: string,
  ): Promise<IMenuItem | null>;

  getMenuItemById(menuItemId: string): Promise<IMenuItem | null>;

  getMenuByCategory(
    restaurantId: string,
    category: string,
  ): Promise<IMenuItem[]>;

  deleteMenuItem(menuItemId: string): Promise<IMenuItem | null>;

  deleteMenuByRestaurant(
    restaurantId: string,
  ): Promise<{ deletedCount: number }>;

  setItemAvailable(menuItemId: string): Promise<IMenuItem | null>;
  setItemUnavailable(menuItemId: string): Promise<IMenuItem | null>;

  markItemPopular(menuItemId: string): Promise<IMenuItem | null>;
  removePopularFlag(menuItemId: string): Promise<IMenuItem | null>;

  getAvailableMenu(restaurantId: string): Promise<IMenuItem[]>;
}

export class MenuRepository implements MenuRepositoryInterface {
  createMenuItem(menuItem: Partial<IMenuItem>): Promise<IMenuItem | null> {
    const newMenuItem = new MenuItemModel(menuItem);
    return newMenuItem.save();
  }

  editMenuItem(
    menuItemId: string,
    updateData: Partial<IMenuItem>,
  ): Promise<IMenuItem | null> {
    return MenuItemModel.findByIdAndUpdate(menuItemId, updateData, {
      returnDocument: "after",
    }).exec();
  }

  getMenuByRestaurant(restaurantId: string): Promise<IMenuItem[]> {
    return MenuItemModel.find({ restaurantId }).exec();
  }

  getMenuItemById(menuItemId: string): Promise<IMenuItem | null> {
    return MenuItemModel.findById(menuItemId).exec();
  }

  getMenuItemByName(
    restaurantId: string,
    name: string,
  ): Promise<IMenuItem | null> {
    return MenuItemModel.findOne({ restaurantId, name }).exec();
  }

  getMenuByCategory(
    restaurantId: string,
    category: IMenuItem["category"],
  ): Promise<IMenuItem[]> {
    return MenuItemModel.find({ restaurantId, category }).exec();
  }

  deleteMenuItem(menuItemId: string): Promise<IMenuItem | null> {
    return MenuItemModel.findByIdAndDelete(menuItemId).exec();
  }

  deleteMenuByRestaurant(
    restaurantId: string,
  ): Promise<{ deletedCount: number }> {
    return MenuItemModel.deleteMany({ restaurantId }).exec();
  }

  setItemAvailable(menuItemId: string): Promise<IMenuItem | null> {
    return MenuItemModel.findByIdAndUpdate(
      menuItemId,
      { $set: { isAvailable: true } },
      { returnDocument: "after" },
    ).exec();
  }

  setItemUnavailable(menuItemId: string): Promise<IMenuItem | null> {
    return MenuItemModel.findByIdAndUpdate(
      menuItemId,
      { $set: { isAvailable: false } },
      { returnDocument: "after" },
    ).exec();
  }

  markItemPopular(menuItemId: string): Promise<IMenuItem | null> {
    return MenuItemModel.findByIdAndUpdate(
      menuItemId,
      { $set: { isPopular: true } },
      { returnDocument: "after" },
    ).exec();
  }

  removePopularFlag(menuItemId: string): Promise<IMenuItem | null> {
    return MenuItemModel.findByIdAndUpdate(
      menuItemId,
      { $set: { isPopular: false } },
      { returnDocument: "after" },
    ).exec();
  }

  getAvailableMenu(restaurantId: string): Promise<IMenuItem[]> {
    return MenuItemModel.find({
      restaurantId,
      isAvailable: true,
    }).exec();
  }
}
