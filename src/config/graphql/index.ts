import { Injectable, Logger } from '@nestjs/common'
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql'
import { AuthenticationError, ForbiddenError } from 'apollo-server-core'
import schemaDirectives from '@schemaDirectives'
import { MemcachedCache } from 'apollo-server-cache-memcached'
import { END_POINT, NODE_ENV, GRAPHQL_DEPTH_LIMIT } from '@environment'
import * as depthLimit from 'graphql-depth-limit'
import { join } from 'path';
import { UserService } from "@core/user/user.service"

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
    constructor(private readonly userService: UserService) { }
    async createGqlOptions (): Promise<GqlModuleOptions> {
        return {
            fieldResolverEnhancers: ['guards'],
            autoSchemaFile: join(process.cwd(), 'src/typeDefs/schema.gql'),

            resolverValidationOptions: {
                requireResolversForResolveType: false
            },
            path: `/${END_POINT!}`,
            cors: true,
            bodyParserConfig: { limit: '50mb' },
            schemaDirectives,
            introspection: true,
            playground: NODE_ENV !== 'production' && {
                settings: {
                    'editor.cursorShape': 'underline', // possible values: 'line', 'block', 'underline'
                    'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
                    'editor.fontSize': 14,
                    'editor.reuseHeaders': true, // new tab reuses headers from last tab
                    'editor.theme': 'dark', // possible values: 'dark', 'light'
                    'general.betaUpdates': true,
                    'queryPlan.hideQueryPlanResponse': false,
                    'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
                    'tracing.hideTracingResponse': false
                }
                // tabs: [
                // 	{
                // 		endpoint: END_POINT,
                // 		query: '{ hello }'
                // 	}
                // ]
            },
            // tracing: NODE_ENV !== 'production',
            cacheControl: NODE_ENV === 'production' && {
                defaultMaxAge: 5,
                stripFormattedExtensions: false,
                calculateHttpHeaders: false
            },
            validationRules: [
                depthLimit(
                    GRAPHQL_DEPTH_LIMIT!,
                    { ignore: [/_trusted$/, 'idontcare'] },
                    depths => {
                        if (depths[''] === GRAPHQL_DEPTH_LIMIT! - 1) {
                            Logger.warn(
                                `⚠️  You can only descend ${GRAPHQL_DEPTH_LIMIT!} levels.`,
                                'GraphQL',
                                false
                            )
                        }
                    }
                )
            ],
            // plugins: [responseCachePlugin()],
            context: async ({ req, res, connection }) => {
                return {
                    req,
                    res,
                }
            },
            formatError: error => {
                if (error.originalError instanceof AuthenticationError) {
                    error.message = `Authentication Error: ${error.message}`
                }

                if (error.originalError instanceof ForbiddenError) {
                    error.message = `Authorization Error: ${error.message}`
                }
                return {
                    message: error.message,
                    code: error.extensions && error.extensions.code,
                    locations: error.locations,
                    path: error.path
                }
            },
            formatResponse: response => {
                return response
            },

            persistedQueries: {
                cache: new MemcachedCache(
                    ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
                    { retries: 10, retry: 10000 } // Options
                )
            }
        }
    }
}
