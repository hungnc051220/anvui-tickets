"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useMediaQuery } from "react-responsive";
import QRCode from "react-qr-code";

const TicketDetail = ({
  id,
  fullName,
  nameSuffix,
}: {
  id?: string;
  fullName?: string;
  nameSuffix?: string | null;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const divRef = useRef<HTMLDivElement>(null);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1279 });

  const handleExport = async () => {
    if (!divRef.current) return;
    // Next.js image URLs differ by query parameters; keep them in html-to-image's cache key.
    const dataUrl = await toPng(divRef.current, { includeQueryParams: true });
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

          <div className="flex w-full justify-between items-center">
            <div className="mb-4">
              <h2 className="font-bold text-2xl">VÉ MỜI SỰ KIỆN</h2>
            </div>
            <Image
              src="/assets/logo2.png"
              alt="background"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[130px] font-bold">Kính mời: </p>
            <p className="flex-1">
              <strong className="text-base">
                {fullName}
                {nameSuffix ? ` (${nameSuffix})` : ""}
              </strong>
            </p>
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[130px] font-bold">Thời gian:</p>
            <p className="flex-1">18h00, Thứ Tư, ngày 23/09/2026</p>
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[130px] font-bold">Địa điểm:</p>
            <div className="flex-1">
              <p className="font-bold">
                Hội trường Tràng An Place — Toà Hei Tower
              </p>
              <p className="text-sm">
                Số 1 Nguỵ Như Kon Tum, phường Nhân Chính, quận Thanh Xuân, Hà
                Nội
              </p>
            </div>
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[130px] font-bold">Trang phục:</p>
            <p className="flex-1">
              Lịch sự để cùng Checkin kỉ niệm Sinh Nhật Công Ty, ưu tiên tông
              màu Trắng
            </p>
          </div>

          <p className="mt-6">
            Mười một năm – một chặng đường không dài nhưng đủ để tập thể{" "}
            <strong>AN VUI</strong> khẳng định bản lĩnh và khát vọng của mình.
            Nhìn lại hành trình đã qua, chúng ta tự hào vì đã cùng nhau vượt qua
            biết bao thử thách để hôm nay có thể ngồi lại, chia sẻ, và cùng nhau
            viết tiếp những dấu mốc đáng nhớ. Cảm ơn những người đồng hành, hậu
            phương vững chắc đã luôn hiện diện trong hành trình ấy. Chính sự gắn
            bó và tin tưởng đã tạo nên sức mạnh cho <strong>AN VUI</strong>.
            Chúng tôi trân trọng và mong được đón tiếp tại sự kiện kỷ niệm 11
            năm đầy ý nghĩa này.
          </p>

          <div className="flex justify-between mt-10 gap-10">
            <div className="mt-auto">
              <h4 className="text-xl font-bold">Tổng giám đốc</h4>
              <h4 className="text-xl font-bold mb-1">Phan Bá Mạnh</h4>
              <p className="mt-auto">
                Hỗ trợ đón tiếp: Bà Nguyễn Thị Hoa - Hành chính – Nhân sự · ĐT:
                0974.479.642
              </p>
            </div>
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
              "https://www.google.com/maps/place/Tr%C3%A0ng+An+Palace/@21.002741,105.8055424,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ad6f65c2afff:0x86b971cd73de1552!8m2!3d21.002741!4d105.8055424!16s%2Fg%2F11h0cf9sjn?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D",
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
          src="/assets/logo2.png"
          alt="logo"
          fill
          className="z-0 opacity-8 object-contain"
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
              <h2 className="font-bold text-5xl mt-10">VÉ MỜI SỰ KIỆN</h2>
            </div>
            <Image
              src="/assets/logo2.png"
              alt="background"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="flex items-center mt-4">
            <p className="w-[150px] font-bold">Kính mời: </p>
            <p className="">
              <strong className="text-2xl">
                {fullName}
                {nameSuffix ? ` (${nameSuffix})` : ""}
              </strong>
            </p>
          </div>

          <div className="flex items-center mt-4">
            <p className="w-[150px] font-bold">Thời gian:</p>
            <p className="font-bold">18h00 - Thứ Tư, ngày 23/09/2026</p>
          </div>

          <div className="flex items-start mt-4">
            <p className="w-[150px] font-bold">Địa điểm:</p>
            <div>
              <p className="font-bold">
                Hội trường Tràng An Place — Toà Hei Tower
              </p>
              <p className="text-sm">
                Số 1 Nguỵ Như Kon Tum, phường Nhân Chính, quận Thanh Xuân, Hà
                Nội
              </p>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <p className="w-[150px] font-bold">Trang phục:</p>
            <p>
              Lịch sự để cùng Checkin kỉ niệm Sinh Nhật Công Ty, ưu tiên tông
              màu Trắng
            </p>
          </div>

          <p className="mt-6">
            Mười một năm – một chặng đường không dài nhưng đủ để tập thể{" "}
            <strong>AN VUI</strong> khẳng định bản lĩnh và khát vọng của mình.
            Nhìn lại hành trình đã qua, chúng ta tự hào vì đã cùng nhau vượt qua
            biết bao thử thách để hôm nay có thể ngồi lại, chia sẻ, và cùng nhau
            viết tiếp những dấu mốc đáng nhớ. Cảm ơn những người đồng hành, hậu
            phương vững chắc đã luôn hiện diện trong hành trình ấy. Chính sự gắn
            bó và tin tưởng đã tạo nên sức mạnh cho <strong>AN VUI</strong>.
            Chúng tôi trân trọng và mong được đón tiếp tại sự kiện kỷ niệm 11
            năm đầy ý nghĩa này.
          </p>

          <div className="flex justify-between items-end mt-auto">
            <div>
              <h4 className="text-2xl font-bold">Tổng giám đốc</h4>
              <h4 className="text-2xl font-bold mb-1">Phan Bá Mạnh</h4>
              <p>
                Hỗ trợ đón tiếp: Bà Nguyễn Thị Hoa - Hành chính – Nhân sự · ĐT:
                0974.479.642
              </p>
            </div>
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
