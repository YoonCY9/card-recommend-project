"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/auth-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Test() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  console.log(user);
  console.log(user?.user_metadata);

  console.log();

  const supabase = createClient();
  useEffect(() => {
    async function getUser() {
      // const { data: { user } } = await supabase.auth.getUser();
      // setUser(user);
      const response = await supabase.auth.getUser();
      console.log(response);
      setUser(response.data.user);
    }

    getUser();
  }, []);

  return (
    <div>
      <Link href="/main">
        <div className="absolute top-[1cm] left-[1cm] flex h-16 w-32 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          메인으로
        </div>
      </Link>
      <Link href="/">
        <div className="absolute top-[1cm] left-[5cm] flex h-16 w-32 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 bg-blue-400 text-white text-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          추천페이지로
        </div>
      </Link>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">마이페이지</h1>
          </div>
          {user ? (
            <div className="flex flex-col items-center space-y-4">
              <img
                src={user.user_metadata.avatar_url}
                alt="사용자 아바타"
                className="h-24 w-24 rounded-full object-cover"
              />
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {user.user_metadata.full_name}
                </div>
                <div className="text-sm text-gray-600">
                  {user.user_metadata.email}
                </div>
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                supabase.auth.signInWithOAuth({
                  provider: "google",
                });
              }}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
            >
              구글 로그인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
