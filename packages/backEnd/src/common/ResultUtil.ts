import { BaseResponse } from './BaseResponse'
import { ErrorCode } from './ErrorCode'

/**
 * @description: 返回结果工具类
 */
export class ResultUtil {
  public static success<T>(data: T, msgType?: string): BaseResponse<T> {
    return new BaseResponse<T>(0, 'success', data, msgType || 'success')
  }

  /**
   * 失败 - 使用 ErrorCode
   *
   * @param errorCode
   * @return
   */
  public static errorByErrorCode(errorCode: ErrorCode): BaseResponse<null> {
    return new BaseResponse<null>(
      errorCode.code,
      errorCode.message,
      null,
      'error',
    )
  }

  /**
   * 失败 - 使用 code 和 message
   *
   * @param code
   * @param message
   * @return
   */
  public static errorByCodeAndMessage(
    code: number,
    message: string,
  ): BaseResponse<null> {
    return new BaseResponse<null>(code, message, null, 'error')
  }

  /**
   * 失败 - 使用 ErrorCode 和 message
   *
   * @param errorCode
   * @param message
   * @return
   */
  public static errorByErrorCodeAndMessage(
    errorCode: ErrorCode,
    message: string,
  ): BaseResponse<null> {
    return new BaseResponse<null>(errorCode.code, message, null, 'error')
  }
}
