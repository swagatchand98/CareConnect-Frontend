'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { WishlistItem as WishlistItemType } from '@/services/wishlistService';
import Button from '@/components/common/Button';

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (serviceId: string) => void;
  isRemoving: boolean;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ 
  item, 
  onRemove,
  isRemoving
}) => {
  const router = useRouter();
  const { serviceId } = item;
  
  const handleViewDetails = () => {
    if (!serviceId) return;
    router.push(`/services/details/${serviceId.id || serviceId._id}`);
  };
  
  const handleBookNow = () => {
    if (!serviceId) return;
    router.push(`/booking/new?serviceId=${serviceId.id || serviceId._id}`);
  };
  
  const handleRemoveFromWishlist = () => {
    if (!serviceId) return;
    onRemove(serviceId.id || serviceId._id || '');
  };
  
  // Get default image for service
  const getServiceImageUrl = () => {
    // If serviceId is null or undefined, return default image
    if (!serviceId) {
      return '/images/placeholders/caregiver.jpg.svg';
    }
    
    // If service has valid images, use them
    if (serviceId.images && Array.isArray(serviceId.images) && 
        serviceId.images.length > 0 && 
        typeof serviceId.images[0] === 'string' && 
        serviceId.images[0].trim()) {
      return serviceId.images[0];
    }
    
    // Since we don't have category information in the wishlist item,
    // we'll use a generic default image
    return '/images/placeholders/caregiver.jpg.svg';
  };
  
  // If serviceId is null or undefined, show a placeholder
  if (!serviceId) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Service information unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Service Image */}
        <div className="w-full sm:w-32 md:w-40 flex-shrink-0">
          <div className="h-48 sm:h-32 md:h-32 w-full rounded-md overflow-hidden bg-gray-100">
            <img 
              src={getServiceImageUrl()} 
              alt={serviceId?.title || 'Service'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Service Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-1">
            {serviceId?.title || 'Untitled Service'}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
            {serviceId?.description || 'No description available'}
          </p>
          
          <div className="flex items-center mb-2 sm:mb-3">
            <span className="font-bold text-sm sm:text-lg text-blue-600">
              ${serviceId?.price?.amount?.toFixed(2) || '0.00'}
              <span className="text-xs sm:text-sm text-gray-500 font-normal">
                /{serviceId?.price?.type || 'hour'}
              </span>
            </span>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Provider: {serviceId?.providerId?.firstName || 'Unknown'} {serviceId?.providerId?.lastName || ''}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <Button 
                onClick={handleViewDetails}
                variant="outline"
                className="text-xs sm:text-sm px-3 py-1.5 sm:py-2 flex-1 sm:flex-none"
              >
                View Details
              </Button>
              
              <Button 
                onClick={handleBookNow}
                variant="primary"
                className="text-xs sm:text-sm px-3 py-1.5 sm:py-2 flex-1 sm:flex-none"
              >
                Book Now
              </Button>
            </div>
            
            <Button 
              onClick={handleRemoveFromWishlist}
              variant="secondary"
              className="text-xs sm:text-sm px-3 py-1.5 sm:py-2 bg-red-600 text-red-600 hover:bg-white border-red-600 w-full sm:w-auto"
              disabled={isRemoving}
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
