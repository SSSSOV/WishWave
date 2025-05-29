import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BugReport } from './bugreport.model';
import { CreateBugReportDto } from './dto/create-bugreport.dto';
import { UpdateBugReportDto } from './dto/update-bugreport.dto';
import { User } from 'src/users/users.model';

@Injectable()
export class BugreportService {
    constructor(@InjectModel(BugReport) private readonly BugRepository: typeof BugReport) {}
    
    async create(dto: CreateBugReportDto, userId?: number): Promise<BugReport> {
        const emailToStore = dto.email;
        const data: {title: string, description: string; userId: number | null; email?: string} = {title: dto.title, description: dto.description, userId: userId ?? null}; 
        if (emailToStore) {
            data.email = emailToStore;
        }
        
        return await this.BugRepository.create(data);
    }

    async findAll(): Promise<BugReport[]> {
        return this.BugRepository.findAll({include: [{model: User, as: 'user', attributes: ['id', 'fullname', 'login', 'image']}]});
    }

    async findByUser(userId: number): Promise<BugReport[]> {
        return this.BugRepository.findAll({where: {userId}, include: [{model: User, as: 'user', attributes: ['id', 'fullname', 'login', 'image']}]});
    }

    async update (id: number, dto: UpdateBugReportDto, userId): Promise<BugReport> {
        const br = await this.BugRepository.findByPk(id);
        if (!br) {
            throw new NotFoundException('Баг-репорт не найден')
        }

        if (br.userId !== userId) {
            throw new ForbiddenException('Редактировать может только автор')
        }

        const updateData: Record<string, any> = {};

        if (dto.hasOwnProperty('title')) {
            updateData.title = dto.title;
        }
        if (dto.hasOwnProperty('description')) {
            updateData.description = dto.description;
        }
        if (dto.hasOwnProperty('email')) {
            updateData.email = dto.email;
        }

        br.set(updateData);
        await br.save();
        await br.reload({include: [{ model: User, as: 'user', attributes: ['id','fullname','login','image'] }]});
        return br;
    }

    async remove(id: number): Promise<void> {
        const br = await this.BugRepository.findByPk(id);
        if (!br) {
            throw new NotFoundException('Баг репорт не найден')
        }
        await br.destroy();
    }

    async findById(id: number): Promise<BugReport> {
        const br = await this.BugRepository.findByPk(id, {include: [{model: User, as: 'user', attributes: ['id', 'fullname', 'login', 'image']}]});
        if (!br) {
            throw new NotFoundException(`Баг-репорт с id ${id} не найден`);
        }

        return br;
    }
}
