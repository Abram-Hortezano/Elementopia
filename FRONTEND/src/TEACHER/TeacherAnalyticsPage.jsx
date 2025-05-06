"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Button,
} from '@mui/material'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import Navbar from "../components/NavBar"
import Sidebar from "../components/Sidebar"

// Sample data for charts
const lineData = [
  { name: "0", pink: 300, green: 750 },
  { name: "1", pink: 300, green: 250 },
  { name: "2", pink: 100, green: 150 },
  { name: "3", pink: 350, green: 350 },
  { name: "4", pink: 900, green: 150 },
  { name: "5", pink: 280, green: 600 },
  { name: "6", pink: 150, green: 720 },
  { name: "7", pink: 780, green: 420 },
  { name: "8", pink: 750, green: 220 },
  { name: "9", pink: 100, green: 200 },
]

const pieData = [
  { name: "545", value: 545, color: "#d4a6b3" },
  { name: "226", value: 226, color: "#d4a6b3" },
  { name: "532", value: 532, color: "#d4a6b3" },
  { name: "622", value: 622, color: "#d4a6b3" },
  { name: "346", value: 346, color: "#d4a6b3" },
]

// Sample data for table
const tableData = [
  {
    id: 1,
    name: "Project Alpha",
    schedule: "Daily",
    col3: "Active",
    col4: "High",
    col5: 5,
    buttonText: "View Details",
  },
  {
    id: 2,
    name: "Project Beta",
    schedule: "Weekly",
    col3: "Pending",
    col4: "Medium",
    col5: 4,
    buttonText: "View Details",
  },
  {
    id: 3,
    name: "Project Gamma",
    schedule: "Monthly",
    col3: "Completed",
    col4: "Low",
    col5: 4,
    buttonText: "View Details",
  },
]

// CSS styles as objects
const styles = {
  // Add @import for the font in your index.html or CSS file:
  // @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    minHeight: "64px",
  },
  retroBox: {
    backgroundColor: "#000",
    color: "#fff",
    fontFamily: '"Press Start 2P", cursive',
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff",
    position: "relative",
    overflow: "hidden",
  },
  retroBoxBefore: {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #ff00ff, #00ffff)",
    boxShadow: "0 0 10px #ff00ff, 0 0 20px #00ffff",
    animation: "neon 1.5s infinite alternate",
  },
  retroBoxAfter: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #00ffff, #ff00ff)",
    boxShadow: "0 0 10px #00ffff, 0 0 20px #ff00ff",
    animation: "neon 1.5s infinite alternate",
  },
  retroTitle: {
    color: "#ff00ff",
    textShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff",
    fontWeight: "bold",
    marginBottom: "24px",
    letterSpacing: "2px",
    fontSize: "28px",
  },
  chartContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "32px",
    "@media (max-width: 960px)": {
      flexDirection: "column",
      gap: "24px",
    },
  },
  chartBox: {
    backgroundColor: "rgba(0, 10, 20, 0.7)",
    borderRadius: "8px",
    padding: "16px",
    border: "1px solid #00ffff",
    boxShadow: "0 0 10px #00ffff",
    height: "300px",
    width: "48%",
  },
  chartBoxMobile: {
    width: "100%",
  },
  laboratoryTitle: {
    color: "#00ffff",
    textShadow: "0 0 5px #00ffff",
    marginBottom: "16px",
    borderBottom: "1px solid #00ffff",
    paddingBottom: "8px",
  },
  tableContainer: {
    marginTop: "32px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "8px",
    border: "1px solid #00ffff",
    boxShadow: "0 0 10px #00ffff",
  },
  tableHead: {
    backgroundColor: "rgba(0, 30, 60, 0.8)",
  },
  tableHeadCell: {
    color: "#00ffff",
    textShadow: "0 0 5px #00ffff",
    fontWeight: "bold",
    borderBottom: "2px solid #00ffff",
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(0, 10, 30, 0.4)",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 255, 255, 0.1)",
    },
  },
  tableRowOdd: {
    backgroundColor: "rgba(0, 10, 30, 0.4)",
  },
  tableRowHover: {
    backgroundColor: "rgba(0, 255, 255, 0.1)",
  },
  tableCell: {
    color: "#fff",
    borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
  },
  retroButton: {
    border: "1px solid #ff00ff",
    color: "#ff00ff",
    textShadow: "0 0 5px #ff00ff",
    boxShadow: "0 0 5px #ff00ff",
  },
  retroButtonHover: {
    backgroundColor: "rgba(255, 0, 255, 0.2)",
    boxShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "rgba(0, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #00ffff",
    boxShadow: "0 0 5px #00ffff",
  },
  headingText: {
    color: "#fff",
    fontWeight: "bold",
  },
  captionText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  ratingStyles: {
    "& .MuiRating-iconFilled": {
      color: "#ffff00",
      filter: "drop-shadow(0 0 2px #ffff00)",
    },
    "& .MuiRating-iconEmpty": {
      color: "rgba(255, 255, 0, 0.3)",
    },
  },
  tooltipStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "1px solid #00ffff",
    color: "#fff",
    boxShadow: "0 0 10px #00ffff",
  },
  pieTooltipStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "1px solid #ff00ff",
    color: "#fff",
    boxShadow: "0 0 10px #ff00ff",
  },
  pieTooltipText: {
    color: "#fff",
    textShadow: "0 0 2px #ff00ff",
  },
}

