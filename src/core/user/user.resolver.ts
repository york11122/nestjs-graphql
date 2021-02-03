import { Resolver, Query, Mutation, Args, Directive, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserType } from './user.entity'
import { createUserInput, UserResponse, createUserResponse, verifyEmailResponse, resetPasswordResponse, resetPasswordInput } from "./user.dto";
import { awaitWrap } from '@common'
import { UseGuards } from '@nestjs/common'
import { JWTAuthGuard } from '@common'
@Resolver('User')
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @UseGuards(JWTAuthGuard)
    @Query(() => UserResponse, { description: "Current user infomation【need login access-token】" })
    async me (@Context('currentUser') currentUser: User): Promise<UserResponse> {
        return currentUser
    }

    @Mutation(() => createUserResponse)
    async createUser (@Args('input') input: createUserInput): Promise<typeof createUserResponse> {
        let { account, password, name } = input
        return await this.userService.createUser(account, password, name)
    }

    @Mutation(() => verifyEmailResponse)
    async verifyEmail (@Args('token') token: string): Promise<typeof verifyEmailResponse> {
        return await this.userService.verifyEmail(token)
    }

    @Mutation(() => resetPasswordResponse)
    async resetPassword (@Args('input') input: resetPasswordInput): Promise<typeof resetPasswordResponse> {
        const { token, newPassword } = input
        return await this.userService.resetPassword(token, newPassword)
    }
}