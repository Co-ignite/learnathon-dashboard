"use client"

import { useState } from "react";
import Link from "next/link";

export default function Sidebar(props: any) {
  const [tiles, setTiles] = useState([
    {
      "name": "Home",
      "path": "/admin"
    },
    {
      "name": "Modules",
      "path": "/admin/modules"
    },
    {
      "name": "Colleges",
      "path": "/admin/colleges"
    },
    {
      "name": "Trainers",
      "path": "/admin/trainers"
    },
    {
      "name": "Users",
      "path": "/admin/users"
    }
  ]);
  return (
    <section id="sidebar" className="w-1/5 bg-black h-full text-white">
      <ul className="py-4">
        {
          tiles.map((tile) => (
            <li
              onClick={
                props.setPath(tile.path)
              }
              className={"mx-4 px-4 py-2 hover:bg-gray-700" + (props.path === tile.path ? " bg-gray-700 font-bold" : "")}>
              <Link href={tile.path}>
                {tile.name}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}