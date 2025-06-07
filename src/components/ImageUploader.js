import React, { useState } from "react";
import { predictImage } from "../services/api";
import {
  Box,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

function ImageUploader({ onResultChange }) {
  const [image, setImage] = useState(null);
  const [model, setModel] = useState("padim");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setResult(null); // clear previous result
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please select an image");
    const res = await predictImage(image, model);
    setResult(res);
    
    // Notify parent component of the result if needed
    if (onResultChange) {
      const newData = {
        time: new Date().toLocaleTimeString(),
        value: res.score * 100,
        anomaly: res.result === "defect"
      };
      onResultChange(res, newData);
    }
  };

  return (
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
        Image Upload
      </Typography>
      <Box sx={{ mb: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Select Image
          </Button>
        </label>
        {image && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected file: {image.name}
          </Typography>
        )}
      </Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Model</InputLabel>
        <Select
          value={model}
          label="Select Model"
          onChange={(e) => setModel(e.target.value)}
        >
          <MenuItem value="padim">PaDiM</MenuItem>
          {/* <MenuItem value="efficientad">EfficientAD</MenuItem> */}
          <MenuItem value="uninet">UniNet</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!image}
      >
        Detect Anomaly
      </Button>
      {result && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" color={result.result === "defect" ? "error" : "success"}>
            Result: {result.result === "defect" ? "Defect Detected" : "Good"}
          </Typography>
          <Typography variant="body1">
            Score: {result.score.toFixed(2)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default ImageUploader;
