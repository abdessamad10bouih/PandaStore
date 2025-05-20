import { useEffect, useState } from "react"
import {
    Folder,
    LayoutDashboard,
    ShoppingBasket,
    ChevronRight,
    Settings,
    LogOut,
    HelpCircle,
    Search,
    Users,
    ArrowLeft,
    ArrowRight,
    MessageCirclePlus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { logout } from "../lib/api"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import { useAuth } from "../context/useAuth"
import CustomToast from "./CustomToast"

const AppSideBar = ({ Active, onExpandChange }) => {
    const [expanded, setExpanded] = useState(true)
    const { user } = useAuth()
    const { products, categories, fournisseurs } = useProducts();
    const navigate = useNavigate()
    const mainMenuItems = [
        { name: "Dashboard", icon: LayoutDashboard, badge: null },
        { name: "Products", icon: ShoppingBasket, badge: products?.length || null },
        { name: "Fournisseurs", icon: Users, badge: fournisseurs?.length || null },
        { name: "Categories", icon: Folder, badge: categories?.length || null },
        { name: "Posts", icon: MessageCirclePlus, badge: null },
    ]

    const secondaryMenuItems = [
        { name: "Parametres", icon: Settings },
        { name: "Aide", icon: HelpCircle },
    ]

    const handleLogout = async () => {
        try {
            await logout()
            CustomToast("success", "Déconnexion réussie")
            navigate('/login')
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error)
            CustomToast("error", "Erreur lors de la déconnexion")
        }
    }

    useEffect(() => {
        if (onExpandChange) {
            onExpandChange(expanded);
        }
    }, [expanded, onExpandChange]);

    return (
        <aside
            className={`h-screen fixed left-0 top-0 z-30 flex flex-col transition-all duration-300 ease-in-out p-2 ${expanded ? "w-[285px]" : "w-28"}`}
        >
            <div className="absolute w-7 h-7 rounded-full flex items-center justify-center bg-primary right-0 z-10" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ArrowLeft size={15} className="text-secondary" /> : <ArrowRight size={15} className="text-secondary" />}
            </div>
            <div className="border h-full relative rounded-lg bg-background ml-2">
                <Link to="/">
                    <div className="flex items-center gap-3 px-4 py-4 border-b">
                        <img src="/main_logo.png" alt="" />
                    </div>
                </Link>
                <div className={`px-4 py-4 ${!expanded ? "flex justify-center" : ""}`}>
                    <div className={`relative px-2 gap-2 h-10 bg-input rounded-md flex items-center justify-center ${!expanded ? "w-10" : ""}`}>
                        <Search className=" h-6 w-6 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={expanded ? "Rechercher..." : ""}

                            className={`pl-4 h-full bg-transparent border-none shadow-none transition-all ${!expanded ? "w-10 px-0 rounded-full hidden" : ""}`}
                        />
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-2">
                    <div className="space-y-1">
                        {mainMenuItems.map((item, index) => (
                            <TooltipProvider key={index} delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to={item.name.toLowerCase() === "dashboard" ? "/dashboard" : `/dashboard/${item.name.toLowerCase()}`}>
                                            <Button
                                                variant="ghost"
                                                className={`relative w-full justify-start gap-3 px-3 py-6 h-12 font-normal transition-all
                                                    ${window.location.pathname === `/dashboard${item.name.toLowerCase() === "dashboard" ? "" : `/${item.name.toLowerCase()}`}`
                                                        ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-full"
                                                        : ""} 
                                                    ${!expanded ? "px-0 justify-center" : ""} 
                                                    group`}
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 shrink-0 ${window.location.pathname === `/dashboard${item.name.toLowerCase() === "dashboard" ? "" : `/${item.name.toLowerCase()}`}` ? "text-primary" : ""}`}
                                                />
                                                <span className={`transition-opacity ${!expanded ? "sr-only opacity-0" : ""}`}>
                                                    {item.name}
                                                </span>
                                                {item.badge && (
                                                    <Badge
                                                        variant="secondary"
                                                        className={`ml-auto bg-accent/10 text-primary group-hover:text-accent-foreground group-hover:bg-accent
                                                    ${!expanded ? "absolute top-1.5 right-1.5 w-5 h-5 p-0 flex items-center justify-center" : ""}`}
                                                    >
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </Button>

                                        </Link>
                                    </TooltipTrigger>
                                    {!expanded && (
                                        <TooltipContent side="right" className="font-medium ">
                                            {item.name}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <h3 className={`px-4 text-xs font-medium text-muted-foreground mb-2 ${!expanded ? "sr-only" : ""}`}>
                            PARAMÈTRES
                        </h3>
                        <div className="space-y-1">
                            {secondaryMenuItems.map((item, index) => (
                                <TooltipProvider key={index} delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link to={`/dashboard/${item.name.toLowerCase()}`}>
                                                <Button
                                                    variant="ghost"
                                                    className={`relative w-full justify-start gap-3 px-3 py-6 h-12 font-normal transition-all
                                                        ${window.location.pathname === `/dashboard/${item.name.toLowerCase()}`
                                                            ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-full"
                                                            : ""} 
                                                        ${!expanded ? "px-0 justify-center" : ""} 
                                                        group`}
                                                >
                                                    <item.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                                                    <span className={`transition-opacity ${!expanded ? "sr-only opacity-0" : ""}`}>{item.name}</span>
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        {!expanded && <TooltipContent side="right">{item.name}</TooltipContent>}
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Footer with user info */}
                <div className={`mt-auto mb-1 p-4 ${expanded ? "block" : "hidden"} absolute bottom-0`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src="https://static.vecteezy.com/system/resources/thumbnails/012/177/618/small/man-avatar-isolated-png.png"
                                    alt="Utilisateur"
                                />
                                <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium truncate w-[95%]">{user?.nom}</p>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                        </div>
                        <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className={`mt-auto border-t p-4 flex justify-center ${!expanded ? "block" : "hidden"}`}>
                    <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </aside>
    )
}

export default AppSideBar
