import { JobContract } from "@ioc:Rocketseat/Bull";
import Mail from "@ioc:Adonis/Addons/Mail";
import logger from "@ioc:Adonis/Core/Logger";

export default class UserRegisterEmail implements JobContract {
    public key = "UserRegisterEmail";

    public async handle(UserRegisterEmail) {
        const { data } = UserRegisterEmail; //Cannot use user here as it is not recognized default to data;
        try {
            logger.info("[SendRegisterEmailJob] was executed");
            await Mail.use("smtp").send(
                message => {
                    message.to("vermavarun932@gmail.com").from("Peter@adonis.com").subject("Welcome To Team!").htmlView("user_registered", { data }); // Probably we will fetch email from user
                },
                {
                    transaction: true,
                    openTracking: false
                }
            );
        } catch (e) {
            logger.error(`[SendRegisterEmailJob] failed for User Id: ${data.id}`, e);
        }
    }
}
