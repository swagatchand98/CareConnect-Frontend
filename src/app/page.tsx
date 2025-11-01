'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSplashScreenEffect } from '@/hooks/useSplashScreenEffect';
import PublicHeader from '@/components/layout/PublicHeader';
import Footer from '@/components/layout/Footer';
import ScrollFloat from '@/components/ScrollFloat';
import ScrollVelocity from '@/components/ScrollVelocity';
import CircularText from '@/components/CircularText';
import MagicBento from '@/components/MagicBento';
import CurvedLoop from '@/components/CurvedLoop';
// import TiltedCard from '@/components/TiltedCard';
// import CardSwap, { Card } from '@/components/CardSwap';
import Link from 'next/link';
// import Button from '@/components/common/Button';
import { initAllAnimations } from '@/lib/animation-utils';
import '../styles/animations.css';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  // Use splash screen effect
  useSplashScreenEffect({
    hideAfterLoad: true,
    dependencies: [isLoading, isAuthenticated, user]
  });

  // Redirect authenticated users
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'provider') {
        router.push('/dashboard/provider');
      } else {
        router.push('/dashboard/user');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Initialize animations
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !animationsInitialized) {
      initAllAnimations();
      setAnimationsInitialized(true);
    }
  }, [isLoading, isAuthenticated, animationsInitialized]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Care Philosophy Section */}
        <CarePhilosophySection />
        
        {/* Services Section */}
        <ServicesSection />
        
        {/* Trust Section */}
        <TrustSection />
        
        {/* Contact Section */}
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}

// Hero Section Component
const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 sm:pt-20 md:pt-0">
      {/* Floating Elements - Responsive sizes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-16 sm:top-20 left-2 sm:left-4 md:left-10 w-8 h-8 sm:w-16 sm:h-16 md:w-32 md:h-32 bg-blue-200 rounded-full opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 sm:top-40 right-2 sm:right-4 md:right-20 w-6 h-6 sm:w-12 sm:h-12 md:w-24 md:h-24 bg-indigo-200 rounded-full opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-24 sm:bottom-32 left-1/4 w-4 h-4 sm:w-8 sm:h-8 md:w-16 md:h-16 bg-purple-200 rounded-full opacity-20"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Right side - CircularText - Hidden on mobile */}
       <motion.div
         initial={{ opacity: 0, x: 50 }}
         whileInView={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.8, delay: 0.2 }}
         viewport={{ once: true }}
         className="hidden lg:flex justify-end absolute bottom-6 sm:bottom-10 right-4 sm:right-10 overflow-hidden"
       >
         <CircularText
           text="CARING • SUPPORT • TRUST • "
           spinDuration={15}
           onHover="slowDown"
           className="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl"
         />
       </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 leading-tight mb-3 sm:mb-4 md:mb-6 px-2">
              Care that feels like
              <span className="block font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                family
              </span>
            </h1>
            <div className="w-12 sm:w-16 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 md:mb-12 font-light leading-relaxed px-4 max-w-4xl mx-auto"
          >
            Compassionate, professional caregiving services that bring comfort, dignity, and peace of mind to your home.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center px-4 max-w-md sm:max-w-none mx-auto"
          >
            <Link href="/services" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 bg-blue-600 text-white rounded-full font-medium text-sm sm:text-base md:text-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 min-w-[160px] sm:min-w-[180px]"
              >
                Find Care Today
              </motion.button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 border-2 border-gray-300 text-gray-700 rounded-full font-medium text-sm sm:text-base md:text-lg hover:border-blue-500 hover:text-blue-600 transition-colors duration-300 min-w-[160px] sm:min-w-[180px]"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 sm:mt-12 md:mt-16 flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm text-gray-500 px-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="whitespace-nowrap">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="whitespace-nowrap">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="whitespace-nowrap">Background Checked</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Care Philosophy Section with CurvedLoop
