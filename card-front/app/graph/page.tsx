"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ArrowRight, BarChart2, TrendingUp } from "lucide-react"

// API 응답 타입 정의 (CardResponse, PageResponse)
interface CardResponse {
    id: number
    name: string
    img: string
    bnfContent: string[]
    record: number
    brand: string
    domesticOfferAmount: string
    overseasOfferAmount: string
    bnfDetail?: string
    totalCount: number
}

interface PageResponse {
    totalPages: number
    totalCount: number
    currentPage: number
    pageSize: number
    cardResponse: CardResponse[]
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// 한글 라벨을 백엔드 Category enum 문자열로 매핑하는 함수
const mapLabelToCategory = (label: string): string => {
    const mapping: { [key: string]: string } = {
        "쇼핑/유통": "SHOPPING_RETAIL",
        식음료: "FOOD_BEVERAGE",
        "교통/자동차": "TRANSPORT_AUTOMOBILE",
        "여행/항공": "TRAVEL_AIRLINE",
        "문화/레저": "CULTURE_LEISURE",
        생활서비스: "LIVING_SERVICES",
        "교육/육아": "EDUCATION_CHILDCARE",
        금융서비스: "FINANCIAL_SERVICES",
        디지털서비스: "DIGITAL_SERVICES",
        "통신/기타": "TELECOM_MISC",
    }
    return mapping[label] || ""
}

// 카드 브랜드 색상 가져오기
const getCardBrandColor = (name: string) => {
    if (name.includes("신한")) return "bg-blue-50 text-blue-600 border-blue-200"
    if (name.includes("삼성")) return "bg-blue-50 text-blue-600 border-blue-200"
    if (name.includes("현대")) return "bg-gray-50 text-gray-600 border-gray-200"
    if (name.includes("KB") || name.includes("국민")) return "bg-yellow-50 text-yellow-600 border-yellow-200"
    if (name.includes("우리")) return "bg-green-50 text-green-600 border-green-200"
    if (name.includes("롯데")) return "bg-red-50 text-red-600 border-red-200"
    if (name.includes("NH") || name.includes("농협")) return "bg-green-50 text-green-600 border-green-200"
    if (name.includes("하나")) return "bg-emerald-50 text-emerald-600 border-emerald-200"
    if (name.includes("BC")) return "bg-purple-50 text-purple-600 border-purple-200"
    if (name.includes("씨티")) return "bg-blue-50 text-blue-600 border-blue-200"
    if (name.includes("카카오")) return "bg-yellow-50 text-yellow-600 border-yellow-200"
    if (name.includes("토스")) return "bg-blue-50 text-blue-600 border-blue-200"
    return "bg-purple-50 text-purple-600 border-purple-200"
}

const GraphPage = () => {
    const searchParams = useSearchParams()

    // 카테고리 키와 라벨 배열 (화면에 표시될 한글 라벨)
    const keys = [
        "shoppingRetail",
        "foodBeverage",
        "transportation",
        "travelAirline",
        "cultureLeisure",
        "lifestyleServices",
        "educationChildcare",
        "financialServices",
        "digitalServices",
        "communicationsOthers",
    ]
    const labels = [
        "쇼핑/유통",
        "식음료",
        "교통/자동차",
        "여행/항공",
        "문화/레저",
        "생활서비스",
        "교육/육아",
        "금융서비스",
        "디지털서비스",
        "통신/기타",
    ]

    // 쿼리스트링 값에서 숫자로 변환하여 데이터 배열 생성
    const dataValues = keys.map((key) => {
        const value = searchParams.get(key)
        return value ? Number.parseInt(value) : 0
    })

    // 총 사용 금액 계산
    const totalUsage = dataValues.reduce((acc, curr) => acc + curr, 0)

    // 최대 사용 금액과 해당 카테고리 찾기
    const maxValue = Math.max(...dataValues)
    const maxIndex = dataValues.indexOf(maxValue)
    const maxCategoryLabel = totalUsage > 0 ? labels[maxIndex] : ""
    // benefit 값으로 사용할 백엔드 enum 문자열
    const benefitValue = mapLabelToCategory(maxCategoryLabel)

    // 막대 그래프 색상 (최대값 강조)
    const backgroundColors = dataValues.map(
        (value) =>
            value === maxValue && maxValue > 0
                ? "rgba(37, 99, 235, 0.7)" // 최대값은 더 진한 파란색
                : "rgba(37, 99, 235, 0.4)", // 나머지는 연한 파란색
    )
    const borderColors = dataValues.map((value) =>
        value === maxValue && maxValue > 0 ? "rgba(37, 99, 235, 1)" : "rgba(37, 99, 235, 0.8)",
    )

    const data = {
        labels: labels.map((label, index) => (dataValues[index] === maxValue && maxValue > 0 ? `${label} (최대)` : label)),
        datasets: [
            {
                label: "월 소비 금액",
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }

    const options = {
        responsive: true,
        animation: {
            duration: 1500,
            easing: "easeOutQuart",
        },
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    font: {
                        family: "var(--font-geist-sans)",
                    },
                },
            },
            title: {
                display: true,
                text: "카테고리별 월 소비 금액",
                font: {
                    size: 16,
                    family: "var(--font-geist-sans)",
                    weight: "bold",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = context.dataset.label || ""
                        if (label) label += ": "
                        label += `${context.parsed.y.toLocaleString()}원`
                        if (context.parsed.y === maxValue && maxValue > 0) {
                            label += " (최대 사용)"
                        }
                        return label
                    },
                },
                titleFont: {
                    family: "var(--font-geist-sans)",
                },
                bodyFont: {
                    family: "var(--font-geist-sans)",
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    font: {
                        family: "var(--font-geist-sans)",
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => value.toLocaleString() + "원",
                    font: {
                        family: "var(--font-geist-sans)",
                    },
                },
            },
        },
    }

