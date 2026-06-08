import { Request, Response } from "express";
import { BusinessService } from "../service/business.service";
import { LoginBusinessDTO, RegisterBusinessDTO } from "../dto/business.dto";

const businessService = new BusinessService();

export class BusinessController {
  // registration controller

  registerBusiness = async (req: Request, res: Response) => {
    try {
      console.log("Starting registration proces");

      const registerDetailsParsed = RegisterBusinessDTO.safeParse(req.body);
      console.log(registerDetailsParsed);

      if (!registerDetailsParsed.success) {
        return res
          .status(400)
          .json({ success: false, message: "Registration Failed" });
      }

      const business = await businessService.createBusiness(
        registerDetailsParsed.data,
      );

      console.log("Registration for business successful: ", business);

      return res.status(200).json({
        success: true,
        message: "Business Registration Successfull",
        business: business,
      });
    } catch (error: any) {
      // Handling unknown errors
      return res.status(500).json({
        success: false,
        message: error.message || "Business Registration Failed",
      });
    }
  };

  businessLogin = async (req: Request, res: Response) => {
    const loginDetailsParsed = LoginBusinessDTO.safeParse(req.body);

    try {
      if (!loginDetailsParsed.success) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }

      const { email, password } = loginDetailsParsed.data;

      const loginResult = await businessService.loginUser(email, password);

      return res.status(201).json({
        success: true,
        message: "Login Successful",
        token: loginResult.token,
        business: loginResult.business,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Business Login Failed",
      });
    }
  };
}
