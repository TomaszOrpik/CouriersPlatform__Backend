import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const documentConfig = new DocumentBuilder()
    .setTitle('CouriersPlatform API')
    .setDescription(`API odpowiedzialne do zarządzania danymi platformy. Tworzy trasy kurierom, aktualizuje pozycje oraz zarządza statusem dostaw i zgłoszeń.`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(config.get('port') || 3000);
  Logger.log(`Running in ${config.get('environment')}`);
  Logger.log(`Running on PORT ${config.get('port')}`);
}
bootstrap();
