import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        message: string;
        loggedIn?: undefined;
        access_token?: undefined;
    } | {
        loggedIn: boolean;
        access_token: string;
        message?: undefined;
    }>;
    createUser(body: {
        username: string;
        password: string;
    }): Promise<any>;
    getUsers(): Promise<any>;
}
