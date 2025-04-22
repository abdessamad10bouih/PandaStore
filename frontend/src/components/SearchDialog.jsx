import React, { useEffect } from "react"
import { Folder, HelpCircle, LayoutDashboard, Search, Settings, ShoppingBasket, Users } from "lucide-react"

import { Button } from "../components/ui/button"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../components/ui/command"
import { useNavigate } from "react-router-dom"
import { Separator } from "./ui/separator"

export default function SearchDialog() {
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const mainMenuItems = [
        { name: "Dashboard", icon: LayoutDashboard, badge: null },
        { name: "Products", icon: ShoppingBasket, badge: null },
        { name: "Fournisseurs", icon: Users, badge: 0 },
        { name: "Catégories", icon: Folder, badge: 0 },
    ]

    const secondaryMenuItems = [
        { name: "Paramètres", icon: Settings },
        { name: "Aide", icon: HelpCircle },
    ]

    const redirection = (name) => {
        navigate(`/${name}`)
        setOpen(false)
    }
    return (
        <>
            <Button variant="outline" className="w-full justify-between" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                </div>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type to search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        {mainMenuItems.map((item) => (
                            <CommandItem
                                onSelect={() => {
                                    redirection(item.name)
                                }}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </CommandItem>
                        ))}

                        <Separator />
                        {secondaryMenuItems.map((item) => (
                            <CommandItem
                                onSelect={() => {
                                    redirection(item.name)
                                }}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </CommandItem>
                        ))}

                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

