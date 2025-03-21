import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const cardData = await req.json();
        console.log("📢 [프론트에서 받은 데이터]", cardData);

        const response = await fetch("http://localhost:8080/cards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("🚨 [서버 응답 오류]", errorText);
            return NextResponse.json({ error: "카드 생성 실패", details: errorText }, { status: 400 });
        }

        const card = await response.json();
        console.log("✅ [카드 생성 성공] 카드 정보:", card);

        return NextResponse.json(card, { status: 201 });
    } catch (error) {
        console.error("🚨 [API 요청 중 에러]", error);
        return NextResponse.json({ error: "서버 요청 실패" }, { status: 500 });
    }
}
