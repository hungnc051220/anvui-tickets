import Image from "next/image";
import AnniversaryMotion from "@/components/anniversary-motion";
import EventProgramSection, {
  EventSectionDivider,
  EventSectionHeader,
  EventSectionShell,
} from "@/components/event-program-section";

const MAPS_URL =
  "https://www.google.com/maps/place/Tr%C3%A0ng+An+Palace/@21.002741,105.8055424,17z";
const milestones = [
  {
    date: "23/09/2015",
    title: "Thành lập AN VUI",
    description: "Khởi đầu với sứ mệnh số hóa ngành vận tải hành khách.",
    image: "/images/anniversary/milestones/2015-founded.png",
  },
  {
    date: "15/07/2016",
    title: "Ra mắt sản phẩm đầu tiên",
    description:
      "Phần mềm quản lý bán vé thông minh và những khách hàng đầu tiên.",
    image: "/images/anniversary/milestones/2016-product.png",
  },
  {
    date: "2016",
    title: "TOP 10 Startup tiêu biểu Việt Nam",
    description:
      "Dấu mốc đưa AN VUI ra ánh sáng cộng đồng khởi nghiệp công nghệ.",
    image: "/images/anniversary/milestones/2016-startup.png",
  },
  {
    date: "2017",
    title: "TOP 3 Giải thưởng Nhân tài Đất Việt",
    description: "Khẳng định năng lực sáng tạo và giá trị thực tiễn.",
    image: "/images/anniversary/milestones/2017-award.png",
  },
  {
    date: "2019",
    title: "VinaCapital Ventures đầu tư",
    description: "Cú hích mạnh mẽ về tài chính và chiến lược.",
    image: "/images/anniversary/milestones/2019-investment.png",
  },
  {
    date: "17/07/2019",
    title: "Mở chi nhánh tại TP.HCM",
    description: "Bước mở rộng quan trọng, phục vụ nhà xe trên toàn quốc.",
    image: "/images/anniversary/milestones/2019-hcm.png",
  },
  {
    date: "2019",
    title: "Đạt giải Sao Khuê từ VINASA",
    description: "Dấu mốc ghi nhận năng lực công nghệ trong ngành vận tải.",
    image: "/images/anniversary/milestones/2019-sao-khue.png",
  },
  {
    date: "2020",
    title: "Ra mắt Bến xe điện tử",
    description: "Giúp bến xe truyền thống chuyển mình sang thời đại số.",
    image: "/images/anniversary/milestones/2020-e-station.png",
  },
  {
    date: "25/08/2025",
    title: "Doanh nghiệp Khoa học Công nghệ",
    description:
      "Được chứng nhận Doanh nghiệp Khoa học Công nghệ và an toàn bảo mật cấp độ 3.",
    image: "/images/anniversary/milestones/2025-certificate.png",
  },
  {
    date: "01/07/2026",
    title: "Ra mắt dịch vụ trung chuyển hành khách",
    description:
      "Hợp tác thành công với các Bến Xe ra mắt dịch vụ trung chuyển hành khách đô thị.",
    image: "/assets/cityline.jpg",
  },
];
const stats = [
  { icon: "bus", value: "600+", label: "Nhà xe tin tưởng" },
  { icon: "network", value: "10.000+", label: "Phương tiện kết nối" },
  { icon: "users", value: "12 triệu", label: "Hành khách phục vụ" },
  { icon: "ticket", value: "1.000+", label: "Kênh bán vé" },
];
const eventDetails = [
  {
    icon: "calendar",
    label: "Thời gian",
    content: "18h00 · Thứ Tư, ngày 23/09/2026",
  },
  {
    icon: "pin",
    label: "Địa điểm",
    content: "Tràng An Palace – Tòa Hei Tower",
    sub: "Số 1 Ngụy Như Kon Tum, phường Nhân Chính, quận Thanh Xuân, Hà Nội",
  },
  {
    icon: "users",
    label: "Thành phần",
    content: "Nhân sự AN VUI và khách mời",
  },
  {
    icon: "shirt",
    label: "Trang phục",
    content:
      "Lịch sự để cùng check-in kỷ niệm sinh nhật Công ty; ưu tiên tông màu trắng.",
  },
];

