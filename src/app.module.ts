import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmService } from '@config/typeorm'
import { GraphqlService } from '@config/graphql'
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { MailModule } from './core/mail/mail.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService
    }),
    GraphQLModule.forRootAsync({
      imports: [UserModule],
      useClass: GraphqlService
    }),
    UserModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
