import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Todo from "App/Models/Todo";
import TodoTransformer from "App/Transformer/TodoTransformer";

export default class TodosController {
  public async indexTodos({request, response}: HttpContextContract) {
    const filters = request.qs(); // For input from query params
    const todoQuery = Todo.query().preload('creator')
    if (filters.query) todoQuery.where('title', 'LIKE', '%' + filters.query + '%')
    const todos = await todoQuery

    return response.json(await (new TodoTransformer().transformList(todos)))
  }
}
