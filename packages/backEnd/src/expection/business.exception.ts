import { ErrorCode } from '@/common/ErrorCode';
import { HttpException, HttpStatus } from '@nestjs/common';


/**
 * 自定义异常类
 */
export class BusinessException extends HttpException {
  private _code: number;
  private _message: string;

  constructor(code: number, message: string);
  constructor(errorCode: ErrorCode);
  constructor(errorCode: ErrorCode, message: string);
  constructor(
    codeOrErrorCode: number | ErrorCode,
    message?: string,
  ) {
    let code: number;
    let msg: string;
    if (typeof codeOrErrorCode === 'number') {
      code = codeOrErrorCode;
      msg = message || 'Business Exception';
    } else {
      code = codeOrErrorCode.code;
      msg = message || '';
    }
   
    super({code,message:msg}, HttpStatus.OK);
    this._code = code;
    this._message = msg;
  }

  get code(): number {
    return this._code;
  }

  set code(v: number) {
    this._code = v;
  }

  get message(): string {
    return this._message;
  }

  set message(v: string) {
    this._message = v;
  }
}


export function getErrorMessage(errorCode: ErrorCode): string {
    switch (errorCode.code) {
        case ErrorCode.PARAMS_ERROR.code:
            return "参数错误"
         case ErrorCode.NOT_LOGIN_ERROR.code:
             return "未登录"
         case ErrorCode.NO_AUTH_ERROR.code:
              return "没有权限"
         case ErrorCode.SYSTEM_ERROR.code:
            return "系统内部错误"
        case ErrorCode.OPERATION_ERROR.code:
             return "操作失败"
        default:
             return "Business Exception"
    }
}