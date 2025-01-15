import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { formatDate } from '@/utils'
import { customCode, responseType } from '@/type'
import { ResultUtil } from '@/common/ResultUtil'
import { ErrorCode } from '@/common/ErrorCode'
import { BusinessException } from '@/expection/business.exception'

/**
 * 全局异常处理器
 */
@Catch()
export default class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    this.logger.error('Exception caught:', {
      type: exception.constructor.name,
      message: exception.message,
      stack: exception.stack,
    })

    let res
    if (exception instanceof BusinessException) {
      const response = exception.getResponse() as any
      res = response
    } else if (exception instanceof HttpException) {
      const validatorErr =
        typeof exception.getResponse === 'function'
          ? (exception.getResponse() as { message: string[] }).message
          : null

      const message = validatorErr?.join
        ? validatorErr.join(',')
        : exception.message

      res = {
        code: exception.getStatus(),
        message,
        data: null,
        msgType: 'error',
      }
    } else {
      res = {
        code: ErrorCode.SYSTEM_ERROR.code,
        message: exception.message || '系统错误',
        data: null,
        msgType: 'error',
      }
    }

    this.logger.debug('Response:', res)
    response.status(200).json(res)
  }
}
