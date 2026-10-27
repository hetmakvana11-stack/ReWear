import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  PlusCircle,
  User,
  ShoppingBag,
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-forest-900 bg-forest-100/70 font-semibold'
        : 'text-dark-800 hover:text-forest-800 hover:bg-black/5'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-editorial italic">R</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-forest-900 font-editorial">
                ReWear
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-muted-500">
                Campus Thrift
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/marketplace" className={navLinkClass}>
              Explore Marketplace
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/sell" className="btn-primary">
                  <PlusCircle className="w-4 h-4" />
                  <span>List an Item</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full border border-border bg-ivory-50 hover:bg-ivory-100 transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-dark-900 max-w-[100px] truncate pr-1">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-dropdown border border-border py-2 animate-fade-in z-50">
                      <div className="px-4 py-2 border-b border-border/80">
                        <p className="text-xs font-bold text-dark-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-muted-500 truncate">
                          {user.college}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/my-listings"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-dark-800 hover:bg-forest-50 hover:text-forest-900"
                        >
                          <ShoppingBag className="w-4 h-4 text-forest-700" />
                          My Listings
                        </Link>
                        <Link
                          to="/my-requests"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-dark-800 hover:bg-forest-50 hover:text-forest-900"
                        >
                          <ArrowLeftRight className="w-4 h-4 text-emerald-700" />
                          My Requests
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-dark-800 hover:bg-forest-50 hover:text-forest-900"
                        >
                          <LayoutDashboard className="w-4 h-4 text-dark-700" />
                          Analytics Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-dark-800 hover:bg-forest-50 hover:text-forest-900"
                        >
                          <User className="w-4 h-4 text-dark-700" />
                          User Profile & Saved
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-border/80">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login" className="btn-outline">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-dark-900 hover:bg-ivory-200 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="flex flex-col space-y-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/marketplace" className={navLinkClass}>
              Explore Marketplace
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
          </div>

          <div className="pt-3 border-t border-border">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-ivory-100 rounded-xl">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-dark-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-500 truncate">
                      {user.college}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/sell"
                    className="btn-primary text-xs py-2 justify-center"
                  >
                    <PlusCircle className="w-4 h-4" />
                    List Item
                  </Link>
                  <Link
                    to="/my-listings"
                    className="btn-outline text-xs py-2 justify-center"
                  >
                    My Listings
                  </Link>
                  <Link
                    to="/my-requests"
                    className="btn-outline text-xs py-2 justify-center"
                  >
                    My Requests
                  </Link>
                  <Link
                    to="/profile"
                    className="btn-outline text-xs py-2 justify-center"
                  >
                    Profile
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full btn-danger text-xs py-2 mt-2 justify-center"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="btn-outline w-full justify-center">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary w-full justify-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
