"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="shadow-sm xl:shadow-none left-0 right-0 w-full flex items-center justify-between h-16 xl:h-20 max-w-7xl mx-auto px-4 fixed top-0 z-50 bg-white">
      <a href="https://anvui.vn/" target="_blank">
        <Image
          src="/assets/logo-anvui.webp"
          alt="logo"
          width={200}
          height={200}
          className="object-contain w-[80px] xl:w-[120px] h-auto cursor-pointer"
        />
      </a>
      <div className="hidden xl:flex items-center gap-10">
        <a
          href="https://drive.google.com/drive/folders/1KrsJia9YtjotHjkGcREGhYoaEW3urCZq"
          target="_blank"
          className="hover:underline"
        >
          Hình ảnh sự kiện
        </a>
        <Link href="/" className="hover:underline">
          Trợ giúp
        </Link>
        <Link href="/" className="hover:underline">
          Ghi chú
        </Link>
      </div>

      <div>
        <a
          href="https://www.google.com/maps/place/Melorita+-+L%C3%A0ng+Ch%C3%A2u+%C3%82u,+Y%C3%AAn+B%C3%ACnh,+Th%E1%BA%A1ch+Th%E1%BA%A5t,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam/@20.9752801,105.4640404,16z/data=!4m6!3m5!1s0x31345dbf0235db3f:0x43f67b0ecc7570fc!8m2!3d20.9752801!4d105.4640404!16s%2Fg%2F11vdz6_729?utm_campaign=zalo&g_ep=Eg1tbF8yMDI1MDkwM18wIJvbDyoASAJQAQ%3D%3D"
          target="_blank"
          className="hidden xl:inline-block py-3 px-5 rounded-full bg-[#06107C] hover:opacity-80 text-white cursor-pointer"
        >
          Di chuyển
        </a>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 text-2xl xl:hidden"
        >
          ☰
        </button>
      </div>

      <div
        className={`bg-white absolute top-full left-0 w-full transition-all duration-700 ease-in-out overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4 items-center py-4">
          <a
            href="https://drive.google.com/drive/folders/1KrsJia9YtjotHjkGcREGhYoaEW3urCZq"
            target="_blank"
            className="hover:underline"
          >
            Hình ảnh sự kiện
          </a>
          <Link href="/" className="hover:underline">
            Trợ giúp
          </Link>
          <Link href="/" className="hover:underline">
            Ghi chú
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
