import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {

    }

    @Post()
    create(@Body() userDto: createUserDto) {
        return this.usersService.createUser(userDto);
    }

    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    } 
    
    @Delete()
    delete(@Body('id') id: number) {
        return this.usersService.deleteUserById(id);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() dto:Partial<createUserDto>) {
        const updatedUser = await this.usersService.updateUser(+id, dto);
        return updatedUser;
    }
}
