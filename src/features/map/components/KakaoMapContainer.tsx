"use client";

import { useRef } from "react";

interface KakaoMapContainerProps {
    mapRef: React.RefObject<HTMLDivElement | null>;
}

export default function KakaoMapContainer({
    mapRef,
}: KakaoMapContainerProps) {
    return (
        <div
            ref={mapRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
}

