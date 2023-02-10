/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, FormHelperText
} from "@material-ui/core";
import { Check, Info, LocalShipping, Close, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Save, Search, Loop, Refresh, Edit, Send, Telegram, LocationOn } from "@material-ui/icons";

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
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
    Submit: {
        textAlign: "center",
    },
    displayflex: {
        display: "flex",
        alignItems: "center",
    },
    displayflexHead: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    padding_table: {
        padding: theme.spacing(1)
    },
    Pagination: {
        flexShrink: 0,
        marginLeft: theme.spacing(4),
    },
    IconSearch: {
        color: 'gray'
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
    responsive_image: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '75%',
        cursor: 'pointer'
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

    font_ct_normal: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: "end",
    },
    font_small: {
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
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

function Headers({ classes, status, count, func }) {
    return (
        <>
            <Box className={classes.displayflex}>
                <LocalShipping />
                <Typography className={classes.font_header}>สินค้าที่ต้องจัดส่ง</Typography>


            </Box>
            <PageLine />
            <br />
        </>
    );
}

const shipdata = {
    ship_nbr: '',
    ship_item: '',
    ship_uid: '',
    ship_date: null,
    ship_track: '',
    ship_note: ''

}

const address = {
    addr_uid: '',
    addr_item: '',
    addr_nbr: '',
    addr_name: '',
    addr_tel: '',
    addr_desc: '',
    errorTel: {
        status: false,
        message: '',
    },
}

export default function Shipping() {
    const url = config.API_URL + "models/Reward/Reward_redeem.php";
    const classes = useStyles();
    const { vision } = useParams();
    const telRef = useRef(null);
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [search, SetSearch] = useState('');
    const [datatable, setData] = useState([]);
    const [Rows, setRows] = useState(null);
    const [msgCount, setMsgCount] = useState(0);
    const [msgCountNote, setMsgCountNote] = useState(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [FormAddress, setFormAddress] = useState(address);
    const [Sender, setSender] = useState(shipdata)
    const [openSender, setOpenSender] = useState(false)

    //- varrible
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const headCells = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'picture', label: 'รูปภาพ', width: '10%', align: "left" },
        { id: 'gmm_reward_item_coupon_name', label: 'รายการ', width: '15%', align: "left" },
        { id: 'gmm_user_fullname', label: 'ผู้รับ', width: '15%', align: "left" },
        { id: 'gmm_user_ship_date', label: 'วันที่จัดส่ง', width: '10%', align: "center" },
        { id: 'gmm_user_temp_status', label: 'สถานะ', width: '15%', align: "center" },
        { id: 'Edit', label: '', width: '5%', align: "center" },
        { id: 'Confirm', label: '', width: '5%', align: "center" },
    ];

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {
        setBoolean(true);
        //------------------------------
        const payload = JSON.stringify({
            key: "Payload_shipping",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(250);
        const res = await response.json();
        if (res.status) {
            setData(res.data);
            setBoolean(false);
        }
    }

    async function ship_address() {
        // setBoolean(true);
        //------------------------------
        const payload = JSON.stringify({
            key: "ship_address",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: FormAddress
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(250);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "อัพเดทข้อมูลสำเร็จ",
                icon: "success",
            }).then((output) => {
                FirstLoad();
                setOpenEdit(false);
            });

        }
    }

    async function ship_confirm() {
        // setBoolean(true);
        //------------------------------
        const payload = JSON.stringify({
            key: "ship_confirm",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: Sender
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(250);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
            }).then((output) => {
                FirstLoad();
                setOpenSender(false);
            });
        }
    }

    const handleChangeInput = (event) => {
        const { target } = event;
        const { name } = target

        if (name === 'addrt') {
            if (target.value.match("^[0-9]*$")) {
                if (target.value.length === 0) {
                    setFormAddress({
                        ...FormAddress,
                        addr_tel: target.value,
                        errorTel: { message: "", status: false },
                    });
                } else {
                    const fix_number = target.value.substr(0, 2);
                    if (fix_number !== "02" && fix_number !== "06" && fix_number !== "08" && fix_number !== "09") {

                        setFormAddress({
                            ...FormAddress,
                            addr_tel: target.value,
                            errorTel: {
                                message: "หมวดหมายเลขโทรศัพท์ ไม่ถูกต้อง",
                                status: true,
                            },

                        });
                    } else {
                        if (fix_number === "06" || fix_number === "08" || fix_number === "09") {
                            if (target.value.length == 10) {
                                setFormAddress({
                                    ...FormAddress,
                                    addr_tel: target.value,
                                    errorTel: { message: "", status: false },
                                });
                            } else {
                                setFormAddress({
                                    ...FormAddress,
                                    addr_tel: target.value,
                                    errorTel: { message: "หมายเลขโทรศัพท์จำนวน 10 หลัก", status: true },
                                });
                            }
                        } else {
                            if (fix_number === "02") {
                                if (target.value.length == 9) {
                                    setFormAddress({
                                        ...FormAddress,
                                        addr_tel: target.value,
                                        errorTel: { message: "", status: false },
                                    });

                                } else {
                                    setFormAddress({
                                        ...FormAddress,
                                        addr_tel: target.value,
                                        errorTel: {
                                            message: "หมายเลขโทรศัพท์จำนวน 9 หลัก",
                                            status: true,
                                        },

                                    });
                                }
                            }
                        }
                    }
                }
            }
        } else if (name === 'addrd') {
            setFormAddress({ ...FormAddress, addr_desc: target.value });
            setMsgCount(event.target.value.length);
        } else if (name === 'addrn') {
            setFormAddress({ ...FormAddress, addr_name: target.value });
        }

    }

    const handleRefresh = () => {
        setMsgCount(0);
        setFormAddress(address);
    }

    const handleRefreshSender = () => {
        setMsgCountNote(0);
        setSender(shipdata);
    }

    const handleOpenEdit = (row, index) => {
        setMsgCount((row.gmm_user_temp_desc03 ? row.gmm_user_temp_desc03.length : 0))
        setFormAddress({
            ...FormAddress,
            addr_uid: row.gmm_user_id,
            addr_item: row.gmm_reward_item_id,
            addr_nbr: row.gmm_user_temp_nbr,
            addr_name: row.gmm_user_fullname,
            addr_tel: row.gmm_user_tel,
            addr_desc: row.gmm_user_temp_desc03,
        });
        setRows(row)
        setOpenEdit(true)
    }

    const handleCloseEdit = () => {
        setOpenEdit(false)
    }

    const handleOpenSender = (row) => {
        setMsgCountNote(row.gmm_user_ship_note ? row.gmm_user_ship_note.length : 0)
        setSender({
            ...Sender,
            ship_nbr: row.gmm_user_temp_nbr,
            ship_item: row.gmm_reward_item_id,
            ship_uid: row.gmm_user_id,
            ship_date: row.gmm_user_ship_date_format,
            ship_track: (row.gmm_user_temp_tracking) ? row.gmm_user_temp_tracking : '',
            ship_note: (row.gmm_user_ship_note) ? row.gmm_user_ship_note : '',
        })
        setRows(row)
        setOpenSender(true)
    }

    const handleCloseSender = (row) => {
        setSender(shipdata)
        setOpenSender(false)
    }

    const handleConfirmOrder = (event) => {
        event.preventDefault();

        Swal.fire({
            title: "บันทึก",
            text: "ท่านต้องการบันทึกข้อมูล หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                ship_confirm();
            }
        })
    }

    const handleAddress = (event) => {
        event.preventDefault();
        if (FormAddress.errorTel.status === false) {
            Swal.fire({
                title: "บันทึก",
                text: "ท่านต้องการบันทึกข้อมูล หรือไม่?",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                //reverseButtons: true,
            }).then((output) => {
                if (output.isConfirmed) {
                    ship_address();
                }
            })
        } else {
            if (FormAddress.errorTel.status) {
                telRef.current.focus()
            }
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const filtered = datatable.filter((row) => {
        return row.gmm_user_fullname.toLowerCase().includes(search.toLowerCase())
    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    function ViewTable({ filtered }) {
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

                        {/* 10 20 15 20 10 15 5 5  */}
                        <TableBody>
                            {(rowsPerPage > 0
                                ? stableSort(filtered, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : stableSort(filtered, getComparator(order, orderBy))).map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='10%' align="left">
                                            <img src={row.image}
                                                alt="Gomamma"
                                                className={classes.responsive_image}></img>
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_reward_item_coupon_name}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_user_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='10%' align="center">
                                            {row.gmm_user_ship_date ? row.gmm_user_ship_date : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.gmm_user_temp_status === 'PENDING' &&
                                                <Box style={{ color: 'rgb(63, 81, 181)', display: 'flex', justifyContent: 'center' }}>
                                                    <Info fontSize="small" /> &nbsp;
                                                    รอจัดส่ง
                                                </Box>
                                            }
                                            {row.gmm_user_temp_status === 'COMPLETE' &&
                                                <Box style={{ color: 'rgb(33, 124, 37)', display: 'flex', justifyContent: 'center' }}>
                                                    <Check fontSize="small" /> &nbsp;
                                                    จัดส่งแล้ว
                                                </Box>}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            <IconButton title="ที่จัดส่ง" color='primary' onClick={() => { handleOpenEdit(row, index) }} disabled={promise}>
                                                <LocationOn style={{ color: '#FE7569' }} />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            <IconButton title="Confirm" color='primary' onClick={() => { handleOpenSender(row) }} disabled={promise}>
                                                <Telegram />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={8} align="center">
                                        ไม่พบข้อมูล
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={8}
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

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} status={promise} />
            <Grid container spacing={2}>
                <Hidden only={['xs', 'sm']}>
                    <Grid item xs={8} sm={8} md={8} />
                </Hidden>
                <Grid item xs={12} sm={12} md={4} >
                    <TextField
                        margin="dense"
                        variant="outlined"
                        placeholder="ค้นหาชื่อผู้รับ..."
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
                <Grid item xs={12}>
                    <ViewTable filtered={filtered} />
                </Grid>
            </Grid>

            <Dialog
                onClose={handleCloseEdit}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="customized-dialog-title"
                open={openEdit}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseEdit}>
                    ที่อยู่จัดส่ง
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <form id="hook" onSubmit={handleAddress}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="addrn"
                                    label="ชื่อ - นามสกุล"
                                    margin="dense"
                                    variant="outlined"
                                    autoComplete="off"
                                    value={FormAddress.addr_name}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 80 }}
                                    InputProps={{
                                        readOnly: (Rows && Rows.gmm_user_temp_status === 'PENDING' ? false : true),
                                        className: classes.font_normal,
                                    }}
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    fullWidth
                                    required
                                />

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="addrt"
                                    label="เบอร์โทรศัพท์"
                                    margin="dense"
                                    variant="outlined"
                                    autoComplete="off"
                                    inputRef={telRef}
                                    value={FormAddress.addr_tel}
                                    onChange={handleChangeInput}
                                    error={FormAddress.errorTel.status}
                                    helperText={FormAddress.errorTel.message}
                                    inputProps={{ maxLength: 10 }}
                                    InputProps={{
                                        readOnly: (Rows && Rows.gmm_user_temp_status === 'PENDING' ? false : true),
                                        className: classes.font_normal,
                                    }}
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="addrd"
                                    label="ที่อยู่จัดส่ง"
                                    variant="outlined"
                                    autoComplete="off"
                                    rows={3}
                                    value={FormAddress.addr_desc}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 256 }}
                                    InputProps={{
                                        readOnly: (Rows && Rows.gmm_user_temp_status === 'PENDING' ? false : true),
                                        className: classes.font_normal,
                                    }}
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    multiline
                                    fullWidth
                                    required
                                />
                                <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                            </Grid>
                        </Grid>
                    </form>
                </MuiDialogContent>
                {Rows &&
                    Rows.gmm_user_temp_status === 'PENDING' &&
                    <MuiDialogActions>
                        <Button
                            className={classes.font_normal}
                            onClick={handleRefresh}
                            variant="outlined"
                            color="primary"
                            startIcon={<Refresh />}>
                            ล้างข้อมูล
                        </Button>
                        <Button
                            form="hook"
                            type="submit"
                            className={classes.font_normal}
                            variant="contained"
                            color="primary">
                            อัพเดท
                        </Button>
                    </MuiDialogActions>
                }

            </Dialog>

            {/* sender */}
            <Dialog
                onClose={handleCloseSender}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openSender}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseSender}>
                    บันทึกการส่งสินค้า
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
                        <form id="SenderOrder" onSubmit={handleConfirmOrder}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <KeyboardDatePicker
                                        label="วันที่จัดส่งสินค้า"
                                        placeholder="วัน/เดือน/ปี"
                                        format="dd/MM/yyyy"
                                        value={Sender.ship_date}
                                        onChange={(event) => {
                                            setSender({ ...Sender, ship_date: event });
                                        }}
                                        margin="dense"
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                        }}
                                        inputVariant="outlined"
                                        cancelLabel="ยกเลิก"
                                        okLabel="ตกลง"
                                        invalidDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        maxDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        minDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        disabled={(Rows && Rows.gmm_user_temp_status === 'PENDING' ? false : true)}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        fullWidth
                                        required
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="ship_track"
                                        label="เลขที่พัสดุ (Tracking)"
                                        margin="dense"
                                        variant="outlined"
                                        value={Sender.ship_track}
                                        onChange={(event) => {
                                            setSender({ ...Sender, ship_track: event.target.value.toUpperCase() });
                                        }}
                                        inputProps={{ maxLength: 80 }}
                                        InputProps={{
                                            readOnly: (Rows && Rows.gmm_user_temp_status === 'PENDING' ? false : true),
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="ship_note"
                                        label="จดบันทึก"
                                        variant="outlined"
                                        placeholder="รายละเอียดจดบันทึกเพิ่มเติม"
                                        rows={2}
                                        value={Sender.ship_note}
                                        onChange={(event) => {
                                            setSender({ ...Sender, ship_note: event.target.value });
                                            setMsgCountNote(event.target.value.length);
                                        }}
                                        inputProps={{ maxLength: 256 }}
                                        InputProps={{
                                            readOnly: (Rows && Rows.gmm_user_temp_status === 'PENDING' ? false : true),
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                            shrink: true
                                        }}
                                        multiline
                                        fullWidth
                                    />
                                    <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCountNote} / 256</FormHelperText>
                                </Grid>
                            </Grid>
                        </form>
                    </MuiPickersUtilsProvider>
                </MuiDialogContent>
                {Rows &&
                    Rows.gmm_user_temp_status === 'PENDING' &&
                    <MuiDialogActions>
                        <Button
                            className={classes.font_normal}
                            onClick={handleRefreshSender}
                            variant="outlined"
                            color="primary"
                            startIcon={<Refresh />}>
                            ล้างข้อมูล
                        </Button>
                        <Button
                            form="SenderOrder"
                            type="submit"
                            className={classes.font_normal}
                            variant="contained"
                            color="primary">
                            ยืนยัน
                        </Button>
                    </MuiDialogActions>
                }
            </Dialog>
        </>
    );
}
