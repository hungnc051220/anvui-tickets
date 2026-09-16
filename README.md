# Vé mời AN VUI

Ứng dụng Next.js hiển thị video sự kiện tại `/`, danh sách khách mời riêng tại `/khach-moi` và vé riêng theo mã.

## Cấu hình

Dùng Node.js 24 trở lên. Sao chép `.env.example` thành `.env` tại thư mục gốc (file `.env` đã được Git bỏ qua):

```env
DATABASE_URL="postgresql://..."
GUEST_LIST_SESSION_SECRET="chuoi-ngau-nhien-dai-it-nhat-32-ky-tu"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

`DATABASE_URL` dùng URL kết nối Postgres có TLS; URL pooler của Neon hoạt động với cấu hình hiện tại. `GUEST_LIST_SESSION_SECRET` dùng để ký cookie phiên xem danh sách. Mật khẩu danh sách được cố định trong mã server là `anvui68`.

## Chạy ứng dụng

```bash
yarn install
yarn db:setup
yarn dev
```

`db:setup` tạo bảng `guests` nếu chưa có. Trang chủ `/` phát video Google Drive. Mở `/khach-moi`, nhập mật khẩu và bấm **Đồng bộ** cạnh ô tìm kiếm để lấy danh sách mới nhất. Danh sách chỉ được tải từ Postgres sau khi phiên đăng nhập hợp lệ; link vé riêng vẫn mở được bằng mã vé.

### Import Excel

File import chỉ nhận `.xlsx`, tối đa 4 MB và 5.000 dòng. Dòng đầu phải là `Mã vé` và `Họ tên`; các dòng sau chứa mã vé duy nhất và tên khách. Có thể tải file mẫu trong phần Import Excel của màn danh sách. Mã trùng được bỏ qua và báo lại sau khi import. Nếu có dòng thiếu hoặc sai dữ liệu, toàn bộ file bị từ chối. Nên đặt cột mã vé ở kiểu văn bản để giữ số 0 ở đầu.

### Đồng bộ Google Sheets

Nút **Đồng bộ** ở `/khach-moi` lấy dữ liệu từ sheet đăng ký hiện tại (tab `gid=1760843707`). Chỉ các dòng có họ tên được lấy. Cột `STT - Mã số` tạo mã vé `SN11Y-<số>`; `Xưng hô` được ghép trước `Họ và tên`. Hai cột `Người thân của ai` và `Chức vụ` được lưu riêng; trong danh sách, chúng nằm ở dòng nhỏ màu xanh dưới tên; trên vé, chúng hiện trong ngoặc sau tên. Mỗi lần đồng bộ thay toàn bộ danh sách cũ trong một giao dịch; khách đã xóa khỏi sheet sẽ không còn vé. Sheet chỉ có tiêu đề và không có khách sẽ tạo danh sách rỗng. Nếu sheet không đọc được hoặc có dòng không hợp lệ, dữ liệu cũ được giữ nguyên. File Excel có thể thêm khách thủ công trong phần mở rộng trên màn danh sách, nhưng lần đồng bộ Sheets sau sẽ thay toàn bộ danh sách đó. Sheet cần tiếp tục cho phép tải CSV công khai để server đọc được. Trang danh sách đọc Postgres và không gọi Google Sheets mỗi lần mở.

## Triển khai trên Vercel

Khai báo `DATABASE_URL`, `GUEST_LIST_SESSION_SECRET` và `NEXT_PUBLIC_BASE_URL` cho môi trường production. Chạy `yarn db:setup` một lần với cùng `DATABASE_URL` trước khi mở ứng dụng. Dùng URL pooler Neon cho runtime; dữ liệu không phụ thuộc bộ nhớ hoặc ổ đĩa của Vercel. Không đưa `.env` vào Git.

Kiểm tra bằng `yarn test`, `yarn build`.
