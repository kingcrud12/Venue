import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        message: string;
        loggedIn?: undefined;
        access_token?: undefined;
    } | {
        loggedIn: boolean;
        access_token: string;
        message?: undefined;
    }>;
}
