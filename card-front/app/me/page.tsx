'use client';

import { useEffect, useState } from 'react';

interface UserData {
    username: string;
    email: string;
    role: string;
    profile: string;
}

export default function UserInfoPage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 쿠키에서 JWT 토큰 추출
    const getCookie = (name: string): string | undefined => {
        if (typeof document === 'undefined') return;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    // 사용자 정보 가져오기
    const fetchUserData = async () => {
        getCookie('Authorization');
        try {
            const response = await fetch('http://localhost:8080/me', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: UserData = await response.json();
            setUserData(data);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    // console.log(userData?.profile);

    return (
        <div>
            <h1>로그인 사용자 정보</h1>
            <div>
                {userData ? (
                    <>
                        <p>아이디: {userData.username}</p>
                        <p>이메일: {userData.email}</p>
                        <p>권한: {userData.role}</p>
                        <img src={`${userData.profile}`} alt="프로필" />
                    </>
                ) : (
                    <p style={{ color: 'red' }}>사용자 정보를 불러올 수 없습니다</p>
                )}
            </div>
        </div>
    );
}
