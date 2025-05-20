import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { 
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ImageUploader from './components/ImageUploader';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [anomalyData, setAnomalyData] = useState([]);
  const [result, setResult] = useState(null);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#00ff9f',
      },
      secondary: {
        main: '#ff4081',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleResultChange = (res, newData) => {
    setResult(res);
    setAnomalyData(prev => [...prev, newData].slice(-10)); // Keep last 10 detections
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <TimelineIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Anomaly Detection System
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container 
          maxWidth="xl" 
          sx={{ 
            mt: 4, 
            mb: 4,
            minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Grid 
            container 
            spacing={3}
            sx={{
              width: '100%'
            }}
          >
            <Grid item xs={12} md={6}>
              <ImageUploader onResultChange={handleResultChange} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 400,
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Anomaly Detection
                </Typography>
                <ResponsiveContainer>
                  <LineChart
                    data={anomalyData}
                    margin={{
                      top: 16,
                      right: 16,
                      bottom: 0,
                      left: 24,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00ff9f"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Statistics
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: '#00ff9f' }}>
                  {anomalyData.filter(d => d.anomaly).length} Anomalies
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Number of anomalies in last {anomalyData.length} detections
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  System Status
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: '#00ff9f' }}>
                  Active
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  System is currently detecting anomalies
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
