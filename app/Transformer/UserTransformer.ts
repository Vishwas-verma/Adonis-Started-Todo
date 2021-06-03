import User from "App/Models/User";
import TodoTransformer from "App/Transformer/TodoTransformer";
import {isUndefined} from "util";
import Todo from "App/Models/Todo";
import {Dictionary} from "async";
import {TransformerAbstract} from "App/Transformer/TransformerAbstract";

export default class UserTransformer extends TransformerAbstract<User> {
  defaultIncludes = ['todos'];

  protected _map(model: User): Dictionary<any> {
    return {
      id: model.id,
      first_name: model.first_name,
      full_name: model.fullName,
      last_name: model.last_name,
      email: model.email,
      gender: model.email
    }
  }

  public async includeTodos(user: User): Promise<Dictionary<any>> {
    let todos: Todo[] = user.todos;
    if (isUndefined(todos)) {
      todos = await user.related('todos').query();
    }
    return new TodoTransformer().transformList(todos,['createdBy'])
  }
}
