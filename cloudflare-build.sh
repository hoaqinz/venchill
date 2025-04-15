#!/bin/bash

# Xóa thư mục cache nếu tồn tại
rm -rf .next/cache
rm -rf cache
rm -rf .cache

# Build Next.js
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npm run build

# Xóa thư mục cache sau khi build
rm -rf .next/cache
rm -rf cache
rm -rf .cache

# Tối ưu hóa kích thước file
find .next -type f -size +20M -delete

# Sao chép file _redirects, _headers và index.html vào thư mục .next
mkdir -p .next/static
cp public/_redirects .next/
cp public/_headers .next/
cp public/index.html .next/

# Hiển thị thông tin về kích thước file
echo "Các file lớn nhất:"
find .next -type f -size +10M | xargs ls -lh | sort -k5 -rh | head -n 10

echo "Tổng kích thước thư mục .next:"
du -sh .next

echo "Build hoàn tất!"
