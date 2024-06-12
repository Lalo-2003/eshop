"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const HomeBanner = () => {
  const images = [
    "/banner-image.png",
    "/pintu.png",
    "/polp.png",
    "/128.png",
    
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      nextSlide();
    }, 3000); // Cambiar cada 3 segundos

    const textAnimationInterval = setInterval(() => {
      setAnimationStage((prevStage) => (prevStage + 1) % 4);
    }, 10000); // Cambiar animación cada 10 segundos

    return () => {
      clearInterval(imageInterval);
      clearInterval(textAnimationInterval);
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const getTextAnimationClass = () => {
    switch (animationStage) {
      case 0:
        return 'animate-fadeIn';
      case 1:
        return 'animate-bounce';
      case 2:
        return 'animate-zoomIn';
      case 3:
        return 'animate-rotate';
      default:
        return '';
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-sky-500 to-sky-700 mb-8">
      <div className="mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly">
        <div className={`mb-8 md:mb-0 text-center ${getTextAnimationClass()}`}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Venta de verano
          </h1>
          <p className="text-lg md:text-xl text-white mb-2 delay-200">
            Disfruta de descuentos en artículos personalizados
          </p>
          <p className="text-2xl md:text-5xl text-yellow-400 font-bold delay-400">
            OBTÉN 50% OFF
          </p>
        </div>
        <div className="relative w-full md:w-1/2">
          <div className="relative h-64 transition-opacity duration-1000 ease-in-out">
            <Image
              src={images[currentIndex]}
              fill
              alt={`Banner Image ${currentIndex + 1}`}
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .relative h-64 {
          position: relative;
          height: 16rem;
        }
        .relative h-64 img {
          object-fit: contain;
        }
        .transition-opacity {
          transition: opacity 1s ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 2s forwards;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        .animate-zoomIn {
          animation: zoomIn 2s forwards;
        }
        .animate-rotate {
          animation: rotate 2s forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default HomeBanner;
