export class BaseResponse<T> {
  code: number
  message: string
  data: T | null
  msgType: string

  constructor(code: number, message: string, data: T, msgType: string) {
    console.log('BaseResponse')
    this.code = code
    this.message = message
    this.data = data
    this.msgType = msgType
  }
}
