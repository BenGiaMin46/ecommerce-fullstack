import React from "react";
import styled from "styled-components";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userSlice";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${({ theme }) => theme.bg};
`;

const Sidebar = styled.div`
  width: 260px;
  background: ${({ theme }) => theme.card};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadow_sm};
  z-index: 10;
  
  @media (max-width: 768px) {
    width: 80px;
  }
`;

const SidebarHeader = styled.div`
  padding: 30px;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 20px;
    justify-content: center;
    span { display: none; }
  }
`;

const SidebarMenu = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 8px;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.text_secondary};
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.bgLight};
    color: ${({ theme }) => theme.primary};
  }
  
  &.active {
    background: ${({ theme }) => theme.primary + '15'};
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 15px;
    span { display: none; }
  }
`;

const LogoutButton = styled.div`
  margin-top: auto;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
             <AssessmentIcon />
          </div>
          <span>Admin Portal</span>
        </SidebarHeader>
        
        <SidebarMenu>
          <MenuItem to="/admin/dashboard">
            <DashboardIcon fontSize="small" />
            <span>Dashboard</span>
          </MenuItem>
          <MenuItem to="/admin/orders">
            <ShoppingBagIcon fontSize="small" />
            <span>Orders</span>
          </MenuItem>
          <MenuItem to="/admin/products">
            <RateReviewIcon fontSize="small" />
            <span>Products</span>
          </MenuItem>
          <MenuItem to="/admin/users">
            <PersonIcon fontSize="small" />
            <span>Users</span>
          </MenuItem>
          
          <div style={{ height: '20px' }} />
          
          <MenuItem to="/shop">
            <ArrowBackIcon fontSize="small" />
            <span>Go to Shop</span>
          </MenuItem>
        </SidebarMenu>
        
        <LogoutButton>
          <MenuItem as="div" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogoutIcon fontSize="small" />
            <span>Logout</span>
          </MenuItem>
        </LogoutButton>
      </Sidebar>
      
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
};

export default AdminLayout;
