import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  styled,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  CardActionArea,
  Alert,
  CircularProgress,
  Paper,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { 
  Lock, 
  LockOpen, 
  Science, 
  Visibility, 
  Info, 
  ExpandMore, 
  ExpandLess,
  Search,
  FilterList,
  Category,
  Close
} from "@mui/icons-material";
import compounds from "../Student Components/compound-elements.json";
import DiscoveryService from "../../services/DiscoveryService";
import UserService from "../../services/UserService";

// Styled components for the gaming theme
const DiscoveryPageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: { xs: "column", lg: "row" },
  gap: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: "#0a0a0f",
  background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
  minHeight: "80vh",
}));

const DiscoveryGrid = styled(Grid)(({ theme }) => ({
  flexGrow: 1,
}));

const CompoundCard = styled(Card)(({ theme, isSelected }) => ({
  backgroundColor: "rgba(20, 20, 35, 0.9)",
  color: "white",
  textAlign: "center",
  padding: theme.spacing(1.5),
  borderRadius: "12px",
  boxShadow: isSelected 
    ? "0 0 20px rgba(33, 150, 243, 0.6)" 
    : "0 4px 12px rgba(0, 0, 0, 0.4)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: isSelected 
    ? "2px solid #2196f3" 
    : "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  height: "100%",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(33, 150, 243, 0.4)",
    border: "1px solid rgba(33, 150, 243, 0.5)",
  },
  "&:active": {
    transform: "translateY(-2px)",
  }
}));

const CompoundTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "600",
  fontSize: "0.95rem",
  lineHeight: 1.2,
  color: "#e3f2fd",
  marginBottom: theme.spacing(1),
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const DetailsPanel = styled(Card)(({ theme }) => ({
  width: { xs: "100%", lg: 380 },
  minWidth: 300,
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  color: "white",
  borderRadius: "16px",
  border: "1px solid rgba(33, 150, 243, 0.3)",
  padding: theme.spacing(2.5),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  backdropFilter: "blur(20px)",
  position: { xs: "relative", lg: "sticky" },
  top: { xs: 0, lg: 20 },
  maxHeight: { xs: "auto", lg: "calc(100vh - 180px)" },
  overflow: "hidden",
}));

const PanelTitle = styled(Typography)(({ theme }) => ({
  color: "#4fc3f7",
  fontFamily: "'Inter', sans-serif",
  fontWeight: "700",
  fontSize: "1.5rem",
  marginBottom: theme.spacing(2),
  lineHeight: 1.3,
}));

const PanelContent = styled(Typography)(({ theme }) => ({
  fontFamily: "'Inter', sans-serif",
  lineHeight: 1.6,
  color: "#b0bec5",
  fontSize: "0.9rem",
  marginBottom: theme.spacing(2),
}));

const CategoryChip = styled(Chip)(({ theme, category }) => ({
  backgroundColor: category === "Inorganic" ? "rgba(33, 150, 243, 0.15)" : 
                  category === "Organic" ? "rgba(76, 175, 80, 0.15)" : 
                  category === "Acid" ? "rgba(244, 67, 54, 0.15)" :
                  category === "Base" ? "rgba(255, 152, 0, 0.15)" :
                  category === "Salt" ? "rgba(156, 39, 176, 0.15)" :
                  "rgba(158, 158, 158, 0.15)",
  color: category === "Inorganic" ? "#64b5f6" : 
         category === "Organic" ? "#81c784" : 
         category === "Acid" ? "#ef9a9a" :
         category === "Base" ? "#ffb74d" :
         category === "Salt" ? "#ba68c8" :
         "#bdbdbd",
  fontWeight: "600",
  fontSize: "0.7rem",
  height: "24px",
  padding: "0 8px",
  border: "none",
  "& .MuiChip-label": {
    padding: "0 4px",
  }
}));

