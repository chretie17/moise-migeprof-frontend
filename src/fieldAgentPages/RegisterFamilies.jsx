import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getAllPrograms, registerFamily, updateFamily, deleteFamily, getFamilies } from '../services/Familyservice';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import { Provinces, Districts, Sectors, Cells, Villages } from 'rwanda';

const RegisterFamilies = () => {
  const [programs, setPrograms] = useState([]);
  const [families, setFamilies] = useState([]);
  const [linkedFamilies, setLinkedFamilies] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openLinkedFamiliesDialog, setOpenLinkedFamiliesDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showAllFamilies, setShowAllFamilies] = useState(false);
  const [familyData, setFamilyData] = useState({
    Address: '',
    Status: '',
    FamilyHeadName: '',
    NumberOfMembers: '',
    IncomeLevel: '',
    EducationLevel: '',
    Province: '',
    District: '',
    Sector: '',
    Cell: '',
    Village: '',
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    fetchPrograms();
    fetchFamilies();
    loadProvinces();
  }, []);

  const fetchPrograms = async () => {
    try {
      const programs = await getAllPrograms();
      setPrograms(programs);
    } catch (error) {
      console.error('Error fetching programs', error);
      setNotification({
        open: true,
        message: 'Error fetching programs',
        severity: 'error',
      });
    }
  };

  const fetchFamilies = async () => {
    try {
      const families = await getFamilies();
      setFamilies(families);
    } catch (error) {
      console.error('Error fetching families', error);
      setNotification({
        open: true,
        message: 'Error fetching families',
        severity: 'error',
      });
    }
  };

  const loadProvinces = () => {
    const provinces = Provinces();
    setProvinces(provinces);
  };

  const loadDistricts = (province) => {
    const districts = Districts(province);
    setDistricts(districts || []);
    setSectors([]);  // Clear sectors when province changes
    setCells([]);    // Clear cells when province changes
    setVillages([]); // Clear villages when province changes
  };

  const loadSectors = (province, district) => {
    const sectors = Sectors(province, district);
    setSectors(sectors || []);
    setCells([]);    // Clear cells when district changes
    setVillages([]); // Clear villages when district changes
  };

  const loadCells = (province, district, sector) => {
    const cells = Cells(province, district, sector);
    setCells(cells || []);
    setVillages([]); // Clear villages when sector changes
  };

  const loadVillages = (province, district, sector, cell) => {
    const villages = Villages(province, district, sector, cell);
    setVillages(villages || []);
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFamilyData({ ...familyData, Province: province, District: '', Sector: '', Cell: '', Village: '' });
    loadDistricts(province);
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFamilyData({ ...familyData, District: district, Sector: '', Cell: '', Village: '' });
    loadSectors(familyData.Province, district);
  };

  const handleSectorChange = (e) => {
    const sector = e.target.value;
    setFamilyData({ ...familyData, Sector: sector, Cell: '', Village: '' });
    loadCells(familyData.Province, familyData.District, sector);
  };

  const handleCellChange = (e) => {
    const cell = e.target.value;
    setFamilyData({ ...familyData, Cell: cell, Village: '' });
    loadVillages(familyData.Province, familyData.District, familyData.Sector, cell);
  };

  const handleVillageChange = (e) => {
    const village = e.target.value;
    setFamilyData({ ...familyData, Village: village });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyData({
      ...familyData,
      [name]: value,
    });
  };

  const handleOpenDialog = (program, family = null) => {
    setSelectedProgram(program);
    setSelectedFamily(family);
    if (family) {
      setFamilyData({
        Address: family.Address,
        Status: family.Status,
        FamilyHeadName: family.FamilyHeadName,
        NumberOfMembers: family.NumberOfMembers,
        IncomeLevel: family.IncomeLevel,
        EducationLevel: family.EducationLevel,
        Province: family.Province,
        District: family.District,
        Sector: family.Sector,
        Cell: family.Cell,
        Village: family.Village,
      });
      loadDistricts(family.Province);
      loadSectors(family.Province, family.District);
      loadCells(family.Province, family.District, family.Sector);
      loadVillages(family.Province, family.District, family.Sector, family.Cell);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
    setSelectedFamily(null);
    setFamilyData({
      Address: '',
      Status: '',
      FamilyHeadName: '',
      NumberOfMembers: '',
      IncomeLevel: '',
      EducationLevel: '',
      Province: '',
      District: '',
      Sector: '',
      Cell: '',
      Village: '',
    });
  };

  const handleRegisterFamily = async () => {
    if (!familyData.Address || !familyData.Status || !familyData.Province || !familyData.District || !familyData.Sector || !familyData.Cell || !familyData.Village) {
      setNotification({
        open: true,
        message: 'All fields are required',
        severity: 'error',
      });
      return;
    }

    try {
      await registerFamily({ ...familyData, ProgramID: selectedProgram.ProgramID });
      setNotification({
        open: true,
        message: 'Family registered successfully',
        severity: 'success',
      });
      fetchFamilies();
      handleCloseDialog();
    } catch (error) {
      console.error('Error registering family', error);
      setNotification({
        open: true,
        message: 'Error registering family',
        severity: 'error',
      });
    }
  };

  const handleUpdateFamily = async () => {
    if (!familyData.Address || !familyData.Status || !familyData.Province || !familyData.District || !familyData.Sector || !familyData.Cell || !familyData.Village) {
      setNotification({
        open: true,
        message: 'All fields are required',
        severity: 'error',
      });
      return;
    }

    try {
      await updateFamily(selectedFamily.FamilyID, familyData);
      setNotification({
        open: true,
        message: 'Family updated successfully',
        severity: 'success',
      });
      fetchFamilies();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating family', error);
      setNotification({
        open: true,
        message: 'Error updating family',
        severity: 'error',
      });
    }
  };

  const handleDeleteFamily = async (familyID) => {
    try {
      await deleteFamily(familyID);
      setNotification({
        open: true,
        message: 'Family deleted successfully',
        severity: 'success',
      });
      fetchFamilies();
    } catch (error) {
      console.error('Error deleting family', error);
      setNotification({
        open: true,
        message: 'Error deleting family',
        severity: 'error',
      });
    }
  };

  const handleShowLinkedFamilies = (programID) => {
    const linkedFamilies = families.filter(family =>
      family.Programs.some(program => program.ProgramID === programID)
    );
    setLinkedFamilies(linkedFamilies);
    setOpenLinkedFamiliesDialog(true);
  };

  const handleCloseNotification = () => {
    setNotification({
      open: false,
      message: '',
      severity: 'success',
    });
  };

  const handleCloseLinkedFamiliesDialog = () => {
    setOpenLinkedFamiliesDialog(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Register Families
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<GroupIcon />}
        onClick={() => setShowAllFamilies(!showAllFamilies)}
        sx={{ marginBottom: 2 }}
      >
        {showAllFamilies ? 'Hide All Families' : 'Show All Families'}
      </Button>
      {showAllFamilies && (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {families.map((family) => (
            <Grid item xs={12} sm={6} md={4} key={family.FamilyID}>
              <Card
                sx={{
                  maxWidth: 345,
                  margin: 'auto',
                  boxShadow: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {family.FamilyHeadName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {family.Address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {family.Status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleOpenDialog(null, family)}>
                    Update
                  </Button>
                  <Button size="small" color="secondary" onClick={() => handleDeleteFamily(family.FamilyID)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {!showAllFamilies && (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {programs.map((program) => (
            <Grid item xs={12} sm={6} md={4} key={program.ProgramID}>
              <Card
                sx={{
                  maxWidth: 345,
                  margin: 'auto',
                  boxShadow: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {program.ProgramName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {program.Description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleOpenDialog(program)}>
                    Register Family
                  </Button>
                  <Button size="small" color="primary" onClick={() => handleShowLinkedFamilies(program.ProgramID)}>
                    View Linked Families
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={openLinkedFamiliesDialog} onClose={handleCloseLinkedFamiliesDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Linked Families
          <IconButton
            aria-label="close"
            onClick={handleCloseLinkedFamiliesDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: 3 }}>
            {linkedFamilies.map((family) => (
              <Grid item xs={12} sm={6} md={4} key={family.FamilyID}>
                <Card
                  sx={{
                    maxWidth: 345,
                    margin: 'auto',
                    boxShadow: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {family.FamilyHeadName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {family.Address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {family.Status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => handleOpenDialog(null, family)}>
                      Update
                    </Button>
                    <Button size="small" color="secondary" onClick={() => handleDeleteFamily(family.FamilyID)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedFamily ? 'Update Family' : `Register Family for ${selectedProgram?.ProgramName}`}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="FamilyHeadName"
            label="Family Head Name"
            type="text"
            fullWidth
            value={familyData.FamilyHeadName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Address"
            label="Contact Number"
            type="text"
            fullWidth
            value={familyData.Address}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="Status"
              value={familyData.Status}
              onChange={handleInputChange}
            >
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="NumberOfMembers"
            label="Number of Members"
            type="number"
            fullWidth
            value={familyData.NumberOfMembers}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Income Level</InputLabel>
            <Select
              name="IncomeLevel"
              value={familyData.IncomeLevel}
              onChange={handleInputChange}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Education Level</InputLabel>
            <Select
              name="EducationLevel"
              value={familyData.EducationLevel}
              onChange={handleInputChange}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Primary">Primary</MenuItem>
              <MenuItem value="Secondary">Secondary</MenuItem>
              <MenuItem value="University">University</MenuItem>
              <MenuItem value="Vocational Studies">Vocational Studies</MenuItem>

            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Province</InputLabel>
            <Select
              name="Province"
              value={familyData.Province}
              onChange={handleProvinceChange}
            >
              <MenuItem value="" disabled>Select Province</MenuItem>
              {provinces.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" disabled={!familyData.Province}>
            <InputLabel>District</InputLabel>
            <Select
              name="District"
              value={familyData.District}
              onChange={handleDistrictChange}
            >
              <MenuItem value="" disabled>Select District</MenuItem>
              {districts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" disabled={!familyData.District}>
            <InputLabel>Sector</InputLabel>
            <Select
              name="Sector"
              value={familyData.Sector}
              onChange={handleSectorChange}
            >
              <MenuItem value="" disabled>Select Sector</MenuItem>
              {sectors.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  {sector}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" disabled={!familyData.Sector}>
            <InputLabel>Cell</InputLabel>
            <Select
              name="Cell"
              value={familyData.Cell}
              onChange={handleCellChange}
            >
              <MenuItem value="" disabled>Select Cell</MenuItem>
              {cells.map((cell) => (
                <MenuItem key={cell} value={cell}>
                  {cell}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" disabled={!familyData.Cell}>
            <InputLabel>Village</InputLabel>
            <Select
              name="Village"
              value={familyData.Village}
              onChange={handleVillageChange}
            >
              <MenuItem value="" disabled>Select Village</MenuItem>
              {villages.map((village) => (
                <MenuItem key={village} value={village}>
                  {village}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={selectedFamily ? handleUpdateFamily : handleRegisterFamily} color="primary">
            {selectedFamily ? 'Update' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterFamilies;
