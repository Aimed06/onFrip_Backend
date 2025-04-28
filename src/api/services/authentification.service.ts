import { User } from "../entities/User.entity";
import { SecretCode } from "../entities/SecretCode.entity";
import { UserService } from "./users.service";
import { JwtService } from "../../config/jwt";
import { EmailService } from "../externals/EmailService";
import dayjs from "dayjs";

const axios = require("axios");

export class UserAuthentificationService {
  public static async sendSecretCode(email: string) {
    const user = await User.findOne({ where: { email } });
    const isRegistred = user ? true : false;

    // Générer un code OTP à 4 chiffres
    const secretCode = new SecretCode();
    secretCode.code = Math.floor(1000 + Math.random() * 9000);

    if (user) {
      await EmailService.sendLoginEmail(
        email,
        {
          code: secretCode.code,
          firstName: user.firstName,
          lastName: user.firstName,
        },
        secretCode.code
      );
    } else {
      await EmailService.sendRegistrationEmail(email, secretCode.code);
    }

    // Enregsitrer le code dans la base de donnée
    secretCode.email = email;
    await secretCode.save();

    return { isRegistred };
  }

  public static async login(email: string, code: number) {
    const secretCode = await SecretCode.findOneBy({ email, code });
    if (!secretCode) throw new Error("Code invalide");

    const isExpired = dayjs(secretCode.createdAt).add(5, "minute").isBefore(dayjs());
    if (isExpired) throw new Error("Expired code");

    const user = await User.findOne({ where: { email } });
    const isRegistred = user ? true : false;

    const token = user ? JwtService.generateAuthToken(user) : JwtService.generateRegistrationToken(email);

    return {
      token,
      isRegistred,
      user,
    };
  }

  public static async googleAuth(access_token: string) {
    // Verify the access token
    const userResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userDetails = userResponse.data;
    if (userResponse.status !== 200) throw new Error("Failed to verify access token");

    let user = await User.findOne({ where: { email: userDetails.email } });
    const isRegistred = user ? true : false;

    const token = user ? JwtService.generateAuthToken(user) : JwtService.generateRegistrationToken(userDetails.email);

    return {
      token,
      isRegistred,
      user,
      userDetails: {
        email: userDetails.email,
        firstName: userDetails.given_name,
        lastName: userDetails.family_name,
      },
    };
  }

  public static async register(registrationToken: string, userData: any) {
    const isValidToken = JwtService.verifyRegistrationToken(registrationToken);
    if (!isValidToken) throw new Error("Invalid error");

    const user = await UserService.create({
      ...userData,
      email: isValidToken.email,
    });
    if (!user) throw new Error("erreur lors de la création");

    const authToken = JwtService.generateAuthToken(user);

    return {
      user,
      authToken,
    };
  }
}
