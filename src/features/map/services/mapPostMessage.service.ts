import { PostMessage } from "../types/mapPostMessage.types";

export class MapPostMessageService {
    static send(message: PostMessage): void {
        // 부모 창에 메시지 전송 (iframe인 경우)
        if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, "*");
        }
        // 현재 창에도 메시지 전송
        window.postMessage(message, window.location.origin);
    }
}
