import pandas as pd
import numpy as np

# CSV 파일 로드
df = pd.read_csv("card_data_modified.csv", encoding='utf-8-sig')

# 만 단위 랜덤 값 생성 함수
def generate_10k():
    return np.random.randint(0, 11) * 10000  # 0~10 → 0~100,000 (10k 단위)

# 컬럼별 조건부 처리
for col in ['domestic_offer_amount', 'overseas_offer_amount']:
    if col in df.columns:
        mask = df[col].notna()  # null이 아닌 셀 필터링[2][6]
        df.loc[mask, col] = [generate_10k() for _ in range(mask.sum())]  # 값 할당[3][8]

# 수정된 파일 저장
df.to_csv("card_data_modified.csv", index=False, encoding='utf-8-sig')