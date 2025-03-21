"use server";

export async function createCard(cardData: { name: string; img: string }) {
    const res = await fetch("http://your-backend-url/cards", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
        credentials: "include", // 로그인 정보를 포함해야 하면 추가
    });

    if (!res.ok) {
        throw new Error("카드 생성 실패");
    }

    return res.json();
}

export async function deleteCard(cardId: number) {
    const res = await fetch(`http://your-backend-url/cards/${cardId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("카드 삭제 실패");
    }
}
