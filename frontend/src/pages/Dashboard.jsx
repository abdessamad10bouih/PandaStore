import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import AppSideBar from "../components/AppSideBar"
import { Me } from "../lib/api"
import { useAuth } from "../context/useAuth"
import LineCharts from "../components/LineCharts"
import CircleChart from "../components/CircleChart"
import ProductsTable from "../components/TableProducts"
import { useProducts } from "../context/ProductContext"
import { Forward, LucideBadgeDollarSign, Package, ShoppingBag, ShoppingBasket, User } from "lucide-react"
import { Link } from "react-router-dom"
import Layout from "../Layout/Layout"
import DashboardCard from "../components/DashboardCard"

const Dashboard = () => {
    const { products, users } = useProducts();
    console.log('users : ', users)

    const { user, setUser } = useAuth()
    const handleSidebarChange = (expanded) => {
        setSidebarExpanded(expanded)
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await Me();
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error while fetching user data: ", error);
            }
        };

        fetchUser();
    }, []);
    const activeProducts = products.filter((product) => product.status === "active")
    return (
        <Layout>
            <div className="flex-1 overflow-auto p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <DashboardCard title="Revenu Total" value="$24,780" icon={<LucideBadgeDollarSign />} change="+12.5%" trend="up" color="green" percentageChange={8.1} />
                    <DashboardCard title="Nouvelles Commandes" value="342" icon={<Package />} color="green" percentageChange={8.1} />
                    <DashboardCard title="Produits Actifs" data={products} value={activeProducts.length} icon={<ShoppingBasket />} color="red" percentageChange={-2.3} />
                    <DashboardCard title="Total Clients" value={users?.length} icon={<User />} color="blue" percentageChange={-50.3} />
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Activité Récente</h2>
                    <div className="bg-card rounded-lg border shadow-sm flex p-6 w-full">
                        <LineCharts produits={products} />
                        <CircleChart data={products} />
                    </div>
                </div>
                <div className="mt-8 flex flex-col gap-2">
                    <div className="w-full gap-1 h-12 flex items-center justify-end">
                        <Link to={"/products"} className="gap-1 text-blue-600 flex items-center justify-end">
                            <h1>Voir Tous</h1>
                            <Forward />
                        </Link>
                    </div>
                    <ProductsTable allProducts={products} />
                </div>
            </div>
        </Layout>
    )
}

// const DashboardCard = ({ title, value, change, trend }) => {
//     return (
//         <div className="bg-card rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
//             <div className="flex justify-between items-start">
//                 <div>
//                     <p className="text-sm font-medium text-muted-foreground">{title}</p>
//                     <h3 className="text-2xl font-bold mt-1">{value}</h3>
//                 </div>
//                 <div
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                         }`}
//                 >
//                     {change}
//                 </div>
//             </div>
//         </div>
//     )
// }


export default Dashboard

