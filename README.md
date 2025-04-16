# VenChill - Trang web xem phim trực tuyến chất lượng cao

VenChill là một trang web xem phim trực tuyến được xây dựng bằng Next.js và tối ưu cho Cloudflare Pages. Dự án này sử dụng API từ OPhim để cung cấp dữ liệu phim.

## Tính năng

- Trang chủ hiển thị slider phim nổi bật và các danh sách phim theo thể loại
- Trang chi tiết phim hiển thị thông tin chi tiết về phim và danh sách tập phim
- Trang xem phim với trình phát video và danh sách tập phim
- Trang danh sách phim theo thể loại, quốc gia
- Trang tìm kiếm để tìm kiếm phim
- Responsive design cho tất cả thiết bị

## Cài đặt

### Yêu cầu

- Node.js 18.0.0 trở lên
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository:

```bash
git clone https://github.com/yourusername/venchill.git
cd venchill
```

2. Cài đặt các dependencies:

```bash
npm install
# hoặc
yarn install
```

3. Chạy dự án ở chế độ development:

```bash
npm run dev
# hoặc
yarn dev
```

4. Truy cập http://localhost:3000 để xem trang web

## Triển khai

### Cloudflare Pages

1. Đẩy code lên GitHub
2. Kết nối repository với Cloudflare Pages
3. Cấu hình build command: `npm run cloudflare:build`
4. Cấu hình output directory: `out`
5. Thêm các biến môi trường:
   - `NODE_VERSION`: `18`
   - `NEXT_TELEMETRY_DISABLED`: `1`

### Netlify

1. Đẩy code lên GitHub
2. Kết nối repository với Netlify
3. Cấu hình build command: `npm run build`
4. Cấu hình output directory: `out`
5. File `netlify.toml` đã được cấu hình sẵn

### Vercel

1. Đẩy code lên GitHub
2. Kết nối repository với Vercel
3. Cấu hình build command: `npm run build`
4. File `vercel.json` đã được cấu hình sẵn

## Công nghệ sử dụng

- Next.js 14 với App Router
- TailwindCSS cho styling
- API từ OPhim để lấy dữ liệu phim
- Tối ưu cho Cloudflare Pages

## Lưu ý

Dự án này chỉ dùng cho mục đích học tập và nghiên cứu. Vui lòng không sử dụng cho mục đích thương mại.

## Giấy phép

MIT
