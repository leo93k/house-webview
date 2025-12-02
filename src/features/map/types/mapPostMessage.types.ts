import { PropertyItem } from "./map.types";

export const MessageType = {
    VISIBLE_ITEMS_UPDATE: "VISIBLE_ITEMS_UPDATE",
} as const;

export type MessageTypeValue = (typeof MessageType)[keyof typeof MessageType];

interface BaseMessage {
    type: MessageTypeValue;
    timestamp: string;
}

export interface VisibleItemsUpdateMessage extends BaseMessage {
    type: typeof MessageType.VISIBLE_ITEMS_UPDATE;
    items: PropertyItem[];
    count: number;
}

export type PostMessage = VisibleItemsUpdateMessage;
