import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom"; // ✨ Added for navigation

const Navbar = ({ open }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate(); // ✨ For redirecting

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user"); // 🧹 Clear session
    navigate("/login"); // 🔀 Redirect to login page
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "#000000",
        zIndex: 1300,
        width: `calc(100% - ${open ? "180px" : "60px"})`,
        transition: "width 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* App Name */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            backgroundImage:
              "linear-gradient(to right, #714dff, #9c83ff, #e151ff, #fff759)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          ELEMENTOPIA
        </Typography>

        {/* Profile Avatar & Dropdown */}
        <IconButton onClick={handleMenuOpen} sx={{ color: "white" }}>
          <Avatar sx={{ bgcolor: "#714dff", width: 32, height: 32 }}>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>{" "}
          {/* ✨ Updated logout */}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
