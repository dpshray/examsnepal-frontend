'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    MyPin,
    MyPinCard,
    MyPinCardSkeleton,
    Pin,
    PinCard,
} from '@/components/card/PinsCard';
import pinsService from '@/services/pinsService';
import Pagination from '@/components/Pagination';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BoxIcon, PanelsTopLeftIcon } from 'lucide-react';

export default function PinsClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const tabParam = searchParams.get('tab') || 'all';
    const [selectedTab, setSelectedTab] = useState<'all' | 'my'>(
        tabParam === 'my' ? 'my' : 'all'
    );

    const [allPins, setAllPins] = useState<Pin[]>([]);
    const [myPins, setMyPins] = useState<MyPin[]>([]);
    const [loading, setLoading] = useState(false);

    const [allPinsCurrentPage, setAllPinsCurrentPage] = useState(1);
    const [myPinsCurrentPage, setMyPinsCurrentPage] = useState(1);
    const [allPinsTotalPages, setAllPinsTotalPages] = useState(1);
    const [myPinsTotalPages, setMyPinsTotalPages] = useState(1);

    const fetchAllPins = async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await pinsService.getAllPins(page);
            setAllPins(response?.data?.data || []);
            setAllPinsTotalPages(Math.ceil(response?.data?.total / 10));
            setAllPinsCurrentPage(response?.data?.current_page || 1);
        } catch (error) {
            console.error('Error fetching all pins:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyPins = async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await pinsService.getMyPins(page);
            setMyPins(response?.data?.data || []);
            setMyPinsTotalPages(Math.ceil(response?.data?.total / 10));
            setMyPinsCurrentPage(response?.data?.current_page || 1);
        } catch (error) {
            console.error('Error fetching my pins:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnPin = async (pinId: number) => {
        setLoading(true);
        try {
            await pinsService.deletePin(pinId);
            toast.success('Pin unpinned successfully');
            fetchMyPins(myPinsCurrentPage);
        } catch (error) {
            console.error('Error unpinning pin:', error);
        } finally {
            setLoading(false);
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

        // Reset page number when switching tabs
        if (tab === 'all') {
            setAllPinsCurrentPage(1);
        } else {
            setMyPinsCurrentPage(1);
        }

        router.push(`?tab=${tab}`);
    };

    return (
        <main
            role="main"
            aria-label="Pinned notes"
            className="w-full p-4 max-w-7xl mx-auto flex flex-col gap-6"
        >
            <header className="flex flex-col gap-1">
                <h1 className="font-poppins text-3xl md:text-4xl font-bold leading-snug">
                    {selectedTab === 'all' ? 'All Pins' : 'My Pins'}
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                    {selectedTab === 'all'
                        ? 'All your pinned notes will be here.'
                        : 'Only notes pinned by you are shown here.'}
                </p>
            </header>

            <Tabs value={selectedTab} onValueChange={handleTabChange} className="mt-6">
                <ScrollArea>
                    <TabsList
                        role="tablist"
                        className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px"
                    >
                        <TabsTrigger
                            value="all"
                            className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                        >
                            <PanelsTopLeftIcon className="me-2 opacity-60" size={16} aria-hidden="true" />
                            All Pins
                        </TabsTrigger>
                        <TabsTrigger
                            value="my"
                            className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                        >
                            <BoxIcon className="me-2 opacity-60" size={16} aria-hidden="true" />
                            My Pins
                        </TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* All Pins Tab Content */}
                <TabsContent value="all">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <MyPinCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allPins.map((pin, index) => (
                                <PinCard
                                    key={index}
                                    pin={pin}
                                    index={(allPinsCurrentPage - 1) * 10 + index}
                                />
                            ))}
                        </div>
                    )}

                    {allPinsTotalPages > 1 && (
                        <div className="my-8 flex justify-center items-center">
                            <Pagination
                                totalPages={allPinsTotalPages}
                                currentPage={allPinsCurrentPage}
                                onPageChange={(page) => setAllPinsCurrentPage(page)}
                            />
                        </div>
                    )}
                </TabsContent>

                {/* My Pins Tab Content */}
                <TabsContent value="my" className="w-full">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <MyPinCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myPins.map((pin, index) => (
                                <MyPinCard
                                    key={index}
                                    pin={pin}
                                    index={(myPinsCurrentPage - 1) * 10 + index}
                                    onDeleteAction={handleUnPin}
                                />
                            ))}
                        </div>
                    )}

                    {myPinsTotalPages > 1 && (
                        <div className="my-8 flex justify-center items-center">
                            <Pagination
                                totalPages={myPinsTotalPages}
                                currentPage={myPinsCurrentPage}
                                onPageChange={(page) => setMyPinsCurrentPage(page)}
                            />
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    );
}
