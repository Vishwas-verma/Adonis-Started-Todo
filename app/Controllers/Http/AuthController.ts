import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import {loginSchema} from "../../../schema/login.schema";
import UserTransformer from "App/Transformer/UserTransformer";
import {signupSchema} from "../../../schema/signup.schema";
import UserNotFoundException from "App/Exceptions/UserNotFoundException";

export default class AuthController {
  public async signup({request, response}: HttpContextContract) {
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
      return response.json({
        user: await (new UserTransformer()).transform(user),
      })
  }

  public async login({request, auth, response}: HttpContextContract) {
    const user = await User.query().preload('todos').where('email',request.body().email).firstOrFail();
    if(!user) {
      throw new UserNotFoundException();
    }
    try {
      const validatedData = await request.validate({
        schema: loginSchema
      })
      const token = await auth.attempt(validatedData.email, validatedData.password)
      return response.json({
        token: token,
        user: await (new UserTransformer().transform(user))
      })
    } catch (e) {
      response.badRequest(e)
    }
  }

  public async logout({auth, response}: HttpContextContract) {
    await auth.logout()
    return response.status(200).json({data: "success"})
  }
}
