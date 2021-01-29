import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql'
import { ForbiddenError, AuthenticationError } from 'apollo-server-express'

export const roleMiddleware: FieldMiddleware = async (
    ctx: MiddlewareContext,
    next: NextFn,
) => {
    const { info, context } = ctx;
    const { extensions } = info.parentType.getFields()[info.fieldName];
    const currentUser = context["currentUser"]
    if (!currentUser) {
        throw new AuthenticationError(
            'Authentication token is invalid, please try again.'
        )
    }
    if (currentUser.type !== extensions.type) {
        throw new ForbiddenError(
            `User does not have sufficient permissions to access "${info.fieldName}" field.`,
        );
    }
    return next();
};