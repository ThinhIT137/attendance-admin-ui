import HeaderDashboardComponent from "@/components/layout/HeaderDashboardComponents";

const layoutDashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <body>
            <HeaderDashboardComponent>{children}</HeaderDashboardComponent>
        </body>
    );
};

export default layoutDashboard;
