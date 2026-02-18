import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  const footerLinks = [
    {
      title: "Badminton Go",
      links: [
        { label: "Về chúng tôi", path: "/about" },
        { label: "Tại sao chọn Badminton Go?", path: "/why" },
        { label: "Tuyển dụng", path: "/jobs" },
        { label: "Liên hệ quảng cáo", path: "/ads" },
      ],
    },
    {
      title: "Cộng đồng",
      links: [
        { label: "Group Facebook", path: "https://facebook.com" },
        { label: "Quy tắc ứng xử", path: "/rules" },
        { label: "Cẩm nang cầu lông", path: "/handbook" },
        { label: "Đánh giá sân", path: "/reviews" },
      ],
    },
    {
      title: "Dịch vụ",
      links: [
        { label: "Tìm sân cầu lông", path: "/courts" },
        { label: "Tìm kèo vãng lai", path: "/" },
        { label: "Phân tích dữ liệu", path: "/analytics" },
        { label: "Shop cầu lông", path: "/shops" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-slate-900 text-slate-200 py-16 px-6 border-t mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-1.5">
            <div className="bg-primary text-white font-black italic px-2 py-0.5 rounded flex items-center justify-center transform -skew-x-12">
               GO
            </div>
            <span className="text-xl font-black text-white tracking-tight">Badminton Go</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            Nền tảng kết nối người chơi cầu lông vãng lai lớn nhất Việt Nam. 
            Ứng dụng AI để mang lại dữ liệu sân "tươi" và sạch nhất.
          </p>
          <div className="flex gap-4">
             <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-primary transition-colors">
                <Facebook className="h-5 w-5 fill-white" />
             </a>
             <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-primary transition-colors">
                <Instagram className="h-5 w-5" />
             </a>
             <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-primary transition-colors">
                <MessageCircle className="h-5 w-5 fill-white" />
             </a>
          </div>
        </div>

        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-5">
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">{section.title}</h3>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.label}>
                  {link.path.startsWith('http') ? (
                    <a href={link.path} className="text-sm text-slate-400 hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-sm text-slate-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mx-auto mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2024 Badminton Go. Đã đăng ký bản quyền.</p>
        <div className="flex gap-8">
          <Link to="/legal" className="hover:text-white transition-colors">
            Pháp lý
          </Link>
          <Link to="/privacy" className="hover:text-white transition-colors">
            Quyền riêng tư
          </Link>
          <Link to="/accessibility" className="hover:text-white transition-colors">
            Hỗ trợ
          </Link>
        </div>
      </div>
    </footer>
  );
}
