import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllUsersAdmin } from "../../api";
import { CircularProgress, Avatar, Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const UserCard = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 24px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: ${({ theme }) => theme.shadow_sm};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow_md};
    border-color: ${({ theme }) => theme.primary + '30'};
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const Name = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Email = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const JoinDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_tertiary};
  margin-top: 4px;
`;

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("krist-app-token");
        const res = await getAllUsersAdmin(token);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container>
      <Title>User Directory</Title>
      <UserGrid>
        {users.map((user) => (
          <UserCard key={user._id}>
            <Avatar 
              src={user.img} 
              sx={{ width: 56, height: 56, bgcolor: 'var(--primary)' }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <UserDetails>
              <Name>
                {user.name}
                {user.isAdmin && (
                  <Chip 
                    icon={<AdminPanelSettingsIcon sx={{ fontSize: '14px !important' }} />} 
                    label="Admin" 
                    size="small" 
                    color="primary" 
                    sx={{ height: '20px', fontSize: '10px' }} 
                  />
                )}
              </Name>
              <Email>{user.email}</Email>
              <JoinDate>Joined: {new Date(user.createdAt).toLocaleDateString()}</JoinDate>
            </UserDetails>
          </UserCard>
        ))}
      </UserGrid>
    </Container>
  );
};

export default AdminUsers;
