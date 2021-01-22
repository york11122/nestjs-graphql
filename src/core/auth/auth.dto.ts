import { ObjectType, Field, InputType, Directive } from '@nestjs/graphql'
import { MinLength, MaxLength } from 'class-validator'

@InputType()
export class loginUserInput {
    @Field()
    account: string
    @Field()
    password: string
}

@ObjectType()
export class LoginResponse {
    @Field()
    accessToken: string
    @Field()
    refreshToken: string
}