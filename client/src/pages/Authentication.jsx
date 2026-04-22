import { Modal, Fade } from "@mui/material";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import LogoImage from "../utils/Images/Logo.png";
import AuthImage from "../utils/Images/AuthImage.png";
import CloseIcon from "@mui/icons-material/Close";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import ForgotPassword from "../components/ForgotPassword";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Container = styled.div`
  position: relative;
  width: 900px;
  max-width: 95vw;
  min-height: 600px;
  display: flex;
  background: ${({ theme }) => theme.glass_bg};
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid ${({ theme }) => theme.border};
  animation: ${slideIn} 0.5s ease-out;
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
  }
`;

const Left = styled.div`
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}20 0%, ${({ theme }) => theme.secondary}30 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${AuthImage});
    background-size: cover;
    background-position: center;
    opacity: 0.3;
    mix-blend-mode: overlay;
  }
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
`;

const WelcomeTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const WelcomeText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const FloatingCard = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ${float} 6s ease-in-out infinite;
  z-index: 1;
  
  p {
    color: white;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const Logo = styled.img`
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
  width: 120px;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
`;

const Right = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 50px 40px;
  gap: 20px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.card};
  
  @media screen and (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: rotate(90deg);
  }
`;

const AuthToggle = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 20px;
`;

const AuthToggleButton = styled.button`
  color: ${({ theme }) => theme.primary};
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 14px;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.secondary};
    transform: translateX(3px);
  }
`;

const Authentication = ({ openAuth, setOpenAuth }) => {
  const [authMode, setAuthMode] = useState("signin"); // signin, signup, forgot
  
  const switchMode = (mode) => {
    setAuthMode(mode);
  };
  
  return (
    <Modal 
      open={openAuth} 
      onClose={() => setOpenAuth(false)}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)'
      }}
    >
      <Fade in={openAuth}>
        <Container>
          <Left>
            <Logo src={LogoImage} />
            <LeftContent>
              <WelcomeTitle>
                {authMode === "signin" && "Welcome Back!"}
                {authMode === "signup" && "Join Us Today!"}
                {authMode === "forgot" && "Reset Password"}
              </WelcomeTitle>
              <WelcomeText>
                {authMode === "signin" && "Sign in to access your account, view orders, and continue shopping."}
                {authMode === "signup" && "Create an account to start shopping, track orders, and get exclusive deals."}
                {authMode === "forgot" && "Enter your email and we'll send you a link to reset your password."}
              </WelcomeText>
            </LeftContent>
            <FloatingCard>
              <p>Trusted by 50,000+ happy customers worldwide</p>
            </FloatingCard>
          </Left>
          <Right>
            <CloseButton onClick={() => setOpenAuth(false)}>
              <CloseIcon />
            </CloseButton>
            
            {authMode === "signin" && (
              <>
                <SignIn setOpenAuth={setOpenAuth} />
                <AuthToggle>
                  Don't have an account?
                  <AuthToggleButton onClick={() => switchMode("signup")}>
                    Sign Up
                  </AuthToggleButton>
                </AuthToggle>
                <AuthToggle>
                  <AuthToggleButton onClick={() => switchMode("forgot")}>
                    Forgot Password?
                  </AuthToggleButton>
                </AuthToggle>
              </>
            )}
            
            {authMode === "signup" && (
              <>
                <SignUp setOpenAuth={setOpenAuth} />
                <AuthToggle>
                  Already have an account?
                  <AuthToggleButton onClick={() => switchMode("signin")}>
                    Sign In
                  </AuthToggleButton>
                </AuthToggle>
              </>
            )}
            
            {authMode === "forgot" && (
              <>
                <ForgotPassword setOpenAuth={setOpenAuth} switchMode={switchMode} />
                <AuthToggle>
                  Remember your password?
                  <AuthToggleButton onClick={() => switchMode("signin")}>
                    Sign In
                  </AuthToggleButton>
                </AuthToggle>
              </>
            )}
          </Right>
        </Container>
      </Fade>
    </Modal>
  );
};

export default Authentication;
