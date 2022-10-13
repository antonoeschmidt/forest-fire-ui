export const connectWebsocket = (
    url: string,
    onMessage: (event: MessageEvent) => void,
    onOpen: (event: Event) => void,
    onError: (event: Event) => void
): WebSocket => {
    let ws = new WebSocket(url);
    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = onClose;

    return ws;
};

const onClose = (event: CloseEvent): void => {
    console.log(JSON.stringify(event));
};
