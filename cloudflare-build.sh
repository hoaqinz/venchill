#!/bin/bash

# Xóa thư mục cache nếu tồn tại
rm -rf .next/cache
rm -rf out/cache
rm -rf cache
rm -rf .cache

# Build Next.js
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npm run build

# Xóa thư mục cache sau khi build
rm -rf .next/cache
rm -rf out/cache
rm -rf cache
rm -rf .cache

# Tối ưu hóa kích thước file
find out -type f -size +20M -delete

# Sao chép các file cần thiết vào thư mục out
cp public/_redirects out/
cp public/_headers out/
cp public/404.html out/
cp public/_worker.js out/
cp public/index.html out/
cp public/app.html out/

# Tạo thư mục _next/static nếu chưa tồn tại
mkdir -p out/_next/static

# Sao chép file app.html vào thư mục _next/static và đổi tên thành index.html
cp public/app.html out/_next/static/index.html

# Hiển thị thông tin về kích thước file
echo "Các file lớn nhất:"
find out -type f -size +10M | xargs ls -lh | sort -k5 -rh | head -n 10

echo "Tổng kích thước thư mục out:"
du -sh out

echo "Build hoàn tất!"
