import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getNews } from "../api";
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

const NewsNav = styled.div`
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

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NewsCard = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.text_secondary};
  }
`;

const NewsImage = styled.div`
  height: 200px;
  background: url(${props => props.bg}) center/cover;
`;

const NewsContent = styled.div`
  padding: 1.5rem;
`;

const NewsCategory = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text_tertiary};
`;

const NewsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.4;
`;

const NewsExcerpt = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const NewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.text_tertiary};
`;

const News = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await getNews();
        setNewsData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = ["all", ...new Set(newsData.map(item => item.category.toLowerCase()))];

  const filteredNews = activeTab === "all" 
    ? newsData 
    : newsData.filter(item => item.category.toLowerCase() === activeTab);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><CircularProgress /></div>;

  return (
    <Container>
      <Title>News & Articles</Title>
      
      <NewsNav>
        {categories.map(cat => (
          <NavTab key={cat} active={activeTab === cat} onClick={() => setActiveTab(cat)}>
            {cat}
          </NavTab>
        ))}
      </NewsNav>

      <NewsGrid>
        {filteredNews.map((item) => (
          <NewsCard key={item._id}>
            <NewsImage bg={item.image} />
            <NewsContent>
              <NewsCategory>{item.category}</NewsCategory>
              <NewsTitle>{item.title}</NewsTitle>
              <NewsExcerpt>{item.excerpt}</NewsExcerpt>
              <NewsMeta>
                <span>{item.date}</span>
                <span>{item.readTime}</span>
              </NewsMeta>
            </NewsContent>
          </NewsCard>
        ))}
      </NewsGrid>
      {filteredNews.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'gray' }}>No articles found.</div>}
    </Container>
  );
};

export default News;
