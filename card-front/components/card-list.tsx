"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import CardSkeleton from "./card-skeleton"

// API response type (CardResponse)
interface CardResponse {
    id: number
    name: string
    img: string
    bnfContent: string[]
    record: number
    brand: string
    domesticOfferAmount?: string
    overseasOfferAmount?: string
    bnfDetail?: string
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

    // Get card brand color
    const getCardBrandColor = (name: string) => {
        if (name.includes("신한")) return "bg-blue-50 text-blue-600 border-blue-200"
        if (name.includes("삼성")) return "bg-blue-50 text-blue-600 border-blue-200"
        if (name.includes("현대")) return "bg-gray-50 text-gray-600 border-gray-200"
        if (name.includes("KB") || name.includes("국민")) return "bg-yellow-50 text-yellow-600 border-yellow-200"
        if (name.includes("우리")) return "bg-green-50 text-green-600 border-green-200"
        return "bg-purple-50 text-purple-600 border-purple-200"
    }

    useEffect(() => {
        const fetchCards = async () => {
            try {
                setLoading(true)
                setError(null)

                const params = new URLSearchParams()

                if (filters.brands.length > 0) {
                    filters.brands.forEach((brand) => params.append("cardBrand", brand))
                }
                if (filters.monthlySpend.length > 0) {
                    const recordValue = mapMonthlySpendToRecord(filters.monthlySpend[0])
                    if (recordValue !== null) params.append("record", recordValue.toString())
                }
                if (filters.annualFee.length > 0) {
                    const feeValue = mapAnnualFeeToFee(filters.annualFee[0])
                    if (feeValue !== null) params.append("fee", feeValue.toString())
                }
                if (filters.benefits.length > 0) {
                    filters.benefits.forEach((benefit) => params.append("benefit", benefit))
                }

                // 1. fetch URL을 원래대로 변경
                const response = await fetch(`http://localhost:8080/cards?${params.toString()}`)
                if (!response.ok) throw new Error("Network response was not ok")

                const data: CardResponse[] = await response.json()
                setCards(data)
            } catch (err) {
                console.error("Error fetching cards:", err)
                setError("Failed to load cards.")
            } finally {
                setLoading(false)
            }
        }

        fetchCards()
    }, [filters])

    if (error) {
        return (
            <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 pulse">
                    <CreditCard className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">데이터를 불러올 수 없습니다</h3>
                <p className="text-red-600">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    다시 시도하기
                </Button>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gradient">
                    추천 카드
                    <Badge variant="secondary" className="ml-2 text-sm font-normal">
                        {loading ? "검색 중..." : `${cards.length}개 찾음`}
                    </Badge>
                </h2>

                {filters.brands.length > 0 || filters.monthlySpend.length > 0 || filters.benefits.length > 0 ? (
                    <Button variant="ghost" size="sm" className="text-xs">
                        필터 초기화
                    </Button>
                ) : null}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : cards.length === 0 ? (
                <div className="text-center py-16 bg-mesh rounded-xl border border-border">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4 floating">
                        <CreditCard className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">조건에 맞는 카드가 없습니다</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        다른 필터 조건으로 검색해보세요. 월 사용액이나 카드 브랜드 조건을 변경하면 더 많은 카드를 찾을 수 있습니다.
                    </p>
                    <Button variant="outline" className="mx-auto">
                        모든 카드 보기
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="transition-all duration-300 opacity-100">
                            <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20 card-shine card-3d flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge className={`${getCardBrandColor(card.brand)} px-2 py-0.5 text-xs font-medium`}>
                                            {card.brand.split(" ")[0]}
                                        </Badge>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <span>월 {(card.record / 10000).toFixed(0)}만원</span>
                                        </div>
                                    </div>
                                    <CardTitle className="mt-2 text-xl">{card.name}</CardTitle>
                                    <CardDescription className="line-clamp-1">
                                        {card.bnfDetail || "다양한 혜택을 제공하는 카드입니다"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2 flex-grow">
                                    <div className="relative overflow-hidden rounded-lg mb-4 bg-card-gradient p-4 h-48 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300">
                                        <div className="absolute inset-0 opacity-10 bg-mesh"></div>
                                        <img
                                            src={card.img || "/placeholder.svg?height=200&width=320"}
                                            alt={card.name}
                                            className="w-auto h-auto max-h-40 max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-110 relative z-10"
                                        />
                                        <div className="absolute top-2 right-2 z-20">
                                            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                                <Sparkles className="h-3 w-3" />
                                                <span>추천</span>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-2 left-2 right-2 z-20 bg-black/40 backdrop-blur-sm text-white text-xs p-2 rounded-md">
                                            <div className="flex justify-between items-center">
                                                <span>연회비: {card.record > 500000 ? "30,000원" : "10,000원"}</span>
                                                <span>포인트 적립률: {card.record > 800000 ? "1.5%" : "1.0%"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-sm font-medium mb-2 flex items-center">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
                                                주요 혜택
                                            </h4>
                                            <ul className="space-y-1.5">
                                                {card.bnfContent.map((bnf, idx) => (
                                                    <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                                        <span className="mr-1.5 text-primary">•</span>
                                                        {bnf}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4 mt-auto">
                                    <Button className="w-full bg-black hover:bg-black/90 text-white transition-colors">
                                        <span>상세 정보</span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

