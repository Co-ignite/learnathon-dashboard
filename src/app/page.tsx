"use client"

import Image from "next/image";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { useEffect } from "react";
import { NextResponse } from "next/server";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter()

  const getUserData = async () => {
    if (user) {
      try {
        const response = await axios.get(`http://3000-idx-learnathon-1729498515966.cluster-7ubberrabzh4qqy2g4z7wgxuw2.cloudworkstations.dev/auth/${user.uid}`)
        if (response.status === 200) {
          const data = response.data
          if (data.role === 'Admin') {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      router.push('/login')
    }
  }

  useEffect(() => {
    if (loading) return;
    getUserData()
  }, [loading, getUserData])

  return <div className="flex items-center justify-center min-h-screen bg-black">Loading...</div>;
}
