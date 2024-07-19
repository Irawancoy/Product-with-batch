import { getAllProducts,updateProduct} from "../services/apis"; 
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';

const Layouts = () => {
    const [products, setProducts] = useState([]);
   const [editedProducts, setEditedProducts] = useState({});
   const [deletedProducts, setDeletedProducts] = useState([]);

    useEffect(() => {
        getAllProducts().then((response) => {
            setProducts(response.data.data);
        });
    }, []);

    const handleInputChange = (id, e) => {
         const { name, value } = e.target;
         setEditedProducts((prevState) => ({
               ...prevState,
               [id]: {
                  ...prevState[id],
                  [name]: value
               }
         }));
    };

   const handleSave = () => {
      const productsToAdd = []
      const productsToUpdate = []
      const productIdsToDelete = []

      products.forEach((product) => {
         if (editedProducts[product.id]) {
            productsToUpdate.push({ ...product, ...editedProducts[product.id] })
         }
      })
      
      productIdsToDelete.forEach((id) => {
         productsToUpdate.push({ id })
      })

      const requestData = {
         productsToAdd,
         productsToUpdate,
         productIdsToDelete
      }

      const requestDataJson = JSON.stringify(requestData)
      console.log(requestDataJson)
      const formData = new FormData()
      formData.append(
         "request",
         new Blob([requestDataJson], {
            type: "application/json",
         })
      )

      updateProduct(formData).then((response) => {
         console.log(response)
      })
      

      
    }

    const handleDelete = () => {
      
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <Paper sx={{ maxWidth: 800, px: 2, py: 2, width: '100%' }}>
                <Toolbar
                    sx={{
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                    }}
                >
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Products
                    </Typography>
                    <Tooltip title="Save">
                        <IconButton onClick={handleSave}>
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="enhanced table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        sx={{ color: 'primary.main' }}
                                    />
                                </TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Category</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((row) => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            sx={{ color: 'primary.main' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            name="name"
                                            value={editedProducts[row.id]?.name || row.name}
                                            onChange={(e) => handleInputChange(row.id, e)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            name="price"
                                            type="number"
                                            value={editedProducts[row.id]?.price || row.price}
                                            onChange={(e) => handleInputChange(row.id, e)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            name="category"
                                            value={editedProducts[row.id]?.category || row.category}
                                            onChange={(e) => handleInputChange(row.id, e)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Layouts;
