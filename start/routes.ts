import Route from '@ioc:Adonis/Core/Route'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

Route.get("/test", async ({response}: HttpContextContract) => {
  return response.json({
    "success": "You Did It"
  });
});
Route.post('/signup', 'AuthController.signup')
Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout')

Route.get("/index-users", 'UsersController.indexUsers')

Route.get("/index-todos", 'TodosController.indexTodos')
Route.post("/create", 'TodosController.createTodo').middleware('auth')
