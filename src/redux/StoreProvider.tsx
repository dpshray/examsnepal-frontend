'use client'
import React from "react";
import {Provider} from "react-redux";
import {store} from "@/redux/Store";

// Previously gated behind a useState/useEffect "isClient" flag that returned
// null until after hydration. useEffect never runs during SSR, so that made
// EVERY page on the site (this wraps {children} in the root layout) render to
// an empty <body> on the server - zero text, zero links, nothing indexable -
// with real content only appearing after the JS bundle hydrated in the
// browser. That's not needed here: the store's initial state (players: [])
// is static with no localStorage/window reads, so there's no hydration
// mismatch to guard against by delaying render to client-only.
const StoreProvider = ({children}: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>{children}</Provider>
    )
}
export default StoreProvider