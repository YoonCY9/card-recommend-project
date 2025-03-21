"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import CardList from "@/components/card-list"
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
  Sparkles,
  Filter,
} from "lucide-react"
import FilterOption from "@/components/filter-option"
import { Button } from "@/components/ui/button"

export default function CardRecommendationPage() {
  const [filters, setFilters] = useState({
    benefits: [] as string[],
    brands: [] as string[],
    monthlySpend: [] as string[],
    annualFee: [] as string[],
    keyward: ""
  })

  type FilterCategory =
      | "benefits"
      | "brands"
      | "monthlySpend"
      | "annualFee";


  const handleFilterToggle = (
      category: FilterCategory, value: string) => {
    setFilters((prev) => {
      if (prev[category].includes(value)) {
        return {
          ...prev,
          [category]: prev[category].filter((item) => item !== value),
        }
      } else {
        // For monthlySpend and annualFee, we only want one selection
        if (category === "monthlySpend" || category === "annualFee") {
          return {
            ...prev,
            [category]: [value],
          }
        }
        return {
          ...prev,
          [category]: [...prev[category], value],
        }
      }
    })
  }

  const benefitOptions = [
    { value: "SHOPPING_RETAIL", label: "쇼핑/유통", icon: <ShoppingBag className="h-4 w-4" /> },
    { value: "FOOD_BEVERAGE", label: "식음료", icon: <Utensils className="h-4 w-4" /> },
    { value: "TRANSPORT_AUTOMOBILE", label: "교통/자동차", icon: <Car className="h-4 w-4" /> },
    { value: "TRAVEL_AIRLINE", label: "여행/항공", icon: <Plane className="h-4 w-4" /> },
    { value: "CULTURE_LEISURE", label: "문화/레저", icon: <Tv className="h-4 w-4" /> },
    { value: "LIVING_SERVICES", label: "생활서비스", icon: <Home className="h-4 w-4" /> },
    { value: "EDUCATION_CHILDCARE", label: "교육/육아", icon: <GraduationCap className="h-4 w-4" /> },
    { value: "FINANCIAL_SERVICES", label: "금융서비스", icon: <Landmark className="h-4 w-4" /> },
    { value: "DIGITAL_SERVICES", label: "디지털서비스", icon: <Smartphone className="h-4 w-4" /> },
    { value: "TELECOM_MISC", label: "통신/기타", icon: <Radio className="h-4 w-4" /> },
  ]

  // 확장된 카드 브랜드 목록
  const brandOptions = [
    { value: "신한", label: "신한카드" },
    { value: "삼성", label: "삼성카드" },
    { value: "현대", label: "현대카드" },
    { value: "KB", label: "KB국민카드" },
    { value: "우리", label: "우리카드" },
    { value: "롯데", label: "롯데카드" },
    { value: "NH", label: "NH농협카드" },
    { value: "하나", label: "하나카드" },
    { value: "BC", label: "BC카드" },
    { value: "씨티", label: "씨티카드" },
    { value: "카카오", label: "카카오뱅크" },
    { value: "토스", label: "토스뱅크" },
  ]

  // 세분화된 월 사용액 필터
  const monthlySpendOptions = [
    { value: "under100k", label: "10만원 이하" },

    { value: "under500k", label: "50만원 이하" },

    { value: "under1m", label: "100만원 이하" },

  ]

  const annualFeeOptions = [
    { value: "free", label: "무료" },
    { value: "under10k", label: "1만원 이하" },
    { value: "under30k", label: "3만원 이하" },
    { value: "under50k", label: "5만원 이하" },
  ]

  return (
      <main className="min-h-screen bg-mesh">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center mb-10 pt-6 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 floating">
              <CreditCard className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-center mb-2 text-gradient">카드 추천 서비스</h1>
            <p className="text-muted-foreground text-center max-w-md">
              나에게 맞는 최적의 카드를 찾아보세요. 혜택, 브랜드, 사용액에 따라 맞춤형 카드를 추천해드립니다.
            </p>
          </div>

          <Card className="mb-10 shadow-md border-border overflow-hidden bg-card-gradient">
            <div className="bg-primary/5 backdrop-blur-sm px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">필터 옵션</h2>
              </div>
            </div>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    혜택
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {benefitOptions.map((option) => (
                        <FilterOption
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            icon={option.icon}
                            isSelected={filters.benefits.includes(option.value)}
                            onToggle={(value) => handleFilterToggle("benefits", value)}
                        />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    카드 브랜드
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {brandOptions.map((option) => (
                        <FilterOption
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={filters.brands.includes(option.value)}
                            onToggle={(value) => handleFilterToggle("brands", value)}
                        />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />월 사용액
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {monthlySpendOptions.map((option) => (
                        <FilterOption
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={filters.monthlySpend.includes(option.value)}
                            onToggle={(value) => handleFilterToggle("monthlySpend", value)}
                        />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    연회비
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {annualFeeOptions.map((option) => (
                        <FilterOption
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={filters.annualFee.includes(option.value)}
                            onToggle={(value) => handleFilterToggle("annualFee", value)}
                        />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                          setFilters({
                            benefits: [],
                            brands: [],
                            monthlySpend: [],
                            annualFee: [],
                            keyward: ""
                          })
                      }
                  >
                    필터 초기화
                  </Button>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                          type="text"
                          placeholder="카드명 검색"
                          value={filters.keyward}
                          onChange={(e) =>
                              setFilters(prev => ({ ...prev, keyward: e.target.value }))
                          }
                          className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <CardList filters={filters} />
        </div>
      </main>
  )
}

