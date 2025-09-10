import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="w-full flex items-center justify-between h-20 max-w-7xl mx-auto">
      <a href="https://anvui.vn/" target="_blank">
        <Image
          src="/assets/logo-anvui.webp"
          alt="logo"
          width={200}
          height={200}
          className="object-contain w-[120px] h-auto cursor-pointer"
        />
      </a>
      <div className="flex items-center gap-10">
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
          className="py-3 px-5 rounded-full bg-[#06107C] hover:opacity-80 text-white cursor-pointer"
        >
          Di chuyển
        </a>
      </div>
    </div>
  );
};

export default Header;
