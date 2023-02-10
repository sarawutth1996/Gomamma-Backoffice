/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    AppBar, Backdrop, Button, Box, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Tabs, Tab, Table, TableHead, TableSortLabel, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Add, Close, Edit, Person, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Save, Search } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import * as action from "../../actions/action";
import config from '../../config';

const AntTabs = withStyles({
    indicator: {
        backgroundColor: 'white',
    },
})(Tabs);

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
    root: {
        flexGrow: 1,
        border: '1px solid #eeeeee'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    btn_approve: {
        fontFamily: 'Regular',
        fontSize: '14px',
        color: 'white',
        backgroundColor: '#22a228',
        '&:hover': {
            backgroundColor: '#0b8211',
        }
    },
    itemCenter: {
        alignItems: "center",
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
    IconSearch: {
        color: 'gray'
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


function TabPanel(props) {
    const { children, value, index, classes, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2} className={classes.font_normal}>{children}</Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

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
                    <Typography className={classes.font_header}>อนุมัติการลา</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}


export default function Manage_leave() {
    const url = config.API_URL + "models/Employee/Employee_leave_form.php";
    const noti_url = config.API_URL + "models/Employee/NotificationAPI.php";
    const classes = useStyles();
    const state = useHistory();
    const { vision } = useParams();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const dispatch = useDispatch();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [datatable, setData] = useState([]);
    const [leave, setLeave] = useState([]);
    const [value, setValue] = useState(0);
    const [search, setSearch] = useState('');
    const [Filter, setFilter] = useState({ type: null });

    useEffect(() => {
        FirstLoad('PENDING');
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, []);

    async function FirstLoad(status) {

        // setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_form_approval",
            status: status
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            setFilter({ ...Filter, type: null })
            setSearch('')
            setData(res.data)
            setLeave(res.leave)
            setBoolean(false);
        }
    }

    async function senderNoti(addr, message) {
        const payload = JSON.stringify({
            title: 'Gomamma-Leave',
            message: message,
            empid: addr
        });

        const response = await fetch(noti_url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
    }

    async function Update_form(id, addr, status, message) {

        setBoolean(true);
        const payload = JSON.stringify({
            key: "Update_form",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            id: id,
            addr: addr,
            status: status,
            message: message,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
            }).then(() => {
                if (status === 'APPROVE' || status === 'REJECT') {
                    FirstLoad('PENDING');
                    if (status === 'APPROVE') {
                        senderNoti(addr, 'การลาของท่านอนุมัติแล้ว');
                    }

                    if (status === 'REJECT') {
                        const Payload = JSON.parse(localStorage.cnf_us);
                        const isData = { ...Payload, mail_leave: Payload.mail_leave - 1 };
                        localStorage.setItem("cnf_us", JSON.stringify(isData));
                        dispatch(action.setPromise(isData));
                        //-------------------------------------------------------------
                        senderNoti(addr, 'การลาของท่านไม่ได้รับการอนุมัติ สาเหตุ ' + message);
                    }
                } else if (status === 'CANCEL') {
                    const Payload = JSON.parse(localStorage.cnf_us);
                    const isData = { ...Payload, mail_leave: Payload.mail_leave - 1 };
                    localStorage.setItem("cnf_us", JSON.stringify(isData));
                    dispatch(action.setPromise(isData));
                    //-------------------------------------------------------------

                    FirstLoad('PENDING');
                    senderNoti(addr, 'การลาของท่านไม่ได้รับการอนุมัติ สาเหตุ ' + message);
                } else if (status === 'ACCIDENT') {
                    FirstLoad('APPROVE');
                    senderNoti(addr, 'การลาของท่านไม่ได้รับการอนุมัติ สาเหตุ ' + message);
                }
            })
        }
    }

    async function LoadFilter(value, status) {

        // setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Filter_data",
            value: value,
            status: status
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            setSearch('')
            setData(res.data)
            setBoolean(false);
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleChange = (event, newValue) => {

        if (newValue === 0) {
            FirstLoad('PENDING');
        } else if (newValue === 1) {
            FirstLoad('APPROVE');
        } else if (newValue === 2) {
            FirstLoad('REJECT');
        } else if (newValue === 3) {
            FirstLoad('CANCEL');
        }

        setValue(newValue);
        setData([]);
    };

    const filtered = datatable.filter((row) => {
        return row.gmm_leave_fullname.toLowerCase().includes(search.toLowerCase())
    })

    const handleType = (event, item) => {
        if (item) {
            setFilter({ ...Filter, type: item })

            if (value === 0) {
                LoadFilter('PENDING', item.gmm_leave_name_th);
            } else if (value === 1) {
                LoadFilter('APPROVE', item.gmm_leave_name_th);
            } else if (value === 2) {
                LoadFilter('REJECT', item.gmm_leave_name_th);
            } else if (value === 3) {
                LoadFilter('CANCEL', item.gmm_leave_name_th);
            }
        } else {
            if (value === 0) {
                FirstLoad('PENDING');
            } else if (value === 1) {
                FirstLoad('APPROVE');
            } else if (value === 2) {
                FirstLoad('REJECT');
            } else if (value === 3) {
                FirstLoad('CANCEL');
            }
        }

    }

    const handleAdd = (date) => {
        state.push('/Home/LeaveForm/' + vision + '/create');
    };

    const handleEdit = (row) => {
        state.push('/Home/LeaveForm/' + vision + '/' + row.gmm_leave_id);
    }

    const handleUpdate = (row, value) => {
        if (value === 'APPROVE') {
            Swal.fire({
                title: 'APPROVE',
                text: 'ท่านต้องการอนุมัติคำขอลา หรือไม่?',
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                //reverseButtons: true,
            }).then((output) => {
                if (output.isConfirmed) {
                    Update_form(row.gmm_leave_id, row.gmm_leave_addr, 'APPROVE', 'อนุมัติการลาเรียบร้อยแล้ว');
                }
            });
        } else if (value === 'REJECT') {
            Swal.fire({
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off',
                    maxlength: 256,
                },
                title: 'REJECT',
                text: 'กรุณาระบุรายละเอียดในการ ไม่อนุมัติคำขอลา',
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                preConfirm: (login) => {
                    if (login === "") {
                        Swal.showValidationMessage(
                            `Request Message`
                        )
                    }
                }
                //reverseButtons: true,
            }).then((output) => {
                if (output.isConfirmed && output.value !== "") {
                    Update_form(row.gmm_leave_id, row.gmm_leave_addr, 'REJECT', output.value);
                }
            });

        } else if (value === 'CANCEL') {
            Swal.fire({
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off',
                    maxlength: 256,
                },
                title: 'CANCEL',
                text: 'กรุณาระบุรายละเอียดในการ ยกเลิกคำขอลา',
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                preConfirm: (login) => {
                    if (login === "") {
                        Swal.showValidationMessage(
                            `Request Message`
                        )
                    }
                }
                //reverseButtons: true,
            }).then((output) => {
                if (output.isConfirmed && output.value !== "") {
                    Update_form(row.gmm_leave_id, row.gmm_leave_addr, 'CANCEL', output.value);
                }
            });
        } else if (value === 'ACCIDENT') {
            Swal.fire({
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off',
                    maxlength: 256,
                },
                title: 'CANCEL',
                text: 'กรุณาระบุรายละเอียดในการ ยกเลิกคำขอลา',
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                preConfirm: (login) => {
                    if (login === "") {
                        Swal.showValidationMessage(
                            `Request Message`
                        )
                    }
                }
                //reverseButtons: true,
            }).then((output) => {
                if (output.isConfirmed && output.value !== "") {
                    Update_form(row.gmm_leave_id, row.gmm_leave_addr, 'ACCIDENT', output.value);
                }
            });
        }
    }

    // TableCenter Func.

    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'object') {
            if (b[orderBy].desc < a[orderBy].desc) {
                return -1;
            }
            if (b[orderBy].desc > a[orderBy].desc) {
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

    // Table Form 1

    const [pageForm1, setPageForm1] = useState(0);
    const [rowsPerPageForm1, setRowsPerPageForm1] = useState(5);
    const [orderForm1, setOrderForm1] = React.useState('asc');
    const [orderByForm1, setOrderByForm1] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน


    const headCellsForm1 = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_leave_fullname', label: 'ชื่อ - นามสกุล', width: '20%', align: "left" },
        { id: 'gmm_leave_type', label: 'ประเภท', width: '15%', align: "left" },
        { id: 'gmm_leave_status', label: 'สถานะ', width: '15%', align: "left" },

        { id: 'Approv', label: '', width: '15%', align: "center" },
        { id: 'REJECT', label: '', width: '15%', align: "center" },
        { id: 'Edit', label: '', width: '5%', align: "center" },
        { id: 'Cancal', label: '', width: '5%', align: "center" }
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

    const handleChangePageForm1 = (event, newPage) => {
        setPageForm1(newPage);
    };

    const handleChangeRowsPerPageForm1 = (event) => {
        setRowsPerPageForm1(parseInt(event.target.value, 10));
        setPageForm1(0);
    };

    function TablePaginationActionsForm1(props) {
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
                        <EnhancedTableHeadForm1
                            classes={classes}
                            order={orderForm1}
                            orderBy={orderByForm1}
                            onRequestSort={handleRequestSortForm1}
                        />
                        <TableBody>
                            {(rowsPerPageForm1 > 0
                                ? stableSort(filtered, getComparator(orderForm1, orderByForm1)).slice(pageForm1 * rowsPerPageForm1, pageForm1 * rowsPerPageForm1 + rowsPerPageForm1)
                                : stableSort(filtered, getComparator(orderForm1, orderByForm1))).map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_leave_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_leave_type}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_leave_status === 'PENDING' &&
                                                <Box style={{ color: '#3f51b5' }}>รอการอนุมัติ</Box>
                                            }
                                        </StyledTableCell>


                                        <StyledTableCell width='15%' align="center" className={classes.padding_table}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={status}
                                                onClick={() => handleUpdate(row, 'APPROVE')}
                                                className={classes.btn_approve}
                                                fullWidth
                                            >
                                                อนุมัติ
                                            </Button>
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center" className={classes.padding_table}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                disabled={status}
                                                onClick={() => handleUpdate(row, 'REJECT')}
                                                className={classes.font_normal}
                                                fullWidth
                                            >
                                                ไม่อนุมัติ
                                            </Button>
                                        </StyledTableCell>

                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="ดูรายละเอียด" color='primary' onClick={() => handleEdit(row)} disabled={status}>
                                                <Search fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="ยกเลิกคำขอลา" color='secondary' onClick={() => handleUpdate(row, 'CANCEL')} disabled={status}>
                                                <Close fontSize="small" />
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
                                    rowsPerPage={rowsPerPageForm1}
                                    page={pageForm1}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePageForm1}
                                    onChangeRowsPerPage={handleChangeRowsPerPageForm1}
                                    ActionsComponent={TablePaginationActionsForm1}
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

    const headCellsForm2 = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_leave_fullname', label: 'ชื่อ - นามสกุล', width: '20%', align: "left" },
        { id: 'gmm_leave_type', label: 'ประเภท', width: '15%', align: "left" },
        { id: 'gmm_leave_desc', label: 'หมายเหตุ', width: '35%', align: "left" },
        { id: 'status', label: 'สถานะ', width: '15%', align: "left" },
        { id: 'Edit', label: '', width: '5%', align: "center" },
        { id: 'Close', label: '', width: '5%', align: "center" },
    ];

    function EnhancedTableHeadForm2(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCellsForm2.map((headCell) => (
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

    function ViewTableForm2({ filtered, status }) {
        return (
            <>
                <Box mt={2} />
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
                                : stableSort(filtered, getComparator(orderForm2, orderByForm2))).map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_leave_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_leave_type}
                                        </StyledTableCell>
                                        <StyledTableCell width='35%' align="left">
                                            {row.gmm_leave_desc}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_leave_status === 'APPROVE' &&
                                                <Box style={{ color: 'green' }}>อนุมัติ</Box>
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => handleEdit(row)} disabled={status}>
                                                <Search fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="ยกเลิกคำขอลา" color='secondary' onClick={() => handleUpdate(row, 'ACCIDENT')} disabled={status}>
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={6} align="center">
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
    const [rowsPerPageForm3, setRowsPerPageForm3] = useState(5);
    const [orderForm3, setOrderForm3] = React.useState('asc');
    const [orderByForm3, setOrderByForm3] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน


    const headCellsForm3 = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_leave_fullname', label: 'ชื่อ - นามสกุล', width: '20%', align: "left" },
        { id: 'gmm_leave_type', label: 'ประเภท', width: '15%', align: "left" },
        { id: 'gmm_leave_desc', label: 'หมายเหตุ', width: '35%', align: "left" },
        { id: 'status', label: 'สถานะ', width: '15%', align: "left" },
        { id: 'Edit', label: '', width: '5%', align: "center" },
    ];

    function EnhancedTableHeadForm3(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCellsForm3.map((headCell) => (
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

    function ViewTableForm3({ filtered, status }) {
        return (
            <>
                <Box mt={2} />
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
                                ? stableSort(filtered, getComparator(orderForm3, orderByForm3)).slice(pageForm3 * rowsPerPageForm3, pageForm3 * rowsPerPageForm3 + rowsPerPageForm3)
                                : stableSort(filtered, getComparator(orderForm3, orderByForm3))).map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_leave_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_leave_type}
                                        </StyledTableCell>
                                        <StyledTableCell width='35%' align="left">
                                            {row.gmm_leave_desc}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_leave_status === 'REJECT' &&
                                                <Box style={{ color: 'red' }}>ไม่อนุมัติ</Box>
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => handleEdit(row)} disabled={status}>
                                                <Search fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={6} align="center">
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

    // Table Form 4

    const [pageForm4, setPageForm4] = useState(0);
    const [rowsPerPageForm4, setRowsPerPageForm4] = useState(5);
    const [orderForm4, setOrderForm4] = React.useState('asc');
    const [orderByForm4, setOrderByForm4] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน


    const headCellsForm4 = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_leave_fullname', label: 'ชื่อ - นามสกุล', width: '20%', align: "left" },
        { id: 'gmm_leave_type', label: 'ประเภท', width: '15%', align: "left" },
        { id: 'gmm_leave_note', label: 'หมายเหตุ', width: '35%', align: "left" },
        { id: 'status', label: 'สถานะ', width: '15%', align: "left" },
        { id: 'Edit', label: '', width: '5%', align: "center" },
    ];

    function EnhancedTableHeadForm4(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCellsForm4.map((headCell) => (
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

    const handleRequestSortForm4 = (event, property) => {
        const isAsc = orderByForm4 === property && orderForm4 === 'asc';
        setOrderForm4(isAsc ? 'desc' : 'asc');
        setOrderByForm4(property);
    };

    const handleChangePageForm4 = (event, newPage) => {
        setPageForm4(newPage);
    };

    const handleChangeRowsPerPageForm4 = (event) => {
        setRowsPerPageForm4(parseInt(event.target.value, 10));
        setPageForm4(0);
    };

    function TablePaginationActionsForm4(props) {
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

    function ViewTableForm4({ filtered, status }) {
        return (
            <>
                <Box mt={2} />
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <EnhancedTableHeadForm4
                            classes={classes}
                            order={orderForm4}
                            orderBy={orderByForm4}
                            onRequestSort={handleRequestSortForm2}
                        />
                        <TableBody>
                            {(rowsPerPageForm4 > 0
                                ? stableSort(filtered, getComparator(orderForm4, orderByForm4)).slice(pageForm4 * rowsPerPageForm4, pageForm4 * rowsPerPageForm4 + rowsPerPageForm4)
                                : stableSort(filtered, getComparator(orderForm4, orderByForm4))).map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_leave_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_leave_type}
                                        </StyledTableCell>

                                        <StyledTableCell width='35%' align="left">
                                            {row.gmm_leave_note}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_leave_status === 'CANCEL' &&
                                                <Box style={{ color: 'red' }}>ยกเลิกคำขอลา</Box>

                                            }
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => handleEdit(row)} disabled={status}>
                                                <Search fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={6} align="center">
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
                                    rowsPerPage={rowsPerPageForm4}
                                    page={pageForm4}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePageForm4}
                                    onChangeRowsPerPage={handleChangeRowsPerPageForm4}
                                    ActionsComponent={TablePaginationActionsForm4}
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
                        disabled={status}
                        onClick={handleAdd}
                        startIcon={<Add />}
                        fullWidth
                    >
                        สร้างแบบฟอร์ม
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


                <Grid item xs={12}>
                    <PageLine />
                </Grid>
                <Hidden only={['xs']}>
                    <Grid item xs={4} />
                </Hidden>
                <Grid item xs={12} sm={4} mb={4}>
                    <Autocomplete
                        classes={{
                            input: classes.font_normal,
                            option: classes.font_normal,
                        }}
                        options={leave}
                        getOptionLabel={(value) => value.gmm_leave_name_th}
                        getOptionSelected={(option, value) =>
                            option.gmm_leave_id === value.gmm_leave_id
                        }
                        value={Filter.type}
                        onChange={handleType}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="ประเภท"
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
                <Grid item xs={12} sm={4} mb={4}>
                    <TextField
                        margin="dense"
                        variant="outlined"
                        placeholder="ค้นหารายชื่อ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                    <Box className={classes.root}>
                        <AppBar position="static" color="primary">
                            <AntTabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                <Tab className={classes.font_normal} label="รอการอนุมัติ" {...a11yProps(0)} />
                                <Tab className={classes.font_normal} label="อนุมัติ" {...a11yProps(1)} />
                                <Tab className={classes.font_normal} label="ไม่อนุมัติ" {...a11yProps(2)} />
                                <Tab className={classes.font_normal} label="ยกเลิกคำขอลา" {...a11yProps(3)} />
                            </AntTabs>
                        </AppBar>
                        <TabPanel value={value} index={0} classes={classes}>
                            <ViewTableForm1 filtered={filtered} status={promise} />
                        </TabPanel>
                        <TabPanel value={value} index={1} classes={classes}>
                            <ViewTableForm2 filtered={filtered} status={promise} />
                        </TabPanel>
                        <TabPanel value={value} index={2} classes={classes}>
                            <ViewTableForm3 filtered={filtered} status={promise} />
                        </TabPanel>
                        <TabPanel value={value} index={3} classes={classes}>
                            <ViewTableForm4 filtered={filtered} status={promise} />
                        </TabPanel>
                    </Box>
                </Grid>
            </Grid>

        </>
    );
}
