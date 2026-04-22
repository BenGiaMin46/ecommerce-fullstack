import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAdminStats } from "../../api";
import { CircularProgress } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 24px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadow_sm};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadow_md};
  }
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${({ color }) => color + '15'};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartSection = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 30px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow_sm};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("krist-app-token");
        const res = await getAdminStats(token);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </div>
    );
  }

  const chartData = stats?.monthlyRevenue.map(item => ({
    name: `Month ${item._id}`,
    revenue: item.revenue,
    orders: item.orders
  })) || [];

  return (
    <Container>
      <Header>
        <Title>Welcome Back, Admin</Title>
        <Subtitle>Here's what's happening with your store today.</Subtitle>
      </Header>
      
      <StatsGrid>
        <StatCard>
          <StatInfo>
            <StatLabel>Total Revenue</StatLabel>
            <StatValue>${stats?.totalRevenue}</StatValue>
          </StatInfo>
          <StatIcon color="#4caf50">
            <MonetizationOnIcon />
          </StatIcon>
        </StatCard>
        
        <StatCard>
          <StatInfo>
            <StatLabel>Orders</StatLabel>
            <StatValue>{stats?.totalOrders}</StatValue>
          </StatInfo>
          <StatIcon color="#2196f3">
            <ShoppingBasketIcon />
          </StatIcon>
        </StatCard>
        
        <StatCard>
          <StatInfo>
            <StatLabel>Customers</StatLabel>
            <StatValue>{stats?.totalUsers}</StatValue>
          </StatInfo>
          <StatIcon color="#ff9800">
            <GroupIcon />
          </StatIcon>
        </StatCard>
        
        <StatCard>
          <StatInfo>
            <StatLabel>Products</StatLabel>
            <StatValue>{stats?.totalProducts}</StatValue>
          </StatInfo>
          <StatIcon color="#9c27b0">
            <TrendingUpIcon />
          </StatIcon>
        </StatCard>
      </StatsGrid>
      
      <ChartSection>
        <ChartTitle>Revenue & Order Trends</ChartTitle>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196f3" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2196f3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2196f3" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartSection>
    </Container>
  );
};

export default AdminDashboard;
