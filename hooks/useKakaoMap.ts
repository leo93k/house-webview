"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { dummy } from "@/const";
import {
    createMarkers,
    createClusterer,
    getVisibleItems,
} from "@/utils/mapUtils";
import { PropertyItem } from "@/types/map";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        kakao: any;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initializeMap(container: HTMLDivElement): any {
    const centerLat = dummy.length > 0 ? dummy[0].lat : 37.4854;
    const centerLng = dummy.length > 0 ? dummy[0].lng : 127.0329;

    const options = {
        center: new window.kakao.maps.LatLng(centerLat, centerLng),
        level: 3,
        scrollwheel: true,
        disableDoubleClick: true,
        disableDoubleClickZoom: true,
    };

    const map = new window.kakao.maps.Map(container, options);
    map.setMaxLevel(10);
    map.setMinLevel(1);

    return map;
}

export function useKakaoMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [visibleItems, setVisibleItems] = useState<PropertyItem[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapInstanceRef = useRef<any>(null);
    const positionsRef =
        useRef<Array<{ lat: number; lng: number; itemId: number }>>(dummy);

    const updateVisibleItems = useCallback((sendPostMessage = false) => {
        if (!mapInstanceRef.current) return;
        const visible = getVisibleItems(
            mapInstanceRef.current,
            positionsRef.current
        );
        setVisibleItems(visible);

        if (sendPostMessage) {
            const messageData = {
                type: "VISIBLE_ITEMS_UPDATE",
                items: visible,
                count: visible.length,
                timestamp: new Date().toISOString(),
            };

            // 부모 창에 메시지 전송 (iframe인 경우)
            if (window.parent && window.parent !== window) {
                window.parent.postMessage(messageData, "*");
            }

            // 현재 창에도 메시지 전송
            window.postMessage(messageData, window.location.origin);
        }
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d7be39ccc2da7a5825dedbeb4d665277&autoload=false&libraries=clusterer`;
        script.async = true;

        script.onload = () => {
            if (window.kakao && window.kakao.maps && mapRef.current) {
                window.kakao.maps.load(() => {
                    const container = mapRef.current;
                    if (!container) return;

                    const map = initializeMap(container);
                    mapInstanceRef.current = map;

                    const seoulPositions = dummy;
                    positionsRef.current = seoulPositions;

                    const { markers } = createMarkers(seoulPositions, map);
                    createClusterer(map, markers);

                    updateVisibleItems(true);

                    let updateTimer: NodeJS.Timeout | null = null;

                    window.kakao.maps.event.addListener(map, "dragend", () => {
                        updateVisibleItems(true);
                    });

                    window.kakao.maps.event.addListener(
                        map,
                        "zoom_changed",
                        () => {
                            if (updateTimer) {
                                clearTimeout(updateTimer);
                            }
                            updateTimer = setTimeout(() => {
                                updateVisibleItems();
                            }, 300);
                        }
                    );
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
    }, [updateVisibleItems]);

    return { mapRef, visibleItems };
}
