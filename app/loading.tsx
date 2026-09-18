export default function Loading() {
  return (
    <main className="route-loading" data-route-loading aria-label="Đang tải trang">
      <span className="route-loading__indicator" role="status" aria-label="Đang tải" />
    </main>
  );
}
