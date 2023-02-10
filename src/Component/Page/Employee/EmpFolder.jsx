/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AppBar, Backdrop, Button, Box, Card, CardContent, Container, TextField, Typography, Grid, IconButton, InputAdornment, Hidden, FormLabel, FormControlLabel, FormControl, Radio, RadioGroup,
    Tabs, Tab, Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, TableSortLabel, Paper, FormHelperText
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Close, Edit, Person, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Refresh, Save, } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import Swal from 'sweetalert2'
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
    font_subheader: {
        fontFamily: 'Regular',
        margin: '4px',
        fontSize: '14px'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    font_mobile_otp: {
        fontFamily: 'Regular',
        fontSize: '24px',
        textAlign: 'center'
    },
    font_small: {
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
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
                    <Typography className={classes.font_header}>แฟ้มประวัติ</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function ButtonSubmit({ classes, status }) {
    return (
        <>
            <Box mt={2} mb={2} className={classes.Submit}>
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

const Folder1 = {
    id: '',
    KeyDate: null,
    result: null,
    desc: '',
}

const Folder2 = {
    id: '',
    topic: '',
    KeyDate: null,
    desc: '',
}



export default function EmpFolder() {
    const url = config.API_URL + "models/Employee/Employee.php";
    const classes = useStyles();
    const { vision, id } = useParams();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false);
    const [Hidd, setHidd] = useState(false);
    const [value, setValue] = useState(0);
    const [choice, setChoice] = useState([]);
    const [dataForm1, setDataForm1] = useState([]);
    const [dataForm2, setDataForm2] = useState([])
    const [Form1, setForm1] = useState(Folder1);
    const [Form2, setForm2] = useState(Folder2);
    const [msgCountForm1, setMsgCountForm1] = useState(0);
    const [msgCountForm2, setMsgCountForm2] = useState(0);

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_emp_allinspection",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setChoice(res.choice);
            setDataForm1(res.form1);
            setDataForm2(res.form2);
            setBoolean(false);
        }
    }

    async function ReLoad(value) {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_emp_inspection",
            id: id,
            value: value
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (value === '1') {
                setChoice(res.choice);
                setDataForm1(res.data);
            } else {
                setDataForm2(res.data);
            }
            setBoolean(false);
        }
    }

    async function SaveData(value) {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_inspection",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: (value === '1' ? Form1 : Form2),
            id: id,
            value: value
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: res.message,
                icon: "success",
            }).then(() => {
                ReLoad(res.value);
                Clear();
            })

        }
    }

    async function delete_record(id, addr, value) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Delete_record",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            id: id,
            addr: addr,
            value: value
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
                ReLoad(res.value);
            })

        }
    }

    const Clear = () => {
        setForm1(Folder1)
        setForm2(Folder2)
        setHidd(false)
        setMsgCountForm1(0)
        setMsgCountForm2(0)

    }

    const Change_fm = (date) => {
        let frag = date.split('/');
        let merg = frag[1] + '/' + frag[0] + '/' + frag[2]
        return merg
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // Clear();
    };

    const handleDateForm1 = (date) => {
        setForm1({ ...Form1, KeyDate: date });
    }

    const handleDateForm2 = (date) => {
        setForm2({ ...Form2, KeyDate: date });
    }

    const handleEditForm1 = (row) => {
        let new_fm = Change_fm(row.gmm_emp_due_date);
        setHidd(true);
        setForm1({ ...Form1, id: row.gmm_emp_id, KeyDate: new_fm, result: row.gmm_emp_item, desc: row.gmm_emp_desc })
        setMsgCountForm1(row.gmm_emp_desc.length);
    }

    const handleEditForm2 = (row) => {
        let new_fm = Change_fm(row.gmm_emp_due_date);
        setHidd(true);
        setForm2({ ...Form2, id: row.gmm_emp_id, KeyDate: new_fm, topic: row.gmm_emp_header, desc: row.gmm_emp_desc })
        setMsgCountForm2(row.gmm_emp_desc.length);
    }

    const handleResult = (event, item) => {
        setForm1({ ...Form1, result: item });
    };

    const handleDelete = (row, value) => {
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
                delete_record(row.gmm_emp_id, row.gmm_emp_addr, value);
            }
        });
    }

    const form1Submit = (event) => {
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
                SaveData('1');
            }
        });
    }

    const form2Submit = (event) => {
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
                SaveData('2');
            }
        });
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
        { id: 'gmm_emp_due_date', label: 'วันที่ตรวจสอบ', width: '25%', align: "left" },
        { id: 'gmm_emp_results_desc', label: 'ผลการตรวจสอบ', width: '30%', align: "left" },
        { id: 'gmm_emp_desc', label: 'รายละเอียดเพิ่มเติม', width: '25%', align: "left" },
        { id: 'edit', label: '', width: '5%', align: "left" },
        { id: 'delete', label: '', width: '5%', align: "left" },
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
                                : stableSort(filtered, getComparator(orderForm1, orderByForm1)))
                                .map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="left">
                                            {row.gmm_emp_due_date}
                                        </StyledTableCell>
                                        <StyledTableCell width='30%' align="left">
                                            {row.gmm_emp_results_desc}
                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="left">
                                            {(row.gmm_emp_desc === '') ? "-" : row.gmm_emp_desc}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => { handleEditForm1(row) }} disabled={status}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="ลบข้อมูล" color='secondary' onClick={() => { handleDelete(row, '1') }} disabled={status}>
                                                <Close fontSize="small" />
                                            </IconButton>
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
        { id: 'gmm_emp_due_date', label: 'วันที่อบรม', width: '25%', align: "left" },
        { id: 'gmm_emp_header', label: 'หัวข้อการอบรม', width: '30%', align: "left" },
        { id: 'gmm_emp_desc', label: 'รายละเอียดเพิ่มเติม', width: '25%', align: "left" },
        { id: 'edit', label: '', width: '5%', align: "left" },
        { id: 'delete', label: '', width: '5%', align: "left" },
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
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="left">
                                            {row.gmm_emp_due_date}
                                        </StyledTableCell>
                                        <StyledTableCell width='30%' align="left">
                                            {row.gmm_emp_header}
                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="left">
                                            {(row.gmm_emp_desc === '') ? "-" : row.gmm_emp_desc}
                                        </StyledTableCell>

                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => { handleEditForm2(row) }} disabled={status}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="ลบข้อมูล" color='secondary' onClick={() => { handleDelete(row, '2') }} disabled={status}>
                                                <Close fontSize="small" />
                                            </IconButton>
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

    function ButtonForm1({ classes, status }) {
        return (
            <>
                <Box className={classes.Submit}>
                    {Hidd === true ?
                        <>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={status}
                                onClick={() => { Clear() }}
                                className={classes.font_normal}
                                startIcon={<Refresh />}
                            >
                                ล้างข้อมูล
                            </Button>
                            &nbsp; &nbsp;
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={status}
                                className={classes.font_normal}
                                startIcon={<Edit />}
                            >
                                แก้ไขข้อมูล
                            </Button>
                        </>
                        :
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
                    }
                </Box>
            </>
        )
    }

    function ButtonForm2({ classes, status }) {
        return (
            <>
                <Box className={classes.Submit}>
                    {Hidd === true ?
                        <>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={status}
                                onClick={() => { Clear() }}
                                className={classes.font_normal}
                                startIcon={<Refresh />}
                            >
                                ล้างข้อมูล
                            </Button>
                            &nbsp; &nbsp;
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={status}
                                className={classes.font_normal}
                                startIcon={<Edit />}
                            >
                                แก้ไขข้อมูล
                            </Button>
                        </>
                        :
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
                    }
                </Box>
            </>
        )
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
                <Box className={classes.root}>
                    <AppBar position="static" color="primary">
                        <AntTabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab className={classes.font_normal} label="ประวัติอาชญากรรม" {...a11yProps(0)} />
                            <Tab className={classes.font_normal} label="อบรม" {...a11yProps(1)} />
                        </AntTabs>
                    </AppBar>
                    <TabPanel value={value} index={0} classes={classes}>
                        <form onSubmit={form1Submit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6}>
                                    <KeyboardDatePicker
                                        label="วันที่ตรวจสอบ"
                                        placeholder="วัน/เดือน/ปี"
                                        format="dd/MM/yyyy"
                                        value={Form1.KeyDate}
                                        onChange={handleDateForm1}
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
                                <Grid item xs={12} sm={12} md={6}>
                                    <Autocomplete
                                        classes={{
                                            input: classes.font_normal,
                                            option: classes.font_normal,
                                        }}
                                        options={choice}
                                        getOptionLabel={(value) => value.gmm_choice_name}
                                        getOptionSelected={(option, value) =>
                                            option.gmm_choice_id === value.gmm_choice_id
                                        }
                                        value={Form1.result}
                                        onChange={handleResult}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="ผลการตรวจสอบ"
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
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        value={Form1.desc}
                                        onChange={(event) => {
                                            setForm1({ ...Form1, desc: event.target.value });
                                            setMsgCountForm1(event.target.value.length);
                                        }}
                                        placeholder="รายละเอียดเพิ่มเติม"
                                        variant="outlined"
                                        rows={3}
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
                                    <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCountForm1} / 256</FormHelperText>
                                </Grid>
                                <Grid item xs={12} >
                                    <ButtonForm1 classes={classes} status={promise} />
                                </Grid>
                            </Grid>
                        </form>
                        <Box mt={2} />
                        <ViewTableForm1 filtered={dataForm1} status={promise} />
                    </TabPanel>
                    <TabPanel value={value} index={1} classes={classes}>
                        <form onSubmit={form2Submit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6}>
                                    <KeyboardDatePicker
                                        label="วันที่อบรม"
                                        placeholder="วัน/เดือน/ปี"
                                        format="dd/MM/yyyy"
                                        value={Form2.KeyDate}
                                        onChange={handleDateForm2}
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
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        value={Form2.topic}
                                        onChange={(event) => { setForm2({ ...Form2, topic: event.target.value }) }}
                                        placeholder="หัวข้อการอบรม"
                                        variant="outlined"
                                        margin="dense"
                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        value={Form2.desc}
                                        onChange={(event) => {
                                            setForm2({ ...Form2, desc: event.target.value });
                                            setMsgCountForm2(event.target.value.length);
                                        }}
                                        placeholder="รายละเอียดเพิ่มเติม"
                                        variant="outlined"
                                        rows={3}
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
                                    <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCountForm2} / 256</FormHelperText>
                                </Grid>
                                <Grid item xs={12} >
                                    <ButtonForm2 classes={classes} status={promise} />
                                </Grid>
                            </Grid>
                        </form>
                        <Box mt={2} />
                        <ViewTableForm2 filtered={dataForm2} status={promise} />
                    </TabPanel>
                </Box>

            </MuiPickersUtilsProvider>


        </>
    )
}
