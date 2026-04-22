import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getNews, addNews, updateNews, deleteNews } from "../../api";
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

const NewsImg = styled.img`
  width: 60px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
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
  width: 600px;
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

const AdminNews = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNews, setCurrentNews] = useState({
    title: "",
    excerpt: "",
    image: "",
    category: "",
    date: "",
    readTime: "3 min read"
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await getNews();
      setNews(res.data);
    } catch (err) {
      dispatch(openSnackbar({ message: "Failed to fetch news", severity: "error" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentNews({ title: "", excerpt: "", image: "", category: "", date: "", readTime: "3 min read" });
    setOpenModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditMode(true);
    setCurrentNews(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this article?")) {
      try {
        const token = localStorage.getItem("krist-app-token");
        await deleteNews(token, id);
        dispatch(openSnackbar({ message: "Deleted successfully", severity: "success" }));
        fetchNews();
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
        await updateNews(token, currentNews._id, currentNews);
        dispatch(openSnackbar({ message: "Updated successfully", severity: "success" }));
      } else {
        await addNews(token, currentNews);
        dispatch(openSnackbar({ message: "Added successfully", severity: "success" }));
      }
      setOpenModal(false);
      fetchNews();
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
        <Title>Manage News & Blog</Title>
        <Button text="Add Article" leftIcon={<AddIcon />} onClick={handleOpenAdd} small />
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Article</Th>
              <Th>Category</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item._id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <NewsImg src={item.image} />
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                  </div>
                </Td>
                <Td>{item.category}</Td>
                <Td>{item.date}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton onClick={() => handleOpenEdit(item)} color="primary"><EditIcon fontSize="small" /></IconButton>
                    <IconButton onClick={() => handleDelete(item._id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalContent>
          <Title>{editMode ? "Edit Article" : "Add Article"}</Title>
          <TextInput label="Title" value={currentNews.title} handelChange={(e) => setCurrentNews({...currentNews, title: e.target.value})} />
          <TextInput label="Category" placeholder="e.g. Collection, Event" value={currentNews.category} handelChange={(e) => setCurrentNews({...currentNews, category: e.target.value})} />
          <TextInput label="Image URL" value={currentNews.image} handelChange={(e) => setCurrentNews({...currentNews, image: e.target.value})} />
          <TextInput label="Excerpt" textArea rows={3} value={currentNews.excerpt} handelChange={(e) => setCurrentNews({...currentNews, excerpt: e.target.value})} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <TextInput label="Date" placeholder="MM/DD/YYYY" value={currentNews.date} handelChange={(e) => setCurrentNews({...currentNews, date: e.target.value})} />
            <TextInput label="Read Time" value={currentNews.readTime} handelChange={(e) => setCurrentNews({...currentNews, readTime: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button text="Cancel" outlined onClick={() => setOpenModal(false)} flex />
            <Button text={editMode ? "Update" : "Create"} onClick={handleSubmit} isLoading={btnLoading} flex />
          </div>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminNews;
