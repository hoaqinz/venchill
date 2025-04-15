import Link from "next/link";

export default function CountryPage() {
  const countries = [
    { name: "Việt Nam", slug: "viet-nam" },
    { name: "Trung Quốc", slug: "trung-quoc" },
    { name: "Hàn Quốc", slug: "han-quoc" },
    { name: "Nhật Bản", slug: "nhat-ban" },
    { name: "Thái Lan", slug: "thai-lan" },
    { name: "Âu Mỹ", slug: "au-my" },
    { name: "Đài Loan", slug: "dai-loan" },
    { name: "Hong Kong", slug: "hong-kong" },
    { name: "Ấn Độ", slug: "an-do" },
    { name: "Anh", slug: "anh" },
    { name: "Pháp", slug: "phap" },
    { name: "Canada", slug: "canada" },
    { name: "Quốc Gia Khác", slug: "quoc-gia-khac" },
    { name: "Đức", slug: "duc" },
    { name: "Tây Ban Nha", slug: "tay-ban-nha" },
    { name: "Hà Lan", slug: "ha-lan" },
    { name: "Indonesia", slug: "indonesia" },
    { name: "Nga", slug: "nga" },
    { name: "Mexico", slug: "mexico" },
    { name: "Ba lan", slug: "ba-lan" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Quốc Gia</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countries.map((country) => (
            <Link 
              key={country.slug}
              href={`/quoc-gia/${country.slug}`}
              className="bg-gray-800 hover:bg-gray-700 transition-colors p-4 rounded-lg text-center"
            >
              <h2 className="text-lg font-medium text-white">{country.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
