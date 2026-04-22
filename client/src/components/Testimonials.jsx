import React from 'react';
import styled from 'styled-components';
import StarIcon from '@mui/icons-material/Star';

const TestimonialsContainer = styled.div`
  max-width: 1400px;
  margin: 4rem auto;
  padding: 0 2rem;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.text_primary};
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled.div`
  animation: fadeInUp 0.6s ease-out;
  background: ${({ theme }) => theme.glass_bg};
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 24px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  font-style: italic;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text_primary};
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const Stars = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 1rem;
`;

const testimonials = [
  {
    text: "Amazing quality and fast delivery! Will definitely shop again.",
    author: "Sarah Johnson"
  },
  {
    text: "Best prices and excellent customer service. Highly recommend!",
    author: "Mike Chen"
  },
  {
    text: "Love the variety and the app is super easy to use.",
    author: "Emily Davis"
  },
  {
    text: "Perfect fit and great value for money. 5 stars!",
    author: "David Wilson"
  },
];

const Testimonials = () => (
  <TestimonialsContainer>
    <Title>What Our Customers Say</Title>
    <TestimonialGrid>
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={index}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Stars>
            {Array(5).fill().map((_, i) => (
              <StarIcon key={i} sx={{ fontSize: 20, color: '#fbbf24' }} />
            ))}
          </Stars>
          <TestimonialText>
            "{testimonial.text}"
          </TestimonialText>
          <TestimonialAuthor>- {testimonial.author}</TestimonialAuthor>
        </TestimonialCard>
      ))}
    </TestimonialGrid>
  </TestimonialsContainer>
);

export default Testimonials;