const CarePhilosophySection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-3 sm:mb-4">
            Our <span className="text-blue-600 font-medium">Philosophy</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-2">
            Compassionate care that puts families first, creating meaningful connections that last a lifetime
          </p>
        </motion.div>

        <div className="mb-8 sm:mb-12">
          <CurvedLoop
            marqueeText="COMPASSIONATE • CARING • TRUSTED • RELIABLE • PROFESSIONAL • "
            speed={1}
            className="text-blue-500/60 font-medium"
            curveAmount={150}
            direction="left"
            interactive={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {[
            { icon: "💙", title: "Personalized Care", desc: "Every care plan is uniquely crafted for individual needs and preferences" },
            { icon: "🏡", title: "Home Comfort", desc: "Enabling independence in the familiar comfort of your own home" },
            { icon: "👨‍👩‍👧‍👦", title: "Family Partnership", desc: "Working hand-in-hand with families for the best outcomes" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Services Section - Minimal and Interactive
const ServicesSection = () => {
  const [activeService, setActiveService] = React.useState(0);
  
  const services = [
    {
      id: 0,
      icon: "🛁",
      title: "Personal Care",
      description: "Gentle assistance with daily activities, bathing, dressing, and personal hygiene with dignity and respect.",
      features: ["Daily Living Assistance", "Bathing & Grooming", "Mobility Support", "Medication Reminders"]
    },
    {
      id: 1,
      icon: "🤝",
      title: "Companion Care",
      description: "Meaningful companionship and emotional support to combat loneliness and enhance quality of life.",
      features: ["Friendly Conversation", "Social Activities", "Emotional Support", "Light Housekeeping"]
    },
    {
      id: 2,
      icon: "🏥",
      title: "Medical Support",
      description: "Professional healthcare assistance with medical needs, monitoring, and coordination with healthcare providers.",
      features: ["Health Monitoring", "Medical Appointments", "Medication Management", "Care Coordination"]
    },
    {
      id: 3,
      icon: "🧠",
      title: "Memory Care",
      description: "Specialized care for individuals with Alzheimer's, dementia, and other memory-related conditions.",
      features: ["Cognitive Stimulation", "Safety Monitoring", "Routine Maintenance", "Family Support"]
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-3 sm:mb-4">
            Our <span className="text-blue-600 font-medium">Services</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-2">
            Comprehensive care solutions designed with love and expertise for every unique need
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Service Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12"
          >
            {services.map((service, index) => (
              <motion.button
                key={service.id}
                onClick={() => setActiveService(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base ${
                  activeService === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                <span className="text-lg sm:text-2xl">{service.icon}</span>
                <span className="font-medium whitespace-nowrap">{service.title}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Active Service Display */}
          <motion.div
            key={activeService}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
              rotateY: window.innerWidth > 768 ? 5 : 0,
              rotateX: window.innerWidth > 768 ? 5 : 0,
              scale: window.innerWidth > 768 ? 1.02 : 1,
              transition: { duration: 0.3 }
            }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Service Content */}
              <div className="p-6 sm:p-8 lg:p-12">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl">{services[activeService].icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      {services[activeService].title}
                    </h3>
                    <div className="w-8 sm:w-12 h-1 bg-blue-600 rounded-full mt-1 sm:mt-2"></div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  {services[activeService].description}
                </p>

                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">What&apos;s Included:</h4>
                  {services[activeService].features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual Element */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 sm:p-8 lg:p-12 flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center text-white"
                >
                  <div className="text-5xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 opacity-90">
                    {services[activeService].icon}
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-4">
                    {services[activeService].title}
                  </h4>
                  <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
                    Professional, compassionate care tailored to your unique needs and preferences.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16"
          >
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-10 py-3 sm:py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg text-base sm:text-lg"
              >
                Explore All Services
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Trust Section with ScrollVelocity and MagicBento
const TrustSection = () => {
  const trustCards = [
    {
      color: '#1e293b',
      title: '10,000+',
      description: 'Families we\'ve had the honor to serve',
      label: 'Families',
      icon: '💙'
    },
    {
      color: '#1e293b',
      title: '500+',
      description: 'Compassionate caregivers in our network',
      label: 'Caregivers',
      icon: '🤗'
    },
    {
      color: '#1e293b',
      title: '50+',
      description: 'Communities where we provide care',
      label: 'Cities',
      icon: '🏘️'
    },
    {
      color: '#1e293b',
      title: '98%',
      description: 'Families who recommend our services',
      label: 'Satisfaction',
      icon: '⭐'
    }
  ];

  const testimonials = [
    {
      quote: "The care my mother received was exceptional. The team became like family to us.",
      author: "Sarah Johnson",
      location: "New York, NY",
      rating: 5
    },
    {
      quote: "Professional, compassionate, and reliable. I couldn't ask for better care for my father.",
      author: "Michael Chen",
      location: "Los Angeles, CA", 
      rating: 5
    },
    {
      quote: "They gave us peace of mind knowing our loved one was in the best hands possible.",
      author: "Emily Rodriguez",
      location: "Chicago, IL",
      rating: 5
    }
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="mb-12 sm:mb-16 md:mb-20">
        <ScrollVelocity
          texts={['TRUSTED', 'CARING', 'RELIABLE', 'COMPASSIONATE', 'PROFESSIONAL', 'EXPERIENCED']}
          velocity={60}
          className="text-slate-600/50 font-medium"
          parallaxClassName="py-6 sm:py-8"
          scrollerClassName="text-2xl sm:text-3xl md:text-4xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 sm:mb-6 md:mb-8">
            Trusted by <span className="text-blue-400 font-medium">Families</span> Nationwide
          </h2>
          <p className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed px-2">
            Our commitment to excellence and compassionate care has earned the trust of thousands of families across the country. Here&apos;s why families choose us for their most precious loved ones.
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="flex justify-center mb-16 sm:mb-20 md:mb-24">
          <MagicBento
            cards={trustCards}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            clickEffect={true}
            glowColor="59, 130, 246"
          />
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20 md:mb-24"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-center mb-3 sm:mb-4">
            What <span className="text-blue-400 font-medium">Families</span> Say About Us
          </h3>
          <p className="text-slate-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Real stories from real families who have experienced our compassionate care
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-slate-600/30 hover:border-blue-500/30 transition-colors duration-300"
              >
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg sm:text-xl">⭐</span>
                  ))}
                </div>
                <blockquote className="text-slate-200 mb-4 sm:mb-6 leading-relaxed italic text-sm sm:text-base">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="border-t border-slate-600 pt-3 sm:pt-4">
                  <p className="font-semibold text-white text-sm sm:text-base">{testimonial.author}</p>
                  <p className="text-slate-400 text-xs sm:text-sm">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-500/30 mb-8">
            <h4 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Ready to Experience Trusted Care?</h4>
            <p className="text-slate-300 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-2">
              Join thousands of families who have found peace of mind with our compassionate caregiving services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-300 text-base sm:text-lg min-w-[200px]"
                >
                  Join Our Care Family
                </motion.button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 border-2 border-blue-400 text-blue-400 rounded-full font-semibold hover:bg-blue-400 hover:text-slate-900 transition-colors duration-300 text-base sm:text-lg min-w-[200px]"
                >
                  Schedule Consultation
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Section with ScrollFloat
const ContactSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-blue-50/20 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header with ScrollFloat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16"
          >
            <ScrollFloat
              animationDuration={1}
              ease='power2.inOut(2)'
              scrollStart='top bottom-=20%'
              scrollEnd='bottom top+=60%'
              stagger={0.03}
              containerClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-4 sm:mb-6"
              textClassName="text-gray-800"
            >
              Ready to start caring?
            </ScrollFloat>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
              Take the first step towards compassionate care. Our dedicated team is ready to help you find the perfect solution for your loved ones.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 max-w-md sm:max-w-none mx-auto"
          >
            <Link href="/services" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 text-base sm:text-lg min-w-[200px]"
              >
                Find Care Now
              </motion.button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 text-base sm:text-lg min-w-[200px]"
              >
                Contact Us
              </motion.button>
            </Link>
          </motion.div>

          {/* Support Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">💙</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">24/7 Support</h3>
              <p className="text-gray-600 text-xs sm:text-sm text-center">Always here when you need us most</p>
            </div>
            
            <div className="flex flex-col items-center p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">🤝</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Free Consultation</h3>
              <p className="text-gray-600 text-xs sm:text-sm text-center">No obligation, just caring guidance</p>
            </div>
            
            <div className="flex flex-col items-center p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Quick Response</h3>
              <p className="text-gray-600 text-xs sm:text-sm text-center">Same day callback guaranteed</p>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-100"
          >
            <p className="text-gray-700 mb-3 sm:mb-4 font-medium text-sm sm:text-base">Ready to get started?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-lg sm:text-xl">📞</span>
                <span className="font-medium text-sm sm:text-base">(555) 123-CARE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-lg sm:text-xl">✉️</span>
                <span className="font-medium text-sm sm:text-base">hello@careconnect.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-lg sm:text-xl">🕒</span>
                <span className="font-medium text-sm sm:text-base">Available 24/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
