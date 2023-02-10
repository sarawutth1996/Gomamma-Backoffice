/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Avatar, Backdrop, Button, Box, Card, CardContent, TextField, Typography, Grid, IconButton, InputAdornment, FormLabel, FormControlLabel, FormControl, Radio, RadioGroup,
    Dialog, DialogTitle, DialogContent, TableContainer, Paper, Table, TableBody, TableCell, TableRow, TableFooter, TablePagination, TableHead, TableSortLabel,
    List, ListItem, ListItemAvatar, ListItemText
} from "@material-ui/core";
import { blue } from '@material-ui/core/colors';
import { Add, Close, Edit, Description, Subject, LocalParking, Save, FolderOpen, NavigateNext, NavigateBefore, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Search } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import Swal from 'sweetalert2'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import config from '../../config'

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
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
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
    font_list_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
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
                    <Description />
                    <Typography className={classes.font_header}>กำหนดของรางวัล</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function Product({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;รายละเอียดสินค้า</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function CouponCode({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;รายละเอียดคูปอง (Partner)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function ECouponCode({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;รายละเอียด E-Coupon</Typography>
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

function TopicII({ classes, handleProduct, status }) {
    return (
        <>
            <Box pt={2} pb={0} className={classes.displayflexHead}>
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
                        variant="contained"
                        color="primary"
                        disabled={status}
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

const product = {
    product_id: '',
    product_partner_array: null,
    product_partner_name: '',
    product_name: '',
    product_point: '',
    product_limit: '',
    product_title: '',
    product_content1: '',
    product_content2: '',
    product_extra: '',
    product_start_date: null, //null
    product_end_date: null, //null
}

const Ecoupon = {
    Ecoupon_id: '',
    Ecoupon_partner_array: null,
    Ecoupon_partner_name: '',
    Ecoupon_name: '',
    Ecoupon_point: '',
    Ecoupon_limit: '',
    Ecoupon_title: '',
    Ecoupon_content1: '',
    Ecoupon_content2: '',
    Ecoupon_extra: '',
    Ecoupon_start_date: null, //null
    Ecoupon_end_date: null, //null
    Ecoupon_exp_date: null, //null
    // Ecoupon_discount: 'bath',
    // Ecoupon_discount_bath: '',
    // Ecoupon_discount_percent: '',
}

const coupon = {
    coupon_id: '',
    coupon_partner_array: null,
    coupon_partner_name: '',
    coupon_name: '',
    coupon_point: '',
    coupon_limit: '',
    coupon_title: '',
    coupon_content1: '',
    coupon_content2: '',
    coupon_extra: '',
    coupon_start_date: null, //null
    coupon_end_date: null, //null
}

export default function Reward() {
    const url = config.API_URL + "models/Reward/Reward_item.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const classes = useStyles();
    const { vision, id } = useParams();
    const [open, setOpen] = useState(false);
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [PreviewOpen, setPreview] = useState(false);
    const [openPartner, setOpenPartner] = useState(false);
    const [Type, setType] = useState({ reward_type: 'PRODUCT' });
    const [Form1, setForm1] = useState(product);
    const [Form2, setForm2] = useState(coupon);
    const [Form3, setForm3] = useState(Ecoupon);
    const [Partners, setList] = useState([]);
    const [service, setService] = useState([]);
    const [products, setMaster] = useState([]);
    const [datatable, setData] = useState([]);
    const [incl, setInclude] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');

    const [upload, setUpload] = useState({
        coupon_file: '',
        coupon_base64: '',
        coupon_preview: '/image/demo_img.jpg',
    })

    const headCells = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_product_id', label: 'รหัสสินค้า', width: '10%', align: "left" },
        { id: 'gmm_product_name', label: 'ชื่อสินค้า', width: '20%', align: "left" },
        { id: 'gmm_product_price', label: 'ราคา', width: '15%', align: "center" },
        { id: 'discount_price', label: 'ส่วนลด (บาท)', width: '20%', align: "center" },
        { id: 'discount_percent', label: 'ส่วนลด (%)', width: '20%', align: "center" },
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
            id: id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (res.data.length !== 0) {
                if (res.select === 'COUPON') {
                    setForm2(res.data);
                    setUpload(res.upload)
                }

                if (res.select === 'ECOUPON') {
                    setForm3(res.data);
                    setUpload(res.upload);
                    setData(res.datatable);
                    setInclude(res.incl);
                }

                if (res.select === 'PRODUCT') {
                    setForm1(res.data);
                    setImages(res.upload);
                }
                //----------------------------------------------
                setType({ ...Type, reward_type: res.select })
            }

            setMaster(res.product);
            setSelectedCount(res.count);
            setService(res.type)
            setList(res.partner);
            setBoolean(false);
        }
    }

    const handleCode = (event) => {
        setType({ ...Type, reward_type: event.target.value });
    }

    const handlePreviewOpen = () => {
        (upload.coupon_preview !== "/image/demo_img.jpg") && setPreview(true);
    }

    const handlePreviewClose = () => {
        setPreview(false)
    }

    const handleOpenPartner = () => {
        setOpenPartner(true)
    }

    const handleClosePartner = () => {
        setOpenPartner(false)
    }

    const handleClickPartner = (row) => {
        if (Type.reward_type === 'PRODUCT') {
            setForm1({ ...Form1, product_partner_array: row, product_partner_name: row.gmm_partner_name })
        }

        if (Type.reward_type === 'COUPON') {
            setForm2({ ...Form2, coupon_partner_array: row, coupon_partner_name: row.gmm_partner_name })
        }

        if (Type.reward_type === 'ECOUPON') {
            setForm3({ ...Form3, Ecoupon_partner_array: row, Ecoupon_partner_name: row.gmm_partner_name })
        }
        //..
        setOpenPartner(false)
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
            document.getElementById("InputFile1").value = "";
        }
    }

    // Form1
    const [hiddBtn, setHiddBtn] = useState(false);
    const [PreviewMulti, setPreviewMulti] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedImage, setSelectedImage] = useState({ path: '/image/demo_img.jpg' });
    const carouselItemsRef = useRef([]);
    const [images, setImages] = useState([
        { path: '/image/demo_img.jpg', base64: '', status: false },
        { path: '/image/demo_img.jpg', base64: '', status: false },
        { path: '/image/demo_img.jpg', base64: '', status: false },
        { path: '/image/demo_img.jpg', base64: '', status: false },
        { path: '/image/demo_img.jpg', base64: '', status: false },
    ]);

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
        if (selectedCount !== 5) {
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
                text: "ไม่สามารถอัพโหลดรูปภาพ เนื่องจากสามารถอัพโหลดได้เพียง 5 รูป",
                icon: "warning",
            })
        }
    }

    const handleProductStartDate = (date) => {
        setForm1({ ...Form1, product_start_date: date });
    }

    const handleProductEndDate = (date) => {
        setForm1({ ...Form1, product_end_date: date });
    }


    const handlePreviewMultiOpen = () => {
        (selectedImage.path !== "/image/demo_img.jpg") && setPreviewMulti(true);
    }

    const handlePreviewMultiClose = () => {
        setPreviewMulti(false)
    }

    // Form2

    const handleCouponStartDate = (date) => {
        setForm2({ ...Form2, coupon_start_date: date });
    }

    const handleCouponEndDate = (date) => {
        setForm2({ ...Form2, coupon_end_date: date });
    }

    // Form3

    const handleECouponStartDate = (date) => {
        setForm3({ ...Form3, Ecoupon_start_date: date });
    }

    const handleECouponEndDate = (date) => {
        setForm3({ ...Form3, Ecoupon_end_date: date });
    }

    const handleECouponExpDate = (date) => {
        setForm3({ ...Form3, Ecoupon_exp_date: date });
    }

    const handleDiscount = (event, item) => {
        setForm3({ ...Form3, Ecoupon_discount: item });
    }



    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    async function SaveData(Form, type, upload) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_item",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: Form,
            type: type,
            upload: upload,
            product: datatable
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
                state.push('/Home/ManageReward/' + vision);
            })
        }
    }

    //------------------------------------------------

    const Submit = (event) => {
        event.preventDefault();
        if (Type.reward_type === 'PRODUCT') {
            if (check_image(images)) {
                if (Form1.product_partner_name !== '') {
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
                            SaveData(Form1, Type.reward_type, images, [])
                        }
                    });
                } else {
                    alert_partner();
                }
            } else {
                alert_images();
            }
        }

        if (Type.reward_type === 'COUPON') {
            if (Form2.coupon_partner_name !== '') {
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
                            SaveData(Form2, Type.reward_type, upload, [])
                        }
                    });
                } else {
                    alert_upload();
                }
            } else {
                alert_partner();
            }
        }

        if (Type.reward_type === 'ECOUPON') {
            if (Form3.Ecoupon_partner_name !== '') {
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
                            SaveData(Form3, Type.reward_type, upload, datatable)
                        }
                    });
                } else {
                    alert_upload();
                }
            } else {
                alert_partner();
            }
        }

    }

    const alert_upload = () => {
        Swal.fire({
            title: "Upload Image",
            text: "กรุณาอัพโหลดรูปภาพ และลองใหม่อีกครั้ง",
            icon: "warning",
        })
    }

    const alert_partner = () => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "กรุณาเลือก Partner",
            icon: "warning",
        })
    }

    const alert_images = () => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "กรุณาอัพโหลด อย่างน้อย 1 รูป",
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

            if (count === arr.length) {
                status = false;
            }
        }

        return status;

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
            <Headers classes={classes} />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
                <form onSubmit={Submit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8} md={8} />
                        {Type.reward_type !== 'PRODUCT' ?
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
                                        textTransform: 'none',
                                    }}
                                    fullWidth
                                    required
                                >
                                    Upload Image
                                    <input
                                        id="InputFile1"
                                        onChange={(e) => { handleuploadFile(e) }}
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        hidden
                                    />
                                </Button>
                            </Grid>
                            :
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
                        }


                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent style={{ paddingBottom: '16px' }}>
                                    <FormControl>
                                        <FormLabel className={classes.font_normal}>เลือกประเภทของรางวัล</FormLabel>
                                        <RadioGroup row aria-label="position" value={Type.reward_type} onChange={handleCode} defaultValue="top">
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
                    {Type.reward_type === 'PRODUCT' &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent style={{ paddingBottom: '16px' }}>
                                            <FormControl>
                                                <FormLabel className={classes.font_normal}><Product classes={classes} /></FormLabel>
                                                <Box mt={0} />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="พาร์ทเนอร์"
                                                            variant="outlined"
                                                            value={Form1.product_partner_name}
                                                            onChange={(event) => { setForm1({ ...Form1, product_partner_name: event.target.value }) }}
                                                            InputProps={{
                                                                readOnly: true,
                                                                className: classes.font_normal,
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton onClick={handleOpenPartner}>
                                                                            <FolderOpen fontSize="small" />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            readOnly
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="ชื่อรางวัล"
                                                            variant="outlined"
                                                            value={Form1.product_name}
                                                            onChange={(event) => { setForm1({ ...Form1, product_name: event.target.value }) }}
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
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="คะแนน"
                                                            variant="outlined"
                                                            value={Form1.product_point}
                                                            onChange={(event) => { (keyValue(event.target.value)) && setForm1({ ...Form1, product_point: event.target.value }) }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            type="number"
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
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="จำนวนโควต้า"
                                                            variant="outlined"
                                                            value={Form1.product_limit}
                                                            onChange={(event) => { (keyValue(event.target.value)) && setForm1({ ...Form1, product_limit: event.target.value }) }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            type="number"
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
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Title"
                                                            variant="outlined"
                                                            value={Form1.product_title}
                                                            onChange={(event) => { setForm1({ ...Form1, product_title: event.target.value }) }}
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
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Content (1)"
                                                            variant="outlined"
                                                            value={Form1.product_content1}
                                                            onChange={(event) => { setForm1({ ...Form1, product_content1: event.target.value }) }}
                                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            rows={3}
                                                            multiline
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Content (2)"
                                                            variant="outlined"
                                                            value={Form1.product_content2}
                                                            onChange={(event) => { setForm1({ ...Form1, product_content2: event.target.value }) }}
                                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            rows={3}
                                                            multiline
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="เงื่อนไข"
                                                            variant="outlined"
                                                            value={Form1.product_extra}
                                                            onChange={(event) => { setForm1({ ...Form1, product_extra: event.target.value }) }}
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
                                                        <KeyboardDatePicker
                                                            label="วันที่เริ่ม"
                                                            placeholder="วัน/เดือน/ปี"
                                                            format="dd/MM/yyyy"
                                                            value={Form1.product_start_date}
                                                            onChange={handleProductStartDate}
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
                                                            value={Form1.product_end_date}
                                                            onChange={handleProductEndDate}
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
                                </Grid>
                                <Grid item xs={12} >
                                    <ButtonSubmit classes={classes} status={promise} />
                                </Grid>
                            </Grid>
                        </>
                    }
                    {Type.reward_type === 'COUPON' &&
                        <>
                            <Box mt={1} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent style={{ paddingBottom: '16px' }}>
                                            <FormControl>
                                                <FormLabel className={classes.font_normal}><CouponCode classes={classes} /></FormLabel>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="พาร์ทเนอร์"
                                                            variant="outlined"
                                                            value={Form2.coupon_partner_name}
                                                            onChange={(event) => { setForm2({ ...Form2, coupon_partner_name: event.target.value }) }}
                                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                            InputProps={{
                                                                readOnly: true,
                                                                className: classes.font_normal,
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton onClick={handleOpenPartner}>
                                                                            <FolderOpen fontSize="small" />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="ชื่อรางวัล"
                                                            variant="outlined"
                                                            value={Form2.coupon_name}
                                                            onChange={(event) => { setForm2({ ...Form2, coupon_name: event.target.value }) }}
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
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="คะแนน"
                                                            variant="outlined"
                                                            value={Form2.coupon_point}
                                                            onChange={(event) => { (keyValue(event.target.value)) && setForm2({ ...Form2, coupon_point: event.target.value }) }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            type="number"
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
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="จำนวนโควต้า"
                                                            variant="outlined"
                                                            value={Form2.coupon_limit}
                                                            onChange={(event) => { (keyValue(event.target.value)) && setForm2({ ...Form2, coupon_limit: event.target.value }) }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            type="number"
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
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Title"
                                                            variant="outlined"
                                                            value={Form2.coupon_title}
                                                            onChange={(event) => { setForm2({ ...Form2, coupon_title: event.target.value }) }}
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
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Content (1)"
                                                            variant="outlined"
                                                            value={Form2.coupon_content1}
                                                            onChange={(event) => { setForm2({ ...Form2, coupon_content1: event.target.value }) }}
                                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            rows={3}
                                                            multiline
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Content (2)"
                                                            variant="outlined"
                                                            value={Form2.coupon_content2}
                                                            onChange={(event) => { setForm2({ ...Form2, coupon_content2: event.target.value }) }}
                                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            rows={3}
                                                            multiline
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="เงื่อนไข"
                                                            variant="outlined"
                                                            value={Form2.coupon_extra}
                                                            onChange={(event) => { setForm2({ ...Form2, coupon_extra: event.target.value }) }}
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
                                                        <KeyboardDatePicker
                                                            label="วันที่เริ่ม"
                                                            placeholder="วัน/เดือน/ปี"
                                                            format="dd/MM/yyyy"
                                                            value={Form2.coupon_start_date}
                                                            onChange={handleCouponStartDate}
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
                                                            value={Form2.coupon_end_date}
                                                            onChange={handleCouponEndDate}
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

                                </Grid>
                                <Grid item xs={12} >
                                    <ButtonSubmit classes={classes} status={promise} />
                                </Grid>
                            </Grid>
                        </>
                    }

                    {Type.reward_type === 'ECOUPON' &&
                        <>
                            <Box mt={1} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent style={{ paddingBottom: '16px' }}>
                                            <FormControl>
                                                <FormLabel className={classes.font_normal}><ECouponCode classes={classes} /></FormLabel>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="พาร์ทเนอร์"
                                                            variant="outlined"
                                                            value={Form3.Ecoupon_partner_name}
                                                            onChange={(event) => { setForm3({ ...Form3, Ecoupon_partner_name: event.target.value }) }}
                                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                            InputProps={{
                                                                readOnly: true,
                                                                className: classes.font_normal,
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton onClick={handleOpenPartner}>
                                                                            <FolderOpen fontSize="small" />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            readOnly
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="ชื่อรางวัล"
                                                            variant="outlined"
                                                            value={Form3.Ecoupon_name}
                                                            onChange={(event) => { setForm3({ ...Form3, Ecoupon_name: event.target.value }) }}
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
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="คะแนน"
                                                            variant="outlined"
                                                            value={Form3.Ecoupon_point}
                                                            onChange={(event) => { (keyValue(event.target.value)) && setForm3({ ...Form3, Ecoupon_point: event.target.value }) }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            type="number"
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
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            margin="dense"
                                                            label="จำนวนโควต้า"
                                                            variant="outlined"
                                                            value={Form3.Ecoupon_limit}
                                                            onChange={(event) => { (keyValue(event.target.value)) && setForm3({ ...Form3, Ecoupon_limit: event.target.value }) }}
                                                            onKeyDown={(e) => { formatInput(e) }}
                                                            type="number"
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
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Title"
                                                            variant="outlined"
                                                            value={Form3.Ecoupon_title}
                                                            onChange={(event) => { setForm3({ ...Form3, Ecoupon_title: event.target.value }) }}
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
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Content (1)"
                                                            variant="outlined"
                                                            value={Form3.Ecoupon_content1}
                                                            onChange={(event) => { setForm3({ ...Form3, Ecoupon_content1: event.target.value }) }}
                                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            rows={3}
                                                            multiline
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="Content (2)"
                                                            variant="outlined"
                                                            value={Form3.Ecoupon_content2}
                                                            onChange={(event) => { setForm3({ ...Form3, Ecoupon_content2: event.target.value }) }}
                                                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            rows={3}
                                                            multiline
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <TextField
                                                            margin="dense"
                                                            label="เงื่อนไข"
                                                            variant="outlined"
                                                            value={Form3.Ecoupon_extra}
                                                            onChange={(event) => { setForm3({ ...Form3, Ecoupon_extra: event.target.value }) }}
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
                                                        <KeyboardDatePicker
                                                            label="วันที่เริ่ม"
                                                            placeholder="วัน/เดือน/ปี"
                                                            format="dd/MM/yyyy"
                                                            value={Form3.Ecoupon_start_date}
                                                            onChange={handleECouponStartDate}
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
                                                            value={Form3.Ecoupon_end_date}
                                                            onChange={handleECouponEndDate}
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
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <KeyboardDatePicker
                                                            label="วันที่หมดอายุคูปอง"
                                                            placeholder="วัน/เดือน/ปี"
                                                            format="dd/MM/yyyy"
                                                            value={Form3.Ecoupon_exp_date}
                                                            onChange={handleECouponExpDate}
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



                                                    {/* <Grid item xs={12} >
                                                        <Card variant="outlined">
                                                            <CardContent style={{ paddingBottom: '16px' }}>
                                                                <FormControl>
                                                                    <RadioGroup row aria-label="position" value={Form3.Ecoupon_discount} onChange={handleDiscount} defaultValue="top">
                                                                        {discount.map((type) =>
                                                                            <FormControlLabel key={type.id} value={type.id}
                                                                                classes={{ label: classes.font_normal }}
                                                                                control={<Radio color="primary" />}
                                                                                label={type.desc} >
                                                                            </FormControlLabel>
                                                                        )}
                                                                    </RadioGroup>
                                                                </FormControl>
                                                                {Form3.Ecoupon_discount === 'bath' &&
                                                                    <TextField
                                                                        margin="dense"
                                                                        variant="outlined"
                                                                        value={Form3.Ecoupon_discount_bath}
                                                                        onChange={(event) => { (keyValue(event.target.value)) && setForm3({ ...Form3, Ecoupon_discount_bath: event.target.value }); }}
                                                                        onKeyDown={(e) => { formatInput(e) }}
                                                                        type="number"
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
                                                                }

                                                                {Form3.Ecoupon_discount === 'percent' &&
                                                                    <TextField
                                                                        margin="dense"
                                                                        variant="outlined"
                                                                        value={Form3.Ecoupon_discount_percent}
                                                                        onChange={(event) => { (keyValue(event.target.value)) && setForm3({ ...Form3, Ecoupon_discount_percent: event.target.value }); }}
                                                                        onKeyDown={(e) => { formatInput(e) }}
                                                                        type="number"
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
                                                                }
                                                            </CardContent>
                                                        </Card>
                                                    </Grid> */}
                                                </Grid>
                                            </FormControl>
                                        </CardContent>
                                    </Card>

                                </Grid>
                                <Grid item xs={12} >
                                    <TopicII classes={classes} handleProduct={handleProduct} status={promise} />
                                </Grid>
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
                                <Grid item xs={12} >
                                    <ButtonSubmit classes={classes} status={promise} />
                                </Grid>

                            </Grid>
                        </>
                    }
                </form>
            </MuiPickersUtilsProvider>

            <Dialog
                onClose={handleClosePartner}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openPartner}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleClosePartner}>
                    Partner
                </MuiDialogTitle>
                <MuiDialogContent dividers>

                    <List dense={true}>
                        {Partners.map((list, index) => (
                            <ListItem button key={index} onClick={() => { handleClickPartner(list) }}>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <LocalParking />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={list.gmm_partner_name} secondary={list.gmm_partner_company} classes={{ primary: classes.font_list_normal, secondary: classes.font_normal }} />
                            </ListItem>
                        ))}
                    </List>


                </MuiDialogContent>
            </Dialog>

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

            {PreviewOpen &&
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
    )
}




const discount = [{ id: 'bath', desc: 'ส่วนลด (บาท)' }, { id: 'percent', desc: 'ส่วนลด (%)' }];