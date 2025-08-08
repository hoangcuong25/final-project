import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { comparePasswordHelper, hashPasswordHelper } from 'src/helpers/util';
import { MailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailerService: MailerService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async isEmailExist(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async updateCodeActive(id: string, codeId: string) {
    await this.userRepository.update(id, {
      verificationOtp: codeId,
      verificationOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  async activeAccount(id: string) {
    await this.userRepository.update(id, {
      isVerified: true,
      verificationOtp: null,
      verificationOtpExpires: null,
    });
  }

  async updateOptReset(id: number, otp: string) {
    await this.userRepository.update(id, {
      resetOtp: otp,
      resetOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  async resetPassword(id: number, password: string) {
    await this.userRepository.update(id, {
      password,
      resetOtp: null,
      resetOtpExpires: null,
    });
  }

  async createWithGoole(userData: Partial<User>) {
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password1, password2 } = createUserDto;

      if (await this.isEmailExist(email)) throw new BadRequestException('Email already exists');
      if (password1 !== password2) throw new BadRequestException('Password not match');

      const hashPassword = await hashPasswordHelper(password1);

      const user = this.userRepository.create({
        name,
        email,
        password: hashPassword,
        isVerified: false,
        // codeExpired: dayjs().add(5, 'minute').toDate(),
      });

      const savedUser = await this.userRepository.save(user);
      return { id: savedUser.id };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Internal server error');
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password1, password2 } = registerDto;

    if (await this.isEmailExist(email)) throw new BadRequestException('Email already exists!');
    if (password1 !== password2) throw new BadRequestException('Password not match');

    const hashPassword = await hashPasswordHelper(password1);

    const user = this.userRepository.create({
      name,
      email,
      password: hashPassword,
      isVerified: false,
    });

    const savedUser = await this.userRepository.save(user);
    return { id: savedUser.id };
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async getProfile(req: { _id: number }) {
    return await this.findById(req._id);
  }

  async updateProfile(req: { _id: number }, updateUserDto: any, image?: Express.Multer.File) {
    const user = await this.findById(req._id);
    if (!user) throw new BadRequestException('User not found');

    const updateData = { ...updateUserDto };

    if (image) {
      const imageUpload = await this.cloudinaryService.uploadFile(image);
      updateData['image'] = imageUpload.url;
    }

    await this.userRepository.update(req._id, updateData);
    return 'ok';
  }

  async updatePhone(req: { _id: string }, phone: string) {
    await this.userRepository.update(req._id, { phone });
    return 'ok';
  }

  async updatePassword(req: { _id: number }, reqBody: any) {
    const { newPassword1, newPassword2, oldPassword } = reqBody;
    const user = await this.findById(req._id);
    if (!user) throw new BadRequestException('User not found');

    const isOldPasswordValid = await comparePasswordHelper(oldPassword, user.password);
    if (!isOldPasswordValid) throw new BadRequestException('Incorrect old password');
    if (newPassword1 !== newPassword2) throw new BadRequestException('New passwords do not match');

    const hashedPassword = await hashPasswordHelper(newPassword1);
    await this.userRepository.update(req._id, { password: hashedPassword });

    return 'ok';
  }

  async deleteUser(userId: string) {
    await this.userRepository.delete(userId);
    return 'ok';
  }
}
