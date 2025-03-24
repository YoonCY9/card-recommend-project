"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight, CreditCard} from "lucide-react";
import {CardFooter} from "@/components/ui/card";

// 카드 타입 정의
interface Card {
    id: number;
    name: string;
    img: string; // 이미지 경로 추가
    bnfContent: Array<string>;
    record: number;
    brand: string;
}

// 연령별 카드 ID 리스트 타입 정의
interface AgeCardMap {
    [key: string]: Array<number>;
}

const AgeBasedCardRecommendations = () => {
    const [selectedAge, setSelectedAge] = useState("20");
    const [cards, setCards] = useState<Array<Card>>([]);

    // 연령별 추천 카드 ID 매핑 - Array<number> 형태로 명시적 타입 지정
    const cardsByAge: AgeCardMap = {
        "20": [337, 563, 330, 613, 225],
        "30": [422, 341, 283, 197, 524],
        "40": [713, 426, 638, 520, 314],
        "50": [815, 723, 562, 418, 317],
    };

    // 백엔드 API 요청
    const fetchCards = async (ageGroup: string) => {
        const cardIdList: Array<number> = cardsByAge[ageGroup] || [];
        if (cardIdList.length === 0) return;

        const queryString = cardIdList.map((id) => `cardId=${id}`).join("&");

        try {
            const response = await fetch(`http://localhost:8080/cards?${queryString}`);
            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            console.log("서버 응답:", data);

            // 서버 응답 구조에 맞게 데이터 처리
            if (data && data.cardResponse && Array.isArray(data.cardResponse)) {
                setCards(data.cardResponse); // cardResponse를 카드 리스트로 설정
            } else {
                console.error("예상치 못한 응답 형식:", data);
                setCards([]);
            }
        } catch (error) {
            console.error("카드 조회 실패:", error);
            setCards([]);
        }
    };

    // 연령 선택 시 카드 데이터 가져오기
    useEffect(() => {
        fetchCards(selectedAge);
    }, [selectedAge]);

    return (
        <main className="min-h-screen bg-mesh">
            <Link href="/main">
                <div className="absolute top-[1cm] left-[1cm] flex h-16 w-32 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                    메인으로
                </div>
            </Link>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col items-center justify-center mb-10 pt-6 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 floating">
                        <CreditCard className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-center mb-2 text-gradient">연령별 카드 추천 서비스</h1>
                    <p className="text-muted-foreground text-center max-w-md">
                        연령대별로 카드를 추천해드립니다.
                    </p>
                </div>
        <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg">

            <div className="flex mb-6 gap-2">
                {Object.keys(cardsByAge).map((age) => (
                    <button
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        className={`py-2 px-6 rounded-full ${
                            selectedAge === age ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {age}대
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-lg font-bold mb-4">{selectedAge}대 추천 카드 TOP 5</div>

                {cards && cards.length > 0 ? (
                    <ul className="space-y-4">
                        {cards.map((card, index) => (
                            <li
                                key={card.id}
                                className={`flex items-center p-4 rounded-lg shadow-sm border 
                                  ${index === 0
                                    ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white transform scale-105 transition-transform duration-200"
                                    : "bg-white text-gray-800"
                                }
                                `}
                            >
                                <span className="text-2xl font-bold mr-4">
                                    {index === 0 ? "TOP 1" : index + 1}
                                </span>
                                <img
                                    src={card.img}
                                    alt={card.name}
                                    className="w-100 h-20 object-cover rounded-md mr-4"
                                />
                                <div className="flex flex-col">
                                    <p className={`text-lg font-semibold ${index === 0 ? "text-white" : "text-gray-900"}`}>{card.name}</p>
                                    <p className={`text-sm ${index === 0 ? "text-gray-300" : "text-gray-500"}`}>{card.brand}</p>
                                    <CardFooter className="pt-4 mt-auto">
                                        <Link href={`/cards/${card.id}`} className="w-full">
                                            <Button className="w-full bg-black  text-white transition-colors">
                                                <span>상세 정보</span>
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>추천할 카드가 없습니다.</p>
                )}
            </div>
        </div>
            </div>
        </main>
    );
};

export default AgeBasedCardRecommendations;
