import { NextResponse } from "next/server"
import type { CardResponse } from "@/services/api-service"

// 모의 데이터
const mockCards: CardResponse[] = [
  {
    id: 1,
    name: "신한 플래티넘 카드",
    img: "/placeholder.svg?height=64&width=64",
    bnfContent: ["쇼핑 5% 할인", "온라인몰 3% 추가 할인", "영화관 할인"],
    record: 500000,
  },
  {
    id: 2,
    name: "삼성 트래블 플러스",
    img: "/placeholder.svg?height=64&width=64",
    bnfContent: ["항공권 3% 캐시백", "해외이용 2% 포인트", "공항 라운지 무료 이용"],
    record: 1000000,
  },
  {
    id: 3,
    name: "현대 다이닝 카드",
    img: "/placeholder.svg?height=64&width=64",
    bnfContent: ["식당 10% 할인", "카페 최대 4,000원 할인", "배달앱 할인"],
    record: 300000,
  },
]

export async function GET(request: Request) {
  // URL 파라미터 가져오기
  const { searchParams } = new URL(request.url)

  // 필터링 로직 (실제 API와 유사하게 구현)
  let filteredCards = [...mockCards]

  // 브랜드 필터링
  const cardBrands = searchParams.getAll("cardBrand")
  if (cardBrands.length > 0) {
    filteredCards = filteredCards.filter((card) => {
      return cardBrands.some((brand) => {
        if (brand === "shinhan") return card.name.includes("신한")
        if (brand === "samsung") return card.name.includes("삼성")
        if (brand === "hyundai") return card.name.includes("현대")
        if (brand === "kb") return card.name.includes("KB") || card.name.includes("국민")
        if (brand === "woori") return card.name.includes("우리")
        return false
      })
    })
  }

  // 월 사용액 필터링
  const record = searchParams.get("record")
  if (record) {
    const recordValue = Number.parseInt(record)
    filteredCards = filteredCards.filter((card) => card.record <= recordValue)
  }

  // 응답 지연 시뮬레이션 (실제 API 호출처럼 보이게)
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(filteredCards)
}

