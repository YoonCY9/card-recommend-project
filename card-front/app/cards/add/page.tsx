"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateCardPage() {
    const router = useRouter();

    const benefitOptions = [
        { value: "SHOPPING_RETAIL", label: "쇼핑/유통" },
        { value: "FOOD_BEVERAGE", label: "식음료" },
        { value: "TRANSPORT_AUTOMOBILE", label: "교통/자동차" },
        { value: "TRAVEL_AIRLINE", label: "여행/항공" },
        { value: "CULTURE_LEISURE", label: "문화/레저" },
        { value: "LIVING_SERVICES", label: "생활서비스" },
        { value: "EDUCATION_CHILDCARE", label: "교육/육아" },
        { value: "FINANCIAL_SERVICES", label: "금융서비스" },
        { value: "DIGITAL_SERVICES", label: "디지털서비스" },
        { value: "TELECOM_MISC", label: "통신/기타" },
    ];

    const [card, setCard] = useState({
        cardBrand: "",
        cardName: "",
        domesticOffer: {
            type: "",  // "Domestic" 또는 null
            amount: 0,   // 숫자 값
        },
        overseasOffer: {
            type: "",  // "Overseas" 또는 null
            amount: 0,   // 숫자 값
        },
        cardImage: "",
        record: 0,
        cardOverseas: [""], // 해외 사용 브랜드 배열
    });

    const [benefit, setBenefit] = useState({
        bnfName: "",
        bnfContent: "",
        bnfDetail: "",
    });

    // 🔹 로그인 상태 확인 (토큰 체크)
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            router.push("/login");
        }
    }, [router]);

    // 🔹 카드 입력 변경
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setCard((prev) => {
            if (name === "domesticOfferAmount") {
                return { ...prev, domesticOffer: { ...prev.domesticOffer, amount: value ? Number(value) : 0 } };
            } else if (name === "overseasOfferAmount") {
                return { ...prev, overseasOffer: { ...prev.overseasOffer, amount: value ? Number(value) : 0 } };
            } else if (name === "Domestic") {
                return { ...prev, domesticOffer: { ...prev.domesticOffer, type: value } };  // ✅ "Domestic" 또는 ""
            } else if (name === "Overseas") {
                return { ...prev, overseasOffer: { ...prev.overseasOffer, type: value } };  // ✅ "Overseas" 또는 ""
            } else if (name === "record") {
                return { ...prev, record: value ? Number(value) : 0 };  // ✅ 0으로 대체
            }
            return { ...prev, [name]: value };
        });
    };
    // 🔹 배열 입력 변경 (해외 사용 브랜드)
    const handleArrayChange = (index: number, value: string) => {
        const newCardOverseas = [...card.cardOverseas];
        newCardOverseas[index] = value;
        setCard((prev) => ({ ...prev, cardOverseas: newCardOverseas }));
    };

    // 🔹 해외 사용 브랜드 추가 버튼
    const addOverseasBrand = () => {
        setCard((prev) => ({ ...prev, cardOverseas: [...prev.cardOverseas, ""] }));
    };

    // 🔹 혜택 입력 변경
    const handleBenefitChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setBenefit((prev) => ({ ...prev, [name]: value }));
    };
    // 🔹 카드 및 혜택 생성 요청
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🔥 쿠키에서 accessToken 가져오기
        const getCookie = (name: string) => {
            const cookies = document.cookie.split('; ');
            const found = cookies.find((cookie) => cookie.startsWith(`${name}=`));
            return found ? found.split('=')[1] : null;
        };
        const token = getCookie('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            router.push("/login");
            return;
        }
        const cleanCardData = (card) => {
            const cleanedCard = JSON.parse(JSON.stringify(card, (key, value) => {
                if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
                    return undefined;
                }
                return value;
            }));
            return cleanedCard;
        };
        // ✅ 불필요한 `null` 값 제거
        const cleanedCard = cleanCardData(card);

        // 🔥 요청 전에 최종 데이터 확인 로그 추가
        console.log("🚀 최종 전송 데이터:", JSON.stringify(cleanedCard, null, 2));

        try {
            // 1️⃣ 카드 생성 요청
            const cardResponse = await fetch("http://localhost:8080/cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // 🔥 토큰 추가
                },
                credentials: "include",
                body: JSON.stringify(cleanedCard),

            });

            if (!cardResponse.ok) throw new Error("카드 생성 실패");

            const createdCard = await cardResponse.json();


            // 2️⃣ 생성된 카드의 ID로 혜택 생성 요청
            const benefitResponse = await fetch("http://localhost:8080/cardbenefit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify({
                    ...benefit,
                    bnfName: benefit.bnfName.toUpperCase(), // ✅ Enum 값 변환
                    cardId: createdCard.id,  // ✅ 카드 ID만 전달 (Card 객체 아님)
                }),
            });

            if (!benefitResponse.ok) throw new Error("혜택 생성 실패");

            const createdBenefit = await benefitResponse.json();
            console.log("🎉 카드 및 혜택 생성 완료!", createdBenefit);

            alert("카드 및 혜택 생성 성공!");
        } catch (error) {
            console.error(error);
            alert("생성 실패");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-4">카드 & 혜택 생성</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 카드 입력 */}
                <input type="text" name="cardBrand" placeholder="카드 브랜드" value={card.cardBrand} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="text" name="cardName" placeholder="카드 이름" value={card.cardName} onChange={handleChange} className="w-full p-2 border rounded" />

                {/* 국내 사용 여부 (ENUM) */}
                <select name="Domestic" value={card.domesticOffer.type} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Domestic">국내 사용 가능</option>
                    <option value="">국내 사용 불가</option>
                </select>

                <input type="number" name="domesticOfferAmount" placeholder="국내 혜택 금액" value={card.domesticOffer.amount} onChange={handleChange} className="w-full p-2 border rounded" />

                {/* 해외 사용 여부 (ENUM) */}
                <select name="Overseas" value={card.overseasOffer.type} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Overseas">해외 사용 가능</option>
                    <option value="">해외 사용 불가</option>
                </select>

                <input type="number" name="overseasOfferAmount" placeholder="해외 혜택 금액" value={card.overseasOffer.amount} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="text" name="cardImage" placeholder="카드 이미지 URL" value={card.cardImage} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="number" name="record" placeholder="전월 실적" value={card.record} onChange={handleChange} className="w-full p-2 border rounded" />

                {/* 해외 사용 브랜드 추가 */}
                {card.cardOverseas.map((content, index) => (
                    <input key={index} type="text" placeholder="해외 사용 브랜드" value={content} onChange={(e) => handleArrayChange(index, e.target.value)} className="w-full p-2 border rounded" />
                ))}
                <button type="button" onClick={addOverseasBrand} className="w-full bg-gray-300 py-2 rounded">해외 브랜드 추가</button>

                {/* 혜택 입력 */}
                {/* ✅ 혜택 이름 선택을 드롭다운으로 변경 */}
                <select name="bnfName" value={benefit.bnfName} onChange={handleBenefitChange} className="w-full p-2 border rounded">
                    <option value="">혜택 카테고리 선택</option>
                    {benefitOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <input type="text" name="bnfContent" placeholder="혜택 내용" value={benefit.bnfContent} onChange={handleBenefitChange} className="w-full p-2 border rounded" />
                <input type="text" name="bnfDetail" placeholder="혜택 상세" value={benefit.bnfDetail} onChange={handleBenefitChange} className="w-full p-2 border rounded" />

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">카드 & 혜택 생성</button>
            </form>
        </div>
    );
}
