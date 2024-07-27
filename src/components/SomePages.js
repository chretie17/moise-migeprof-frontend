import React, { useEffect, useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const SomePage = () => {
  const { query } = useSearch();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    // Mock fetch items
    const fetchedItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];
    setItems(fetchedItems);
  }, []);

  useEffect(() => {
    setFilteredItems(
      items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, items]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Some Page
      </Typography>
      <List>
        {filteredItems.map(item => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SomePage;
