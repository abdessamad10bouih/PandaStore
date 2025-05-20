import { CreditCard, Keyboard, LayoutDashboard, LogOut, LogOutIcon, Mail, MessageSquare, Plus, PlusCircle, Settings, User, UserPlus, Users } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import React from 'react'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { useAuth } from '../../context/useAuth'
import { logout } from '../../lib/api'
import CustomToast from '../../components/CustomToast'
import { Link, useNavigate } from 'react-router-dom'

const DropDownUser = () => {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const Logout = async () => {
        try {
            const res = await logout()
            console.log(res)
            CustomToast('success', res.message || "Vous avez été déconnecté avec succès")
            setUser(null)
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (error) {
            console.error('Error during logout:', error)
            CustomToast('error', 'Logout', 'An error occurred while logging out')
        }
    }
    return (
        <DropdownMenu modal={false} >
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className={'text-sm'}>
                        <img src="https://www.iconarchive.com/download/i135263/microsoft/fluentui-emoji-mono/Panda.1024.png" alt="" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex items-center gap-2'>
                    <User className='text-muted-foreground' />
                    Profile
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                    <Link to='/dashboard'>
                        <DropdownMenuItem className='flex items-center gap-2'>
                            <LayoutDashboard className='text-muted-foreground' />
                            Dashboard
                        </DropdownMenuItem>
                    </Link>
                )}
                <DropdownMenuItem className='flex items-center gap-2' onClick={Logout}>
                    <LogOutIcon className='text-muted-foreground' />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDownUser