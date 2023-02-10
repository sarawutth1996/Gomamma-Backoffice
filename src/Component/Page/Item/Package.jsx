/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, Card, CardContent, TextField, Typography, Grid, IconButton, TableHead, TableSortLabel, TableFooter, TablePagination, FormLabel, FormControlLabel, FormControl, Radio, RadioGroup,
    Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogTitle, DialogContent, InputAdornment
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Add, Alarm, AlarmOn, Close, Description, Save, Subject, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Search, NavigateNext, NavigateBefore } from "@material-ui/icons";
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
                    <Description />
                    <Typography className={classes.font_header}>กำหนดคูปอง</Typography>
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
                        className={classes.font_normal}
                        disabled={status}
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

function HeadersI({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;คูปอง</Typography>
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
                    <AlarmOn fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;Special Point</Typography>
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
                    <Alarm fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;วันหมดอายุ</Typography>
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

const Packages = {
    Package_id: '',
    Package_name: '',
    Package_desc: '',
    Package_price: '',
    Package_point: '',
    Package_start: null,
    Package_end: null,
    //------------------------
    Package_special_status: 'OFF',
    Package_special_point: '',
    Package_special_start: null,
    Package_special_end: null,
    //------------------------
    Package_exp_status: '',
    Package_exp_date: null,
    Package_exp_days: null,
}

export default function Package() {

    const url = config.API_URL + "models/Item/Item_package.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const classes = useStyles();
    const { vision, id } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [Preview, setPreview] = useState(false);
    const [open, setOpen] = useState(false);
    const [Form, setForm] = useState(Packages);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [nmMstr, setNumber] = useState([]);
    const [incl, setInclude] = useState([]);
    const [products, setMaster] = useState([]);
    const [datatable, setData] = useState([]);
    const [switchs, setSwitchs] = useState([]);

    const headCells = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_product_id', label: 'รหัสสินค้า', width: '15%', align: "left" },
        { id: 'gmm_product_name', label: 'ชื่อสินค้า', width: '20%', align: "left" },
        { id: 'gmm_product_price', label: 'ราคา', width: '15%', align: "center" },
        { id: 'total', label: 'จำนวน', width: '20%', align: "center" },
        { id: 'gmm_product_price_diff', label: 'ส่วนลดต่อคูปอง', width: '20%', align: "center" },
        { id: 'delete', label: '', width: '5%', align: "center" },
    ];

    const headProducs = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_product_id', label: 'รหัสสินค้า', width: '20%', align: "left" },
        { id: 'gmm_product_name', label: 'ชื่อสินค้า', width: '40%', align: "left" },
        { id: 'gmm_product_price', label: 'ราคา', width: '20%', align: "center" },
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
                setForm(res.data)
                setData(res.datatable)
                setInclude(res.incl)
                setImages(res.upload);
            }

            setSelectedCount(res.count);
            setSwitchs(res.switch)
            setNumber(res.number)
            setMaster(res.product)
            setBoolean(false);
        }
    }

    async function SaveData() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_package",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            id: id,
            item: Form,
            product: datatable,
            image: images
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
                state.push('/Home/ManagePackage/' + vision);
            })
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleSpecialPoint = (event) => {
        if (event.target.value === 'OFF') {
            setForm({
                ...Form,
                Package_special_status: event.target.value,
                Package_special_point: '',
                Package_special_start: null,
                Package_special_end: null,
            });
        } else {
            setForm({ ...Form, Package_special_status: event.target.value });
        }
    }

    const handleExpDate = (event) => {
        if (event.target.value === 'EXP_NO1') {
            setForm({ ...Form, Package_exp_status: event.target.value, Package_exp_days: null });
        } else {
            setForm({ ...Form, Package_exp_status: event.target.value, Package_exp_date: null });
        }
    }

    const handleChangeInput = (event) => {
        const { target } = event;
        const { name } = target

        setForm({ ...Form, [name]: target.value });
    }

    const handleStartDate = (date) => {
        setForm({ ...Form, Package_start: date });
    }

    const handleEndtDate = (date) => {
        setForm({ ...Form, Package_end: date });
    }

    const handlesetExpDate = (date) => {
        setForm({ ...Form, Package_exp_date: date });
    }

    const handleSpecial_StartDate = (date) => {
        setForm({ ...Form, Package_special_start: date });
    }

    const handleSpecial_EndtDate = (date) => {
        setForm({ ...Form, Package_special_end: date });
    }

    const handleChangeDays = (event, item) => {
        setForm({ ...Form, Package_exp_days: item });
    }





    const Submit = (event) => {
        event.preventDefault();
        let output = 0
        datatable.filter((element, index) => {
            if ((element.total === 0 || element.total === '0')) {
                output--;
            } else {
                output++;
            }
        });

        if (output === datatable.length) {
            if (check_image(images)) {
                if (datatable.length !== 0) {
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
                        text: 'กรุณาเลือกสินค้าที่ร่วมรายการ',
                        icon: "warning",
                    })
                }
            } else {
                alert_images();
            }
        } else {
            Swal.fire({
                // title: "Price",
                text: 'กรุณากรอกราคาส่วนลด',
                icon: "info",
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

    const handleGetToal = (event, index) => {
        if (keyValue(event.target.value)) {
            let newArr = [...datatable];
            newArr[index]['total'] = event.target.value;
            setData(newArr);
        }
    }

    const handlePriceDiff = (event, index) => {
        if (keyValue(event.target.value)) {
            let newArr = [...datatable];
            newArr[index]['gmm_product_price_diff'] = event.target.value;
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
                            reset_value[key]['total'] = '';
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

    // new content 
    const [hiddBtn, setHiddBtn] = useState(false);
    const [PreviewMulti, setPreviewMulti] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedImage, setSelectedImage] = useState({ path: '/image/demo_img.jpg' });
    const carouselItemsRef = useRef([]);
    const [images, setImages] = useState([
        { path: '/image/demo_img.jpg', base64: '', status: false },
        { path: '/image/demo_img.jpg', base64: '', status: false },
    ]);
    // /Backoffice/image/demo_img.jpg
    const alert_images = () => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "กรุณาอัพโหลด 2 รูป",
            icon: "warning",
        })
    }

    const check_image = (arr) => {
        let count = 0;
        let status = true;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i]['path'] === '/image/demo_img.jpg') {
                count++;
            }

            if (count !== 0) {
                status = false;
            }
        }

        return status;

    }

    const handleRightClick = () => {
        if (images && images.length > 0) {
            let newIdx = selectedImageIndex + 1;
            if (newIdx >= images.length) {
                newIdx = 0;
            }
            handleSelectedImageChange(newIdx);
        }
    };

    const handleLeftClick = () => {
        if (images && images.length > 0) {
            let newIdx = selectedImageIndex - 1;
            if (newIdx < 0) {
                newIdx = images.length - 1;
            }
            handleSelectedImageChange(newIdx);
        }
    };

    const handleDeleteImage = () => {

        let minus = selectedCount - 1
        let newArr = [...images];
        newArr.splice(selectedImageIndex, 1)
        newArr.push({ path: '/image/demo_img.jpg', base64: '', status: false })

        setHiddBtn(true)
        setImages(newArr)
        setSelectedImageIndex(minus);
        setSelectedCount(minus)
        setSelectedImage({ ...selectedImage, path: '/image/demo_img.jpg' })
    }

    const handleSelectedImageChange = (newIdx) => {
        if (images && images.length > 0) {
            setSelectedImage(images[newIdx]);
            setSelectedImageIndex(newIdx);
            if (carouselItemsRef?.current[newIdx]) {
                carouselItemsRef?.current[newIdx]?.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
            }
        }

        if (images[newIdx] !== '/image/demo_img.jpg') {
            setHiddBtn(true)
        }
    };

    const handleuploadChnageImage = (event) => {
        let file = event.target.files[0];
        if (file) {
            let size = file.size / 1024
            if (size <= 1024) {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.readyState === 2) {
                            let newArr = [...images];
                            newArr[selectedImageIndex].path = reader.result
                            newArr[selectedImageIndex].base64 = reader.result
                            newArr[selectedImageIndex].status = true
                            //-----------------------------------
                            setSelectedImage(images[selectedImageIndex]);
                            setImages(newArr)
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
            document.getElementById("InputFile2").value = "";
        }
    }

    const handleuploadMultiFile = (event, index) => {
        if (selectedCount !== 2) {
            let file = event.target.files[0];
            if (file) {
                let size = file.size / 1024
                if (size <= 1024) {
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (reader.readyState === 2) {
                                let newArr = [...images];
                                newArr[selectedCount].path = reader.result
                                newArr[selectedCount].base64 = reader.result
                                newArr[selectedCount].status = true
                                //-----------------------------------
                                setSelectedImageIndex(null)
                                setSelectedImage(images[selectedCount]);
                                setImages(newArr)
                                // //-----------------------------------
                                let plus = selectedCount + 1
                                setSelectedCount(plus)
                                setHiddBtn(false)
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
                document.getElementById("InputFile3").value = "";
            }
        } else {
            Swal.fire({
                title: "รูปเต็ม",
                text: "ไม่สามารถอัพโหลดรูปภาพ เนื่องจากสามารถอัพโหลดได้เพียง 2 รูป",
                icon: "warning",
            })
        }
    }

    const handlePreviewMultiOpen = () => {
        (selectedImage.path !== "/image/demo_img.jpg") && setPreviewMulti(true);
    }

    const handlePreviewMultiClose = () => {
        setPreviewMulti(false)
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
                                <img src={selectedImage.path}
                                    alt="Gomamma"
                                    onClick={handlePreviewMultiOpen}
                                    className={classes.responsive_image}></img>
                                <div className="carousel">
                                    <div className="carousel__images">

                                        {images &&
                                            images.map((image, idx) => (
                                                <Box key={idx}
                                                    onClick={() => handleSelectedImageChange(idx)}
                                                    style={{ backgroundImage: `url(${image.path})` }}
                                                    className={`carousel__image ${selectedImageIndex === idx && "carousel__image-selected"
                                                        }`}
                                                    ref={(el) => (carouselItemsRef.current[idx] = el)}
                                                />
                                            ))}
                                    </div>
                                    <IconButton
                                        size="small"
                                        onClick={handleLeftClick}
                                        style={{ position: 'absolute', left: '10px', background: 'rgb(0,0,0,0.2)' }}
                                        className="carousel__button carousel__button-left"
                                    >
                                        <NavigateBefore style={{ color: 'white' }} />
                                    </IconButton>

                                    <IconButton
                                        size="small"
                                        onClick={handleRightClick}
                                        style={{ position: 'absolute', right: '10px', background: 'rgb(0,0,0,0.2)' }}
                                        className="carousel__button carousel__button-right"
                                    >
                                        <NavigateNext style={{ color: 'white' }} />
                                    </IconButton>

                                </div>
                            </Box>
                            {(hiddBtn === true && selectedImage.path !== '/image/demo_img.jpg') ?
                                <>
                                    <Button
                                        onClick={handleDeleteImage}
                                        variant="contained"
                                        color="secondary"
                                        style={{
                                            textTransform: 'none',
                                        }}
                                        fullWidth>
                                        Delete Image
                                    </Button>
                                    <Box mt={1} />
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
                                        Change Image
                                        <input
                                            id="InputFile2"
                                            onChange={(e) => { handleuploadChnageImage(e) }}
                                            type="file"
                                            accept="image/x-png,image/gif,image/jpeg"
                                            hidden
                                        />
                                    </Button>
                                </>
                                :
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
                                        id="InputFile3"
                                        onChange={(e) => { handleuploadMultiFile(e) }}
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        hidden
                                    />
                                </Button>
                            }

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
                                            name="Package_name"
                                            label="ชื่อคูปอง"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.Package_name}
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
                                            name="Package_desc"
                                            label="รายละเอียด"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.Package_desc}
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
                                            name="Package_price"
                                            label="ราคา"
                                            type="number"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.Package_price}
                                            onChange={(e) => { (keyValue(e.target.value)) && setForm({ ...Form, Package_price: e.target.value }); }}
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
                                        <TextField
                                            name="Package_point"
                                            label="คะแนน"
                                            type="number"
                                            margin="dense"
                                            variant="outlined"
                                            value={Form.Package_point}
                                            onChange={(e) => { (keyValue(e.target.value)) && setForm({ ...Form, Package_point: e.target.value }); }}
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
                                            value={Form.Package_start}
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
                                            value={Form.Package_end}
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
                                <FormLabel className={classes.font_normal}><HeadersII classes={classes} /></FormLabel>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <RadioGroup row aria-label="position" value={Form.Package_special_status} onChange={handleSpecialPoint} defaultValue="top">
                                            {switchs.map((status) =>
                                                <FormControlLabel key={status.gmm_switch_id} value={status.gmm_switch_id}
                                                    classes={{ label: classes.font_normal }}
                                                    control={<Radio color="primary" />}
                                                    label={status.gmm_switch_name} >
                                                </FormControlLabel>
                                            )}
                                        </RadioGroup>
                                    </Grid>
                                    {Form.Package_special_status === 'ON' &&
                                        <>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="Package_special_point"
                                                    label="คะแนน"
                                                    type="number"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={Form.Package_special_point}
                                                    onChange={(e) => { (keyValue(e.target.value)) && setForm({ ...Form, Package_special_point: e.target.value }); }}
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
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <KeyboardDatePicker
                                                    label="วันที่เริ่ม"
                                                    placeholder="วัน/เดือน/ปี"
                                                    format="dd/MM/yyyy"
                                                    value={Form.Package_special_start}
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
                                                    value={Form.Package_special_end}
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
                                                />
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
                                        <RadioGroup row aria-label="position" value={Form.Package_exp_status} onChange={handleExpDate} defaultValue="top">
                                            {exp_date.map((exp) =>
                                                <FormControlLabel key={exp.id} value={exp.id}
                                                    classes={{ label: classes.font_normal }}
                                                    control={<Radio color="primary" required />}
                                                    label={exp.desc}>
                                                </FormControlLabel>
                                            )}

                                            {Form.Package_exp_status === 'EXP_NO1' &&
                                                <>
                                                    <Grid item xs={12}>
                                                        <KeyboardDatePicker
                                                            label="วัน/เดือน/ปี"
                                                            format="dd/MM/yyyy"
                                                            value={Form.Package_exp_date}
                                                            onChange={handlesetExpDate}
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

                                            {Form.Package_exp_status === 'EXP_NO2' &&
                                                <>
                                                    <Grid item xs={12}>
                                                        <Autocomplete
                                                            classes={{
                                                                input: classes.font_normal,
                                                                option: classes.font_normal,
                                                            }}
                                                            options={nmMstr}
                                                            getOptionLabel={(value) => value}
                                                            getOptionSelected={(option, value) =>
                                                                option === value
                                                            }
                                                            value={Form.Package_exp_days}
                                                            onChange={handleChangeDays}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="หมดอายุใน / วัน"
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
                                                </>
                                            }
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </CardContent>
                    </Card>
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
                                                    <StyledTableCell width='15%' align="left">
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
                                                            value={row.total}
                                                            onChange={(e) => { handleGetToal(e, index) }}
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
                                                            value={row.gmm_product_price_diff}
                                                            onChange={(e) => { handlePriceDiff(e, index) }}
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
                                                    <StyledTableCell width='30%' align="left">
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

            {PreviewMulti &&
                <Lightbox
                    mainSrc={selectedImage.path}
                    onCloseRequest={handlePreviewMultiClose}
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

const exp_date = [{ id: 'EXP_NO1', desc: 'วันหมดอายุ' }, { id: 'EXP_NO2', desc: 'นับจากวันที่ซื้อ' }];

