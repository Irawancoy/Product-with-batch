import { useEffect, useState } from "react"
import { getAllProducts, batchManipulateProduct } from "../services/apis"
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'

const Layouts = () => {
    const [products, setProducts] = useState([])
    const [editedProducts, setEditedProducts] = useState({})
    const [selectedProducts, setSelectedProducts] = useState(new Set())
    const [newProduct, setNewProduct] = useState({ id: 0, name: "", price: 0, category: "" })

    // Menghandle perubahan input pada produk yang diedit
    const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        setEditedProducts(prev => ({
            ...prev,
            [id]: { ...prev[id], [name]: value }
        }))
    }

    // Menghandle pemilihan produk
    const handleSelectProduct = (id) => {
        setSelectedProducts(prev => {
            const newSelected = new Set(prev)
            newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id)
            return newSelected
        })
    }

    // Menghandle pemilihan semua produk
    const handleSelectAll = (event) => {
        setSelectedProducts(event.target.checked ? new Set(products.map(p => p.id)) : new Set())
    }

    // Menghandle penyimpanan data produk
    const handleSave = async () => {
        const productsToUpdate = products.filter(p => editedProducts[p.id])

        const requestData = {
            productsToAdd: [],
            productsToUpdate: productsToUpdate.map(p => ({ ...p, ...editedProducts[p.id] })),
            productIdsToDelete: []
        }

        const formData = new FormData()
        formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }))

        try {
            await batchManipulateProduct(formData)
            const response = await getAllProducts()
            setProducts(response.data.data)
            setEditedProducts({})
        } catch (error) {
            console.error("Error saving products:", error)
        }
    }

    // Menghandle penghapusan produk
    const handleDelete = async () => {
        const requestData = {
            productsToAdd: [],
            productsToUpdate: [],
            productIdsToDelete: Array.from(selectedProducts)
        }

        const formData = new FormData()
        formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }))

        try {
            await batchManipulateProduct(formData)
            setProducts(prev => prev.filter(p => !selectedProducts.has(p.id)))
            setSelectedProducts(new Set())
        } catch (error) {
            console.error("Error deleting products:", error)
        }
    }

    // Menghandle penambahan produk baru
    const handleAddData = async () => {
        const requestData = {
            productsToAdd: [newProduct],
            productsToUpdate: [],
            productIdsToDelete: []
        }

        const formData = new FormData()
        formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }))

        try {
            await batchManipulateProduct(formData)
            setProducts(prev => [...prev, newProduct])
            setNewProduct({ id: 0, name: "", price: 0, category: "" })
        } catch (error) {
            console.error("Error adding new product:", error)
        }
    }

    // Menghandle penambahan data baru
    const handleOpenNewColumn = () => {
        handleAddData()
    }

    // Mengupdate data produk setiap kali editedProducts berubah
    useEffect(() => {
        if (Object.keys(editedProducts).length > 0) {
            handleSave()
        }
    }, [editedProducts])

    // Mengambil data produk saat komponen dimount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllProducts()
                setProducts(response.data.data || [])
            } catch (error) {
                console.error("Error fetching products:", error)
            }
        }
        fetchData()
    }, [])

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
                    <Tooltip title="Add">
                        <IconButton onClick={handleOpenNewColumn}>
                            <AddIcon />
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
                                        checked={selectedProducts.size === products.length}
                                        onChange={handleSelectAll}
                                        sx={{ color: 'primary.main' }}
                                    />
                                </TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Category</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                        <Typography>No data available</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((row) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.id}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedProducts.has(row.id)}
                                                onChange={() => handleSelectProduct(row.id)}
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}

export default Layouts
