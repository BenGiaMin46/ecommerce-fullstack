import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { addToCart, deleteFromCart, getCart, placeOrder, createMoMoPayment, createVNPayPayment, validateVoucher } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgress, Chip } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InventoryIcon from '@mui/icons-material/Inventory';

const Container = styled.div`
  padding: 40px 30px;
  padding-bottom: 100px;
  min-height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
  background: ${({ theme }) => theme.bg};
`;
const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 32px;
`;
const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 40px;
  width: 100%;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const CartHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  gap: 20px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 750px) {
    display: none;
  }
`;
const CartItemCard = styled.div`
  animation: slideIn 0.3s ease-out;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow_md};
    border-color: ${({ theme }) => theme.primary + '30'};
  }
  
  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    gap: 16px;
    
    & > div:not(:first-child) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      &::before {
        content: attr(data-label);
        font-weight: 600;
        color: ${({ theme }) => theme.text_secondary};
        font-size: 14px;
      }
    }
  }
`;
const Counter = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 25px;
  padding: 4px;
  background: ${({ theme }) => theme.bgLight};
  width: fit-content;
`;

const Product = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const Img = styled.img`
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow_sm};
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Protitle = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ProSize = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + '10'};
  padding: 4px 10px;
  border-radius: 20px;
  width: fit-content;
`;

const Right = styled.div`
  flex: 0.8;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 100px;
  height: fit-content;
  
  @media (max-width: 900px) {
    position: static;
  }
`;
const SummaryCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 20px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow_sm};
`;

const SummaryTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-of-type {
    border-bottom: none;
  }
  
  &.total {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin-top: 8px;
    padding-top: 16px;
    border-top: 2px solid ${({ theme }) => theme.border};
  }
`;

const QuantityBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.error};
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.error + '15'};
  }
`;

const ContinueShopping = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_secondary};
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: fit-content;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(-4px);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  border: 2px dashed ${({ theme }) => theme.border};
  gap: 24px;
