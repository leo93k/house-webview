"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { dummy } from "@/const";
import { PropertyItem } from "../types/map.types";
import { useMapPostMessage } from "./useMapPostMessage";
import {
    createMarkers,
    createClusterer,
    getVisibleItems,
} from "../components/MapMarkers";
import { KAKAO_MAP_SCRIPT_URL } from "../constants/map.constants";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        kakao: any;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initializeMap(container: HTMLDivElement): any {
    const zoomLevel = {
        min: 1,
        max: 10,
    };

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
    map.setMaxLevel(zoomLevel.max);
    map.setMinLevel(zoomLevel.min);

    return map;
}

function setupMapWithMarkers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapInstanceRef: React.MutableRefObject<any>,
    positionsRef: React.MutableRefObject<PropertyItem[]>,
    updateVisibleItems: (sendPostMessage?: boolean) => void
) {
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

    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
        if (updateTimer) {
            clearTimeout(updateTimer);
        }
        updateTimer = setTimeout(() => {
            updateVisibleItems();
        }, 300);
    });
}

export function useKakaoMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [visibleItems, setVisibleItems] = useState<PropertyItem[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapInstanceRef = useRef<any>(null);
    const positionsRef = useRef<PropertyItem[]>(dummy);
    const { sendVisibleItemsUpdate } = useMapPostMessage();

    const updateVisibleItems = useCallback(
        (sendPostMessage = false) => {
            if (!mapInstanceRef.current) return;
            const visible = getVisibleItems(
                mapInstanceRef.current,
                positionsRef.current
            );
            setVisibleItems(visible);

            if (sendPostMessage) {
                sendVisibleItemsUpdate(visible);
            }
        },
        [sendVisibleItemsUpdate]
    );

    const onLoadKakaoScript = useCallback(() => {
        const script = document.createElement("script");
        script.src = KAKAO_MAP_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
            if (window.kakao && window.kakao.maps && mapRef.current) {
                window.kakao.maps.load(() => {
                    const container = mapRef.current;
                    if (!container) return;
                    const map = initializeMap(container);
                    setupMapWithMarkers(
                        map,
                        mapInstanceRef,
                        positionsRef,
                        updateVisibleItems
                    );
                });
            }
        };
        document.head.appendChild(script);
    }, [updateVisibleItems]);

    useEffect(() => {
        onLoadKakaoScript();

        return () => {
            const existingScript = document.querySelector(
                'script[src*="dapi.kakao.com"]'
            );
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [onLoadKakaoScript, updateVisibleItems]);

    return { mapRef, visibleItems };
}
