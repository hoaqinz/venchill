import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '@/app/lib/api';

export async function GET(request: NextRequest) {
  try {
    // Lấy tham số keyword từ URL
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');
    
    if (!keyword) {
      return NextResponse.json(
        { error: 'Từ khóa tìm kiếm không được để trống' },
        { status: 400 }
      );
    }
    
    // Gọi API tìm kiếm
    const searchResult = await searchMovies(keyword);
    
    // Trả về kết quả
    return NextResponse.json(searchResult.data);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tìm kiếm' },
      { status: 500 }
    );
  }
}
