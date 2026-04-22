import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllProducts, addProductAdmin, updateProductAdmin, deleteProductAdmin } from "../../api";
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

const ProductImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  background: ${({ theme }) => theme.bgLight};
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const AdminProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    title: "",
    name: "",
    desc: "",
    img: "",
    price: { org: 0, mrp: 0, off: 0 },
    sizes: [],
    category: [],
    stock: 0
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      dispatch(openSnackbar({ message: "Failed to fetch products", severity: "error" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentProduct({
      title: "",
      name: "",
      desc: "",
      img: "",
      price: { org: 0, mrp: 0, off: 0 },
      sizes: [],
      category: [],
      stock: 0
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditMode(true);
    setCurrentProduct(product);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("krist-app-token");
        await deleteProductAdmin(token, id);
        dispatch(openSnackbar({ message: "Product deleted successfully", severity: "success" }));
        fetchProducts();
      } catch (err) {
        dispatch(openSnackbar({ message: "Failed to delete product", severity: "error" }));
      }
    }
  };

  const handleSubmit = async () => {
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("krist-app-token");
      if (editMode) {
        await updateProductAdmin(token, currentProduct._id, currentProduct);
        dispatch(openSnackbar({ message: "Product updated successfully", severity: "success" }));
      } else {
        await addProductAdmin(token, currentProduct);
        dispatch(openSnackbar({ message: "Product added successfully", severity: "success" }));
      }
      setOpenModal(false);
      fetchProducts();
    } catch (err) {
      dispatch(openSnackbar({ message: "Operation failed", severity: "error" }));
    } finally {
      setBtnLoading(false);
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
      <Header>
        <Title>Manage Products</Title>
        <Button text="Add Product" leftIcon={<AddIcon />} onClick={handleOpenAdd} small />
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ProductImg src={product.img} alt={product.title} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{product.title}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text_secondary)' }}>{product.name}</span>
                    </div>
                  </div>
                </Td>
                <Td>{product.category.join(", ")}</Td>
                <Td>${product.price.org}</Td>
                <Td>{product.stock || 0}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton onClick={() => handleOpenEdit(product)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product._id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalContent>
          <Title>{editMode ? "Edit Product" : "Add New Product"}</Title>
          <FormGrid>
            <TextInput 
              label="Product Title" 
              placeholder="e.g. iPhone 15 Pro"
              value={currentProduct.title}
              handelChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})}
            />
            <TextInput 
              label="Brand/Model Name" 
              placeholder="e.g. Apple"
              value={currentProduct.name}
              handelChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
            />
          </FormGrid>
          
          <TextInput 
            label="Description" 
            placeholder="Product details..."
            textArea
            rows={4}
            value={currentProduct.desc}
            handelChange={(e) => setCurrentProduct({...currentProduct, desc: e.target.value})}
          />

          <TextInput 
            label="Image URL" 
            placeholder="https://images.unsplash.com/..."
            value={currentProduct.img}
            handelChange={(e) => setCurrentProduct({...currentProduct, img: e.target.value})}
          />

          <FormGrid>
            <TextInput 
              label="Original Price ($)" 
              type="number"
              value={currentProduct.price.org}
              handelChange={(e) => setCurrentProduct({
                ...currentProduct, 
                price: { ...currentProduct.price, org: parseFloat(e.target.value) }
              })}
            />
            <TextInput 
              label="MRP Price ($)" 
              type="number"
              value={currentProduct.price.mrp}
              handelChange={(e) => setCurrentProduct({
                ...currentProduct, 
                price: { ...currentProduct.price, mrp: parseFloat(e.target.value) }
              })}
            />
          </FormGrid>

          <FormGrid>
             <TextInput 
              label="Stock Quantity" 
              type="number"
              value={currentProduct.stock}
              handelChange={(e) => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})}
            />
            <TextInput 
              label="Discount (%)" 
              type="number"
              value={currentProduct.price.off}
              handelChange={(e) => setCurrentProduct({
                ...currentProduct, 
                price: { ...currentProduct.price, off: parseFloat(e.target.value) }
              })}
            />
          </FormGrid>

          <FormGrid>
            <TextInput 
              label="Categories (comma separated)" 
              placeholder="Men, Shoes, Casual"
              value={currentProduct.category.join(", ")}
              handelChange={(e) => setCurrentProduct({
                ...currentProduct, 
                category: e.target.value.split(",").map(s => s.trim())
              })}
            />
            <TextInput 
              label="Sizes (comma separated)" 
              placeholder="S, M, L, XL"
              value={currentProduct.sizes.join(", ")}
              handelChange={(e) => setCurrentProduct({
                ...currentProduct, 
                sizes: e.target.value.split(",").map(s => s.trim())
              })}
            />
          </FormGrid>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <Button text="Cancel" outlined onClick={() => setOpenModal(false)} flex />
            <Button 
              text={editMode ? "Update Product" : "Create Product"} 
              onClick={handleSubmit} 
              isLoading={btnLoading}
              flex 
            />
          </div>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminProducts;
