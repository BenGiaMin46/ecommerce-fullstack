import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.glass_bg};
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text_secondary};
  padding: 4rem 2rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary_gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FooterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.5rem;
`;

const FooterLink = styled(NavLink)`
  color: ${({ theme }) => theme.text_secondary};
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(4px);
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 0.95rem;
  line-height: 1.7;
`;

const Newsletter = styled.div`
  display: flex;
  gap: 0.5rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  outline: none;
  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary};
  }
`;

const SubscribeBtn = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary_gradient};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow_lg};
  }
`;

const Socials = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 50%;
  color: ${({ theme }) => theme.text_secondary};
  transition: all 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadow_md};
  }
`;

const BottomBar = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  color: ${({ theme }) => theme.text_tertiary};
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: inline-flex;
  gap: 0.9rem;
  margin-left: 0.5rem;
  flex-wrap: wrap;
`;

const LegalLink = styled.a`
  color: ${({ theme }) => theme.text_tertiary};
  text-decoration: none;
  transition: color 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo>Ecom Pro</Logo>
          <FooterText>
            Your trusted partner for a premium shopping experience with fast
            delivery and secure payments.
          </FooterText>
          <Socials>
            <SocialIcon href="#"><FacebookIcon sx={{ fontSize: 20 }} /></SocialIcon>
            <SocialIcon href="#"><TwitterIcon sx={{ fontSize: 20 }} /></SocialIcon>
            <SocialIcon href="#"><InstagramIcon sx={{ fontSize: 20 }} /></SocialIcon>
            <SocialIcon href="#"><YouTubeIcon sx={{ fontSize: 20 }} /></SocialIcon>
          </Socials>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/shop">Shop</FooterLink>
          <FooterLink to="/favorite">Wishlist</FooterLink>
          <FooterLink to="/cart">Cart</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Customer Care</FooterTitle>
          <FooterText>Help Center</FooterText>
          <FooterText>Track Order</FooterText>
          <FooterText>Returns & Refunds</FooterText>
          <FooterText>Contact Us</FooterText>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Newsletter</FooterTitle>
          <FooterText>Stay updated with latest offers and launches.</FooterText>
          <Newsletter>
            <NewsletterInput placeholder="Enter your email" />
            <SubscribeBtn>Subscribe</SubscribeBtn>
          </Newsletter>
        </FooterSection>
      </FooterContent>
      <BottomBar>
        © 2026 Ecom Pro. All rights reserved.
        <LegalLinks>
          <LegalLink href="#">Privacy Policy</LegalLink>
          <LegalLink href="#">Terms of Service</LegalLink>
        </LegalLinks>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;
