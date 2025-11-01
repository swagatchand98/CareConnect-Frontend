"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import useServices from "@/hooks/useServices";
import useBooking from "@/hooks/useBooking";
import EnhancedHeader from "@/components/layout/EnhancedHeader";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import UserBookingsList from "@/components/services/UserBookingsList";
import { Service } from "@/services/serviceService";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import InteractiveSlider from "@/components/user/dashboard/interactiveSlider";
import Image from "next/image";

export default function UserDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("recommended");

  // Services state
  const {
    fetchServices,
    isLoading: servicesLoading,
  } = useServices();

  // Using useBooking hook but not extracting any properties
  useBooking();

  // No longer needed since categories have been removed
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | null>(null);
  // Error state is used internally but not displayed
  const [, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Categories section removed as requested

  // Fetch popular services
  useEffect(() => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

    // Create a flag to track if the component is mounted
    let isMounted = true;

    const loadServices = async () => {
      try {
        console.log("Fetching popular services...");
        // Get popular services (we'll just get the first 4 services for now)
        const response = await fetchServices(1, 4);
        console.log("Services response:", response);

        // Only update state if the component is still mounted
        if (isMounted && response && response.services) {
          console.log("Setting services state with:", response.services);
          setServices(response.services);
        }
      } catch (err: unknown) {
        // Only update state if the component is still mounted
        if (isMounted) {
          console.error("Error loading services:", err);
          const errorMessage = err instanceof Error ? err.message : "Failed to load services";
          setError(errorMessage);
        }
      } finally {
        // Only update state if the component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadServices();

    // Cleanup function to set the flag when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]); // Remove fetchServices from dependencies to prevent infinite re-renders

  // Set isLoading to false when authentication is complete
  useEffect(() => {
    if (!authLoading) {
      // If authentication is complete and user is not authenticated,
      // we should stop loading since we'll redirect
      if (!isAuthenticated) {
        setIsLoading(false);
      }
    }
  }, [authLoading, isAuthenticated]);

  // Fallback to prevent infinite loading
  useEffect(() => {
    // Set a timeout to stop loading after 5 seconds regardless of other states
    // This prevents infinite loading if something goes wrong
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log(
          "Fallback timeout: Setting isLoading to false after timeout"
        );
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Show loading state
  if (
    (isLoading && authLoading) ||
    (!authLoading && isAuthenticated && !user)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // If user is not authenticated, show a message or redirect
  if (!isAuthenticated) {
    return null; // We'll redirect in the useEffect hook
  }

  // Ensure user is not null before rendering the dashboard
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EnhancedHeader user={user} />

      <div className="w-full overflow-hidden flex justify-center">
        <InteractiveSlider />
      </div>

      {/* Welcome Section */}
      <section className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back, {user.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Find and book the care services you need.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <Link href="/services/browse">
              <Button className="w-full sm:w-auto px-6 py-3 text-center">Book a Service</Button>
            </Link>
          </div>
        </div>
      </section>
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <section className="mb-6 sm:mb-10">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <Link
              href="/dashboard/user/bookings"
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <span className="font-medium">My Bookings</span>
            </Link>

            <Link
              href="/services/browse"
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <span className="font-medium">Book by Time</span>
            </Link>

            <Link
              href="/wishlist"
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <span className="font-medium">Wishlist</span>
            </Link>

            <Link
              href="/profile"
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <span className="font-medium">Profile</span>
            </Link>
          </div>
        </section>

        {/* New Feature Highlight */}
        <section className="mb-6 sm:mb-10">
          <div className="bg-gradient-to-r from-[#3C73FE] to-blue-600 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  New: Book Services by Time Slot
                </h2>
                <p className="text-blue-50 mb-4 text-sm sm:text-base leading-relaxed">
                  Now you can book services at specific times that work for you!
                  Browse available time slots from our providers and schedule
                  your care services with precision.
                </p>
                <Link href="/services/browse">
                  <div className="inline-block bg-white text-[#3C73FE] hover:bg-blue-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center font-medium transition-colors text-sm sm:text-base">
                    Try It Now
                  </div>
                </Link>
              </div>
              <div className="hidden lg:block">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    disablePast
                    views={["day"]}
                    sx={{
                      transform: "scale(0.7)",
                      transformOrigin: "top left",
                      width: "fit-content",
                      bgcolor: "#f5f5f5",
                      color: "#1a237e",
                      borderRadius: 2,
                      p: 1,
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Services</h2>
            <div className="flex w-full sm:w-auto overflow-x-auto gap-2">
              <button
                onClick={() => setActiveTab("recommended")}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "recommended"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setActiveTab("popular")}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "popular"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setActiveTab("nearby")}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "nearby"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Nearby
              </button>
            </div>
          </div>

          {servicesLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No services available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {services.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/details/${service._id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <Image
                      src={
                        service.images && service.images.length > 0
                          ? service.images[0]
                          : "/images/placeholders/service-default.svg"
                      }
                      alt={service.title}
                      className="w-full h-full object-cover"
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description.substring(0, 80)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600 text-lg">
                        ${service.price.amount}
                        <span className="text-sm text-gray-500">/{service.price.type}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600">4.8 (56)</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/services/browse">
              <Button variant="outline" className="px-6 py-2">
                View All Services
              </Button>
            </Link>
          </div>
        </section>

        {/* Upcoming Bookings Section */}
        <section className="mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Your Bookings</h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Track your care appointments
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <UserBookingsList limit={3} showViewAll={true} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
