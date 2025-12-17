'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {MyPin, MyPinCard, Pin, PinCard} from '@/components/card/PinsCard';
import pinsService from '@/services/pinsService';
import CustomPagination from '@/components/Pagination';
import {BoxIcon, FileText, PanelsTopLeftIcon, PinIcon, Search,} from 'lucide-react';
import ErrorComponent from "@/components/state/ErrorComponent";
import { toast } from 'sonner';


const EmptyState = ({type}: { type: 'all' | 'my' }) => (
    <Card className="max-w-md mx-auto text-center p-6">
        <CardHeader>
            <div className="flex justify-center mb-4">
                {type === 'all' ? (
                    <Search className="h-16 w-16 text-gray-400"/>
                ) : (
                    <PinIcon className="h-16 w-16 text-gray-400"/>
                )}
            </div>
            <CardTitle
                className="text-xl text-gray-600">{type === 'all' ? 'No Pins Available' : 'No Pins Created Yet'}</CardTitle>
            <CardDescription className="text-gray-500">
                {type === 'all'
                    ? 'There are currently no pins available to display.'
                    : "You haven't created any pins yet. Start pinning your favorite notes!"}
            </CardDescription>
        </CardHeader>
    </Card>
);

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({length: 10}).map((_, i) => (
            <Card key={i} className="animate-pulse">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24"/>
                        <Skeleton className="h-6 w-16"/>
                    </div>
                    <Skeleton className="h-5 w-3/4"/>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-5/6"/>
                        <Skeleton className="h-4 w-4/6"/>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <Skeleton className="h-4 w-20"/>
                        <Skeleton className="h-8 w-20"/>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function PinsClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const tabParam = searchParams.get('tab') || 'all';
    const [selectedTab, setSelectedTab] = useState<'all' | 'my'>(tabParam === 'my' ? 'my' : 'all');

    const [allPins, setAllPins] = useState<Pin[]>([]);
    const [myPins, setMyPins] = useState<MyPin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [allPinsCurrentPage, setAllPinsCurrentPage] = useState(1);
    const [myPinsCurrentPage, setMyPinsCurrentPage] = useState(1);
    const [allPinsTotalPages, setAllPinsTotalPages] = useState(1);
    const [myPinsTotalPages, setMyPinsTotalPages] = useState(1);

    const fetchAllPins = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await pinsService.getAllPins(page);
            setAllPins(response?.data?.data || []);
            setAllPinsTotalPages(Math.ceil((response?.data?.total || 1) / 10));
            setAllPinsCurrentPage(response?.data?.current_page || 1);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to fetch pins';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyPins = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await pinsService.getMyPins(page);
            setMyPins(response?.data?.data || []);
            setMyPinsTotalPages(Math.ceil((response?.data?.total || 1) / 10));
            setMyPinsCurrentPage(response?.data?.current_page || 1);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to fetch your pins';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnPin = async (pinId: number) => {
        try {
            await pinsService.deletePin(pinId);
            toast.success('Pin unpinned successfully');
            await fetchMyPins(myPinsCurrentPage);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to unpin';
            toast.error(message);
        }
    };

    const handleRetry = () => {
        if (selectedTab === 'all') {
            fetchAllPins(allPinsCurrentPage);
        } else {
            fetchMyPins(myPinsCurrentPage);
        }
    };

    useEffect(() => {
        if (selectedTab === 'all') {
            fetchAllPins(allPinsCurrentPage);
        } else {
            fetchMyPins(myPinsCurrentPage);
        }
    }, [selectedTab, allPinsCurrentPage, myPinsCurrentPage]);

    const handleTabChange = (val: string) => {
        const tab = val === 'my' ? 'my' : 'all';
        setSelectedTab(tab);
        setError(null);

        if (tab === 'all') {
            setAllPinsCurrentPage(1);
        } else {
            setMyPinsCurrentPage(1);
        }

        router.push(`?tab=${tab}`);
    };

    const currentPins = selectedTab === 'all' ? allPins : myPins;
    const currentPage = selectedTab === 'all' ? allPinsCurrentPage : myPinsCurrentPage;
    const totalPages = selectedTab === 'all' ? allPinsTotalPages : myPinsTotalPages;
    const setCurrentPage = selectedTab === 'all' ? setAllPinsCurrentPage : setMyPinsCurrentPage;

    const pinsTabs = [
        {
            value: 'all',
            label: 'All Pins',
            icon: PanelsTopLeftIcon,
        },
        {
            value: 'my',
            label: 'My Pins',
            icon: BoxIcon,
        },
    ];

    return (
        <main
            role="main"
            aria-label="Pinned notes"
            className="w-full p-4 max-w-7xl mx-auto flex flex-col gap-6"
        >
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary"/>
                    <h1 className="font-poppins text-3xl md:text-4xl font-bold leading-snug">
                        {selectedTab === 'all' ? 'All Pins' : 'My Pins'}
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">
                    {selectedTab === 'all'
                        ? 'Discover and explore all pinned notes from the community.'
                        : 'Manage your personal collection of pinned notes.'}
                </p>
                {currentPins.length > 0 && (
                    <Badge variant="outline" className="w-fit">
                        {currentPins.length} pin{currentPins.length !== 1 ? 's' : ''}
                    </Badge>
                )}
            </header>

            <ErrorComponent error={error} onRetry={handleRetry}/>

            <Tabs value={selectedTab} onValueChange={handleTabChange} className="mt-6">
                <TabsList
                    role="tablist"
                    className="relative mb-6 h-auto w-full gap-2 bg-gray-300 p-1 rounded-lg flex"
                >
                    {pinsTabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex-1 gap-2 rounded-md  px-4 font-medium   transition-all data-[state=active]:bg-green-600 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm flex items-center justify-center"
                        >
                            <tab.icon className="h-4 w-4"/>
                            {tab.label}
                            {tab.value === 'all' && allPins.length > 0 && (
                                <Badge variant="secondary" className="ml-1 text-xs">
                                    {allPins.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                    {loading ? (
                        <LoadingSkeleton/>
                    ) : currentPins.length === 0 ? (
                        <EmptyState type="all"/>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                            {allPins.map((pin, index) => (
                                <div
                                    key={`all-pin-${pin.id || index}`}
                                    className="animate-in fade-in-0 slide-in-from-bottom-4"
                                    style={{animationDelay: `${index * 100}ms`}}
                                >
                                    <PinCard pin={pin} index={(allPinsCurrentPage - 1) * 10 + index}/>
                                </div>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center pt-8">
                            <CustomPagination totalPages={allPinsTotalPages} currentPage={allPinsCurrentPage}
                                              onPageChangeAction={setAllPinsCurrentPage}/>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="my" className="space-y-6">
                    {loading ? (
                        <LoadingSkeleton/>
                    ) : currentPins.length === 0 ? (
                        <EmptyState type="my"/>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myPins.map((pin, index) => (
                                <div
                                    key={`my-pin-${pin.id || index}`}
                                    className="animate-in fade-in-0 slide-in-from-bottom-4"
                                    style={{animationDelay: `${index * 100}ms`}}
                                >
                                    <MyPinCard pin={pin} index={(myPinsCurrentPage - 1) * 10 + index}
                                               onDeleteAction={handleUnPin}/>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center pt-8">
                            <CustomPagination
                                totalPages={myPinsTotalPages}
                                currentPage={myPinsCurrentPage}
                                onPageChangeAction={setMyPinsCurrentPage}
                            />
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    );
}
