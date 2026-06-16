export type AttendanceRecord = {
    name: string;
    check_in: string;
    check_out: string | null;
};

export type Pagination = {
    current_page: number;
    limit: number;
    total_pages: number;
    total_records: number;
};

export type UserAttendanceResponse = {
    records: AttendanceRecord[];
    pagination: Pagination;
};

export type UserRecord = {
    id: number | string;
    name: string;
};

export type GetUsersResponse = {
    records: UserRecord[];
    pagination: {
        total_pages: number;
        current_page: number;
    };
};
