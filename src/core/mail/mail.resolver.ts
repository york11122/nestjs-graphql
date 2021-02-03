import { Resolver, Query, Mutation, Args, Directive, Context } from '@nestjs/graphql';
import { sendEmailResponse, sendEmailInput } from "./mail.dto";
import { User } from "@core/user/user.entity";
import { MailService } from "./mail.service";
import { UseGuards } from '@nestjs/common'
import { JWTAuthGuard } from '@common'

@Resolver('Mail')
export class MailResolver {
    constructor(private readonly mailService: MailService) { }

    @UseGuards(JWTAuthGuard)
    @Mutation(() => sendEmailResponse)
    async sendVerifyEmail (@Args('input') input: sendEmailInput, @Context('currentUser') currentUser: User): Promise<typeof sendEmailResponse> {
        let { email } = input
        return await this.mailService.sendVerifyEmail(email, currentUser)
    }

    @Mutation(() => sendEmailResponse)
    async sendForgetPasswordEmail (@Args('input') input: sendEmailInput): Promise<typeof sendEmailResponse> {
        let { email } = input
        return await this.mailService.sendForgetPasswordEmail(email)
    }

}
