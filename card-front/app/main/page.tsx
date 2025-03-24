import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                <h1 className="text-center text-4xl font-bold text-black mb-8 drop-shadow-md">
                    카드추천 서비스
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    <Link href="http://localhost:3000">
                        <div className="flex h-64 w-96 cursor-pointer items-center justify-center rounded-xl bg-white text-black border-2 border-gray-800 shadow-lg transition-all hover:shadow-xl hover:scale-105 p-6">
                            <p className="text-center text-lg font-semibold">
                                혜택, 브랜드, 사용액에 따라 맞춤형 카드 추천받기
                            </p>
                        </div>
                    </Link>

                    <Link href="http://localhost:3000/cards">
                        <div className="flex h-64 w-96 cursor-pointer items-center justify-center rounded-xl bg-white text-black border-2 border-gray-800 shadow-lg transition-all hover:shadow-xl hover:scale-105 p-6">
                            <p className="text-center text-lg font-semibold">
                                연령대별로 카드 추천 받기
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
