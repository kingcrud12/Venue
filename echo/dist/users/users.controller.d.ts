export declare class UsersController {
    createUser(body: {
        username: string;
        password: string;
    }): Promise<{
        username: string;
        id_account: string;
        created: Date;
        updated: Date;
    }>;
    getUsers(): Promise<{
        username: string;
        id_account: string;
        created: Date;
        updated: Date;
    }[]>;
}
