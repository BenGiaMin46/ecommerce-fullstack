import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getPromotions } from "../api";
import { CircularProgress } from "@mui/material";

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

const PromoNav = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 3rem;
`;

const NavTab = styled.button`
  padding: 1rem 0;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? props.theme.text_primary : props.theme.text_secondary};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.text_primary};
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.text_primary};
  }
`;

const PromoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PromoCard = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.text_secondary};
  }
`;

const PromoBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.text_primary};
  color: ${({ theme }) => theme.white};
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
`;

const PromoTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.3;
`;

const PromoDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  flex: 1;
`;

const PromoCode = styled.div`
  background: ${({ theme }) => theme.white};
  border: 1px dashed ${({ theme }) => theme.border};
  padding: 10px 16px;
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
`;

const PromoDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text_tertiary};
`;



const Promotion = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [promotionsData, setPromotionsData] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const res = await getPromotions();
        setPromotionsData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  const filteredPromos = activeTab === "all" 
    ? promotionsData 
    : promotionsData.filter(p => p.category === activeTab);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><CircularProgress /></div>;

  return (
    <Container>
      <Title>Promotions</Title>
      
      <PromoNav>
        <NavTab active={activeTab === "all"} onClick={() => setActiveTab("all")}>All</NavTab>
        <NavTab active={activeTab === "new"} onClick={() => setActiveTab("new")}>New Promotions</NavTab>
        <NavTab active={activeTab === "sale"} onClick={() => setActiveTab("sale")}>Sale</NavTab>
      </PromoNav>

      <PromoGrid>
        {filteredPromos.map((item) => (
          <PromoCard key={item._id}>
            <PromoBadge>{item.badge}</PromoBadge>
            <PromoTitle>{item.title}</PromoTitle>
            <PromoDesc>{item.desc}</PromoDesc>
            <PromoCode>{item.code}</PromoCode>
            <PromoDate>{item.date}</PromoDate>
          </PromoCard>
        ))}
      </PromoGrid>
      {filteredPromos.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'gray' }}>No promotions found.</div>}
    </Container>
  );
};

export default Promotion;
