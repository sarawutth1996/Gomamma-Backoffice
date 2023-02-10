/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Add, Close, Edit, Folder, Person, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Save, EventNote, Search } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import config from '../../config';

const StyledTableCell = withStyles(() => ({
    head: {
        backgroundColor: '#fcfcfc',
        fontFamily: "Regular",
        fontSize: 14,
    },
    body: {
        fontFamily: "Regular",
        fontSize: 14,
    }

}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        '&:nth-of-type(odd)': {
            fontFamily: "Regular",
            fontSize: 14,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    itemCenter: {
        alignItems: "center",
    },
    IconSearch: {
        color: 'gray'
    },
    Submit: {
        textAlign: "center",
    },
    Contentpdx16: {
        paddingBottom: '16px'
    },
    Contentpdx8: {
        paddingBottom: '8px'
    },
    displayflex: {
        display: "flex",
        alignItems: "center",
    },
    padding_table: {
        padding: theme.spacing(0)
    },
    Pagination: {
        flexShrink: 0,
        marginLeft: theme.spacing(4),
    },
    textField: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    font_header: {
        fontFamily: 'SemiBold',
        margin: '10px',
        fontSize: '18px'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    font_mobile_otp: {
        fontFamily: 'Regular',
        fontSize: '24px',
        textAlign: 'center'
    }
}));

function Loading({ classes, status }) {
    return (
        <Backdrop className={classes.backdrop} open={status}>
            <Loader type="TailSpin" color="#f0f0f0" height={85} width={85} />
        </Backdrop>
    );
}

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

function Headers({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Person />
                    <Typography className={classes.font_header}>รายชื่อพนักงาน</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}



export default function Manage_employee() {
    const url = config.API_URL + "models/Employee/Employee.php";
    // const url = 'https://backoffice.go-mamma.com/php/models/Employee/Employee.php';
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const classes = useStyles();
    const state = useHistory();
    const { vision } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false);
    const [Listmstr, setListmstr] = useState([]);
    const [datatable, setData] = useState([]);
    const [search, SetSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const headCells = [
        { id: 'gmm_emp_id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_emp_fullname', label: 'ชื่อ - นามสกุล', width: '25%', align: "left" },
        { id: 'gmm_emp_type', label: 'บริการ', width: '10%', align: "center" },
        { id: 'zone', label: 'zone', width: '15%', align: "center" },
        { id: 'gmm_emp_item', label: 'สถานะ', width: '25%', align: "center" },
        { id: 'folder', label: '', width: '5%', align: "center" },
        { id: 'setting', label: '', width: '5%', align: "center" },
        { id: 'edit', label: '', width: '5%', align: "center" },
        { id: 'delete', label: '', width: '5%', align: "center" },
    ];

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_emp_profile",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setData(res.data)
            setListmstr(res.list)
            setBoolean(false);
        }
    }

    async function delete_user(id) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Delete_user",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: "ลบข้อมูลสำเร็จ",
                icon: "success",
            }).then(() => {
                FirstLoad();
            })

        } else {
            setBoolean(false);
            alert_message('ข้อมูลถูกใช้อยู่ในระบบ');
        }
    }

    async function Update_status(item, id) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Update_user",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            status: item,
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: "อัพเดทข้อมูลสำเร็จ",
                icon: "success",
            }).then(() => {
                FirstLoad();
            })

        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'object') {
            if (b[orderBy].gmm_emp_role_name < a[orderBy].gmm_emp_role_name) {
                return -1;
            }
            if (b[orderBy].gmm_emp_role_name > a[orderBy].gmm_emp_role_name) {
                return 1;
            }
            return 0;
        } else {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        }


    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);

        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function EnhancedTableHead(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCells.map((headCell) => (
                        <StyledTableCell
                            key={headCell.id}
                            width={headCell.width}
                            align={headCell.align}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                                hideSortIcon={true}
                                disabled={headCell.id === 'active' || headCell.id === 'passenger'}

                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        </StyledTableCell>
                    ))}
                </StyledTableRow>
            </TableHead>
        );
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filtered = datatable.filter((row) => {
        return row.gmm_emp_fullname.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_emp_id.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_emp_status.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_emp_type.toLowerCase().includes(search.toLowerCase()) ||
            row.zone.toLowerCase().includes(search.toLowerCase())
    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAdd = () => {
        state.push('/Home/EmpSignup/' + vision + '/create');
    }

    const handleStatus = (ev, item, index, id) => {
        if (item) {
            let newArr = [...datatable];
            newArr[index]['gmm_emp_item'] = item;
            setData(newArr);

            Swal.fire({
                // title: "Update",
                text: "ท่านต้องการดำเนินการต่อหรือไม่?",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                //reverseButtons: true,
            }).then((output) => {
                if (output.isConfirmed) {
                    Update_status(item.gmm_emp_role_id, id);
                }
            });
        }

    }

    const handleEdit = (row) => {
        state.push('/Home/EmpSignup/' + vision + '/' + row.gmm_emp_id);
    }

    const handleFolder = (row) => {
        state.push('/Home/EmpFolder/' + vision + '/' + row.gmm_emp_id);
    }

    const handleSettings = (row) => {
        state.push('/Home/EmpSettings/' + vision + '/' + row.gmm_emp_id);
    }

    const handleDelete = (row) => {
        Swal.fire({
            title: "Delete",
            text: "ท่านต้องลบข้อมูล หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                delete_user(row.gmm_emp_id);
            }
        });
    }

    const alert_message = (txt) => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: txt,
            icon: "warning",
        })
    }

    function TablePaginationActions(props) {
        const theme = useTheme();
        const { count, page, rowsPerPage, onChangePage } = props;

        const handleFirstPageButtonClick = (event) => {
            onChangePage(event, 0);
        };

        const handleBackButtonClick = (event) => {
            onChangePage(event, page - 1);
        };

        const handleNextButtonClick = (event) => {
            onChangePage(event, page + 1);
        };

        const handleLastPageButtonClick = (event) => {
            onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };

        return (
            <div className={classes.Pagination}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="first page"
                >
                    {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
                </IconButton>
                <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="next page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="last page"
                >
                    {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
                </IconButton>
            </div>
        );
    }

    function ViewTable({ filtered, status }) {
        return (
            <>
                <Box mt={2} />
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {(rowsPerPage > 0
                                ? stableSort(filtered, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : stableSort(filtered, getComparator(order, orderBy))).map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='10%' align="center">
                                            {row.gmm_emp_id}
                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="left">
                                            {row.gmm_emp_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='10%' align="center">
                                            {row.gmm_emp_type}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.zone}
                                        </StyledTableCell>

                                        <StyledTableCell width='25%' align="center">
                                            <Autocomplete
                                                classes={{
                                                    input: classes.font_normal,
                                                    option: classes.font_normal,
                                                }}
                                                disabled={status || (row.gmm_emp_role_name === 'On duty' && row.gmm_emp_active === 'ACTIVE')}
                                                options={Listmstr}
                                                getOptionLabel={(value) => value.gmm_emp_role_name}
                                                getOptionSelected={(option, value) =>
                                                    option.gmm_emp_role_id === value.gmm_emp_role_id
                                                }
                                                value={row.gmm_emp_item}
                                                onChange={(ev, item) => { handleStatus(ev, item, index, row.gmm_emp_id) }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            className: classes.font_normal,
                                                        }}
                                                        required
                                                    />
                                                )}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="แฟ้มประวัติ" color='primary' onClick={() => handleFolder(row)} disabled={status}>
                                                <Folder fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="กำหนดวันทำงาน" color='primary' onClick={() => handleSettings(row)} disabled={status}>
                                                <EventNote fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => handleEdit(row)} disabled={status}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="ลบข้อมูล" color='secondary' onClick={() => handleDelete(row)} disabled={status}>
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={9} align="center">
                                        ไม่พบข้อมูล
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={9}
                                    count={filtered.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </>
        )
    }

    function ButtonSubmit({ classes, status }) {
        return (
            <>
                <Box className={classes.Submit}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        onClick={handleAdd}
                        startIcon={<Add />}
                        fullWidth
                    >
                        ลงทะเบียนพนักงาน
                    </Button>
                </Box>
            </>
        )
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />
            <Grid container spacing={2} className={classes.itemCenter}>
                <Grid item xs={12} sm={12} md={4}>
                    <ButtonSubmit classes={classes} status={promise} />
                </Grid>
                <Hidden only={['xs']}>
                    <Grid item xs={4} />
                </Hidden>
                <Grid item xs={12} sm={12} md={4}>
                    <TextField
                        margin="dense"
                        variant="outlined"
                        placeholder="ค้นหา"
                        onChange={(e) => SetSearch(e.target.value)}
                        InputProps={{
                            className: classes.font_normal,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" className={classes.IconSearch} />
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{
                            className: classes.font_normal,
                        }}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Box mt={1} />
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <ViewTable filtered={filtered} status={promise} />
                </Grid>
            </Grid>
        </>
    );
}
