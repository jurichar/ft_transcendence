import { Body, Controller, Get, Post, Res, Req, UseGuards} from '@nestjs/common';
import { Response } from 'express'
import { Request } from 'express'
import { User } from 'src/users/entities/user.entity';
import { Api42Guard } from './guards/api42.guard';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DiscordGuard } from './guards/discord.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    

    @Get('login')
    @UseGuards(Api42Guard)
    login()
    {
        return ;
    }
    
    @Get('redirect')
    @UseGuards(Api42Guard)
    async redirect(@Req() req: Request, @Res({ passthrough: true }) response: Response)
    {
        console.log("redirection")
        const { accessToken } = await this.authService.login(req.user);
        response.cookie(
            'jwt',
            accessToken,
            {
                httpOnly: false, //toggle to true on prod
                expires: new Date(Date.now() + 60000),
                sameSite: "lax",
            });
        //return req.user;
        //return accessToken; //uncomment to obtain bearer token for curl/postman tests
        return "Logged with 42";
    }

    @Post('localLogin')
    @UseGuards(LocalGuard)
    localLogin(@Req() request: Request): any
    {
        return this.authService.login(request.user);
    }

    @Get('discordLogin')
    @UseGuards(DiscordGuard)
    discordLogin()
    {
        return ;
    }

    @Get('discordRedirect')
    @UseGuards(DiscordGuard)
    async discordRedirect(@Req() req: Request, @Res({ passthrough: true }) response: Response)
    {
        const { accessToken } = await this.authService.login(req.user);
        response.cookie(
            'jwt',
            accessToken,
            {
                httpOnly: false, //toggle to true on prod
                expires: new Date(Date.now() + 60000),
                sameSite: "lax",
            });
        //return req.user;
        //return accessToken; //uncomment to obtain bearer token for curl/postman tests
        return "Logged with Discord";
    }

    @Get('protected')
    @UseGuards(JwtGuard)
    getHello(@Req() request: Request): any // TODO: request a Bearer token, validate token
    {
        return request.user;
    }

    @Get('status')
    status()
    {

    }
}