import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

type CardFilters = {
  benefits: string[]
  brands: string[]
  monthlySpend: string[]
  annualFee: string[]
}

type CardItem = {
  id: string
  name: string
  brand: string
  description: string
  benefits: string[]
  annualFee: string
  color: string
  benefitIcons: string[]
  monthlySpendCategory: string
}

export default function CardList({ filters }: { filters: CardFilters }) {
  // 샘플 카드 데이터
  const cards: CardItem[] = [
    {
      id: "1",
      name: "프리미엄 쇼핑 카드",
      brand: "shinhan",
      description: "쇼핑몰, 백화점 최대 5% 할인",
      benefits: ["쇼핑 5% 할인", "온라인몰 3% 추가 할인"],
      annualFee: "20,000원",
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
      benefitIcons: ["SHOPPING_RETAIL"],
      monthlySpendCategory: "300k-500k",
    },
    {
      id: "2",
      name: "트래블 플러스",
      brand: "samsung",
      description: "해외여행 특화 혜택",
      benefits: ["항공권 3% 캐시백", "해외이용 2% 포인트"],
      annualFee: "30,000원",
      color: "bg-gradient-to-r from-indigo-500 to-cyan-400",
      benefitIcons: ["TRAVEL_AIRLINE"],
      monthlySpendCategory: "500k-1m",
    },
    {
      id: "3",
      name: "다이닝 카드",
      brand: "hyundai",
      description: "맛집, 카페 할인 특화",
      benefits: ["식당 10% 할인", "카페 최대 4,000원 할인"],
      annualFee: "15,000원",
      color: "bg-gradient-to-r from-red-500 to-orange-500",
      benefitIcons: ["FOOD_BEVERAGE"],
      monthlySpendCategory: "under300k",
    },
    {
      id: "4",
      name: "문화생활 카드",
      brand: "kb",
      description: "영화, 공연 할인 특화",
      benefits: ["영화 할인", "공연 예매 5% 할인"],
      annualFee: "10,000원",
      color: "bg-gradient-to-r from-green-400 to-blue-500",
      benefitIcons: ["CULTURE_LEISURE"],
      monthlySpendCategory: "300k-500k",
    },
    {
      id: "5",
      name: "스마트 라이프 카드",
      brand: "woori",
      description: "디지털 서비스 특화 혜택",
      benefits: ["스트리밍 서비스 할인", "앱 마켓 5% 캐시백"],
      annualFee: "25,000원",
      color: "bg-gradient-to-r from-purple-400 to-pink-500",
      benefitIcons: ["DIGITAL_SERVICES"],
      monthlySpendCategory: "500k-1m",
    },
  ]

  // 필터링 로직
  const filteredCards = cards.filter((card) => {
    if (filters.benefits.length > 0 && !filters.benefits.some((benefit) => card.benefitIcons.includes(benefit)))
      return false
    if (filters.brands.length > 0 && !filters.brands.includes(card.brand)) return false
    if (filters.monthlySpend.length > 0 && !filters.monthlySpend.includes(card.monthlySpendCategory)) return false
    if (filters.annualFee.length > 0) {
      const cardFee = Number.parseInt(card.annualFee.replace(/[^0-9]/g, ""))
      if (
        !filters.annualFee.some((fee) => {
          if (fee === "free" && cardFee === 0) return true
          if (fee === "under10k" && cardFee < 10000) return true
          if (fee === "10k-30k" && cardFee >= 10000 && cardFee <= 30000) return true
          if (fee === "over30k" && cardFee > 30000) return true
          return false
        })
      )
        return false
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-32 ${card.color} flex items-center justify-center p-4`}>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-48 h-24 flex items-center justify-between">
                  <div>
                    <p className="text-white text-xs font-medium">{getBrandName(card.brand)}</p>
                    <p className="text-white text-sm font-bold mt-1">•••• 1234</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{card.name}</CardTitle>
                  <Badge variant="outline">{getBrandName(card.brand)}</Badge>
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">주요 혜택</p>
                  <ul className="space-y-1">
                    {card.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        {card.benefitIcons[0] && getBenefitIcon(card.benefitIcons[0])}
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium">연회비</p>
                  <p className="text-sm">{card.annualFee}</p>
                </div>
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

// 브랜드명 변환 함수
function getBrandName(brandCode: string): string {
  const brands: Record<string, string> = {
    shinhan: "신한카드",
    samsung: "삼성카드",
    hyundai: "현대카드",
    kb: "KB국민카드",
    woori: "우리카드",
  }

  return brands[brandCode] || brandCode
}

