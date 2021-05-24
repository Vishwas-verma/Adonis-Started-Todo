import {TransformerAbstract} from '@ioc:Adonis/Addons/Bumblebee'
import User from "App/Models/User";

export default class UserTransformer extends TransformerAbstract {
  public transform(model:User) {
    return {
      id: model.id,
      full_name: model.first_name,
      email: model.email,
      gender: model.email
    }
  }
}
