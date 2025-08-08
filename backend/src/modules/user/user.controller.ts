import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, Roles } from 'src/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Post('create')
  @ResponseMessage('create user')
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('get-all-user')
  @ResponseMessage('get all user')
  @Roles('admin')
  findAll() {
    return this.userService.findAll();
  }

  @Get('get-profile')
  @ResponseMessage('get user profile')
  getProfile(@Req() req) {
    return this.userService.getProfile(req.user)
  }

  @Patch('update-profile')
  @ResponseMessage('update profile')
  @UseInterceptors(FileInterceptor('image'))
  updateProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.userService.updateProfile(req.user, updateUserDto, image)
  }

  @Patch('update-phone')
  updatePhone(
    @Req() req,
    @Body() reqBody: { phone: string }
  ) {
    return this.userService.updatePhone(req.user, reqBody.phone)
  }

  @Patch('update-password')
  updatePassword(
    @Req() req,
    @Body() reqBody: {
      newPassword1: string,
      newPassword2: string,
      oldPassword: string
    }
  ) {
    return this.userService.updatePassword(req.user, reqBody)
  }

  @Delete('delete-user/:id')
  @Roles('admin')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId)
  }

}