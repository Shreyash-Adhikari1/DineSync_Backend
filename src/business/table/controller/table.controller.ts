import { Request, Response } from "express";
import { TableService } from "../service/table.service";
import { CreateTableDTO, EditTableDTO } from "../dto/table.dto";

const tableService = new TableService();

export class TableController {
  createTable = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      if (!ownerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { restaurantId } = req.params;

      const parsed = CreateTableDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid Table Data",
        });
      }

      const table = await tableService.createTable(
        ownerId,
        restaurantId as string,
        parsed.data,
      );

      return res.status(201).json({
        success: true,
        message: "Table Created Successfully",
        table,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getRestaurantTables = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { restaurantId } = req.params;

      const tables = await tableService.getRestaurantTables(
        ownerId,
        restaurantId as string,
      );

      return res.status(200).json({
        success: true,
        tables,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  updateTable = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { tableId } = req.params;

      const parsed = EditTableDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid Update Data",
        });
      }

      const table = await tableService.updateTable(
        ownerId,
        tableId as string,
        parsed.data,
      );

      return res.status(200).json({
        success: true,
        message: "Table Updated Successfully",
        table,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  deleteTable = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { tableId } = req.params;

      const result = await tableService.deleteTable(ownerId, tableId as string);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  toggleTableActive = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { restaurantId, tableId } = req.params;

      const table = await tableService.toggleTableActive(
        ownerId,
        restaurantId as string,
        tableId as string,
      );

      return res.status(200).json({
        success: true,
        message: "Table Status Updated",
        table,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
}