    // 추천 카드 API 호출을 위한 상태 관리
    const [cards, setCards] = useState<CardResponse[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (totalUsage > 0 && benefitValue) {
            setLoading(true);
            const params = new URLSearchParams();
            params.append("record", totalUsage.toString());
            [benefitValue].forEach((benefit) => params.append("benefit", benefit));
            params.append("page", "1");
            // 변경: size 값을 50으로 받아 충분한 결과를 받고, 브랜드 중복 제거 후 상위 5개 선택
            params.append("size", "50");

            fetch(`http://localhost:8080/cards?${params.toString()}`)
        .then((res) => {
                if (!res.ok) {
                    throw new Error("네트워크 응답이 올바르지 않습니다.");
                }
                return res.json();
            })
                .then((pageData: PageResponse) => {
                    // 브랜드 중복 제거: 각 브랜드의 카드만 포함
                    const distinctCards: CardResponse[] = [];
                    const seenBrands = new Set<string>();

                    pageData.cardResponse.forEach((card) => {
                        if (!seenBrands.has(card.brand)) {
                            distinctCards.push(card);
                            seenBrands.add(card.brand);
                        }
                    });
                    // 상위 5개 카드 선택
                    setCards(distinctCards.slice(0, 5));
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("카드 API 호출 에러:", err);
                    setError("카드 데이터를 불러오는 데 실패했습니다.");
                    setLoading(false);
                });
        }
    }, [totalUsage, benefitValue]);
    return (
        <div className="min-h-screen bg-mesh py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 floating">
                        <BarChart2 className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">소비 내역 분석</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        입력하신 소비 내역을 분석하여 최적의 카드를 추천해 드립니다.
                    </p>
                </div>

                <Card className="shadow-md border-border overflow-hidden bg-card-gradient mb-8">
                    <CardHeader className="bg-primary/5 backdrop-blur-sm px-6 py-4 border-b border-border">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                소비 패턴 분석
                            </CardTitle>
                            <Badge className="px-3 py-1 text-sm font-medium bg-primary text-white border-none">
                                총 {totalUsage.toLocaleString()}원
                            </Badge>
                        </div>
                        <CardDescription>
                            {maxCategoryLabel
                                ? `${maxCategoryLabel} 카테고리에 가장 많은 지출이 있습니다.`
                                : "소비 내역을 입력하시면 분석 결과를 확인할 수 있습니다."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="w-full">
                            <Bar data={data} options={options} />
                        </div>
                    </CardContent>
                </Card>

                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <h2 className="text-2xl font-bold text-gradient">맞춤 추천 카드</h2>
                        <Badge className="ml-3 px-3 py-1 text-sm font-medium bg-primary text-white border-none">
                            {loading ? "검색 중..." : `${cards.length}개 찾음`}
                        </Badge>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-16 bg-muted rounded"></div>
                                            <div className="flex-1">
                                                <div className="h-5 w-40 bg-muted rounded mb-2"></div>
                                                <div className="h-4 w-full bg-muted rounded mb-1"></div>
                                                <div className="h-4 w-3/4 bg-muted rounded"></div>
                                            </div>
                                            <div className="w-24 h-8 bg-muted rounded"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : error ? (
                        <Card className="bg-red-50 border-red-200">
                            <CardContent className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                                    <CreditCard className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-red-700 mb-2">{error}</h3>
                                <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                                    다시 시도하기
                                </Button>
                            </CardContent>
                        </Card>
                    ) : cards.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {cards.map((card) => (
                                <Card key={card.id} className="overflow-hidden hover:shadow-md transition-all duration-300 group">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 h-16 flex items-center justify-center bg-card-gradient rounded-md overflow-hidden">
                                                <div className="absolute inset-0 opacity-10 bg-mesh"></div>
                                                <img
                                                    src={card.img || "/placeholder.svg?height=64&width=96"}
                                                    alt={card.name}
                                                    className="max-w-full max-h-full object-contain relative z-10"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge className={`${getCardBrandColor(card.name)} px-2 py-0.5 text-xs font-medium`}>
                                                        {card.name.split(" ")[0]}
                                                    </Badge>
                                                    {maxCategoryLabel && (
                                                        <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 px-2 py-0.5 text-xs font-medium">
                                                            {maxCategoryLabel} 특화
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-semibold truncate">{card.name}</h3>
                                                <ul className="mt-1 space-y-1">
                                                    {card.bnfContent.slice(0, 2).map((benefit, idx) => (
                                                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                                            <span className="mr-1.5 text-primary">•</span>
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Link href={`/cards/${card.id}`} className="shrink-0">
                                                <Button className="bg-black hover:bg-black/90 text-white transition-colors">
                                                    <span>상세 보기</span>
                                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-muted/50">
                            <CardContent className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 floating">
                                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">추천 카드가 없습니다</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-6">다른 소비 패턴으로 다시 시도해보세요.</p>
                                <Link href="/recommand">
                                    <Button variant="outline">소비 내역 다시 입력하기</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="text-center">
                    <Link href="/recommand">
                        <Button variant="outline">소비 내역 다시 입력하기</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="mx-auto">
                            홈으로 돌아가기
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default GraphPage

