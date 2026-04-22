import { CircularProgress, Rating, Avatar } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import FlashOnOutlined from "@mui/icons-material/FlashOnOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { useDispatch } from "react-redux";
import {
  addToCart,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
  getProductDetails,
  getAllProducts,
  addReview,
} from "../api";
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import ProductCard from "../components/cards/ProductCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 100px);
  padding: 40px 0;
  background: ${({ theme }) => theme.white};
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 1200px;
  display: flex;
  width: 100%;
  padding: 0;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.border};
  gap: 0;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;
const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bgLight};
  min-height: 600px;
  @media (max-width: 900px) {
    min-height: 400px;
  }
`;
const Image = styled.img`
  height: 600px;
  object-fit: cover;
  max-width: 100%;
  @media (max-width: 900px) {
    height: 400px;
  }
`;

const Details = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  padding: 40px;
  flex: 1;
  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;
const Desc = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
`;
const Name = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_tertiary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_tertiary};
  text-decoration: line-through;
`;
const Percent = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  background: ${({ theme }) => theme.text_primary};
  padding: 4px 8px;
`;

const Sizes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SizeLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.text_secondary};
`;
const Items = styled.div`
  display: flex;
  gap: 12px;
`;
const Item = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 13px;
  font-weight: 500;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ selected, theme }) => selected ? theme.text_primary : theme.white};
  color: ${({ selected, theme }) => selected ? theme.white : theme.text_primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.text_secondary};
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 0;
  flex-wrap: wrap;
`;

const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 12px;
`;

const QuantityBtn = styled.button`
  width: 44px;
  height: 44px;
  background: ${({ theme }) => theme.white};
  border: none;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.bgLight};
  }
`;

const Quantity = styled.div`
  width: 50px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  border-left: 1px solid ${({ theme }) => theme.border};
  border-right: 1px solid ${({ theme }) => theme.border};
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: 140px;
  height: 48px;
  background: ${({ primary, theme }) => primary ? theme.text_primary : theme.white};
  color: ${({ primary, theme }) => primary ? theme.white : theme.text_primary};
  border: 1px solid ${({ theme }) => theme.text_primary};
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StockStatus = styled.div`
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ color }) => color};
  margin-bottom: 10px;
`;

const ReviewSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ReviewCard = styled.div`
  display: flex;
  gap: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReviewUser = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const ReviewDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_tertiary};
`;

const ReviewComment = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
`;

const ReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  height: fit-content;
  margin-top: 20px;
`;

const RelatedSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 24px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
`;
const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
  const [selected, setSelected] = useState();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const getProduct = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const res = await getProductDetails(id);
      setProduct(res.data);
      
      // Fetch related products
      const relatedRes = await getAllProducts(`categories=${res.data?.category[0]}`);
      setRelatedProducts(relatedRes.data.filter(p => p._id !== id).slice(0, 4));
    } catch (error) {
      setProduct(undefined);
      setApiError("Khong the ket noi den server/DB.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleAddReview = async () => {
    if (!newReview.comment) return;
    setReviewLoading(true);
    try {
      const token = localStorage.getItem("krist-app-token");
      await addReview(token, id, newReview);
      dispatch(openSnackbar({ message: "Review added successfully!", severity: "success" }));
      setNewReview({ rating: 5, comment: "" });
      getProduct(); // Refresh product data to see new review
    } catch (error) {
      dispatch(openSnackbar({ 
        message: error.response?.data?.message || "Only buyers can review after delivery", 
        severity: "error" 
      }));
    } finally {
      setReviewLoading(false);
    }
  };

  const addFavorite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await addToFavourite(token, { productId: product?._id })
      .then((res) => {
        setFavorite(true);
        setFavoriteLoading(false);
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.response?.data?.message || err.message,
            severity: "error",
          })
        );
      });
  };
  const removeFavorite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await deleteFromFavourite(token, { productId: product?._id })
      .then((res) => {
        setFavorite(false);
        setFavoriteLoading(false);
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.response?.data?.message || err.message,
            severity: "error",
          })
        );
      });
  };
  const addCart = async () => {
    setCartLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: product?._id, quantity: quantity })
      .then((res) => {
        setCartLoading(false);
        dispatch(
          openSnackbar({
            message: "Added to Cart",
            severity: "success",
          })
        );
        navigate("/cart");
      })
      .catch((err) => {
        setCartLoading(false);
        dispatch(
          openSnackbar({
            message: err.response?.data?.message || err.message,
            severity: "error",
          })
        );
      });
  };
  const checkFavourite = useCallback(async () => {
    const token = localStorage.getItem("krist-app-token");
    if (!token) return;
    setFavoriteLoading(true);
    await getFavourite(token)
      .then((res) => {
        const isFavorite = res.data?.some(
          (favorite) => favorite._id === id
        );
        setFavorite(isFavorite);
        setFavoriteLoading(false);
      })
      .catch(() => {
        setFavoriteLoading(false);
      });
  }, [id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  useEffect(() => {
    if (product) {
      checkFavourite();
    }
  }, [product, checkFavourite]);

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : apiError ? (
        <Wrapper>
          <Details>
            <Title>Server is unavailable</Title>
            <Desc>{apiError}</Desc>
          </Details>
        </Wrapper>
      ) : (
        <Wrapper>
          <ImageWrapper>
            <Image src={product?.img} />
          </ImageWrapper>
          <Details>
            <div>
              <Title>{product?.title}</Title>
              <Name>{product?.name}</Name>
            </div>
            
            <StockStatus color={product?.stock > 10 ? "#4caf50" : product?.stock > 0 ? "#ff9800" : "#f44336"}>
              {product?.stock > 10 ? "● In Stock" : product?.stock > 0 ? `● Low Stock (Only ${product.stock} left)` : "● Out of Stock"}
            </StockStatus>

            <Rating value={product?.avgRating || 0} readOnly precision={0.5} />
            
            <Price>
              ${product?.price?.org} <Span>${product?.price?.mrp}</Span>{" "}
              <Percent> (${product?.price?.off}% Off) </Percent>
            </Price>
            <Desc>{product?.desc}</Desc>
            <Sizes>
              <SizeLabel>Select Size</SizeLabel>
              <Items>
                {product?.sizes.map((size) => (
                  <Item
                    key={size}
                    selected={selected === size}
                    onClick={() => setSelected(size)}
                  >
                    {size}
                  </Item>
                ))}
              </Items>
            </Sizes>
            
            <div>
              <SizeLabel>Quantity</SizeLabel>
              <QuantityWrapper>
                <QuantityBtn onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</QuantityBtn>
                <Quantity>{quantity}</Quantity>
                <QuantityBtn onClick={() => setQuantity(quantity + 1)}>+</QuantityBtn>
              </QuantityWrapper>
            </div>
            
            <ButtonWrapper>
              <ActionButton
                outlined
                disabled={cartLoading || product?.stock === 0}
                onClick={() => {
                  if (!selected) {
                    dispatch(openSnackbar({ message: "Please select a size", severity: "error" }));
                    return;
                  }
                  addCart();
                }}
              >
                <ShoppingCartOutlined sx={{ fontSize: "20px" }} />
                {cartLoading ? "Adding..." : product?.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </ActionButton>
              
              <ActionButton
                primary
                disabled={product?.stock === 0}
                onClick={() => {
                  if (!selected) {
                    dispatch(openSnackbar({ message: "Please select a size", severity: "error" }));
                    return;
                  }
                  addCart().then(() => navigate("/cart"));
                }}
              >
                <FlashOnOutlined sx={{ fontSize: "20px" }} />
                Buy Now
              </ActionButton>
              
              <ActionButton
                outlined
                onClick={() => (favorite ? removeFavorite() : addFavorite())}
                disabled={favoriteLoading}
              >
                {favorite ? (
                  <FavoriteRounded sx={{ fontSize: "20px", color: "#ef4444" }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: "20px" }} />
                )}
                {favorite ? "Favorited" : "Favorite"}
              </ActionButton>
            </ButtonWrapper>
          </Details>
        </Wrapper>
      )}

      {product && (
        <>
          <ReviewSection>
            <SectionHeader>
              <SectionTitle>Customer Reviews ({product.reviews?.length || 0})</SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Rating value={product.avgRating} readOnly precision={0.5} />
                <span style={{ fontWeight: 600 }}>{product.avgRating.toFixed(1)} out of 5</span>
              </div>
            </SectionHeader>

            <ReviewContainer>
              <ReviewList>
                {product.reviews?.length === 0 ? (
                  <p style={{ color: 'var(--text_secondary)' }}>No reviews yet. Be the first to review this product!</p>
                ) : (
                  product.reviews.map((review, index) => (
                    <ReviewCard key={index}>
                      <Avatar sx={{ bgcolor: 'var(--primary)' }}>
                         <PersonIcon />
                      </Avatar>
                      <ReviewContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <ReviewUser>Verified Buyer</ReviewUser>
                          <Rating value={review.rating} size="small" readOnly />
                        </div>
                        <ReviewDate>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
                        <ReviewComment>{review.comment}</ReviewComment>
                      </ReviewContent>
                    </ReviewCard>
                  ))
                )}
              </ReviewList>

              <ReviewForm>
                <SectionTitle style={{ fontSize: '20px' }}>Leave a Review</SectionTitle>
                <p style={{ fontSize: '14px', color: 'var(--text_secondary)' }}>
                  Only verified buyers who have received this product can leave a review.
                </p>
                
                <div>
                  <SizeLabel>Your Rating</SizeLabel>
                  <Rating 
                    value={newReview.rating} 
                    onChange={(e, val) => setNewReview({ ...newReview, rating: val })} 
                  />
                </div>

                <div>
                  <SizeLabel>Your Comment</SizeLabel>
                  <TextInput
                    textArea
                    rows={4}
                    placeholder="Tell others what you think about this product..."
                    value={newReview.comment}
                    handelChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>

                <Button
                  text="Submit Review"
                  isLoading={reviewLoading}
                  onClick={handleAddReview}
                  isDisabled={reviewLoading || !newReview.comment}
                />
              </ReviewForm>
            </ReviewContainer>
          </ReviewSection>

          <RelatedSection>
            <SectionTitle>You Might Also Like</SectionTitle>
            <ProductGrid>
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </ProductGrid>
          </RelatedSection>
        </>
      )}
    </Container>
  );
};

export default ProductDetails;
