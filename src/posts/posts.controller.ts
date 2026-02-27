import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    create(@Body() dto: CreatePostDto) {
        return this.postsService.create(dto);
    }

    @Get()
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ) {
        return this.postsService.findAll({ page, limit, search });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
        return this.postsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}
