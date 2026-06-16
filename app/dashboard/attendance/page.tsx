import { redirect } from "next/navigation";

export default function AttendanceReceptionistPage() {
    const today = new Date();
    today.setHours(today.getHours() + 7);
    const dateString = today.toISOString().split("T")[0];
    redirect(`/dashboard/attendance/${dateString}`);
}
