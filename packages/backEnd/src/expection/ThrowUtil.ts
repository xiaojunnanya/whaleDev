import { ErrorCode } from '@/common/ErrorCode'
import { BusinessException } from './business.exception'

export class ThrowUtil {
  /**
   * 条件成立则抛异常
   * @param condition 条件
   * @param runtimeException 要抛出的运行时异常
   */
  static throwByErrorIf(condition: boolean, runtimeException: Error): void {
    if (condition) {
      throw runtimeException
    }
  }

  /**
   * 条件成立则抛出业务异常
   *
   * @param condition 条件
   * @param errorCode 错误码
   */
  static throwByErrorCodeIf(condition: boolean, errorCode: ErrorCode): void {
    ThrowUtil.throwByErrorIf(condition, new BusinessException(errorCode))
  }

  /**
   * 条件成立则抛出业务异常
   *
   * @param condition 条件
   * @param errorCode 错误码
   * @param message 错误信息
   */
  static throwByMessageIf(
    condition: boolean,
    errorCode: ErrorCode,
    message: string,
  ): void {
    ThrowUtil.throwByErrorIf(
      condition,
      new BusinessException(errorCode, message),
    )
  }
}
