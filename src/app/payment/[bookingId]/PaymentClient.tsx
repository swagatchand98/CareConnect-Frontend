'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from '@/components/payment/PaymentForm';
import PaymentConfirmation from '@/components/payment/PaymentConfirmation';
import { getBookingPaymentDetails } from '@/services/paymentService';
import { useBooking } from '@/hooks/useBooking';
import EnhancedHeader from '@/components/layout/EnhancedHeader';
import PublicHeader from '@/components/layout/PublicHeader';
import Footer from '@/components/layout/Footer';

interface PaymentClientProps {
  bookingId: string;
}

interface Payment {
  status: string;
  type: string;
}

interface PaymentDetails {
  payments: Payment[];
}

const PaymentClient: React.FC<PaymentClientProps> = ({ bookingId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchBookingById } = useBooking();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    totalPrice: number;
    duration: number;
    dateTime: string;
    service?: { title: string };
    provider?: { firstName: string; lastName: string };
  } | null>(null);

  // Use a ref to track if data has been fetched
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch data once
    if (dataFetchedRef.current) return;
    
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('Invalid booking ID');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Use Promise.all to make parallel requests
        const [paymentDetails, booking] = await Promise.all([
          getBookingPaymentDetails(bookingId) as Promise<PaymentDetails>,
          fetchBookingById(bookingId)
        ]);
        
        // Process payment details
        if (paymentDetails.payments && paymentDetails.payments.length > 0) {
          const completedPayment = paymentDetails.payments.find(
            (payment: Payment) => payment.status === 'completed' && payment.type === 'booking'
          );
          
          if (completedPayment) {
            setPaymentComplete(true);
          }
        }
        
        // Set booking details
        setBookingDetails({
          totalPrice: booking.booking.totalPrice,
          duration: booking.booking.duration,
          dateTime: booking.booking.dateTime,
          service: { title: booking.booking.serviceId.title },
          provider: { 
            firstName: booking.booking.providerId.firstName, 
            lastName: booking.booking.providerId.lastName 
          }
        });
        
        // Mark data as fetched
        dataFetchedRef.current = true;
        
        setIsLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load booking details';
        console.error('Error fetching booking details:', err);
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, fetchBookingById]);

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
  };

  const handlePaymentError = (error: Error | unknown) => {
    const errorMessage = error instanceof Error ? error.message : 
      (typeof error === 'object' && error !== null && 'message' in error) ? 
        (error as { message?: string }).message : 'Payment processing failed';
    setError(errorMessage || 'Payment processing failed');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {user ? <EnhancedHeader user={user} /> : <PublicHeader />}
        
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {user ? <EnhancedHeader user={user} /> : <PublicHeader />}
        
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded mb-4">
              <p className="text-sm sm:text-base break-words">{error}</p>
              <button 
                onClick={() => router.back()} 
                className="mt-2 text-blue-500 underline text-sm sm:text-base hover:text-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {user ? <EnhancedHeader user={user} /> : <PublicHeader />}
        
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 sm:px-4 py-3 rounded mb-4">
              <p className="text-sm sm:text-base break-words">Booking not found or you don&apos;t have permission to access it.</p>
              <button 
                onClick={() => router.push('/dashboard/user')} 
                className="mt-2 text-blue-500 underline text-sm sm:text-base hover:text-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {user ? <EnhancedHeader user={user} /> : <PublicHeader />}
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span className="text-sm sm:text-base">Back</span>
            </button>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Complete Your Payment</h1>
          
          {paymentComplete ? (
            <PaymentConfirmation
              bookingId={bookingId}
              amount={bookingDetails.totalPrice}
              serviceName={bookingDetails.service?.title || 'Service'}
              providerName={`${bookingDetails.provider?.firstName || ''} ${bookingDetails.provider?.lastName || ''}`}
              dateTime={new Date(bookingDetails.dateTime).toLocaleString()}
            />
          ) : (
            <div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Booking Summary</h2>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-sm sm:text-base break-words"><span className="font-medium">Service:</span> {bookingDetails.service?.title || 'Service'}</p>
                  <p className="text-sm sm:text-base break-words"><span className="font-medium">Provider:</span> {`${bookingDetails.provider?.firstName || ''} ${bookingDetails.provider?.lastName || ''}`}</p>
                  <p className="text-sm sm:text-base break-words"><span className="font-medium">Date &amp; Time:</span> {new Date(bookingDetails.dateTime).toLocaleString()}</p>
                  <p className="text-sm sm:text-base"><span className="font-medium">Duration:</span> {bookingDetails.duration} minutes</p>
                  <p className="text-base sm:text-lg font-semibold text-blue-600"><span className="font-medium text-gray-900">Total Price:</span> ${(bookingDetails.totalPrice / 100).toFixed(2)}</p>
                </div>
              </div>
              
              <PaymentForm
                bookingId={bookingId}
                amount={bookingDetails.totalPrice}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentClient;
