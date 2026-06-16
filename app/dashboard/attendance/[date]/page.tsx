// app/dashboard/attendance/[date]/page.tsx
"use client";

import { admin } from "@/app/api/adminApi";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AttendanceRecord } from "@/libs/Admin";
import { useLoading } from "@/context/LoadingContext";

export default function AttendanceDatePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setIsLoading } = useLoading();

    const currentDate = params.date as string;
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const nameStr = searchParams.get("name") || "";

    const currentPage = pageStr ? parseInt(pageStr) : 1;
    const currentLimit = limitStr ? parseInt(limitStr) : 10;
    const currentName = nameStr;

    const [searchTerm, setSearchTerm] = useState("");
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Chặn ngay từ cửa: Nếu Next.js chưa kịp đọc xong URL thì khoan gọi API
        if (!currentDate) return;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await admin.attendance_user(
                    currentDate,
                    currentName,
                    currentPage,
                    currentLimit,
                );

                if (data) {
                    setRecords(data.records);
                    if (data.pagination) {
                        setTotalPages(data.pagination.total_pages);
                    }
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [currentDate, currentName, currentPage, currentLimit]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        if (newDate) {
            router.push(`/dashboard/attendance/${newDate}`);
        }
    };

    const handleSearch = () => {
        router.push(
            `/dashboard/attendance/${currentDate}?page=1&limit=${currentLimit}&name=${searchTerm}`,
        );
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            router.push(
                `/dashboard/attendance/${currentDate}?page=${currentPage - 1}&limit=${currentLimit}&name=${currentName}`,
            );
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            router.push(
                `/dashboard/attendance/${currentDate}?page=${currentPage + 1}&limit=${currentLimit}&name=${currentName}`,
            );
        }
    };

    return (
        <div className="text-white p-8">
            <h1 className="text-2xl font-bold mb-6">Lịch sử điểm danh</h1>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <label className="text-gray-400">Chọn ngày:</label>
                    <input
                        type="date"
                        value={currentDate}
                        onChange={handleDateChange}
                        className="bg-gray-800 text-white px-4 py-2 rounded outline-none border border-gray-600 focus:border-emerald-400 cursor-pointer"
                    />
                </div>

                {/* Khu vực Tìm kiếm đã được nâng cấp */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="🔍 Nhập tên nhân viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch(); // Nhấn Enter là tự tìm
                        }}
                        className="bg-gray-800 text-white px-4 py-2 rounded outline-none border border-gray-600 focus:border-emerald-400 min-w-[250px]"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded transition-colors font-bold"
                    >
                        Tìm
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center text-gray-400 border-b border-gray-600 pb-3 mb-4 px-4 uppercase text-sm font-bold">
                <span>Tên nhân viên</span>
                <span>Thời gian (Vào - Ra)</span>
            </div>

            {/* Không dùng filteredRecords nữa, map thẳng từ records của API */}
            {records.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">
                    Không có dữ liệu phù hợp...
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {records.map((record: AttendanceRecord, index: number) => (
                        <div
                            key={index}
                            className="bg-gray-800 hover:bg-gray-750 transition-colors p-4 rounded-lg flex justify-between items-center"
                        >
                            <span className="font-bold text-emerald-400 uppercase text-lg">
                                {record.name}
                            </span>

                            <div className="flex gap-4">
                                <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded shadow-sm border border-green-800/50">
                                    Vào: {record.check_in.split(" ")[1]}
                                </span>
                                <span className="bg-red-900/40 text-red-400 px-3 py-1 rounded shadow-sm border border-red-800/50">
                                    Ra:{" "}
                                    {record.check_out
                                        ? record.check_out.split(" ")[1]
                                        : "Chưa về"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-8">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded font-bold transition-colors ${
                            currentPage === 1
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        }`}
                    >
                        Trang trước
                    </button>

                    <span className="text-gray-400 font-medium">
                        Trang {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages}
                        className={`px-4 py-2 rounded font-bold transition-colors ${
                            currentPage >= totalPages
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        }`}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
}
