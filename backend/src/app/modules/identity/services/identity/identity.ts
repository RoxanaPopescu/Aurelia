export class RefreshToken
{
    public constructor(data: any)
    {
        this.id = data.id;
        this.userId = data.userId;
        this.revoked = data.revoked || false;
    }

    public id: string;

    public userId: string;

    public revoked: boolean;
}

export class AccessToken
{
    public constructor(data: any)
    {
        this.userId = data.userId;
        this.username = data.username;
        this.permissions = [...data.permissions];
    }

    public userId: string;

    public username: string;

    public permissions: string[];
}

export class Identity
{
    public constructor(data: any)
    {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.permissions = data.permissions || [];
        this.refreshTokens = (data.refreshTokens || []).map((t: any) => new RefreshToken(t));
    }

    public id: string;

    public username: string;

    public password: string;

    public refreshTokens: RefreshToken[];

    public permissions: string[];
}
