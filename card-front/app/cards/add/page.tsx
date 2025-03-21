"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateCardPage() {
    const router = useRouter();
    const [card, setCard] = useState({
        cardBrand: "",
        cardName: "",
        Domestic: false,
        domesticOfferAmount: 0,
        Overseas: false,
        overseasAmount: 0,
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
        setCard((prev) => ({
            ...prev,
            [name]: name === "domesticOfferAmount" || name === "overseasAmount" || name === "record"
                ? Number(value)  // 숫자 값 변환
                : name === "Domestic" || name === "Overseas"
                    ? value === "true" // Boolean 변환
                    : value,
        }));
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
    const handleBenefitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBenefit((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 카드 및 혜택 생성 요청
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            router.push("/login");
            return;
        }

        try {
            // 1️⃣ 카드 생성 요청
            const cardResponse = await fetch("http://localhost:8080/cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // 🔥 토큰 추가
                },
                body: JSON.stringify(card),
            });

            if (!cardResponse.ok) throw new Error("카드 생성 실패");

            const createdCard = await cardResponse.json();
            console.log("✅ 생성된 카드:", createdCard);

            // 2️⃣ 생성된 카드의 ID로 혜택 생성 요청
            const benefitResponse = await fetch("http://localhost:8080/cardbenefit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...benefit,
                    cardId: createdCard.id, // 카드 ID를 혜택 데이터에 추가
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

                {/* 국내 사용 여부 (Boolean) */}
                <select name="Domestic" value={String(card.Domestic)} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="true">국내 사용 가능</option>
                    <option value="false">국내 사용 불가</option>
                </select>

                <input type="number" name="domesticOfferAmount" placeholder="국내 혜택 금액" value={card.domesticOfferAmount} onChange={handleChange} className="w-full p-2 border rounded" />

                {/* 해외 사용 여부 (Boolean) */}
                <select name="Overseas" value={String(card.Overseas)} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="true">해외 사용 가능</option>
                    <option value="false">해외 사용 불가</option>
                </select>

                <input type="number" name="overseasAmount" placeholder="해외 혜택 금액" value={card.overseasAmount} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="text" name="cardImage" placeholder="카드 이미지 URL" value={card.cardImage} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="number" name="record" placeholder="전월 실적" value={card.record} onChange={handleChange} className="w-full p-2 border rounded" />

                {/* 해외 사용 브랜드 추가 */}
                {card.cardOverseas.map((content, index) => (
                    <input key={index} type="text" placeholder="해외 사용 브랜드" value={content} onChange={(e) => handleArrayChange(index, e.target.value)} className="w-full p-2 border rounded" />
                ))}
                <button type="button" onClick={addOverseasBrand} className="w-full bg-gray-300 py-2 rounded">해외 브랜드 추가</button>

                {/* 혜택 입력 */}
                <input type="text" name="bnfName" placeholder="혜택 이름" value={benefit.bnfName} onChange={handleBenefitChange} className="w-full p-2 border rounded" />
                <input type="text" name="bnfContent" placeholder="혜택 내용" value={benefit.bnfContent} onChange={handleBenefitChange} className="w-full p-2 border rounded" />
                <input type="text" name="bnfDetail" placeholder="혜택 상세" value={benefit.bnfDetail} onChange={handleBenefitChange} className="w-full p-2 border rounded" />

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">카드 & 혜택 생성</button>
            </form>
        </div>
    );
}
