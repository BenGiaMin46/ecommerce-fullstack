import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/cards/ProductCard";
import { getAllProducts } from "../api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";

const Container = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.white};
`;

const Section = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  max-width: 400px;
`;

// Categories Grid
const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  position: relative;
  height: 400px;
  background: url(${props => props.bg}) center/cover;
  cursor: pointer;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    transition: background 0.3s ease;
  }
  
  &:hover::before {
    background: rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const CategoryLabel = styled.h3`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  z-index: 1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
`;

// Product Tabs
const ProductTabs = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tab = styled.button`
  padding: 1rem 0;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? props.theme.text_primary : props.theme.text_secondary};
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.2s ease;
  
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingGrid = styled(ProductGrid)`
  min-height: 300px;
`;

const LoadingCard = styled.div`
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bgLight};
  min-height: 350px;
  animation: pulse 1.4s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

// Categories data
const categories = [
  { name: "CLOTHERS", bg: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600" },
  { name: "T-SHIRT", bg: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" },
  { name: "JEANS", bg: "https://images.unsplash.com/photo-1542272604-787c3839105e?w=600" },
  { name: "SHORTS", bg: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600" },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (error) {
      setProducts([]);
      dispatch(
        openSnackbar({
          message: "Khong the ket noi den server/DB.",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const filteredProducts = () => {
    if (activeTab === "all") return products;
    if (activeTab === "new") return products.filter(p => p?.new);
    if (activeTab === "sale") return products.filter(p => p?.price?.off > 0);
    return products;
  };

  return (
    <Container>
      {/* Hero Banner */}
      <HeroSlider />

      {/* Categories Grid */}
      <Section style={{ paddingTop: "4rem" }}>
        <CategoriesGrid>
          {categories.map((cat, index) => (
            <CategoryCard 
              key={index} 
              bg={cat.bg}
              onClick={() => navigate('/shop')}
            >
              <CategoryLabel>{cat.name}</CategoryLabel>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </Section>

      {/* Product Collection with Tabs */}
      <Section>
        <SectionTitle>
          <div>
            <Title>KRIST COLLECTION</Title>
          </div>
        </SectionTitle>
        
        <ProductTabs>
          <Tab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
            All
          </Tab>
          <Tab active={activeTab === "new"} onClick={() => setActiveTab("new")}>
            New Arrivals
          </Tab>
          <Tab active={activeTab === "sale"} onClick={() => setActiveTab("sale")}>
            On Sale
          </Tab>
        </ProductTabs>

        {loading ? (
          <LoadingGrid>
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </LoadingGrid>
        ) : (
          <ProductGrid>
            {filteredProducts().slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </ProductGrid>
        )}
      </Section>

    </Container>
  );
};

export default Home;
