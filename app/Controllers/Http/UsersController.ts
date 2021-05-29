import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserTransformer from "App/Transformer/UserTransformer";


export default class UsersController {
  public async indexUsers({request, response}: HttpContextContract) {
    const filters = request.qs(); // For input from query params
    const userQuery = User.query().preload('todos')
    if (filters.gender) userQuery.where('gender', filters.gender)

    const users = await userQuery
    return response.json(await (new UserTransformer().transformCollection(users,{include:'todos'})))
  }
}
