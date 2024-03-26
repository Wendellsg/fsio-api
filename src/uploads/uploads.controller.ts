import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Prisma, UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Roles(UserRoleEnum.admin, UserRoleEnum.patient, UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createUploadDto: Prisma.FileUploadedUncheckedCreateInput,
    @Request() req,
  ) {
    createUploadDto.userId = req.user.id;
    return this.uploadsService.create(createUploadDto);
  }

  @Roles(UserRoleEnum.admin, UserRoleEnum.patient, UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Get('upload-url')
  upload(@Request() req, @Query('extension') extension: string) {
    return this.uploadsService.requestUploadUrl(req.user.id, extension);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.uploadsService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadsService.remove(id);
  }
}
