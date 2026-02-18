import { Link } from "react-router-dom";

export function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About us", path: "/about" },
        { label: "Why Skyscanner?", path: "/why" },
        { label: "Media", path: "/media" },
        { label: "Jobs", path: "/jobs" },
        { label: "Sustainability", path: "/sustainability" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Help center", path: "/help" },
        { label: "Privacy settings", path: "/privacy" },
        { label: "Terms of service", path: "/terms" },
        { label: "Privacy policy", path: "/privacy-policy" },
        { label: "Cookie policy", path: "/cookie-policy" },
      ],
    },
    {
      title: "Destinations",
      links: [
        { label: "Hotels in Hanoi", path: "/hotels/hanoi" },
        { label: "Hotels in Ho Chi Minh", path: "/hotels/hcm" },
        { label: "Hotels in Da Nang", path: "/hotels/danang" },
        { label: "Hotels in Hoi An", path: "/hotels/hoian" },
        { label: "Hotels in Phu Quoc", path: "/hotels/phuquoc" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-slate-900 text-slate-200 py-12 px-6 border-t mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-bold text-white">
            skyscanner
          </Link>
          <p className="text-sm text-slate-400">
            Skyscanner is the world's travel search engine, helping you find the
            best deals on flights, hotels, and car hire.
          </p>
        </div>

        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="font-semibold text-white">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mx-auto mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2024 Skyscanner Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/legal" className="hover:text-white transition-colors">
            Legal notice
          </Link>
          <Link to="/accessibility" className="hover:text-white transition-colors">
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
}
