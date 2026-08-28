"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * Full-image announcement shown every time the public site loads.
 * Dismissible via the close button, outside click, or Esc.
 */
const AnnouncementPopup = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                showCloseButton={false}
                className="max-w-[calc(100%-1.5rem)] overflow-visible border-0 bg-transparent p-0 shadow-none sm:max-w-2xl lg:max-w-3xl"
            >
                <DialogTitle className="sr-only">
                    बाढी पहिरो पीडितका लागि सहयोग अपिल
                </DialogTitle>
                <Image
                    src="/images/flood-relief-notice.png"
                    alt="हालैको बाढी पहिरोबाट ज्यान गुमाउनेप्रति हार्दिक समवेदना — पीडित परिवारलाई सहयोगका लागि Exams Nepal परिवारको अपिल"
                    width={1254}
                    height={1254}
                    priority
                    className="h-auto w-full rounded-lg"
                />
                <DialogClose
                    aria-label="Close"
                    className="absolute -top-3 -right-3 rounded-full bg-white p-1.5 text-gray-900 shadow-md transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                    <XIcon className="h-4 w-4" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default AnnouncementPopup;