const TeacherDiscovery = () => {
  const [discovered, setDiscovered] = useState([]);
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchUserDiscoveries = async () => {
      try {
        const currentUser = await UserService.getCurrentUser();

        if (currentUser?.userId) {
          const response = await DiscoveryService.getCurrentUserDiscoveries(currentUser.userId);
          const discoveryArray = response?.data || [];

          const validNames = discoveryArray
            .filter((item) => item.name && typeof item.name === "string")
            .map((item) => item.name.trim());

          setDiscovered(validNames);
        } else {
          console.error("No valid user ID found.");
        }
      } catch (error) {
        console.error("Error fetching discoveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDiscoveries();
  }, []);

  // For teacher view, mark all compounds as discovered
  const teacherDiscovered = [...new Set([
    ...discovered,
    ...compounds.map(c => c.NAME.trim())
  ])];

  const handleCardClick = (compound) => {
    setSelectedCompound(compound);
  };

  // Filter compounds based on search and category
  const filteredCompounds = compounds.filter(compound => {
    const matchesSearch = compound.NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         compound.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         compound.Elements?.some(el => el.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && compound.Category === categoryFilter;
  });

  // Group compounds by category for better organization
  const groupedCompounds = filteredCompounds.reduce((acc, compound) => {
    const category = compound.Category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(compound);
    return acc;
  }, {});

  // Get unique categories
  const categories = ["all", ...new Set(compounds.map(c => c.Category).filter(Boolean))];

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // For teacher preview, show first 6 compounds by default per category, then all when expanded
  const getDisplayCompounds = (compoundsList) => {
    return showAll ? compoundsList : compoundsList.slice(0, 8);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#4fc3f7' }} />
        <Typography sx={{ ml: 2, color: '#4fc3f7' }}>Loading discoveries...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Teacher Preview Banner */}
      <Paper
        elevation={0}
        sx={{ 
          mb: 4, 
          p: 2.5,
          bgcolor: 'rgba(20, 20, 35, 0.9)', 
          border: '1px solid rgba(33, 150, 243, 0.3)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1, 
            bgcolor: 'rgba(33, 150, 243, 0.2)', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Science sx={{ color: '#4fc3f7', fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: '#e3f2fd', fontWeight: '600', mb: 0.5 }}>
              Teacher Discovery Preview
            </Typography>
            <Typography variant="body2" sx={{ color: '#90a4ae', fontSize: '0.85rem' }}>
              All chemical compounds are unlocked for preview. Click any card for detailed information.
            </Typography>
          </Box>
          <Chip
            icon={<Visibility />}
            label="TEACHER VIEW"
            size="small"
            sx={{
              bgcolor: 'rgba(33, 150, 243, 0.2)',
              color: '#4fc3f7',
              fontWeight: '600',
              fontSize: '0.75rem',
              height: '32px',
            }}
          />
        </Box>
      </Paper>

      {/* Stats Dashboard - Compact */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(20, 20, 35, 0.8)', 
            borderRadius: '10px',
            border: '1px solid rgba(33, 150, 243, 0.2)',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ color: '#4fc3f7', fontWeight: '700', mb: 0.5 }}>
              {compounds.length}
            </Typography>
            <Typography variant="caption" sx={{ color: '#90a4ae', fontSize: '0.75rem' }}>
              Compounds
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(20, 20, 35, 0.8)', 
            borderRadius: '10px',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ color: '#81c784', fontWeight: '700', mb: 0.5 }}>
              {compounds.length}
            </Typography>
            <Typography variant="caption" sx={{ color: '#90a4ae', fontSize: '0.75rem' }}>
              Unlocked
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(20, 20, 35, 0.8)', 
            borderRadius: '10px',
            border: '1px solid rgba(156, 39, 176, 0.2)',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ color: '#ba68c8', fontWeight: '700', mb: 0.5 }}>
              {new Set(compounds.map(c => c.Category).filter(Boolean)).size}
            </Typography>
            <Typography variant="caption" sx={{ color: '#90a4ae', fontSize: '0.75rem' }}>
              Categories
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(20, 20, 35, 0.8)', 
            borderRadius: '10px',
            border: '1px solid rgba(255, 152, 0, 0.2)',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ color: '#ffb74d', fontWeight: '700', mb: 0.5 }}>
              100%
            </Typography>
            <Typography variant="caption" sx={{ color: '#90a4ae', fontSize: '0.75rem' }}>
              Complete
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Search and Filter Controls - Compact */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        bgcolor: 'rgba(20, 20, 35, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search compounds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#4fc3f7', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <Close sx={{ color: '#90a4ae', fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.9rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(33, 150, 243, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4fc3f7',
                    borderWidth: '1px',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: '#90a4ae', whiteSpace: 'nowrap', mr: 1 }}>
                <FilterList sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                Filter:
              </Typography>
              {categories.map(category => (
                <Chip
                  key={category}
                  label={category === "all" ? "All" : category}
                  onClick={() => setCategoryFilter(category)}
                  size="small"
                  sx={{
                    fontSize: '0.75rem',
                    height: '28px',
                    color: categoryFilter === category ? 'white' : '#b0bec5',
                    bgcolor: categoryFilter === category ? '#4fc3f7' : 'rgba(255, 255, 255, 0.07)',
                    '&:hover': {
                      bgcolor: categoryFilter === category ? '#29b6f6' : 'rgba(255, 255, 255, 0.12)',
                    },
                    margin: '2px',
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <DiscoveryPageContainer>
        {/* Compounds Grid - Better organized */}
        <Box sx={{ flex: 1 }}>
          {Object.entries(groupedCompounds).map(([category, compoundsList]) => {
            const displayCompounds = getDisplayCompounds(compoundsList);
            const isExpanded = expandedCategories[category] || showAll;
            
            return (
              <Box key={category} sx={{ mb: 3 }}>
                {/* Category Header */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2,
                  p: 1.5,
                  bgcolor: 'rgba(20, 20, 35, 0.6)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CategoryChip 
                      label={category} 
                      category={category}
                      size="small"
                    />
                    <Typography variant="subtitle1" sx={{ 
                      color: '#e3f2fd', 
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}>
                      {category} ({compoundsList.length})
                    </Typography>
                  </Box>
                  
                  {compoundsList.length > 8 && !showAll && (
                    <Button
                      size="small"
                      onClick={() => toggleCategory(category)}
                      endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                      sx={{
                        color: '#4fc3f7',
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        minWidth: 'auto',
                        padding: '2px 8px',
                        '&:hover': {
                          bgcolor: 'rgba(33, 150, 243, 0.1)',
                        }
                      }}
                    >
                      {isExpanded ? 'Show Less' : `Show All (${compoundsList.length})`}
                    </Button>
                  )}
                </Box>

                <Grid container spacing={2}>
                  {(isExpanded ? compoundsList : displayCompounds).map((compound, index) => {
                    const compoundName = compound.NAME.trim();
                    const isSelected = selectedCompound?.NAME === compound.NAME;

                    return (
                      <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                        <CompoundCard isSelected={isSelected}>
                          <CardActionArea onClick={() => handleCardClick(compound)} sx={{ height: '100%' }}>
                            <CardContent>
                              {/* Compound Name */}
                              <CompoundTitle>
                                {compoundName}
                              </CompoundTitle>

                              {/* Small Element Chips */}
                              {compound.Elements && compound.Elements.length > 0 && (
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                  justifyContent: 'center',
                                  mb: 1,
                                  minHeight: '24px'
                                }}>
                                  {compound.Elements.slice(0, 3).map((element, idx) => (
                                    <Chip
                                      key={idx}
                                      label={element}
                                      size="small"
                                      sx={{
                                        fontSize: '0.65rem',
                                        height: '20px',
                                        bgcolor: 'rgba(255, 152, 0, 0.15)',
                                        color: '#ffb74d',
                                        fontWeight: '500',
                                        '& .MuiChip-label': {
                                          padding: '0 6px',
                                        }
                                      }}
                                    />
                                  ))}
                                  {compound.Elements.length > 3 && (
                                    <Chip
                                      label={`+${compound.Elements.length - 3}`}
                                      size="small"
                                      sx={{
                                        fontSize: '0.6rem',
                                        height: '20px',
                                        bgcolor: 'rgba(158, 158, 158, 0.15)',
                                        color: '#bdbdbd',
                                        '& .MuiChip-label': {
                                          padding: '0 6px',
                                        }
                                      }}
                                    />
                                  )}
                                </Box>
                              )}

                              {/* Teacher Preview Badge */}
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mt: 1,
                                pt: 1,
                                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                              }}>
                                <Typography variant="caption" sx={{ 
                                  color: '#78909c', 
                                  fontSize: '0.65rem',
                                  display: 'flex', 
                                  alignItems: 'center',
                                  gap: 0.3
                                }}>
                                  <Visibility sx={{ fontSize: 12 }} />
                                  Preview
                                </Typography>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </CompoundCard>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            );
          })}

          {/* Show More/Less Button */}
          {filteredCompounds.length > 8 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAll(!showAll)}
                endIcon={showAll ? <ExpandLess /> : <ExpandMore />}
                size="small"
                sx={{
                  color: '#4fc3f7',
                  borderColor: 'rgba(33, 150, 243, 0.3)',
                  fontSize: '0.85rem',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#4fc3f7',
                    bgcolor: 'rgba(33, 150, 243, 0.08)',
                  }
                }}
              >
                {showAll ? 'Show Less' : `Show All Compounds (${filteredCompounds.length})`}
              </Button>
            </Box>
          )}

          {/* No Results */}
          {filteredCompounds.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Science sx={{ fontSize: 48, color: '#546e7a', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ color: '#78909c', mb: 1, fontWeight: '500' }}>
                No compounds found
              </Typography>
              <Typography variant="body2" sx={{ color: '#607d8b' }}>
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          )}
        </Box>

        {/* Details Panel - Compact and Clean */}
        {selectedCompound ? (
          <DetailsPanel>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <PanelTitle>
                {selectedCompound.NAME}
              </PanelTitle>
              <IconButton 
                onClick={() => setSelectedCompound(null)}
                size="small"
                sx={{ 
                  color: '#78909c',
                  '&:hover': {
                    color: '#4fc3f7',
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Category and Status */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
              {selectedCompound.Category && (
                <CategoryChip
                  label={selectedCompound.Category}
                  category={selectedCompound.Category}
                />
              )}
              <Chip
                icon={<LockOpen sx={{ fontSize: 14 }} />}
                label="Unlocked"
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  height: '24px',
                  bgcolor: 'rgba(76, 175, 80, 0.15)',
                  color: '#81c784',
                  fontWeight: '500',
                }}
              />
            </Box>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                color: '#4fc3f7', 
                mb: 1, 
                fontWeight: '600',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Description
              </Typography>
              <PanelContent>
                {selectedCompound.Description || "No description available for this compound."}
              </PanelContent>
            </Box>

            {/* Elements - Compact Chips */}
            {selectedCompound.Elements && selectedCompound.Elements.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#4fc3f7', 
                  mb: 1.5, 
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Elements ({selectedCompound.Elements.length})
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.75,
                  maxHeight: '120px',
                  overflowY: 'auto',
                  p: 0.5
                }}>
                  {selectedCompound.Elements.map((element, index) => (
                    <Chip
                      key={index}
                      label={element}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        height: '26px',
                        bgcolor: index % 3 === 0 ? 'rgba(33, 150, 243, 0.15)' : 
                                index % 3 === 1 ? 'rgba(76, 175, 80, 0.15)' : 
                                                'rgba(255, 152, 0, 0.15)',
                        color: index % 3 === 0 ? '#64b5f6' : 
                               index % 3 === 1 ? '#81c784' : 
                                               '#ffb74d',
                        fontWeight: '500',
                        '& .MuiChip-label': {
                          padding: '0 10px',
                        },
                        border: '1px solid',
                        borderColor: index % 3 === 0 ? 'rgba(33, 150, 243, 0.3)' : 
                                    index % 3 === 1 ? 'rgba(76, 175, 80, 0.3)' : 
                                                    'rgba(255, 152, 0, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Uses - Compact List */}
            {selectedCompound.Uses && selectedCompound.Uses.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#4fc3f7', 
                  mb: 1.5, 
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Common Uses
                </Typography>
                <Box sx={{ 
                  pl: 1.5,
                  maxHeight: '150px',
                  overflowY: 'auto',
                  pr: 1
                }}>
                  {selectedCompound.Uses.map((use, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom: index < selectedCompound.Uses.length - 1 ? 
                          '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                      }}
                    >
                      <Box sx={{ 
                        width: '6px', 
                        height: '6px', 
                        bgcolor: '#4fc3f7', 
                        borderRadius: '50%',
                        mt: 0.75,
                        mr: 1.5,
                        flexShrink: 0
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: '#cfd8dc',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                      }}>
                        {use}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Teacher Notes */}
            <Box sx={{ 
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 1
              }}>
                <Info sx={{ color: '#4fc3f7', fontSize: 16 }} />
                <Typography variant="caption" sx={{ 
                  color: '#4fc3f7', 
                  fontWeight: '600',
                  fontSize: '0.8rem'
                }}>
                  Teacher Preview
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ 
                color: '#78909c', 
                fontSize: '0.75rem',
                lineHeight: 1.5,
                display: 'block'
              }}>
                This compound is shown as discovered for teacher preview purposes. Students will unlock it through learning activities.
              </Typography>
            </Box>
          </DetailsPanel>
        ) : (
          <DetailsPanel sx={{ 
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Science sx={{ 
                fontSize: 48, 
                color: 'rgba(79, 195, 247, 0.3)', 
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                color: '#90a4ae', 
                mb: 1.5,
                fontWeight: '500'
              }}>
                Select a Compound
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#78909c', 
                fontSize: '0.85rem',
                lineHeight: 1.6,
                mb: 3
              }}>
                Click on any compound card to view detailed information, elements, and common uses.
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(33, 150, 243, 0.08)', 
                borderRadius: '10px',
                border: '1px solid rgba(33, 150, 243, 0.15)'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#bbdefb', 
                  fontSize: '0.75rem',
                  display: 'block',
                  mb: 0.5
                }}>
                  <strong>Teacher Tip:</strong> All compounds are visible in preview mode
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#90caf9', 
                  fontSize: '0.7rem'
                }}>
                  Use search and filters to find specific compounds
                </Typography>
              </Box>
            </Box>
          </DetailsPanel>
        )}
      </DiscoveryPageContainer>

      {/* Quick Help */}
      <Paper sx={{ 
        mt: 4, 
        p: 2.5, 
        bgcolor: 'rgba(20, 20, 35, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
      }}>
        <Typography variant="caption" sx={{ 
          color: '#78909c', 
          fontSize: '0.75rem',
          display: 'block',
          textAlign: 'center'
        }}>
          Teacher Preview • {compounds.length} compounds available • Updated in real-time
        </Typography>
      </Paper>
    </Box>
  );
};

export default TeacherDiscovery;