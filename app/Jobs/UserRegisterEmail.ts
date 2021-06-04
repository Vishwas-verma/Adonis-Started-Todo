import {JobContract} from '@ioc:Rocketseat/Bull'
import Mail from "@ioc:Adonis/Addons/Mail";
import logger from "@ioc:Adonis/Core/Logger";

export default class UserRegisterEmail implements JobContract {
  public key = 'UserRegisterEmail'

  public async handle(UserRegisterEmail) {
    const {user} = UserRegisterEmail
    try {
      logger.debug("[SendRegisterEmailJob] was executed");
      const res=await Mail.use('smtp').send((message) => {
        message.to("vermavarun932@gmail.com").from("Peter@adonis.com").subject('Welcome To Team!')
          .htmlView(`user_registered`,{user})// Probably we will fetch email from user
      }, {
        transaction: true,
        openTracking: false,
      })
      console.log(res);
    } catch (e) {
      logger.error(`[SendRegisterEmailJob] failed for User Id: ${user.id}`, e);
    }
  }
}
