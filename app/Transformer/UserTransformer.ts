import User from "App/Models/User";
import TodoTransformer from "App/Transformer/TodoTransformer";
import {isUndefined} from "util";
import Todo from "App/Models/Todo";
import {Dictionary} from "async";
import TransformerAbstract from "App/Transformer/TransformerAbstract";

export default class UserTransformer extends TransformerAbstract<User> {
  constructor() {
    super();
  }
  protected defaultIncludes = ['todos'];
 //  protected availableIncludes = ['todos'];

  protected async transform(model: any): Dictionary<any> {
    return {
      id: model.id,
      first_name: model.first_name,
      last_name: model.last_name,
      ...this.getTransformedTimeStamps(model),
    }
  }

  public async includeTodos(user: User): Promise<Dictionary<any>> {
    let todos: Todo[] = user.todos;
    if (isUndefined(todos)) {
      todos = await user.related('todos').query();
    }
    return await new TodoTransformer().transformCollection(todos)
  }
}
