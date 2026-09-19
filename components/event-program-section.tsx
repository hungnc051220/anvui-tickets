import styles from "./event-program-section.module.css";

const programItems = [
  {
    time: "18:30 – 19:00",
    title: "ĐÓN KHÁCH",
    description: "Đăng ký, chụp ảnh lưu niệm, giao lưu",
    icon: "guests",
  },
  {
    time: "19:00 – 19:05",
    title: "KHAI MẠC",
    description: "Tuyên bố lý do, giới thiệu đại biểu",
    icon: "announce",
  },
  {
    time: "19:05 – 19:20",
    title: "VĂN NGHỆ CHÀO MỪNG",
    icon: "music",
  },
  {
    time: "19:20 – 19:30",
    title: "GIỚI THIỆU AN VUI",
    description: "Hệ sinh thái chuyển đổi số vận tải hành khách",
    icon: "screen",
  },
  {
    time: "19:30 – 19:45",
    title: "CÁC DẤU MỐC TRONG HÀNH TRÌNH AN VUI",
    description: "Từ ngày thành lập 23/9/2015 đến hôm nay",
    icon: "milestones",
  },
  {
    time: "19:45 – 19:55",
    title: "GIỚI THIỆU BAN LÃNH ĐẠO CÔNG TY",
    icon: "leadership",
  },
  {
    time: "19:55 – 20:00",
    title: "PHÁT BIỂU CỦA TỔNG GIÁM ĐỐC",
    description: "Ông Phan Bá Mạnh",
    icon: "microphone",
    highlight: true,
  },
  {
    time: "20:00 – 20:15",
    title: "NGHI THỨC BÁNH SINH NHẬT",
    description: "Cắt bánh, nâng ly chúc mừng, chụp ảnh lưu niệm",
    icon: "cake",
    highlight: true,
  },
  {
    time: "20:15 – 21:30",
    title: "DÙNG TIỆC VÀ GIAO LƯU",
    icon: "dinner",
  },
  {
    time: "21:30 – 21:45",
    title: "LỜI KẾT — CẢM ƠN VÀ CHIA TAY",
    icon: "heart",
  },
];

function ProgramIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 10h18" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    guests: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5" />
      </>
    ),
    announce: (
      <>
        <path d="m4 14 12-5v10L4 14Zm0 0v-4l12-5v4M7 15l1 5h4l-2-6m9-6 2-2m-2 8 2 2" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V6l10-2v12M9 9l10-2" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </>
    ),
    screen: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8m-4-4v4" />
      </>
    ),
    milestones: (
      <>
        <path d="M4 20v-5h4v5m2 0V9h4v11m2 0V4h4v16" />
      </>
    ),
    leadership: (
      <>
        <circle cx="12" cy="7" r="3" />
        <circle cx="4.5" cy="10" r="2" />
        <circle cx="19.5" cy="10" r="2" />
        <path d="M7 21v-2a5 5 0 0 1 10 0v2M1 19v-1a4 4 0 0 1 5-4m17 5v-1a4 4 0 0 0-5-4" />
      </>
    ),
    microphone: (
      <>
        <rect x="8" y="3" width="8" height="13" rx="4" />
        <path d="M5 11a7 7 0 0 0 14 0m-7 7v3m-4 0h8" />
      </>
    ),
    cake: (
      <>
        <path d="M4 12h16v9H4v-9Zm0 5h16M8 12V9m4 3V8m4 4V9" />
        <path d="M8 6c1-1 1-2 0-3-1 1-1 2 0 3Zm4-1c1-1 1-2 0-3-1 1-1 2 0 3Zm4 1c1-1 1-2 0-3-1 1-1 2 0 3Z" />
      </>
    ),
    dinner: (
      <>
        <path d="M5 3v7m3-7v7M3 7h7m-3 3v11M16 3v18m0-12c3 0 5-2 5-6v9h-5" />
      </>
    ),
    heart: <path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function NoticeIcon({ name }: { name: "bell" | "clock" | "car" | "utensils" }) {
  const paths: Record<string, React.ReactNode> = {
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5h4" />
      </>
    ),
    car: (
      <>
        <path d="m5 11 1.5-4h11l1.5 4M4 11h16a2 2 0 0 1 2 2v5H2v-5a2 2 0 0 1 2-2Z" />
        <path d="M5 18v2m14-2v2M6 14h2m8 0h2" />
      </>
    ),
    utensils: (
      <>
        <path d="M6 3v7m3-7v7M3 7h9m-4 3v11M16 3v18m0-12c3 0 5-2 5-6v9h-5" />
      </>
    ),
  };

  return (
    <svg
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

export function EventSectionShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={`event-section ${styles.eventShell}`}
      id="su-kien"
      aria-labelledby="event-section-title"
    >
      {children}
    </section>
  );
}

