import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Products", path: "/admin/products", icon: "🛍️" },
    { name: "Categories", path: "/admin/categories", icon: "🏷️" },
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Users", path: "/admin/users", icon: "👥" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Modern Sidebar */}
      <div className="w-72 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col p-6 fixed top-0 left-0 h-full border-r border-indigo-700/50 shadow-2xl">
        {/* Logo/Branding */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            ElectroYard
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-white/10 backdrop-blur-sm shadow-lg"
                  : "hover:bg-white/5 hover:backdrop-blur-sm"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
              {location.pathname === link.path && (
                <span className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 bg-gray-50 min-h-screen">
        {/* Main content */}
      </div>
    </div>
  );
};

export default AdminSidebar;