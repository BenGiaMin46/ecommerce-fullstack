import React, { useState } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import { Avatar } from "@mui/material";
import { logout } from "../redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useDarkMode } from "../contexts/DarkModeContext";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";

const Nav = styled.div`
  background: ${({ theme }) => theme.white};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 50;
  color: ${({ theme }) => theme.text_primary};
`;
const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;
const NavLogo = styled(NavLink)`
  width: auto;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;
const Logo = styled.img`
  height: 36px;
`;
const NavItems = styled.ul`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 0 6px;
  list-style: none;
  @media screen and (max-width: 900px) {
    display: none;
  }
`;
const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  &:hover {
    color: ${({ theme }) => theme.text_secondary};
  }
  &.active {
    font-weight: 700;
  }
`;

const ButtonContainer = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;
const Mobileicons = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 80%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card};
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  border-radius: 0 0 0 20px;
  box-shadow: ${({ theme }) => theme.shadow_lg};
  border: 1px solid ${({ theme }) => theme.border};
  border-top: none;
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;
const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 12px 48px 12px 20px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 25px;
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  width: 260px;
  transition: all 0.3s ease;
  @media (max-width: 768px) {
    width: 200px;
  }
  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary};
  }
  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow_sm};
    width: 300px;
  }
`;

const SearchIconWrapper = styled.button`
  position: absolute;
  right: 16px;
  color: ${({ theme }) => theme.text_tertiary};
  cursor: pointer;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const CartBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -8px;
  min-width: 20px;
  height: 20px;
  background: ${({ theme }) => theme.error};
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DarkToggle = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow_md};
    transform: translateY(-1px);
  }
`;

const UserWrapper = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 180px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow_xl};
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  font-weight: 500;
  &:hover {
    background: ${({ theme }) => theme.bgLight};
    color: ${({ theme }) => theme.primary};
  }
`;

  const Navbar = ({ setOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserOpen, setIsUserOpen] = useState(false);
  const cartCount = 0;

  return (
    <Nav>
      <NavbarContainer>
        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuIcon sx={{ fontSize: 24 }} />
        </MobileIcon>

        <NavLogo to="/">
          <Logo src={LogoImg} />
        </NavLogo>

        <NavItems>
          <Navlink to="/">Home</Navlink>
          <Navlink to="/about">About</Navlink>
          <Navlink to="/shop">Products</Navlink>
          <Navlink to="/policy">Policy</Navlink>
          <Navlink to="/promotion">Promotions</Navlink>
          <Navlink to="/news">News</Navlink>
          <Navlink to="/contact">Contact</Navlink>
        </NavItems>

        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <Navlink to="/" onClick={() => setIsOpen(!isOpen)}>
              Home
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/about">
              About
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/shop">
              Products
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/policy">
              Policy
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/promotion">
              Promotions
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/news">
              News
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/contact">
              Contact
            </Navlink>
            {currentUser ? (
              <Button text="Logout" small onClick={() => dispatch(logout())} />
            ) : (
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <Button
                  text="Sign In"
                  small
                  onClick={() => {
                    setOpenAuth(true);
                    setIsOpen(false);
                  }}
                />
              </div>
            )}
          </MobileMenu>
        )}

        <Mobileicons>
          <SearchWrapper style={{ width: '180px' }}>
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/shop?q=${searchQuery}`)}
            />
          </SearchWrapper>
          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <FavoriteBorderIcon sx={{ fontSize: 24 }} />
              </Navlink>
              <Navlink to="/cart" style={{ position: 'relative' }}>
                <ShoppingBagIcon sx={{ fontSize: 24 }} />
                {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
              </Navlink>
              <UserWrapper onClick={() => setIsUserOpen(!isUserOpen)}>
                {currentUser?.img ? (
                  <Avatar src={currentUser.img} sx={{ width: 30, height: 30 }} />
                ) : (
                  <PersonIcon sx={{ fontSize: 24 }} />
                )}
              </UserWrapper>
              <DarkToggle onClick={toggleDarkMode}>
                {isDark ? <WbSunnyIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
              </DarkToggle>
            </>
          ) : (
            <Button
              text="Sign In"
              small
              onClick={() => setOpenAuth(true)}
            />
          )}
        </Mobileicons>

        <ButtonContainer>
          <SearchWrapper>
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  navigate(`/shop?q=${searchQuery}`);
                  setSearchQuery('');
                }
              }}
            />
            <SearchIconWrapper onClick={() => searchQuery && navigate(`/shop?q=${searchQuery}`)}>
              <SearchIcon sx={{ fontSize: 20 }} />
            </SearchIconWrapper>
          </SearchWrapper>
          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <FavoriteBorderIcon sx={{ fontSize: 24 }} />
              </Navlink>
              <Navlink to="/cart" style={{ position: 'relative' }}>
                <ShoppingBagIcon sx={{ fontSize: 24 }} />
                {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
              </Navlink>
              <UserWrapper onClick={() => setIsUserOpen(!isUserOpen)}>
                {currentUser?.img ? (
                  <Avatar src={currentUser.img} sx={{ width: 34, height: 34 }} />
                ) : (
                  <PersonIcon sx={{ fontSize: 24 }} />
                )}
                {isUserOpen && (
                  <UserDropdown className="show">
                    <DropdownItem onClick={() => { navigate("/profile"); setIsUserOpen(false); }}>Profile</DropdownItem>
                    {currentUser?.isAdmin && (
                      <DropdownItem onClick={() => { navigate("/admin/dashboard"); setIsUserOpen(false); }}>
                        Admin Portal
                      </DropdownItem>
                    )}
                    <DropdownItem onClick={() => { navigate("/orders"); setIsUserOpen(false); }}>My Orders</DropdownItem>
                    <DropdownItem onClick={() => dispatch(logout())}>
                      Logout
                    </DropdownItem>
                  </UserDropdown>
                )}
              </UserWrapper>
              <DarkToggle onClick={toggleDarkMode}>
                {isDark ? <WbSunnyIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
              </DarkToggle>
            </>
          ) : (
            <Button
              text="Sign In"
              small
              onClick={() => setOpenAuth(true)}
            />
          )}
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
