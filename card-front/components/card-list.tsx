// components/CardList.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

// API 응답 타입 (CardResponse)
interface CardResponse {
    id: number
    name: string
    img: string
    bnfContent: string[]
    record: number
}

interface CardListProps {
    filters: {
        benefits: string[]
        brands: string[]
        monthlySpend: string[]
        annualFee: string[]
    }
}

export default function CardList({ filters }: CardListProps) {
    const [cards, setCards] = useState<CardResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 임의의 매핑 함수 (필요에 따라 수정)
    const mapMonthlySpendToRecord = (option: string): number | null => {
        switch (option) {
            case "under300k":
                return 300000
            case "300k-500k":
                return 500000
            case "500k-1m":
                return 1000000
            case "over1m":
                return 1000001
            default:
                return null
        }
    }

    const mapAnnualFeeToFee = (option: string): number | null => {
        switch (option) {
            case "free":
                return 0
            case "under10k":
                return 10000
            case "10k-30k":
                return 30000
            case "over30k":
                return 30001
            default:
                return null
        }
    }

    useEffect(() => {
        // 쿼리 파라미터 구성
        const params = new URLSearchParams()

        // 카드 브랜드 (cardBrand)
        if (filters.brands.length > 0) {
            filters.brands.forEach((brand) => params.append("cardBrand", brand))
        }

        // 월 사용액 (record): 여러 옵션이 있을 경우 첫번째 값 사용 (필요시 로직 수정)
        if (filters.monthlySpend.length > 0) {
            const recordValue = mapMonthlySpendToRecord(filters.monthlySpend[0])
            if (recordValue !== null) {
                params.append("record", recordValue.toString())
            }
        }

        // 연회비 (fee)
        if (filters.annualFee.length > 0) {
            const feeValue = mapAnnualFeeToFee(filters.annualFee[0])
            if (feeValue !== null) {
                params.append("fee", feeValue.toString())
            }
        }

        // 혜택 (benefit)
        if (filters.benefits.length > 0) {
            filters.benefits.forEach((benefit) => params.append("benefit", benefit))
        }

        setLoading(true)
        setError(null)

        fetch(`http://localhost:8080/cards?${params.toString()}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("네트워크 응답이 올바르지 않습니다.")
                }
                return res.json()
            })
            .then((data: CardResponse[]) => {
                setCards(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error("카드 데이터를 불러오는 중 오류:", err)
                setError("카드를 불러오는 데 실패했습니다.")
                setLoading(false)
            })
    }, [filters])

    if (loading) return <div>로딩 중...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="grid grid-cols-1 gap-4">
            {cards.map((card) => (
                <Card key={card.id} className="shadow-md">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-2">{card.name}</h2>
                        <img src={card.img} alt={card.name} className="w-full h-auto mb-2" />
                        <p>기록: {card.record}</p>
                        {card.bnfContent.map((bnf, idx) => (
                            <p key={idx}>{bnf}</p>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
