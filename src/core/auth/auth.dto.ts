import { ObjectType, Field, InputType, Directive, createUnionType } from '@nestjs/graphql'
import { MinLength, MaxLength } from 'class-validator'
import { UserResponse } from '@core/user/user.dto'
@InputType()
export class loginUserInput {
    @Field()
    account: string
    @Field()
    password: string
}

@ObjectType()
export class AuthTokens {
    @Field()
    accessToken: string
    @Field()
    refreshToken: string
}

export const LoginResponse = createUnionType({
    name: 'LoginResponse',
    types: () => [AuthTokens, LoginError],
    resolveType (value) {
        if (value.message) {
            return LoginError;
        }
        return AuthTokens;
    },
});

@ObjectType()
export class LoginError {
    @Field()
    message: string
}