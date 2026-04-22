import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/cards/ProductCard";
import { getFavourite } from "../api";
import { CircularProgress } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from "react-router-dom";

const Container = styled.div`
  padding: 40px 30px;
  padding-bottom: 100px;
  min-height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
  background: ${({ theme }) => theme.bg};
`;
const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  max-width: 500px;
  margin: 0 auto;
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 20px;
  }
`;

const EmptyState = styled.div`
  animation: fadeIn 0.5s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  border: 2px dashed ${({ theme }) => theme.border};
  gap: 24px;
  max-width: 600px;
  margin: 40px auto;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  background: ${({ theme }) => theme.primary_gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: ${({ theme }) => theme.shadow_lg};
`;

const EmptyTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  max-width: 400px;
  line-height: 1.6;
`;

const ShopLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.primary_gradient};
  color: white;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow_md};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow_lg};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 100px;
`;


const Favourite = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const token = localStorage.getItem("krist-app-token");
    if (!token) return;
    setLoading(true);
    await getFavourite(token).then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <CircularProgress size={60} />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Header>
          <Title>
            <FavoriteIcon sx={{ fontSize: 32 }} />
            Your Favorites
          </Title>
          <Subtitle>
            {products.length > 0 
              ? `You have ${products.length} item${products.length > 1 ? 's' : ''} in your favorites`
              : 'Save items you love to your favorites and shop them later'
            }
          </Subtitle>
        </Header>

        {products.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FavoriteIcon sx={{ fontSize: 48 }} />
            </EmptyIcon>
            <EmptyTitle>No Favorites Yet</EmptyTitle>
            <EmptyText>
              Start exploring our collection and click the heart icon on any product you love to save it here.
            </EmptyText>
            <ShopLink to="/shop">
              <ShoppingBagIcon sx={{ fontSize: 20 }} />
              Start Shopping
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </ShopLink>
          </EmptyState>
        ) : (
          <CardWrapper>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </CardWrapper>
        )}
      </Section>
    </Container>
  );
};

export default Favourite;
