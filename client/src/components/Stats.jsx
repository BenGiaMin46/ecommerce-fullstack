import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const StatsContainer = styled.div`
  max-width: 1400px;
  margin: 4rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatCard = styled.div`
  animation: fadeInUp 0.6s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  background: ${({ theme }) => theme.glass_bg};
  backdrop-filter: blur(20px);
  padding: 2rem 1.5rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadow_xl};
  }
`;

const StatIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.primary_gradient};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
`;

const stats = [
  { icon: PeopleIcon, number: 50, label: 'K+', suffix: '+ Customers' },
  { icon: InventoryIcon, number: 10, label: 'K+', suffix: '+ Products' },
  { icon: ShoppingBagIcon, number: 1, label: 'M+', suffix: '+ Orders' },
  { icon: EmojiEventsIcon, number: 99, label: '%', suffix: '+ Satisfied' },
];

const Stats = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    stats.forEach((stat) => {
      let start = 0;
      const end = stat.number;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += 1;
        setCounts((prev) => ({ ...prev, [stat.label]: start }));
        if (start === end) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    });
  }, []);

  return (
    <StatsContainer>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <StatIcon>
            <stat.icon sx={{ fontSize: 32, color: 'white' }} />
          </StatIcon>
          <StatNumber>
            {counts[stat.label] || 0}
            {stat.suffix}
          </StatNumber>
          <StatLabel>{stat.label}</StatLabel>
        </StatCard>
      ))}
    </StatsContainer>
  );
};

export default Stats;
