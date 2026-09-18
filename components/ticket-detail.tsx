"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import "./ticket-detail.css";

type IconName = "guest" | "time" | "place" | "dress" | "support";

function TicketIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    guest: (
      <>
        <circle cx="12" cy="6" r="3" />
        <path d="M5 21v-3a7 7 0 0 1 14 0v3" />
      </>
    ),
    time: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 3" />
      </>
    ),
    place: (
      <>
        <path d="M12 22s7-7.3 7-13a7 7 0 0 0-14 0c0 5.7 7 13 7 13Z" />
        <circle cx="12" cy="9" r="2.3" />
      </>
    ),
    dress: (
      <>
        <path d="m9 3 3 2 3-2 2 2-2 5 4 10H5l4-10-2-5 2-2Z" />
        <path d="M9 10h6" />
      </>
    ),
    support: (
      <>
        <path d="M3 13v-2a9 9 0 0 1 18 0v2M3 13h3v7H5a2 2 0 0 1-2-2v-5Zm18 0h-3v7h1a2 2 0 0 0 2-2v-5ZM18 20c0 2-2 2-5 2" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={`ticket-icon ticket-icon-${name}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const TicketDetail = ({
  id,
  fullName,
  nameSuffix,
  autoDownload = false,
}: {
  id?: string;
  fullName?: string;
  nameSuffix?: string | null;
  autoDownload?: boolean;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const autoDownloadStarted = useRef(false);

  const handleExport = useCallback(async () => {
    const ticket = divRef.current;
    if (!ticket) return;
    const bounds = ticket.getBoundingClientRect();
    const width = Math.ceil(bounds.width);
    const height = Math.ceil(Math.max(bounds.height, ticket.scrollHeight));
    const dataUrl = await toPng(ticket, {
      includeQueryParams: true,
      width,
      height,
      pixelRatio: Math.min(6, Math.max(2, Math.ceil(1800 / width))),
    });
    const link = document.createElement("a");
    link.download = `${id} ${fullName}.png`;
    link.href = dataUrl;
    link.click();
  }, [id, fullName]);

  useEffect(() => {
    if (!autoDownload || autoDownloadStarted.current) return;
    autoDownloadStarted.current = true;
    void (async () => {
      await document.fonts.ready;
      const images = Array.from(divRef.current?.querySelectorAll("img") ?? []);
      await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
      await handleExport();
    })();
  }, [autoDownload, handleExport]);

  return (
    <main className="ticket-page">
      <div className="ticket-page-heading">
        <p className="ticket-page-eyebrow">CÙNG NHAU -</p>
        <h2>ĐI XA HƠN</h2>
        <p className="ticket-page-heading-subtitle">
          <span>HÀNH TRÌNH 11 NĂM – VỮNG BƯỚC TƯƠNG LAI</span>
        </p>
      </div>

      <div className="ticket-page-ticket-wrap">
      <div ref={divRef} className="event-ticket">
        <div className="ticket-anniversary" aria-hidden="true">
          11 YEARS
        </div>

        <aside className="ticket-stub">
          <span className="ticket-separator-flare" aria-hidden="true" />
          <p
            className={`ticket-code${(id?.length ?? 0) > 17 ? " ticket-code-long" : ""}${(id?.length ?? 0) > 28 ? " ticket-code-very-long" : ""}`}
          >
            Mã số: {id}
          </p>
          <p className="ticket-stub-script">
            Cùng nhau
            <br />
            đi xa hơn
          </p>
        </aside>

        <div className="ticket-main">
          <header className="ticket-heading">
            <div className="ticket-heading-copy">
              <div className="ticket-title-wrap">
                <h1>VÉ MỜI SỰ KIỆN</h1>
                <span className="ticket-title-streak" aria-hidden="true" />
              </div>
              <div className="ticket-kicker">
                <span>KỶ NIỆM 11 NĂM THÀNH LẬP AN VUI</span>
              </div>
              <p>
                TRI ÂN <b>•</b> KẾT NỐI <b>•</b> CÙNG NHAU ĐI XA HƠN
              </p>
            </div>
            <Image
              src="/assets/logo2.png"
              alt="11 years AN VUI"
              width={260}
              height={220}
              className="ticket-logo"
              priority
            />
          </header>

          <div className="ticket-details">
            <div className="ticket-detail-row">
              <TicketIcon name="guest" />
              <span className="ticket-detail-label">Kính mời:</span>
              <div className="ticket-detail-value">
                <strong>
                  {fullName}
                  {nameSuffix ? ` (${nameSuffix})` : ""}
                </strong>
              </div>
            </div>
            <div className="ticket-detail-row">
              <TicketIcon name="time" />
              <span className="ticket-detail-label">Thời gian:</span>
              <div className="ticket-detail-value">
                18h00 - Thứ Tư, ngày 23/09/2026
              </div>
            </div>
            <div className="ticket-detail-row">
              <TicketIcon name="place" />
              <span className="ticket-detail-label">Địa điểm:</span>
              <div className="ticket-detail-value">
                <strong>Hội trường Tràng An Place — Toà Hei Tower</strong>
                <br />
                Số 1 Nguỵ Như Kon Tum, phường Nhân Chính, quận Thanh Xuân, Hà
                Nội
              </div>
            </div>
            <div className="ticket-detail-row">
              <TicketIcon name="dress" />
              <span className="ticket-detail-label">Trang phục:</span>
              <div className="ticket-detail-value">
                Lịch sự để cùng Checkin kỉ niệm Sinh Nhật Công Ty, ưu tiên tông
                màu Trắng
              </div>
            </div>
          </div>

          <p className="ticket-description">
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

          <footer className="ticket-footer">
            <div className="ticket-footer-left">
              <div className="ticket-signature">
                <span>Tổng giám đốc</span>
                <strong>Phan Bá Mạnh</strong>
              </div>
              <p className="ticket-support">
                <TicketIcon name="support" />
                <span>
                  <strong>Hỗ trợ đón tiếp:</strong> Bà Nguyễn Thị Hoa - Hành
                  chính – Nhân sự · ĐT: 0974.479.642
                </span>
              </p>
            </div>
            <div className="ticket-qr-group">
              <div className="ticket-qr">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={`https://vemoi.anvui.vn/${id}`}
                  viewBox="0 0 256 256"
                  level="H"
                />
              </div>
              <p>Quét để xem chi tiết</p>
            </div>
          </footer>
        </div>
      </div>
      </div>

      <div className="ticket-actions">
        <button type="button" className="ticket-download-button" onClick={handleExport}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
          </svg>
          Tải vé xuống
        </button>
        <button
          type="button"
          className="ticket-map-button"
          onClick={() =>
            window.open(
              "https://www.google.com/maps/place/Tr%C3%A0ng+An+Palace/@21.002741,105.8055424,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ad6f65c2afff:0x86b971cd73de1552!8m2!3d21.002741!4d105.8055424!16s%2Fg%2F11h0cf9sjn?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D",
            )
          }
        >
          Di chuyển
        </button>
      </div>
      <p className="ticket-page-helper">Lưu vé về thiết bị để tham dự sự kiện</p>

      <div className="ticket-page-closing">
        <p className="ticket-page-closing-title"><span>HẸN GẶP BẠN TẠI SỰ KIỆN</span></p>
        <p>CÙNG NHAU KIẾN TẠO NHỮNG HÀNH TRÌNH Ý NGHĨA HƠN</p>
      </div>
    </main>
  );
};

export default TicketDetail;
