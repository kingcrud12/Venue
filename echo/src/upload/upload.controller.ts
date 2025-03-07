import { Body, Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { message } from 'antd';
import { UploadService } from './upload.service';
import { UploadFileDto } from './dto/upload.dto';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService){}
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Query('name') name: string
    )
    {
        const result = await this.uploadService.saveFile(file, name);
        return {message : result};
    }
}
