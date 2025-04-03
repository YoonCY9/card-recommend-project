import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#1e3a8a] ">
            <div className="bg-white bg-opacity-30 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20">
                <h1 className="text-center text-5xl font-extrabold text-white mb-8 drop-shadow-lg tracking-wide">
                    카드 추천 서비스 💳
                </h1>

                <p className="text-center text-lg text-white opacity-80 mb-10">
                    맞춤형 카드 추천을 받아보세요!
                </p>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* 맞춤형 카드 추천 */}
                    <Link href="http://localhost:3000">
                        <div className="group flex h-64 w-96 cursor-pointer items-center justify-center rounded-xl bg-white/80 text-black border-2 border-gray-200 shadow-lg transition-all hover:shadow-xl hover:scale-105 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-gray-100 opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
                            <p className="relative text-center text-xl font-semibold tracking-wide">
                                🔍 혜택, 브랜드, 사용액에 따라<br />맞춤형 카드 추천받기
                            </p>
                        </div>
                    </Link>

                    {/* 연령대별 카드 추천 */}
                    <Link href="http://localhost:3000/cards">
                        <div className="group flex h-64 w-96 cursor-pointer items-center justify-center rounded-xl bg-white/80 text-black border-2 border-gray-200 shadow-lg transition-all hover:shadow-xl hover:scale-105 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-gray-100 opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
                            <p className="relative text-center text-xl font-semibold tracking-wide">
                                🎯 연령대별 맞춤 카드 추천
                            </p>
                        </div>
                    </Link>

                    <Link href="http://localhost:3000/recommand">
                        <div className="group flex h-64 w-97 cursor-pointer items-center justify-center rounded-xl bg-white/80 text-black border-2 border-gray-200 shadow-lg transition-all hover:shadow-xl hover:scale-105 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-gray-100 opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
                            <p className="relative text-center text-xl font-semibold tracking-wide">
                                📊 소비 패턴 분석 및 맞춤 카드 추천
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