`;

const EmptyIcon = styled.div`
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  max-width: 400px;
`;

const PriceValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const SubtotalValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;
const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });

  const getProducts = async () => {
    const token = localStorage.getItem("krist-app-token");
    if (!token) return;
    setLoading(true);
    await getCart(token).then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
    });
  };

  const addCart = async (id) => {
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: id, quantity: 1 })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.response?.data?.message || err.message,
            severity: "error",
          })
        );
      });
  };

  const removeCart = async (id, type) => {
    const token = localStorage.getItem("krist-app-token");
    let qnt = type === "full" ? null : 1;
    await deleteFromCart(token, {
      productId: id,
      quantity: qnt,
    })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.response?.data?.message || err.message,
            severity: "error",
          })
        );
      });
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.quantity * item?.product?.price?.org,
      0
    );
  };

  useEffect(() => {
    getProducts();
  }, [reload]);

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    setVoucherLoading(true);
    try {
      const token = localStorage.getItem("krist-app-token");
      const orderAmount = calculateSubtotal() * 1.08; // Amount including tax
      const res = await validateVoucher(token, { code: voucherCode, orderAmount });
      setDiscount(res.data.discountAmount);
      setAppliedVoucher(res.data.code);
      dispatch(openSnackbar({ message: res.data.message, severity: "success" }));
    } catch (error) {
      dispatch(openSnackbar({ message: error.response?.data?.message || "Invalid voucher", severity: "error" }));
      setDiscount(0);
      setAppliedVoucher(null);
    } finally {
      setVoucherLoading(false);
    }
  };

  const convertAddressToString = (addressObj) => {
    // Convert the address object to a string representation
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      const isDeliveryDetailsFilled =
        deliveryDetails.firstName &&
        deliveryDetails.lastName &&
        deliveryDetails.completeAddress &&
        deliveryDetails.phoneNumber &&
        deliveryDetails.emailAddress;

      if (!isDeliveryDetailsFilled) {
        // Show an error message or handle the situation where delivery details are incomplete
        dispatch(
          openSnackbar({
            message: "Please fill in all required delivery details.",
            severity: "error",
          })
        );
        setButtonLoad(false);
        return;
      }
      const token = localStorage.getItem("krist-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      const orderDetails = {
        products: products.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        address: convertAddressToString(deliveryDetails),
        totalAmount: (parseFloat(totalAmount) - discount).toFixed(2),
        voucherCode: appliedVoucher,
        discountAmount: discount,
      };

      const res = await placeOrder(token, orderDetails);
      const createdOrder = res.data.order;

      if (selectedPaymentMethod === "MoMo") {
        const paymentRes = await createMoMoPayment(token, {
          orderId: createdOrder._id,
          amount: Math.round(parseFloat(totalAmount) * 1.08 - discount),
          orderInfo: `Thanh toan don hang #${createdOrder._id}`,
        });
        if (paymentRes.data?.payUrl) {
          window.location.href = paymentRes.data.payUrl;
          return;
        }
      } else if (selectedPaymentMethod === "VNPay") {
        const paymentRes = await createVNPayPayment(token, {
          orderId: createdOrder._id,
          amount: Math.round(parseFloat(totalAmount) * 1.08 - discount),
          orderInfo: `Thanh toan don hang #${createdOrder._id}`,
        });
        if (paymentRes.data?.payUrl) {
          window.location.href = paymentRes.data.payUrl;
          return;
        }
      }

      // Show success message or navigate to a success page
      dispatch(
        openSnackbar({
          message: "Order placed successfully",
          severity: "success",
        })
      );
      setButtonLoad(false);
      setDeliveryDetails({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        completeAddress: "",
      });
      // Clear the cart and update the UI
      setReload(!reload);
      navigate("/orders"); // Or wherever the orders page is
    } catch (error) {
      console.error("Order Error:", error);
      // Handle errors, show error message, etc.
      dispatch(
        openSnackbar({
          message: error.response?.data?.message || "Failed to place order. Please try again.",
          severity: "error",
        })
      );
      setButtonLoad(false);
    }
  };
  if (loading) {
    return (
      <Container>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <div>
          <ContinueShopping to="/shop">
            <ArrowBackIcon sx={{ fontSize: 20 }} />
            Continue Shopping
          </ContinueShopping>
          <Title>
            <ShoppingBagIcon sx={{ fontSize: 28 }} />
            Shopping Cart
          </Title>
        </div>

        {products.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <ShoppingBagIcon sx={{ fontSize: 48 }} />
            </EmptyIcon>
            <EmptyTitle>Your cart is empty</EmptyTitle>
            <EmptyText>Looks like you haven't added anything to your cart yet. Browse our products and find something you love!</EmptyText>
            <Button text="Start Shopping" onClick={() => navigate('/shop')} />
          </EmptyState>
        ) : (
          <Wrapper>
            <Left>
              <CartHeader>
                <div>Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
                <div></div>
              </CartHeader>
              
              {products.map((item, index) => (
                <CartItemCard
                  key={item?.product?._id || index}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <Product>
                      <Img src={item?.product?.img} />
                      <Details>
                        <Protitle>{item?.product?.title}</Protitle>
                        <ProDesc>{item?.product?.name}</ProDesc>
                        <ProSize>Size: XL</ProSize>
                      </Details>
                    </Product>
                    
                    <PriceValue data-label="Price:">
                      ${item?.product?.price?.org}
                    </PriceValue>
                    
                    <Counter data-label="Quantity:">
                      <QuantityBtn
                        onClick={() => removeCart(item?.product?._id)}
                        disabled={item?.quantity <= 1}
                      >
                        -
                      </QuantityBtn>
                      <QuantityValue>{item?.quantity}</QuantityValue>
                      <QuantityBtn onClick={() => addCart(item?.product?._id)}>
                        +
                      </QuantityBtn>
                    </Counter>
                    
                    <SubtotalValue data-label="Total:">
                      ${(item.quantity * item?.product?.price?.org).toFixed(2)}
                    </SubtotalValue>
                    
                    <DeleteBtn onClick={() => removeCart(item?.product?._id, "full")}>
                      <DeleteOutline sx={{ fontSize: 22 }} />
                    </DeleteBtn>
                </CartItemCard>
              ))}
            </Left>
            
            <Right>
              <SummaryCard>
                <SummaryTitle>
                  <InventoryIcon sx={{ fontSize: 22 }} />
                  Order Summary
                </SummaryTitle>
                
                <SummaryRow>
                  <span>Subtotal ({products.length} items)</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Shipping</span>
                  <Chip 
                    label="FREE" 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'success.light', 
                      color: 'success.dark',
                      fontWeight: 600 
                    }} 
                  />
                </SummaryRow>
                <SummaryRow>
                  <span>Tax (8%)</span>
                  <span>${(calculateSubtotal() * 0.08).toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow className="total">
                  <span>Total</span>
                  <span>${((calculateSubtotal() * 1.08)).toFixed(2)}</span>
                </SummaryRow>
                
                {discount > 0 && (
                  <SummaryRow style={{ color: 'green', fontWeight: 600 }}>
                    <span>Voucher Discount ({appliedVoucher})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </SummaryRow>
                )}
                
                {discount > 0 && (
                  <SummaryRow className="total" style={{ color: 'var(--primary)' }}>
                    <span>Final Total</span>
                    <span>${(calculateSubtotal() * 1.08 - discount).toFixed(2)}</span>
                  </SummaryRow>
                )}
              </SummaryCard>

              <SummaryCard>
                <SectionTitle>
                  <InventoryIcon sx={{ fontSize: 18 }} />
                  Voucher Code
                </SectionTitle>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <TextInput
                    small
                    placeholder="Enter Code"
                    value={voucherCode}
                    handelChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <Button
                    text={voucherLoading ? "Checking..." : "Apply"}
                    small
                    onClick={handleApplyVoucher}
                    isLoading={voucherLoading}
                    isDisabled={voucherLoading || !voucherCode}
                  />
                </div>
                {appliedVoucher && (
                    <div style={{ color: 'green', fontSize: '12px', marginTop: '8px', fontWeight: 500 }}>
                        Voucher {appliedVoucher} applied!
                    </div>
                )}
              </SummaryCard>
              
              <SummaryCard>
                <SectionTitle>
                  <LocalShippingIcon sx={{ fontSize: 18 }} />
                  Delivery Details
                </SectionTitle>
                <FormRow>
                  <TextInput
                    small
                    placeholder="First Name"
                    value={deliveryDetails.firstName}
                    handelChange={(e) =>
                      setDeliveryDetails({ ...deliveryDetails, firstName: e.target.value })
                    }
                  />
                  <TextInput
                    small
                    placeholder="Last Name"
                    value={deliveryDetails.lastName}
                    handelChange={(e) =>
                      setDeliveryDetails({ ...deliveryDetails, lastName: e.target.value })
                    }
                  />
                </FormRow>
                <TextInput
                  small
                  value={deliveryDetails.emailAddress}
                  handelChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, emailAddress: e.target.value })
                  }
                  placeholder="Email Address"
                />
                <TextInput
                  small
                  value={deliveryDetails.phoneNumber}
                  handelChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, phoneNumber: e.target.value })
                  }
                  placeholder="Phone Number"
                />
                <TextInput
                  small
                  textArea
                  rows="3"
                  handelChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, completeAddress: e.target.value })
                  }
                  value={deliveryDetails.completeAddress}
                  placeholder="Complete Address"
                />
              </SummaryCard>
              
              <SummaryCard>
                <SectionTitle>
                  <CreditCardIcon sx={{ fontSize: 18 }} />
                  Payment Method
                </SectionTitle>
                <PaymentOptions>
                  <Chip 
                    label="MoMo" 
                    color={selectedPaymentMethod === "MoMo" ? "primary" : "default"} 
                    variant={selectedPaymentMethod === "MoMo" ? "filled" : "outlined"}
                    onClick={() => setSelectedPaymentMethod("MoMo")}
                    sx={{ fontWeight: 500, cursor: "pointer", px: 1, height: "35px" }}
                    avatar={<img src="https://developers.momo.vn/v2/assets/images/logo.png" style={{ width: "20px", height: "20px" }} alt="momo" />}
                  />
                  <Chip 
                    label="VNPay" 
                    color={selectedPaymentMethod === "VNPay" ? "primary" : "default"} 
                    variant={selectedPaymentMethod === "VNPay" ? "filled" : "outlined"}
                    onClick={() => setSelectedPaymentMethod("VNPay")}
                    sx={{ fontWeight: 500, cursor: "pointer", px: 1, height: "35px" }}
                    avatar={<img src="https://brandlogo.org/wp-content/uploads/2024/09/VNPAY-Logo.png" style={{ width: "24px", height: "16px", objectFit: "contain" }} alt="vnpay" />}
                  />
                  <Chip 
                    label="Cash on Delivery" 
                    color={selectedPaymentMethod === "COD" ? "primary" : "default"} 
                    variant={selectedPaymentMethod === "COD" ? "filled" : "outlined"}
                    onClick={() => setSelectedPaymentMethod("COD")}
                    sx={{ fontWeight: 500, cursor: "pointer" }}
                  />
                </PaymentOptions>
              </SummaryCard>
              
              <Button
                text={buttonLoad ? "Processing..." : "Place Order"}
                full
                isLoading={buttonLoad}
                isDisabled={buttonLoad}
                onClick={PlaceOrder}
              />
            </Right>
          </Wrapper>
        )}
      </Section>
    </Container>
  );
};

export default Cart;
