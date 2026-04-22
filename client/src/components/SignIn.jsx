import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignIn } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

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

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${({ theme }) => theme.primary};
    cursor: pointer;
  }
`;

const SignIn = ({ setOpenAuth }) => {
  const dispatch = useDispatch();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateInputs = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;
    
    setButtonLoading(true);
    
    try {
      const res = await UserSignIn({ email, password });
      
      // Save token to localStorage
      localStorage.setItem("krist-app-token", res.data.token);
      
      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem("krist-remember-email", email);
      } else {
        localStorage.removeItem("krist-remember-email");
      }
      
      dispatch(loginSuccess(res.data));
      dispatch(
        openSnackbar({
          message: "Welcome back! 👋",
          severity: "success",
        })
      );
      
      setOpenAuth(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      
      if (err.response?.status === 404) {
        setErrors({ general: "Account not found. Please check your email or sign up." });
      } else if (err.response?.status === 403) {
        setErrors({ general: "Incorrect password. Please try again." });
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
      setButtonLoading(false);
    }
  };

  // Load remembered email on mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("krist-remember-email");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <Container>
      <Header>
        <Title>Sign In</Title>
        <Subtitle>Welcome back! Please enter your details.</Subtitle>
      </Header>
      
      <Form>
        {errors.general && (
          <ErrorMessage>
            <LockIcon sx={{ fontSize: 18 }} />
            {errors.general}
          </ErrorMessage>
        )}
        
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
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: null });
          }}
          error={errors.password}
        />

        <RememberForgot>
          <RememberMe>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </RememberMe>
        </RememberForgot>
        
        <Button
          text="Sign In"
          onClick={handleSignIn}
          isLoading={buttonLoading}
          full
          leftIcon={<EmailIcon sx={{ fontSize: 20 }} />}
        />
      </Form>
    </Container>
  );
};

export default SignIn;
