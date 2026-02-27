import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Permissions(PERMISSIONS.USER_CREATE)
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Permissions(PERMISSIONS.USER_VIEW)
    @Get()
    findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('department') department?: string,
    ) {
        return this.usersService.findAll({ page, limit, search, status, department });
    }

    @Permissions(PERMISSIONS.USER_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Permissions(PERMISSIONS.USER_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Permissions(PERMISSIONS.USER_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Permissions(PERMISSIONS.USER_EDIT)
    @Post(':id/avatar')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: './uploads/avatars',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = path.extname(file.originalname);
                    cb(null, `avatar-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new Error('Only image files are allowed'), false);
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.updateAvatar(id, `/uploads/avatars/${file.filename}`);
    }

    @Permissions(PERMISSIONS.USER_EDIT)
    @Post(':id/unlock')
    unlockUser(@Param('id') id: string) {
        return this.usersService.unlockUser(id);
    }
}
