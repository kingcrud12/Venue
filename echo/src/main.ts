import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exception.handler';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix((process.env.SERVER_PATH || "venue/test"))
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  if(process.env.SERVER_PORT)
  await app.listen(process.env.SERVER_PORT);
  else 
  console.log("SERVER_PORT undefined");
}
bootstrap();
