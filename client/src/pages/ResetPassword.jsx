import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { verifyResetToken, resetPassword } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${({ theme }) => theme.bg};
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.card};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: ${({ theme }) => theme.shadow_xl};
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text_primary};
  background: ${({ theme }) => theme.primary_gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 30px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.error}20;
  color: ${({ theme }) => theme.error};
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.error}40;
  margin-bottom: 10px;
  
  svg {
    font-size: 24px;
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.success}15;
  color: ${({ theme }) => theme.success};
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.success}30;
  margin-bottom: 10px;
  
  svg {
    font-size: 24px;
    flex-shrink: 0;
  }
`;

const PasswordRequirements = styled.div`
  background: ${({ theme }) => theme.bgLight};
  padding: 16px;
  border-radius: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 10px;
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

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid ${({ theme }) => theme.border};
    border-top-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordStrength = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setErrors({ general: "Invalid reset link. Please request a new one." });
      return;
    }
    
    const verifyToken = async () => {
      try {
        const res = await verifyResetToken(token);
        setIsValid(true);
        setEmail(res.data.email);
      } catch (err) {
        setIsValid(false);
        setErrors({ 
          general: err.response?.data?.message || "This reset link has expired or is invalid. Please request a new one." 
        });
      } finally {
        setVerifying(false);
      }
    };
    
    verifyToken();
  }, [token]);

  const validateInputs = () => {
    const newErrors = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    
    try {
      const res = await resetPassword(token, { password });
      
      // Auto-login user
      localStorage.setItem("krist-app-token", res.data.token);
      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
      
      setIsSuccess(true);
      dispatch(
        openSnackbar({
          message: "Password reset successful! Welcome back! 🎉",
          severity: "success",
        })
      );
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
      setErrors({ general: errorMessage });
      
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
    if (passwordStrength <= 2) return '#ef4444';
    if (passwordStrength <= 3) return '#f59e0b';
    if (passwordStrength <= 4) return '#10b981';
    return '#00d2d3';
  };

  if (verifying) {
    return (
      <Container>
        <Card>
          <LoadingState>
            <div className="spinner" />
            <p>Verifying your reset link...</p>
          </LoadingState>
        </Card>
      </Container>
    );
  }

  if (!isValid && errors.general) {
    return (
      <Container>
        <Card>
          <ErrorMessage>
            <ErrorIcon />
            {errors.general}
          </ErrorMessage>
          <Button
            text="Go to Login"
            onClick={() => navigate("/")}
            full
          />
        </Card>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container>
        <Card>
          <SuccessMessage>
            <CheckCircleIcon />
            <div>
              <strong>Password Reset Successful!</strong>
              <p style={{ margin: '8px 0 0 0' }}>
                Your password has been updated. Redirecting you to the home page...
              </p>
            </div>
          </SuccessMessage>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Reset Password</Title>
        <Subtitle>
          {email ? `For account: ${email}` : "Enter your new password below"}
        </Subtitle>
        
        <Form>
          {errors.general && (
            <ErrorMessage>
              <ErrorIcon />
              {errors.general}
            </ErrorMessage>
          )}
          
          <TextInput
            label="New Password"
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
          
          <Button
            text="Reset Password"
            onClick={handleSubmit}
            isLoading={loading}
            full
          />
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPassword;
