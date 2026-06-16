"use client";

import { admin } from "@/app/api/adminApi";
import { useLoading } from "@/context/LoadingContext";
import { UserRecord } from "@/libs/Admin";
import { useRouter, useSearchParams } from "next/navigation";
// Nhớ import thêm Suspense từ react
import { useEffect, useState, Suspense } from "react";

// 1. ĐỔI TÊN component cũ thành UserContent (không export default thằng này nữa)
const UserContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setIsLoading } = useLoading();

    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const nameStr = searchParams.get("name") || "";

    const currentPage = pageStr ? parseInt(pageStr) : 1;
    const currentLimit = limitStr ? parseInt(limitStr) : 10;
    const currentName = nameStr;

    const [searchTerm, setSearchTerm] = useState(currentName);
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                const data = await admin.get_users(
                    currentName,
                    currentPage,
                    currentLimit,
                );
                if (data) {
                    setUsers(data.records);
                    if (data.pagination)
                        setTotalPages(data.pagination.total_pages);
                }
            } catch (err) {
                console.log("Lỗi tải user:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUsers();
    }, [currentName, currentPage, currentLimit]);

    const handleSearch = () => {
        router.push(
            `/dashboard/users?page=1&limit=${currentLimit}&name=${searchTerm}`,
        );
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            router.push(
                `/dashboard/users?page=${currentPage - 1}&limit=${currentLimit}&name=${currentName}`,
            );
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            router.push(
                `/dashboard/users?page=${currentPage + 1}&limit=${currentLimit}&name=${currentName}`,
            );
        }
    };

    const handleEdit = (id: string | number) => {
        alert(`Đang phát triển tính năng SỬA cho user ID: ${id}`);
    };

    const handleDelete = (id: string | number) => {
        const confirmDel = window.confirm(
            `Bạn có chắc chắn muốn xóa user ID: ${id} không?`,
        );
        if (confirmDel) {
            alert("Đã gọi API xóa!");
        }
    };

    return (
        <div className="text-white p-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý Nhân viên</h1>

            <div className="flex justify-end mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="🔍 Nhập tên cần tìm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="bg-gray-800 text-white px-4 py-2 rounded outline-none border border-gray-600 focus:border-blue-400 min-w-[300px]"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded transition-colors font-bold shadow-lg"
                    >
                        Tìm
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 items-center text-gray-400 border-b border-gray-600 pb-3 mb-4 px-4 uppercase text-sm font-bold">
                <span>Tên nhân viên</span>
                <span className="text-right">Thao tác</span>
            </div>

            {users.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">
                    Không có nhân viên nào phù hợp...
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="bg-gray-800 hover:bg-gray-750 transition-colors p-4 rounded-lg grid grid-cols-2 items-center border border-gray-700"
                        >
                            <span className="font-bold text-blue-400 uppercase text-lg">
                                {user.name}
                            </span>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => handleEdit(user.id)}
                                    className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-500 border border-amber-600/50 px-4 py-1.5 rounded transition-colors font-medium shadow-sm"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-600/50 px-4 py-1.5 rounded transition-colors font-medium shadow-sm"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-10">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded font-bold transition-colors ${
                            currentPage === 1
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
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
                                : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                        }`}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

// 2. TẠO RA COMPONENT MỚI LÀM VỎ BỌC SUSPENSE VÀ EXPORT NÓ RA
export default function User() {
    return (
        <Suspense
            fallback={
                <div className="text-white p-8 text-center">
                    Đang tải dữ liệu...
                </div>
            }
        >
            <UserContent />
        </Suspense>
    );
}
