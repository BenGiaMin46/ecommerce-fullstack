import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getPromotions, addPromotion, updatePromotion, deletePromotion } from "../../api";
import { CircularProgress, Modal, IconButton } from "@mui/material";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import { useDispatch } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  overflow-x: auto;
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
  vertical-align: middle;
`;

const PromoBadge = styled.span`
  background: ${({ theme }) => theme.text_primary};
  color: ${({ theme }) => theme.white};
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadow_xl};
`;

const AdminPromotions = () => {
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPromo, setCurrentPromo] = useState({
    title: "",
    desc: "",
    code: "",
    badge: "",
    date: "",
    category: "all"
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const res = await getPromotions();
      setPromos(res.data);
    } catch (err) {
      dispatch(openSnackbar({ message: "Failed to fetch promotions", severity: "error" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentPromo({ title: "", desc: "", code: "", badge: "", date: "", category: "all" });
    setOpenModal(true);
  };

  const handleOpenEdit = (promo) => {
    setEditMode(true);
    setCurrentPromo(promo);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this promotion?")) {
      try {
        const token = localStorage.getItem("krist-app-token");
        await deletePromotion(token, id);
        dispatch(openSnackbar({ message: "Deleted successfully", severity: "success" }));
        fetchPromos();
      } catch (err) {
        dispatch(openSnackbar({ message: "Failed to delete", severity: "error" }));
      }
    }
  };

  const handleSubmit = async () => {
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("krist-app-token");
      if (editMode) {
        await updatePromotion(token, currentPromo._id, currentPromo);
        dispatch(openSnackbar({ message: "Updated successfully", severity: "success" }));
      } else {
        await addPromotion(token, currentPromo);
        dispatch(openSnackbar({ message: "Added successfully", severity: "success" }));
      }
      setOpenModal(false);
      fetchPromos();
    } catch (err) {
      dispatch(openSnackbar({ message: "Operation failed", severity: "error" }));
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><CircularProgress /></div>;

  return (
    <Container>
      <Header>
        <Title>Manage Promotions</Title>
        <Button text="Add Promotion" leftIcon={<AddIcon />} onClick={handleOpenAdd} small />
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Title & Code</Th>
              <Th>Badge</Th>
              <Th>Description</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <tr key={promo._id}>
                <Td>
                  <div style={{ fontWeight: 600 }}>{promo.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--primary)', fontFamily: 'monospace' }}>{promo.code}</div>
                </Td>
                <Td><PromoBadge>{promo.badge}</PromoBadge></Td>
                <Td style={{ maxWidth: '300px' }}>{promo.desc}</Td>
                <Td>{promo.date}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton onClick={() => handleOpenEdit(promo)} color="primary"><EditIcon fontSize="small" /></IconButton>
                    <IconButton onClick={() => handleDelete(promo._id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalContent>
          <Title>{editMode ? "Edit Promotion" : "Add Promotion"}</Title>
          <TextInput label="Title" value={currentPromo.title} handelChange={(e) => setCurrentPromo({...currentPromo, title: e.target.value})} />
          <TextInput label="Promo Code" value={currentPromo.code} handelChange={(e) => setCurrentPromo({...currentPromo, code: e.target.value})} />
          <TextInput label="Badge (e.g. NEW, HOT)" value={currentPromo.badge} handelChange={(e) => setCurrentPromo({...currentPromo, badge: e.target.value})} />
          <TextInput label="Description" textArea value={currentPromo.desc} handelChange={(e) => setCurrentPromo({...currentPromo, desc: e.target.value})} />
          <TextInput label="Date/Expiry" placeholder="e.g. Expiry: 12/31/2026" value={currentPromo.date} handelChange={(e) => setCurrentPromo({...currentPromo, date: e.target.value})} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button text="Cancel" outlined onClick={() => setOpenModal(false)} flex />
            <Button text={editMode ? "Update" : "Create"} onClick={handleSubmit} isLoading={btnLoading} flex />
          </div>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminPromotions;
