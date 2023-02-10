/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, Card, CardContent, TextField, Typography, Grid, IconButton, TableHead, TableSortLabel, TableFooter, TablePagination, FormLabel, FormControlLabel, FormControl, Radio, RadioGroup,
    Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogTitle, DialogContent, InputAdornment
} from "@material-ui/core";
import { Add, Close, Description, LocalOffer, Save, Subject, KeyboardArrowRight, KeyboardArrowLeft, LastPage, Loop, FirstPage, Search } from "@material-ui/icons";
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
                    <LocalOffer />
                    <Typography className={classes.font_header}>กำหนดโค้ดส่วนลด (coupon)</Typography>
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
                    <Description />
                    <Typography className={classes.font_header}>กำหนดสินค้าที่ร่วมรายการ</Typography>
                </Box>
                <Box>
                    <Button
                        style={{
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
                        เลือกสินค้า
                    </Button>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function CouponCode({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;โค้ดส่วนลด (ทั่วไป)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function Running({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;โค้ดส่วนลด (Running Number)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function Newmember({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;โค้ดส่วนลด (สำหรับสมาชิกใหม่)</Typography>
                </Box>
                <PageLine />
            </Box>

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


const coupon = {
    coupon_id: '',
    coupon_name: '',
    coupon_desc: '',
    coupon_limited: '',
    coupon_code: '',
    coupon_start: null,
    coupon_end: null,
}

const coupon_run = {
    coupon_run_id: '',
    coupon_run_name: '',
    coupon_run_desc: '',
    coupon_run_code: '',
    coupon_run_limited: '',
    coupon_run_start: null,
    coupon_run_end: null,
}

const coupon_nmb = {
    coupon_nmb_id: '',
    coupon_nmb_name: '',
    coupon_nmb_desc: '',
    coupon_nmb_code: '',
    coupon_nmb_limited: '',
    coupon_nmb_start: null,
    coupon_nmb_end: null,
}

export default function Coupon() {

    const url = config.API_URL + "models/Item/Item_coupon.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const classes = useStyles();
    const { vision, id } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [Preview, setPreview] = useState(false);
    const [open, setOpen] = useState(false);
    const [FormCode, setFormCode] = useState(coupon);
    const [FormRUN, setFormRUN] = useState(coupon_run);
    const [FormNMB, setFormNMB] = useState(coupon_nmb);

    const [Type, setType] = useState({ coupon_type: 'CODE' });
    const [upload, setUpload] = useState({
        coupon_file: '',
        coupon_base64: '',
        coupon_preview: '/image/demo_img.jpg',
    })

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [incl, setInclude] = useState([]);
    const [products, setMaster] = useState([]);
    const [datatable, setData] = useState([]);

    const headCells = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'code', label: 'รหัสสินค้า', width: '10%', align: "left" },
        { id: 'product', label: 'ชื่อสินค้า', width: '20%', align: "left" },
        { id: 'price', label: 'ราคา', width: '15%', align: "center" },
        { id: 'discount_price', label: 'ส่วนลด (บาท)', width: '20%', align: "center" },
        { id: 'discount_percent', label: 'ส่วนลด (%)', width: '20%', align: "center" },
        { id: 'delete', label: '', width: '5%', align: "center" },
    ];

    const headProducs = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'code', label: 'รหัสสินค้า', width: '20%', align: "left" },
        { id: 'product', label: 'ชื่อสินค้า', width: '40%', align: "left" },
        { id: 'price', label: 'ราคา', width: '20%', align: "center" },
        { id: 'Add', label: '', width: '10%', align: "center" },
    ];

    useEffect(() => {
        FirstLoad(id);
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

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
                setInclude(res.incl);
                setData(res.datatable)
                setType({ ...Type, coupon_type: res.type })
                setUpload(res.upload)
                //------------------------------------------
                if (res.type === 'CODE') {
                    setFormCode(res.data)
                } else if (res.type === 'RUNNING') {
                    setFormRUN(res.data)
                } else {
                    setFormNMB(res.data)
                }
            }

            setMaster(res.product)
            setBoolean(false);
        }
    }

    async function SaveData(Form, type) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_coupon",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            type: type,
            form: Form,
            datatable: datatable,
            image: upload,
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
                state.push('/Home/ManageCoupon/' + vision);
            })
        } else {
            setBoolean(false);
            Swal.fire({
                title: "แจ้งเตือน",
                text: 'รหัสโค้ดส่วนลด ถูกใช้งานแล้ว',
                icon: "warning",
            })
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleChangeInputCode = (event) => {
        const { target } = event;
        const { name } = target

        if (name === 'coupon_code') {
            let upperCaseText = target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            setFormCode({ ...FormCode, [name]: upperCaseText });
        } else {
            setFormCode({ ...FormCode, [name]: target.value });
        }


    }

    const handleStartDate = (date) => {
        setFormCode({ ...FormCode, coupon_start: date });
    }

    const handleEndtDate = (date) => {
        setFormCode({ ...FormCode, coupon_end: date });
    }

    // Coupon Newmember.

    const handleChangeInputRUN = (event) => {
        const { target } = event;
        const { name } = target

        if (name === 'coupon_run_code') {
            let upperCaseText = target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            setFormRUN({ ...FormRUN, [name]: upperCaseText });
        } else {
            setFormRUN({ ...FormRUN, [name]: target.value });
        }
    }

    const handleRUNStartDate = (date) => {
        setFormRUN({ ...FormRUN, coupon_run_start: date });
    }

    const handleRUNEndtDate = (date) => {
        setFormRUN({ ...FormRUN, coupon_run_end: date });
    }

    // Coupon Newmember.

    const handleChangeInputNmb = (event) => {
        const { target } = event;
        const { name } = target

        if (name === 'coupon_nmb_code') {
            let upperCaseText = target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            setFormNMB({ ...FormNMB, [name]: upperCaseText });
        } else {
            setFormNMB({ ...FormNMB, [name]: target.value });
        }

    }

    const handleNmbStartDate = (date) => {
        setFormNMB({ ...FormNMB, coupon_nmb_start: date });
    }

    const handleNmbEndtDate = (date) => {
        setFormNMB({ ...FormNMB, coupon_nmb_end: date });
    }

    // All func.

    const generate_random = () => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }

        setFormCode({ ...FormCode, coupon_code: result });
    }

    const handleCode = (event) => {
        setType({ ...Type, coupon_type: event.target.value });
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
                            setUpload({ ...upload, coupon_file: file.name, coupon_base64: reader.result, coupon_preview: reader.result });
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

    const handlePreviewOpen = () => {
        (upload.coupon_preview !== "/image/demo_img.jpg") && setPreview(true);
    }

    const handlePreviewClose = () => {
        setPreview(false)
    }

    const Submit = (event) => {
        event.preventDefault();
        let output = 0
        datatable.filter((element, index) => {
            if ((element.discount_price === 0 || element.discount_price === '0')
                && (element.discount_percent === 0 || element.discount_percent === '0')) {
                output--;
            } else {
                output++;
            }
        });

        if (output === datatable.length) {
            if (Type.coupon_type === 'CODE') {
                if (upload.coupon_preview !== '/image/demo_img.jpg') {

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
                            SaveData(FormCode, Type.coupon_type);
                        }
                    });
                } else {
                    alert_upload();
                }
            }

            if (Type.coupon_type === 'RUNNING') {

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
                        SaveData(FormRUN, Type.coupon_type);
                    }
                });
            }

            if (Type.coupon_type === 'NEWMEMBER') {
                if (upload.coupon_preview !== '/image/demo_img.jpg') {
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
                            SaveData(FormNMB, Type.coupon_type);
                        }
                    });
                } else {
                    alert_upload();
                }
            }
        } else {
            Swal.fire({
                // title: "Price",
                text: 'กรุณากรอกราคาส่วนลด',
                icon: "info",
            })
        }
    }

    const alert_upload = () => {
        Swal.fire({
            title: "Upload Image",
            text: "กรุณาอัพโหลดรูปภาพ และลองใหม่อีกครั้ง",
            icon: "warning",
        })
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

    const handleInputDisPrice = (event, index) => {
        if (keyValue(event.target.value)) {
            let newArr = [...datatable];
            newArr[index]['discount_price'] = event.target.value;
            newArr[index]['discount_percent'] = '0';
            setData(newArr);
        }
    }

    const handleInputDisPercent = (event, index) => {
        if (keyValue(event.target.value)) {
            let newArr = [...datatable];
            newArr[index]['discount_percent'] = event.target.value;
            newArr[index]['discount_price'] = '0';
            setData(newArr);
        }
    }

    const handleProduct = () => {
        setOpen(!open)
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
                    let reset_value = [...products]
                    let delete_objs = [...datatable]
                    let delete_incl = [...incl]

                    reset_value.find((list, key) => {
                        if (list.id === delete_incl[index]) {
                            reset_value[key]['discount_price'] = '';
                            reset_value[key]['discount_percent'] = '';
                        }
                    })

                    delete_objs.splice(index, 1);
                    delete_incl.splice(index, 1);
                    setMaster(reset_value);
                    setData(delete_objs);
                    setInclude(delete_incl);
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

    //Table 2 
    const [search, SetSearch] = useState('');
    const [pageProducts, setPageProducts] = useState(0);
    const [rowsPerPageProducts, setRowsPerPageProducts] = useState(5);
    const [orderProducts, setOrderProducts] = useState('asc');
    const [orderByProducts, setOrderByProducts] = useState('');

    const filtered = products.filter((row) => {
        return row.gmm_product_name.toLowerCase().includes(search.toLowerCase())
    })

    const handleRequestSortProducts = (event, property) => {
        const isAsc = orderByProducts === property && orderProducts === 'asc';
        setOrderProducts(isAsc ? 'desc' : 'asc');
        setOrderByProducts(property);
    };

    const handleChangePageProducts = (event, newPage) => {
        setPageProducts(newPage);
    };

    const handleChangeRowsPerPageProducts = (event) => {
        setRowsPerPageProducts(parseInt(event.target.value, 10));
        setPageProducts(0);
    };



    const handleSelect = (row) => {

        if (incl.length !== 0) {
            if (!incl.includes(row.gmm_product_id)) {
                setInclude([...incl, row.gmm_product_id])
                setData([...datatable, row])
                setOpen(!open)
            } else {
                setOpen(!open)

                Swal.fire({
                    title: "สินค้าซ้ำ",
                    text: "เนื่องจากสินค้าถูกเพิ่มไปยังรายการเรียบร้อยแล้ว",
                    icon: "warning",
                })
            }
        } else {
            setInclude([...incl, row.gmm_product_id])
            setData([...datatable, row])
            setOpen(!open)
        }

    }

    function EnhancedTableHeadProducts(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headProducs.map((headCell) => (
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
                                <img src={upload.coupon_preview}
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
                                    textTransFormNMB: 'none',
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
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent style={{ paddingBottom: '16px' }}>
                                    <FormControl>
                                        <FormLabel className={classes.font_normal}  >เลือกประเภทโค้ดส่วนลด</FormLabel>
                                        <RadioGroup row aria-label="position" value={Type.coupon_type} onChange={handleCode} defaultValue="top">
                                            {service.map((type) =>
                                                <FormControlLabel key={type.id} value={type.id}
                                                    classes={{ label: classes.font_normal }}
                                                    control={<Radio color="primary" />}
                                                    label={type.desc}
                                                    disabled={id !== 'create'} >
                                                </FormControlLabel>
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box mt={1} />
                    {Type.coupon_type === 'CODE' &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent style={{ paddingBottom: '16px' }}>
                                            <FormControl>
                                                <FormLabel className={classes.font_normal}><CouponCode classes={classes} /></FormLabel>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            name="coupon_name"
                                                            label="ชื่อโค้ดส่วนลด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormCode.coupon_name}
                                                            onChange={handleChangeInputCode}
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
                                                            name="coupon_desc"
                                                            label="รายละเอียด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormCode.coupon_desc}
                                                            onChange={handleChangeInputCode}
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
                                                            name="coupon_code"
                                                            label="รหัสโค้ดส่วนลด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormCode.coupon_code}
                                                            onChange={handleChangeInputCode}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton title="Random" onClick={generate_random} >
                                                                            <Loop fontSize="small" />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            disabled={id !== 'create'}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6} >
                                                        <TextField
                                                            name="coupon_limited"
                                                            label="จำนวนสิทธิ์"
                                                            type="number"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormCode.coupon_limited}
                                                            onChange={(e) => { (keyValue(e.target.value)) && setFormCode({ ...FormCode, coupon_limited: e.target.value }); }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            inputProps={{
                                                                min: "0"
                                                            }}
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
                                                            label="วันที่เริ่ม"
                                                            placeholder="วัน/เดือน/ปี"
                                                            format="dd/MM/yyyy"
                                                            value={FormCode.coupon_start}
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
                                                            value={FormCode.coupon_end}
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
                                </Grid>
                            </Grid>
                        </>
                    }

                    {Type.coupon_type === 'RUNNING' &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent style={{ paddingBottom: '16px' }}>
                                            <FormControl>
                                                <FormLabel className={classes.font_normal}><Running classes={classes} /></FormLabel>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            name="coupon_run_name"
                                                            label="ชื่อโค้ดส่วนลด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormRUN.coupon_run_name}
                                                            onChange={handleChangeInputRUN}
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
                                                            name="coupon_run_desc"
                                                            label="รายละเอียด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormRUN.coupon_run_desc}
                                                            onChange={handleChangeInputRUN}
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
                                                            name="coupon_run_code"
                                                            label="รหัสโค้ดส่วนลด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormRUN.coupon_run_code}
                                                            onChange={handleChangeInputRUN}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            disabled={id !== 'create'}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6}>
                                                        <TextField

                                                            name="coupon_run_limited"
                                                            label="จำนวนโค้ด"
                                                            type="number"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormRUN.coupon_run_limited}
                                                            onChange={(e) => { (keyValue(e.target.value)) && setFormRUN({ ...FormRUN, coupon_run_limited: e.target.value }); }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            inputProps={{
                                                                min: "0"
                                                            }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            disabled={id !== 'create'}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6}>
                                                        <KeyboardDatePicker
                                                            label="วันที่เริ่ม"
                                                            placeholder="วัน/เดือน/ปี"
                                                            format="dd/MM/yyyy"
                                                            value={FormRUN.coupon_run_start}
                                                            onChange={handleRUNStartDate}
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
                                                            value={FormRUN.coupon_run_end}
                                                            onChange={handleRUNEndtDate}
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
                                </Grid>
                            </Grid>
                        </>
                    }

                    {Type.coupon_type === 'NEWMEMBER' &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent style={{ paddingBottom: '16px' }}>
                                            <FormControl>
                                                <FormLabel className={classes.font_normal}><Newmember classes={classes} /></FormLabel>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            name="coupon_nmb_name"
                                                            label="ชื่อโค้ดส่วนลด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormNMB.coupon_nmb_name}
                                                            onChange={handleChangeInputNmb}
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
                                                            name="coupon_nmb_desc"
                                                            label="รายละเอียด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormNMB.coupon_nmb_desc}
                                                            onChange={handleChangeInputNmb}
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
                                                            name="coupon_nmb_code"
                                                            label="รหัสโค้ดส่วนลด"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormNMB.coupon_nmb_code}
                                                            onChange={handleChangeInputNmb}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            disabled={id !== 'create'}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6}>
                                                        <TextField
                                                            name="coupon_nmb_limited"
                                                            label="จำนวนสิทธิ์"
                                                            type="number"
                                                            margin="dense"
                                                            variant="outlined"
                                                            value={FormNMB.coupon_nmb_limited}
                                                            onChange={(e) => { (keyValue(e.target.value)) && setFormNMB({ ...FormNMB, coupon_nmb_limited: e.target.value }); }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            inputProps={{
                                                                min: "0"
                                                            }}
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
                                                            label="วันที่เริ่ม"
                                                            placeholder="วัน/เดือน/ปี"
                                                            format="dd/MM/yyyy"
                                                            value={FormNMB.coupon_nmb_start}
                                                            onChange={handleNmbStartDate}
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
                                                            value={FormNMB.coupon_nmb_end}
                                                            onChange={handleNmbEndtDate}
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
                                </Grid>
                            </Grid>
                        </>
                    }

                    <Box mt={2} />
                    <TopicII classes={classes} handleProduct={handleProduct} status={promise} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                                            ? stableSort(datatable, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : stableSort(datatable, getComparator(order, orderBy))).map((row, index) => (
                                                <StyledTableRow hover key={index}>
                                                    <StyledTableCell width='10%' align="center">
                                                        {index + 1}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='10%' align="left">
                                                        {row.gmm_product_id}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='20%' align="left">
                                                        {row.gmm_product_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='15%' align="center">
                                                        {row.gmm_product_price.toLocaleString("en-US")}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='20%' align="center">
                                                        <TextField
                                                            margin="dense"
                                                            variant="outlined"
                                                            type="number"
                                                            value={row.discount_price}
                                                            onChange={(e) => { handleInputDisPrice(e, index) }}
                                                            onKeyDown={(e) => { formatInput(e, index) }}
                                                            inputProps={{
                                                                min: "0",
                                                            }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            fullWidth
                                                            required
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell width='20%' align="center">
                                                        <TextField
                                                            margin="dense"
                                                            variant="outlined"
                                                            type="number"
                                                            value={row.discount_percent}
                                                            onChange={(e) => { handleInputDisPercent(e, index) }}
                                                            onKeyDown={(e) => { formatInput(e, index) }}
                                                            inputProps={{
                                                                min: "0",
                                                                maxLength: 30,
                                                            }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            fullWidth
                                                            required
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                                        <IconButton title="ลบข้อมูล" color='secondary' onClick={() => handleDelete(row, index)} >
                                                            <Close fontSize="small" />
                                                        </IconButton>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}

                                        {datatable.length === 0 && (
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
                                                count={datatable.length}
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
                        </Grid>
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
                    เลือกสินค้าที่เข้าร่วมรายการ
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                variant="outlined"
                                placeholder="ค้นหาสินค้า..."
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
                            <TableContainer component={Paper}>
                                <Table aria-label="custom pagination table">
                                    <EnhancedTableHeadProducts
                                        classes={classes}
                                        order={orderProducts}
                                        orderBy={orderByProducts}
                                        onRequestSort={handleRequestSortProducts}
                                    />
                                    <TableBody>
                                        {(rowsPerPageProducts > 0
                                            ? stableSort(filtered, getComparator(orderProducts, orderByProducts)).slice(pageProducts * rowsPerPageProducts, pageProducts * rowsPerPageProducts + rowsPerPageProducts)
                                            : stableSort(filtered, getComparator(orderProducts, orderByProducts))).map((row, index) => (
                                                <StyledTableRow hover key={index}>
                                                    <StyledTableCell width='10%' align="center">
                                                        {index + 1}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='20%' align="left">
                                                        {row.gmm_product_id}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='40%' align="left">
                                                        {row.gmm_product_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='20%' align="center">
                                                        {row.gmm_product_price.toLocaleString("en-US")}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='10%' align="center">
                                                        <Button
                                                            className={classes.font_normal}
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => { handleSelect(row) }}
                                                            fullWidth
                                                        >
                                                            <Add />
                                                        </Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}

                                        {filtered.length === 0 && (
                                            <StyledTableRow style={{ height: 25 }}>
                                                <StyledTableCell colSpan={5} align="center">
                                                    ไม่พบข้อมูล
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                colSpan={5}
                                                count={filtered.length}
                                                rowsPerPage={rowsPerPageProducts}
                                                page={pageProducts}
                                                SelectProps={{
                                                    inputProps: { 'aria-label': 'rows per page' },
                                                    native: true,
                                                }}
                                                onChangePage={handleChangePageProducts}
                                                onChangeRowsPerPage={handleChangeRowsPerPageProducts}
                                                ActionsComponent={TablePaginationActions}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </MuiDialogContent>
            </Dialog>

            {Preview &&
                <Lightbox
                    mainSrc={upload.coupon_preview}
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

const service = [{ id: 'CODE', desc: 'กำหนดโค้ดส่วนลด (ทั่วไป)' }, { id: 'RUNNING', desc: 'กำหนดโค้ดส่วนลด (Running Number)' }, { id: 'NEWMEMBER', desc: 'กำหนดโค้ดส่วนลด (สมาชิกใหม่)' }];

