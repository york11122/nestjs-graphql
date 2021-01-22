import { Resolver, Query, Mutation, Args, Directive, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserType } from './user.entity'
import { createUserInput, UserResponse } from "./user.dto";
import { awaitWrap } from '@common'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../../common/guards/auth.guard'

@Resolver('User')
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => UserResponse, { description: "Current user infomation【need login access-token】" })
    async me (@Context('currentUser') currentUser: User): Promise<UserResponse> {
        return currentUser
    }

    @Mutation(() => User)
    async createUser (@Args('input') input: createUserInput): Promise<User> {
        let { account, password, name } = input
        return await this.userService.createUser(account, password, name)
    }
}