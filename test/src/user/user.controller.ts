import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('/users')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Get()
    async getAll() {
        return await this.userService.getAll();
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        return await this.userService.get(id);
    }

    @Post()
    async create(@Body() data) {
        return await this.userService.create(data.name);
    }

    @Patch(':id')
    async update(@Body() data, @Param('id') id: string) {
        return await this.userService.update(id, data.name);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }

}