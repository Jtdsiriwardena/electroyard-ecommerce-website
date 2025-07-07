import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiPackage, FiHome, FiLogOut } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-gray-100" 
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/homepage" 
              className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-black via-blue-800 to-blue-500 text-transparent bg-clip-text hover:opacity-90 transition-opacity"
            >
              ElectroYard
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <NavLink to="/homepage" icon={<FiHome size={18} />}>
                  Home
                </NavLink>
                <NavLink to="/products" icon={<FiPackage size={18} />}>
                  Products
                </NavLink>
                {user && (
                  <NavLink to="/cart" icon={<FiShoppingCart size={18} />}>
                    Cart
                  </NavLink>
                )}
                <NavLink to="/userOrders">
                  Orders
                </NavLink>
                <NavLink to="/userProfile" icon={<FiUser size={18} />}>
                  Profile
                </NavLink>
              </div>

              {/* User Section */}
              <div className="ml-4 flex items-center space-x-4">
                {user ? (
                  <>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium">
                        {user.first_name.charAt(0)}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="ml-4 px-4 py-1.5 rounded-full bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all flex items-center space-x-1"
                      >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {user && (
                <Link to="/cart" className="p-2 mr-2 text-gray-700 hover:text-blue-600">
                  <FiShoppingCart size={20} />
                </Link>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/homepage" icon={<FiHome size={18} />}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/products" icon={<FiPackage size={18} />}>
                Products
              </MobileNavLink>
              {user && (
                <MobileNavLink to="/cart" icon={<FiShoppingCart size={18} />}>
                  My Cart
                </MobileNavLink>
              )}
              <MobileNavLink to="/userOrders">
                My Orders
              </MobileNavLink>
              <MobileNavLink to="/userProfile" icon={<FiUser size={18} />}>
                My Profile
              </MobileNavLink>
              
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium mr-2">
                        {user.first_name.charAt(0)}
                      </div>
                      <span className="font-medium">Hi, {user.first_name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <FiLogOut size={16} className="mr-1" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Add padding to content below navbar */}
      <div className="pt-20"></div>
    </>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, icon, children }) => {
  return (
    <Link
      to={to}
      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
    >
      {icon && <span className="mr-2 group-hover:translate-x-0.5 transition-transform">{icon}</span>}
      <span className="font-medium">{children}</span>
    </Link>
  );
};
 

export default Navbar;