/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import {
    Avatar, Backdrop, Button, Box, TextField, Typography, Grid, FormHelperText, IconButton,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, Card, CardContent,
    List, ListItem, ListItemAvatar, ListItemText, FormControlLabel, FormControl, Radio, RadioGroup
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import { Check, Save, StarHalf, LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft, StarBorder } from "@material-ui/icons";
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
        // border: 'solid 1px #e0e0e0',
        fontFamily: "Regular",
        fontSize: 14,
    }

}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        '&:nth-of-type(odd)': {
            fontFamily: "Regular",
            fontSize: 14,
            border: 'soild'
        },
    },
}))(TableRow);

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
                    <Typography className={classes.font_header}>แบบฟอร์มประเมิน</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

const content = {
    bid: null,
    user: null,
    desc: '',
}

export default function AdminFormEvaluation() {
    const url = config.API_URL + "models/Admin/Admin_rating.php";
    const classes = useStyles();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const { vision } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [Form, setForm] = useState(content);
    const [msgCount, setMsgCount] = useState(0);
    const [selected, setSelected] = useState(null);
    const [promise, setPromise] = useState(false)
    const [usermstr, setPassenger] = useState([]);
    const [bookmstr, setBooking] = useState([])
    const [item, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(''); // ให้มาถึง sort ตัวไหนก่อน

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    const checkings = [
        { id: '1', name: 'ใช่' },
        { id: '2', name: 'ไม่ใช่' }
    ]

    const headCellRatings = [
        { id: 'id', label: '#', width: '5%', align: "center" },
        { id: 'header', label: 'หัวข้อการประเมิน', width: '70%', align: "center" },
        { id: 'rate', label: 'คะแนนความคิดเห็น', width: '25%', align: "center" },
    ];

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_form",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            setPassenger(res.usermstr)
            setBoolean(false);
        }
    }

    async function selectUsers(uid) {
        setData([])
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "SelectUser",
            uid: uid
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {

            setBooking(res.booking)
            setBoolean(false);
        }
    }

    async function selectBookings(bookid) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "SelectBooking",
            bid: bookid
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            setSelected(res.selected);
            setData(res.data)
            setBoolean(false);
        }
    }

    async function SaveData() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_comment_user",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            Form: Form,
            item: item
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: 'บันทึกข้อมูลสำเร็จ',
                icon: "success",
            }).then(() => {
                state.push('/Home/AdminSummary/' + vision);
            })
        }
    }

    const handleSelectUser = (ev, item) => {
        if (item) {
            selectUsers(item.gmm_user_id)
            setForm({ ...Form, user: item, bid: null })
        }
    }

    const handleSelectBooking = (ev, item) => {
        if (item) {
            selectBookings(item.gmm_booking_nbr)
            setForm({ ...Form, bid: item })
        }
    }

    const handleChangeRadio = (id, index) => {
        let newArr = [...item];
        newArr[index]['radio_checking'] = id
        setData(newArr)
    }

    const handleChangeExpectation = (id, index) => {

        let newArr = [...item];
        newArr[index]['Expectation'] = id
        setData(newArr)
    }

    const handleChangeActive = (event, action) => {
        const { target } = event;
        const { name } = target;

        let newArr = [...item];

        newArr.find((item, index) => {
            if (name === item.gmm_rating_id) {
                newArr[index]['rating'] = action
                setData(newArr)
                return
            }
        })
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleConfirm = (event) => {
        event.preventDefault();
        let recheck = true;
        for (let i = 0; i < item.length; i++) {
            if (item[i]['gmm_rating_require'] === 'ON' && item[i]['rating'] === 0) {
                recheck = false;
            }
        }

        if (recheck) {
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
                    SaveData();
                }
            });
        } else {
            alert_message('กรุณากรอกแบบประเมิน')
        }
    }


    const alert_message = (txt) => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: txt,
            icon: "warning",
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
                    {headCellRatings.map((headCell) => (
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

    function ViewTableForm1({ filtered, status }) {
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
                                        <StyledTableCell width='5%' align="center" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='70%' align="left" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {row.gmm_rating_name}

                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="center" >
                                            {(row.gmm_rating_type === "Rating") &&
                                                <Box>
                                                    <Rating
                                                        name={row.gmm_rating_id}
                                                        value={row.rating}
                                                        onChange={handleChangeActive}
                                                        size="medium"
                                                        max={5}
                                                        emptyIcon={<StarBorder fontSize="inherit" />}
                                                        required
                                                    />
                                                </Box>}

                                            {(row.gmm_rating_type === "Question") &&
                                                <Box>
                                                    <FormControl component="fieldset">
                                                        <RadioGroup row aria-label="position" value={row.radio_checking} onChange={(ev, item) => { handleChangeRadio(item, index) }} style={{ justifyContent: 'space-evenly' }}>
                                                            {checkings.map((elem, index) =>
                                                                <FormControlLabel style={{ marginLeft: '0px' }} key={elem.id} value={elem.id}
                                                                    classes={{ label: classes.font_normal }}
                                                                    control={<Radio color="primary" required />}
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
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
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

    // Table Form 2

    const [pageForm2, setPageForm2] = useState(0);
    const [rowsPerPageForm2, setRowsPerPageForm2] = useState(5);
    const [orderForm2, setOrderForm2] = React.useState('asc');
    const [orderByForm2, setOrderByForm2] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน


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

    const Expectation = [
        { value: '1' },
        { value: '2' },
        { value: '3' },
    ]

    function ViewTableForm2({ filtered, status }) {
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
                                ? stableSort(filtered, getComparator(orderForm2, orderByForm2)).slice(pageForm2 * rowsPerPageForm2, pageForm2 * rowsPerPageForm2 + rowsPerPageForm2)
                                : stableSort(filtered, getComparator(orderForm2, orderByForm2)))
                                .map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='5%' align="center" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='35%' align="left" style={{ borderRight: 'solid 1px #e0e0e0' }}>
                                            {row.gmm_rating_name}
                                        </StyledTableCell>

                                        <StyledTableCell colSpan={3}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <RadioGroup row aria-label="position" style={{ justifyContent: 'space-around' }}
                                                        value={row.Expectation}
                                                        onChange={(ev, item) => { handleChangeExpectation(item, index) }}
                                                        defaultValue="top">
                                                        {Expectation.map((status) => (
                                                            <Box key={status.value}>
                                                                {(row.gmm_rating_require === 'ON') &&
                                                                    <FormControlLabel value={status.value}
                                                                        style={{ marginRight: 0, marginLight: 0 }}
                                                                        classes={{ label: classes.font_normal }}
                                                                        control={<Radio color="primary" required />}
                                                                    >
                                                                    </FormControlLabel>}

                                                                {(row.gmm_rating_require === 'OFF') &&
                                                                    <FormControlLabel value={status.value}
                                                                        style={{ marginRight: 0, marginLight: 0 }}
                                                                        classes={{ label: classes.font_normal }}
                                                                        control={<Radio color="primary" />}
                                                                    >
                                                                    </FormControlLabel>}
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
                                    colSpan={7}
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

    function ButtonSubmit({ classes, status }) {
        return (
            <>
                <Box mt={3} mb={2} className={classes.Submit}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        startIcon={<Save />}
                    >
                        บันทึก
                    </Button>
                </Box>
            </>
        )
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />

            <form onSubmit={handleConfirm}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                        <Autocomplete
                            classes={{
                                input: classes.font_normal,
                                option: classes.font_normal,
                            }}
                            options={usermstr}
                            getOptionLabel={(value) => value.gmm_user_fullname}
                            getOptionSelected={(option, value) =>
                                option.gmm_user_id === value.gmm_user_id
                            }
                            value={Form.user}
                            onChange={handleSelectUser}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="ผู้จอง"
                                    margin="dense"
                                    variant="outlined"
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    required
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Autocomplete
                            classes={{
                                input: classes.font_normal,
                                option: classes.font_normal,
                            }}
                            options={bookmstr}
                            getOptionLabel={(value) => value.gmm_booking_nbr}
                            getOptionDisabled={(option) => option.gmm_booking_actives_comment === 'ACTIVE'}
                            getOptionSelected={(option, value) =>
                                option.gmm_booking_nbr === value.gmm_booking_nbr
                            }
                            value={Form.bid}
                            onChange={handleSelectBooking}
                            renderOption={(option) => {
                                return (
                                    <>
                                        {option.gmm_booking_nbr} &nbsp; {(option.gmm_booking_actives_comment === 'ACTIVE') ?
                                            <Check color="primary" style={{ fontSize: '14px' }} /> : null}
                                    </>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="เลขที่การเดินทาง"
                                    margin="dense"
                                    variant="outlined"
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    required
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <br />
                {Form.bid !== null &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <Card>
                                <CardContent style={{ paddingBottom: '16px' }}>
                                    {/* <b>ผู้โดยสาร :</b> {Form.bid.gmm_passenger_fullname} */}
                                    <Grid container spacing={2} style={{ background: '#f7f7f7' }}>
                                        <Grid item xs={12} sm={4}>
                                            <List dense={true} style={{ padding: 0 }}>
                                                <ListItem style={{ paddingLeft: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src="/image/passengericon.png" style={{ background: '#FFCB08' }}>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={Form.bid.gmm_passenger_fullname}
                                                        secondary="ผู้โดยสาร"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <List dense={true} style={{ padding: 0 }}>
                                                <ListItem style={{ paddingLeft: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={Form.bid.gmm_emp_tx_fullname}
                                                        secondary="พนักงานขับรถ"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <List dense={true} style={{ padding: 0 }}>
                                                <ListItem style={{ paddingLeft: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={(Form.bid.gmm_emp_cg_fullname) ? Form.bid.gmm_emp_cg_fullname : '-'}
                                                        secondary="ผู้ดูแล"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                        </Grid>
                    </Grid>
                }

                <Grid container spacing={2}>
                    {selected === 'rating' &&
                        <Grid item xs={12} sm={12} md={12}>
                            <ViewTableForm1 filtered={item} status={promise} />
                        </Grid>
                    }

                    {selected === 'Expectation' &&
                        <Grid item xs={12} sm={12} md={12}>
                            <ViewTableForm2 filtered={item} status={promise} />
                        </Grid>
                    }
                </Grid>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="desc"
                            variant="outlined"
                            label="ความคิดเห็น หรือข้อแนะนำ"
                            rows={2}
                            value={Form.desc}
                            onChange={(event) => {
                                setForm({ ...Form, desc: event.target.value });
                                setMsgCount(event.target.value.length);
                            }}
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
                        <FormHelperText className={classes.font_small_right}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} >
                        <ButtonSubmit classes={classes} status={promise} />
                    </Grid>
                </Grid>
            </form>
        </>
    );
}
