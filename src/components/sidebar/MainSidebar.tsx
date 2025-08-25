"use client";

import React, {useEffect} from "react";
import {AppSidebar} from "@/components/sidebar/AppSideBar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation";
import Link from "next/link";


interface MainSidebarProps {
    children: React.ReactNode;
    navItems: {
        title: string;
        url: string;
        icon: React.ComponentType<any>;
        items?: {
            title: string;
            url: string;
            icon: React.ComponentType<any>;
        }[];
    }[];
    user: {
        name: string;
        email: string;
        avatar: string;
    }
}



const MainSidebar: React.FC<MainSidebarProps> = ({children, navItems, user}) => {
    const pathname = usePathname();
    const pathSegments = pathname
        .split("/")
        .filter((seg) => seg && isNaN(Number(seg)));

    const buildPath = (index: number) => {
        return "/" + pathSegments.slice(0, index + 1).join("/");
    };

    return (
        <SidebarProvider>
            <AppSidebar navItems={navItems} user={user}/>
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4 "/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                {pathSegments.map((segment, index) => {
                                    const isLast = index === pathSegments.length - 1;
                                    const href = buildPath(index);
                                    const label =
                                        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

                                    return (
                                        <React.Fragment key={href}>
                                            <BreadcrumbItem className="hidden md:block">
                                                {isLast ? (
                                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link href={href} className={'font-poppins font-medium'}>{label}</Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {!isLast && <BreadcrumbSeparator className="hidden md:block"/>}
                                        </React.Fragment>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4  pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )

};

export default MainSidebar;
