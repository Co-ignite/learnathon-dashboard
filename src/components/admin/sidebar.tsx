// Suggested code may be subject to a license. Learn more: ~LicenseLog:3394283034.
"use client"

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";

interface SidebarProps {
  path: string;
  setPath: (path: string) => void;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  isSidebarOpen: boolean;
  tiles: {
    name: string;
    icon: JSX.Element;
    path: string;
    open?: boolean;
    subTiles?: {
      name: string;
      path: string;
      icon: JSX.Element;
    }[];
  }[];
  setTiles: (tiles: any) => void;
}

export default function Sidebar(props: SidebarProps) {
  const router = useRouter();
  return (
    <>
      <motion.section
        initial={{ width: "16%" }}
        animate={{
          width: props.isSidebarOpen ? "16%" : "6%",
          display: "hidden",
        }}
        transition={{ duration: 0.5 }}
        id="sidebar"
        className="bg-black h-full text-white flex flex-col justify-between overflow-visible"
      >
        <div className="py-4">
          {props.tiles.map((tile) => (
            <motion.div
              key={tile.path}
              onClick={() => {
                router.push(tile.path);
                props.setPath(tile.path);
                props.setTiles([...props.tiles]);
              }}
              className={`cursor-pointer mx-4 mb-4 px-4 py-2 flex flex-row gap-2 rounded cursor-pointer ${props.path === tile.path
                ? "bg-white text-black font-bold"
                : "hover:bg-white hover:text-black"
                }`}
            >
              {tile.icon}
              {props.isSidebarOpen ? tile.name : ""}
            </motion.div>
          ))}
        </div>
        <div
          onClick={() => {
            if (auth.currentUser !== null) {
              auth.signOut();
              window.location.href = "/";
            } else {
              console.error("Fill the form to logout");
            }
          }}
          className={`cursor-pointer mx-4 mb-4 px-4 py-2 tracking flex flex-row items-center gap-4 ${"hover:bg-white hover:text-black"}`}
        >
          {props.isSidebarOpen ? "Logout" : ""}
          <LogOut size={20} />
        </div>
      </motion.section>
    </>
  );
}