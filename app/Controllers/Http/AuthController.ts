import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {signupSchema} from "../../../schema/signup.schema";
import User from "App/Models/User";

export default class AuthController {
  public async signup({request, response}: HttpContextContract) {
    try {
      const inputData = await request.validate({
        schema: signupSchema
      })
      const user = new User();
      user.first_name = inputData.first_name;
      user.last_name = inputData.last_name as string;
      user.email = inputData.email;
      user.gender = inputData.gender;
      user.phone_number = inputData.phone_number as number;
      user.password = inputData.password;
      await user.save();
      return response.status(200).json({data: user});
    } catch (e) {
      response.badRequest(e.message)
    }
  }

  // public async login({ request, auth, response }: HttpContextContract) {
  //   const req = await request.validate({
  //     schema: schema.create({
  //       email: schema.string({}, [rules.email()]),
  //       password: schema.string({}, [rules.minLength(8)]),
  //     }),
  //     messages: {
  //       "email.required": "Email field is required",
  //       "password.required": "Password field is required",
  //       "password.minLength": "Password must be at least 8 characters",
  //     },
  //   });
  //
  //   const email = req.email
  //   const password = req.password
  //   const user = await auth.attempt(email, password)
  //
  //   return response.redirect(`/${user.username}`)
  // }
  //
  // public async logout({ auth, response }: HttpContextContract) {
  //   await auth.logout()
  //   return response.redirect('/')
  // }
}
