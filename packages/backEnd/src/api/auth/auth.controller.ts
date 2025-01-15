import { Controller, Post, Body, Res, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { EmailCodeDto, LoginDto, RegisterOrForgetDto } from './dto/auth.dto'
import { WhaleSkipAuth } from '@/decorator/router.decorator'
import { BaseResponse } from '@/common/BaseResponse'
import { ErrorCode } from '@/common/ErrorCode'
import { ThrowUtil } from '@/expection/ThrowUtil'

@WhaleSkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email_code')
  async sendEmailCode(@Body() emailCode: EmailCodeDto): Promise<BaseResponse<String>>{
    return await this.authService.sendEmailCode(emailCode);
  }

  @Post('register')
  register(@Body() registerDto: RegisterOrForgetDto) {
    const { password, confirmPassword } = registerDto
    ThrowUtil.throwByMessageIf(password !== confirmPassword, ErrorCode.PARAMS_ERROR, "两次密码不一致");
    return this.authService.registerOrForget(registerDto, 'register')
  }

  @Post('forget')
  forget(@Body() forgetDto: RegisterOrForgetDto) {
    const { password, confirmPassword } = forgetDto;
    ThrowUtil.throwByErrorCodeIf(password !== confirmPassword, ErrorCode.PARAMS_ERROR);
    return this.authService.registerOrForget(forgetDto, 'forget')
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Get('img_code')
  getImgCode(@Res() res: any) {
    return this.authService.getImgCode(res)
  }
}
