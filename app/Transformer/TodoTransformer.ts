import Todo from "App/Models/Todo";
import UserTransformer from "App/Transformer/UserTransformer";
import { isUndefined } from "util";
import User from "App/Models/User";
import { TransformerAbstract } from "App/Transformer/TransformerAbstract";
import { Dictionary } from "async";

export default class TodoTransformer extends TransformerAbstract<Todo> {
    protected _map(model: Todo): Dictionary<any> {
        return {
            id: model.id,
            title: model.title,
            is_created: model.is_created,
            created_by: model.created_by
        };
    }

    async includeCreatedBy(model: Todo): Promise<Dictionary<any>> {
        let creator: User = model.creator;

        if (!model.created_by) {
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
