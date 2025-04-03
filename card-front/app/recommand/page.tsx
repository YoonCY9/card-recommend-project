"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const MonthlySpendingPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        shoppingRetail: '',
        foodBeverage: '',
        transportation: '',
        travelAirline: '',
        cultureLeisure: '',
        lifestyleServices: '',
        educationChildcare: '',
        financialServices: '',
        digitalServices: '',
        communicationsOthers: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // 숫자만 입력 (빈 문자열 허용)
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 쿼리스트링 생성: 데이터가 모두 문자열이므로 그대로 사용 가능
        const query = new URLSearchParams(formData as Record<string, string>).toString();
        router.push(`/graph?${query}`);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
            <h1>월 사용 금액 입력</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>쇼핑/유통</label>
                    <input
                        type="number"
                        name="shoppingRetail"
                        value={formData.shoppingRetail}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>식음료</label>
                    <input
                        type="number"
                        name="foodBeverage"
                        value={formData.foodBeverage}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>교통/자동차</label>
                    <input
                        type="number"
                        name="transportation"
                        value={formData.transportation}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>여행/항공</label>
                    <input
                        type="number"
                        name="travelAirline"
                        value={formData.travelAirline}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>문화/레저</label>
                    <input
                        type="number"
                        name="cultureLeisure"
                        value={formData.cultureLeisure}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>생활서비스</label>
                    <input
                        type="number"
                        name="lifestyleServices"
                        value={formData.lifestyleServices}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>교육/육아</label>
                    <input
                        type="number"
                        name="educationChildcare"
                        value={formData.educationChildcare}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>금융서비스</label>
                    <input
                        type="number"
                        name="financialServices"
                        value={formData.financialServices}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>디지털서비스</label>
                    <input
                        type="number"
                        name="digitalServices"
                        value={formData.digitalServices}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>통신/기타</label>
                    <input
                        type="number"
                        name="communicationsOthers"
                        value={formData.communicationsOthers}
                        onChange={handleChange}
                        placeholder="금액 입력"
                    />
                </div>
                <button type="submit" style={{ padding: '0.8rem 1.2rem' }}>
                    제출
                </button>
            </form>
        </div>
    );
};

export default MonthlySpendingPage;
