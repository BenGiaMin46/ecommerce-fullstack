import React, { useState } from "react";
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

const newsCategories = [
  {
    id: "all",
    name: "All",
    items: [
      {
        category: "Collection",
        title: "Summer 2024 Collection is Here",
        excerpt: "Discover the latest designs for this summer with a youthful and dynamic style.",
        date: "04/22/2026",
        readTime: "3 min read",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600"
      },
      {
        category: "Event",
        title: "Grand Opening of New Store in Hanoi",
        excerpt: "Krist officially opens its flagship store in Hanoi with many attractive offers.",
        date: "04/15/2026",
        readTime: "2 min read",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600"
      },
      {
        category: "Fashion",
        title: "5 Fashion Trends for Summer 2024",
        excerpt: "A roundup of the hottest fashion trends this summer that you shouldn't miss.",
        date: "04/10/2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"
      },
      {
        category: "Promotion",
        title: "Weekend Flash Sale: Up to 50% Off",
        excerpt: "Weekend flash sale program with discounts up to 50% on selected products.",
        date: "04/05/2026",
        readTime: "2 min read",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
      },
      {
        category: "Member",
        title: "New VIP Member Program",
        excerpt: "Launching the VIP member program with many exclusive privileges and offers.",
        date: "04/01/2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600"
      },
      {
        category: "Sustainability",
        title: "Commitment to Sustainable Fashion",
        excerpt: "Krist is committed to using eco-friendly materials in production.",
        date: "03/28/2026",
        readTime: "3 min read",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600"
      }
    ]
  },
  {
    id: "collection",
    name: "Collections",
    items: [
      {
        category: "Collection",
        title: "Summer 2024 Collection is Here",
        excerpt: "Discover the latest designs for this summer with a youthful and dynamic style.",
        date: "04/22/2026",
        readTime: "3 min read",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600"
      }
    ]
  },
  {
    id: "event",
    name: "Events",
    items: [
      {
        category: "Event",
        title: "Grand Opening of New Store in Hanoi",
        excerpt: "Krist officially opens its flagship store in Hanoi with many attractive offers.",
        date: "04/15/2026",
        readTime: "2 min read",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600"
      },
      {
        category: "Promotion",
        title: "Weekend Flash Sale: Up to 50% Off",
        excerpt: "Weekend flash sale program with discounts up to 50% on selected products.",
        date: "04/05/2026",
        readTime: "2 min read",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
      }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    items: [
      {
        category: "Fashion",
        title: "5 Fashion Trends for Summer 2024",
        excerpt: "A roundup of the hottest fashion trends this summer that you shouldn't miss.",
        date: "04/10/2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"
      }
    ]
  }
];

const News = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const activeCategory = newsCategories.find(c => c.id === activeTab);

  return (
    <Container>
      <Title>News</Title>
      
      <NewsNav>
        {newsCategories.map(cat => (
          <NavTab 
            key={cat.id}
            active={activeTab === cat.id}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.name}
          </NavTab>
        ))}
      </NewsNav>
      
      <NewsGrid>
        {activeCategory?.items.map((item, index) => (
          <NewsCard key={index}>
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
    </Container>
  );
};

export default News;
