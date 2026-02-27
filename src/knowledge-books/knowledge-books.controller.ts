import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PERMISSIONS } from '../auth/constants/permissions';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateKnowledgeBookDto } from './dto/create-knowledge-book.dto';
import { KnowledgeBooksService } from './knowledge-books.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('knowledge-books')
export class KnowledgeBooksController {
    constructor(private readonly service: KnowledgeBooksService) { }

    @Permissions(PERMISSIONS.KNOWLEDGE_BOOK_CREATE)
    @Post()
    create(@Body() dto: CreateKnowledgeBookDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.KNOWLEDGE_BOOK_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string, @Query('category') category?: string) {
        return this.service.findAll({ page, limit, search, category });
    }

    @Permissions(PERMISSIONS.KNOWLEDGE_BOOK_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.KNOWLEDGE_BOOK_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateKnowledgeBookDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.KNOWLEDGE_BOOK_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }

    @Post(':id/view')
    recordView(@Param('id') id: string, @CurrentUser() user: any) { return this.service.recordView(id, user.id); }

    @Post(':id/download')
    download(@Param('id') id: string) { return this.service.download(id); }

    @Permissions(PERMISSIONS.KNOWLEDGE_BOOK_CREATE)
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/knowledge',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = path.extname(file.originalname);
                    cb(null, `book-${uniqueSuffix}${ext}`);
                },
            }),
            limits: { fileSize: 50 * 1024 * 1024 },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            filePath: `/uploads/knowledge/${file.filename}`,
            fileName: file.originalname,
            fileSize: file.size,
            fileType: file.mimetype,
        };
    }
}
