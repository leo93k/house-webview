"use client";

import { PropertyItem } from "@/types/map";

interface PropertySidebarProps {
    visibleItems: PropertyItem[];
}

export default function PropertySidebar({ visibleItems }: PropertySidebarProps) {
    return (
        <div
            style={{
                width: "400px",
                height: "100%",
                backgroundColor: "#fff",
                borderLeft: "1px solid #e0e0e0",
                overflowY: "auto",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                }}
            >
                지역 목록 {visibleItems.length}개
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {visibleItems.map((item) => (
                    <div
                        key={item.itemId}
                        style={{
                            padding: "16px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#fff";
                        }}
                    >
                        <div
                            style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            매물 ID: {item.itemId}
                        </div>
                    </div>
                ))}
                {visibleItems.length === 0 && (
                    <div
                        style={{
                            textAlign: "center",
                            color: "#999",
                            padding: "40px 0",
                        }}
                    >
                        화면에 보이는 매물이 없습니다
                    </div>
                )}
            </div>
        </div>
    );
}

