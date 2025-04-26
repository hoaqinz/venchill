#!/usr/bin/env node

/**
 * Script để thêm slug mới vào danh sách STATIC_MOVIE_SLUGS
 * Sử dụng: node scripts/add-slug.js <slug>
 * Ví dụ: node scripts/add-slug.js cau-be-chuot-chui-cao-va-ngua
 */

const fs = require('fs');
const path = require('path');

// Lấy slug từ tham số dòng lệnh
const slug = process.argv[2];

if (!slug) {
  console.error('Vui lòng cung cấp slug để thêm vào danh sách.');
  console.error('Sử dụng: node scripts/add-slug.js <slug>');
  process.exit(1);
}

// Đường dẫn đến file static-params.ts
const staticParamsPath = path.join(__dirname, '..', 'app', 'lib', 'static-params.ts');

// Đọc nội dung file
let content = fs.readFileSync(staticParamsPath, 'utf8');

// Kiểm tra xem slug đã tồn tại chưa
if (content.includes(`'${slug}'`)) {
  console.log(`Slug '${slug}' đã tồn tại trong danh sách.`);
  process.exit(0);
}

// Tìm vị trí để thêm slug mới
const specificMoviesSection = '  // Specific requested movies';
const specificMoviesEndSection = '\n\n  // Add more popular movies';

// Tìm vị trí bắt đầu và kết thúc của phần "Specific requested movies"
const startIndex = content.indexOf(specificMoviesSection);
const endIndex = content.indexOf(specificMoviesEndSection, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Không thể tìm thấy vị trí để thêm slug mới.');
  process.exit(1);
}

// Lấy nội dung của phần "Specific requested movies"
const specificMoviesContent = content.substring(startIndex, endIndex);

// Tìm dòng cuối cùng của phần "Specific requested movies"
const lines = specificMoviesContent.split('\n');
const lastLine = lines[lines.length - 1];

// Thêm slug mới vào sau dòng cuối cùng
const newLine = `  '${slug}',`;
const newContent = content.substring(0, startIndex + specificMoviesContent.length) + 
                  '\n' + newLine + 
                  content.substring(endIndex);

// Ghi nội dung mới vào file
fs.writeFileSync(staticParamsPath, newContent, 'utf8');

console.log(`Đã thêm slug '${slug}' vào danh sách STATIC_MOVIE_SLUGS.`);
