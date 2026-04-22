import React from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: calc(100vh - 70px);
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: ${({ theme }) => theme.white};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.text_primary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text_primary};
  text-transform: uppercase;
`;

const Paragraph = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 1rem;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 2rem;
  text-align: center;
`;

const ValueTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text_primary};
`;

const ValueDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 0.5rem;
`;

const About = () => {
  return (
    <Container>
      <Title>About Us</Title>
      
      <Section>
        <SectionTitle>About Krist</SectionTitle>
        <Paragraph>
          Krist is a modern fashion brand for Vietnam's youth. 
          Founded in 2020, we take pride in delivering high-quality 
          products with unique designs that align with modern fashion trends.
        </Paragraph>
        <Paragraph>
          Our mission is to help you confidently express your personal style 
          through every outfit. Each product is carefully crafted from design 
          to production, ensuring the highest quality and durability.
        </Paragraph>
      </Section>
      
      <Section>
        <SectionTitle>Core Values</SectionTitle>
        <ValuesGrid>
          <ValueCard>
            <ValueTitle>Quality</ValueTitle>
            <ValueDesc>Products are made from premium materials, ensuring long-lasting beauty</ValueDesc>
          </ValueCard>
          <ValueCard>
            <ValueTitle>Design</ValueTitle>
            <ValueDesc>Modern style, aligning with international fashion trends</ValueDesc>
          </ValueCard>
          <ValueCard>
            <ValueTitle>Sustainability</ValueTitle>
            <ValueDesc>Commitment to using eco-friendly materials</ValueDesc>
          </ValueCard>
        </ValuesGrid>
      </Section>
      
      <Section>
        <SectionTitle>Achievements</SectionTitle>
        <StatsRow>
          <StatItem>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Customers</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>200+</StatNumber>
            <StatLabel>Products</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>10+</StatNumber>
            <StatLabel>Stores</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>99%</StatNumber>
            <StatLabel>Satisfaction</StatLabel>
          </StatItem>
        </StatsRow>
      </Section>
    </Container>
  );
};

export default About;
