import { ITable, TableModel } from "../model/table.model";

export interface TableRepositoryInterface {
  createTable(table: Partial<ITable>): Promise<ITable>;
  updateTable(
    tableId: string,
    updateData: Partial<ITable>,
  ): Promise<ITable | null>;
  findTableById(tableId: string): Promise<ITable | null>;
  findTableByQrToken(token: string): Promise<ITable | null>;
  findTableByRestaurant(
    restaurantId: string,
    skip?: number,
    limit?: number,
  ): Promise<ITable[]>;
  findByRestaurantAndTableNumber(
    restaurantId: string,
    tableNumber: number,
  ): Promise<ITable | null>;

  deleteTableById(tableId: string): Promise<ITable | null>;

  countRestaurantTables(restaurantId: string): Promise<number>;

  setTableActive(tableId: string): Promise<ITable | null>;
  setTableInactive(tableId: string): Promise<ITable | null>;

  markTableReserved(tableId: string): Promise<ITable | null>;
  removeReservation(tableId: string): Promise<ITable | null>;
}

export class TableRepository implements TableRepositoryInterface {
  createTable(table: Partial<ITable>): Promise<ITable> {
    const newTable = new TableModel(table);
    return newTable.save();
  }

  updateTable(
    tableId: string,
    updateData: Partial<ITable>,
  ): Promise<ITable | null> {
    return TableModel.findByIdAndUpdate(tableId, updateData, {
      returnDocument: "after",
    }).exec();
  }

  //  Get Operations
  findTableById(tableId: string): Promise<ITable | null> {
    return TableModel.findById(tableId).exec();
  }

  findTableByQrToken(token: string): Promise<ITable | null> {
    return TableModel.findOne({ qrToken: token }).exec();
  }

  findTableByRestaurant(
    restaurantId: string,
    skip = 0,
    limit = 10,
  ): Promise<ITable[]> {
    return TableModel.find({
      restaurantId,
    })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  findByRestaurantAndTableNumber(
    restaurantId: string,
    tableNumber: number,
  ): Promise<ITable | null> {
    return TableModel.findOne({
      restaurantId,
      tableNumber,
    }).exec();
  }

  // Delete
  deleteTableById(tableId: string): Promise<ITable | null> {
    return TableModel.findByIdAndDelete(tableId).exec();
  }

  // Misc Methods
  countRestaurantTables(restaurantId: string): Promise<number> {
    return TableModel.countDocuments({
      restaurantId,
    }).exec();
  }

  setTableActive(tableId: string): Promise<ITable | null> {
    return TableModel.findByIdAndUpdate(
      tableId,
      { $set: { isActive: true } },
      { returnDocument: "after" },
    ).exec();
  }
  setTableInactive(tableId: string): Promise<ITable | null> {
    return TableModel.findByIdAndUpdate(
      tableId,
      { $set: { isActive: false } },
      { returnDocument: "after" },
    ).exec();
  }
  markTableReserved(tableId: string): Promise<ITable | null> {
    return TableModel.findByIdAndUpdate(
      tableId,
      { $set: { isReserved: true } },
      { returnDocument: "after" },
    ).exec();
  }
  removeReservation(tableId: string): Promise<ITable | null> {
    return TableModel.findByIdAndUpdate(
      tableId,
      { $set: { isReserved: false } },
      { returnDocument: "after" },
    ).exec();
  }
}
