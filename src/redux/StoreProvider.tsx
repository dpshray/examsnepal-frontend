'use client'
import React, {useEffect, useState} from "react";
import {Provider} from "react-redux";
import {store} from "@/redux/Srore";


;
const StoreProvider = ({children}: { children: React.ReactNode }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <>
            <Provider store={store}>{children}</Provider>
        </>
    )
}
export default StoreProvider