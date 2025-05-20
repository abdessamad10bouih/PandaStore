
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Bell, Search } from "lucide-react"
import { Input } from "./ui/input"
import SearchDialog from "./SearchDialog"

const Navbar = ({
    user 
}) => {
    return (
        <div className="w-full h-16 bg-card flex items-center justify-between px-4 border-b">
            <div className="w-[50%] h-full flex items-center">
                <div className="w-[80%] h-[70%] flex items-center px-3">
                    <SearchDialog />
                </div>
            </div>
            <div className="w-[50%] h-full flex items-center justify-end gap-4">
                <div className="relative flex items-center gap-4 cursor-pointer">
                    <span className="w-5 h-5 bg-destructive rounded-full absolute -top-1 -right-1 flex items-center justify-center text-[10px] text-white">
                        2
                    </span>
                    <Bell className="h-5 w-5" />
                </div>
                <Avatar>
                    <AvatarImage src="https://avatars.githubusercontent.com/u/151373460?v=4" alt="User" />
                    <AvatarFallback>{user?.nom?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="h-full flex flex-col justify-center">
                    <h1 className="font-bold text-lg tracking-tight">{user?.nom?.split(" ").splice(-1)}</h1>
                    <p className="text-xs text-muted-foreground">{user?.role} Dashboard</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar

