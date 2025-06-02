import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
@UseGuards(JwtAuthGuard)
export class RolesController {
    constructor(private roleService: RolesService) {}

    private ensureAdmin(req: any) {
        if(req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('У вас нет прав доступа для этого')
        }
    }

    @Post()
    create(@Body() dto: CreateRoleDto, @Req() req){
        this.ensureAdmin(req);
        return this.roleService.createRole(dto);
    }

    @Get()
    async getAll(@Req() req) {
        this.ensureAdmin(req);
        return this.roleService.getAllRoles();
    }
    
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto, @Req() req) {
        this.ensureAdmin(req);
        return this.roleService.updateRole(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        this.ensureAdmin(req);
        return this.roleService.deleteRole(id);
    }
}
