import { RegisterBusinessDTO } from "../dto/business.dto";
import { IBusiness } from "../model/business.model";
import {
  BusinessRepository,
  BusinessRepositoryInterface,
} from "../repo/businesss.repository";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const businessRepository: BusinessRepositoryInterface =
  new BusinessRepository();
dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL as string;

export class BusinessService {
  // doing this because we dont want password going everywhere
  private sanitizeUser(business: IBusiness) {
    const businessObj = business.toObject();
    const { password, __v, ...safeBusiness } = businessObj; // here __v is version key [mongoose generates it automatically]
    return safeBusiness;
  }

  // create user  [for registration]

  async createBusiness(data: RegisterBusinessDTO) {
    const existingBusiness = await businessRepository.getBusinessByEmail(
      data.email,
    );

    if (existingBusiness) {
      throw new Error("Business with this email already exists");
    }

    // Hash password for security reasons
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const businessToCreate = {
      businessName: data.businessName,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      phoneNumber: data.phoneNumber,
      address: data.address,
    };

    const business =
      await businessRepository.registerBusiness(businessToCreate);
    return this.sanitizeUser(business);
  }

  //  Business Login
  async loginUser(email: string, password: string) {
    const business = await businessRepository.getBusinessByEmail(email);

    if (!business) {
      throw new Error("Invalid credentials");
    }

    // Because password has select:false [done in model || cant access directly], we must explicitly select it
    const businessWithPassword =
      await businessRepository.getBusinessWithPassword(business._id.toString());
    if (!businessWithPassword) {
      throw new Error("Authentication failed");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      businessWithPassword.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // token geneation after login
    const token = jwt.sign(
      {
        id: business._id.toString(), // .toString() done because JWT payload should be JSON-serializable
        role: business.role,
      },
      process.env.JWT_SECRET_TOKEN!,
      { expiresIn: "10d" },
    );

    const safeBusiness = this.sanitizeUser(business);

    return { token, business: safeBusiness };
  }
}
