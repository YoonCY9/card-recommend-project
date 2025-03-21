import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const benefitData = await req.json();

    const response = await fetch("http://localhost:8080/cardbenefit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(benefitData),
    });

    if (!response.ok) {
        return NextResponse.json({ error: "카드 혜택 생성 실패" }, { status: 400 });
    }

    const benefit = await response.json();
    return NextResponse.json(benefit, { status: 201 });
}
