import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [snack, setSnack] = useState({
    open: false,
    type: "",
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("loginEmailField")?.focus();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setSnack({
        open: true,
        type: "error",
        message: "Please enter email and password",
      });
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return setSnack({
          open: true,
          type: "error",
          message: data.message || "Login failed",
        });
      }

      // ✅ Login success
      setSnack({
        open: true,
        type: "success",
        message: "Login successful 🎉",
      });

      setTimeout(
        () => {
          navigate("/dashboard", {
            state: {
              username: data.username,
              email: form.email,
            },
          });
        },
        1000
      );
    } catch (err) {
      console.error(err);

      setSnack({
        open: true,
        type: "error",
        message: "Server not responding",
      });
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      className="login-bg"
    >
      {" "}
      <Card className="login-card">
        {" "}
        <CardContent>
          {" "}
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            {" "}
            🔐 Login to MindMoney{" "}
          </Typography>{" "}
          <Typography align="center" variant="subtitle1" gutterBottom>
            {" "}
            Welcome back ! Let’s balance mind & money 💚{" "}
          </Typography>{" "}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            {" "}
            {/* Email */}
            <TextField
              id="loginEmailField"
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={handleChange}
            />{" "}
            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={form.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {" "}
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {" "}
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>{" "}
                  </InputAdornment>
                ),
              }}
            />{" "}
            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-btn"
            >
              {" "}
              LOGIN{" "}
            </Button>{" "}
            {/* Forgot Password */}
            <Button
              fullWidth
              onClick={() => navigate("/forgot-password")}
              className="forgot-btn"
            >
              {" "}
              Forgot Password?{" "}
            </Button>{" "}
          </Box>{" "}
        </CardContent>{" "}
      </Card>{" "}
      {/* Snackbar */}
      {snack.open && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            bgcolor: snack.type === "success" ? "#e6f4ea" : "#fdecea",
            color: snack.type === "success" ? "#1e4620" : "#611a15",
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 280,
            zIndex: 9999,
          }}
        >
          {" "}
          <Typography
            sx={{
              flexGrow: 1,
            }}
          >
            {" "}
            {snack.message}
          </Typography>{" "}
          <IconButton
            size="small"
            onClick={() =>
              setSnack({
                ...snack,
                open: false,
              })
            }
          >
            {" "}
            ✖{" "}
          </IconButton>{" "}
        </Box>
      )}
    </Box>
  );
}
