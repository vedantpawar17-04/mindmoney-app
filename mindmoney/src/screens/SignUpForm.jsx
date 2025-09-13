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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grow,
  Slide,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./SignUpForm.css";

export default function SignUpForm() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [snack, setSnack] = useState({ open: false, type: "", message: "" });
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("emailField")?.focus();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  }

  function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !validateEmail(form.email)) {
      return setSnack({ open: true, type: "error", message: "Enter a valid email." });
    }
    if (!form.username || form.username.length < 4) {
      return setSnack({ open: true, type: "error", message: "Username must be at least 4 characters." });
    }
    if (passwordStrength < 100) {
      return setSnack({ open: true, type: "error", message: "Password is not strong enough." });
    }
    if (form.password !== form.confirmPassword) {
      return setSnack({ open: true, type: "error", message: "Passwords do not match." });
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Email already in use") {
          setOpenDialog(true);
        } else {
          setSnack({ open: true, type: "error", message: data.message || "Signup failed" });
        }
        return;
      }

      setSnack({ open: true, type: "success", message: "Welcome MindMoney 💚" });
      setTimeout(() => {
        navigate("/dashboard", { state: { username: form.username, email: form.email } });
      }, 4000);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, type: "error", message: "Server not responding" });
    }
  }

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow ref={ref} {...props} timeout={400} />;
  });

  return (
    <Box className="signup-container">
      <Card className="signup-card">
        <CardContent>
          <Typography variant="h5" gutterBottom className="signup-title">
            🧠 MindMoney
          </Typography>
          <Typography variant="subtitle1" gutterBottom className="signup-subtitle">
            Balance Your Mind, Grow Your Money 💚
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <TextField
              id="emailField"
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={handleChange}
              helperText="Enter a valid email address"
              InputProps={{
                endAdornment: form.email && (
                  <InputAdornment position="end">
                    {validateEmail(form.email) ? <CheckCircle color="success" /> : <Cancel color="error" />}
                  </InputAdornment>
                ),
              }}
            />

            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={form.username}
              onChange={handleChange}
              helperText="Use a unique username (min 4 chars)"
              InputProps={{
                endAdornment: form.username && (
                  <InputAdornment position="end">
                    {form.username.length >= 4 ? <CheckCircle color="success" /> : <Cancel color="error" />}
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={form.password}
              onChange={handleChange}
              helperText="Must be 8+ chars with uppercase, number & symbol"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {form.password && (
              <Box className="password-strength">
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  className="password-strength-bar"
                  sx={{
                    "& .MuiLinearProgress-bar": {
                      bgcolor:
                        passwordStrength < 50 ? "red" : passwordStrength < 75 ? "orange" : "green",
                    },
                  }}
                />
                <Typography className="password-strength-label">
                  {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                </Typography>
              </Box>
            )}

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={form.confirmPassword}
              onChange={handleChange}
              helperText="Re-enter your password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit */}
            <Button type="submit" fullWidth variant="contained" className="signup-button">
              SIGN UP
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{ className: "signup-dialog" }}
      >
        <DialogTitle className="signup-dialog-title">🚨 Email Already Registered</DialogTitle>
        <DialogContent>
          <Typography className="signup-dialog-content">
            This email is already registered in our system.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => {
              setOpenDialog(false);
              navigate("/login");
            }}
            variant="contained"
            className="signup-dialog-button"
          >
            GO TO LOGIN
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snack.open && (
        <Slide direction="left" in={snack.open} mountOnEnter unmountOnExit>
          <Box className={`snackbar ${snack.type === "success" ? "snackbar-success" : "snackbar-error"}`}>
            {snack.type === "success" && <CheckCircle style={{ color: "green", marginRight: 8 }} />}
            <Typography style={{ flexGrow: 1 }}>{snack.message}</Typography>
            <IconButton size="small" onClick={() => setSnack({ ...snack, open: false })}>
              ✖
            </IconButton>
          </Box>
        </Slide>
      )}
    </Box>
  );
}
