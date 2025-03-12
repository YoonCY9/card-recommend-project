"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    CreditCard,
    ShoppingBag,
    Utensils,
    Car,
    Plane,
    Tv,
    Home,
    GraduationCap,
    Landmark,
    Smartphone,
    Radio,
    Badge,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// API 응답 타입 (CardResponse)
interface CardResponse {
    id: number
    name: string
    img: string
    bnfContent: string[]
    record: number
    brand: string
    domesticOfferAmount: string
    overseasOfferAmount: string
    bnfDetail: string
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

    // 월 사용액 매핑
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

    // 연회비 매핑
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

    // 필터링 로직
    const filteredCards = cards.filter((card) => {
        if (filters.annualFee.length > 0) {
            const cardFee = card.domesticOfferAmount ? Number.parseInt(card.domesticOfferAmount.replace(/[^0-9]/g, "")) : 0
            if (
                !filters.annualFee.some((fee) => {
                    if (fee === "free" && cardFee === 0) return true
                    if (fee === "under10k" && cardFee < 10000) return true
                    if (fee === "10k-30k" && cardFee >= 10000 && cardFee <= 30000) return true
                    if (fee === "over30k" && cardFee > 30000) return true
                    return false
                })
            ) {
                return false
            }
        }
        return true
    })

    // 혜택 아이콘 매핑
    const getBenefitIcon = (benefit: string) => {
        switch (benefit) {
            case "SHOPPING_RETAIL":
                return <ShoppingBag className="h-4 w-4" />
            case "FOOD_BEVERAGE":
                return <Utensils className="h-4 w-4" />
            case "TRANSPORT_AUTOMOBILE":
                return <Car className="h-4 w-4" />
            case "TRAVEL_AIRLINE":
                return <Plane className="h-4 w-4" />
            case "CULTURE_LEISURE":
                return <Tv className="h-4 w-4" />
            case "LIVING_SERVICES":
                return <Home className="h-4 w-4" />
            case "EDUCATION_CHILDCARE":
                return <GraduationCap className="h-4 w-4" />
            case "FINANCIAL_SERVICES":
                return <Landmark className="h-4 w-4" />
            case "DIGITAL_SERVICES":
                return <Smartphone className="h-4 w-4" />
            case "TELECOM_MISC":
                return <Radio className="h-4 w-4" />
            default:
                return <CreditCard className="h-4 w-4" />
        }
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

                const response = await fetch(`http://localhost:8080/cards?${params.toString()}`)
                if (!response.ok) throw new Error("네트워크 응답이 올바르지 않습니다.")

                const data: CardResponse[] = await response.json()
                setCards(data)
            } catch (err) {
                console.error("카드 데이터를 불러오는 중 오류:", err)
                setError("카드를 불러오는 데 실패했습니다.")
            } finally {
                setLoading(false)
            }
        }

        fetchCards()
    }, [filters])

    if (loading) return <div>로딩 중...</div>
    if (error) return <div>{error}</div>

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">추천 카드 {filteredCards.length}개</h2>

            {filteredCards.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium">조건에 맞는 카드가 없습니다</p>
                    <p className="text-muted-foreground">다른 조건으로 검색해보세요</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredCards.map((card) => (
                        <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{card.name}</CardTitle>
                                <CardDescription>{card.bnfDetail}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h2 className="text-xl font-bold mb-2">{card.name}</h2>
                                <img src={card.img} alt={card.name} className="w-full h-auto mb-2" />
                                <p>월 사용액: {card.record}</p>
                                {card.bnfContent.map((bnf, idx) => (
                                    <p key={idx}>{bnf}</p>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">자세히 보기</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