// Custom label component for pie chart
const PieChartLabel = ({ name, x, y, dx, dy }) => {
  return (
    <text
      x={x}
      y={y}
      dx={dx}
      dy={dy}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ textShadow: "0 0 3px #fff, 0 0 5px #ff00ff" }}
    >
      {name}
    </text>
  )
}

const TeacherAnalyticsPage = () => {
  const [open, setOpen] = useState(false) // Sidebar state

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)

  // For responsive design
  const isMobile = window.innerWidth < 960

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar with dynamic width */}
      <Navbar open={open} />

      {/* Sidebar with control props */}
      <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin 0.3s ease",
          marginLeft: open ? "180px" : "60px",
        }}
      >
        <div style={styles.drawerHeader} />

        {/* Retro Analytics Box */}
        <div style={styles.retroBox}>
          {/* Top border effect */}
          <div style={styles.retroBoxBefore}></div>

          {/* Title */}
          <Typography variant="h4" style={styles.retroTitle}>
            ANALYTICS
          </Typography>

          {/* Charts Container */}
          <div
            style={{
              ...styles.chartContainer,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            {/* Line Chart */}
            <div
              style={{
                ...styles.chartBox,
                width: isMobile ? "100%" : "48%",
                marginBottom: isMobile ? "24px" : 0,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.2)" />
                  <XAxis dataKey="name" stroke="#00ffff" />
                  <YAxis stroke="#00ffff" domain={[0, 1000]} />
                  <Tooltip contentStyle={styles.tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="pink"
                    stroke="#ff00ff"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: "#ff00ff", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="green"
                    stroke="#00ff00"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: "#00ff00", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div
              style={{
                ...styles.chartBox,
                width: isMobile ? "100%" : "48%",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={0}
                    dataKey="value"
                    label={PieChartLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={styles.pieTooltipStyle}
                    formatter={(value, name) => [
                      <span key="value" style={{ color: "#fff" }}>
                        {value}
                      </span>,
                      <span key="name" style={{ color: "#fff" }}>
                        {name}
                      </span>,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Laboratory Section */}
          <Typography variant="h6" style={styles.laboratoryTitle}>
            Laboratory
          </Typography>

          {/* Table */}
          <TableContainer component={Paper} style={styles.tableContainer}>
            <Table>
              <TableHead style={styles.tableHead}>
                <TableRow>
                  <TableCell style={styles.tableHeadCell}>Name</TableCell>
                  <TableCell style={styles.tableHeadCell}>Schedule</TableCell>
                  <TableCell style={styles.tableHeadCell}>Column 3</TableCell>
                  <TableCell style={styles.tableHeadCell}>Column 4</TableCell>
                  <TableCell style={styles.tableHeadCell}>Column 5</TableCell>
                  <TableCell style={styles.tableHeadCell} align="right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={row.id} style={index % 2 === 0 ? styles.tableRowOdd : {}} hover>
                    <TableCell style={styles.tableCell}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <div style={styles.iconContainer}>
                          <Typography variant="body2" sx={{ color: "#00ffff" }}>
                            {row.id}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="subtitle2" style={styles.headingText}>
                            Heading
                          </Typography>
                          <Typography variant="caption" style={styles.captionText}>
                            Caption text
                          </Typography>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      <Typography variant="subtitle2" style={styles.headingText}>
                        Heading
                      </Typography>
                      <Typography variant="caption" style={styles.captionText}>
                        Caption text
                      </Typography>
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      <Typography variant="subtitle2" style={styles.headingText}>
                        Heading
                      </Typography>
                      <Typography variant="caption" style={styles.captionText}>
                        Caption text
                      </Typography>
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      <Typography variant="subtitle2" style={styles.headingText}>
                        Heading
                      </Typography>
                      <Typography variant="caption" style={styles.captionText}>
                        Caption text
                      </Typography>
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Rating value={row.col5} readOnly sx={styles.ratingStyles} />
                        <Typography variant="caption" style={styles.captionText}>
                          Caption text
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell style={styles.tableCell} align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        style={styles.retroButton}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 0, 255, 0.2)"
                          e.currentTarget.style.boxShadow = "0 0 10px #ff00ff, 0 0 20px #ff00ff"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = ""
                          e.currentTarget.style.boxShadow = "0 0 5px #ff00ff"
                        }}
                      >
                        Button text
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Bottom border effect */}
          <div style={styles.retroBoxAfter}></div>
        </div>
      </Box>
    </Box>
  )
}

export default TeacherAnalyticsPage