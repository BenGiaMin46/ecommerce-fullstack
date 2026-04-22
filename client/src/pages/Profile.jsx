import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, CircularProgress } from "@mui/material";
import { getUserInfo, updateUserInfo } from "../api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const Container = styled.div`
  padding: 40px 30px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  display: flex;
  justify-content: center;
`;

const Section = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-shadow: ${({ theme }) => theme.shadow_md};
`;

const UserAvatar = styled(Avatar)`
  width: 120px !important;
  height: 120px !important;
  box-shadow: ${({ theme }) => theme.shadow_lg};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const UserEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 15px;
`;

const Form = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: -12px;
`;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    img: "",
  });
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("krist-app-token");
      const res = await getUserInfo(token);
      setUser(res.data);
      setFormData({
        name: res.data.name,
        img: res.data.img || "",
      });
    } catch (err) {
      dispatch(openSnackbar({ message: "Failed to fetch profile", severity: "error" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("krist-app-token");
      const res = await updateUserInfo(token, formData);
      setUser(res.data.user);
      dispatch(openSnackbar({ message: res.data.message, severity: "success" }));
    } catch (err) {
      dispatch(openSnackbar({ message: err.response?.data?.message || err.message, severity: "error" }));
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <ProfileCard>
          <UserAvatar src={user?.img} alt={user?.name}>
            {!user?.img && <PersonIcon sx={{ fontSize: 60 }} />}
          </UserAvatar>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserEmail>
              <EmailIcon sx={{ fontSize: 18 }} />
              {user?.email}
            </UserEmail>
          </UserInfo>
          
          <Form>
            <Label>Display Name</Label>
            <TextInput
              placeholder="Your Full Name"
              value={formData.name}
              handelChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Label>Avatar URL</Label>
            <TextInput
              placeholder="https://example.com/image.png"
              value={formData.img}
              handelChange={(e) => setFormData({ ...formData, img: e.target.value })}
            />
            <Button
              text="Update Profile"
              onClick={handleUpdate}
              isLoading={btnLoading}
              isDisabled={btnLoading}
              full
            />
          </Form>
        </ProfileCard>
      </Section>
    </Container>
  );
};

export default Profile;
