import CardSection from "@/app/components/section/dashboard/cardSection"
import ChartSection from "@/app/components/section/dashboard/ChartSection"

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-xl font-semibold mb-5">Dashboard</h1>
            <CardSection />
            <ChartSection />
        </div>
    )
}
