import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto) {
        const emailOrUsername = dto.email || dto.username;
        if (!emailOrUsername) {
            return { message: 'Email or username is required' };
        }
        const user = await this.authService.validateUser(
            emailOrUsername,
            dto.password,
        );
        if (!user) {
            return { message: 'Invalid credentials', statusCode: 401 };
        }
        return this.authService.login(user);
    }

    @Public()
    @Post('register')
    async register(@Body() dto: SignUpDto) {
        return this.authService.register(dto);
    }

    @Public()
    @Post('signup')
    async signup(@Body() dto: SignUpDto) {
        return this.authService.register(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@CurrentUser() user: any) {
        return this.authService.getProfile(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(
        @CurrentUser() user: any,
        @Body() dto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(user.id, dto);
    }
}
