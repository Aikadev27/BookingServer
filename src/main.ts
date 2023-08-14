/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT || 3001, () => {
    console.log(
      `server is started at port : http://localhost:${PORT}/`,
      '\nconnection string is :',
      process.env.MONGODB_URL,
    );
  });
}
bootstrap();
