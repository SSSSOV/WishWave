import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"

async function start() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule)

  // Разрешаем запросы с фронтенда
  app.enableCors({
    origin: [process.env.CLIENT_URL], // Укажите ваш фронтенд-URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Если используете куки/авторизацию
    allowedHeaders: ["Content-Type", "Authorization"],
  })

  app.setGlobalPrefix("api")
  app.use(cookieParser())

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start()
