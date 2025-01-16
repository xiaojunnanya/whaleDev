import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { ErrorCode } from '@/common/ErrorCode'
import { BusinessException } from '@/expection/business.exception'

/**
 * 全局异常处理器
 */
@Catch()
export default class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    Logger.error({
      type: exception.constructor.name,
      message: exception.message,
      stack: exception.stack,
    })

    if (exception instanceof BusinessException) {
      console.log('自定义异常，待处理', exception, exception.getResponse())
      return exception.getResponse()
    }

    const res = this.handleException(exception)

    console.log('全局捕获异常')

    response.status(200).json(res)
  }

  private handleException(exception: any): {
    code: number
    message: string
    data: any
    msgType: string
  } {
    if (exception instanceof HttpException) {
      const validatorErr =
        typeof exception.getResponse === 'function'
          ? (exception.getResponse() as { message: string[] }).message
          : null

      const message = validatorErr?.join
        ? validatorErr.join(',')
        : exception.message

      return {
        code: exception.getStatus(),
        message,
        data: null,
        msgType: 'error',
      }
    } else {
      return {
        code: ErrorCode.SYSTEM_ERROR.code,
        message: exception.message || '系统错误',
        data: null,
        msgType: 'error',
      }
    }
  }
}
