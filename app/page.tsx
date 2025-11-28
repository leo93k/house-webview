"use client";

import { useKakaoMap } from "@/hooks/useKakaoMap";
import PropertySidebar from "@/components/PropertySidebar";

export default function Home() {
    const { mapRef, visibleItems } = useKakaoMap();

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                display: "flex",
            }}
        >
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
            {/* <PropertySidebar visibleItems={visibleItems} /> */}
        </div>
    );
}
