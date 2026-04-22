import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background: ${({ theme }) => theme.bgLight};
  overflow: hidden;
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 4rem;
  background: ${({ theme }) => theme.bgLight};
  
  @media (max-width: 768px) {
    padding: 2rem;
    order: 2;
  }
`;

const HeroRight = styled.div`
  position: relative;
  background: url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200') center/cover;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, ${({ theme }) => theme.bgLight} 0%, transparent 30%);
  }
  
  @media (max-width: 768px) {
    min-height: 300px;
    order: 1;
  }
`;

const BrandName = styled.p`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ShopLink = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const HeroSlider = () => {
  const navigate = useNavigate();

  return (
    <HeroContainer>
      <HeroContent>
        <HeroLeft>
          <BrandName>KRIST</BrandName>
          <HeroTitle>SUMMER<br/>COLLECTION</HeroTitle>
          <HeroSubtitle>
            ONLY ON <ShopLink onClick={() => navigate('/shop')}>KRISTSTORE.COM</ShopLink>
          </HeroSubtitle>
        </HeroLeft>
        <HeroRight />
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSlider;
