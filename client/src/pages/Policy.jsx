import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: calc(100vh - 70px);
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: ${({ theme }) => theme.white};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.text_primary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PolicyNav = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 3rem;
`;

const NavTab = styled.button`
  padding: 1rem 0;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? props.theme.text_primary : props.theme.text_secondary};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.text_primary};
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.text_primary};
  }
`;

const Content = styled.div`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.text_secondary};
`;

const PolicySection = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    margin-bottom: 1rem;
    margin-top: 2rem;
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const policies = [
  {
    id: "return",
    name: "Returns",
    content: (
      <PolicySection>
        <h3>Return Policy</h3>
        <p>You can return products within 7 days of receiving your order.</p>
        <ul>
          <li>Products must have original tags/labels and be unused</li>
          <li>A receipt or order ID is required</li>
          <li>Applicable for size or color exchanges only; no refunds</li>
          <li>Discounted products over 30% are not eligible for return</li>
        </ul>
        
        <h3>Return Process</h3>
        <ul>
          <li>Contact our hotline 1900 1234 to register your return</li>
          <li>Send the product to the provided address</li>
          <li>Receive your new product within 3-5 business days</li>
        </ul>
      </PolicySection>
    )
  },
  {
    id: "shipping",
    name: "Shipping",
    content: (
      <PolicySection>
        <h3>Shipping Policy</h3>
        <p>Free shipping on nationwide orders over 500,000 VND.</p>
        <ul>
          <li>HCM City: 1-2 business days</li>
          <li>Southern Provinces: 2-3 business days</li>
          <li>Northern and Central Provinces: 3-5 business days</li>
        </ul>
        
        <h3>Shipping Fee</h3>
        <ul>
          <li>Orders under 500,000 VND: 30,000 VND</li>
          <li>Orders over 500,000 VND: Free</li>
        </ul>
      </PolicySection>
    )
  },
  {
    id: "warranty",
    name: "Warranty",
    content: (
      <PolicySection>
        <h3>Warranty Policy</h3>
        <p>30-day warranty from the date of purchase for manufacturing defects.</p>
        <ul>
          <li>Seam defects, missing buttons, or snap failures</li>
          <li>Abnormal fading (not caused by washing)</li>
          <li>Products that don't match the description</li>
        </ul>
        
        <h3>Warranty Exclusions</h3>
        <ul>
          <li>Used, washed, or bleached products</li>
          <li>User-inflicted damage (tears, burns, wear)</li>
          <li>No purchase receipt</li>
        </ul>
      </PolicySection>
    )
  },
  {
    id: "payment",
    name: "Payment",
    content: (
      <PolicySection>
        <h3>Payment Methods</h3>
        <ul>
          <li>Cash on Delivery (COD)</li>
          <li>Bank transfer</li>
          <li>E-wallets: Momo, ZaloPay, VNPay</li>
          <li>Credit/Debit Cards: Visa, Mastercard, JCB</li>
        </ul>
        
        <h3>Transfer Information</h3>
        <p>Bank: Vietcombank</p>
        <p>Account Number: 1234567890</p>
        <p>Account Holder: KRIST CO., LTD</p>
        <p>Note: [Phone number] order payment</p>
      </PolicySection>
    )
  }
];

const Policy = () => {
  const [activeTab, setActiveTab] = useState("return");
  
  const activePolicy = policies.find(p => p.id === activeTab);

  return (
    <Container>
      <Title>Policies</Title>
      
      <PolicyNav>
        {policies.map(policy => (
          <NavTab 
            key={policy.id}
            active={activeTab === policy.id}
            onClick={() => setActiveTab(policy.id)}
          >
            {policy.name}
          </NavTab>
        ))}
      </PolicyNav>
      
      <Content>
        {activePolicy?.content}
      </Content>
    </Container>
  );
};

export default Policy;
