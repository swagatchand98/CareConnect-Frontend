'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// Removed unused Button import
import { useAuth } from '@/contexts/AuthContext';
import { UserData } from '@/services/authService';
import AddressSelector from '../address/AddressSelector';
import NotificationBell from '../common/NotificationBell';

interface EnhancedHeaderProps {
  user: UserData;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ user }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Commented out unused variable
  // const popularLocations = [
  //   'New York, NY',
  //   'Los Angeles, CA',
  //   'Chicago, IL',
  //   'Houston, TX',
  //   'Phoenix, AZ',
  //   'Philadelphia, PA',
  // ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services/browse?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Scroll detection for mobile header hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only apply scroll behavior on mobile screens
      if (window.innerWidth < 1024) { // lg breakpoint
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down & past 100px
          setIsHeaderVisible(false);
        } else {
          // Scrolling up or at top
          setIsHeaderVisible(true);
        }
      } else {
        // Always show header on desktop
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Handle window resize to reset header visibility
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsHeaderVisible(true);
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [lastScrollY]);

  // Commented out unused function
  // const selectLocation = (loc: string) => {
  //   setLocation(loc);
  //   setIsLocationDropdownOpen(false);
  //   // In a real app, you would store this in user preferences and/or local storage
  // };

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Top row with logo, search, and user profile */}
        <div className="flex justify-between items-center">
          <Link href="/dashboard/user" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">C</span>
            </div>
            <span className=" text-lg sm:text-xl font-bold text-black">Care-Connect</span>
          </Link>
          
          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-4 xl:mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="flex items-center justify-center">                
                <div className="flex items-center border rounded-xl overflow-hidden ml-1 relative">
                  {/* Address selector*/}
                  <div className="absolute left-0 top-0 h-full flex items-center">
                   <AddressSelector className="px-3 py-2" />
                  </div>
                  {/* Search input */}
                  <input
                    type="text"
                    placeholder="Search for services..."
                    className="flex-1 pl-40 px-4 py-2 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  />
                  
                  {/* Search button */}
                  <button 
                    type="submit" 
                    className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors overflow-hidden"
                  >
                    <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Search suggestions - would be populated from API in a real app */}
              {isSearchFocused && searchQuery && (
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-700">Popular searches</p>
                  </div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Elder Care
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Child Care
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Special Needs Care
                  </button>
                </div>
              )}
            </form>
          </div>
          
          {/* User profile and actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <Link href="/wishlist" className="hidden sm:block text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </Link>
            
            <Link href="/chats" className="hidden sm:block text-gray-600 hover:text-black relative p-2 rounded-lg hover:bg-gray-100 transition-colors" title="My Chats">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </Link>
            
            <div className='hidden sm:block'>
              <NotificationBell />
            </div>
            
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-1 sm:space-x-2 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt={user.name} 
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium text-xs sm:text-sm">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline-block font-medium text-sm truncate max-w-24">{user.name?.split(' ')[0] || 'User'}</span>
                <svg 
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20 border border-gray-100">
                  {/* Mobile-only links */}
                  <div className="sm:hidden">
                    {/* Categories dropdown for mobile */}
                    <div className="relative">
                      <button 
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                          </svg>
                          Categories
                        </div>
                        <svg 
                          className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      
                      {isCategoriesOpen && (
                        <div className="bg-gray-50 border-t border-gray-200">
                          <Link 
                            href="/services/browse" 
                            className="block px-8 py-2 text-xs text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            All Services
                          </Link>
                          <Link 
                            href="/services/browse?category=elder-care" 
                            className="block px-8 py-2 text-xs text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            Elder Care
                          </Link>
                          <Link 
                            href="/services/browse?category=child-care" 
                            className="block px-8 py-2 text-xs text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            Child Care
                          </Link>
                          <Link 
                            href="/services/browse?category=special-needs" 
                            className="block px-8 py-2 text-xs text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            Special Needs
                          </Link>
                          <Link 
                            href="/services/browse?category=home-healthcare" 
                            className="block px-8 py-2 text-xs text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            Home Healthcare
                          </Link>
                          <Link 
                            href="/services/browse?category=respite-care" 
                            className="block px-8 py-2 text-xs text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            Respite Care
                          </Link>
                          <Link 
                            href="/services/categories" 
                            className="block px-8 py-2 text-xs text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            More Categories
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      href="/wishlist" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      Wishlist
                    </Link>
                    <Link 
                      href="/chats" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      Messages
                    </Link>
                    <Link 
                      href="/notifications" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v5"></path>
                      </svg>
                      Notifications
                    </Link>
                    <hr className="my-2" />
                  </div>
                  
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/dashboard/user/bookings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link 
                    href="/dashboard/user/payment-history" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Payment History
                  </Link>
                  <Link 
                    href="/dashboard/user/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-2" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom row with navigation tabs - hidden on mobile */}
        <nav className="mt-4 hidden lg:flex items-center space-x-8 overflow-x-auto pb-2 scrollbar-hide">
          <Link href="/dashboard" className="text-gray-900 font-medium hover:text-black whitespace-nowrap">
            Home
          </Link>
          <Link href="/services/browse" className="text-gray-600 hover:text-black whitespace-nowrap">
            All Services
          </Link>
          <Link href="/services/browse?category=elder-care" className="text-gray-600 hover:text-black whitespace-nowrap">
            Elder Care
          </Link>
          <Link href="/services/browse?category=child-care" className="text-gray-600 hover:text-black whitespace-nowrap">
            Child Care
          </Link>
          <Link href="/services/browse?category=special-needs" className="text-gray-600 hover:text-black whitespace-nowrap">
            Special Needs
          </Link>
          <Link href="/services/browse?category=home-healthcare" className="text-gray-600 hover:text-black whitespace-nowrap">
            Home Healthcare
          </Link>
          <Link href="/services/browse?category=respite-care" className="text-gray-600 hover:text-black whitespace-nowrap">
            Respite Care
          </Link>
          <Link href="/services/categories" className="text-gray-600 hover:text-black whitespace-nowrap">
            More Categories
          </Link>
        </nav>
      </div>
      
      {/* Mobile search bar - only visible on small screens */}
      <div className="lg:hidden px-4 pb-4">
        {/* Search form */}
        <form onSubmit={handleSearch}>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:bg-white transition-all duration-200">
            <div className="pl-4 pr-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for services..."
              className="flex-1 px-2 py-3 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  );
};

export default EnhancedHeader;
