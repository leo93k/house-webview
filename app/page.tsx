"use client";

import { useKakaoMap, KakaoMapContainer } from "@/src/features/map/index";

export default function Home() {
    const { mapRef } = useKakaoMap();

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                display: "flex",
            }}
        >
            <KakaoMapContainer mapRef={mapRef} />
        </div>
    );
}
