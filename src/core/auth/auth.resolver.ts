import { Resolver, Query, Mutation, Args, Directive, Context } from '@nestjs/graphql';
import { AuthService } from '@core/auth/auth.service';
import { LoginResponse, loginUserInput } from '@core/auth/auth.dto'
import { awaitWrap } from '@common'

@Resolver('Auth')
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => LoginResponse, { description: "帳號登入" })
    async login (@Args('input') input: loginUserInput): Promise<LoginResponse> {
        let { account, password } = input
        return await this.authService.login(account, password)
    }

    @Mutation(() => LoginResponse, { description: "Line登入, 未註冊則自動建立帳號" })
    async oauthLine (@Args('token') token: string, @Context() context: any): Promise<LoginResponse> {
        const { req, res } = context
        req.body = {
            ...req.body,
            access_token: token
        }
        return await this.authService.oauthLine(req, res)
    }

    @Mutation(() => LoginResponse, { description: "Faceboook登入, 未註冊則自動建立帳號" })
    async oauthFacebook (@Args('token') token: string, @Context() context: any): Promise<LoginResponse> {
        const { req, res } = context
        req.body = {
            ...req.body,
            access_token: token
        }
        return await this.authService.oauthFacebook(req, res)
    }

    @Mutation(() => LoginResponse, { description: "google登入, 未註冊則自動建立帳號" })
    async oauthGoogle (@Args('token') token: string, @Context() context: any): Promise<LoginResponse> {
        const { req, res } = context
        req.body = {
            ...req.body,
            access_token: token
        }
        return await this.authService.oauthGoogle(req, res)
    }
}