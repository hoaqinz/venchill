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

# Sao chép file _redirects và _headers vào thư mục out
cp public/_redirects out/
cp public/_headers out/

# Hiển thị thông tin về kích thước file
echo "Các file lớn nhất:"
find out -type f -size +10M | xargs ls -lh | sort -k5 -rh | head -n 10

echo "Tổng kích thước thư mục out:"
du -sh out

echo "Build hoàn tất!"
