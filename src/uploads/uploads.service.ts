import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, UserRoleEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { s3Delete, s3PreSignedUrl } from 'src/uploads/s3-uploader';

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async create(createUploadDto: Prisma.FileUploadedUncheckedCreateInput) {
    return this.prisma.fileUploaded.create({
      data: createUploadDto,
    });
  }

  async requestUploadUrl(userId: string, extension: string) {
    if (!userId || !extension)
      throw new HttpException('Requisição inválida', HttpStatus.BAD_REQUEST);

    const userFiles = await this.prisma.fileUploaded.findMany({
      where: {
        userId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const filesSize = userFiles.reduce((acc, file) => {
      return acc + file.size;
    }, 0);

    const Limit = 1000000 * 10; // 10MB

    if (filesSize > Limit && !user.roles.includes(UserRoleEnum.admin))
      throw new HttpException(
        'Você já excedeu o limite de uploads',
        HttpStatus.BAD_REQUEST,
      );

    const key = `${userId}/${Date.now().toString()}.${extension}`;
    const url = await s3PreSignedUrl(key);
    return {
      url,
    };
  }

  findAll(userId: string) {
    return this.prisma.fileUploaded.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  async remove(id: string) {
    try {
      //Remove file from s3

      const file = await this.prisma.fileUploaded.findUnique({
        where: {
          id,
        },
      });

      await s3Delete(file.key);

      await this.prisma.fileUploaded.delete({
        where: {
          id,
        },
      });
    } catch (error) {}
  }
}
