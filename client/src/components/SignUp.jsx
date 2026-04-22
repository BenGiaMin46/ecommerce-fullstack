import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignUp } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import LockIcon from "@mui/icons-material/Lock";
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

const PasswordRequirements = styled.div`
  background: ${({ theme }) => theme.bgLight};
  padding: 16px;
  border-radius: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
  color: ${({ met, theme }) => met ? theme.success : theme.text_tertiary};
  transition: color 0.3s ease;
  
  svg {
    font-size: 16px;
    color: ${({ met, theme }) => met ? theme.success : theme.text_tertiary};
  }
`;

const SignUp = ({ setOpenAuth }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordStrength = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateInputs = () => {
    const newErrors = {};
    
    if (!name || name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 3) {
      newErrors.password = "Password is too weak. Add more variety.";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    
    try {
      const res = await UserSignUp({ name, email, password });
      
      // Save token to localStorage
      localStorage.setItem("krist-app-token", res.data.token);
      
      dispatch(loginSuccess(res.data));
      dispatch(
        openSnackbar({
          message: "Welcome! Your account has been created. 🎉",
          severity: "success",
        })
      );
      
      setOpenAuth(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Sign up failed. Please try again.";
      
      if (err.response?.status === 409) {
        setErrors({ email: "This email is already registered. Please sign in instead." });
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

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return '#ef4444'; // weak - red
    if (passwordStrength <= 3) return '#f59e0b'; // medium - orange
    if (passwordStrength <= 4) return '#10b981'; // strong - green
    return '#00d2d3'; // very strong - cyan
  };

  return (
    <Container>
      <Header>
        <Title>Create Account</Title>
        <Subtitle>Join us today! Please fill in your details.</Subtitle>
      </Header>
      
      <Form>
        {errors.general && (
          <ErrorMessage>
            <LockIcon sx={{ fontSize: 18 }} />
            {errors.general}
          </ErrorMessage>
        )}
        
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          handelChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          error={errors.name}
        />
        
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          error={errors.email}
        />
        
        <TextInput
          label="Password"
          placeholder="Create a strong password"
          password
          value={password}
          handelChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: null });
          }}
          error={errors.password}
        />
        
        {password && (
          <PasswordRequirements>
            <div style={{ 
              height: '4px', 
              background: '#e2e8f0', 
              borderRadius: '2px', 
              marginBottom: '12px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(passwordStrength / 5) * 100}%`,
                background: getStrengthColor(),
                borderRadius: '2px',
                transition: 'all 0.3s ease'
              }} />
            </div>
            <Requirement met={hasMinLength}>
              <CheckCircleIcon /> At least 8 characters
            </Requirement>
            <Requirement met={hasUpperCase}>
              <CheckCircleIcon /> One uppercase letter
            </Requirement>
            <Requirement met={hasLowerCase}>
              <CheckCircleIcon /> One lowercase letter
            </Requirement>
            <Requirement met={hasNumber}>
              <CheckCircleIcon /> One number
            </Requirement>
            <Requirement met={hasSpecialChar}>
              <CheckCircleIcon /> One special character
            </Requirement>
          </PasswordRequirements>
        )}
        
        <TextInput
          label="Confirm Password"
          placeholder="Confirm your password"
          password
          value={confirmPassword}
          handelChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
          }}
          error={errors.confirmPassword}
        />
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '14px',
          color: errors.terms ? '#ef4444' : 'inherit'
        }}>
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (errors.terms) setErrors({ ...errors, terms: null });
            }}
            style={{ accentColor: '#6366f1' }}
          />
          I agree to the Terms of Service and Privacy Policy
        </label>
        
        <Button
          text="Create Account"
          onClick={handleSignUp}
          isLoading={loading}
          full
        />
      </Form>
    </Container>
  );
};

export default SignUp;
