import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Project from "App/Models/Project";
import { ProjectRoleEnum } from "Contracts/Enums/ProjectRoleEnum";
import ProjectTransformer from "App/Transformer/ProjectTransformer";

export default class ProjectsController {
    public async index({ response }: HttpContextContract) {
        const projects = await Project.query()
            .where("description", "LIKE", `%nd`)
            .preload("members", query => query.wherePivot("role", "project_leader").orWherePivot("role", "intern"))
            .preload("creator");
        return response.json(await new ProjectTransformer().transformList(projects, ["createdBy", "members"]));
    }

    public async create({}: HttpContextContract) {}

    public async store({ request, response }: HttpContextContract) {
        const validateData = await request.validate({
            schema: schema.create({
                name: schema.string(),
                description: schema.string.optional(),
                members: schema.array().members(
                    schema.object().members({
                        id: schema.number(),
                        role: schema.enum(Object.values(ProjectRoleEnum))
                    })
                )
            })
        });
        const project = await Project.create({
            name: validateData.name,
            description: validateData.description,
            createdBy: 1
        });
        for (const u of validateData.members) {
            await project.related("members").attach({
                [u.id]: {
                    role: u.role
                }
            });
        }
        await project.preload("creator");
        await project.preload("members", q => q.preload("todos").pivotColumns(["role"]));
        return response.json({ project });
    }

    public async show({}: HttpContextContract) {}

    public async edit({}: HttpContextContract) {}

    public async update({ request, params }: HttpContextContract) {
        const updateData = await request.validate({
            schema: schema.create({
                name: schema.string.optional(),
                description: schema.string.optional(),
                members: schema.array().members(
                    schema.object().members({
                        id: schema.number(),
                        role: schema.enum(Object.values(ProjectRoleEnum))
                    })
                )
            })
        });
        const project = await Project.findOrFail(params.id);

        const updatedProject = project.merge({ name: updateData.name, description: updateData.description });
        await project.related("members").detach();
        for (const u of updateData.members) {
            await project.related("members").attach({
                [u.id]: {
                    role: u.role
                }
            });
        }
        await updatedProject.preload("members", q => q.preload("todos"));
        return await updatedProject.save();
    }

    public async destroy({}: HttpContextContract) {}
}
