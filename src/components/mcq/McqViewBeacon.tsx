'use client';

import {useEffect} from 'react';
import mcqService from '@/services/McqService';

// /mcq pages are served from the ISR cache, so the backend no longer sees a
// request per visit - count the view from the browser instead.
export function McqViewBeacon({slug}: {slug: string}) {
    useEffect(() => {
        mcqService.recordView(slug).catch(() => {});
    }, [slug]);

    return null;
}
