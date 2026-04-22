import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrders } from "../api";
import { CircularProgress } from "@mui/material";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Container = styled.div`
  padding: 40px 30px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const Section = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const OrderCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow_md};
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 16px;
`;

const OrderId = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const OrderDate = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const OrderStatus = styled.div`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ status, theme }) => 
    status === "Processing" ? theme.primary + "20" : 
    status === "Delivered" ? "green20" : theme.bgLight};
  color: ${({ status, theme }) => 
    status === "Processing" ? theme.primary : 
    status === "Delivered" ? "green" : theme.text_secondary};
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ProductImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

const ProductQuantity = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const TotalAmount = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const TrackingContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TrackingLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
`;

const ProgressWrapper = styled.div`
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary} 0%, #4caf50 100%);
  width: ${({ width }) => width}%;
  transition: width 1s ease-in-out;
`;

const StepLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const Step = styled.div`
  font-size: 12px;
  color: ${({ active, theme }) => active ? theme.primary : theme.text_tertiary};
  font-weight: ${({ active }) => active ? '700' : '500'};
  text-align: center;
  flex: 1;
`;

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("krist-app-token");
      const res = await getOrders(token);
      setOrders(res.data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Title>
          <ShoppingBagIcon sx={{ fontSize: 32 }} />
          My Orders
        </Title>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>No orders found.</div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id}>
              <OrderHeader>
                <div>
                  <OrderId>Order #{order._id.slice(-8).toUpperCase()}</OrderId>
                  <OrderDate>{new Date(order.createdAt).toLocaleDateString()}</OrderDate>
                </div>
                <OrderStatus status={order.status}>{order.status}</OrderStatus>
              </OrderHeader>
              
              <TrackingContainer>
                <TrackingLabel>Order Progress</TrackingLabel>
                <ProgressWrapper>
                  <ProgressBar width={
                    order.status === "Delivered" ? 100 : 
                    order.status === "Shipped" ? 75 : 
                    order.status === "Processing" ? 40 : 15
                  } />
                </ProgressWrapper>
                <StepLabels>
                  <Step active={["Pending", "Processing", "Shipped", "Delivered"].includes(order.status)}>Placed</Step>
                  <Step active={["Processing", "Shipped", "Delivered"].includes(order.status)}>Processed</Step>
                  <Step active={["Shipped", "Delivered"].includes(order.status)}>Shipped</Step>
                  <Step active={order.status === "Delivered"}>Delivered</Step>
                </StepLabels>
              </TrackingContainer>

              <ProductList>
                {order.products.map((item, idx) => (
                  <ProductItem key={idx}>
                    <ProductInfo>
                      {item.product?.img && <ProductImg src={item.product?.img} alt={item.product?.title} />}
                      <ProductDetails>
                        <ProductName>{item.product?.title || `Product ${idx+1}`}</ProductName>
                        <ProductQuantity>Quantity: {item.quantity}</ProductQuantity>
                      </ProductDetails>
                    </ProductInfo>
                    <div style={{ fontWeight: 600 }}>${(item.quantity * (item.product?.price?.org || 0)).toFixed(2)}</div>
                  </ProductItem>
                ))}
              </ProductList>
              <OrderFooter>
                <div style={{ color: "var(--text_secondary)" }}>Payment: {order.payment_method || "COD"}</div>
                <TotalAmount>${parseFloat(order.total_amount.$numberDecimal || order.total_amount).toFixed(2)}</TotalAmount>
              </OrderFooter>
            </OrderCard>
          ))
        )}
      </Section>
    </Container>
  );
};

export default Orders;
