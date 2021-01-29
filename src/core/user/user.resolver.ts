import { Resolver, Query, Mutation, Args, Directive, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserType } from './user.entity'
import { createUserInput, UserResponse, createUserResponse } from "./user.dto";
import { awaitWrap } from '@common'
import { UseGuards } from '@nestjs/common'
import { JWTAuthGuard, RolesGuard } from '@common'
import { Role } from "../../common/decorators/role.decorator";
@Resolver('User')
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @UseGuards(JWTAuthGuard)
    @Query(() => UserResponse, { description: "Current user infomation【need login access-token】" })
    async me (@Context('currentUser') currentUser: User): Promise<UserResponse> {
        console.log('eeee')
        return currentUser
    }

    @Mutation(() => createUserResponse)
    async createUser (@Args('input') input: createUserInput): Promise<typeof createUserResponse> {
        let { account, password, name } = input
        return await this.userService.createUser(account, password, name)
    }
}