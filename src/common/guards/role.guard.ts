import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User, UserType } from '@core/user/user.entity'
import { ForbiddenError, AuthenticationError } from 'apollo-server-express'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) { }

    canActivate (
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride<UserType[]>('role', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles) {
            return true;
        }
        const currentUser: User = GqlExecutionContext.create(context).getContext().currentUser;
        if (roles.some((role) => currentUser.type === role)) {
            return true
        };

        throw new ForbiddenError(
            `User does not have sufficient permissions to access`,
        );


    }
}