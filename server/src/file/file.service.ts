import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import axios from 'axios';

@Injectable()
export class FileService {

    async createFile(file): Promise<string> {
        try {
            const ext = path.extname(file.originalname);
            const fileName = uuid.v4() + ext;
            const filePath = path.resolve(process.cwd(), 'static')

            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }

            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return fileName;
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async downloadImage(url: string): Promise<string> {
        try {
            const response = await axios.get(url, {responseType: 'arraybuffer'});
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(process.cwd(), 'static');

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true});
            }

            fs.writeFileSync(path.join(filePath, fileName), response.data);
            return fileName;
        } catch (e) {
            throw new HttpException('Не удалось загрузить изображение по ссылке', HttpStatus.BAD_REQUEST);
        }
    }

    async deleteFile(filename: string): Promise<void> {
        try {
            const filePath = path.resolve(process.cwd(), 'static', filename);
            if (fs.existsSync(filePath)){
                await fs.promises.unlink(filePath);
            }
        } catch (e) {
            console.error('Не удалось удалить файл', filename, e)
        }
    }

}
