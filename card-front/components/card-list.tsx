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

// 페이지 응답 타입 추가
interface PageResponse {
    totalPages: number
    totalCount: number
    currentPage: number
    pageSize: number
    cardResponse: CardResponse[]
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
    //페이지 (1부터 시작)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

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
        //페이지 추가
        const fetchCards = async () => {
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

            // 페이지 파라미터 추가 (페이지는 0부터 시작하는 경우 -1 처리)
            params.append("page", currentPage.toString())
            params.append("size", "10") // 페이지당 카드 수


            setLoading(true)
            setError(null)

            try {
                const res = await fetch(`http://localhost:8080/cards?${params.toString()}`)

                if (!res.ok) {
                    throw new Error("네트워크 응답이 올바르지 않습니다.")
                }

                // 응답을 PageResponse 형태로 받음
                const pageData = await res.json() as PageResponse

                // 카드 데이터와 페이지 정보 설정
                setCards(pageData.cardResponse)
                setTotalPages(pageData.totalPages)
                setLoading(false)
            } catch (err) {
                console.error("카드 데이터를 불러오는 중 오류:", err)
                setError("카드를 불러오는 데 실패했습니다.")
                setLoading(false)
            }
        }

        fetchCards() // 함수 호출
    }, [filters, currentPage])


    // 페이지네이션 버튼을 생성하는 함수
    const generatePaginationButtons = () => {
        const buttons = []
        const maxVisibleButtons = 5 // 한 번에 보여줄 최대 버튼 수

        // 페이지 인덱스는 0부터 시작하므로 화면에 표시할 때는 +1
        const displayPage = currentPage + 1

        let startPage = Math.max(1, displayPage - Math.floor(maxVisibleButtons / 2))
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1)

        if (endPage - startPage + 1 < maxVisibleButtons) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1)
        }

        // 이전 페이지 버튼
        if (currentPage > 0) { // 0보다 클 때만 이전 버튼 표시
            buttons.push(
                <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 border rounded">
                    이전
                </button>
            )
        }

        // 페이지 번호 버튼
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i - 1)} // 버튼 클릭시 실제 페이지 인덱스는 -1
                    className={`px-3 py-1 border rounded ${i === displayPage ? "bg-blue-500 text-white" : "bg-white"}`}
                >
                    {i}
                </button>
            )
        }

        // 다음 페이지 버튼
        if (currentPage < totalPages - 1) { // 마지막 페이지가 아닐 때만 다음 버튼 표시
            buttons.push(
                <button key="next" onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 border rounded">
                    다음
                </button>
            )
        }

        return buttons
    }





    if (loading) return <div>로딩 중...</div>
    if (error) return <div>{error}</div>

    return (
        <div>
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

            {/* 페이지네이션 UI */}
            <div className="flex justify-center mt-4 space-x-2">
                {generatePaginationButtons()}
            </div>
        </div>
    )
}
