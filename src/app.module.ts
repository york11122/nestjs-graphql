import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { PressModule } from './core/press/press.module';
import { TypeOrmService } from '@config/typeorm'
import { GraphqlService } from '@config/graphql'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService
    }),
    GraphQLModule.forRootAsync({
      useClass: GraphqlService
    }),
    PressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
