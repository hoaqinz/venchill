#!/bin/bash

# Script để chạy trong môi trường development
# Sử dụng: ./scripts/dev.sh

# Đặt NODE_ENV=development
export NODE_ENV=development

# Chạy Next.js dev server
npx next dev
