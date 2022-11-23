interface UserInfo {
    username: string;
    loginStatus: boolean;
}
declare class UsersInfo {
    private userdata;
    setStatus(username: string, loginStatus: boolean): void;
    getStatus(username: string): boolean;
}
export default UsersInfo;
export type { UserInfo };
//# sourceMappingURL=usersinfo.d.ts.map