import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  // Разрешаем запросы с фронтенда
  app.enableCors({
    origin: [process.env.CLIENT_URL, "http://26.191.251.162:3000", "http://192.168.0.106:3000"], // Укажите ваш фронтенд-URL
    // origin: "*", // Укажите ваш фронтенд-URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Если используете куки/авторизацию
  });

  app.setGlobalPrefix("api");

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start();
