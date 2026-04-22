import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Rating } from "@mui/material";
import styled from "styled-components";
import AddShoppingCartOutlined from "@mui/icons-material/AddShoppingCartOutlined";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import {
  addToCart,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
} from "../../api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";

const Card = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.card};
  overflow: hidden;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.text_secondary};
  }
`;
const Image = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.03);
  }
  
  @media (max-width: 600px) {
    height: 200px;
  }
`;
const Menu = styled.div`
  position: absolute;
  z-index: 10;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;

const Top = styled.div`
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${Card}:hover &::after {
    opacity: 1;
  }
`;
const MenuItem = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    background: ${({ theme }) => theme.text_primary};
    color: ${({ theme }) => theme.white};
    border-color: ${({ theme }) => theme.text_primary};
  }
`;

const Rate = styled.div`
  position: absolute;
  z-index: 10;
  bottom: 12px;
  left: 12px;
  padding: 6px 10px;
  background: ${({ theme }) => theme.white};
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.border};
`;

const OutOfStockOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #f44336;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Details = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: column;
  padding: 16px;
  background: ${({ theme }) => theme.card};
`;
const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const Desc = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-top: 4px;
`;
const Span = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_tertiary};
  text-decoration: line-through;
`;
const Percent = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  background: ${({ theme }) => theme.text_primary};
  padding: 2px 6px;
  margin-left: auto;
`;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const addFavorite = async (e) => {
    e.stopPropagation();
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await addToFavourite(token, { productID: product?._id })
      .then((res) => {
        setFavorite(true);
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: "Added to favorites!",
            severity: "success",
          })
        );
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };
  
  const removeFavorite = async (e) => {
    e.stopPropagation();
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await deleteFromFavourite(token, { productID: product?._id })
      .then((res) => {
        setFavorite(false);
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: "Removed from favorites",
            severity: "info",
          })
        );
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };
  
  const addCart = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: product?._id, quantity: 1 })
      .then((res) => {
        dispatch(
          openSnackbar({
            message: "Added to cart!",
            severity: "success",
          })
        );
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };
  
  const checkFavourite = useCallback(async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    if (!token) {
      setFavoriteLoading(false);
      return;
    }
    await getFavourite(token, { productId: product?._id })
      .then((res) => {
        const isFavorite = res.data?.some(
          (favorite) => favorite._id === product?._id
        );
        setFavorite(isFavorite);
        setFavoriteLoading(false);
      })
      .catch(() => {
        setFavoriteLoading(false);
      });
  }, [product?._id]);

  useEffect(() => {
    checkFavourite();
  }, [checkFavourite]);
  
  return (
    <Card onClick={() => navigate(`/shop/${product._id}`)}>
      <Top>
        <Image src={product?.img} loading="lazy" />
        <Menu>
          <MenuItem
            onClick={(e) => (favorite ? removeFavorite(e) : addFavorite(e))}
          >
            {favoriteLoading ? (
              <CircularProgress size={20} sx={{ color: 'inherit' }} />
            ) : (
              <>
                {favorite ? (
                  <FavoriteRounded sx={{ fontSize: "20px", color: "#ef4444" }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: "20px", color: "inherit" }} />
                )}
              </>
            )}
          </MenuItem>
          <MenuItem onClick={addCart}>
            <AddShoppingCartOutlined sx={{ fontSize: "20px", color: "inherit" }} />
          </MenuItem>
        </Menu>
        <Rate>
          <Rating value={product?.avgRating || 0} size="small" readOnly sx={{ mr: 0.5 }} precision={0.5} />
          {product?.avgRating?.toFixed(1) || "0.0"}
        </Rate>
        {product?.stock === 0 && (
          <OutOfStockOverlay>Out of Stock</OutOfStockOverlay>
        )}
      </Top>
      <Details>
        <Title>{product?.title}</Title>
        <Desc>{product?.name}</Desc>
        <Price>
          ${product?.price?.org} <Span>${product?.price?.mrp}</Span>
          <Percent>{product?.price?.off}% OFF</Percent>
        </Price>
      </Details>
    </Card>
  );
};

export default ProductCard;
