import Route from "@ioc:Adonis/Core/Route";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";

Route.get("health", async ({ response }) => {
    const report = await HealthCheck.getReport();

    return report.healthy ? response.ok(report) : response.badRequest(report);
}); // Route for checking health before deploying to production

Route.get("/test", async ({ response }: HttpContextContract) => {
    return response.json({
        success: "You Did It"
    });
});
Route.post("/signup", "AuthController.signup");
Route.post("/login", "AuthController.login");
Route.post("/logout", "AuthController.logout");

Route.get("/index-users", "UsersController.indexUsers");
//
// Route.get("/index-todos", 'TodosController.indexTodos')
// Route.post("/create", 'TodosController.createTodo').middleware('auth')
// Route.put("/update/:id", 'TodosController.updateTodo').middleware('auth')

Route.resource("todos", "TodosController")
    .only(["index", "store", "update", "destroy"])
    .middleware({ "*": ["auth"] });

Route.resource("projects", "ProjectsController").apiOnly();
