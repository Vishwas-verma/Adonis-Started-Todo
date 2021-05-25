import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Todo from "App/Models/Todo";
import TodoTransformer from "App/Transformer/TodoTransformer";
import {schema} from "@ioc:Adonis/Core/Validator";

export default class TodosController {
  public async indexTodos({request, response}: HttpContextContract) {
    const filters = request.qs(); // For input from query params
    const todoQuery = Todo.query().preload('creator')
    if (filters.query) todoQuery.where('title', 'LIKE', '%' + filters.query + '%')
    const todos = await todoQuery
    return response.json(await (new TodoTransformer().transformList(todos)))
  }

  public async createTodo({request, response, auth}: HttpContextContract) {
    const validateData = await request.validate({
      schema: schema.create({
        title: schema.string(),
      })
    })
    const todo = await Todo.create({...validateData, created_by: auth.user?.id});
    await todo.load('creator')
    return response.json(await (new TodoTransformer().transform(todo)))
  }

  public async updateTodo({request, response,params}: HttpContextContract) {

    const validateData = await request.validate({
      schema: schema.create({
        title: schema.string.optional(),
        is_created:schema.boolean.optional()
      })
    })
   await Todo
      .query()
      .where('id', request.params().id)
      .update(validateData)

    const todo = await Todo.findBy('id', +params.id);
    await todo?.preload('creator');

     return response.json(await (new TodoTransformer().transform(<Todo>todo)))
  }
}
