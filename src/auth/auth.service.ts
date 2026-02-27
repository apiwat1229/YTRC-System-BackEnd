import {
    BadRequestException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignUpDto } from './dto/signup.dto';

const MAX_FAILED_ATTEMPTS = 5;

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(emailOrUsername: string, password: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
            },
            include: { roleRecord: true },
        });

        if (!user) return null;

        if (user.status === 'SUSPENDED') {
            throw new UnauthorizedException(
                'Account is suspended due to too many failed login attempts',
            );
        }

        if (user.status === 'INACTIVE') {
            throw new UnauthorizedException('Account is inactive');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const attempts = (user.failedLoginAttempts || 0) + 1;
            const newStatus = attempts >= MAX_FAILED_ATTEMPTS ? 'SUSPENDED' : user.status;
            await this.prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: attempts, status: newStatus as any },
            });
            return null;
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lastLoginAt: new Date() },
        });

        const { password: _, ...result } = user;
        return result;
    }

    async login(user: any) {
        const permissions: string[] =
            user.roleRecord?.permissions || user.permissions || [];

        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            permissions,
            displayName: user.displayName,
            firstName: user.firstName,
            lastName: user.lastName,
            department: user.department,
            employeeId: user.employeeId,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: user.displayName,
                avatar: user.avatar,
                role: user.role,
                permissions,
                department: user.department,
                position: user.position,
                employeeId: user.employeeId,
                forceChangePassword: user.forceChangePassword,
            },
        };
    }

    async register(dto: SignUpDto) {
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.email }, { username: dto.username }] },
        });
        if (existing) {
            throw new BadRequestException('Email or username already in use');
        }

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                username: dto.username,
                password: hashed,
                firstName: dto.firstName,
                lastName: dto.lastName,
                displayName: dto.displayName || `${dto.firstName} ${dto.lastName}`,
            },
        });

        const { password: _, ...result } = user;
        return result;
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Current password is incorrect');
        }

        const hashed = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed, forceChangePassword: false },
        });

        return { message: 'Password changed successfully' };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roleRecord: true },
            omit: { password: true } as any,
        });
        return user;
    }
}
