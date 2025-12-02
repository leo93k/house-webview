"use client";

import { useCallback } from "react";
import { PropertyItem } from "../types/map.types";
import {
    MessageType,
    VisibleItemsUpdateMessage,
} from "../types/mapPostMessage.types";
import { MapPostMessageService } from "../services/mapPostMessage.service";

export function useMapPostMessage() {
    const sendVisibleItemsUpdate = useCallback((items: PropertyItem[]) => {
        const message: VisibleItemsUpdateMessage = {
            type: MessageType.VISIBLE_ITEMS_UPDATE,
            items,
            count: items.length,
            timestamp: new Date().toISOString(),
        };
        MapPostMessageService.send(message);
    }, []);

    return {
        sendVisibleItemsUpdate,
    };
}
