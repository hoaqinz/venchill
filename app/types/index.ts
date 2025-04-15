// Movie types
export interface Movie {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  type: string;
  thumb_url: string;
  poster_url?: string;
  sub_docquyen: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  content?: string;
  status?: string;
  trailer_url?: string;
  actor?: string[];
  director?: string[];
  category: Category[];
  country: Country[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  server_name: string;
  server_data: EpisodeData[];
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

// API Response types
export interface HomeResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: any;
    items: Movie[];
    params: any;
  };
}

export interface MovieResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: any;
    breadCrumb: any[];
    params: any;
    item: Movie & {
      episodes: Episode[];
    };
  };
}

export interface MovieListResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: any;
    items: Movie[];
    params: {
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        pageRanges: number;
      };
    };
  };
}

export interface CategoryListResponse {
  status: string;
  message: string;
  data: Category[];
}

export interface CountryListResponse {
  status: string;
  message: string;
  data: Country[];
}
