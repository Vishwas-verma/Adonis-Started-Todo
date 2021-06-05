import UserTransformer from "App/Transformer/UserTransformer";
import { isUndefined } from "util";
import User from "App/Models/User";
import { TransformerAbstract } from "App/Transformer/TransformerAbstract";
import { Dictionary } from "async";
import Project from "App/Models/Project";

export default class ProjectTransformer extends TransformerAbstract<Project> {
    protected _map(model: Project): Dictionary<any> {
        return {
            id: model.id,
            name: model.name,
            description: model.description,
            created_by: model.createdBy
        };
    }

    async includeMembers(model: Project): Promise<Dictionary<any>> {
        let users: User[] = model.members;
        if (isUndefined(users)) {
            users = await model.related("members").query();
        }
        return new UserTransformer().transformList(users);
    }

    async includeCreatedBy(model: Project): Promise<Dictionary<any>> {
        let creator: User = model.creator;

        if (!model.createdBy) {
            return null;
        }

        if (isUndefined(creator)) {
            creator = (await model.$getRelated("creator")) as User;
        }

        if (!creator) {
            return null;
        }
        return new UserTransformer().transform(creator);
    }
}
