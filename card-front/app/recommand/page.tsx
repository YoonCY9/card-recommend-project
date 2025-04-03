"use client"

import type React from "react"
import { forwardRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
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
    ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link";

// Input 컴포넌트를 페이지 내에 직접 정의
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

const MonthlySpendingPage = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        shoppingRetail: "",
        foodBeverage: "",
        transportation: "",
        travelAirline: "",
        cultureLeisure: "",
        lifestyleServices: "",
        educationChildcare: "",
        financialServices: "",
        digitalServices: "",
        communicationsOthers: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        // 숫자만 입력 (빈 문자열 허용)
        if (value === "" || /^[0-9\b]+$/.test(value)) {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // 쿼리스트링 생성: 데이터가 모두 문자열이므로 그대로 사용 가능
        const query = new URLSearchParams(formData as Record<string, string>).toString()
        router.push(`/graph?${query}`)
    }

    const categories = [
        { name: "shoppingRetail", label: "쇼핑/유통", icon: <ShoppingBag className="h-4 w-4" /> },
        { name: "foodBeverage", label: "식음료", icon: <Utensils className="h-4 w-4" /> },
        { name: "transportation", label: "교통/자동차", icon: <Car className="h-4 w-4" /> },
        { name: "travelAirline", label: "여행/항공", icon: <Plane className="h-4 w-4" /> },
        { name: "cultureLeisure", label: "문화/레저", icon: <Tv className="h-4 w-4" /> },
        { name: "lifestyleServices", label: "생활서비스", icon: <Home className="h-4 w-4" /> },
        { name: "educationChildcare", label: "교육/육아", icon: <GraduationCap className="h-4 w-4" /> },
        { name: "financialServices", label: "금융서비스", icon: <Landmark className="h-4 w-4" /> },
        { name: "digitalServices", label: "디지털서비스", icon: <Smartphone className="h-4 w-4" /> },
        { name: "communicationsOthers", label: "통신/기타", icon: <Radio className="h-4 w-4" /> },
    ]

    return (
        <div className="min-h-screen bg-mesh py-12 px-4">
            <Link href="/main">
                <div className="absolute top-[1cm] left-[1cm] flex h-10 w-20 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-m font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </div>
            </Link>
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gradient mb-2">월 사용 금액 입력</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        각 카테고리별 월 사용 금액을 입력하시면 맞춤형 카드를 추천해 드립니다.
                    </p>
                </div>

                <Card className="shadow-md border-border overflow-hidden bg-card-gradient">
                    <CardHeader className="bg-primary/5 backdrop-blur-sm px-6 py-4 border-b border-border">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-primary" />
                            카테고리별 지출 금액
                        </h2>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categories.map((category) => (
                                    <div key={category.name} className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-medium">
                                            {category.icon}
                                            {category.label}
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                                            <Input
                                                type="text"
                                                name={category.name}
                                                value={formData[category.name as keyof typeof formData]}
                                                onChange={handleChange}
                                                placeholder="금액 입력"
                                                className="pl-8 transition-all border-input focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" className="bg-black hover:bg-black/90 text-white transition-colors px-6">
                                    <span>분석 결과 보기</span>
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    입력하신 정보는 카드 추천을 위해서만 사용되며 저장되지 않습니다.
                </div>
            </div>
        </div>
    )
}

export default MonthlySpendingPage

