/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, Chip, Card, CardContent, TextField, Typography, Grid, IconButton, TableHead, TableSortLabel, TableFooter, TablePagination, FormLabel, FormControlLabel, FormControl, Radio, RadioGroup,
    Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Hidden
} from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { Add, AlarmOn, Close, Room, CheckCircle, Description, Edit, Save, Subject, LocalTaxi, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, TextFormat, LocationOn, Refresh } from "@material-ui/icons";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import config from '../../config';

const custom_overlay = {
    overlay: {
        zIndex: 9999,
    },
}

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
    imageStyle: {
        textAlign: "center",
        width: '186px',
        height: '146px'
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
    textField: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    responsive_box: {
        position: 'relative',
        maxWidth: '100%',
        marginBottom: '6px'
    },
    responsive_image: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'zoom-in'
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
    font_chip: {
        fontFamily: 'Regular',
        fontSize: '12px'
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

function Topic({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Description />
                    <Typography className={classes.font_header}>กำหนดสินค้า</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function TopicII({ classes, handleProduct, status }) {
    return (
        <>
            <Box pt={0} pb={0} className={classes.displayflexHead}>
                <Box className={classes.displayflexHead}>
                    <LocationOn />
                    <Typography className={classes.font_header}>กำหนดจุดเดินทาง</Typography>
                </Box>
                <Box>
                    <Button
                        style={{
                            textTransform: 'none',
                            whiteSpace: 'pre'
                        }}
                        disabled={status}
                        className={classes.font_normal}
                        variant="contained"
                        color="primary"
                        onClick={handleProduct}
                        startIcon={<Add />}
                        fullWidth
                    >
                        เพิ่มจุดเดินทาง
                    </Button>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function HeadersI({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;สินค้า</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <TextFormat fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;กำหนดข้อความ</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersIII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <AlarmOn fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;Special Point</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function HeadersVI({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Add fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;เพิ่ม Care Giver</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function HeadersVII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <LocalTaxi fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;Taxi</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
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

const product = {
    product_id: '',
    product_name: '',
    product_desc: '',
    product_price: '',
    product_point: '',
    product_start: null,
    product_end: '01/01/2100',
    product_drop: null,
    //------------------------
    product_special_status: 'OFF',
    product_special_point: '',
    product_special_start: null,
    product_special_end: null,
    //------------------------
    product_message1: '',
    product_message2: '',
    //------------------------
    product_tx_hour: null,
    product_tx_hour_add: null,
    product_tx_hour_price: '',
    //------------------------
    product_cg_hour: null,
    product_cg_hour_add: null,
    product_cg_hour_price: '',
    product_cg_message1: '',
    product_cg_message2: '',
    //------------------------
    product_cg_status: 'OFF',
    product_file: '',
    product_base64: '',
    product_preview: '/image/demo_img.jpg',
    //------------------------
    pattern_action: null,
    pattern_button: '',
    pattern_status: '',
    pattern_notification: '',
    pattern_camera: null,
    pattern_mapping: null,
}

export default function Product() {

    const url = config.API_URL + "models/Item/Item_product.php";
    const classes = useStyles();
    const { vision, id } = useParams();
    const state = useHistory();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [Preview, setPreview] = useState(false);
    const [Hidd, setHidd] = useState(false);
    const [open, setOpen] = useState(false);
    const [Form, setForm] = useState(product);
    const [page, setPage] = useState(0);
    const [indexID, setID] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');

    //Master
    const [action, setAction] = useState([]);
    const [camera, setCamera] = useState([]);
    const [nmMstr, setNumber] = useState([]);
    const [nmDrop, setDrop] = useState([]);
    const [switchs, setSwitchs] = useState([]);
    const [datatable, setData] = useState([]);
    const [MapLocal, setMapLocation] = useState([]);

    const headCells = [
        { id: 'id', label: '#', width: '5%', align: "center" },
        { id: 'action', label: 'Action', width: '10%', align: "left" },
        { id: 'button', label: 'ปุ่มสถานะ', width: '20%', align: "left" },
        { id: 'status', label: 'ข้อความสถานะ', width: '25%', align: "left" },
        { id: 'notification', label: 'ข้อความแจ้งเตือน', width: '20%', align: "left" },
        { id: 'camera', label: 'รูปภาพ', width: '5%', align: "center" },
        { id: 'mapp', label: '', width: '5%', align: "center" },
        { id: 'Edit', label: '', width: '5%', align: "center" },
        { id: 'Delete', label: '', width: '5%', align: "center" },
    ];




    useEffect(() => {
        FirstLoad(id);
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, []);

    async function FirstLoad(id) {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_master",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (res.data.length !== 0) {
                setMapLocation(res.mapp)
                setForm(res.data)
                setData(res.datatable);
            }

            setAction(res.action)
            setCamera(res.camera)
            setNumber(res.number)
            setDrop(res.drop)
            setSwitchs(res.switch)
            setBoolean(false);
        }
    }

    async function SaveData() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_product",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: Form,
            action: datatable,
            id: id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);

            Swal.fire({
                title: "เรียบร้อย",
                text: res.message,
                icon: "success",
            }).then(() => {
                state.push('/Home/ManageProduct/' + vision);
            })
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleChangeInput = (event) => {
        const { target } = event;
        const { name } = target

        setForm({ ...Form, [name]: target.value });
    }

    const handleSpecialPoint = (event) => {
        if (event.target.value === 'OFF') {
            setForm({
                ...Form,
                product_special_status: event.target.value,
                product_special_point: '',
                product_special_start: null,
                product_special_end: null,
            });
        } else {
            setForm({ ...Form, product_special_status: event.target.value });
        }
    }

    const handleAddProduct = (event) => {

        if (event.target.value === 'OFF') {
            setForm({
                ...Form,
                product_cg_status: event.target.value,
                product_cg_hour: null,
                product_cg_hour_add: null,
                product_cg_hour_price: '',
                product_cg_message1: '',
                product_cg_message2: '',
            });
        } else {
            setForm({ ...Form, product_cg_status: event.target.value });
        }


    }

    const handleTXHour = (event, item) => {
        setForm({ ...Form, product_tx_hour: item });
    }

    const handleTXAddHour = (event, item) => {
        setForm({ ...Form, product_tx_hour_add: item });
    }

    const handleHour = (event, item) => {
        setForm({ ...Form, product_cg_hour: item });
    }

    const handleAddHour = (event, item) => {
        setForm({ ...Form, product_cg_hour_add: item });
    }

    const handleDrop = (event, item) => {

        setForm({ ...Form, product_drop: item });
        //---------------------------------------
        let array = [];
        for (let i = 0; i < item.gmm_num_id; i++) {
            array[i] = { id: (i + 1), desc: 'สำหรับจุดเดินทาง ' + (i + 1) };
        }

        setMapLocation(array);
    }

    const handleStartDate = (date) => {
        setForm({ ...Form, product_start: date });
    }

    const handleEndtDate = (date) => {
        setForm({ ...Form, product_end: date });
    }

    //----------------------------------------

    const handlePatternAction = (event, item) => {
        setForm({ ...Form, pattern_action: item });
    }

    const handlePatternPicture = (event, item) => {
        setForm({ ...Form, pattern_camera: item });
    }

    const handlePatternMapping = (event, item) => {
        setForm({ ...Form, pattern_mapping: item });
    }

    const handleRefresh = () => {
        setForm({ ...Form, pattern_action: null, pattern_camera: null, pattern_status: '', pattern_button: '', pattern_notification: '', pattern_mapping: null });
    }

    const handleCreate = (event) => {
        event.preventDefault();

        let array = {
            action: Form.pattern_action,
            button: Form.pattern_button,
            camera: Form.pattern_camera,
            notification: Form.pattern_notification,
            status: Form.pattern_status,
            mapping: Form.pattern_mapping
        }

        if (Hidd) {
            let newArr = [...datatable];
            newArr[indexID] = array

            setData(newArr)
            setOpen(!open)
            setHidd(false)
            handleRefresh();
        } else {

            setData([...datatable, array])
            setOpen(!open)
            setHidd(false)
            handleRefresh();
        }
    }

    const handleSpecial_StartDate = (date) => {
        setForm({ ...Form, product_special_start: date });
    }

    const handleSpecial_EndtDate = (date) => {
        setForm({ ...Form, product_special_end: date });
    }

    const handleuploadFile = (event, index) => {
        let file = event.target.files[0];
        if (file) {
            let size = file.size / 1024
            if (size <= 1024) {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.readyState === 2) {
                            setForm({ ...Form, product_file: file.name, product_preview: reader.result, product_base64: reader.result });
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: 'ไม่สามารถอัพโหลด เนื่องจากขนาดรูปภาพเกิน 1 MB',
                    icon: "warning",
                })
            }
        } else {
            document.getElementById("InputFile").value = "";
        }
    }

    const handleProduct = () => {
        setOpen(!open)
        handleRefresh();
    }

    const handlePreviewOpen = () => {
        (Form.product_preview !== "/image/demo_img.jpg") && setPreview(true);
    }

    const handlePreviewClose = () => {
        setPreview(false)
    }

    const Submit = (event) => {
        event.preventDefault();
        if (Form.product_preview !== "/image/demo_img.jpg") {
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
            Swal.fire({
                title: "แจ้งเตือน",
                text: 'กรุณาอัพโหลดรูปภาพ',
                icon: "warning",
            })
        }
    }

    // Table
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (row, index) => {
        setOpen(!open)
        setForm({
            ...Form, pattern_action: row.action,
            pattern_camera: row.camera,
            pattern_status: row.status,
            pattern_button: row.button,
            pattern_notification: row.notification,
            pattern_mapping: row.mapping,
        });
        setHidd(true)
        setID(index)
    }

    const handleDelete = (row, index) => {
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
                Swal.fire({
                    title: "เรียบร้อย",
                    text: "ลบข้อมูลสำเร็จ",
                    icon: "success",
                }).then((output) => {
                    let delete_objs = [...datatable]
                    delete_objs.splice(index, 1);
                    setData(delete_objs);
                    setHidd(false)
                    setID(0)
                });
            }
        });
    }

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
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='10%' align="left">
                                            {(row.action.gmm_action_id === 'START' || row.action.gmm_action_id === 'END') && <Chip key={index}
                                                classes={{ label: classes.font_chip }}
                                                label={row.action.gmm_action_id}
                                                color="primary"
                                                size="small"
                                            />}

                                            {(row.action.gmm_action_id === 'ACTION') && <Chip key={index}
                                                classes={{ label: classes.font_chip }}
                                                label={row.action.gmm_action_id}
                                                size="small"
                                            />}

                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.button}
                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="left">
                                            {row.status}
                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="left">
                                            {row.notification}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" style={{ paddingTop: '20px' }}>
                                            {row.camera.gmm_question_id === '1' ? <CheckCircle color="primary" /> : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            {row.mapping !== null ? <Room color="primary" /> : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => handleEdit(row, index)} disabled={status}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            <IconButton title="ลบข้อมูล" color='secondary' onClick={() => handleDelete(row, index)} disabled={status}>
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

    const keyValue = (value) => {
        if (value !== '00' && value !== '01' && value !== '02' && value !== '03' && value !== '04' && value !== '05' &&
            value !== '06' && value !== '07' && value !== '08' && value !== '09') {
            return true
        } else {
            return false
        }
    }

    const formatInput = (e) => {
        // Prevent characters that are not numbers ("e", ".", "+" & "-") ✨
        let checkIfNum;
        if (e.key !== undefined) {
            // Check if it's a "e", ".", "+" or "-"
            checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
        }
        else if (e.keyCode !== undefined) {
            // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
            checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
        }
        return checkIfNum && e.preventDefault();
    }
    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Topic classes={classes} />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
                <form onSubmit={Submit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8} md={8} />
                        <Grid item xs={12} sm={4} md={4} >
                            <Box className={classes.responsive_box}>
                                <img src={Form.product_preview}
                                    alt="Gomamma"
                                    onClick={handlePreviewOpen}
                                    className={classes.responsive_image}></img>
                            </Box>
                            <Button
                                component="label"
                                variant="contained"
                                color="primary"
                                disabled={promise}
                                className={classes.font_normal}
                                style={{
                                    textTransform: 'none',
                                }}
                                fullWidth
                                required
                            >
                                Upload Image
                                <input
                                    id="InputFile"
                                    onChange={(e) => { handleuploadFile(e) }}
                                    type="file"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    hidden
                                />
                            </Button>
                        </Grid>
                    </Grid>
                    <Box mt={4} />
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>
                            <FormControl>
                                <FormLabel className={classes.font_normal}><HeadersI classes={classes} /></FormLabel>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="product_name"
                                            label="ชื่อสินค้า"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.product_name}
                                            onChange={handleChangeInput}
                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
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
                                            name="product_desc"
                                            label="รายละเอียด"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.product_desc}
                                            onChange={handleChangeInput}
                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
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
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            name="product_price"
                                            label="ราคา"
                                            type="number"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.product_price}
                                            onChange={(e) => { (keyValue(e.target.value)) && setForm({ ...Form, product_price: e.target.value }); }}
                                            onKeyDown={(e) => { formatInput(e) }}
                                            inputProps={{ min: "0", className: classes.font_normal, }}
                                            InputProps={{
                                                className: classes.font_normal,
                                            }}
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                            className="noscroll"
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3} md={3}>
                                        <TextField
                                            name="product_point"
                                            label="คะแนน"
                                            type="number"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.product_point}
                                            onChange={(e) => { (keyValue(e.target.value)) && setForm({ ...Form, product_point: e.target.value }); }}
                                            onKeyDown={(e) => { formatInput(e) }}
                                            inputProps={{ min: "0", className: classes.font_normal, }}
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
                                    <Grid item xs={6} sm={3} md={3}>
                                        <Autocomplete
                                            classes={{
                                                input: classes.font_normal,
                                                option: classes.font_normal,
                                            }}
                                            options={nmDrop}
                                            getOptionLabel={(value) => value.gmm_num_id}
                                            getOptionSelected={(option, value) =>
                                                option.gmm_num_id === value.gmm_num_id
                                            }
                                            value={Form.product_drop}
                                            onChange={handleDrop}
                                            disabled={datatable.length !== 0}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="จุดเดินทาง"
                                                    margin="dense"
                                                    variant="outlined"
                                                    InputLabelProps={{ className: classes.font_normal }}
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <KeyboardDatePicker
                                            label="วันที่เริ่ม"
                                            placeholder="วัน/เดือน/ปี"
                                            format="dd/MM/yyyy"
                                            value={Form.product_start}
                                            onChange={handleStartDate}
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
                                    <Grid item xs={12} sm={6} md={6}>
                                        <KeyboardDatePicker
                                            label="วันที่สิ้นสุด"
                                            placeholder="วัน/เดือน/ปี"
                                            format="dd/MM/yyyy"
                                            value={Form.product_end}
                                            onChange={handleEndtDate}
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
                                        />
                                    </Grid>

                                </Grid>
                            </FormControl>
                        </CardContent>
                    </Card>
                    <Box mt={2} />
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>
                            <FormControl>
                                <FormLabel className={classes.font_normal}><HeadersII classes={classes} /></FormLabel>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box mt={1} />
                                        <Alert severity="info"><Typography className={classes.font_normal}>
                                            กำหนดข้อความสำหรับแสดงรายละเอียดสินค้า และบริการให้ลูกค้าได้รับทราบ (Mobile Application)</Typography> </Alert>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="product_message1"
                                            label="ข้อความ 1"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.product_message1}
                                            onChange={handleChangeInput}
                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
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
                                            name="product_message2"
                                            label="ข้อความ 2"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.product_message2}
                                            onChange={handleChangeInput}
                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
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
                                        <Card variant="outlined">
                                            <CardContent style={{ paddingBottom: '16px' }}>
                                                <FormLabel className={classes.font_normal}>ตัวอย่าง :</FormLabel>
                                                <Typography className={classes.font_normal}>{Form.product_message1} {Form.product_message2}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </CardContent>
                    </Card>
                    <Box mt={2} />
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>
                            <FormControl>
                                <FormLabel className={classes.font_normal}><HeadersVII classes={classes} /></FormLabel>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Autocomplete
                                            classes={{
                                                input: classes.font_normal,
                                                option: classes.font_normal,
                                            }}
                                            options={nmMstr}
                                            getOptionLabel={(value) => value.gmm_num_id}
                                            getOptionSelected={(option, value) =>
                                                option.gmm_num_id === value.gmm_num_id
                                            }
                                            value={Form.product_tx_hour}
                                            onChange={handleTXHour}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="จำนวนชั่วโมง (ค่าเริ่มต้น)"
                                                    margin="dense"
                                                    variant="outlined"
                                                    InputLabelProps={{ className: classes.font_normal }}
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Hidden only={['xs']}>
                                        <Grid item xs={12} sm={6} md={6} />
                                    </Hidden>
                                    <Grid item xs={12} sm={6} md={6} >
                                        <Autocomplete
                                            classes={{
                                                input: classes.font_normal,
                                                option: classes.font_normal,
                                            }}
                                            options={nmMstr}
                                            getOptionLabel={(value) => value.gmm_num_id}
                                            getOptionSelected={(option, value) =>
                                                option.gmm_num_id === value.gmm_num_id
                                            }
                                            value={Form.product_tx_hour_add}
                                            onChange={handleTXAddHour}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="จำนวนชั่วโมงรอเพิ่ม (สูงสุด)"
                                                    margin="dense"
                                                    variant="outlined"
                                                    InputLabelProps={{ className: classes.font_normal }}
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} >
                                        <TextField
                                            name="product_tx_hour_price"
                                            label="ราคา / ชั่วโมง"
                                            margin="dense"
                                            variant="outlined"
                                            type="number"
                                            value={Form.product_tx_hour_price}
                                            onChange={(e) => { (keyValue(e.target.value)) && setForm({ ...Form, product_tx_hour_price: e.target.value }); }}
                                            onKeyDown={(e) => { formatInput(e) }}
                                            inputProps={{ min: "0", className: classes.font_normal, }}
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
                                </Grid>
                            </FormControl>
                        </CardContent>
                    </Card>
                    <Box mt={2} />
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>
                            <FormControl>
                                <FormLabel className={classes.font_normal}><HeadersVI classes={classes} /></FormLabel>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <RadioGroup row aria-label="position" value={Form.product_cg_status} onChange={handleAddProduct} defaultValue="top">
                                            {switchs.map((status) =>
                                                <FormControlLabel key={status.gmm_switch_id} value={status.gmm_switch_id}
                                                    classes={{ label: classes.font_normal }}
                                                    control={<Radio color="primary" />}
                                                    label={status.gmm_switch_name} >
                                                </FormControlLabel>
                                            )}

                                        </RadioGroup>
                                    </Grid>
                                    {Form.product_cg_status === 'ON' &&
                                        <>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Autocomplete
                                                    classes={{
                                                        input: classes.font_normal,
                                                        option: classes.font_normal,
                                                    }}
                                                    options={nmMstr}
                                                    getOptionLabel={(value) => value.gmm_num_id}
                                                    getOptionSelected={(option, value) =>
                                                        option.gmm_num_id === value.gmm_num_id
                                                    }
                                                    value={Form.product_cg_hour}
                                                    onChange={handleHour}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="จำนวนชั่วโมง (ค่าเริ่มต้น)"
                                                            margin="dense"
                                                            variant="outlined"
                                                            InputLabelProps={{ className: classes.font_normal }}
                                                            required
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Hidden only={['xs']}>
                                                <Grid item xs={12} sm={6} md={6} />
                                            </Hidden>
                                            <Grid item xs={12} sm={6} md={6} >
                                                <Autocomplete
                                                    classes={{
                                                        input: classes.font_normal,
                                                        option: classes.font_normal,
                                                    }}
                                                    options={nmMstr}
                                                    getOptionLabel={(value) => value.gmm_num_id}
                                                    getOptionSelected={(option, value) =>
                                                        option.gmm_num_id === value.gmm_num_id
                                                    }
                                                    value={Form.product_cg_hour_add}
                                                    onChange={handleAddHour}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="จำนวนชั่วโมงรอเพิ่ม (สูงสุด)"
                                                            margin="dense"
                                                            variant="outlined"
                                                            InputLabelProps={{ className: classes.font_normal }}
                                                            required
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} >
                                                <TextField
                                                    name="product_cg_hour_price"
                                                    label="ราคา / ชั่วโมง"
                                                    margin="dense"
                                                    variant="outlined"
                                                    type="number"
                                                    value={Form.product_cg_hour_price}
                                                    onChange={(e) => { (keyValue(e.target.value)) && setForm({ ...Form, product_cg_hour_price: e.target.value }); }}
                                                    onKeyDown={(e) => { formatInput(e) }}
                                                    inputProps={{ min: "0", className: classes.font_normal, }}
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
                                            <Grid item xs={12} >
                                                <TextField
                                                    name="product_cg_message1"
                                                    label="ข้อความ 1"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={Form.product_cg_message1}
                                                    onChange={handleChangeInput}
                                                    inputProps={{ maxLength: 256, className: classes.font_normal, }}
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
                                            <Grid item xs={12} >
                                                <TextField
                                                    name="product_cg_message2"
                                                    label="ข้อความ 2"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={Form.product_cg_message2}
                                                    onChange={handleChangeInput}
                                                    inputProps={{ maxLength: 256, className: classes.font_normal, }}
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
                                                <Card variant="outlined">
                                                    <CardContent style={{ paddingBottom: '16px' }}>
                                                        <FormLabel className={classes.font_normal}>ตัวอย่าง :</FormLabel>
                                                        <Typography className={classes.font_normal}>{Form.product_cg_message1} {Form.product_cg_message2} </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </>
                                    }

                                </Grid>
                            </FormControl>
                        </CardContent>
                    </Card>
                    <Box mt={2} />
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>
                            <FormControl>
                                <FormLabel className={classes.font_normal}><HeadersIII classes={classes} /></FormLabel>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <RadioGroup row aria-label="position" value={Form.product_special_status} onChange={handleSpecialPoint} defaultValue="top">
                                            {switchs.map((status) =>
                                                <FormControlLabel key={status.gmm_switch_id} value={status.gmm_switch_id}
                                                    classes={{ label: classes.font_normal }}
                                                    control={<Radio color="primary" />}
                                                    label={status.gmm_switch_name} >
                                                </FormControlLabel>
                                            )}
                                        </RadioGroup>
                                    </Grid>
                                    {Form.product_special_status === 'ON' &&
                                        <>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="product_special_point"
                                                    label="คะแนน"
                                                    type="number"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={Form.product_special_point}
                                                    onChange={(e) => { (keyValue(e.target.value)) && setForm({ ...Form, product_special_point: e.target.value }); }}
                                                    onKeyDown={(e) => { formatInput(e) }}
                                                    inputProps={{ min: "0", className: classes.font_normal, }}
                                                    InputProps={{
                                                        className: classes.font_normal,
                                                    }}
                                                    InputLabelProps={{
                                                        className: classes.font_normal,
                                                    }}
                                                    required
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <KeyboardDatePicker
                                                    label="วันที่เริ่ม"
                                                    placeholder="วัน/เดือน/ปี"
                                                    format="dd/MM/yyyy"
                                                    value={Form.product_special_start}
                                                    onChange={handleSpecial_StartDate}
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
                                            <Grid item xs={12} sm={6} md={6}>
                                                <KeyboardDatePicker
                                                    label="วันที่สิ้นสุด"
                                                    placeholder="วัน/เดือน/ปี"
                                                    format="dd/MM/yyyy"
                                                    value={Form.product_special_end}
                                                    onChange={handleSpecial_EndtDate}
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
                                        </>
                                    }
                                </Grid>
                            </FormControl>
                        </CardContent>
                    </Card>
                    <Box mt={2} />
                    <TopicII classes={classes} handleProduct={handleProduct} status={promise} />
                    <Grid item xs={12} >
                        <ViewTable filtered={datatable} status={promise} />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <ButtonSubmit classes={classes} status={promise} />
                        </Grid>
                    </Grid>
                </form>
            </MuiPickersUtilsProvider>

            <Dialog
                onClose={handleProduct}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="customized-dialog-title"
                open={open}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleProduct}>
                    Action
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <form id="hook" onSubmit={handleCreate}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} >
                                <Autocomplete
                                    classes={{
                                        input: classes.font_normal,
                                        option: classes.font_normal,
                                    }}
                                    options={action}
                                    getOptionLabel={(value) => value.gmm_action_name}
                                    getOptionSelected={(option, value) =>
                                        option.gmm_action_id === value.gmm_action_id
                                    }
                                    value={Form.pattern_action}
                                    onChange={handlePatternAction}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Action"
                                            margin="dense"
                                            variant="outlined"
                                            InputLabelProps={{ className: classes.font_normal }}
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
                                <TextField
                                    name="pattern_button"
                                    label="ปุ่มสถานะ"
                                    margin="dense"
                                    variant="outlined"
                                    value={Form.pattern_button}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 256, className: classes.font_normal, }}
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
                            <Grid item xs={12} sm={6} md={6} >
                                <TextField
                                    name="pattern_status"
                                    label="ข้อความสถานะ"
                                    margin="dense"
                                    variant="outlined"
                                    value={Form.pattern_status}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 256, className: classes.font_normal, }}
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
                            <Grid item xs={12} sm={6} md={6} >
                                <TextField
                                    name="pattern_notification"
                                    label="ข้อความแจ้งเตือน"
                                    margin="dense"
                                    variant="outlined"
                                    value={Form.pattern_notification}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 256, className: classes.font_normal, }}
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
                            <Grid item xs={12} sm={6} md={6} >
                                <Autocomplete
                                    classes={{
                                        input: classes.font_normal,
                                        option: classes.font_normal,
                                    }}
                                    options={camera}
                                    getOptionLabel={(value) => value.gmm_question_name}
                                    getOptionSelected={(option, value) =>
                                        option.gmm_question_id === value.gmm_question_id
                                    }
                                    value={Form.pattern_camera}
                                    onChange={handlePatternPicture}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="รูปภาพ"
                                            margin="dense"
                                            variant="outlined"
                                            InputLabelProps={{ className: classes.font_normal }}
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
                                <Autocomplete
                                    classes={{
                                        input: classes.font_normal,
                                        option: classes.font_normal,
                                    }}
                                    options={MapLocal}
                                    getOptionLabel={(value) => value.desc}
                                    getOptionSelected={(option, value) =>
                                        option.id === value.id
                                    }
                                    disabled={(Form.pattern_action) ? Form.pattern_action.gmm_action_name === "START" ? true : false : false}
                                    value={Form.pattern_mapping}
                                    onChange={handlePatternMapping}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Mapping"
                                            margin="dense"
                                            variant="outlined"
                                            InputLabelProps={{ className: classes.font_normal }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </MuiDialogContent>
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
                        ตกลง
                    </Button>

                </MuiDialogActions>
            </Dialog>


            {
                Preview &&
                <Lightbox
                    mainSrc={Form.product_preview}
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
