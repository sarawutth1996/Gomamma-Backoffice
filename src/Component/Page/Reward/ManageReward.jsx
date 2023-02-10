/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AppBar, Backdrop, Button, Box, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Tabs, Tab, Table, TableHead, TableSortLabel, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Add, Close, Edit, LocalOffer, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Search, GetApp, Description } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import exportToExcel from '../../exportToExcel/Excel_code';
import config from '../../config'

const AntTabs = withStyles({
    indicator: {
        backgroundColor: 'white',
    },
})(Tabs);


const custom_overlay = {
    overlay: {
        zIndex: 9999,
    },
}


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
    responsive_image: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '75%',
        cursor: 'pointer'
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

    font_eng_normal: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textTransform: 'none',

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
                    <Description />
                    <Typography className={classes.font_header}>รายการของรางวัล</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}


export default function ManageReward() {
    const url = config.API_URL + "models/Reward/Reward_item.php";
    const classes = useStyles();
    const state = useHistory();
    const { vision } = useParams();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const [selectedImage, setSelectedImage] = useState({ path: '' });
    const [PreviewOpen, setPreview] = useState(false);
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [datatable, setData] = useState([]);
    const [value, setValue] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => {
        FirstLoad('PRODUCT');
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, []);

    async function FirstLoad(type) {
        // setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_datatable",
            type: type
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            setData(res.data)
            setBoolean(false);
            setSelectedImage({ ...selectedImage, path: '/image/demo_img.jpg' })
        }
    }

    async function delete_reward(id, type) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Delete_reward",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            id: id,
            type: type
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
                FirstLoad(type);
            })

        } else {
            setBoolean(false);
            alert_message('ข้อมูลถูกใช้อยู่ในระบบ');
        }
    }

    async function Update_status(item, id, type) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Update_active",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            status: item,
            id: id,
            type: type,
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
                FirstLoad(type);
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

    const handleChange = (event, newValue) => {

        if (newValue === 0) {
            FirstLoad('PRODUCT');
        } else if (newValue === 1) {
            FirstLoad('COUPON');
        } else if (newValue === 2) {
            FirstLoad('ECOUPON');
        }

        setValue(newValue);
        setData([]);
    };

    const handlePreviewOpen = (row) => {
        setSelectedImage({ ...selectedImage, path: row.image })
        setPreview(true);
    }

    const handlePreviewClose = () => {
        setPreview(false)
    }

    const filtered = datatable.filter((row) => {
        return row.gmm_reward_item_coupon_name.toLowerCase().includes(search.toLowerCase())
    })


    const handleAdd = () => {
        state.push('/Home/Reward/' + vision + '/create');
    };

    const handleEdit = (row) => {
        state.push('/Home/Reward/' + vision + '/' + row.gmm_reward_item_id);
    }

    const handleActive = (row) => {
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
                Update_status(row.gmm_reward_item_active, row.gmm_reward_item_id, row.gmm_reward_item_type);
            }
        });
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
                delete_reward(row.gmm_reward_item_id, row.gmm_reward_item_type);
            }
        });
    }


    async function eCoupon_json(id) {
        const payload = JSON.stringify({
            key: "eCoupon_json",
            id: id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            const json = res.data
            const body = res.body
            const files_name = res.file
            const sheet_name = res.sheet

            exportToExcel(files_name, sheet_name, body, json)
        }
    }

    const handleExport = (row) => {
        eCoupon_json(row.gmm_reward_item_id)
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
        { id: 'picture', label: 'รูปภาพ', width: '10%', align: "left" },
        { id: 'gmm_reward_item_name', label: 'รายการ', width: '35%', align: "left" },
        { id: 'gmm_reward_item_baln', label: 'จำนวนคงเหลือ', width: '15%', align: "center" },
        { id: 'gmm_reward_item_point', label: 'Point', width: '15%', align: "center" },
        { id: 'gmm_reward_item_active', label: 'Active', width: '20%', align: "center" },
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
                                        <StyledTableCell width='10%' align="left">
                                            <img src={row.image}
                                                onClick={() => { handlePreviewOpen(row) }}
                                                alt="Gomamma"
                                                className={classes.responsive_image}></img>
                                        </StyledTableCell>
                                        <StyledTableCell width='40%' align="left">
                                            {row.gmm_reward_item_coupon_name}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.gmm_reward_item_baln}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.gmm_reward_item_point}
                                        </StyledTableCell>


                                        <StyledTableCell width='20%' align="center">
                                            <Button
                                                title="Active"
                                                variant={row.gmm_reward_item_active === 'ACTIVE' ? 'contained' : 'outlined'}
                                                color="primary"
                                                disabled={status}
                                                onClick={() => { handleActive(row) }}
                                                className={classes.font_normal}
                                                fullWidth
                                            >
                                                {row.gmm_reward_item_active}
                                            </Button>
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
        { id: 'picture', label: 'รูปภาพ', width: '10%', align: "left" },
        { id: 'gmm_reward_item_name', label: 'รายการ', width: '40%', align: "left" },
        { id: 'gmm_reward_item_baln', label: 'จำนวนคงเหลือ', width: '15%', align: "center" },
        { id: 'gmm_reward_item_point', label: 'Point', width: '15%', align: "center" },
        { id: 'gmm_reward_item_active', label: 'Active', width: '20%', align: "center" },
        { id: 'Edit', label: '', width: '5%', align: "center" },
        { id: 'Cancal', label: '', width: '5%', align: "center" }
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
                                        <StyledTableCell width='10%' align="left">
                                            <img src={row.image}
                                                onClick={() => { handlePreviewOpen(row) }}
                                                alt="Gomamma"
                                                className={classes.responsive_image}></img>
                                        </StyledTableCell>
                                        <StyledTableCell width='35%' align="left">
                                            {row.gmm_reward_item_coupon_name}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.gmm_reward_item_baln}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.gmm_reward_item_point}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="center">
                                            <Button
                                                title="Active"
                                                variant={row.gmm_reward_item_active === 'ACTIVE' ? 'contained' : 'outlined'}
                                                color="primary"
                                                disabled={status}
                                                onClick={() => { handleActive(row) }}
                                                className={classes.font_normal}
                                                fullWidth
                                            >
                                                {row.gmm_reward_item_active}
                                            </Button>
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
        { id: 'picture', label: 'รูปภาพ', width: '10%', align: "left" },
        { id: 'gmm_reward_item_name', label: 'รายการ', width: '35%', align: "left" },
        { id: 'gmm_reward_item_baln', label: 'จำนวนคงเหลือ', width: '15%', align: "center" },
        { id: 'gmm_reward_item_point', label: 'Point', width: '15%', align: "center" },
        { id: 'gmm_reward_item_active', label: 'Active', width: '20%', align: "center" },
        { id: 'Export', label: 'Export', width: '5%', align: "center" },
        { id: 'Edit', label: '', width: '5%', align: "center" },
        { id: 'Cancal', label: '', width: '5%', align: "center" }
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
                                        <StyledTableCell width='10%' align="left">
                                            <img src={row.image}
                                                onClick={() => { handlePreviewOpen(row) }}
                                                alt="Gomamma"
                                                className={classes.responsive_image}></img>
                                        </StyledTableCell>
                                        <StyledTableCell width='35%' align="left">
                                            {row.gmm_reward_item_coupon_name}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.gmm_reward_item_baln}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="center">
                                            {row.gmm_reward_item_point}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="center">
                                            <Button
                                                title="Active"
                                                variant={row.gmm_reward_item_active === 'ACTIVE' ? 'contained' : 'outlined'}
                                                color="primary"
                                                disabled={status}
                                                onClick={() => { handleActive(row) }}
                                                className={classes.font_normal}
                                                fullWidth
                                            >
                                                {row.gmm_reward_item_active}
                                            </Button>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="Export to Excel" color='primary' onClick={() => handleExport(row)} disabled={status}>
                                                <GetApp />
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
                        className={classes.font_normal}
                        disabled={status}
                        onClick={handleAdd}
                        startIcon={<Add />}
                        fullWidth
                    >
                        กำหนดของรางวัล
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
                    <Grid item xs={8} />
                </Hidden>

                <Grid item xs={12} sm={4} mb={4}>
                    <TextField
                        margin="dense"
                        variant="outlined"
                        placeholder="ค้นหารางวัล..."
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
                                <Tab className={classes.font_normal} label="สินค้า" {...a11yProps(0)} />
                                <Tab className={classes.font_normal} label="คูปอง" {...a11yProps(1)} />
                                <Tab className={classes.font_eng_normal} label="E-coupon" {...a11yProps(2)} />
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
                    </Box>
                </Grid>
            </Grid>

            {PreviewOpen &&
                <Lightbox
                    mainSrc={selectedImage.path}
                    onCloseRequest={handlePreviewClose}
                    animationDuration={100}
                    imageTitle="Preview"
                    imagePadding={50}
                    reactModalStyle={custom_overlay}
                    enableZoom={true}
                />
            }

        </>
    );
}
