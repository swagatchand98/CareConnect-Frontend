'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EnhancedHeader from '@/components/layout/EnhancedHeader';
import PublicHeader from '@/components/layout/PublicHeader';
import Footer from '@/components/layout/Footer';
import ServiceList from '@/components/services/ServiceList';
import ServiceFilters from '@/components/services/ServiceFilters';
import ServiceSearch from '@/components/services/ServiceSearch';
import { useAuth } from '@/contexts/AuthContext';
import useServices from '@/hooks/useServices';

function BrowseServicesPageContent() {
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: servicesLoading, error: servicesError } = useServices();
  
  // Get initial values from URL parameters
  const initialCategoryId = searchParams.get('category') || undefined;
  const initialQuery = searchParams.get('query') || undefined;
  const initialMinPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const initialMaxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const initialPriceType = searchParams.get('priceType') || undefined;
  
  // State for filters
  const [categoryId] = useState<string | undefined>(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(initialQuery);
  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    priceType?: string;
  }>({
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    priceType: initialPriceType
  });
  
  // Mobile filter modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Loading state
  const isLoading = authLoading || servicesLoading;
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (categoryId) params.set('category', categoryId);
    if (searchQuery) params.set('query', searchQuery);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.priceType) params.set('priceType', filters.priceType);
    
    const url = `/services/browse${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', url);
  }, [categoryId, searchQuery, filters]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query || undefined);
  };
  
  // Handle filter application
  const handleApplyFilters = (newFilters: {
    minPrice?: number;
    maxPrice?: number;
    priceType?: string;
  }) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {user ? <EnhancedHeader user={user} /> : <PublicHeader />}
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Browse Services</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : servicesError ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 sm:px-6 py-3 sm:py-4 rounded-md mb-4 sm:mb-6">
            <h3 className="font-semibold mb-1">Error loading services</h3>
            <p className="text-sm sm:text-base">{servicesError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Search Bar and Filter Button */}
            <div className="lg:hidden mb-4">
              <div className="flex gap-3">
                {/* Compact Search */}
                <div className="flex-1 min-w-0">
                  <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery || ''); }} className="flex rounded-lg overflow-hidden border border-gray-300">
                    <input
                      type="text"
                      value={searchQuery || ''}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                      placeholder="Search services..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-black text-white text-sm hover:bg-gray-800 transition-colors flex-shrink-0"
                    >
                      Search
                    </button>
                  </form>
                </div>
                
                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="px-3 py-2.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-1.5 flex-shrink-0 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  <span className="hidden xs:inline">Filter</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Desktop: Sidebar with Search and Filters */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="space-y-4">
                  <ServiceSearch 
                    onSearch={handleSearch}
                    initialQuery={searchQuery}
                  />
                  
                  <ServiceFilters 
                    onApplyFilters={handleApplyFilters}
                    initialFilters={filters}
                  />
                </div>
              </div>
              
              {/* Service List */}
              <div className="lg:col-span-3">
                <ServiceList 
                  categoryId={categoryId}
                  searchQuery={searchQuery}
                  filters={filters}
                  showPagination={true}
                />
              </div>
            </div>

            {/* Mobile Filter Modal */}
            {isFilterModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
                <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <button
                        onClick={() => setIsFilterModalOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <ServiceFilters 
                      onApplyFilters={(newFilters) => {
                        handleApplyFilters(newFilters);
                        setIsFilterModalOpen(false);
                      }}
                      initialFilters={filters}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    }>
      <BrowseServicesPageContent />
    </Suspense>
  );
}
