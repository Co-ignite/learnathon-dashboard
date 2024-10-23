"use client"

import Sidebar from "@/components/admin/sidebar"
import { useState, useEffect } from "react"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [path, setPath] = useState("/admin")

  useEffect(() => {
    console.log("path", window.location.pathname)
    setPath(window.location.pathname)
  }, [])

  return (
    <html lang="en">
      <body>
        <div className="w-screen h-screen p-0 m-0 flex flex-col">
          <div className="w-screen h-[10%] bg-black flex justify-between items-center px-10">
            <div className="text-2xl font-bold">
              Learnathon
            </div>
          </div>
          <div className="w-screen h-[90%] flex flex flex-row">
            <Sidebar
              path={path}
              setPath={setPath}
            />
            <div className="w-4/5 h-full overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
