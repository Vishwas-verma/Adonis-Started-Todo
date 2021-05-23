import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {signupSchema} from "../../../schema/signup.schema";
import User from "App/Models/User";
import {loginSchema} from "../../../schema/login.schema";

export default class AuthController {
  public async signup({request, response}: HttpContextContract) {
    try {
      const inputData = await request.validate({
        schema: signupSchema
      })

      // One way to create user

      // const user = new User();
      // user.first_name = inputData.first_name;
      // user.last_name = inputData.last_name as string;
      // user.email = inputData.email;
      // user.gender = inputData.gender;
      // user.phone_number = inputData.phone_number as number;
      // user.password = inputData.password;
      // await user.save();

      // Other way using inbuilt function
      const user = await User.create(inputData)

      return response.status(201).json({data: user});
    } catch (e) {
      response.badRequest(e.message)
    }
  }

  public async login({request, auth, response}: HttpContextContract) {
    try {
      const validatedData = await request.validate({
        schema: loginSchema
      })
      const user = await auth.attempt(validatedData.email, validatedData.password)
      return response.status(200).json(user);
    } catch (e) {
      response.badRequest(e.message)
    }
  }

  public async logout({auth, response}: HttpContextContract) {
    await auth.logout()
    return response.status(200).json({data: "success"})
  }
}
