"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {usePathname, useRouter} from "next/navigation"
import {BadgeCheck, Bell, ChevronDown, ChevronsUpDown, CreditCard, LogOut, Sparkles, User,} from "lucide-react"
import {cn} from "@/lib/utils"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"

import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import studentService from "@/services/StudentService";
import { toast } from "sonner"

// Types
export type NavItem = {
    title: string
    url: string
    icon: React.ElementType
    items?: {
        title: string
        url: string
        icon: React.ElementType
    }[]
}

export type User = {
    name: string
    email: string
    avatar: string
}

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    navItems: NavItem[]
    user: User
}

export function AppSidebar({navItems, user, ...props}: AppSidebarProps) {
    const pathname = usePathname()
    const router = useRouter();
    const {isMobile} = useSidebar()
    const handleLogout = async () => {
        try {
            const response = await studentService.logout()
            if (response) {
                localStorage.removeItem("_at")
                localStorage.removeItem("_id")
                router.push("/login")
                toast.success(response?.message || " You have been Logged out successfully")
            }

        } catch (error) {
            console.error("Logout error:", error)
        }
    }
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href="/student/dashboard"
                                className="flex items-center gap-2 text-sm font-medium text-muted-900"
                            >
                                <Image
                                    src="/logo.svg"
                                    alt="Logo"
                                    width={400}
                                    height={400}
                                    className="w-full h-10 rounded-full"
                                    priority
                                    sizes="100vw"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className={''}>
                <SidebarGroup>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.title} className={' space-y-4'}>
                                {item.items ? (
                                    <Collapsible className="group/collapsible w-full">
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="w-full">
                                                <item.icon className="h-4 w-4"/>
                                                <span className={'flex-1'}>{item.title}</span>
                                                <ChevronDown
                                                    className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180"/>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            className={cn(
                                                                pathname === subItem.url
                                                                    ? "bg-gradient-to-l from-green-400 to-green-600 !text-white "
                                                                    : ""
                                                            )}
                                                        >
                                                            <Link href={subItem.url}>
                                                                <subItem.icon className="h-4 w-4 mr-2"/>
                                                                {subItem.title}
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={cn(
                                                pathname === item.url
                                                    ? "bg-gradient-to-l  from-green-400 to-green-600 !text-white"
                                                    : ""
                                            )}
                                        >
                                            <item.icon className="h-4 w-4"/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user.avatar} alt={user.name}/>
                                        <AvatarFallback className="rounded-lg">
                                            {user.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-none"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user.avatar} alt={user.name}/>
                                            <AvatarFallback className="rounded-lg">
                                                {user.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                          </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Sparkles className="mr-2 h-4 w-4"/>
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <BadgeCheck className="mr-2 h-4 w-4"/>
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard className="mr-2 h-4 w-4"/>
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Bell className="mr-2 h-4 w-4"/>
                                        Notifications
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail/>
        </Sidebar>
    )
}
