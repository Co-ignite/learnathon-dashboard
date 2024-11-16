"use client";

import Sidebar from "src/components/admin/sidebar";
import { useState, useEffect, useDebugValue } from "react";
import {
  UserCircleIcon,
  LogOut,
  Settings,
  Home,
  BookAudioIcon,
  Building2Icon,
  GraduationCap,
  PanelLeftCloseIcon,
  PanelRightCloseIcon,
  Icon,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Toaster } from "src/components/ui/toaster";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  role: string;
  mail: string;
  contact: string;
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [path, setPath] = useState("/admin");
  const [openUserData, setOpenUserData] = useState(false);
  const [userData, setUserData] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tiles, setTiles] = useState([
    {
      name: "Register",
      icon: <Home size={20} />,
      path: "/dashboard/register",
      subTiles: [
        {
          name: "College Details",
          icon: <GraduationCap size={20} />,
          path: "/dashboard/register/college-details",
        },
      ],
    },
  ]);

  useEffect(() => {
    const parseUserData = () => {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error("Error parsing user data", e);
        return null;
      }
    };
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      setUserData(storedUserData);
      setUser(parseUserData());
    }

    console.log("path", window.location.pathname);
    setPath(window.location.pathname);
  }, [userData, router]);

  useEffect(() => {
    if (user) {
      console.log("user", user);
      if (user.role !== "college") {
        console.log("college");
        router.push("/");
      } else {
        router.push("/dashboard/register/");
      }
    }
  }, [user, router]);

  const UserDataPopup = () => {
    return (
      openUserData &&
      user && (
        <div
          onClick={() => {
            setOpenUserData(false);
          }}
          className="absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-20 z-50"
        >
          <div className="fixed top-0 right-0 bg-white rounded-lg p-4 shadow-lg min-h-content min-w-content m-12">
            <div
              className="bg-black text-white text-center py-2 px-10 mt-4 cursor-pointer flex flex-row gap-2"
              onClick={() => {}}
            >
              <Settings size={20} />
              Setting
            </div>
            <div
              className="bg-red-500 text-white text-center py-2 px-10 mt-4 cursor-pointer flex flex-row gap-2"
              onClick={() => {
                sessionStorage.removeItem("userData");
                // firebase auth logout
                auth.signOut();
                window.location.href = "/";
              }}
            >
              <LogOut size={20} />
              Logout
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <html lang="en">
      <body>
        <div className="relative">
          <UserDataPopup />
          <div className="w-screen h-screen p-0 m-0 flex flex-col ">
            <div className="w-screen h-[10%] bg-black text-white flex justify-between items-center px-10">
              <div className="text-2xl font-bold">Learnathon</div>
              <div className="flex items-center gap-2">
                {user && (
                  <div className="ml-2 flex flex-col text-right">
                    <div className="font-bold text-xl">
                      {user.name} |{" "}
                      <span className="font-bold text-sm">{user.role}</span>
                    </div>
                    <div className="flex flex-col text-sm font-normal text-grey-700">
                      <span>{user.mail}</span>
                      <span>{user.contact}</span>
                    </div>
                  </div>
                )}
                <UserCircleIcon
                  onClick={() => {
                    setOpenUserData(!openUserData);
                  }}
                  size={40}
                />
              </div>
            </div>
            <div className="w-screen h-[90%] flex flex flex-row">
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                path={path}
                setPath={setPath}
                tiles={tiles}
                setTiles={setTiles}
              />
              <motion.div
                initial={{ width: "85%" }}
                animate={{ width: isSidebarOpen ? "85%" : "96%" }}
                transition={{ duration: 0.5 }}
                className="overflow-y-auto overflow-x-hidden relative"
              >
                {children}
                <Toaster />
              </motion.div>
              <motion.button
                initial={{ left: "15%" }}
                animate={{ left: isSidebarOpen ? "15%" : "5%" }}
                transition={{ duration: 0.5 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute top-[15%] bg-black text-white p-2 rounded"
              >
                {isSidebarOpen ? (
                  <PanelLeftCloseIcon size={20} />
                ) : (
                  <PanelRightCloseIcon size={20} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
