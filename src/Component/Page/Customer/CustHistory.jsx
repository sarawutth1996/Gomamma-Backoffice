/* eslint-disable */
import React, { createRef, useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useScreenshot, createFileName } from "use-react-screenshot";
import AutocompleteInput from '@material-ui/lab/Autocomplete';
import {
    Backdrop, Button, Box, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper,
} from "@material-ui/core";
import { Add, AccessTime, Close, Room, KeyboardArrowRight, KeyboardArrowLeft, MoreVert, Bookmarks, LastPage, FirstPage, Description, Search, Check, Info, Edit, Receipt } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import moment from 'moment';
import QRCode from "qrcode.react";
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

const MuiDialogTaxinv = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2, 8, 2, 8),
        background: 'gainsboro',
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(2),
        },
    },
}))(DialogContent);



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
    posCenter: {
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
    displayflexbetween: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    displayTitle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    displayTimeTravel: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: 'SemiBold',
        fontSize: '14px'
    },
    LineDashed: {
        borderWidth: '0px 0px 1px',
        borderTopStyle: 'initial',
        borderRightStyle: 'initial',
        borderBottomStyle: 'dashed',
        borderLeftStyle: 'initial',
        borderTopColor: 'initial',
        borderRightColor: 'initial',
        borderBottomColor: 'rgb(204, 204, 204)',
        borderLeftColor: 'initial',
        borderImage: 'initial',
    },
    marginLine: {
        margin: theme.spacing(1, 0, 1, 0)
    },
    marginLine_left: {
        margin: theme.spacing(1, 0, 1, 5)
    },
    marginLine_double: {
        margin: theme.spacing(0, 0, 1, 5),
        borderBottomStyle: 'double'
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
    textLeft: {
        textAlign: 'left',
        fontFamily: 'SemiBold',
        fontSize: '14px'
    },
    textsubLeft: {
        textAlign: 'left',
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    textRight: {
        textAlign: 'center',
        fontFamily: 'SemiBold',
        fontSize: '14px'
    },
    textSmallRight: {
        textAlign: 'center',
        fontFamily: 'Regular',
        fontSize: '10px'
    },
    textEllipsis: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,

    },
    textNote: {
        // overflow: 'hidden',
        // textOverflow: 'ellipsis',
        // display: '-webkit-box',
        // WebkitBoxOrient: 'vertical',
        // WebkitLineClamp: 3,
        fontSize: '10px',
        fontFamily: 'Regular',
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
        fontSize: '20px'
    },
    font_title: {
        fontFamily: 'SemiBold',
        fontSize: '20px'
    },
    font_subHeader: {
        fontFamily: 'SemiBold',
        fontSize: '14px'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    font_chip: {
        fontFamily: 'Regular',
        fontSize: '12px'
    },
    font_desc: {
        fontFamily: 'Regular',
        fontSize: '12px',
        wordBreak: 'break-all',
        color: 'gray',
    },
    font_posCenter_light: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: 'center'
    },
    font_posLeft_sm_light: {
        fontFamily: 'Regular',
        fontSize: '12px',
        textAlign: 'left'
    },
    font_posLeft_light: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: 'left'
    },
    font_posRight_light: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: 'right'
    },
    font_posRight_bold: {
        fontFamily: 'SemiBold',
        fontSize: '14px',
        textAlign: 'right'
    },
    font_posLeft_bold: {
        fontFamily: 'SemiBold',
        fontSize: '14px',
        textAlign: 'left'
    },
    font_posCenter_bold: {
        fontFamily: 'SemiBold',
        fontSize: '14px',
        textAlign: 'center'
    },
    multilineColor: {
        background: 'white'
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
                    <Bookmarks />
                    <Typography className={classes.font_header}>รายการจอง</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

export default function CustHistory() {
    const url = config.API_URL + "models/Customer/Customer_history.php";
    // const url = 'https://uatbackoffice.go-mamma.com/php/models/Customer/Customer_history.php'
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const classes = useStyles();
    const state = useHistory();
    const { vision } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [open, setOpen] = useState(false)
    const [datatable, setData] = useState([]);
    const [search, SetSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const [openBill, setOpenBill] = useState(false);
    const [openTaxinv, setOpenTaxinv] = useState(false);
    const [rowState, setrowState] = useState({
        nbr: '', location: '', product_name: '', product_desc: '', booking_status: '', booking_exp: '',
        date: '', time: '', tracking: '', favour_emp_taxi: '', taxi_name: '', taxi_tel: '', taxi_hradd: '', taxi_hrdefault: '', passenger: '',
        favour_emp_cg: '', cg_name: '', cg_tel: '', cg_status: '', cg_hradd: '', cg_hrdefault: '', drop: '', licenseplate: '', starttravel: '',
    });



    const headCells = [
        { id: 'gmm_booking_nbr', label: '#', width: '5%', align: "center" },
        { id: 'gmm_user_fullname', label: 'ผู้จอง', width: '20%', align: "left" },
        { id: 'gmm_emp_fullname_tx', label: 'คนขับรถ', width: '15%', align: "left" },
        { id: 'gmm_booking_product_name', label: 'Products', width: '15%', align: "left" },
        { id: 'gmm_booking_travel_start_nfm', label: 'วันที่เดินทาง', width: '20%', align: "center" },
        { id: 'gmm_booking_status', label: 'สถานะ', width: '15%', align: "center" },
        { id: 'edit', label: '', width: '5%', align: "center" },
        { id: 'billpayment', label: '', width: '5%', align: "center" },
        { id: 'taxinvoice', label: '', width: '5%', align: "center" },
    ];

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);

    }, []);

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_datatable",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setData(res.data)
            setBoolean(false);
        }
    }

    async function Confirmtrip(item, message) {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Confirmtrip",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: item,
            message: message
        });


        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: "จบงานสำเร็จ",
                icon: "success",
            }).then(() => {
                FirstLoad();
            })

        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const filtered = datatable.filter((row) => {
        return row.gmm_user_fullname.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_nbr.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_emp_fullname_tx.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_status_thai.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_product_name.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_travel_start_nfm.toLowerCase().includes(search.toLowerCase())
    })

    const handleBooking = () => {
        state.push('/Home/CustBooking/' + vision);
    }

    const handleShowBooking = (row) => {
        state.push('/Home/BookingDetail/' + vision + '/' + row.gmm_inv_nbr);
    }

    const handleCloseBill = () => {
        setOpenBill(false);
    }

    const handleOpenBill = (row) => {
        let newTelTX = "";
        let newTelCG = "";

        newTelTX += row.gmm_emp_tel_taxi.substring(0, 3);
        newTelTX += '-';
        newTelTX += row.gmm_emp_tel_taxi.substring(3, 6);
        newTelTX += '-';
        newTelTX += row.gmm_emp_tel_taxi.substring(6);
        //-----------------------------------------------
        if (row.gmm_emp_tel_cg !== null) {
            newTelCG += row.gmm_emp_tel_cg.substring(0, 3);
            newTelCG += '-';
            newTelCG += row.gmm_emp_tel_cg.substring(3, 6);
            newTelCG += '-';
            newTelCG += row.gmm_emp_tel_cg.substring(6);
        }

        setrowState({
            ...rowState,
            nbr: row.gmm_booking_nbr,
            location: row.location,
            product_name: row.gmm_booking_product_name,
            product_desc: row.gmm_product_desc,
            booking_status: row.gmm_booking_status,
            booking_exp: row.gmm_inv_exp_date,
            date: row.gmm_booking_date.monthdesc,
            time: row.gmm_booking_time,
            tracking: row.gmm_booking_tracking,
            favour_emp_taxi: row.gmm_favour_emp_taxi,
            taxi_name: row.gmm_emp_fullname_tx,
            taxi_tel: newTelTX,
            taxi_hradd: row.gmm_booking_taxi_hradd,
            taxi_hrdefault: row.gmm_booking_taxi_hrdefault,
            favour_emp_cg: row.gmm_favour_emp_cg,
            licenseplate: row.gmm_emp_licenseplate,
            cg_name: row.gmm_emp_fullname_cg,
            cg_tel: (row.gmm_emp_tel_cg !== null) ? newTelCG : null,
            cg_status: row.gmm_booking_cg_status,
            cg_detail: (row.gmm_booking_cg_status) ? row.gmm_booking_cg_detail : null,
            cg_hradd: row.gmm_booking_cg_hradd,
            cg_hrdefault: row.gmm_booking_cg_hrdefault,
            passenger: row.gmm_passenger_fullname,
            drop: row.gmm_booking_product_drop,
            starttravel: row.gmm_booking_travel_start_compare
        })
        setOpenBill(true);
    }

    // TAX-INVOICE
    const [pickInv, setPickInv] = useState([]);
    const [selectInv, setSelectInv] = useState([]);


    const handleSelectInv = (ev, item) => {
        setPickInv(item)
    }

    const handleOpenTaxinvoice = (row) => {
        setPickInv(row.orderList[0])
        setSelectInv(row.orderList)
        setOpenTaxinv(true);
    }


    const handleCloseTaxinv = (row) => {
        setOpenTaxinv(false);
    }


    const SaveImageQRCode = (nbr) => {
        var canvas = document.getElementById("canvas");
        var url = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = nbr;
        link.href = url;
        link.click();
    }

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
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
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
                                        <StyledTableCell width='5%' align="center">
                                            {row.gmm_booking_nbr}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_user_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_emp_fullname_tx}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_booking_product_name}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="center">
                                            {row.gmm_booking_travel_start_nfm}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">

                                            {(row.gmm_booking_status === 'PENDING' && (moment(new Date()).format('YYYY-MM-DD HH:mm') <= row.gmm_inv_exp_date)) &&
                                                <Box style={{ color: 'rgb(246 172 16)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Info fontSize="small" /> &nbsp;
                                                    รอชำระ
                                                </Box>
                                            }

                                            {(row.gmm_booking_status === 'PENDING' && (moment(new Date()).format('YYYY-MM-DD HH:mm') >= row.gmm_inv_exp_date)) &&
                                                <Box style={{ color: 'rgb(247 7 37)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Info fontSize="small" /> &nbsp;
                                                    หมดอายุ
                                                </Box>
                                            }
                                            {(row.gmm_booking_status === 'SUCCESS') &&
                                                <Box style={{ color: 'rgb(33, 124, 37)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <AccessTime fontSize="small" /> &nbsp;
                                                    รอเดินทาง
                                                </Box>}
                                            {(row.gmm_booking_status === 'COMPLETE') &&
                                                <Box style={{ color: 'rgb(63, 81, 181)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Check fontSize="small" /> &nbsp;
                                                    เดินทางแล้ว
                                                </Box>
                                            }
                                            {(row.gmm_booking_status === 'CANCEL') &&
                                                <Box style={{ color: '#e91e63', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Close fontSize="small" /> &nbsp;
                                                    ยกเลิก
                                                </Box>}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="รายละเอียดการเดินทาง" color='primary' onClick={() => { handleShowBooking(row) }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="Booking Confirmation" color='primary' onClick={() => { handleOpenBill(row) }}>
                                                <Description fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="ใบเสร็จรับเงิน" color='primary' onClick={() => { handleOpenTaxinvoice(row) }} disabled={(row.gmm_booking_status !== 'SUCCESS' && row.gmm_booking_status !== 'COMPLETE')}>
                                                <Receipt fontSize="small" />
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
                <Box className={classes.posCenter}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        onClick={handleBooking}
                        startIcon={<Add />}
                        fullWidth
                    >
                        ระบบการจอง
                    </Button>
                </Box>
            </>
        )
    }

    //--------------------------------------------

    const conv_formatTel = (value) => {
        if (value) {
            if (value.length === 10) {
                let newString = "";
                //----------------------------------------------
                newString += value.substring(0, 3);
                newString += '-';
                newString += value.substring(3, 6);
                newString += '-';
                newString += value.substring(6);
                return newString;
            } else {
                let newString = "";
                //----------------------------------------------
                newString += value.substring(0, 2);
                newString += '-';
                newString += value.substring(2, 5);
                newString += '-';
                newString += value.substring(5);
                return newString;
            }
        } else {
            return "";
        }
    }

    const ref = createRef(null);
    const taxinv_ref = createRef(null);
    const downloadScreenshot = () => takeScreenShot(ref.current).then(download);
    const downloadScreenshot_taxinv = () => takeScreenShot(taxinv_ref.current).then(download_taxinv);
    const [image, takeScreenShot] = useScreenshot({
        type: "image/jpeg",
        quality: 1.0
    });

    const download = (image, { name = rowState.nbr, extension = "jpg" } = {}) => {
        const a = document.createElement("a");
        a.href = image;
        a.download = createFileName(extension, name);
        a.click();
    };

    const download_taxinv = (image, { name = pickInv.inv_nbr, extension = "jpg" } = {}) => {
        const a = document.createElement("a");
        a.href = image;
        a.download = createFileName(extension, name);
        a.click();
    };



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

            {/* #BOOKING CF */}
            <Dialog
                onClose={handleCloseBill}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openBill}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseBill}>
                    Booking Confirmation
                </MuiDialogTitle>
                <MuiDialogContent dividers>

                    <Box
                        ref={ref}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                        }}
                    >
                        <Box className={classes.displayflexbetween}>
                            <img src="/image/Gomamma.png" width="60" height="50"></img>
                            <Box className={classes.displayTitle}>
                                <Typography className={classes.font_title}>
                                    รายละเอียดการเดินทาง
                                </Typography>
                                <Typography className={classes.font_normal}>
                                    ผู้โดยสาร : {rowState.passenger}
                                </Typography>
                            </Box>
                        </Box>
                        <PageLine />
                        <Box mt={2} mb={1} className={classes.displayflexbetween}>
                            <Box className={classes.textLeft}>
                                {rowState.product_name}
                            </Box>
                            <Box>
                                สถานะ
                            </Box>
                        </Box>
                        <Box mt={2} mb={1} className={classes.displayflexbetween}>
                            <Box className={classes.textsubLeft}>
                                {rowState.product_desc}
                            </Box>
                            <Box>
                                {(rowState.booking_status === 'PENDING' && (moment(new Date()).format('YYYY-MM-DD HH:mm') <= rowState.booking_exp))
                                    && <span style={{ color: 'rgb(246 172 16)' }}> รอชำระ </span>}
                                {(rowState.booking_status === 'PENDING' && (moment(new Date()).format('YYYY-MM-DD HH:mm') >= rowState.booking_exp))
                                    && <span style={{ color: 'rgb(247 7 37)' }}> หมดอายุ </span>}
                                {(rowState.booking_status === 'SUCCESS') && <span style={{ color: 'rgb(33, 124, 37)' }}> ชำระเงินแล้ว </span>}
                                {(rowState.booking_status === 'COMPLETE') && <span style={{ color: 'rgb(63, 81, 181)' }}> เดินทางแล้ว </span>}
                            </Box>
                        </Box>

                        <PageLine />
                        <Box mt={1} mb={1} className={classes.displayflexbetween}>
                            <Box>
                                เดินทางวันที่
                            </Box>
                            <Box>
                                เวลา
                            </Box>
                        </Box>
                        <Box mt={0} mb={1} className={classes.displayTimeTravel}>
                            <Box>
                                {rowState.date}
                            </Box>
                            <Box>
                                {rowState.time}
                            </Box>
                        </Box>
                        <PageLine />
                        <Box mt={2} mb={2} >
                            <div className={classes.displayflex}>
                                <Typography className={classes.font_subHeader}>พนักงานขับรถ </Typography>&nbsp;
                                {Number(rowState.drop) !== 2 && '(รอ ' + (Number(rowState.taxi_hradd) + Number(rowState.taxi_hrdefault)) + ' ชั่วโมง สะสมรวมตลอดการเดินทาง)'}
                            </div>


                            <Typography className={classes.font_normal}>{rowState.favour_emp_taxi ? (<span>{rowState.taxi_name}  {' '}&ensp; {rowState.licenseplate} {' '}&ensp; {' (' + rowState.taxi_tel + ')'}  </span>) :
                                (moment(new Date()).format('YYYY-MM-DD HH:mm') >= moment(rowState.starttravel).subtract(1, 'days').format('YYYY-MM-DD HH:mm')) ? (<span>{rowState.taxi_name}  {' '}&ensp; {rowState.licenseplate} {' '}&ensp; {' (' + rowState.taxi_tel + ')'}  </span>) : 'จะแจ้งให้ทราบทางรายการจอง 24 ชม ก่อนเดินทาง'}</Typography>



                        </Box>
                        {rowState.cg_status &&
                            <Box mt={2} mb={0} >
                                <div className={classes.displayflex}>
                                    <Typography className={classes.font_subHeader}>ผู้ดูแล </Typography>&nbsp;
                                    <Typography className={classes.font_normal}> {Number(rowState.cg_hrdefault) !== 0 && '(ให้บริการ ' + (Number(rowState.cg_hradd) + Number(rowState.cg_hrdefault)) + ' ชั่วโมง)'}</Typography>
                                </div>
                                <Typography className={classes.font_normal}>{rowState.favour_emp_cg ? rowState.cg_name + ' (' + rowState.cg_tel + ')' : (moment(new Date()).format('YYYY-MM-DD HH:mm') >= moment(rowState.starttravel).subtract(1, 'days').format('YYYY-MM-DD HH:mm')) ? rowState.cg_name + ' (' + rowState.cg_tel + ')' : 'จะแจ้งให้ทราบทางรายการจอง 24 ชม ก่อนเดินทาง'}</Typography>
                            </Box>
                        }

                        {rowState.cg_status &&
                            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className={classes.font_normal}>สถานที่นัด : {rowState.cg_detail.gmm_location_route_name}</span>
                                <span className={classes.font_normal}>เวลานัด : {rowState.cg_detail.gmm_booking_cg_starttime} น. </span>

                            </Box>
                        }

                        {/* <Typography className={classes.font_normal}>{rowState.cg_status ? rowState.cg_detail.gmm_location_route_name : 'จะแจ้งให้ทราบทางรายการจอง 24 ชม ก่อนเดินทาง'}</Typography> */}


                        <Box mt={2} mb={2} className={classes.font_subHeader}>
                            ลำดับการเดินทาง
                        </Box>
                        {/* <h3>What is Lorem Ipsum?</h3> */}
                        {openBill && <>
                            {rowState.location.map((pos, index) => (
                                <Box key={index} >
                                    <Box className={classes.displayflexbetween}>
                                        <Box>
                                            <Room style={{ color: '#FE7569', marginRight: '10px' }} />
                                        </Box>
                                        <Box>
                                            <Box className={classes.textEllipsis}>
                                                <span style={{ color: '#FE7569', fontWeight: '600' }} >{pos.gmm_location_route_name}</span> : {pos.gmm_location_address}
                                            </Box>
                                            <span className={classes.font_desc}>{pos.gmm_location_rmks1 !== "" && <>{pos.gmm_location_rmks1}</>}</span>
                                        </Box>


                                    </Box>
                                    {rowState.location.length !== (index + 1) && <span> <MoreVert style={{ color: '#9a9a9a' }} /></span>}

                                </Box>
                            ))}
                        </>}

                        <Box mt={3}>
                            <Grid container spacing={1}>
                                <Grid item xs={9}>
                                    <Box mb={1} className={classes.font_subHeader}>หมายเหตุ :</Box>

                                    <Typography className={classes.textNote}>1. ค่าบริการยังไม่รวมค่ามิเตอร์และค่าทางด่วน ผู้โดยสารชำระกับพนักงานขับรถโดยตรง ณ วันเดินทาง</Typography>
                                    <Typography className={classes.textNote}>2. การเดินทางระหว่างจุดจะเป็นการกดมิเตอร์ใหม่ทุกครั้ง</Typography>
                                    <Typography className={classes.textNote}>3. การเพิ่มชั่วโมงรอ สามารถตรวจสอบกับพนักงานผ่านทาง Line หรือ Call Center </Typography>
                                    <Typography className={classes.textNote}>4. การยกเลิก/เลื่อนวัน-เวลาใช้บริการ ต้องแจ้งล่วงหน้าอย่างน้อย 4 ชม. โดยบริษัทขอเก็บค่าธรรมเนียม 100 บาท หากยกเลิก/เลื่อนวัน-เวลาใช้บริการต่ำกว่า 4 ชม. ทางบริษัทขอสงวนสิทธิ์ในการคืนค่าบริการ</Typography>
                                    <Typography className={classes.textNote}>5. ติดต่อเรา Line @gomamma หรือ Call Center 094-429-2296</Typography>
                                </Grid>
                                <Grid item xs={3} style={{ alignSelf: 'self-end' }}>
                                    <Box className={classes.textRight}>
                                        <QRCode
                                            id="icon"
                                            value={config.PATH_URL + "Tracking/" + rowState.tracking}
                                            size={90}
                                            bgColor={"#ffffff"}
                                            fgColor={"#000000"}
                                            level={"L"}
                                            includeMargin={false}
                                            renderAs={"canvas"}
                                            imageSettings={{
                                                src: "/image/Gomammalogo.png",
                                                x: null,
                                                y: null,
                                                height: 27,
                                                width: 25,
                                                excavate: false,
                                            }}
                                        />
                                    </Box>
                                    <Box className={classes.textSmallRight}>
                                        ติดตามการเดินทาง
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>

                </MuiDialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={downloadScreenshot} className={classes.font_normal} color="primary" fullWidth>
                        Download Image
                    </Button>
                </DialogActions>
            </Dialog>


            {openTaxinv &&
                <Dialog
                    onClose={handleCloseTaxinv}
                    fullWidth={true}
                    maxWidth="xs"
                    aria-labelledby="customized-dialog-title"
                    open={openTaxinv}>
                    <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseTaxinv}>
                        ใบเสร็จรับเงิน
                    </MuiDialogTitle>
                    <MuiDialogTaxinv dividers>
                        {selectInv.length > 1 &&

                            <>
                                <AutocompleteInput
                                    classes={{
                                        inputRoot: classes.multilineColor,
                                        input: classes.font_normal,
                                        option: classes.font_normal,

                                    }}
                                    style={{ width: '100%' }}
                                    options={selectInv}
                                    getOptionLabel={(value) => value.inv_nbr}
                                    getOptionSelected={(option, value) =>
                                        option.inv_nbr === value.inv_nbr
                                    }
                                    value={pickInv}
                                    onChange={handleSelectInv}
                                    renderInput={(params) => (
                                        < TextField
                                            {...params}
                                            margin="dense"
                                            variant="outlined"
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}

                                        />
                                    )}

                                />

                                <Box m={1} />
                            </>
                        }

                        <Box
                            ref={taxinv_ref}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                background: 'white'
                            }}>

                            <Box m={1} className={classes.posCenter}><img src="/image/Gomamma_banner.png" width="50%" alt="logo"></img></Box>
                            <Typography className={classes.font_posCenter_bold}>{pickInv.header.gmm_site_name}</Typography>
                            {/* <Typography className={classes.font_posCenter_bold} gutterBottom> (สำนักงานใหญ่)</Typography> */}
                            <Typography className={classes.font_posCenter_light}>{pickInv.header.gmm_site_addr_line1}</Typography>
                            <Typography className={classes.font_posCenter_light}>{pickInv.header.gmm_site_addr_line2}</Typography>
                            <Typography className={classes.font_posCenter_light}>{pickInv.header.gmm_site_addr_line3}</Typography>
                            <br></br>
                            <Typography className={classes.font_posCenter_light}>เลขประจำตัวผู้เสียภาษี {pickInv.header.gmm_site_tax_id}</Typography>
                            <Typography className={classes.font_posCenter_light} gutterBottom>โทร. {conv_formatTel(pickInv.header.gmm_site_tel)}</Typography>
                            <Divider className={classes.marginLine} light />
                            <Typography className={classes.font_posLeft_light}>ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ</Typography>
                            <Box className={classes.displayflexbetween}>
                                <Typography className={classes.font_normal}>{pickInv.data[0].gmm_invd_nbr}</Typography>
                                <Typography className={classes.font_normal}>{pickInv.data[0].gmm_inv_payment_date}</Typography>
                            </Box>
                            <Divider className={classes.marginLine} light />

                            {pickInv.data.map((item, index) =>
                                <Grid key={index} container spacing={0}>
                                    <Grid item xs={2}>
                                        {item.gmm_invd_qty}
                                    </Grid>
                                    <Grid item xs={7}>
                                        #{item.gmm_invd_booking_ref} / {item.gmm_invd_name}
                                    </Grid>
                                    <Grid item xs={3} className={classes.font_posRight_light}>
                                        {item.gmm_invd_total}
                                    </Grid>
                                </Grid>
                            )}

                            <hr className={classes.LineDashed} />
                            <Typography className={classes.font_posLeft_bold} gutterBottom> รวม {pickInv.summary.sumQty} รายการ</Typography>

                            <Grid container spacing={0}>
                                <Grid item xs={8} className={classes.font_posRight_light}>
                                    รวมเป็นเงิน
                                </Grid>
                                <Grid item xs={4} className={classes.font_posRight_light}>
                                    {pickInv.summary.sumPrice}
                                </Grid>
                            </Grid>
                            <Grid container spacing={0}>
                                <Grid item xs={8} className={classes.font_posRight_light}>
                                    คูปอง
                                </Grid>
                                <Grid item xs={4} className={classes.font_posRight_light}>
                                    {pickInv.summary.sumDiscountCoupon}
                                </Grid>
                            </Grid>
                            <Grid container spacing={0}>
                                <Grid item xs={8} className={classes.font_posRight_light}>
                                    ส่วนลด
                                </Grid>
                                <Grid item xs={4} className={classes.font_posRight_light}>
                                    {pickInv.summary.sumDiscount}
                                </Grid>
                            </Grid>
                            <Grid container spacing={0}>
                                <Grid item xs={8} className={classes.font_posRight_light}>
                                    จำนวนเงินหลังหักส่วนลด
                                </Grid>
                                <Grid item xs={4} className={classes.font_posRight_light}>
                                    {pickInv.summary.sumNet}
                                </Grid>
                            </Grid>

                            <Divider className={classes.marginLine_left} variant="inset" light />

                            <Grid container spacing={0}>
                                <Grid item xs={8} className={classes.font_posRight_bold}>
                                    รวมทั้งสิ้น
                                </Grid>
                                <Grid item xs={4} className={classes.font_posRight_light}>
                                    {pickInv.summary.total}
                                </Grid>
                            </Grid>

                            <Divider className={classes.marginLine_double} />
                            <Box m={2} />
                            <Typography className={classes.font_posLeft_sm_light}>{(pickInv.summary.sumCouponuse.length !== 0) ? 'ใช้คูปอง :' : ''} {pickInv.summary.sumCouponuse.map((item, index) =>
                                item + ((pickInv.summary.sumCouponuse.length - 1) !== index ? ', ' : '')
                            )}
                            </Typography>
                            {pickInv.summary.vatShow && <><Box m={2} /> <Typography className={classes.font_posCenter_bold}>VAT INCLUDED</Typography></>}
                        </Box>
                    </MuiDialogTaxinv>
                    <DialogActions>
                        <Button variant="contained" onClick={downloadScreenshot_taxinv} className={classes.font_normal} color="primary" fullWidth>
                            Download Image
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    );
}
