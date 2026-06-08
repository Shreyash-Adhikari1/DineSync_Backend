import QRCode from "qrcode";
import { nanoid } from "nanoid";
import { HttpError } from "../../../errors/http-error";
import { TableRepository } from "../repo/table.repository";
import { CreateTableDTO, EditTableDTO } from "../dto/table.dto";
import { ITable } from "../model/table.model";
import { RestaurantRepository } from "../../restaurant/repository/restaurant.repository";
import dotenv from "dotenv";

const restaurantRepo = new RestaurantRepository();
const tableRepo = new TableRepository();

dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL as string;
export class TableService {
  async createTable(
    ownerId: string,
    restaurantId: string,
    data: CreateTableDTO,
  ): Promise<ITable> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );

    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }

    const totalTables = await tableRepo.countRestaurantTables(restaurantId);
    const nextTableNumber = totalTables + 1;
    const qrToken = nanoid(10);
    const joinUrl = `${CLIENT_URL}/join/${qrToken}`;
    const qrCode = await QRCode.toDataURL(joinUrl);

    const tableToCreate = {
      restaurantId: restaurant._id,
      tableNumber: nextTableNumber,
      tableName: data.tableName,
      tableCapacity: data.tableCapacity,
      qrToken,
      qrCode,
    };

    const newTable = await tableRepo.createTable(tableToCreate);

    return newTable;
  }

  async getRestaurantTables(
    ownerId: string,
    restaurantId: string,
  ): Promise<ITable[]> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );

    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }

    return tableRepo.findTableByRestaurant(restaurantId);
  }

  async updateTable(
    ownerId: string,
    tableId: string,
    updateData: EditTableDTO,
  ): Promise<ITable> {
    const table = await tableRepo.findTableById(tableId);

    if (!table) {
      throw new HttpError(404, "Table Not Found");
    }

    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      table.restaurantId.toString(),
    );

    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }

    const updatedTable = await tableRepo.updateTable(tableId, updateData);

    if (!updatedTable) {
      throw new HttpError(400, "Failed To Update Table");
    }

    return updatedTable;
  }

  async deleteTable(
    ownerId: string,
    tableId: string,
  ): Promise<{ message: string }> {
    const deleteTable = await tableRepo.deleteTableById(tableId);
    if (!deleteTable) {
      throw new HttpError(400, "Failed To Delete Table");
    }

    return {
      message: "Table Deleted Successfully",
    };
  }

  async toggleTableActive(
    ownerId: string,
    restaurantId: string,
    tableId: string,
  ): Promise<ITable> {
    const table = await tableRepo.findTableById(tableId);

    if (!table) {
      throw new HttpError(404, "Table Not Found");
    }

    if (table.isActive) {
      const inactive = await tableRepo.setTableInactive(tableId);

      if (!inactive) {
        throw new HttpError(400, "Failed To Deactivate Table");
      }

      return inactive;
    }

    const active = await tableRepo.setTableActive(tableId);

    if (!active) {
      throw new HttpError(400, "Failed To Activate Table");
    }

    return active;
  }
}
