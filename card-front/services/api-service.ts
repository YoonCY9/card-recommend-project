const USE_MOCK_API = process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL

// API 응답 타입 정의
export interface CardResponse {
  id: number
  name: string
  img: string
  bnfContent: string[]
  record: number
}

// API 요청 파라미터 타입 정의
export interface CardRequestParams {
  cardBrand?: string[]
  record?: number
  fee?: number
  benefit?: string[]
}

// API 호출 함수
export async function fetchCards(params: CardRequestParams): Promise<CardResponse[]> {
  // API 엔드포인트 URL 확인
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.")
    throw new Error("API URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.")
  }

  // URL 구성 - 슬래시 중복 방지
  const endpoint = baseUrl.endsWith("/") ? `${baseUrl}cards` : `${baseUrl}/cards`

  try {
    // 개발 환경에서 모의 API 사용 (실제 API가 설정되지 않은 경우)
    if (USE_MOCK_API) {
      console.log("모의 API 사용 중 (개발 환경)")
      const mockEndpoint = "/api/mock-cards"
      const url = new URL(mockEndpoint, window.location.origin)

      // 파라미터 추가 (기존 코드와 동일)
      if (params.cardBrand && params.cardBrand.length > 0) {
        params.cardBrand.forEach((brand) => {
          url.searchParams.append("cardBrand", brand)
        })
      }

      if (params.record !== undefined) {
        url.searchParams.append("record", params.record.toString())
      }

      if (params.fee !== undefined) {
        url.searchParams.append("fee", params.fee.toString())
      }

      if (params.benefit && params.benefit.length > 0) {
        params.benefit.forEach((benefit) => {
          url.searchParams.append("benefit", benefit)
        })
      }

      console.log("모의 API 요청 URL:", url.toString())

      // 요청 옵션 설정
      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // CORS 문제 해결을 위한 credentials 설정
        credentials: "include",
        // 캐시 방지
        cache: "no-cache",
      }

      const response = await fetch(url.toString(), options)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "응답 텍스트를 가져올 수 없습니다.")
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data: CardResponse[] = await response.json()
      return data
    } else {
      // URL 파라미터 구성
      const url = new URL(endpoint)

      // 파라미터 추가
      if (params.cardBrand && params.cardBrand.length > 0) {
        params.cardBrand.forEach((brand) => {
          url.searchParams.append("cardBrand", brand)
        })
      }

      if (params.record !== undefined) {
        url.searchParams.append("record", params.record.toString())
      }

      if (params.fee !== undefined) {
        url.searchParams.append("fee", params.fee.toString())
      }

      if (params.benefit && params.benefit.length > 0) {
        params.benefit.forEach((benefit) => {
          url.searchParams.append("benefit", benefit)
        })
      }

      console.log("API 요청 URL:", url.toString())

      // 요청 옵션 설정
      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // CORS 문제 해결을 위한 credentials 설정
        credentials: "include",
        // 캐시 방지
        cache: "no-cache",
      }

      const response = await fetch(url.toString(), options)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "응답 텍스트를 가져올 수 없습니다.")
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data: CardResponse[] = await response.json()
      return data
    }
  } catch (error) {
    // 더 자세한 오류 정보 제공
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("네트워크 연결 오류:", error)
      throw new Error("서버에 연결할 수 없습니다. 네트워크 연결 또는 CORS 설정을 확인해주세요.")
    }

    console.error("카드 데이터 가져오기 실패:", error)
    throw error
  }
}

// 필터 매핑 함수는 변경 없음
export function mapFiltersToApiParams(filters: {
  benefits: string[]
  brands: string[]
  monthlySpend: string[]
  annualFee: string[]
}): CardRequestParams {
  const params: CardRequestParams = {}

  // 브랜드 매핑
  if (filters.brands.length > 0) {
    params.cardBrand = filters.brands
  }

  // 월 사용액 매핑
  if (filters.monthlySpend.length > 0) {
    // 첫 번째 선택된 월 사용액 기준으로 record 값 설정
    const spendCategory = filters.monthlySpend[0]
    switch (spendCategory) {
      case "under300k":
        params.record = 300000
        break
      case "300k-500k":
        params.record = 500000
        break
      case "500k-1m":
        params.record = 1000000
        break
      case "over1m":
        params.record = 1500000
        break
    }
  }

  // 연회비 매핑
  if (filters.annualFee.length > 0) {
    // 첫 번째 선택된 연회비 기준으로 fee 값 설정
    const feeCategory = filters.annualFee[0]
    switch (feeCategory) {
      case "free":
        params.fee = 0
        break
      case "under10k":
        params.fee = 10000
        break
      case "10k-30k":
        params.fee = 30000
        break
      case "over30k":
        params.fee = 50000
        break
    }
  }

  // 혜택 매핑
  if (filters.benefits.length > 0) {
    params.benefit = filters.benefits
  }

  return params
}

