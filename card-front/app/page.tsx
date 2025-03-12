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
} from "lucide-react"
import FilterOption from "@/components/filter-option"

export default function CardRecommendationPage() {
  const [filters, setFilters] = useState({
    benefits: [] as string[],
    brands: [] as string[],
    monthlySpend: [] as string[],
    annualFee: [] as string[],
  })

  const handleFilterToggle = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      if (prev[category].includes(value)) {
        return {
          ...prev,
          [category]: prev[category].filter((item) => item !== value),
        }
      } else {
        return {
          ...prev,
          [category]: [...prev[category], value],
        }
      }
    })
  }

  const benefitOptions = [
    { value: "SHOPPING_RETAIL", label: "쇼핑/유통", icon: <ShoppingBag /> },
    { value: "FOOD_BEVERAGE", label: "식음료", icon: <Utensils /> },
    { value: "TRANSPORT_AUTOMOBILE", label: "교통/자동차", icon: <Car /> },
    { value: "TRAVEL_AIRLINE", label: "여행/항공", icon: <Plane /> },
    { value: "CULTURE_LEISURE", label: "문화/레저", icon: <Tv /> },
    { value: "LIVING_SERVICES", label: "생활서비스", icon: <Home /> },
    { value: "EDUCATION_CHILDCARE", label: "교육/육아", icon: <GraduationCap /> },
    { value: "FINANCIAL_SERVICES", label: "금융서비스", icon: <Landmark /> },
    { value: "DIGITAL_SERVICES", label: "디지털서비스", icon: <Smartphone /> },
    { value: "TELECOM_MISC", label: "통신/기타", icon: <Radio /> },
  ]

  const brandOptions = [
    { value: "신한카드", label: "신한카드" },
    { value: "삼성카드", label: "삼성카드" },
    { value: "현대카드", label: "현대카드" },
    { value: "KB국민카드", label: "KB국민카드" },
    { value: "우리카드", label: "우리카드" },
  ]

  const monthlySpendOptions = [
    { value: "under300k", label: "30만원 미만" },
    { value: "300k-500k", label: "30만원-50만원" },
    { value: "500k-1m", label: "50만원-100만원" },
    { value: "over1m", label: "100만원 이상" },
  ]

  const annualFeeOptions = [
    { value: "free", label: "무료" },
    { value: "under10k", label: "1만원 미만" },
    { value: "10k-30k", label: "1만원-3만원" },
    { value: "over30k", label: "3만원 이상" },
  ]

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-center mb-8 gap-2">
        <CreditCard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-center">카드 추천 서비스</h1>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>혜택</Label>
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

            <div className="space-y-2">
              <Label>카드 브랜드</Label>
              <div className="flex flex-wrap gap-2">
                {brandOptions.map((option) => (
                  <FilterOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    icon={<CreditCard />}
                    isSelected={filters.brands.includes(option.value)}
                    onToggle={(value) => handleFilterToggle("brands", value)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>월 사용액</Label>
              <div className="flex flex-wrap gap-2">
                {monthlySpendOptions.map((option) => (
                  <FilterOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    icon={<CreditCard />}
                    isSelected={filters.monthlySpend.includes(option.value)}
                    onToggle={(value) => handleFilterToggle("monthlySpend", value)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>연회비</Label>
              <div className="flex flex-wrap gap-2">
                {annualFeeOptions.map((option) => (
                  <FilterOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    icon={<CreditCard />}
                    isSelected={filters.annualFee.includes(option.value)}
                    onToggle={(value) => handleFilterToggle("annualFee", value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CardList filters={filters} />
    </main>
  )
}

