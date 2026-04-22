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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.5rem;
`;

const InfoTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 2rem;
`;

const FormTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text_primary};
  text-transform: uppercase;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.white};
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.text_secondary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.white};
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  outline: none;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    border-color: ${({ theme }) => theme.text_secondary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary};
  }
`;

const SubmitButton = styled.button`
  padding: 14px 24px;
  background: ${({ theme }) => theme.text_primary};
  color: ${({ theme }) => theme.white};
  border: none;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for contacting us! We will respond within 24 hours.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Container>
      <Title>Contact Us</Title>
      
      <ContactGrid>
        <ContactInfo>
          <InfoCard>
            <InfoTitle>Address</InfoTitle>
            <InfoText>
              123 Nguyen Van Linh, District 7<br />
              Ho Chi Minh City, Vietnam
            </InfoText>
          </InfoCard>
          
          <InfoCard>
            <InfoTitle>Email</InfoTitle>
            <InfoText>
              support@dark5store.com<br />
              sales@dark5store.com
            </InfoText>
          </InfoCard>
          
          <InfoCard>
            <InfoTitle>Hotline</InfoTitle>
            <InfoText>
              1900 1234 (8:00 - 21:00)<br />
              24/7 Support via email
            </InfoText>
          </InfoCard>
        </ContactInfo>
        
        <FormContainer>
          <FormTitle>Send Message</FormTitle>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <TextArea
              placeholder="Message content..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
            <SubmitButton type="submit">
              Send Message
            </SubmitButton>
          </Form>
        </FormContainer>
      </ContactGrid>
    </Container>
  );
};

export default Contact;
