import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { requestPasswordReset } from "../api";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { useDispatch } from "react-redux";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Container = styled.div`
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
  background: ${({ theme }) => theme.primary_gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_secondary};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(-3px);
  }
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.success}15;
  color: ${({ theme }) => theme.success};
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.success}30;
  
  svg {
    font-size: 48px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.success};
  }
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.error}20;
  color: ${({ theme }) => theme.error};
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.error}40;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text_tertiary};
  margin: 0;
  line-height: 1.5;
`;

const ForgotPassword = ({ setOpenAuth, switchMode }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    setLoading(true);
    
    try {
      await requestPasswordReset({ email });
      
      setIsSuccess(true);
      dispatch(
        openSnackbar({
          message: "Password reset link sent to your email! 📧",
          severity: "success",
        })
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send reset link. Please try again.";
      
      if (err.response?.status === 404) {
        setErrors({ email: "No account found with this email address." });
      } else {
        setErrors({ general: errorMessage });
      }
      
      dispatch(
        openSnackbar({
          message: errorMessage,
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Container>
        <BackButton onClick={() => switchMode("signin")}>
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          Back to Sign In
        </BackButton>
        
        <SuccessMessage>
          <CheckCircleIcon />
          <h3>Check Your Email</h3>
          <p>
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
        </SuccessMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => switchMode("signin")}>
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        Back to Sign In
      </BackButton>
      
      <Header>
        <Title>Reset Password</Title>
        <Subtitle>Enter your email to receive a reset link</Subtitle>
      </Header>
      
      <Form>
        {errors.general && (
          <ErrorMessage>
            <EmailIcon sx={{ fontSize: 18 }} />
            {errors.general}
          </ErrorMessage>
        )}
        
        <TextInput
          label="Email Address"
          placeholder="Enter your registered email"
          value={email}
          handelChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          error={errors.email}
        />
        
        <InfoText>
          We'll send you a secure link to reset your password. 
          The link will expire in 1 hour for security reasons.
        </InfoText>
        
        <Button
          text="Send Reset Link"
          onClick={handleSubmit}
          isLoading={loading}
          full
        />
      </Form>
    </Container>
  );
};

export default ForgotPassword;
