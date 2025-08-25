import {Suspense} from "react";
import PinsClient from "@/app/student/pins/PinsClient";


export default function PinsPage() {
    return (
        <Suspense fallback={<div>Loading pins...</div>}>
            <PinsClient />
        </Suspense>
    );
}