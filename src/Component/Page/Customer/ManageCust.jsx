/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Backdrop, Button, Box, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, Card, CardContent
} from "@material-ui/core";
import { Add, Close, Restore, Edit, Person, KeyboardArrowRight, KeyboardArrowLeft, GroupAdd, LastPage, FirstPage, Refresh, Search } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import Autocomplete from '@material-ui/lab/Autocomplete';
import config from '../../config';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    Refresh: {
        color: theme.palette.grey[500],
    },
    font_otp: {
        fontFamily: 'SemiBold',
        fontSize: '20px',
        textAlign: 'center',
    }
});

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


const MuiDialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classes.font_otp}>{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <Close />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});

const MuiDialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(DialogContent);

const MuiDialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
}))(DialogActions);


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
    displayflexEnd: {
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
            color: 'royalblue'
        },

    },
    displayflexBtw: {
        display: "flex",
        justifyContent: "space-between",
    },
    padding_table: {
        padding: theme.spacing(1)
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
                    <Typography className={classes.font_header}>รายชื่อผู้ใช้งาน</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}


export default function Manage_user() {
    const url = config.API_URL + "models/Customer/Customer_profile.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const classes = useStyles();
    const state = useHistory();
    const { vision } = useParams();
    const [promise, setPromise] = useState(false)
    const [isLoading, setBoolean] = useState(false);
    const [datatable, setData] = useState([]);
    const [search, SetSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [role, setRole] = useState('');
    const [listInv, setListInv] = useState([]);
    const [Return_cr, setReturn_cr] = useState({
        book_id: null,
        return_id: null,
        return_total: 0,
        return_diff: 0,
        return_credit: 0,
    });

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
        setRole(getLocalStorage().lv);
    }, [])


    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_user_profile",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setData(res.data)
            setBoolean(false);
        }
    }

    async function delete_user(id) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "delete_user",
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

    async function loadHistory(user_id) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "LoadHistory",
            id: user_id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setListInv(res.data)
            setBoolean(false);
        }
    }

    async function Return_credit() {
        setBoolean(true);
        setOpen(false)

        //--------------------------------
        const payload = JSON.stringify({
            key: "Return_credit",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: Return_cr
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);

            Swal.fire({
                title: "เรียบร้อย",
                text: "ได้รับเครดิตสะสม x " + Return_cr.return_credit,
                icon: "success",
            }).then(() => {
                reload();
                FirstLoad();
            })
        }
    }



    const alert_message = (txt) => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: txt,
            icon: "warning",
        })
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const filtered = datatable.filter((row) => {
        return row.gmm_user_tel.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_user_fullname.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_user_id.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_user_status.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_user_credit_string.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_user_point_string.toLowerCase().includes(search.toLowerCase())
    })


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAdd = () => {
        state.push('/Home/CustSignup/' + vision + '/create');
    }

    const handleCreateProfile = (row) => {
        state.push('/Home/CustPassenger/' + vision + '/' + row.gmm_user_id + '/' + 'create');
    }

    const handleEdit = (row) => {
        state.push('/Home/CustSignup/' + vision + '/' + row.gmm_user_id);
    }

    const handleDelete = (row) => {
        Swal.fire({
            title: "ลบ",
            text: "ท่านต้องการลบข้อมูล หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                delete_user(row.gmm_user_id);
            }
        });

    }


    const conv_formatTel = (value) => {
        if (value) {
            if (value.length === 10) {
                let newString = "";
                //----------------------------------------------
                newString += ' (';
                newString += value.substring(0, 3);
                newString += '-';
                newString += value.substring(3, 6);
                newString += '-';
                newString += value.substring(6);
                newString += ') ';
                return newString;
            } else {
                let newString = "";
                //----------------------------------------------
                newString += ' (';
                newString += value.substring(0, 2);
                newString += '-';
                newString += value.substring(2, 5);
                newString += '-';
                newString += value.substring(5);
                newString += ') ';
                return newString;
            }
        } else {
            return "";
        }
    }


    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน

    const headCells = [
        { id: 'gmm_user_id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_user_fullname', label: 'ชื่อ - นามสกุล', width: '20%', align: "left" },
        { id: 'gmm_user_tel', label: 'เบอร์โทรศัพท์', width: '15%', align: "left" },
        { id: 'gmm_user_status', label: 'สถานะ (OTP)', width: '15%', align: "center" },
        { id: 'gmm_user_point', label: 'คะแนนสะสม', width: '15%', align: "right" },
        { id: 'gmm_user_credit', label: 'เครดิตสะสม', width: '15%', align: "right" },
        { id: 'passenger', label: 'Passenger', width: '15%', align: "center" },
        { id: 'edit', label: '', width: '5%', align: "center" },
        { id: 'delete', label: '', width: '5%', align: "center" },
    ];

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'object') {
            if (b[orderBy].id < a[orderBy].id) {
                return -1;
            }
            if (b[orderBy].id > a[orderBy].id) {
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
                                            {row.gmm_user_id}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_user_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {conv_formatTel(row.gmm_user_tel)}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.gmm_user_status}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="right">
                                            {Number(row.gmm_user_point).toLocaleString("en-US")}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="right">
                                            {(role === 'Superadmin' || role === 'Root') ?
                                                <Box className={classes.displayflexEnd} onClick={() => { handleOpenRefund(row.gmm_user_id) }}>
                                                    <Box pr={1}> {Number(row.gmm_user_credit).toLocaleString("en-US")} </Box>

                                                    <Box><img src="/image/wallet.png" width="24" heigth="24" /></Box>
                                                </Box>
                                                :
                                                Number(row.gmm_user_credit).toLocaleString("en-US")
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            <Button
                                                title="Passenger"
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                disabled={status}
                                                className={classes.font_normal}
                                                onClick={() => handleCreateProfile(row)}
                                                fullWidth
                                            >
                                                <GroupAdd />
                                            </Button>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="แก้ไขข้อมูล" color='primary' disabled={status} onClick={() => handleEdit(row)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="ลบข้อมูล" color='secondary' disabled={status} onClick={() => handleDelete(row)}>
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
                        className={classes.font_normal}
                        onClick={handleAdd}
                        disabled={status}
                        startIcon={<Add />}
                        fullWidth
                    >
                        ลงทะเบียนผู้ใช้งาน
                    </Button>
                </Box>
            </>
        )
    }

    // Dialog
    const [open, setOpen] = useState(false);

    const reload = () => {
        setOpen(false)
        setReturn_cr({
            ...Return_cr,
            book_id: null,
            return_id: null,
            return_total: 0,
            return_diff: 0,
            return_credit: 0,
        })
    }

    const handleOpenRefund = (user_id) => {
        loadHistory(user_id);
        setOpen(true)
    }

    const handleCloseRefund = () => {
        reload();
    }

    const handlePickBooking = (ev, item) => {
        if (item) {
            setReturn_cr({
                ...Return_cr,
                book_id: item,
                return_id: item.gmm_transaction_id,
                return_total: Number(item.gmm_transaction_book_price),
                return_diff: 100 + item.gmm_transaction_value1,
                return_credit: Number(item.gmm_transaction_book_price) - (100 + item.gmm_transaction_value1),
            })
        }
    }

    const handleSubmitRefund = (ev) => {
        ev.preventDefault();

        Swal.fire({
            title: "ยืนยัน",
            text: "ท่านต้องการคืนเครดิตสะสม หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {

                Return_credit()
            }
        })

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

            <Dialog
                onClose={handleCloseRefund}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={open}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseRefund}>
                    คืนเครดิตสะสม
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <form id="hook" onSubmit={handleSubmitRefund}>
                        <Autocomplete
                            classes={{
                                input: classes.font_normal,
                                option: classes.font_normal,
                            }}
                            options={listInv}
                            getOptionLabel={(value) => value.gmm_transaction_book_id}
                            getOptionSelected={(option, value) =>
                                option.gmm_transaction_book_id === value.gmm_transaction_book_id
                            }
                            value={Return_cr.book_id}
                            onChange={handlePickBooking}
                            renderInput={(params) => (
                                < TextField
                                    {...params}
                                    label="Trip ID"
                                    margin="dense"
                                    variant="outlined"
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    required
                                />
                            )}

                        />
                    </form>
                    <br />
                    <Card>
                        <CardContent>
                            <Box m={1} className={classes.displayflexBtw}>
                                <Typography className={classes.font_normal}>ค่าบริการ (รวม)</Typography>
                                <Typography className={classes.font_normal}><b> {Number(Return_cr.return_total).toLocaleString("en-US")}</b></Typography>
                            </Box>
                            {/* ------------------------------------------------------------------------------ */}
                            <Box m={1} className={classes.displayflexBtw}>
                                <Typography className={classes.font_normal} style={{ color: 'red' }}>หัก</Typography>
                                <Typography className={classes.font_normal}><b>{Return_cr.return_diff}</b></Typography>
                            </Box>
                            {/* ------------------------------------------------------------------------------ */}
                            <Box m={1} className={classes.displayflexBtw}>
                                <Typography className={classes.font_normal} style={{ color: 'green' }}>เครดิตที่ได้รับ</Typography>
                                <Typography className={classes.font_normal}><b>{Number(Return_cr.return_credit).toLocaleString("en-US")}</b></Typography>
                            </Box>
                        </CardContent>
                    </Card>



                </MuiDialogContent>
                <MuiDialogActions >
                    <Box className={classes.Submit}>
                        <Button
                            form="hook"
                            type="submit"
                            className={classes.font_normal}
                            variant="contained"
                            color="primary">
                            บันทึก
                        </Button>
                    </Box>
                </MuiDialogActions>
            </Dialog>
        </>
    );
}
