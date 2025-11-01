'use client';

import React, { useState, useEffect } from 'react';
import useServices from '@/hooks/useServices';
import ServiceCard from './ServiceCard';
import { Service } from '@/services/serviceService';

interface ServiceListProps {
  categoryId?: string;
  searchQuery?: string;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    priceType?: string;
  };
  limit?: number;
  showPagination?: boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({
  categoryId,
  searchQuery,
  filters,
  limit = 10,
  showPagination = true
}) => {
  const { 
    fetchServices, 
    fetchServicesByCategory, 
    searchForServices, 
    isLoading, 
    error 
  } = useServices();
  
  const [services, setServices] = useState<Service[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    loadServices();
  }, [categoryId, searchQuery, filters, currentPage, limit]);
  
  const loadServices = async (retryCount = 0) => {
    try {
      let response;
      
      if (searchQuery) {
        // Search for services
        response = await searchForServices(searchQuery, {
          categoryId,
          ...filters
        });
        setServices(response.services);
        setTotalServices(response.results);
        setTotalPages(response.totalPages || 1);
      } else if (categoryId) {
        // Get services by category
        response = await fetchServicesByCategory(categoryId);
        setServices(response.services);
        setTotalServices(response.results);
        setTotalPages(response.totalPages || 1);
      } else {
        // Get all services with pagination and filtering
        response = await fetchServices(currentPage, limit, {
          categoryId,
          ...filters
        });
        setServices(response.services);
        setTotalServices(response.total);
        setTotalPages(response.totalPages);
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      console.error('Error loading services:', error);
      
      // Handle rate limiting with exponential backoff
      if (error?.response?.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`Rate limited. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/3)`);
        
        // Wait for the delay period
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry with exponential backoff
        return loadServices(retryCount + 1);
      }
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }
  
  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No services found.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-gray-600">
          Showing {services.length} of {totalServices} services
        </p>
      </div>
      
      {/* Mobile: 2 columns, Tablet: 2 columns, Desktop: 3 columns, Large: 4 columns */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
      
      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <nav className="flex items-center space-x-1 overflow-x-auto">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base whitespace-nowrap ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            
            {/* Show fewer page numbers on mobile */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else {
                // Show pages around current page
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + 4);
                page = start + i;
                if (page > end) return null;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base whitespace-nowrap ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
