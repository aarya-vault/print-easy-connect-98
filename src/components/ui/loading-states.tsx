
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  variant?: 'skeleton' | 'spinner' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  variant = 'skeleton', 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-16',
    md: 'h-6 w-24',
    lg: 'h-8 w-32'
  };

  switch (variant) {
    case 'spinner':
      return (
        <div className={cn('flex justify-center items-center', className)}>
          <div className={cn(
            'border-4 border-printeasy-yellow border-t-transparent rounded-full animate-spin',
            size === 'sm' && 'w-6 h-6',
            size === 'md' && 'w-8 h-8',
            size === 'lg' && 'w-12 h-12'
          )}></div>
        </div>
      );

    case 'dots':
      return (
        <div className={cn('flex space-x-2 justify-center items-center', className)}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'bg-gradient-yellow-white rounded-full animate-bounce',
                size === 'sm' && 'w-2 h-2',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      );

    case 'pulse':
      return (
        <div className={cn(
          'bg-gradient-white-gray rounded-printeasy animate-pulse',
          sizeClasses[size],
          className
        )}></div>
      );

    default: // skeleton
      return (
        <div className={cn('space-y-3', className)}>
          <div className="bg-gradient-white-gray rounded-printeasy h-4 w-full animate-pulse"></div>
          <div className="bg-gradient-white-gray rounded-printeasy h-4 w-5/6 animate-pulse"></div>
          <div className="bg-gradient-white-gray rounded-printeasy h-4 w-4/6 animate-pulse"></div>
        </div>
      );
  }
};

interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('border-0 bg-gradient-white-gray rounded-printeasy p-6 shadow-xl', className)}>
      <div className="space-y-4">
        <div className="bg-gradient-gray-white rounded-printeasy h-6 w-1/3 animate-pulse"></div>
        <div className="space-y-2">
          <div className="bg-gradient-gray-white rounded-printeasy h-4 w-full animate-pulse"></div>
          <div className="bg-gradient-gray-white rounded-printeasy h-4 w-5/6 animate-pulse"></div>
        </div>
        <div className="bg-gradient-yellow-subtle rounded-printeasy h-10 w-1/4 animate-pulse"></div>
      </div>
    </div>
  );
};

interface OrderCardSkeletonProps {
  className?: string;
}

export const OrderCardSkeleton: React.FC<OrderCardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('border border-printeasy-gray-light bg-white rounded-printeasy p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="bg-gradient-gray-white rounded h-5 w-24 animate-pulse"></div>
          <div className="bg-gradient-gray-white rounded h-4 w-32 animate-pulse"></div>
        </div>
        <div className="bg-gradient-yellow-subtle rounded-full h-8 w-16 animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="bg-gradient-gray-white rounded h-3 w-full animate-pulse"></div>
        <div className="bg-gradient-gray-white rounded h-3 w-3/4 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingState;
