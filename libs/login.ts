export type LoginResponse = {
    accesstoken: string;
    user: UserResponse;
};

export type UserResponse = {
    name: string;
    avt: string;
};
