'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import useBooking from '@/hooks/useBooking';
import EnhancedHeader from '@/components/layout/EnhancedHeader';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import { Booking } from '@/services/bookingService';

export default function UserBookingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { fetchUserBookings, cancelUserBooking, isLoading, error } = useBooking();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);
  
  // Fetch bookings on component mount and when filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated, currentPage, statusFilter, pageSize]);
  
  const loadBookings = async () => {
    try {
      const response = await fetchUserBookings(currentPage, pageSize, {
        status: statusFilter
      });
      
      setBookings(response.bookings);
      setTotalBookings(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value === 'all' ? undefined : value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setIsLoadingCancel(true);
      setCancelError(null);
      
      try {
        await cancelUserBooking(bookingId);
        // Refresh bookings after cancellation
        loadBookings();
      } catch (err: unknown) {
        setCancelError(err instanceof Error ? err.message : 'Failed to cancel booking');
      } finally {
        setIsLoadingCancel(false);
      }
    }
  };
  
  const handleViewDetails = (bookingId: string) => {
    router.push(`/booking/${bookingId}`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Show loading state
  if ((isLoading && authLoading) || (!authLoading && isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is not authenticated, show a message or redirect
  if (!isAuthenticated) {
    return null; // We'll redirect in the useEffect hook
  }
  
  // Ensure user is not null before rendering
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EnhancedHeader user={user} />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">My Bookings</h1>
              <p className="text-sm sm:text-base text-gray-600">View and manage all your service bookings</p>
            </div>
            <Button 
              onClick={() => router.push('/services/browse')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base"
            >
              Book New Service
            </Button>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Status:
                </label>
                <select
                  id="statusFilter"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 sm:flex-none"
                  value={statusFilter || 'all'}
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="pageSize" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Show:
                </label>
                <select
                  id="pageSize"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 sm:flex-none"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Bookings List */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm sm:text-base">
                {error}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4 text-sm sm:text-base">You don&apos;t have any bookings yet.</p>
                <Button 
                  onClick={() => router.push('/services/browse')}
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base"
                >
                  Browse Services
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {bookings.length} of {totalBookings} bookings
                  </p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking._id} 
                      className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-4">
                        {/* Header with title and status */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{booking.serviceId.title}</h3>
                          <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusBadgeClass(booking.status)} flex-shrink-0`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        {/* Booking details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                          <div className="space-y-1">
                            <p className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Provider:</span> {booking.providerId.firstName} {booking.providerId.lastName}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Date:</span> {formatDate(booking.dateTime)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Duration:</span> {booking.duration} minutes
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Address:</span> {booking.address.street}, {booking.address.city}, {booking.address.state} {booking.address.zipCode}
                            </p>
                            <p className="font-semibold text-base sm:text-lg text-blue-600">
                              ${booking.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                          <Button
                            onClick={() => handleViewDetails(booking._id)}
                            variant="outline"
                            className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm"
                          >
                            View Details
                          </Button>
                          
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <Button
                              onClick={() => handleCancelBooking(booking._id)}
                              variant="secondary"
                              className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm bg-red-600 text-white hover:bg-red-700 border-red-600"
                              disabled={isLoadingCancel}
                            >
                              {isLoadingCancel ? 'Cancelling...' : 'Cancel Booking'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <nav className="flex items-center space-x-1 overflow-x-auto">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-2 sm:px-3 py-2 rounded-md text-sm sm:text-base whitespace-nowrap ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
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
                            className={`px-2 sm:px-3 py-2 rounded-md text-sm sm:text-base ${
                              currentPage === page
                                ? 'bg-black text-white'
                                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-2 sm:px-3 py-2 rounded-md text-sm sm:text-base whitespace-nowrap ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
            
            {/* Cancel Error */}
            {cancelError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {cancelError}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
