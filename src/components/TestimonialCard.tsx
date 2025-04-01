
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  content: string;
  author: string;
  role?: string;
  rating?: number;
  imageUrl?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  author,
  role,
  rating = 5,
  imageUrl
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover-animate p-6">
      <div className="flex space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-gray-700 mb-6">{content}</p>
      <div className="flex items-center">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={author} 
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        )}
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          {role && <p className="text-gray-600 text-sm">{role}</p>}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
