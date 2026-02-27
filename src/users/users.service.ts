import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateUserDto) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: dto.email },
                    dto.username ? { username: dto.username } : undefined,
                ].filter(Boolean) as any,
            },
        });
        if (existing) {
            throw new BadRequestException('Email or username already in use');
        }

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...dto,
                password: hashed,
                displayName:
                    dto.displayName ||
                    [dto.firstName, dto.lastName].filter(Boolean).join(' ') ||
                    dto.email,
            },
        });
        const { password: _, ...result } = user;
        return result;
    }

    async findAll(query?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        department?: string;
    }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (query?.search) {
            where.OR = [
                { email: { contains: query.search, mode: 'insensitive' } },
                { username: { contains: query.search, mode: 'insensitive' } },
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
                { displayName: { contains: query.search, mode: 'insensitive' } },
                { employeeId: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query?.status) where.status = query.status;
        if (query?.department) where.department = query.department;

        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                omit: { password: true } as any,
                include: { roleRecord: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            omit: { password: true } as any,
            include: { roleRecord: true, appPermissions: true },
        });
        if (!user) throw new NotFoundException(`User #${id} not found`);
        return user;
    }

    async findByEmailOrUsername(identifier: string) {
        return this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
        });
    }

    async findByIdWithPassword(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async update(id: string, dto: UpdateUserDto) {
        await this.findOne(id);

        const data: any = { ...dto };
        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10);
        } else {
            delete data.password;
        }

        const user = await this.prisma.user.update({
            where: { id },
            data,
            omit: { password: true } as any,
        });
        return user;
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.user.delete({ where: { id } });
        return { message: `User #${id} deleted` };
    }

    async updateAvatar(id: string, avatarPath: string) {
        await this.prisma.user.update({
            where: { id },
            data: { avatar: avatarPath },
        });
        return { avatar: avatarPath };
    }

    async unlockUser(id: string) {
        await this.findOne(id);
        const user = await this.prisma.user.update({
            where: { id },
            data: { failedLoginAttempts: 0, status: 'ACTIVE' },
            omit: { password: true } as any,
        });
        return user;
    }

    async updateLoginAttempts(id: string, attempts: number, status?: string) {
        return this.prisma.user.update({
            where: { id },
            data: {
                failedLoginAttempts: attempts,
                ...(status ? { status: status as any } : {}),
            },
        });
    }
}
