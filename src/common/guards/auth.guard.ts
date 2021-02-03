import {
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '@core/user/user.service';
import { verifyToken } from '@utils/auth/jwt'
import { ACCESS_TOKEN } from '@environment'
import {
    AuthenticationError
} from 'apollo-server-express'

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {

    constructor(private readonly userService: UserService) {
        super()
    }

    getRequest (context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    async canActivate (context: ExecutionContext): Promise<boolean> {
        const req = this.getRequest(context);
        const ctx = GqlExecutionContext.create(context);
        const token = req.headers[ACCESS_TOKEN] as string || '';
        let data = await verifyToken(token, 'accessToken')
        let currentUser = await this.userService.findUserByID(data._id)
        if (currentUser) {
            ctx.getContext().currentUser = currentUser;
            return true;
        }

        throw new AuthenticationError(
            'Invalid token.'
        )
    }
}