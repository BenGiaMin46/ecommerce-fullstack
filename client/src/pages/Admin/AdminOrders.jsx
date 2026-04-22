import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllOrdersAdmin, updateOrderStatusAdmin } from "../../api";
import { CircularProgress, Chip, MenuItem, Select, FormControl } from "@mui/material";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import { useDispatch } from "react-redux";
import PackageIcon from "@mui/icons-material/Inventory";

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

const TableContainer = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow_sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 18px 24px;
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Td = styled.td`
  padding: 18px 24px;
  color: ${({ theme }) => theme.text_primary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text_tertiary};
`;

const AdminOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("krist-app-token");
      const res = await getAllOrdersAdmin(token);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("krist-app-token");
      await updateOrderStatusAdmin(token, orderId, newStatus);
      dispatch(openSnackbar({ message: "Status updated successfully", severity: "success" }));
      fetchOrders(); // Refresh list
    } catch (err) {
      dispatch(openSnackbar({ message: "Failed to update status", severity: "error" }));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container>
      <Title>Global Orders Management</Title>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th>Customer</Th>
              <Th>Products</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <Td>#{order._id.slice(-8).toUpperCase()}</Td>
                <Td>
                  <UserInfo>
                    <UserName>{order.user?.name || "Deleted User"}</UserName>
                    <UserEmail>{order.user?.email}</UserEmail>
                  </UserInfo>
                </Td>
                <Td>
                   {order.products.length} Items
                </Td>
                <Td style={{ fontWeight: '700' }}>
                   ${parseFloat(order.total_amount?.toString()).toFixed(2)}
                </Td>
                <Td>
                  <Chip 
                    label={order.status} 
                    size="small"
                    color={
                      order.status === "Delivered" ? "success" : 
                      order.status === "Shipped" ? "info" : 
                      order.status === "Processing" ? "warning" : "default"
                    }
                  />
                </Td>
                <Td>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      sx={{ borderRadius: '10px' }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminOrders;
