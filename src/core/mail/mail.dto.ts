import { ObjectType, Field, InputType, Directive, createUnionType } from '@nestjs/graphql'
import { MinLength, MaxLength, IsEmail } from 'class-validator'

@InputType()
export class sendEmailInput {
    @Field()
    @IsEmail()
    email: string
}

export const sendEmailResponse = createUnionType({
    name: 'sendEmailResponse',
    types: () => [EmailResponse, sendEmailError],
    resolveType (value) {
        if (value.message) {
            return sendEmailError;
        }
        return EmailResponse;
    },
});

@ObjectType()
export class sendEmailError {
    @Field()
    message: string
}

@ObjectType()
export class EmailResponse {
    @Field()
    email: string
}