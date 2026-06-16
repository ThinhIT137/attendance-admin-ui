import HeaderDashboardComponent from "@/components/layout/HeaderDashboardComponents";
import { LoadingProvider } from "@/context/LoadingContext";

const layoutDashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-full flex flex-col">
            <LoadingProvider>
                <HeaderDashboardComponent>{children}</HeaderDashboardComponent>
            </LoadingProvider>
        </div>
    );
};

export default layoutDashboard;
