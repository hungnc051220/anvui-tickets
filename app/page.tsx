const VIDEO_URL =
  "https://drive.google.com/file/d/10rezsaLabTh9xPAegxiQG6XoY81tVhoI/preview";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 xl:pt-32">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#06107C]">
          Kỷ niệm 11 năm AN VUI
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          AN VUI trân trọng kính mời
        </h1>
        <p className="mt-3 text-slate-600">Cùng nhìn lại hành trình và đón chờ sự kiện sắp tới.</p>
        <div className="mt-8 overflow-hidden rounded-2xl bg-black shadow-lg">
          <iframe
            src={VIDEO_URL}
            title="Video sự kiện kỷ niệm 11 năm AN VUI"
            className="aspect-video w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <a
          href="https://drive.google.com/file/d/10rezsaLabTh9xPAegxiQG6XoY81tVhoI/view"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm font-semibold text-[#06107C] underline"
        >
          Mở video trên Google Drive
        </a>
      </div>
    </main>
  );
}