export function EventSectionHeader() {
  return (
    <header className={`site-container ${styles.heading}`} data-event-header>
      <p className={styles.eyebrow} data-event-eyebrow>KỶ NIỆM 11 NĂM AN VUI</p>
      <h2 id="event-section-title" data-event-title>THÔNG TIN &amp; CHƯƠNG TRÌNH SỰ KIỆN</h2>
      <p data-event-description>Một đêm cùng nhìn lại hành trình 11 năm và hướng tới tương lai</p>
      <div
        className={styles.meta}
        aria-label="Thông tin thời gian và địa điểm sự kiện"
        data-event-meta
      >
        <span>
          <ProgramIcon name="calendar" />
          Thứ Tư, 23/09/2026
        </span>
        <span>
          <ProgramIcon name="clock" />
          18:00 – 21:45
        </span>
        <span>
          <ProgramIcon name="location" />
          Trống An Palace – Hei Tower
        </span>
      </div>
    </header>
  );
}

export function EventSectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className={`site-container ${styles.dividerTitle}`} data-event-divider>
      <span aria-hidden="true" />
      <h3>{children}</h3>
      <span aria-hidden="true" />
    </div>
  );
}

export default function EventProgramSection() {
  return (
    <>
      <EventSectionDivider>LỊCH TRÌNH SỰ KIỆN</EventSectionDivider>
      <div className={`site-container ${styles.container}`}>
        <div className={styles.timeline} data-event-timeline>
          {programItems.map((item) => (
            <article
              className={`${styles.item} ${item.highlight ? styles.highlight : ""}`}
              key={item.time}
              data-event-timeline-item
            >
              <time>{item.time}</time>
              <div className={styles.rail} aria-hidden="true" data-event-timeline-rail>
                <i data-event-timeline-dot />
              </div>
              <div className={styles.card}>
                <span className={styles.icon}>
                  <ProgramIcon name={item.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
      <aside
        className={`site-container ${styles.notice} ${styles.container}`}
        aria-labelledby="event-notice-title"
        data-event-notice
      >
        <header className={styles.noticeHeader}>
          <span className={styles.noticeHeaderIcon}>
            <NoticeIcon name="bell" />
          </span>
          <i className={styles.noticeHeaderDivider} aria-hidden="true" />
          <div className={styles.noticeHeading}>
            <h3 id="event-notice-title">Kính mong Quý khách lưu ý</h3>
            <p>Để sự kiện diễn ra trọn vẹn và chu đáo hơn</p>
          </div>
        </header>

        <div className={styles.noticeRule} aria-hidden="true">
          <span />
        </div>

        <ul className={styles.noticeList}>
          <li data-event-notice-item>
            <span className={styles.noticeItemIcon}>
              <NoticeIcon name="clock" />
            </span>
            <p>
              Quý khách vui lòng có mặt trước <strong>19h00</strong> để Ban Tổ chức
              đón tiếp và mời vào chỗ ngồi.
            </p>
          </li>
          <li data-event-notice-item>
            <span className={styles.noticeItemIcon}>
              <NoticeIcon name="car" />
            </span>
            <p>Tòa nhà có hầm gửi xe, Ban Tổ chức bố trí người hướng dẫn tại sảnh.</p>
          </li>
          <li data-event-notice-item>
            <span className={styles.noticeItemIcon}>
              <NoticeIcon name="utensils" />
            </span>
            <p>
              Quý khách có nhu cầu về suất ăn riêng (chay, dị ứng thực phẩm) xin
              báo trước với Ban Tổ chức.
            </p>
          </li>
        </ul>
      </aside>
    </>
  );
}
