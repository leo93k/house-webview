"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        kakao: any;
    }
}

export default function Home() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d7be39ccc2da7a5825dedbeb4d665277&autoload=false&libraries=clusterer`;
        script.async = true;

        script.onload = () => {
            if (window.kakao && window.kakao.maps && mapRef.current) {
                window.kakao.maps.load(() => {
                    const container = mapRef.current;
                    const options = {
                        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울시청 좌표
                        level: 3, // 지도의 확대 레벨
                    };
                    new window.kakao.maps.Map(container, options);
                });
            }
        };

        document.head.appendChild(script);

        return () => {
            const existingScript = document.querySelector(
                'script[src*="dapi.kakao.com"]'
            );
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
            }}
        >
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}
