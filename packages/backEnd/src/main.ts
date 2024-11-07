import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await app.listen(3173)
  Logger.log('开始使用nest，端口号3173')
}
bootstrap()
