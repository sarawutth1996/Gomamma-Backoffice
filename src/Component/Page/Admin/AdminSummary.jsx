/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Avatar, Badge, Backdrop, Button, Box, Chip, Dialog, DialogTitle, DialogContent, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, Card, CardContent,
    List, ListItem, ListItemAvatar, ListItemText, FormControlLabel, FormControl, RadioGroup, Radio
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import { Add, Close, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, MoreHoriz, Search, StarHalf, StarBorder, Check } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
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

const StyledBadgeOnActive = withStyles((theme) => ({
    badge: {
        color: 'white',
        background: '#58bb1f',
        right: 2,
        top: 6,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}))(Badge);

const StyledBadgeWaiting = withStyles((theme) => ({
    badge: {
        right: 2,
        top: 6,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}))(Badge);

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
    ChipStyle: {
        fontFamily: 'Regular',
        padding: '0px',
        height: '28px',
        marginBottom: '4px'
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
    middle: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
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
    font_subheader: {
        fontFamily: 'Regular',
        margin: '4px',
        fontSize: '14px'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    font_small_right: {
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
    },
    font_small: {
        color: 'gray',
        fontFamily: 'Regular',
        fontSize: '12px'
    },
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
                    <StarHalf />
                    <Typography className={classes.font_header}>ประเมินผล</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function Meeter({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Typography className={classes.font_header}>จุดการเดินทาง & ค่ามิเตอร์</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

export default function AdminSummary() {
    const url = config.API_URL + "models/Admin/Admin_rating.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const classes = useStyles();
    const state = useHistory();
    const { vision } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [datatable, setData] = useState([]);
    const [search, SetSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const [open, setOpen] = useState(false)
    const [Rows, setRow] = useState({
        gmm_passenger_fullname: '',
        gmm_emp_tx_fullname: '',
        gmm_emp_cg_fullname: '',
        gmm_booking_comment_text: '',
        gmm_booking_comment_taxi: '',
        gmm_booking_comment_cg: '',
        gmm_booking_recommend_taxi: '',
        gmm_booking_recommend_cg: '',
        desc: [],
    })

    const headCells = [
        { id: 'gmm_booking_nbr', label: '#', width: '5%', align: "center" },
        { id: 'gmm_user_fullname', label: 'ผู้จอง', width: '20%', align: "left" },
        { id: 'gmm_tx_fullname', label: 'คนขับรถ', width: '20%', align: "left" },
        { id: 'gmm_booking_product_name', label: 'Products', width: '15%', align: "left" },
        { id: 'gmm_booking_travel_start', label: 'วันที่เดินทาง', width: '20%', align: "center" },
        { id: 'cm', label: '', width: '5%', align: "center" },
        { id: 'tx', label: '', width: '5%', align: "center" },
        { id: 'cg', label: '', width: '5%', align: "center" },
    ];

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, []);

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_comment",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(250);
        const res = await response.json();
        if (res.status) {
            setData(res.data);
            setBoolean(false);
        }
    }

    const filtered = datatable.filter((row) => {
        return row.gmm_user_fullname.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_nbr.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_product_name.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_tx_fullname.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_travel_start.toLowerCase().includes(search.toLowerCase())
    })

    const openMessage = (row, mesg) => {

        if (mesg === 'Taxi') {

            setRow({
                ...Rows,
                gmm_passenger_fullname: (row.ratePreview.gmm_passenger_fullname) ? row.ratePreview.gmm_passenger_fullname : '-',
                gmm_emp_tx_fullname: (row.ratePreview.gmm_emp_tx_fullname) ? row.ratePreview.gmm_emp_tx_fullname : '-',
                gmm_emp_cg_fullname: (row.ratePreview.gmm_emp_cg_fullname) ? row.ratePreview.gmm_emp_cg_fullname : '-',
                gmm_booking_comment_text: (row.gmm_booking_comment_text) ? row.gmm_booking_comment_text : '',
                gmm_booking_comment_taxi: (row.gmm_booking_comment_taxi) ? row.gmm_booking_comment_taxi : '',
                gmm_booking_comment_cg: (row.gmm_booking_comment_cg) ? row.gmm_booking_comment_cg : '',
                gmm_booking_recommend_taxi: (row.gmm_booking_recommend_taxi) ? row.gmm_booking_recommend_taxi : '',
                gmm_booking_recommend_cg: (row.gmm_booking_recommend_cg) ? row.gmm_booking_recommend_cg : '',
                tableCustomer: row.rateVote_taxi,
                meeter: row.meeter,
                mesg: mesg,
                status: null
            });
        } else if (mesg === 'Caregiver') {
            setRow({
                ...Rows,
                gmm_passenger_fullname: (row.ratePreview.gmm_passenger_fullname) ? row.ratePreview.gmm_passenger_fullname : '-',
                gmm_emp_tx_fullname: (row.ratePreview.gmm_emp_tx_fullname) ? row.ratePreview.gmm_emp_tx_fullname : '-',
                gmm_emp_cg_fullname: (row.ratePreview.gmm_emp_cg_fullname) ? row.ratePreview.gmm_emp_cg_fullname : '-',
                gmm_booking_comment_text: (row.gmm_booking_comment_text) ? row.gmm_booking_comment_text : '',
                gmm_booking_comment_taxi: (row.gmm_booking_comment_taxi) ? row.gmm_booking_comment_taxi : '',
                gmm_booking_comment_cg: (row.gmm_booking_comment_cg) ? row.gmm_booking_comment_cg : '',
                gmm_booking_recommend_taxi: (row.gmm_booking_recommend_taxi) ? row.gmm_booking_recommend_taxi : '',
                gmm_booking_recommend_cg: (row.gmm_booking_recommend_cg) ? row.gmm_booking_recommend_cg : '',
                tableCustomer: row.rateVote_cg,
                meeter: null,
                mesg: mesg,
                status: null
            });
        } else if (mesg === 'Customer') {
            setRow({
                ...Rows,
                gmm_passenger_fullname: (row.ratePreview.gmm_passenger_fullname) ? row.ratePreview.gmm_passenger_fullname : '-',
                gmm_emp_tx_fullname: (row.ratePreview.gmm_emp_tx_fullname) ? row.ratePreview.gmm_emp_tx_fullname : '-',
                gmm_emp_cg_fullname: (row.ratePreview.gmm_emp_cg_fullname) ? row.ratePreview.gmm_emp_cg_fullname : '-',
                gmm_booking_comment_text: (row.gmm_booking_comment_text) ? row.gmm_booking_comment_text : '',
                gmm_booking_comment_taxi: (row.gmm_booking_comment_taxi) ? row.gmm_booking_comment_taxi : '',
                gmm_booking_comment_cg: (row.gmm_booking_comment_cg) ? row.gmm_booking_comment_cg : '',
                gmm_booking_recommend_taxi: (row.gmm_booking_recommend_taxi) ? row.gmm_booking_recommend_taxi : '',
                gmm_booking_recommend_cg: (row.gmm_booking_recommend_cg) ? row.gmm_booking_recommend_cg : '',
                tableCustomer: row.rateVote_customer,
                meeter: null,
                mesg: mesg,
                status: row.rateVote_status

            });
        }

        setOpen(true);
    }

    const handleAdd = () => {
        state.push('/Home/AdminFormEvaluation/' + vision);
    }

    const handleClose = () => {
        setOpen(false)
        setRow({
            ...Rows,
            gmm_passenger_fullname: '',
            gmm_emp_tx_fullname: '',
            gmm_emp_cg_fullname: '',
            gmm_booking_comment_text: '',
            desc: [],
        })
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
                                            {row.gmm_booking_nbr}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_user_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_tx_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_booking_product_name}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="center">
                                            {row.gmm_booking_travel_start}
                                        </StyledTableCell>

                                        <StyledTableCell width='5%' align="center" className={classes.padding_table} style={{ padding: 12 }}>
                                            {row.rateVote_customer.length !== 0 ?
                                                <StyledBadgeOnActive badgeContent={<Check style={{ fontSize: '8px' }} />}  >
                                                    <Avatar src="/image/picon.png" onClick={() => { openMessage(row, 'Customer') }} style={{ background: '#FFCB08', cursor: 'pointer' }} >
                                                    </Avatar>
                                                </StyledBadgeOnActive> :
                                                <StyledBadgeWaiting badgeContent={<MoreHoriz style={{ fontSize: '12px' }} />} color="primary">
                                                    <Avatar src="/image/picon.png" style={{ background: '#FFCB08', cursor: 'pointer' }} >
                                                    </Avatar>
                                                </StyledBadgeWaiting>
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" style={{ padding: 12 }}>
                                            {row.gmm_booking_taxi_id ?
                                                (row.rateVote_taxi.length !== 0) ? <StyledBadgeOnActive badgeContent={<Check style={{ fontSize: '8px' }} />} >
                                                    <Avatar src="/image/taxiicon.png" onClick={() => { openMessage(row, 'Taxi') }} style={{ background: '#FFCB08', cursor: 'pointer' }} >
                                                    </Avatar>
                                                </StyledBadgeOnActive> : <StyledBadgeWaiting badgeContent={<MoreHoriz style={{ fontSize: '12px' }} />} color="primary">
                                                    <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08', cursor: 'pointer' }} >
                                                    </Avatar>
                                                </StyledBadgeWaiting>
                                                :
                                                <Avatar style={{ background: 'rgb(227 222 216)', cursor: 'no-drop' }} >
                                                    ?
                                                </Avatar>
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" style={{ padding: 12 }}>
                                            {row.gmm_booking_cg_id ?
                                                (row.rateVote_cg.length !== 0) ? <StyledBadgeOnActive badgeContent={<Check style={{ fontSize: '8px' }} />} >
                                                    <Avatar src="/image/cgicon.png" onClick={() => { openMessage(row, 'Caregiver') }} style={{ background: '#FFCB08', cursor: 'pointer' }} >
                                                    </Avatar>
                                                </StyledBadgeOnActive> : <StyledBadgeWaiting badgeContent={<MoreHoriz style={{ fontSize: '12px' }} />} color="primary">
                                                    <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08', cursor: 'pointer' }} >
                                                    </Avatar>
                                                </StyledBadgeWaiting>
                                                :
                                                <Avatar style={{ background: 'rgb(227 222 216)', cursor: 'no-drop' }} >
                                                    ?
                                                </Avatar>
                                            }
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

    // Table Form 1

    const [pageForm1, setPageForm1] = useState(0);
    const [rowsPerPageForm1, setRowsPerPageForm1] = useState(25);
    const [orderForm1, setOrderForm1] = React.useState('asc');
    const [orderByForm1, setOrderByForm1] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน

    const checkings = [
        { id: '1', name: 'ใช่' },
        { id: '2', name: 'ไม่ใช่' }
    ]

    const headCellsForm1 = [
        { id: 'id', label: '#', width: '5%', align: "center" },
        { id: 'header', label: 'หัวข้อการประเมิน', width: '70%', align: "center" },
        { id: 'rate', label: 'คะแนนความคิดเห็น', width: '25%', align: "center" },
    ];

    function EnhancedTableHeadForm1(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCellsForm1.map((headCell) => (
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

    const handleRequestSortForm1 = (event, property) => {
        const isAsc = orderByForm1 === property && orderForm1 === 'asc';
        setOrderForm1(isAsc ? 'desc' : 'asc');
        setOrderByForm1(property);
    };

    function ViewTableForm1() {
        return (
            <>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <EnhancedTableHeadForm1
                            classes={classes}
                            order={orderForm1}
                            orderBy={orderByForm1}
                            onRequestSort={handleRequestSortForm1}
                        />
                        <TableBody>
                            {(rowsPerPageForm1 > 0
                                ? stableSort(Rows.tableCustomer, getComparator(orderForm1, orderByForm1)).slice(pageForm1 * rowsPerPageForm1, pageForm1 * rowsPerPageForm1 + rowsPerPageForm1)
                                : stableSort(Rows.tableCustomer, getComparator(orderForm1, orderByForm1)))
                                .map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='5%' align="center" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='70%' align="left" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {row.gmm_booking_rating_title}

                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="center" >
                                            {(row.gmm_booking_rating_type === "Rating") &&
                                                <Box>
                                                    <Rating
                                                        name={row.gmm_booking_rating_id}
                                                        value={Number(row.gmm_booking_rating_vote)}
                                                        size="small"
                                                        max={5}
                                                        emptyIcon={<StarBorder fontSize="inherit" />}
                                                        readOnly
                                                    />
                                                </Box>}

                                            {(row.gmm_booking_rating_type === "Question") &&

                                                <Box >

                                                    <FormControl component="fieldset">
                                                        <RadioGroup row aria-label="position" value={row.gmm_booking_rating_vote} style={{ justifyContent: 'space-evenly' }}>
                                                            {checkings.map((elem, index) =>
                                                                <FormControlLabel style={{ marginLeft: '0px' }} key={elem.id} value={elem.id}
                                                                    classes={{ label: classes.font_normal }}
                                                                    control={<Radio color="primary" size="small" />}
                                                                    label={elem.name} >
                                                                </FormControlLabel>
                                                            )}
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Box>}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={3} align="center">
                                        ไม่พบข้อมูล
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        )
    }

    // Table Form 2

    const [pageForm2, setPageForm2] = useState(0);
    const [rowsPerPageForm2, setRowsPerPageForm2] = useState(25);
    const [orderForm2, setOrderForm2] = React.useState('asc');
    const [orderByForm2, setOrderByForm2] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const Expectation = [
        { value: '1' },
        { value: '2' },
        { value: '3' },
    ]
    const headCellExpects = [
        { id: 'id', label: '#', width: '5%', align: "center" },
        { id: 'header', label: 'การให้บริการตรงกับความคาดหวังของท่านเพียงใด', width: '35%', align: "center" },
        { id: 'level1', label: 'ควรปรับปรุง', width: '15%', align: "center" },
        { id: 'level2', label: 'พึงพอใจ', width: '15%', align: "center" },
        { id: 'level3', label: 'พึงพอใจมาก', width: '15%', align: "center" },
    ];

    function EnhancedTableHeadForm2(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCellExpects.map((headCell) => (
                        <StyledTableCell
                            key={headCell.id}
                            width={headCell.width}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'default'}
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

    const handleRequestSortForm2 = (event, property) => {
        const isAsc = orderByForm2 === property && orderForm2 === 'asc';
        setOrderForm2(isAsc ? 'desc' : 'asc');
        setOrderByForm2(property);
    };

    const handleChangePageForm2 = (event, newPage) => {
        setPageForm2(newPage);
    };

    const handleChangeRowsPerPageForm2 = (event) => {
        setRowsPerPageForm2(parseInt(event.target.value, 10));
        setPageForm2(0);
    };

    function TablePaginationActionsForm2(props) {
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

    function ViewTableForm2() {
        return (
            <>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <EnhancedTableHeadForm2
                            classes={classes}
                            order={orderForm2}
                            orderBy={orderByForm2}
                            onRequestSort={handleRequestSortForm2}
                        />
                        <TableBody>
                            {(rowsPerPageForm2 > 0
                                ? stableSort(Rows.tableCustomer, getComparator(orderForm2, orderByForm2)).slice(pageForm2 * rowsPerPageForm2, pageForm2 * rowsPerPageForm2 + rowsPerPageForm2)
                                : stableSort(Rows.tableCustomer, getComparator(orderForm2, orderByForm2)))
                                .map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='5%' align="center" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='35%' align="left" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {row.gmm_booking_rating_title}
                                        </StyledTableCell>

                                        <StyledTableCell colSpan={3}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <RadioGroup row aria-label="position" style={{ justifyContent: 'space-around' }}
                                                        value={row.gmm_booking_rating_vote}
                                                        defaultValue="top">
                                                        {Expectation.map((status) => (
                                                            <Box key={status.value}>
                                                                <FormControlLabel value={status.value}
                                                                    style={{ marginRight: 0, marginLight: 0 }}
                                                                    classes={{ label: classes.font_normal }}
                                                                    control={<Radio color="primary" />}
                                                                >
                                                                </FormControlLabel>
                                                            </Box>
                                                        ))}
                                                    </RadioGroup>
                                                </Grid>
                                            </Grid>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={7} align="center">
                                        ไม่พบข้อมูล
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={6}
                                    count={filtered.length}
                                    rowsPerPage={rowsPerPageForm2}
                                    page={pageForm2}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePageForm2}
                                    onChangeRowsPerPage={handleChangeRowsPerPageForm2}
                                    ActionsComponent={TablePaginationActionsForm2}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </>
        )
    }


    // Table Form 3

    const [pageForm3, setPageForm3] = useState(0);
    const [rowsPerPageForm3, setRowsPerPageForm3] = useState(25);
    const [orderForm3, setOrderForm3] = React.useState('asc');
    const [orderByForm3, setOrderByForm3] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน

    const headCellMeeter = [
        { id: 'id', label: '#', width: '5%', align: "center" },
        { id: 'gmm_location_route_name', label: 'จุดการเดินทาง', width: '60%', align: "center" },
        { id: 'gmm_location_meeter', label: 'ค่ามิเตอร์', width: '20%', align: "center" },
        { id: 'bath', label: 'หน่วย', width: '15%', align: "center" },
    ];

    function EnhancedTableHeadForm3(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCellMeeter.map((headCell) => (
                        <StyledTableCell
                            key={headCell.id}
                            width={headCell.width}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'default'}
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

    const handleRequestSortForm3 = (event, property) => {
        const isAsc = orderByForm3 === property && orderForm3 === 'asc';
        setOrderForm3(isAsc ? 'desc' : 'asc');
        setOrderByForm3(property);
    };

    const handleChangePageForm3 = (event, newPage) => {
        setPageForm3(newPage);
    };

    const handleChangeRowsPerPageForm3 = (event) => {
        setRowsPerPageForm3(parseInt(event.target.value, 10));
        setPageForm3(0);
    };

    function TablePaginationActionsForm3(props) {
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

    function ViewTableForm3() {
        return (
            <>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <EnhancedTableHeadForm3
                            classes={classes}
                            order={orderForm3}
                            orderBy={orderByForm3}
                            onRequestSort={handleRequestSortForm3}
                        />
                        <TableBody>
                            {(rowsPerPageForm3 > 0
                                ? stableSort(Rows.meeter, getComparator(orderForm3, orderByForm3)).slice(pageForm3 * rowsPerPageForm3, pageForm3 * rowsPerPageForm3 + rowsPerPageForm3)
                                : stableSort(Rows.meeter, getComparator(orderForm3, orderByForm3)))
                                .map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='5%' align="center" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='60%' align="left" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            <Chip className={classes.ChipStyle} label={row.gmm_location_route_name} color="primary" />   {row.gmm_location_name}
                                        </StyledTableCell >

                                        <StyledTableCell width='20%' align="center" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {row.gmm_location_meeter.toLocaleString("en-US")}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            บาท
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={4} align="center">
                                        ไม่พบข้อมูล
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={4}
                                    count={filtered.length}
                                    rowsPerPage={rowsPerPageForm3}
                                    page={pageForm3}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePageForm3}
                                    onChangeRowsPerPage={handleChangeRowsPerPageForm3}
                                    ActionsComponent={TablePaginationActionsForm3}
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
                        แบบฟอร์มประเมิน
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

            <Dialog
                onClose={handleClose}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="customized-dialog-title"
                open={open}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    ผลการประเมินจาก
                    {Rows.mesg === 'Customer' && 'ลูกค้า'}
                    {Rows.mesg === 'Taxi' && 'คนขับรถ'}
                    {Rows.mesg === 'Caregiver' && 'ผู้ดูแล'}
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <Card>
                                <CardContent style={{ paddingBottom: '16px' }}>
                                    <Grid container spacing={2} style={{ background: '#f7f7f7' }}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <List dense={true} style={{ padding: 0 }}>
                                                <ListItem style={{ paddingLeft: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src="/image/picon.png" style={{ background: '#FFCB08' }}>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="ผู้จอง"
                                                        secondary={Rows.gmm_passenger_fullname}
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <List dense={true} style={{ padding: 0 }}>
                                                <ListItem style={{ paddingLeft: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src="/image/passengericon.png" style={{ background: '#FFCB08' }}>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="ผู้โดยสาร"
                                                        secondary={Rows.gmm_passenger_fullname}
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <List dense={true} style={{ padding: 0 }}>
                                                <ListItem style={{ paddingLeft: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="พนักงานขับรถ"
                                                        secondary={Rows.gmm_emp_tx_fullname}
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <List dense={true} style={{ padding: 0 }}>
                                                <ListItem style={{ paddingLeft: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="ผู้ดูแล"
                                                        secondary={(Rows.gmm_emp_cg_fullname) ? Rows.gmm_emp_cg_fullname : '-'}
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>



                        {Rows.mesg === 'Customer' &&
                            <>
                                {Rows.status === 'rating' &&
                                    <Grid item xs={12} sm={12} md={12}>
                                        <ViewTableForm1 />
                                    </Grid>
                                }

                                {Rows.status === 'Expectation' &&
                                    <Grid item xs={12} sm={12} md={12}>
                                        <ViewTableForm2 />
                                    </Grid>

                                }

                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        name="desc"
                                        variant="outlined"
                                        label="ความคิดเห็น หรือข้อแนะนำ"
                                        rows={2}
                                        value={Rows.gmm_booking_comment_text}
                                        inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        multiline
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        }

                        {Rows.mesg === 'Taxi' &&
                            <>
                                <Grid item xs={12} sm={12} md={12}>
                                    <ViewTableForm1 />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Meeter classes={classes} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <ViewTableForm3 />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        name="desc"
                                        variant="outlined"
                                        label="รายละเอียดเพิ่มเติม"
                                        rows={2}
                                        value={Rows.gmm_booking_comment_taxi}
                                        inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        multiline
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        name="desc"
                                        variant="outlined"
                                        label="สิ่งที่ลูกค้าร้องเรียน หรือแนะนำ"
                                        rows={2}
                                        value={Rows.gmm_booking_recommend_taxi}
                                        inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        multiline
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        }

                        {Rows.mesg === 'Caregiver' &&
                            <>
                                <Grid item xs={12} sm={12} md={12}>
                                    <ViewTableForm1 />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        name="desc"
                                        variant="outlined"
                                        label="รายละเอียดเพิ่มเติม"
                                        rows={2}
                                        value={Rows.gmm_booking_comment_cg}
                                        inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        multiline
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        name="desc"
                                        variant="outlined"
                                        label="สิ่งที่ลูกค้าร้องเรียน หรือแนะนำ"
                                        rows={2}
                                        value={Rows.gmm_booking_recommend_cg}
                                        inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        multiline
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        }


                    </Grid>

                </MuiDialogContent>
            </Dialog>
        </>
    );
}
