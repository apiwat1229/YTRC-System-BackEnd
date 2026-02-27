import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../constants/permissions';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

const ADMIN_ROLES = ['admin', 'superadmin'];

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) return false;

        if (ADMIN_ROLES.includes(user.role)) return true;

        const userPermissions: string[] = user.permissions || [];
        return requiredPermissions.every((p) => userPermissions.includes(p));
    }
}
