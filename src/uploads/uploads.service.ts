import { HttpException, Injectable } from '@nestjs/common';
import { s3PreSignedUrl, s3Uploader } from 'src/uploads/s3Uploader';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

const acepptedExtetion = {
  images: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
  videos: ['mp4'],
};

@Injectable()
export class UploadsService {
  async create(createUploadDto: CreateUploadDto) {
    const folder = Object.keys(acepptedExtetion).find((key) =>
      acepptedExtetion[key].includes(createUploadDto.extention),
    );
    if (!folder) {
      throw new HttpException('Not Acceptable Extention', 406);
    }

    console.log(folder);

    const key = `${folder}/${Date.now().toString()}.${
      createUploadDto.extention
    }`;
    const url = await s3PreSignedUrl(key);

    return {
      url,
    };
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    const url = await s3Uploader(file, folder);
    return {
      url,
    };
  }

  findAll() {
    return `This action returns all uploads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
