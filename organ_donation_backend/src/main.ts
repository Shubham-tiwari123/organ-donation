import { NestFactory } from '@nestjs/core';
import {SwaggerModule,DocumentBuilder} from '@nestjs/swagger'
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle("Organ Donation")
  .setDescription("Organ Donation Application API Documentation")
  // .addTag("hospital","APIs related to Hospital Operations")
  // .addTag("patient","APIs related to Patients")
  .setVersion("1.0")
  .build()

  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api',app,document)
  
  app.enableCors()
  await app.listen(3008);
}
bootstrap();
