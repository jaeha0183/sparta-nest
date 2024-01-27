import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TypeOrmConfigService } from './config/typeorm.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // forRoot -> forRootAsync로 바뀌었어요!
      useClass: TypeOrmConfigService, // DB 관련 설정이 있는 서비스 파일을 불러와요!
    }),
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
