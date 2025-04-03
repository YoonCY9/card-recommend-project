"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// API 응답 타입 정의 (CardResponse, PageResponse)
interface CardResponse {
    id: number;
    name: string;
    img: string;
    bnfContent: string[];
    record: number;
    brand: string;
    domesticOfferAmount: string;
    overseasOfferAmount: string;
    bnfDetail?: string;
    totalCount: number;
}

interface PageResponse {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    cardResponse: CardResponse[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 한글 라벨을 백엔드 Category enum 문자열로 매핑하는 함수
const mapLabelToCategory = (label: string): string => {
    const mapping: { [key: string]: string } = {
        "쇼핑/유통": "SHOPPING_RETAIL",
        "식음료": "FOOD_BEVERAGE",
        "교통/자동차": "TRANSPORT_AUTOMOBILE",
        "여행/항공": "TRAVEL_AIRLINE",
        "문화/레저": "CULTURE_LEISURE",
        "생활서비스": "LIVING_SERVICES",
        "교육/육아": "EDUCATION_CHILDCARE",
        "금융서비스": "FINANCIAL_SERVICES",
        "디지털서비스": "DIGITAL_SERVICES",
        "통신/기타": "TELECOM_MISC",
    };
    return mapping[label] || "";
};

const GraphPage = () => {
    const searchParams = useSearchParams();

    // 카테고리 키와 라벨 배열 (화면에 표시될 한글 라벨)
    const keys = [
        "shoppingRetail",
        "foodBeverage",
        "transportation",
        "travelAirline",
        "cultureLeisure",
        "lifestyleServices",
        "educationChildcare",
        "financialServices",
        "digitalServices",
        "communicationsOthers",
    ];
    const labels = [
        "쇼핑/유통",
        "식음료",
        "교통/자동차",
        "여행/항공",
        "문화/레저",
        "생활서비스",
        "교육/육아",
        "금융서비스",
        "디지털서비스",
        "통신/기타",
    ];

    // 쿼리스트링 값에서 숫자로 변환하여 데이터 배열 생성
    const dataValues = keys.map((key) => {
        const value = searchParams.get(key);
        return value ? parseInt(value) : 0;
    });

    // 총 사용 금액 계산
    const totalUsage = dataValues.reduce((acc, curr) => acc + curr, 0);

    // 최대 사용 금액과 해당 카테고리 찾기
    const maxValue = Math.max(...dataValues);
    const maxIndex = dataValues.indexOf(maxValue);
    const maxCategoryLabel = totalUsage > 0 ? labels[maxIndex] : "";
    // benefit 값으로 사용할 백엔드 enum 문자열
    const benefitValue = mapLabelToCategory(maxCategoryLabel);

    // 막대 그래프 색상 (최대값 강조)
    const backgroundColors = dataValues.map((value) =>
        value === maxValue && maxValue > 0
            ? "rgba(255, 99, 132, 0.7)"
            : "rgba(0, 112, 243, 0.5)"
    );
    const borderColors = dataValues.map((value) =>
        value === maxValue && maxValue > 0
            ? "rgba(255, 99, 132, 1)"
            : "rgba(0, 112, 243, 1)"
    );

    const data = {
        labels: labels.map((label, index) =>
            dataValues[index] === maxValue && maxValue > 0 ? `${label} (최대)` : label
        ),
        datasets: [
            {
                label: "월 소비 금액",
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        animation: {
            duration: 2000,
            easing: "easeOutBounce",
        },
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "카테고리별 월 소비 금액",
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = context.dataset.label || "";
                        if (label) label += ": ";
                        label += context.parsed.y;
                        if (context.parsed.y === maxValue && maxValue > 0) {
                            label += " (최대 사용)";
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    // 추천 카드 API 호출을 위한 상태 관리
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 총 사용 금액이 0이 아니고 benefit 값이 있을 때만 API 호출
        if (totalUsage > 0 && benefitValue) {
            setLoading(true);
            const params = new URLSearchParams();
            params.append("record", totalUsage.toString());
            // benefit 파라미터를 배열 형태로 전달 (여러 번 append)
            [benefitValue].forEach((benefit) => params.append("benefit", benefit));
            params.append("page", "1");
            params.append("size", "5");

            fetch(`http://localhost:8080/cards?${params.toString()}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("네트워크 응답이 올바르지 않습니다.");
                    }
                    return res.json();
                })
                .then((pageData: PageResponse) => {
                    setCards(pageData.cardResponse || []);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("카드 API 호출 에러:", err);
                    setError("카드 데이터를 불러오는 데 실패했습니다.");
                    setLoading(false);
                });
        }
    }, [totalUsage, benefitValue]);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>소비 내역 그래프</h1>
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                }}
            >
                총 사용금액: {totalUsage.toLocaleString()} 원
            </div>
            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem" }}>
                <Bar data={data} options={options} />
            </div>

            <div style={{ marginTop: "2rem", maxWidth: "600px", margin: "0 auto" }}>
                <h2>추천 카드</h2>
                {loading ? (
                    <p>카드를 불러오는 중입니다...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : cards.length > 0 ? (
                    <div style={{ display: "grid", gap: "1rem" }}>
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                }}
                            >
                                {/* 카드 이미지와 정보 */}
                                <div style={{ display: "flex", flex: "1", alignItems: "center" }}>
                                    <img
                                        src={card.img || "/placeholder.svg"}
                                        alt={card.name}
                                        style={{
                                            width: "100px",
                                            height: "auto",
                                            marginRight: "1rem",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <div>
                                        <h3 style={{ margin: "0 0 0.5rem 0" }}>{card.name}</h3>
                                        <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                                            {card.bnfContent.slice(0, 2).map((benefit, idx) => (
                                                <li key={idx} style={{ listStyleType: "disc" }}>
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {/* 오른쪽에 상세 조회 버튼 */}
                                <div>
                                    <Link href={`/cards/${card.id}`}>
                                        <button
                                            style={{
                                                padding: "0.3rem 0.7rem",
                                                fontSize: "0.875rem",
                                                backgroundColor: "#0070f3",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            상세 조회
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>추천 카드가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default GraphPage;
