import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BugReport } from './bugreport.model';
import { CreateBugReportDto } from './dto/create-bugreport.dto';

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
        return this.BugRepository.findAll();
    }

    async findByUser(userId: number): Promise<BugReport[]> {
        return this.BugRepository.findAll({where: {userId}});
    }
}
