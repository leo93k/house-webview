// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMarkers(
    positions: Array<{ lat: number; lng: number; itemId: number }>,
    map: any
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markers: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const infowindows: any[] = [];

    positions.forEach((position) => {
        const markerPosition = new window.kakao.maps.LatLng(
            position.lat,
            position.lng
        );
        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">매물 ID: ${position.itemId}</div>`,
        });

        window.kakao.maps.event.addListener(marker, "click", function () {
            infowindows.forEach((iw) => iw.close());
            infowindow.open(map, marker);
        });

        markers.push(marker);
        infowindows.push(infowindow);
    });

    return { markers, infowindows };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClusterer(map: any, markers: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clusterer = new window.kakao.maps.MarkerClusterer({
        map: map,
        markers: markers,
        gridSize: 80,
        minClusterSize: 1,
        averageCenter: true,
        minLevel: 1,
        calculator: [10, 30, 50],
        styles: [
            {
                width: "30px",
                height: "30px",
                background: "rgba(51, 51, 51, 0.8)",
                borderRadius: "15px",
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: "30px",
            },
            {
                width: "40px",
                height: "40px",
                background: "rgba(51, 51, 51, 0.8)",
                borderRadius: "20px",
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: "40px",
            },
            {
                width: "50px",
                height: "50px",
                background: "rgba(51, 51, 51, 0.8)",
                borderRadius: "25px",
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: "50px",
            },
        ],
    });

    return clusterer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getVisibleItems(
    map: any,
    positions: Array<{ lat: number; lng: number; itemId: number }>
) {
    const bounds = map.getBounds();
    const swLat = bounds.getSouthWest().getLat();
    const swLng = bounds.getSouthWest().getLng();
    const neLat = bounds.getNorthEast().getLat();
    const neLng = bounds.getNorthEast().getLng();

    return positions.filter((position) => {
        return (
            position.lat >= swLat &&
            position.lat <= neLat &&
            position.lng >= swLng &&
            position.lng <= neLng
        );
    });
}

