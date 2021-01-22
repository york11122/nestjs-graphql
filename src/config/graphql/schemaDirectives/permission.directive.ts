import { SchemaDirectiveVisitor } from 'graphql-tools'
import { ForbiddenError, AuthenticationError } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'
import { GraphQLField, GraphQLEnumValue } from 'graphql'
import { UserType } from '@core/user/user.entity'

class PermissionDirective extends SchemaDirectiveVisitor {

    visitFieldDefinition (field: GraphQLField<any, any>) {
        const { resolve = defaultFieldResolver } = field
        const { type } = this.args

        field.resolve = async function (...args) {
            let result = await resolve.apply(this, args)
            const { currentUser } = args[2]
            if (!currentUser) {
                throw new AuthenticationError(
                    'Authentication token is invalid, please try again.'
                )
            }
            if (currentUser.type !== type) {
                throw new ForbiddenError(`You are not authorized for ${field.name}`)
            }

            return result
        }
    }
}

export default PermissionDirective
