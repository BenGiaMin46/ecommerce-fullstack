import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  flex: 0 0 auto;
  @media (max-width: 600px) {
    width: 170px;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 320px;
  border-radius: 16px;
  object-fit: cover;
  transition: all 0.3s ease-out;
  @media (max-width: 600px) {
    height: 240px;
  }
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 16px;
  transition: all 0.3s ease-out;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow_md};
  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadow_xl};
  }
  &:hover ${Image} {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;
const Menu = styled.div`
  width: 90%;
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
`;
const Button = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.primary};
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 999px;
  text-align: center;
  font-weight: 600;
  @media (max-width: 600px) {
    padding: 6px 14px;
  }
`;
const Sale = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  top: 10px;
  right: 10px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: ${({ theme }) => theme.primary_gradient};
  padding: 5px 10px;
  border-radius: 999px;
  box-shadow: ${({ theme }) => theme.shadow_sm};
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const ProductCategoryCard = ({ category }) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/shop?category=${category.name}`)}>
      <Top>
        <Image src={category.img} />
        <Menu>
          <Button>{category.name}</Button>
        </Menu>
        <Sale>{category.off}</Sale>
      </Top>
    </Card>
  );
};

export default ProductCategoryCard;