function Icon({ name, size = 27 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    bus: (
      <>
        <rect x="3" y="3" width="18" height="16" rx="3" />
        <path d="M3 11h18M7 19v2m10-2v2M7 15h.01M17 15h.01" />
      </>
    ),
    network: (
      <>
        <circle cx="12" cy="4" r="2" />
        <circle cx="5" cy="18" r="2" />
        <circle cx="19" cy="18" r="2" />
        <path d="m11 6-5 10m7-10 5 10M7 18h10" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2H3ZM17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5" />
      </>
    ),
    ticket: (
      <>
        <path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Z" />
        <path d="M12 5v2m0 3v4m0 3v2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 10h18m-13 4h2m4 0h2m-8 3h2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    shirt: <path d="m8 3 4 2 4-2 5 4-3 4-2-1v11H8V10l-2 1-3-4 5-4Z" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function MilestoneTimeline() {
  return (
    <section className="timeline-section" id="dau-moc">
      <div className="site-container">
        <div className="section-heading">
          <h2>CÁC DẤU MỐC LÀM NÊN THƯƠNG HIỆU AN VUI</h2>
          <p>
            Từ một ý tưởng nhỏ đến nền tảng công nghệ số cho ngành vận tải hành
            khách tại Việt Nam
          </p>
        </div>
        <div className="timeline-grid">
          <div className="timeline-progress-line" aria-hidden="true" />
          {[0, 1].map((row) => (
            <div className="timeline-row" key={row}>
              <div className="timeline-row-progress-line" aria-hidden="true" />
              {milestones.slice(row * 5, row * 5 + 5).map((item) => (
                <article className="milestone" key={item.title}>
                  <div className="milestone-visual">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className={
                        item.date === "2026" ? "milestone-logo" : "milestone-photo"
                      }
                    />
                  </div>
                  <i className="milestone-dot" aria-hidden="true" />
                  <div className="milestone-copy">
                    <p className="milestone-date">{item.date}</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
        <div className="stats-bar">
          {stats.map((stat) => (
            <div className="stat" key={stat.value}>
              <Icon name={stat.icon} size={34} />
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="anniversary-page" id="trang-chu">
      <link rel="preload" as="image" href="/assets/anniversary-hero.jpg" />
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-art" />
        <div className="hero-shade" />
        <div className="site-container hero-inner">
          <p className="hero-side hero-side-left">
            VÌ MỘT NGÀNH VẬN TẢI
            <br />
            HIỆN ĐẠI, THÔNG MINH
            <br />
            VÀ NHÂN VĂN HƠN
          </p>
          <div className="hero-center">
            <p className="hero-eyebrow">KỶ NIỆM 11 NĂM AN VUI</p>
            <h1 id="hero-title" className="sr-only">
              Kỷ niệm 11 năm AN VUI, 2015 đến 2026
            </h1>
            <Image
              src="/assets/logo2.png"
              alt="11 YEARS AN VUI"
              width={1254}
              height={1254}
              priority
              className="hero-anniversary-logo"
            />
            <p className="hero-years">2015 – 2026</p>
            <p className="hero-description">
              11 năm – một hành trình của niềm tin, khát vọng và đổi mới.
              <br />
              Cảm ơn tất cả những người đã và đang đồng hành cùng AN VUI.
            </p>
          </div>
          <div className="hero-side hero-side-right">
            <p>
              KẾT NỐI
              <br />
              CON NGƯỜI
              <br />
              KIẾN TẠO
              <br />
              HÀNH TRÌNH
              <br />
              AN VUI
            </p>
            <span>
              Hành trình
              <br />
              tiếp nối tương lai
            </span>
            <small>CÙNG NHAU ĐI XA HƠN</small>
          </div>
        </div>
      </section>
      <MilestoneTimeline />
      <EventSectionShell>
        <EventSectionHeader />
        <EventSectionDivider>THÔNG TIN THAM DỰ</EventSectionDivider>
        <div className="site-container event-layout" data-event-layout>
          <div className="event-info" data-event-info>
            <div className="event-details">
              {eventDetails.map((detail) => (
                <div className="event-detail" key={detail.label} data-event-info-item>
                  <span className="event-icon">
                    <Icon name={detail.icon} />
                  </span>
                  <div>
                    <span className="event-label">{detail.label}</span>
                    <strong>{detail.content}</strong>
                    {detail.sub && <p>{detail.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="event-actions">
              <a
                className="gold-button event-map-button"
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-event-map-button
              >
                <Icon name="pin" size={18} /> Xem trên Google Maps
              </a>
            </div>
          </div>
          <div className="venue-gallery" id="hinh-anh" data-event-venue>
            <div className="venue-main venue-card" data-event-venue-main>
              <Image
                src="/assets/background-home.jpg"
                alt="Mặt ngoài tòa Hei Tower tại số 1 Ngụy Như Kon Tum"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="venue-photo"
              />
              <div className="venue-caption">
                <h3>
                  Tràng An Palace
                  <br />
                  Hei Tower
                </h3>
                <p>
                  Số 1 Ngụy Như Kon Tum,
                  <br />
                  P. Nhân Chính, Q. Thanh Xuân, Hà Nội
                </p>
              </div>
            </div>
            <div className="venue-side">
              <div className="venue-card venue-detail-photo" data-event-venue-small>
                <Image
                  src="/assets/Trang-An-Palace-Thanh-Xuan-12.jpg"
                  alt="Sảnh tiệc Tràng An Palace tại Thanh Xuân"
                  fill
                  sizes="(max-width: 768px) 45vw, 18vw"
                  className="venue-photo"
                />
              </div>
              <a
                className="venue-card venue-map"
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mở bản đồ Tràng An Palace trên Google Maps"
                data-event-venue-small
              >
                <div className="map-grid" />
                <span className="map-pin">
                  <Icon name="pin" size={27} />
                </span>
                <strong>
                  Tràng An Palace
                  <br />
                  Hei Tower
                </strong>
                <small>Nhấn để xem đường đi ↗</small>
              </a>
            </div>
          </div>
        </div>
        <EventProgramSection />
      </EventSectionShell>
      <AnniversaryMotion />
    </main>
  );
}
