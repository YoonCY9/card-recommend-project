"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    ChevronDown,
    ChevronUp,
} from "lucide-react"
import CardSkeleton from "@/components/card-skeleton"

// --------------------------------------------------------
// DTO 및 타입 정의
// --------------------------------------------------------

interface CardBenefitResponse {
    bnfName: string // 카테고리 (영문)
    bnfContent: string
    bnfDetail: string
}

interface CardDetailResponse {
    id: number
    name: string
    brand: string
    img: string
    domesticOfferType: string
    domesticOfferAmount: number
    overseasOfferType: string
    overseasOfferAmount: number
    record: number
    cardOverseas: string[]
    benefits: CardBenefitResponse[]
}

// --------------------------------------------------------
// 매핑 정보
// --------------------------------------------------------

// 카테고리 영문명을 한글로 매핑
const categoryNameMap: Record<string, string> = {
    SHOPPING_RETAIL: "쇼핑/유통",
    FOOD_BEVERAGE: "식음료",
    TRANSPORT_AUTOMOBILE: "교통/자동차",
    TRAVEL_AIRLINE: "여행/항공",
    CULTURE_LEISURE: "문화/레저",
    LIVING_SERVICES: "생활서비스",
    EDUCATION_CHILDCARE: "교육/육아",
    FINANCIAL_SERVICES: "금융서비스",
    DIGITAL_SERVICES: "디지털서비스",
    TELECOM_MISC: "통신/기타",
}

// 각 혜택 항목의 대표 아이콘 매핑
const benefitIconMap: Record<string, React.ReactNode> = {
    SHOPPING_RETAIL: <ShoppingBag className="h-6 w-6 text-blue-500" />,
    FOOD_BEVERAGE: <Utensils className="h-6 w-6 text-orange-500" />,
    TRANSPORT_AUTOMOBILE: <Car className="h-6 w-6 text-green-500" />,
    TRAVEL_AIRLINE: <Plane className="h-6 w-6 text-purple-500" />,
    CULTURE_LEISURE: <Tv className="h-6 w-6 text-red-500" />,
    LIVING_SERVICES: <Home className="h-6 w-6 text-teal-500" />,
    EDUCATION_CHILDCARE: <GraduationCap className="h-6 w-6 text-indigo-500" />,
    FINANCIAL_SERVICES: <Landmark className="h-6 w-6 text-yellow-500" />,
    DIGITAL_SERVICES: <Smartphone className="h-6 w-6 text-pink-500" />,
    TELECOM_MISC: <Radio className="h-6 w-6 text-gray-500" />,
}

// --------------------------------------------------------
// 카드 상세 페이지 컴포넌트
// --------------------------------------------------------

export default function CardDetailPage() {
    const { cardId } = useParams()
    const router = useRouter()

    const [card, setCard] = useState<CardDetailResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // 각 혜택 항목의 상세보기 토글 상태 (index: boolean)
    const [expandedBenefits, setExpandedBenefits] = useState<Record<number, boolean>>({})

    // 개별 혜택 토글 핸들러
    const handleToggleBenefit = (index: number) => {
        setExpandedBenefits((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    // 카드 상세 정보 API 호출
    useEffect(() => {
        const fetchCardDetail = async () => {
            setLoading(true)
            try {
                const res = await fetch(`http://localhost:8080/cards/${cardId}`)
                if (!res.ok) {
                    throw new Error("네트워크 응답이 올바르지 않습니다.")
                }
                const data = (await res.json()) as CardDetailResponse
                setCard(data)
            } catch (err) {
                console.error("카드 상세 정보를 불러오는 중 오류:", err)
                setError("카드 상세 정보를 불러오는 데 실패했습니다.")
            }
            setLoading(false)
        }
        if (cardId) {
            fetchCardDetail()
        }
    }, [cardId])

    if (loading) {
        return <CardSkeleton />
    }

    if (error) {
        return (
            <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                    <CreditCard className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                    상세 정보를 불러올 수 없습니다
                </h3>
                <p className="text-red-600">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    다시 시도하기
                </Button>
            </div>
        )
    }

    if (!card) {
        return <div>카드 정보가 없습니다.</div>
    }

    return (
        // max-w-2xl로 너비를 넓혀 데스크탑에서 읽기 편하게 조정
        <div className="max-w-2xl mx-auto py-4 px-2">
            <Card className="shadow-md border-border overflow-hidden">
                {/* 카드 헤더 */}
                <CardHeader className="px-4 py-3">
                    {card.name && <CardTitle className="text-lg">{card.name}</CardTitle>}
                    {card.brand && (
                        <CardDescription className="text-sm text-muted-foreground">
                            {card.brand}
                        </CardDescription>
                    )}
                </CardHeader>

                {/* 카드 기본 정보 */}
                <CardContent className="px-4 py-3">
                    {card.img && (
                        <img
                            src={card.img}
                            alt={card.name}
                            className="w-full h-auto mb-4 rounded"
                        />
                    )}
                    <div className="space-y-2 text-sm">
                        {(card.record || card.record === 0) && (
                            <p>
                                <strong>월 사용액:</strong>{" "}
                                {(card.record / 10000).toFixed(0)}만원
                            </p>
                        )}
                        {(card.domesticOfferType || card.domesticOfferAmount) && (
                            <p>
                                <strong>국내 혜택:</strong>{" "}
                                {card.domesticOfferType} {card.domesticOfferAmount}원
                            </p>
                        )}
                        {(card.overseasOfferType || card.overseasOfferAmount) && (
                            <p>
                                <strong>해외 혜택:</strong>{" "}
                                {card.overseasOfferType} {card.overseasOfferAmount}원
                            </p>
                        )}
                        {card.cardOverseas && card.cardOverseas.length > 0 && (
                            <p>
                                <strong>해외 카드 정보:</strong> {card.cardOverseas.join(", ")}
                            </p>
                        )}
                    </div>
                </CardContent>

                {/* 주요 혜택 영역 */}
                {card.benefits && card.benefits.length > 0 && (
                    <CardContent className="px-4 py-3 border-t border-border">
                        <h4 className="font-medium mb-3 text-sm">주요 혜택</h4>
                        <div className="space-y-3">
                            {card.benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 p-3 rounded shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleToggleBenefit(index)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* 대표 아이콘 */}
                                            <div className="w-8 h-8 flex-shrink-0">
                                                {benefitIconMap[benefit.bnfName] || (
                                                    <div className="w-8 h-8 bg-gray-200 rounded" />
                                                )}
                                            </div>
                                            {/* 혜택 제목 및 간단 설명 */}
                                            <div>
                                                <p className="text-base font-semibold">
                                                    {categoryNameMap[benefit.bnfName] || benefit.bnfName}
                                                </p>
                                                <p className="text-sm text-gray-600">{benefit.bnfContent}</p>
                                            </div>
                                        </div>
                                        {/* 토글 아이콘 */}
                                        <div>
                                            {expandedBenefits[index] ? (
                                                <ChevronUp className="h-5 w-5 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                    {/* 상세 혜택 내용 */}
                                    {expandedBenefits[index] && (
                                        <div className="mt-2 pl-11 text-sm text-gray-600 transition-all duration-300">
                                            {benefit.bnfDetail}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}

                {/* 뒤로가기 버튼 */}
                <div className="p-2 flex justify-end">
                    <Button onClick={() => router.back()} size="sm">
                        뒤로가기
                    </Button>
                </div>
            </Card>
        </div>
    )
}
