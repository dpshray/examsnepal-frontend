import {FC} from "react";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";

export interface BlogCardProps {
    title: string;
    description: string;
    imageUrl: string;
    author: {
        id: number;
        name: string;
        avatar: string;
    };
    publishedDate: string;
    readTime: string;
}

export const BlogCard: FC<BlogCardProps> = ({
                                                title,
                                                description,
                                                imageUrl,
                                                author,
                                                publishedDate,
                                                readTime,
                                            }) => {
    return (
        <article
            className="w-full max-w-[400px] h-[450px] rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:drop-shadow-xl transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400"
            tabIndex={0}
            aria-label={`Read blog post: ${title}`}
        >
            <div className="relative">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover rounded-t-lg hover:scale-105 transition duration-300 ease-in-out"
                    priority
                />
            </div>

            <div className="flex flex-col flex-1 justify-between px-4 py-4">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-justify leading-snug line-clamp-3">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center">
                        <Avatar>
                            <AvatarImage src={author.avatar} alt={`${author.name} avatar`}/>
                            <AvatarFallback>{author.name [0]}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                            <p className="font-medium text-sm text-gray-900">{author.name}</p>
                            <time dateTime={publishedDate} className="text-xs text-muted-foreground">
                                {publishedDate}
                            </time>
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{readTime} read</span>
                </div>
            </div>
        </article>
    );
};


export function BlogCardSkeleton() {
    return (
        <div
            className="w-full max-w-[400px] h-[450px] rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col animate-pulse">
            {/* Image skeleton */}
            <Skeleton className="w-full h-56 rounded-t-lg"/>

            <div className="flex flex-col flex-1 justify-between px-4 py-4">
                <div className="space-y-2">
                    {/* Title */}
                    <Skeleton className="h-5 w-3/4 rounded"/>
                    {/* Description lines */}
                    <Skeleton className="h-4 w-full rounded"/>
                    <Skeleton className="h-4 w-5/6 rounded"/>
                    <Skeleton className="h-4 w-3/4 rounded"/>
                </div>

                {/* Author section */}
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <Skeleton className="w-10 h-10 rounded-full"/>
                            <AvatarFallback>--</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24 rounded"/>
                            <Skeleton className="h-3 w-16 rounded"/>
                        </div>
                    </div>
                    <Skeleton className="h-3 w-12 rounded"/>
                </div>
            </div>
        </div>
    );
}