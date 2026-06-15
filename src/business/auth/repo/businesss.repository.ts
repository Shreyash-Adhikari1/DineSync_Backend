import { Types } from "mongoose";
import { IBusiness, BusinessModel } from "../model/business.model";

export interface BusinessRepositoryInterface {
  getAllBusinesses(skip?: number, limit?: number): Promise<IBusiness[]>;
  getBusinessById(businessId: string): Promise<IBusiness | null>;
  getBusinessWithPassword(businessId: string): Promise<IBusiness | null>;
  getBusinessByEmail(email: string): Promise<IBusiness | null>;
  registerBusiness(user: Partial<IBusiness>): Promise<IBusiness>;
  updateBusiness(
    businessId: string,
    updatedData: Partial<IBusiness>,
  ): Promise<IBusiness | null>;

  deleteUser(businessId: string): Promise<IBusiness | null>;
}

export class BusinessRepository implements BusinessRepositoryInterface {
  getAllBusinesses(skip: number = 0, limit: number = 10): Promise<IBusiness[]> {
    return BusinessModel.find({ role: { $ne: "admin" } })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  getBusinessById(businessId: string): Promise<IBusiness | null> {
    return BusinessModel.findById(businessId).exec();
  }
  getBusinessWithPassword(businessId: string): Promise<IBusiness | null> {
    return BusinessModel.findById(businessId).select("+password").exec();
  }
  getBusinessByEmail(email: string): Promise<IBusiness | null> {
    return BusinessModel.findOne({ email }).exec();
  }

  registerBusiness(user: Partial<IBusiness>): Promise<IBusiness> {
    const newBusiness = new BusinessModel(user);
    return newBusiness.save();
  }

  updateBusiness(
    businessId: string,
    updatedData: Partial<IBusiness>,
  ): Promise<IBusiness | null> {
    return BusinessModel.findByIdAndUpdate(
      businessId,
      {
        $set: updatedData,
      },
      { returnDocument: "after" },
    ).exec();
  }

  deleteUser(businessId: string): Promise<IBusiness | null> {
    return BusinessModel.findByIdAndDelete(businessId);
  }
}
