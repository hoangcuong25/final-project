import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { comparePasswordHelper, hashPasswordHelper } from 'src/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRedis() private readonly redis: Redis
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await comparePasswordHelper(pass, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  createRefreshToken = (payload: any) => {
    const refreshExpire = this.configService.get<string>("JWT_REFRESH_EXPIRE") || "7d"
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: ms(refreshExpire as ms.StringValue) / 1000
    });
    return refresh_token;
  }

  async storeRefreshToken(userId, refresh_token) {
    await this.redis.set(`refresh_token:${userId}`, refresh_token, "EX", 1 * 24 * 60 * 60); // 7days
  }

  async login(user: any, response: Response) {

    const userLogin = await this.userService.findById(user.id)

    const payload = {
      sub: userLogin.email,
      iss: 'from server',
      _id: user._id,
      role: userLogin?.role
    };

    const refresh_token = this.createRefreshToken(payload);

    await this.storeRefreshToken(user._id, refresh_token)

    // Đặt cookie refresh_token
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,            // Chỉ truy cập qua HTTP, không qua JS
      secure: true,              // Chỉ gửi qua HTTPS
      sameSite: 'strict',        // Tránh CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // Hết hạn sau 7 ngày
      path: '/auth/refresh',     // Chỉ gửi khi gọi endpoint refresh
    });

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.userService.handleRegister(registerDto)
  }

  async logout(req) {
    try {
      const access_token = req.headers.authorization?.split(' ')[1]

      if (access_token) {
        const decoded = this.jwtService.verify(access_token, { secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET") })
        await this.redis.del(`refresh_token:${decoded._id}`);
      }

      return 'ok'
    }
    catch {
      throw new UnauthorizedException
    }
  }

  async refreshToken(req) {
    const refreshToken = req.headers.refreshtoken

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided!!!')
    }

    const decoded = this.jwtService.verify(refreshToken, { secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET") })
    const storedToken = await this.redis.get(`refresh_token:${decoded._id}`);

    if (storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const user = await this.userService.findById(decoded._id)

    const payload = {
      sub: user.email,
      iss: 'from server',
      _id: decoded._id,
      role: user?.role
    };

    return this.jwtService.sign(payload)
  }

  async sendEmailActive(req) {
    const codeId = Math.random().toString(36).substring(2, 8);

    const user = await this.userService.findById(req._id)

    this.mailerService
      .sendMail({
        to: user?.email, // list of receivers
        subject: 'Email Active Account', // Subject line
        text: 'welcome', // plaintext body
        template: "register",
        context: {
          name: user?.name,
          activationCode: codeId
        }
      })

    await this.userService.updateCodeActive(req._id, codeId)

    return "ok";
  }

  async comfirmActive(req, codeId) {
    const user = await this.userService.findById(req._id)

    if (user?.verificationOtp !== codeId) {
      throw new BadRequestException('Invalid activation code')
    }

    if (user?.verificationOtpExpires && new Date() > user.verificationOtpExpires) {
      throw new BadRequestException('Activation code has expired');
    }

    await this.userService.activeAccount(req._id)

    return 'ok'
  }

  async sendResetOtp(email) {
    if (!email) {
      throw new BadRequestException('Email is required')
    }

    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const otp = Math.random().toString(36).substring(2, 8);

    await this.userService.updateOptReset(user.id, otp)

    this.mailerService
      .sendMail({
        to: user?.email, // list of receivers
        subject: 'Reset Password', // Subject line
        text: 'Reset Your Password', // plaintext body
        template: "resetPassword",
        context: {
          name: user?.name,
          activationCode: otp
        }
      })

    return 'ok'
  }

  async resetPassword(email, otp, newPassword) {
    if (!email || !otp || !newPassword) {
      throw new BadRequestException('Email, OTP, and password are required')
    }

    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new BadRequestException('User not fount')
    }

    if (user?.resetOtp === '' || user?.resetOtp !== otp) {
      throw new BadRequestException('Invalid OTP')
    }

    if (user?.resetOtpExpires && new Date() > user.resetOtpExpires) {
      throw new BadRequestException('OTP Expired')
    }

    const hashPassword = await hashPasswordHelper(newPassword)

    this.userService.resetPassword(user.id, hashPassword)

    return 'ok'
  }

  async loginGoole(firstName, lastName, email, image) {
    if (!firstName || !lastName || !email || !image) {
      throw new BadRequestException("Please Fill In All Information")
    }

    const user = await this.userService.findByEmail(email)

    if (user) {
      const payload = {
        sub: user.email,
        iss: 'from server',
        _id: user.id,
        role: user.role
      };

      const access_token = this.jwtService.sign(payload);
      const refresh_token = this.createRefreshToken(payload);

      await this.storeRefreshToken(user.id, refresh_token)

      return {
        access_token,
        refresh_token
      }
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await hashPasswordHelper(generatedPassword)

      const userData = {
        firstName,
        lastName,
        email,
        phone: "Unknown",
        password: hashedPassword,
        dob: "Unknown",
        image,
        isActive: true
      }

      const user = await this.userService.createWithGoole(userData)

      const payload = {
        sub: user.email,
        iss: 'from server',
        _id: user.id,
        role: user.role
      };

      const access_token = this.jwtService.sign(payload);
      const refresh_token = this.createRefreshToken(payload);

      await this.storeRefreshToken(user.id, refresh_token)

      return {
        access_token,
        refresh_token
      }
    }
  }
}