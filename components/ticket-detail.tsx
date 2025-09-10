"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useMediaQuery } from "react-responsive";
import QRCode from "react-qr-code";

const TicketDetail = ({ id, fullName }: { id?: string; fullName?: string }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const divRef = useRef<HTMLDivElement>(null);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1279 });

  const handleExport = async () => {
    if (!divRef.current) return;
    const dataUrl = await toPng(divRef.current);
    const link = document.createElement("a");
    link.download = `${id} ${fullName}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (!isMounted) return null;

  return isTabletOrMobile ? (
    <div className="pt-20">
      <div
        ref={divRef}
        className="px-4 w-[95%] mx-auto relative text-white my-4 text-sm"
      >
        <Image
          src="/assets/bg-mobile.png"
          alt="background"
          fill
          className="z-0"
        />
        <div className="relative pb-10">
          <div className="pt-6 pb-4 text-center border-b border-dashed border-white -mx-4">
            <p className="text-xl font-bold whitespace-nowrap">Mã số: {id}</p>
          </div>

          <div className="flex w-full justify-between items-end">
            <div className="mb-4">
              <p className="text-lg font-bold">#</p>
              <h2 className="font-bold text-2xl mt-1">VÉ MỜI SỰ KIỆN</h2>
            </div>
            <Image
              src="/assets/logo.svg"
              alt="background"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[130px] font-bold">Kính mời: </p>
            <p className="flex-1">
              <strong className="text-base">{fullName}</strong>
            </p>
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[130px] font-bold">Thời gian:</p>
            <p className="flex-1">
              Xuất phát từ Khách sạn thể thao (15 Lê Văn Thiêm, Thanh Xuân, Hà
              Nội)
            </p>
          </div>

          <div className="flex ml-32">
            <strong className="text-base inline-block p-2 mt-2 rounded-lg bg-white/30 backdrop-blur-sm">
              12h01 (23/9) - 12h (24/9)
            </strong>
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[130px] font-bold">Trang phục:</p>
            <p className="flex-1">
              Áo team xanh coban (<strong>AN VUI</strong> đã chuẩn bị áo cho
              khách mời tham dự)
            </p>
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[130px] font-bold">Địa điểm tổ chức:</p>
            <p className="flex-1">
              Làng Châu Âu Melorita Hoà Lạc, Yên Xuân, Hoà Lạc
            </p>
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

          <div className="flex justify-between mt-10 gap-10">
            <p className="w-2/3 text-sm mt-auto">
              <strong>AN VUI</strong> có sắp xếp xe đưa đón và ăn nghỉ trong
              suốt quá trình diễn ra sự kiện. <br /> Hotline hỗ trợ đón tiếp:
              Mrs Hoa 0974479642
            </p>
            <div>
              <p className="mb-1 text-xs text-center">Quét để xem chi tiết</p>
              <div className="bg-white size-[120px] relative p-2 rounded-lg">
                <div
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 120,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`https://vemoi.anvui.vn/${id}`}
                    viewBox={`0 0 256 256`}
                    level="H"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 flex gap-2 mb-10">
        <button
          className="flex-1 py-2 px-5 rounded-full border border-[#06107C] text-[#06107C] font-semibold hover:opacity-80 cursor-pointer"
          onClick={handleExport}
        >
          Tải vé xuống
        </button>
        <button
          className="flex-1 py-2 px-5 rounded-full border bg-[#06107C] text-white font-semibold hover:opacity-80 cursor-pointer"
          onClick={() =>
            window.open(
              "https://www.google.com/maps/place/Melorita+-+L%C3%A0ng+Ch%C3%A2u+%C3%82u,+Y%C3%AAn+B%C3%ACnh,+Th%E1%BA%A1ch+Th%E1%BA%A5t,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam/@20.9752801,105.4640404,16z/data=!4m6!3m5!1s0x31345dbf0235db3f:0x43f67b0ecc7570fc!8m2!3d20.9752801!4d105.4640404!16s%2Fg%2F11vdz6_729?utm_campaign=zalo&g_ep=Eg1tbF8yMDI1MDkwM18wIJvbDyoASAJQAQ%3D%3D"
            )
          }
        >
          Di chuyển
        </button>
      </div>
    </div>
  ) : (
    <div className="max-w-7xl mx-auto pt-28 py-10">
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
              Áo team xanh coban (<strong>AN VUI</strong> đã chuẩn bị áo cho
              khách mời tham dự)
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
              <strong>AN VUI</strong> có sắp xếp xe đưa đón và ăn nghỉ trong
              suốt quá trình diễn ra sự kiện. <br /> Hotline hỗ trợ đón tiếp:
              Mrs Hoa 0974479642
            </p>
            <div>
              <p className="mb-1 text-sm text-center">Quét để xem chi tiết</p>
              <div className="bg-white max-w-[150px] relative p-2 rounded-lg">
                <div
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 150,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`https://vemoi.anvui.vn/${id}`}
                    viewBox={`0 0 256 256`}
                    level="H"
                  />
                </div>
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
          Tải vé xuống
        </button>
      </div>
    </div>
  );
};

export default TicketDetail;
