"use client";

import html2canvas from "html2canvas";
import Image from "next/image";
import { useRef } from "react";
import { toPng } from "html-to-image";

const TicketDetail = ({ id, fullName }: { id?: string; fullName?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!divRef.current) return;
    const dataUrl = await toPng(divRef.current);
    const link = document.createElement("a");
    link.download = `${id} ${fullName}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div ref={divRef} className="text-white h-[850px] w-full flex relative">
        <Image src="/assets/bg.png" alt="background" fill className="z-0" />
        <Image
          src="/assets/logo.svg"
          alt="logo"
          fill
          className="z-0 opacity-5"
        />
        <div className="relative z-50 w-[180px] flex items-center justify-center">
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[repeating-linear-gradient(to_bottom,white_0,white_12px,transparent_12px,transparent_20px)]" />
          <p className="text-6xl font-bold rotate-[270deg] whitespace-nowrap ml-6">
            Mã số: {id}
          </p>
        </div>
        <div className="relative z-50 p-16 flex flex-col h-full">
          <div className="flex w-full justify-between">
            <div>
              <p className="text-2xl font-bold">#</p>
              <h2 className="font-bold text-5xl mt-10">VÉ MỜI SỰ KIỆN</h2>
            </div>
            <Image
              src="/assets/logo.svg"
              alt="background"
              width={250}
              height={250}
              className="object-contain"
            />
          </div>
          <div className="flex items-center mt-4">
            <p className="w-[150px] font-bold">Kính mời: </p>
            <p className="">
              <strong className="text-2xl">{fullName}</strong>
            </p>
          </div>

          <div className="flex items-center mt-4">
            <p className="w-[150px] font-bold">Thời gian:</p>
            <p className="">
              Xuất phát từ Khách sạn thể thao (15 Lê Văn Thiêm, Thanh Xuân, Hà
              Nội)
            </p>
          </div>

          <div className="flex ml-36">
            <strong className="text-lg border-dashed border border-white inline-block p-2 mt-2 rounded-lg">
              12h01 (23/9) - 12h (24/9)
            </strong>
          </div>

          <div className="flex items-center mt-4">
            <p className="w-[150px] font-bold">Trang phục:</p>
            <p>
              Áo team xanh coban (<strong>AN VUI</strong> đã chuẩn bị áo cho khách mời tham dự)
            </p>
          </div>

          <div className="flex items-center mt-4">
            <p className="w-[150px] font-bold">Địa điểm tổ chức:</p>
            <p>Làng Châu Âu Melorita Hoà Lạc, Yên Xuân, Hoà Lạc</p>
          </div>

          <p className="mt-6">
            Mười năm – một chặng đường không dài nhưng đủ để tập thể AN VUI
            khẳng định bản lĩnh và khát vọng của mình. Nhìn lại hành trình đã
            qua, chúng ta tự hào vì đã cùng nhau vượt qua biết bao thử thách để
            hôm nay có thể ngồi lại, chia sẻ, và cùng nhau viết tiếp những dấu
            mốc đáng nhớ. Cảm ơn những người đồng hành, hậu phương vững chắc đã
            luôn hiện diện trong hành trình ấy. Chính sự gắn bó và tin tưởng đã
            tạo nên sức mạnh cho <strong>AN VUI</strong>. Chúng tôi trân trọng
            và mong được đón tiếp bạn tại sự kiện kỷ niệm 10 năm đầy ý nghĩa
            này.
          </p>

          <div className="flex justify-between mt-auto">
            <p className="w-2/3 mt-auto">
              An vui có sắp xếp xe đưa đón và ăn nghỉ trong suốt quá trình diễn
              ra sự kiện. <br /> Hotline hỗ trợ đón tiếp: Mrs Hoa 0974479642
            </p>
            <div>
              <p className="mb-1 text-sm text-center">Quét để biết vị trí</p>
              <div className="bg-white size-[150px] relative p-2 rounded-lg">
                <Image
                  src="/assets/qr.png"
                  alt="qr"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="py-3 px-5 rounded-full border border-[#06107C] text-[#06107C] font-semibold hover:opacity-80 cursor-pointer"
          onClick={handleExport}
        >
          In vé
        </button>
      </div>
    </div>
  );
};

export default TicketDetail;
