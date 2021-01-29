import {
    ArgumentsHost,
    Catch,
    HttpException
} from '@nestjs/common'
import { GqlExceptionFilter, GqlArgumentsHost, } from "@nestjs/graphql";
import {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError
} from 'apollo-server-core'
@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
    catch (exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        console.log(exception.message)
        if (exception instanceof ForbiddenError) {
        }

        return exception;
    }
}
