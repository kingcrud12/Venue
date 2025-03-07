import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs';
import path from 'path';

const dirPath = process.env.DATABASE_FILE_DIRECTORY|| "";

@Injectable()
export class UploadService {
    async saveFile(file: Express.Multer.File, name: string): Promise<string>
    {
        const namePath = path.resolve(name);

        const filePath = path.join(dirPath, `file_${Date.now()}`);

        writeFile('file',file.buffer,(err)=>{
            if(err){
                console.log('Error creating file : ', err);
                return;
            }
            console.log(`File "${filePath}" has been created.`);
        });
        /*const writeStream = createWriteStream(filePath);

        writeStream.write(file.buffer);
        writeStream.end();*/

        return `File saved to ${filePath}`;
    }
}