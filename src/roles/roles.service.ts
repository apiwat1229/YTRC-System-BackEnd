import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateRoleDto) {
        const existing = await this.prisma.role.findUnique({
            where: { name: dto.name },
        });
        if (existing) throw new BadRequestException('Role name already exists');
        return this.prisma.role.create({ data: dto });
    }

    async findAll() {
        return this.prisma.role.findMany({
            include: { _count: { select: { users: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: { _count: { select: { users: true } } },
        });
        if (!role) throw new NotFoundException(`Role #${id} not found`);
        return role;
    }

    async update(id: string, dto: UpdateRoleDto) {
        await this.findOne(id);
        return this.prisma.role.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: { _count: { select: { users: true } } },
        });
        if (!role) throw new NotFoundException(`Role #${id} not found`);
        if (role._count.users > 0) {
            throw new BadRequestException(
                'Cannot delete role with assigned users',
            );
        }
        await this.prisma.role.delete({ where: { id } });
        return { message: `Role #${id} deleted` };
    }
}
