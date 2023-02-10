/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AppBar, Backdrop, Button, Box, Typography, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Tabs, Tab, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Hidden, InputAdornment, FormHelperText
} from "@material-ui/core";
import { Close, Save, Refresh, Room, Search, NavigateBefore, NavigateNext } from "@material-ui/icons";
import RedeemIcon from '@material-ui/icons/Redeem';
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import config from '../../config'

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
    },

});

const AntTabs = withStyles({
    indicator: {
        backgroundColor: 'white',
    },
})(Tabs);

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
        padding: '12px 24px 24px 24px',
    },
}))(DialogContent);

const MuiDialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
}))(DialogActions);


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        border: '1px solid #eeeeee'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    banner: {
        width: '50%',
        // height: '200px',
        padding: theme.spacing(2),
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
    showImage: {
        textAlign: 'center',
        borderBottom: 'solid 1px #e6e6e6',
        marginBottom: '16px'
    },
    responsive_image: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '75%',
    },
    responsive_box: {
        position: 'relative',
        maxWidth: '15%',
        marginRight: '12px',

    },

    responsive_slide: {
        position: 'relative',
        maxWidth: '100%',
        marginBottom: '6px'
    },
    responsive_image_slide: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    ListBorder: {
        border: 'solid 1px #f3f3f3'
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
    font_primary_normal: {
        fontFamily: 'Regular',
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    font_secondary_normal: {
        fontFamily: 'Regular',
        fontSize: '12px',
    },
    font_subtitle: {
        fontFamily: 'Regular',
        fontSize: '14px',
    },
    font_end: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: 'right'
    },
    font_mobile_otp: {
        fontFamily: 'Regular',
        fontSize: '24px',
        textAlign: 'center'
    },
    font_tb_right: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: 'right'
    },
    font_tb_center: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: 'left'
    },
    font_style: {
        fontFamily: 'SemiBold',
        paddingBottom: '8px'
    },
    font_content: {
        textIndent: '2em',
        fontFamily: 'Regular',
        fontSize: '14px',
        paddingBottom: '8px'
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

function Headers({ classes, func, status }) {
    return (
        <>
            <Box pt={0} pb={0} className={classes.displayflexHead}>
                <Box className={classes.displayflexHead}>
                    <RedeemIcon />
                    <Typography className={classes.font_header}>แลกของรางวัล</Typography>
                </Box>
                <Box>
                    <Button
                        className={classes.font_normal}
                        onClick={func}
                        disabled={status}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        ตรวจสอบประวัติ
                    </Button>
                </Box>

            </Box>
            <PageLine />
            <br />
        </>
    );
}

function DialogHeader({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Room />
                    <Typography className={classes.font_header}>ที่อยู่จัดส่ง</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function DialogFooter({ classes }) {
    return (
        <>
            <Box pt={2} pb={0}>
                <Box className={classes.displayflex}>
                    <RedeemIcon />
                    <Typography className={classes.font_header}>รายการ</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function DialogheadTitle({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <RedeemIcon />
                    <Typography className={classes.font_header}>รายการ</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function ButtonSubmit({ classes }) {
    return (
        <>
            <Box mt={2} mb={2} className={classes.Submit}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.font_normal}
                    startIcon={<Save />}
                >
                    บันทึก
                </Button>
            </Box>
        </>
    )
}

const address = {
    addr_uid: '',
    addr_name: '',
    addr_tel: '',
    addr_desc: '',
    addr_item: '',
    addr_point: '',
    errorTel: {
        status: false,
        message: '',
    },
}

export default function Redeem() {
    const url = config.API_URL + "models/Reward/Reward_redeem.php";
    const classes = useStyles();
    const state = useHistory();
    const telRef = useRef(null);
    const { vision, id } = useParams();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false);
    const [value, setValue] = useState(0);
    const [msgCount, setMsgCount] = useState(0);
    const [searchTab1, SetSearchTab1] = useState('');
    const [searchTab2, SetSearchTab2] = useState('');
    const [searchTab3, SetSearchTab3] = useState('');
    const [FormAddress, setFormAddress] = useState(address);
    const [openRedeem, setOpenRedeem] = useState(false);
    const [openCoupon, setOpenCoupon] = useState(false);
    const [openECoupon, setOpenECoupon] = useState(false);
    const [openItemDialogDesc, setOpenItemDialog] = useState(false);
    const [openCouponDialogDesc, setOpenCouponDialog] = useState(false);
    const [openECouponDialogDesc, setOpenECouponDialog] = useState(false);
    const [params, setParams] = useState({ id: '', name: '', point: 0, tel: '' })
    const [ItemMall, setItemMall] = useState([]);
    const [CouponMall, setCouponMall] = useState([]);
    const [eCouponMall, setEcouponMall] = useState([]);
    const [Rows, setRow] = useState([]);

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {
        const payload = JSON.stringify({
            key: "Payload_profile",
            uid: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            let us = res.data
            setMsgCount((res.recent.gmm_user_temp_desc03 ? res.recent.gmm_user_temp_desc03.length : 0))
            setFormAddress({ ...FormAddress, addr_desc: (res.recent.gmm_user_temp_desc03) ? res.recent.gmm_user_temp_desc03 : '' })
            setParams({ ...params, id: us.gmm_user_id, name: us.gmm_user_fullname, point: us.gmm_user_point, tel: us.gmm_user_tel });
            setItemMall(res.product)
            setCouponMall(res.coupon)
            setEcouponMall(res.ecoupon)
        }
    }

    async function RedeemItem() {

        const payload = JSON.stringify({
            key: "RedeemItem",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: FormAddress
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "แลกของรางวัลสำเร็จ",
                icon: "success",
            }).then((output) => {
                FirstLoad();
                setOpenRedeem(!openRedeem);
            });
        }
    }

    async function RedeemCoupon() {

        const payload = JSON.stringify({
            key: "RedeemCoupon",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: FormAddress
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "แลกของรางวัลสำเร็จ",
                icon: "success",
            }).then((output) => {
                FirstLoad();
                setOpenCoupon(!openCoupon);
            });
        }
    }

    async function RedeemEcoupon() {

        const payload = JSON.stringify({
            key: "RedeemEcoupon",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: FormAddress
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "แลกของรางวัลสำเร็จ",
                icon: "success",
            }).then((output) => {
                FirstLoad();
                setOpenECoupon(!openECoupon);
            });
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleChange = (event, newValue) => {
        SetSearchTab1('')
        SetSearchTab2('')
        SetSearchTab3('')
        setValue(newValue);
    };

    const handlePageHistory = () => {
        state.push('/Home/History/' + vision + '/' + id);
    }


    // Item Mall

    const handleChangeInput = (event) => {
        const { target } = event;
        const { name } = target

        if (name === 'addr_tel') {
            if (target.value.match("^[0-9]*$")) {
                if (target.value.length === 0) {
                    setFormAddress({
                        ...FormAddress,
                        [name]: target.value,
                        errorTel: { message: "", status: false },
                    });
                } else {
                    const fix_number = target.value.substr(0, 2);
                    if (fix_number !== "02" && fix_number !== "06" && fix_number !== "08" && fix_number !== "09") {

                        setFormAddress({
                            ...FormAddress,
                            [name]: target.value,
                            errorTel: {
                                message: "หมวดหมายเลขโทรศัพท์ ไม่ถูกต้อง",
                                status: true,
                            },

                        });
                    } else {
                        if (fix_number === "06" || fix_number === "08" || fix_number === "09") {
                            if (target.value.length == 10) {
                                setFormAddress({
                                    ...FormAddress,
                                    [name]: target.value,
                                    errorTel: { message: "", status: false },
                                });
                            } else {
                                setFormAddress({
                                    ...FormAddress,
                                    [name]: target.value,
                                    errorTel: { message: "หมายเลขโทรศัพท์จำนวน 10 หลัก", status: true },
                                });
                            }
                        } else {
                            if (fix_number === "02") {
                                if (target.value.length == 9) {
                                    setFormAddress({
                                        ...FormAddress,
                                        [name]: target.value,
                                        errorTel: { message: "", status: false },
                                    });

                                } else {
                                    setFormAddress({
                                        ...FormAddress,
                                        [name]: target.value,
                                        errorTel: {
                                            message: "หมายเลขโทรศัพท์จำนวน 9 หลัก",
                                            status: true,
                                        },

                                    });
                                }
                            }
                        }
                    }
                }
            }
        } else if (name === 'addr_desc') {
            setFormAddress({ ...FormAddress, [name]: target.value });
            setMsgCount(event.target.value.length);
        } else {
            setFormAddress({ ...FormAddress, [name]: target.value });
        }

    };

    const handleOpenRedeem = (row) => {
        let number = Number(params.point) - Number(row.gmm_reward_item_point);
        let array = { name: row.gmm_reward_item_coupon_name, mypoint: params.point.toLocaleString("en-US"), pay: row.gmm_reward_item_point.toLocaleString("en-US"), total: number.toLocaleString("en-US") }
        //---------------------------
        setFormAddress({
            ...FormAddress,
            addr_uid: params.id,
            addr_name: params.name,
            addr_tel: params.tel,
            addr_item: row.gmm_reward_item_id,
            addr_point: row.gmm_reward_item_point
        });

        setOpenRedeem(!openRedeem);
        setRow(array);
    }

    const handleCloseRedeem = () => {
        setOpenRedeem(!openRedeem);
    }

    const handleAddress = (event) => {
        event.preventDefault();
        if (FormAddress.errorTel.status === false) {
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
                    RedeemItem();
                }
            })
        } else {
            if (FormAddress.errorTel.status) {
                telRef.current.focus()
            }
        }
    }

    const handleRefresh = () => {
        setMsgCount(0);
        setFormAddress(address);
    }

    const handleOpenItemDialogDesc = (row) => {
        setImages(row.image_slide)
        setSelectedImage(row.image)
        setOpenItemDialog(!openItemDialogDesc)
        setRow(row);
    }

    const handleCloseItemDialogDesc = () => {
        setOpenItemDialog(!openItemDialogDesc);
        setSelectedImageIndex(0)
    }

    // Coupon

    const handleOpenCoupon = (row) => {
        let number = Number(params.point) - Number(row.gmm_reward_item_point);
        let array = { name: row.gmm_reward_item_coupon_name, mypoint: params.point.toLocaleString("en-US"), pay: row.gmm_reward_item_point.toLocaleString("en-US"), total: number.toLocaleString("en-US") }
        //---------------------------
        setFormAddress({
            ...FormAddress,
            addr_uid: params.id,
            addr_name: params.name,
            addr_tel: params.tel,
            addr_item: row.gmm_reward_item_id,
            addr_point: row.gmm_reward_item_point
        });
        setOpenCoupon(!openCoupon);
        setRow(array);
    }

    const handleCloseCoupon = () => {
        setOpenCoupon(!openCoupon);
    }

    const handleOpenCouponDialogDesc = (row) => {
        setOpenCouponDialog(!openCouponDialogDesc)
        setRow(row);
    }

    const handleCloseCouponDialogDesc = () => {
        setOpenCouponDialog(!openCouponDialogDesc);
    }

    const handleSmCoupon = (event) => {
        event.preventDefault();
        if (FormAddress.errorTel.status === false) {
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
                    RedeemCoupon();
                }
            })
        } else {
            if (FormAddress.errorTel.status) {
                telRef.current.focus()
            }
        }
    }

    // E-Coupon

    const handleOpenECoupon = (row) => {
        let number = Number(params.point) - Number(row.gmm_reward_item_point);
        let array = { name: row.gmm_reward_item_coupon_name, mypoint: params.point.toLocaleString("en-US"), pay: row.gmm_reward_item_point.toLocaleString("en-US"), total: number.toLocaleString("en-US") }
        //---------------------------
        setFormAddress({
            ...FormAddress,
            addr_uid: params.id,
            addr_name: params.name,
            addr_tel: params.tel,
            addr_item: row.gmm_reward_item_id,
            addr_point: row.gmm_reward_item_point
        });
        setOpenECoupon(!openECoupon);
        setRow(array);
    }

    const handleCloseECoupon = () => {
        setOpenECoupon(!openECoupon);
    }

    const handleOpenECouponDialogDesc = (row) => {
        setOpenECouponDialog(!openECouponDialogDesc)
        setRow(row);
    }

    const handleCloseECouponDialogDesc = () => {
        setOpenECouponDialog(!openECouponDialogDesc);
    }

    const handleSmECoupon = () => {
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
                RedeemEcoupon();
            }
        })
    }


    //---------------------------------
    //---------------------------------
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const carouselItemsRef = useRef([]);
    const [images, setImages] = useState([]);

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

    const handleSelectedImageChange = (newIdx) => {
        if (images && images.length > 0) {
            setSelectedImage(images[newIdx]);
            setSelectedImageIndex(newIdx);
            if (carouselItemsRef?.current[newIdx]) {
                carouselItemsRef?.current[newIdx]?.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
            }
        }
    };

    ///-----------------------------------------------

    const product_filtered = ItemMall.filter((row) => {
        return row.gmm_reward_item_coupon_name.toLowerCase().includes(searchTab1.toLowerCase())
    })

    const coupon_filtered = CouponMall.filter((row) => {
        return row.gmm_reward_item_coupon_name.toLowerCase().includes(searchTab2.toLowerCase())
    })

    const ecoupon_filtered = eCouponMall.filter((row) => {
        return row.gmm_reward_item_coupon_name.toLowerCase().includes(searchTab3.toLowerCase())
    })


    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} func={handlePageHistory} status={promise} />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography className={classes.font_subtitle}><strong>ชื่อ - นามสกุล :</strong> {params.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.font_end}><strong>คะแนนสะสม :</strong> {params.point.toLocaleString("en-US")} Point</Typography>
                </Grid>
            </Grid>
            <Box mt={2} className={classes.root}>
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
                        <Tab className={classes.font_normal} label="E-coupon" {...a11yProps(2)} />
                    </AntTabs>
                </AppBar>
                <TabPanel value={value} index={0} classes={classes}>
                    <Grid container spacing={2}>

                        <Hidden only={['xs', 'sm']}>
                            <Grid item xs={8} sm={8} md={8} />
                        </Hidden>
                        <Grid item xs={12} sm={12} md={4} >
                            <TextField
                                margin="dense"
                                variant="outlined"
                                placeholder="ค้นหารายชื่อ"
                                onChange={(e) => SetSearchTab1(e.target.value)}
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
                            {product_filtered.length === 0 ?
                                <Box p={4} style={{ textAlign: 'center' }}>
                                    ไม่พบข้อมูล</Box> :
                                <>
                                    {product_filtered.map((item, index) => {
                                        return (
                                            <List key={index}>
                                                <ListItem onClick={() => { handleOpenItemDialogDesc(item) }} button className={classes.ListBorder}>
                                                    <ListItemAvatar className={classes.responsive_box}>
                                                        <img src={item.image}
                                                            alt="Gomamma"
                                                            className={classes.responsive_image}></img>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        classes={{ primary: classes.font_primary_normal, secondary: classes.font_secondary_normal, }}
                                                        primary={item.gmm_reward_item_coupon_name}
                                                        secondary={
                                                            <>
                                                                <span>
                                                                    คะแนน : {item.gmm_reward_item_point.toLocaleString("en-US")}  Point
                                                                </span>
                                                                <br></br>
                                                                <span className={classes.font_secondary_normal}>
                                                                    คงเหลือ : {(Number(item.gmm_reward_item_limit) - Number(item.gmm_reward_item_usage))}
                                                                </span>
                                                            </>}
                                                    >

                                                    </ListItemText>
                                                    <ListItemSecondaryAction>
                                                        <IconButton disabled={(params.point < item.gmm_reward_item_point) || (Number(item.gmm_reward_item_limit) - Number(item.gmm_reward_item_usage)) <= 0} onClick={() => { handleOpenRedeem(item) }} edge="start" aria-label="comments">
                                                            <RedeemIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </List>
                                        )
                                    })}
                                </>
                            }


                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1} classes={classes}>
                    <Grid container spacing={2}>
                        <Hidden only={['xs', 'sm']}>
                            <Grid item xs={8} sm={8} md={8} />
                        </Hidden>
                        <Grid item xs={12} sm={12} md={4} >
                            <TextField
                                margin="dense"
                                variant="outlined"
                                placeholder="ค้นหารายชื่อ"
                                onChange={(e) => SetSearchTab2(e.target.value)}
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
                            {coupon_filtered.length === 0 ?
                                <Box p={4} style={{ textAlign: 'center' }}>
                                    ไม่พบข้อมูล</Box> :
                                <>
                                    {coupon_filtered.map((item, index) => {
                                        return (
                                            <List key={index}>
                                                <ListItem onClick={() => { handleOpenCouponDialogDesc(item) }} button className={classes.ListBorder}>
                                                    <ListItemAvatar className={classes.responsive_box}>
                                                        <img src={item.image}
                                                            alt="Gomamma"
                                                            className={classes.responsive_image}></img>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        classes={{ primary: classes.font_primary_normal, secondary: classes.font_secondary_normal, }}
                                                        primary={item.gmm_reward_item_coupon_name}
                                                        secondary={
                                                            <>
                                                                <span>
                                                                    คะแนน : {item.gmm_reward_item_point.toLocaleString("en-US")}  Point
                                                                </span>
                                                                <br></br>
                                                                <span className={classes.font_secondary_normal}>
                                                                    คงเหลือ : {(Number(item.gmm_reward_item_limit) - Number(item.gmm_reward_item_usage))}
                                                                </span>
                                                            </>}
                                                    >

                                                    </ListItemText>
                                                    <ListItemSecondaryAction>
                                                        <IconButton disabled={params.point < item.gmm_reward_item_point || (Number(item.gmm_reward_item_limit) - Number(item.gmm_reward_item_usage)) <= 0} onClick={() => { handleOpenCoupon(item) }} edge="start" aria-label="comments">
                                                            <RedeemIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </List>
                                        )
                                    })}
                                </>
                            }
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={2} classes={classes}>
                    <Grid container spacing={2}>
                        <Hidden only={['xs', 'sm']}>
                            <Grid item xs={8} sm={8} md={8} />
                        </Hidden>
                        <Grid item xs={12} sm={12} md={4} >
                            <TextField
                                margin="dense"
                                variant="outlined"
                                placeholder="ค้นหารายชื่อ"
                                onChange={(e) => SetSearchTab3(e.target.value)}
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
                            {ecoupon_filtered.length === 0 ?
                                <Box p={4} style={{ textAlign: 'center' }}>
                                    ไม่พบข้อมูล</Box> :
                                <>
                                    {ecoupon_filtered.map((item, index) => {
                                        return (
                                            <List key={index}>
                                                <ListItem onClick={() => { handleOpenECouponDialogDesc(item) }} button className={classes.ListBorder}>
                                                    <ListItemAvatar className={classes.responsive_box}>
                                                        <img src={item.image}
                                                            alt="Gomamma"
                                                            className={classes.responsive_image}></img>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        classes={{ primary: classes.font_primary_normal, secondary: classes.font_secondary_normal, }}
                                                        primary={item.gmm_reward_item_coupon_name}
                                                        secondary={
                                                            <>
                                                                <span>
                                                                    คะแนน : {item.gmm_reward_item_point.toLocaleString("en-US")}  Point
                                                                </span>
                                                                <br></br>
                                                                <span className={classes.font_secondary_normal}>
                                                                    คงเหลือ : {(Number(item.gmm_reward_item_limit) - Number(item.gmm_reward_item_usage))}
                                                                </span>
                                                            </>}
                                                    >
                                                    </ListItemText>
                                                    <ListItemSecondaryAction>
                                                        <IconButton disabled={params.point < item.gmm_reward_item_point || (Number(item.gmm_reward_item_limit) - Number(item.gmm_reward_item_usage)) <= 0} onClick={() => { handleOpenECoupon(item) }} edge="start" aria-label="comments">
                                                            <RedeemIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </List>
                                        )
                                    })}
                                </>
                            }
                        </Grid>
                    </Grid>
                </TabPanel>
            </Box>

            {/* item */}
            <Dialog
                onClose={handleCloseRedeem}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="customized-dialog-title"
                open={openRedeem}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseRedeem}>
                    แลกของรางวัล
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <DialogHeader classes={classes} />
                    <form id="hook_item" onSubmit={handleAddress}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="addr_name"
                                    label="ชื่อ - นามสกุล"
                                    margin="dense"
                                    variant="outlined"
                                    value={FormAddress.addr_name}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 80 }}
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
                                    name="addr_tel"
                                    label="เบอร์โทรศัพท์"
                                    margin="dense"
                                    variant="outlined"
                                    inputRef={telRef}
                                    value={FormAddress.addr_tel}
                                    onChange={handleChangeInput}
                                    error={FormAddress.errorTel.status}
                                    helperText={FormAddress.errorTel.message}
                                    inputProps={{ maxLength: 10 }}
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
                                    name="addr_desc"
                                    label="ที่อยู่จัดส่ง"
                                    variant="outlined"
                                    rows={3}
                                    value={FormAddress.addr_desc}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 256 }}
                                    InputProps={{
                                        className: classes.font_normal,
                                    }}
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    multiline
                                    fullWidth
                                    required
                                />
                                <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                            </Grid>
                        </Grid>
                    </form>
                    <DialogFooter classes={classes} />
                    <Box mt={1} mb={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} md={6}>
                                <Box className={classes.font_tb_left}>
                                    1. {Rows.name}
                                </Box>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2}>
                                <Box className={classes.font_tb_right}>
                                    x 1
                                </Box>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4}>
                                <Box className={classes.font_tb_right}>
                                    {Rows.pay}  Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <PageLine />
                    <Box mt={2} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Box className={classes.font_tb_right}>
                                    คะแนนสะสม
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box className={classes.font_tb_right}>
                                    {Rows.mypoint} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={1} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Box className={classes.font_tb_right}>
                                    แลกรางวัล
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box className={classes.font_tb_right}>
                                    -{Rows.pay} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={1} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8} >
                                <Box className={classes.font_tb_right}>
                                    คงเหลือ
                                </Box>
                            </Grid>
                            <Grid item xs={4} >
                                <Box className={classes.font_tb_right}>
                                    {Rows.total} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
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
                        form="hook_item"
                        type="submit"
                        className={classes.font_normal}
                        variant="contained"
                        color="primary">
                        ยืนยัน
                    </Button>
                </MuiDialogActions>
            </Dialog>

            <Dialog
                onClose={handleCloseItemDialogDesc}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openItemDialogDesc}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseItemDialogDesc}>
                    ข้อมูลสินค้า
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Box className={classes.showImage}>
                        <img src={selectedImage} className={classes.banner}></img>
                    </Box>

                    <Grid item xs={12} >
                        <Box className={classes.responsive_slide}>
                            <div className="carousel">
                                <div className="carousel__images">

                                    {images &&
                                        images.map((image, idx) => (
                                            <Box key={idx}
                                                onClick={() => handleSelectedImageChange(idx)}
                                                style={{ backgroundImage: `url(${image})` }}
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

                    </Grid>
                    <br />


                    <Typography className={classes.font_style}  >
                        {Rows.gmm_reward_item_title}
                    </Typography>
                    <Typography className={classes.font_content}>
                        {Rows.gmm_reward_item_content1}
                    </Typography>
                    <Typography className={classes.font_content}>
                        {Rows.gmm_reward_item_content2}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>เงื่อนไขการใช้งาน :</b> {Rows.gmm_reward_item_extra}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>ระยะเวลาแลกของรางวัล : </b>
                        {Rows.gmm_reward_item_start + ' - ' + Rows.gmm_reward_item_end}
                        {/* {Rows.gmm_reward_item_exp === null ? Rows.gmm_reward_item_start + ' - ' + Rows.gmm_reward_item_end : ' สามารถแลกได้จนกว่าสินค้าจะหมด'
                        } */}
                    </Typography>

                    <br />
                    <Typography className={classes.font_normal}>
                        <b>ติดตามข่าวสารอื่นๆ ได้ที่</b>
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>website :</b> {Rows.gmm_partner_website !== '' ? <a href={Rows.gmm_partner_website} target="_blank">{Rows.gmm_partner_website}</a> : '-'}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>facebook :</b> {Rows.gmm_partner_facebook !== '' ? <a href={Rows.gmm_partner_facebook} target="_blank">{Rows.gmm_partner_facebook}</a> : '-'}
                    </Typography>
                </MuiDialogContent>
            </Dialog>

            {/* coupon */}
            <Dialog
                onClose={handleCloseCoupon}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="customized-dialog-title"
                open={openCoupon}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseCoupon}>
                    แลกของรางวัล
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <form id="hook_coupon" onSubmit={handleSmCoupon}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="addr_name"
                                    label="ชื่อ - นามสกุล"
                                    margin="dense"
                                    variant="outlined"
                                    value={FormAddress.addr_name}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 80 }}
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
                                    name="addr_tel"
                                    label="เบอร์โทรศัพท์"
                                    margin="dense"
                                    variant="outlined"
                                    inputRef={telRef}
                                    value={FormAddress.addr_tel}
                                    onChange={handleChangeInput}
                                    error={FormAddress.errorTel.status}
                                    helperText={FormAddress.errorTel.message}
                                    inputProps={{ maxLength: 10 }}
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
                                    name="addr_desc"
                                    label="ที่อยู่จัดส่ง"
                                    variant="outlined"
                                    rows={3}
                                    value={FormAddress.addr_desc}
                                    onChange={handleChangeInput}
                                    inputProps={{ maxLength: 256 }}
                                    InputProps={{
                                        className: classes.font_normal,
                                    }}
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    multiline
                                    fullWidth
                                    required
                                />
                                <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                            </Grid>
                        </Grid>
                    </form>
                    <DialogheadTitle classes={classes} />
                    <Box mt={1} mb={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} md={6}>
                                <Box className={classes.font_tb_left}>
                                    1. {Rows.name}
                                </Box>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2}>
                                <Box className={classes.font_tb_right}>
                                    x 1
                                </Box>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4}>
                                <Box className={classes.font_tb_right}>
                                    {Rows.pay}  Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <PageLine />
                    <Box mt={2} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Box className={classes.font_tb_right}>
                                    คะแนนสะสม
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box className={classes.font_tb_right}>
                                    {Rows.mypoint} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={1} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Box className={classes.font_tb_right}>
                                    แลกรางวัล
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box className={classes.font_tb_right}>
                                    -{Rows.pay} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={1} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8} >
                                <Box className={classes.font_tb_right}>
                                    คงเหลือ
                                </Box>
                            </Grid>
                            <Grid item xs={4} >
                                <Box className={classes.font_tb_right}>
                                    {Rows.total} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </MuiDialogContent>
                <MuiDialogActions>
                    <Button
                        form="hook_coupon"
                        type="submit"
                        className={classes.font_normal}
                        variant="contained"
                        color="primary">
                        ยืนยัน
                    </Button>
                </MuiDialogActions>
            </Dialog>

            <Dialog
                onClose={handleCloseCouponDialogDesc}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openCouponDialogDesc}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseCouponDialogDesc}>
                    ข้อมูลคูปอง
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Box className={classes.showImage}>
                        <img src={Rows.image} className={classes.banner}></img>
                    </Box>
                    <Typography className={classes.font_style}  >
                        {Rows.gmm_reward_item_title}
                    </Typography>
                    <Typography className={classes.font_content}>
                        {Rows.gmm_reward_item_content1}
                    </Typography>
                    <Typography className={classes.font_content}>
                        {Rows.gmm_reward_item_content2}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>เงื่อนไขการใช้งาน :</b> {Rows.gmm_reward_item_extra}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>ระยะเวลาแลกของรางวัล : </b>
                        {Rows.gmm_reward_item_start + ' - ' + Rows.gmm_reward_item_end}
                        {/* {Rows.gmm_reward_item_exp === null ? Rows.gmm_reward_item_start + ' - ' + Rows.gmm_reward_item_end : ' สามารถแลกได้จนกว่าสินค้าจะหมด'
                        } */}
                    </Typography>
                    <br />
                    <Typography className={classes.font_normal}>
                        <b>ติดตามข่าวสารอื่นๆ ได้ที่</b>
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>website :</b> {Rows.gmm_partner_website !== '' ? <a href={Rows.gmm_partner_website} target="_blank">{Rows.gmm_partner_website}</a> : '-'}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>facebook :</b> {Rows.gmm_partner_facebook !== '' ? <a href={Rows.gmm_partner_facebook} target="_blank">{Rows.gmm_partner_facebook}</a> : '-'}
                    </Typography>
                </MuiDialogContent>
            </Dialog>

            {/* e-coupon */}

            <Dialog
                onClose={handleCloseECoupon}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="customized-dialog-title"
                open={openECoupon}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseECoupon}>
                    แลกของรางวัล
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <DialogheadTitle classes={classes} />
                    <Box mt={1} mb={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} md={6}>
                                <Box className={classes.font_tb_left}>
                                    1. {Rows.name}
                                </Box>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2}>
                                <Box className={classes.font_tb_right}>
                                    x 1
                                </Box>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4}>
                                <Box className={classes.font_tb_right}>
                                    {Rows.pay}  Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <PageLine />
                    <Box mt={2} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Box className={classes.font_tb_right}>
                                    คะแนนสะสม
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box className={classes.font_tb_right}>
                                    {Rows.mypoint} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={1} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Box className={classes.font_tb_right}>
                                    แลกรางวัล
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box className={classes.font_tb_right}>
                                    -{Rows.pay} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={1} mb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={8} >
                                <Box className={classes.font_tb_right}>
                                    คงเหลือ
                                </Box>
                            </Grid>
                            <Grid item xs={4} >
                                <Box className={classes.font_tb_right}>
                                    {Rows.total} Point
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </MuiDialogContent>
                <MuiDialogActions>
                    <Button
                        onClick={handleSmECoupon}
                        className={classes.font_normal}
                        variant="contained"
                        color="primary">
                        ยืนยัน
                    </Button>
                </MuiDialogActions>
            </Dialog>

            <Dialog
                onClose={handleCloseECouponDialogDesc}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openECouponDialogDesc}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseECouponDialogDesc}>
                    ข้อมูล E-Coupon
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Box className={classes.showImage}>
                        <img src={Rows.image} className={classes.banner}></img>
                    </Box>
                    <Typography className={classes.font_style}  >
                        {Rows.gmm_reward_item_title}
                    </Typography>
                    <Typography className={classes.font_content}>
                        {Rows.gmm_reward_item_content1}
                    </Typography>
                    <Typography className={classes.font_content}>
                        {Rows.gmm_reward_item_content2}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>เงื่อนไขการใช้งาน :</b> {Rows.gmm_reward_item_extra}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>ระยะเวลาแลกของรางวัล : </b>
                        {Rows.gmm_reward_item_start + ' - ' + Rows.gmm_reward_item_end}
                        {/* {Rows.gmm_reward_item_exp === null ? Rows.gmm_reward_item_start + ' - ' + Rows.gmm_reward_item_end : ' สามารถแลกได้จนกว่าสินค้าจะหมด'
                        } */}
                    </Typography>
                    {Rows.gmm_reward_item_exp !== null &&
                        <Typography className={classes.font_normal}>
                            <b>หมดเขตการใช้งาน:</b> {Rows.gmm_reward_item_exp}
                        </Typography>
                    }
                    <br />
                    <Typography className={classes.font_normal}>
                        <b>ติดตามข่าวสารอื่นๆ ได้ที่</b>
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>website :</b> {Rows.gmm_partner_website !== '' ? <a href={Rows.gmm_partner_website} target="_blank">{Rows.gmm_partner_website}</a> : '-'}
                    </Typography>
                    <Typography className={classes.font_normal}>
                        <b>facebook :</b> {Rows.gmm_partner_facebook !== '' ? <a href={Rows.gmm_partner_facebook} target="_blank">{Rows.gmm_partner_facebook}</a> : '-'}
                    </Typography>
                </MuiDialogContent>
            </Dialog>
        </>
    )
}




const result = [{ id: 1, desc: 'ผ่าน' }, { id: 2, desc: 'ไม่ผ่าน' }]