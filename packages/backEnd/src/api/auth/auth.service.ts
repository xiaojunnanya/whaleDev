import { Inject, Injectable } from '@nestjs/common'
import { EmailCodeDto, LoginDto, RegisterOrForgetDto } from './dto/auth.dto'
import { createTransport, Transporter } from 'nodemailer'
import * as fs from 'fs'
import * as ejs from 'ejs'
import * as svgCaptcha from 'svg-captcha'
import { AUTHOR, EMAIL_PASS, EMAIL_USER } from '@/config/index-gitignore'
import { v4 as uuidv4 } from 'uuid'
import { codeType } from './type/index.type'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/global/mysql/prisma.service'
import { ResultUtil } from '@/common/ResultUtil'
import { BusinessException } from '@/expection/business.exception'
import { ErrorCode } from '@/common/ErrorCode'
import { RedisUtil } from '@/redis/RedisUtil'
import { RedisComment } from '@/redis/RedisComment'

@Injectable()
export class AuthService {
  private readonly transporter: Transporter
  private readonly emailTemplatePath = './public/email.html'
  private readonly validity = 5 // 验证码有效期（分钟）

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject('RedisService') private readonly redisUtil: RedisUtil<string>,
    @Inject('RedisComment') private readonly redisComment: RedisComment,
  ) {
    this.transporter = createTransport({
      host: 'smtp.qq.com', // smtp服务的域名
      port: 587, // smtp服务的端口
      secure: false,
      auth: {
        user: EMAIL_USER, // 你的邮箱地址
        pass: EMAIL_PASS, // 你的授权码
      },
    })
  }

  /**
   * 发送邮件验证码
   * @param emailCode 邮箱信息
   * @param code 验证码
   * @returns
   */
  async sendEmailCodeFun(emailCode: EmailCodeDto, code: string) {
    try {
      const emailTemplate = fs.readFileSync(this.emailTemplatePath, 'utf-8')

      const emailConfig = {
        code,
        validity: this.validity,
        name: AUTHOR.NAME,
      }

      const emailHtml = ejs.render(emailTemplate, emailConfig)

      await this.transporter.sendMail({
        from: {
          name: AUTHOR.PROJECTNAME,
          address: EMAIL_USER,
        },
        to: emailCode.email,
        subject: '注册信息',
        html: emailHtml,
      })
    } catch (error) {
      throw new BusinessException(ErrorCode.SYSTEM_ERROR.code, '邮件发送失败')
    }
  }

  // 发送验证码
  async sendEmailCode(emailCode: EmailCodeDto) {
    const { type, email } = emailCode
    const code: string = Math.random().toString().slice(2, 8)

    const msg = await this.prisma.user.findUnique({ where: { email } })

    if (type === 'register' && msg) {
      throw new BusinessException(
        ErrorCode.PARAMS_ERROR.code,
        '当前邮箱已注册，请直接登录',
      )
    }

    if (type === 'forget' && !msg) {
      throw new BusinessException(
        ErrorCode.PARAMS_ERROR.code,
        '当前邮箱未注册，请先注册',
      )
    }

    await this.sendEmailCodeFun(emailCode, code)
    await this.redisUtil.setex(email, code, this.validity * 60)

    return ResultUtil.success('发送成功，请注意查收您的邮箱')
  }

  // 注册和忘记密码
  async registerOrForget(registerDto: RegisterOrForgetDto, type: codeType) {
    const { email, emailCode, password } = registerDto

    const userRes = await this.prisma.user.findUnique({ where: { email } })

    if ((type === 'register' && userRes) || (type === 'forget' && !userRes)) {
      const message =
        type === 'register'
          ? '当前邮箱已注册，请直接登录'
          : '当前邮箱未注册，请先注册'
      return ResultUtil.success(message, 'info')
    }

    const redisCode = await this.redisUtil.get(email)
    if (!redisCode || redisCode !== emailCode)
      throw new BusinessException(
        ErrorCode.PARAMS_ERROR.code,
        '验证码错误或已过期，请重新发送',
      )

    // 遗留的问题：图形验证码 code 的验证

    let returnMsg = ''
    if (type === 'register') {
      // 注册
      await this.prisma.user.create({
        data: {
          user_id: `user-${uuidv4()}`,
          email,
          password,
        },
      })
      returnMsg = '注册成功'
    } else {
      // 修改密码
      await this.prisma.user.update({
        where: { email },
        data: {
          password,
        },
      })
      returnMsg = '修改密码成功，请返回重新登录'
    }

    // 删除图形验证码
    await this.redisUtil.delete(email)

    return ResultUtil.success(returnMsg, 'success')
  }

  // 登录
  async login(loginDto: LoginDto) {
    const { email, password, code } = loginDto

    const userRes = await this.prisma.user.findUnique({ where: { email } })

    if (!userRes) throw new BusinessException(0, '当前邮箱未注册，请先注册')

    if (userRes.password !== password)
      throw new BusinessException(ErrorCode.OPERATION_ERROR.code, '密码错误')

    const token = this.jwtService.sign({
      user_id: userRes.user_id,
    })

    this.redisComment.saveUserInfo(token, userRes)

    // 遗留的问题：token无感刷新

    // 遗留的问题：图形验证码 code 的验证

    return ResultUtil.success({
      token: token,
      avatar: userRes.avatar,
      status: userRes.status,
      user_id: userRes.user_id,
      username: userRes.username,
    })
  }

  // 返回图形验证码
  async getImgCode(res: any) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 120, //宽度
      height: 44, //高度
      background: '#0099FF', //背景颜色
    })

    res.type('image/svg+xml')
    res.status(200).send(captcha.data)
  }
}
