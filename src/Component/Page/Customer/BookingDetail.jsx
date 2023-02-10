/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Avatar, Chip, Dialog, Backdrop, Button, Box, Collapse, Card, CardContent, Divider, DialogTitle, DialogContent,
    DialogActions, Hidden, FormControl, FormLabel, TextField, IconButton, Typography, Grid, FormHelperText,
    InputAdornment, StepConnector, StepLabel, Stepper, Step, List, ListItem, ListItemIcon, ListItemSecondaryAction,
    ListItemAvatar, ListItemText,
} from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Add, AccountBalanceWallet, Close, Description, ExpandMore, ExpandLess, AttachFile,
    Book, LocationOn, Check, Info, Edit, FormatListNumbered,
    MonetizationOnOutlined, Star, Favorite, FavoriteBorderOutlined, SwapHoriz, Remove, ImageSearch, MobileFriendly
} from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import moment from 'moment';
import Canvas_qrcode from "./Canvas_dialog_qrcode";
import Lottie from 'react-lottie';
import lottie_notfound from './notfound';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import config from '../../config';

const custom_overlay = {
    overlay: {
        zIndex: 9999,
    },
}

const lottie_notfoundOptions = {
    loop: true,
    autoplay: true,
    animationData: lottie_notfound,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const ColorRouteConnector = withStyles({
    line: {
        marginTop: 6,
        marginLeft: '-2px',
        borderLeftStyle: 'dotted',
        borderLeftWidth: '4px'
    },
    vertical: {
        padding: '0 0 0 8'
    }
})(StepConnector);

function RouteIcon(props) {
    const icons = {
        1: <LocationOn style={{ color: '#FE7569' }} />,
        2: <LocationOn style={{ color: '#FE7569' }} />,
        3: <LocationOn style={{ color: '#FE7569' }} />,
        4: <LocationOn style={{ color: '#FE7569' }} />,
        5: <LocationOn style={{ color: '#FE7569' }} />,
        6: <LocationOn style={{ color: '#FE7569' }} />,
        7: <LocationOn style={{ color: '#FE7569' }} />,
        8: <LocationOn style={{ color: '#FE7569' }} />,
        9: <LocationOn style={{ color: '#FE7569' }} />,
        10: <LocationOn style={{ color: '#FE7569' }} />,
    }
    return (
        <>
            {icons[String(props.icon)]}
        </>
    );
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

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    borderCard: {
        borderTopLeftRadius: 'unset',
        borderTopRightRadius: 'unset'
    },
    displayflexHead: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    displayflexTitle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
    Contentpdx16: {
        paddingBottom: '16px'
    },
    Contentpdx8: {
        paddingBottom: '8px'
    },
    displayflex: {
        display: "flex",
        alignItems: "normal",
    },

    displayflexCenter: {
        display: "flex",
        alignItems: "center",
    },
    displayflexCenterCSS: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: 'pointer',
        background: '#f8f8f8',
        padding: '8px',
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.06)',

        },
    },
    displayflexToal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: '8px 0 8px 0',
        background: '#edf7ed',
        borderRadius: '10px'
    },
    displayList: {
        display: "flex",
        justifyContent: "flex-end",
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    padding_table: {
        padding: theme.spacing(1)
    },
    paymentBtn: {
        fontFamily: 'Regular',
        fontSize: '16px'
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
    StyleDetail: {
        borderLeft: '6px solid rgb(0, 120, 214)',
        backgroundColor: 'rgba(0, 120, 214, 0.1)',
        padding: '12px',
        fontFamily: 'Regular',
        fontSize: '20px',
        fontWeight: 500,
        margin: '0px'
    },
    ListHeader: {
        paddingTop: '0px',
        paddingBottom: '0px',
        background: '#ffffff',
        borderLeft: 'solid #2ba8c4',
        '&:hover': {
            background: '#ffffff',

        },
    },
    font_net: {
        fontFamily: 'SemiBold',
        fontSize: '18px'
    },
    font_header: {
        fontFamily: 'SemiBold',
        margin: '10px',
        fontSize: '18px'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textTransform: 'none',
    },
    font_chip: {
        fontFamily: 'Regular',
        fontSize: '12px'
    },
    font_small: {
        color: 'gray',
        fontFamily: 'Regular',
        fontSize: '12px'
    },

    font_smallRight: {
        color: 'gray',
        fontFamily: 'Regular',
        fontSize: '12px',
        textAlign: 'end'
    },

    font_smallR: {
        color: 'gray',
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: 'start'
    },
    font_small_btn: {
        fontFamily: 'Regular',
        fontSize: '10px',
    },
    font_local_header: {
        fontFamily: 'SemiBold',
        // margin: '10px',
        fontSize: '16px'
    },
    font_subheader: {
        fontFamily: 'Regular',
        margin: '4px',
        fontSize: '14px'
    },
    font_cardHeader: {
        fontFamily: 'SemiBold',
        margin: '4px',
        fontSize: '16px'
    },
    font_title: {
        fontFamily: 'SemiBold',
        fontSize: '20px'
    },
    font_end: {
        textAlign: 'end'
    },
    font_normalXpd: {
        fontFamily: 'Regular',
        fontSize: '12px',
        paddingTop: '4px',
        color: 'gray',
    },
    font_normalXflex: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textTransform: 'none',
    },
    font_endXList: {
        textAlign: 'end',
        fontFamily: 'Regular',
        fontSize: '14px',
        paddingTop: '4px',
        color: '#666666',
    },
    font_success: {
        fontFamily: 'SemiBold',
        textAlign: 'center',
        fontSize: '24px'
    },
    font_desc: {
        fontFamily: 'Regular',
        fontSize: '12px',
        wordBreak: 'break-all',
        color: 'gray'
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

function PaymentTitle({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexCenter}>
                    <MonetizationOnOutlined />
                    <Typography className={classes.font_header}>วิธีการชำระเงิน</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function DetailTrip({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexCenter}>
                    <FormatListNumbered />
                    <Typography className={classes.font_header}>รายการ</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function DetailTripHour({ classes, status, ele, func }) {
    return (
        <>
            <Box pt={0} pb={0} className={classes.displayflexTitle}>
                <Box className={classes.displayflexCenter}>
                    <FormatListNumbered />
                    <Typography className={classes.font_header}>รายการ</Typography>
                </Box>
                {(ele.gmm_inv_status !== 'CANCEL' && ele.gmm_inv_status !== 'COMPLETE') && <>
                    <Box>
                        <Button variant="outlined" color="secondary"
                            onClick={() => { func(ele) }}
                            disabled={
                                (status) ? true :
                                    (moment(new Date()).format('YYYY-MM-DD HH:mm') >= ele.gmm_inv_exp_date) ? true :
                                        (ele.gmm_inv_status === 'PENDING') ? false : true
                            }
                            className={classes.font_normal}>
                            <Close fontSize="small" />
                            <Hidden xsDown>
                                &nbsp;ยกเลิก
                            </Hidden>
                        </Button>
                    </Box>
                </>
                }
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function SectionLineI({ classes, status, fav_status, func, trips, cancel, index, nbr, rawData, inv_exp, endtripMobile }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexTitle}>

                    <Box className={classes.displayflexCenter} style={{ color: 'gray' }}>
                        <Book fontSize="small" />
                        <Typography className={classes.font_subheader}>&nbsp;รายละเอียดการเดินทาง</Typography>
                    </Box>

                    <Box style={{
                        display: 'flex',
                        whiteSpace: 'pre'
                    }}>
                        <Button variant="outlined" color="primary"
                            onClick={() => { endtripMobile(rawData) }}
                            disabled={rawData.booking_status !== 'SUCCESS'}
                            className={classes.font_normal}
                        >
                            <MobileFriendly fontSize="small" />
                        </Button>
                        &nbsp;&nbsp;
                        <Button variant={(fav_status) ? "contained" : "outlined"} color="primary"

                            disabled={status}
                            className={classes.font_normal}
                        >
                            <Star onClick={() => { trips(index, nbr, fav_status) }} />
                            <Hidden xsDown>
                                <span onClick={() => { trips(index, nbr, fav_status) }} > Favourite Trip</span>
                            </Hidden>

                        </Button>
                        &nbsp;&nbsp;
                        <Button variant="outlined" color="primary"
                            onClick={() => { func(index, nbr) }}
                            disabled={status}
                            className={classes.font_normal}
                        >
                            <Edit fontSize="small" />
                            <Hidden xsDown>
                                &nbsp;จดบันทึก
                            </Hidden>

                        </Button>
                        &nbsp;&nbsp;
                        {(rawData['booking_status'] !== 'CANCEL' && rawData['booking_status'] !== 'COMPLETE') && <>
                            <Button variant="outlined" color="secondary"
                                onClick={() => { cancel(index, nbr) }}
                                disabled={
                                    (status) ? true :
                                        (moment(new Date()).format('YYYY-MM-DD HH:mm') >= inv_exp) ?
                                            rawData['booking_status'] === 'SUCCESS' ?
                                                (moment(new Date()).format('YYYY-MM-DD HH:mm') >= rawData['booking_start']) ? true : false : true
                                            : false
                                }
                                className={classes.font_normal}>
                                <Close fontSize="small" />
                                <Hidden xsDown>
                                    &nbsp;ยกเลิก
                                </Hidden>

                            </Button>
                        </>}
                    </Box>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function SectionLineV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexCenter}>
                    <LocationOn fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ลำดับการเดินทาง</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function SectionLineVII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexCenter}>
                    <FormatListNumbered fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;รายละเอียดเพิ่มเติม</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function SectionLineEX({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexCenter}>
                    <AccountBalanceWallet fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;รายละเอียดการบริการ</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

export default function BookingDetail() {
    const api_url = config.PATH_URL
    const url = config.API_URL + "models/Customer/Customer_history.php";
    // const url = 'https://backoffice.go-mamma.com/php/models/Customer/Customer_history.php'
    const classes = useStyles();
    const { vision, inv } = useParams();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [Preview, setPreview] = useState(false);
    const [PreviewInvd, setPreviewInvd] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [msgCount, setMsgCount] = useState(0);
    const [expanded, setExpanded] = useState([]);
    const [expandedInvd, setExpandedInvd] = useState([]);
    const [showInfo, setShow] = useState([]);
    const [invRef, setInvref] = useState([]);
    const [listemp_empty, setEmp_empty] = useState([]);
    const [wordDialog, setWord] = useState('');
    const [Totalprice, setPrice] = useState({ net: null, calc: null });
    const [invStatus, setStatus] = useState({
        gmm_inv_user_id: null,
        gmm_inv_status: null,
        gmm_inv_payment_id: '',
        gmm_inv_create_date: null,
        gmm_inv_exp_date: null,
        payment_long_name: null,
        payment_short_name: null,
        payment_type: null,
    });
    const [openListemp, setListemp] = useState(false);
    const [openNote, setOpenNote] = useState(false);
    const [openFavouriteTrip, setOpenFavouriteTrip] = useState(false);
    const [message, setMessage] = useState('');
    const [Tripname, setTripname] = useState({ name: '' });
    const [arrayRecord, setArray] = useState({ index: 0, nbr: '' });
    const [myCredit, setWallet] = useState(0);
    const [bagWallet, setBag] = useState(0);
    const [baln, setBaln] = useState(0);
    const [attachfile, setAttachfile] = useState({ name: '', base64: '', preview: '' });
    const [CountBooking, setCountBooking] = useState(0);
    const [maxTx, setMaxhourTx] = useState(0);
    const [maxCg, setMaxhourCg] = useState(0);

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, []);

    async function FirstLoad(status = null) {
        setBoolean(true);
        // --------------------------------
        const payload = JSON.stringify({
            key: "Payload_booking",
            id: inv
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            setMaxhourTx(res.maxTx)
            setMaxhourCg(res.maxCg)

            setAttachfile(res.img);
            setWallet(0)
            setBag(res.user_wallet.credit)
            setBaln(res.user_wallet.credit)
            setDataPayment(res.payment)
            setInvref(res.inv_ref)
            setStatus({
                ...invStatus,
                gmm_inv_user_id: res.inv_status['gmm_inv_user_id'],
                gmm_inv_status: res.inv_status['gmm_inv_status'],
                gmm_inv_payment_id: res.inv_status['gmm_inv_payment_id'],
                gmm_inv_create_date: res.inv_status['gmm_inv_create_date'],
                gmm_inv_exp_date: res.inv_status['gmm_inv_exp_date'],
                payment_long_name: res.inv_status['payment_long_name'],
                payment_short_name: res.inv_status['payment_short_name'],
                payment_type: res.inv_status['payment_type'],
            })

            if (status === null) { setExpanded(get_boolean(res.data)) }
            if (status === null) { setExpandedInvd(get_booleanInvd(res.inv_ref)) }
            setShow(get_resource(res.data));
            setCountBooking(get_count(res.data))

            if (res.inv_status['gmm_inv_status'] === 'PENDING') {
                setPrice({ ...Totalprice, net: get_netPrice(res.data), calc: get_netPrice(res.data) })
            } else {
                setPrice({ ...Totalprice, net: 0, calc: 0 })
            }

            setHour(false);
            setBoolean(false);
        }
    }

    async function confirm_payment_wallet(payment_type) {
        setBoolean(true);
        const payload = JSON.stringify({
            key: "confirm_payment_wallet",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            inv_id: inv,
            invStatus: invStatus,
            credit_point: myCredit,
            net: Totalprice,
            type: payment_type,
            item: showInfo,
            img: (Totalprice.net !== 0) ? attachfile : null
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "ยืนยัน",
                text: "ชำระค่าบริการสำเร็จ",
                icon: "success",
            }).then(() => {
                state.push('/Home/CustHistory/' + vision);
            })
        }
    }

    async function confirm_payment_walletInvd(payment_type, payment_id, ele) {
        setBoolean(true);
        const payload = JSON.stringify({
            key: "confirm_payment_walletInvd",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            inv_id: payment_id,
            credit_point: ele.myCredit,
            net: ele.net,
            type: payment_type,
            item: ele,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "ยืนยัน",
                text: "ชำระค่าบริการสำเร็จ",
                icon: "success",
            }).then(() => {
                FirstLoad('stay');
                setBoolean(false);
            })
        }
    }

    async function BookingCancel(inv, message) {
        setBoolean(true);
        // --------------------------------
        const payload = JSON.stringify({
            key: "BookingCancel",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            id: inv,
            invStatus: invStatus.gmm_inv_status,
            message: message
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: (res.token !== 0) ? "ได้รับเครดิตสะสม x " + res.token : 'ยกเลิกการจองสำเร็จ',
                icon: "success",
            }).then(() => {
                FirstLoad('stay');
            })
        }
    }

    async function ListCancel(index, nbr, invStatus, message) {
        setBoolean(true);
        const payload = JSON.stringify({
            key: "ListCancel",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            nbr: nbr,
            item: showInfo[index],
            inv: inv,
            count: Number(CountBooking),
            invStatus: invStatus,
            message: message
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);

            Swal.fire({
                title: "เรียบร้อย",
                text: (res.token !== 0) ? "ได้รับเครดิตสะสม x " + res.token : 'ยกเลิกการจองสำเร็จ',
                icon: "success",
            }).then(() => {
                FirstLoad('stay');
            })

        }
    }

    async function ChangePayment(inv, type) {
        setBoolean(true);
        // --------------------------------
        const payload = JSON.stringify({
            key: "ChangePayment",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            id: inv,
            type: type
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "เปลี่ยนประเภทการชำระสำเร็จ",
                icon: "success",
            }).then(() => {
                FirstLoad('stay');
                setBoolean(false);
            })
        }
    }

    async function SubmitNote() {
        const payload = JSON.stringify({
            key: "Changenote",
            id: arrayRecord,
            message: message
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            setOpenNote(false)
        }
    }

    async function SubmitFavouriteTrip(event) {
        event.preventDefault();
        const payload = JSON.stringify({
            key: "addFavoriteTrip",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            user: showInfo[arrayRecord.index].booking_user_id,
            trip: showInfo[arrayRecord.index],
            name: Tripname.name,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            FirstLoad('stay');
            setOpenFavouriteTrip(false);
        }
    }

    async function deletefavourite() {
        const payload = JSON.stringify({
            key: "deletefavourite",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            user: showInfo[arrayRecord.index].booking_user_id,
            favour_nbr: showInfo[arrayRecord.index].booking_favour_nbr,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            FirstLoad('stay');
        }
    }

    async function addFavouriteTaxi() {
        const payload = JSON.stringify({
            key: "addFavouriteTaxi",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            user: showInfo[arrayRecord.index].booking_user_id,
            tid: showInfo[arrayRecord.index].booking_taxi_id,
            tname: showInfo[arrayRecord.index].booking_t
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            FirstLoad('stay');
        }
    }

    async function addFavouriteCG() {
        const payload = JSON.stringify({
            key: "addFavouriteCG",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            user: showInfo[arrayRecord.index].booking_user_id,
            cid: showInfo[arrayRecord.index].booking_cg_id,
            cname: showInfo[arrayRecord.index].booking_c
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            FirstLoad('stay');
        }
    }

    async function deleteFavouriteTaxi() {
        const payload = JSON.stringify({
            key: "deleteFavouriteTaxi",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            user: showInfo[arrayRecord.index].booking_user_id,
            favour_nbr: showInfo[arrayRecord.index].booking_favour_tx_nbr,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            FirstLoad('stay');
        }
    }

    async function deleteFavouriteCG() {
        const payload = JSON.stringify({
            key: "deleteFavouriteCG",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            user: showInfo[arrayRecord.index].booking_user_id,
            favour_nbr: showInfo[arrayRecord.index].booking_favour_cg_nbr,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            FirstLoad('stay');
        }
    }

    async function find_emp(index, keyWord) {

        let route_item = [];
        let route_trip = showInfo[index].booking_point
        let latlng = {
            lat: route_trip[0].lat,
            lng: route_trip[0].lng
        }

        for (let i = 0; i < route_trip.length; i++) {
            let array = {
                lat: route_trip[i].lat,
                lng: route_trip[i].lng,
            }

            route_item.push(array);
        }

        const payload = JSON.stringify({
            key: "changeTaxiCg",
            position: {
                latlng: latlng,
                aumphur: route_trip[0].aumphur_desc,
                tumbol: route_trip[0].tumbol_desc,
                date: moment(showInfo[index].booking_start).format('YYYY-MM-DD'),
                time: moment(showInfo[index].booking_start).format('HH:mm'),
                cgtime: showInfo[index].booking_starttime
            },
            trip: {
                gmm_product_cg_radio: showInfo[index].booking_radio,
                taxiHr: showInfo[index].booking_tx_default_hour,
                cgHr: showInfo[index].booking_cg_default_hour,
                cgLocation: showInfo[index].booking_startpoint,
            },
            route: route_item
        });


        const response = await fetch(api_url, { method: "POST", body: payload });
        await sleep(100);
        const res = await response.json();
        if (res.status) {
            setEmp_empty((keyWord === 'Taxi') ? res.taxi : res.cg)
            setListemp(true);
            setWord(keyWord)
        } else {
            if (keyWord === 'Taxi') {
                (res.statusTaxi) && setEmp_empty(res.taxi);
            } else if (keyWord === 'Caregiver') {
                (res.statusCg) && setEmp_empty(res.cg);
            }

            setListemp(true);
            setWord(keyWord)
        }
    }

    async function ConfirmChangeEmp(emp_id, emp_fname, emp_lname, emp_license, emp_tel, emp_type, user_id) {
        const payload = JSON.stringify({
            key: "ConfirmChangeEmp",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            nbr: arrayRecord.nbr,
            emp_id: emp_id,
            user_id: user_id,
            keyword: wordDialog,
            taxi_name: emp_fname + ' ' + emp_lname
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            let newArr = [...showInfo];

            if (emp_type === 'Taxi') {
                newArr[arrayRecord.index].booking_taxi_id = emp_id;
                newArr[arrayRecord.index].booking_t_tel = conv_formatTel(emp_tel);
                newArr[arrayRecord.index].booking_t = emp_fname + ' ' + emp_lname;
                newArr[arrayRecord.index].booking_licenseplate = emp_license;
            } else {
                newArr[arrayRecord.index].booking_cg_id = emp_id;
                newArr[arrayRecord.index].booking_c_tel = conv_formatTel(emp_tel);
                newArr[arrayRecord.index].booking_c = emp_fname + ' ' + emp_lname;
            }

            setShow(newArr);
            setListemp(false);
        }
    }

    async function UpdatebookingWithqrcode() {
        const payload = JSON.stringify({
            key: "UpdatebookingWithqrcode",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            inv: inv,
            invStatus: invStatus,
            item: showInfo,
            total: Totalprice.net,
            // addhr_tx: countHourTX,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            setDataPayment(res.payment);
            setOpenQRCode(true);
        }
    }

    async function generate_qrcode() {
        const payload = JSON.stringify({
            key: "generate_qrcode",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            inv: inv,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            setDataPayment(res.payment);
            setOpenQRCode(true);
        }
    }



    async function Confirmtrip(item, message) {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Confirmtrip",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: item,
            message: message
        });


        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: "จบงานสำเร็จ",
                icon: "success",
            }).then(() => {
                FirstLoad('stay');
            })

        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const get_boolean = (obj) => {
        let get_boolean = []
        for (let i = 0; i < obj.length; i++) {
            get_boolean.push(obj[i]['open']);
        }

        return get_boolean;
    }

    const get_booleanInvd = (obj) => {
        let get_boolean = []
        for (let i = 0; i < obj.length; i++) {
            get_boolean.push(obj[i]['collapMulti']);
        }

        return get_boolean;
    }

    const conv_formatTel = (value) => {
        if (value) {
            if (value.length === 10) {
                let newString = "";
                //----------------------------------------------
                newString += ' (';
                newString += value.substring(0, 3);
                newString += '-';
                newString += value.substring(3, 6);
                newString += '-';
                newString += value.substring(6);
                newString += ') ';
                return newString;
            } else {
                let newString = "";
                //----------------------------------------------
                newString += ' (';
                newString += value.substring(0, 2);
                newString += '-';
                newString += value.substring(2, 5);
                newString += '-';
                newString += value.substring(5);
                newString += ') ';
                return newString;
            }
        } else {
            return "";
        }
    }

    const get_resource = (trip) => {
        let item = [];

        for (let i = 0; i < trip.length; i++) {

            let substr = trip[i]['booking_nbr'].gmm_booking_travel_start.split(' ');
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let convert = new Date(trip[i]['booking_nbr'].gmm_booking_travel_start);
            let date_format = convert.toLocaleDateString("th", options);
            let extra_tx_hr = 0;
            let extra_cg_hr = 0;
            let summary_net_prc = 0;
            let summary_dis_prc = 0;
            let promotion_discount = 0;
            let member_discount = 0;
            let coupon_discount = 0;
            let package_discount = 0;

            // Math.round(x) //ใช้ปัดเศษไปหาจำนวนเต็มที่ใกล้ที่สุด
            // Math.round(x) //ใช้ปัดเศษทิ้ง (ปัดลง)
            // Math.ceil(x) //ปัดขึ้น


            if (trip[i]['booking_nbr'].gmm_booking_cg_radio !== 'OFF') {
                extra_tx_hr = ((trip[i]['booking_nbr'].gmm_booking_taxi_hradd === null) ? 0 : Number(trip[i]['booking_nbr'].gmm_booking_taxi_hradd));
                extra_cg_hr = ((trip[i]['booking_nbr'].gmm_booking_cg_hradd === null) ? 0 : Number(trip[i]['booking_nbr'].gmm_booking_cg_hradd));
            } else {
                extra_tx_hr = ((trip[i]['booking_nbr'].gmm_booking_taxi_hradd === null) ? 0 : Number(trip[i]['booking_nbr'].gmm_booking_taxi_hradd));
                extra_cg_hr = 0
            }


            if (trip[i]['gmm_booking_discount_type'] === 'PROMOTION') {
                if (trip[i]['gmm_discount_amt'] !== null) {
                    promotion_discount = trip[i]['gmm_discount_amt'];
                } else {
                    promotion_discount = (trip[i]['gmm_discount_pct'] * trip[i]['booking_nbr']['gmm_booking_product_price']) / 100
                }


                summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) - Math.round(promotion_discount)) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)


            } else if (trip[i]['gmm_booking_discount_type'] === 'MEMBER') {
                if (trip[i]['gmm_discount_amt'] !== null) {
                    member_discount = trip[i]['gmm_discount_amt'];
                } else {
                    member_discount = (trip[i]['gmm_discount_pct'] * trip[i]['booking_nbr']['gmm_booking_product_price']) / 100
                }




                summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) - Math.round(member_discount)) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)


            } else if (trip[i]['gmm_booking_discount_type'] === 'COUPON') {
                if (trip[i]['gmm_discount_amt'] !== null) {
                    coupon_discount = trip[i]['gmm_discount_amt'];
                } else {
                    coupon_discount = (trip[i]['gmm_discount_pct'] * trip[i]['booking_nbr']['gmm_booking_product_price']) / 100
                }

                summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) - Math.round(coupon_discount)) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)
            } else if (trip[i]['gmm_booking_discount_type'] === 'PACKAGE') {
                package_discount = trip[i]['gmm_discount_amt'];

                summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) - Math.round(package_discount)) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)
            } else {
                summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                    ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                    ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0))
            }




            let array = {
                booking_avg_max_tx: Number(trip[i]['booking_nbr']['avg'].txmax),
                booking_avg_max_cg: Number(trip[i]['booking_nbr']['avg'].cgmax),
                booking_check_extra_tx_hr: extra_tx_hr,
                booking_check_extra_cg_hr: extra_cg_hr,
                booking_click_hr_tx: 0,
                booking_click_hr_cg: 0,
                //-------------------------------------------------------------
                booking_nbr: trip[i]['booking_nbr'].gmm_booking_nbr,
                booking_user_id: trip[i].gmm_booking_user_id,
                booking_passenger_id: trip[i].gmm_booking_passenger_id,
                booking_product_id: trip[i].gmm_booking_product_id,
                booking_taxi_id: trip[i]['booking_nbr'].gmm_booking_taxi_id,
                booking_cg_id: trip[i]['booking_nbr'].gmm_booking_cg_id,
                booking_status: trip[i]['booking_nbr'].gmm_booking_status,
                booking_product_name: trip[i]['booking_nbr'].gmm_product_name,
                booking_product_desc: trip[i]['booking_nbr'].gmm_product_desc,
                booking_product_price: trip[i]['booking_nbr'].gmm_booking_product_price,
                booking_product_point: trip[i]['booking_nbr'].gmm_booking_product_point,
                booking_radio: trip[i]['booking_nbr'].gmm_booking_cg_radio,
                booking_product_drop: trip[i]['booking_nbr'].gmm_booking_product_drop,
                booking_create: trip[i]['booking_nbr'].gmm_booking_create_date,
                booking_exp: trip[i]['booking_nbr'].gmm_booking_exp_date,
                booking_start: trip[i]['booking_nbr'].gmm_booking_travel_start,
                booking_end: trip[i]['booking_nbr'].gmm_booking_travel_end,
                booking_next: trip[i]['booking_nbr'].gmm_booking_travel_next,
                booking_cg_end: trip[i]['booking_nbr'].gmm_booking_cg_end,
                booking_cg_next: trip[i]['booking_nbr'].gmm_booking_cg_next,
                booking_tx_addon_end: trip[i]['booking_nbr'].gmm_booking_tx_addon_end,
                booking_tx_addon_next: trip[i]['booking_nbr'].gmm_booking_tx_addon_next,
                booking_cg_addon_end: trip[i]['booking_nbr'].gmm_booking_cg_addon_end,
                booking_cg_addon_next: trip[i]['booking_nbr'].gmm_booking_cg_addon_next,
                booking_date: date_format,
                booking_time: substr[1],
                booking_startpoint: Number(trip[i]['booking_nbr'].gmm_booking_cg_startpoint) - 1,
                booking_starttime: trip[i]['booking_nbr'].gmm_booking_cg_starttime,
                booking_tx_default_hour: Number(trip[i]['booking_nbr'].gmm_product_tx_default_hour),
                booking_cg_default_hour: (Number(trip[i]['booking_nbr'].gmm_product_cg_default_hour) ? Number(trip[i]['booking_nbr'].gmm_product_cg_default_hour) : 5),
                booking_tx_price_hour: Number(trip[i]['booking_nbr'].gmm_booking_taxi_hrprice),
                booking_cg_price_hour: Number(trip[i]['booking_nbr'].gmm_booking_cg_hrprice),
                booking_extra_tx_hr: extra_tx_hr,
                booking_extra_cg_hr: extra_cg_hr,
                booking_taxi_hrprice: trip[i]['booking_nbr'].gmm_booking_taxi_hrprice,
                booking_cg_hrprice: trip[i]['booking_nbr'].gmm_booking_cg_hrprice,
                //---------------------
                booking_u_tel: conv_formatTel(trip[i]['booking_nbr'].gmm_user_tel),
                booking_p_tel: conv_formatTel(trip[i]['booking_nbr'].gmm_passenger_tel),
                booking_t_tel: conv_formatTel(trip[i]['booking_nbr'].gmm_tx_tel),
                booking_c_tel: (trip[i]['booking_nbr'].gmm_booking_cg_radio === 'ON') ? conv_formatTel(trip[i]['booking_nbr'].gmm_cg_tel) : null,
                booking_licenseplate: trip[i]['booking_nbr'].gmm_emp_licenseplate,
                //---------------------
                booking_u: trip[i]['booking_nbr'].gmm_user_fullname,
                booking_p: trip[i]['booking_nbr'].gmm_passenger_fullname,
                booking_t: trip[i]['booking_nbr'].gmm_tx_fullname,
                booking_c: (trip[i]['booking_nbr'].gmm_booking_cg_radio === 'ON') ? trip[i]['booking_nbr'].gmm_cg_fullname : null,
                //---------------------
                booking_hrtx: (trip[i]['booking_nbr'].gmm_booking_taxi_hradd === null) ? 0 : Number(trip[i]['booking_nbr'].gmm_booking_taxi_hradd),
                booking_hrcg: (trip[i]['booking_nbr'].gmm_booking_cg_radio === 'ON') ? Number(trip[i]['booking_nbr'].gmm_booking_cg_hradd) : 0,
                //---------------------
                booking_follower: (trip[i]['booking_nbr'].gmm_booking_rmks_follower) ? trip[i]['booking_nbr'].gmm_booking_rmks_follower : 0,
                booking_desc: (trip[i]['booking_nbr'].gmm_booking_rmks_desc) ? trip[i]['booking_nbr'].gmm_booking_rmks_desc : '-',
                booking_equipment: trip[i]['booking_nbr'].gmm_booking_rmks_equipment,
                booking_point: trip[i]['booking_nbr'].point,
                //---------------------
                booking_payment_type: trip[i]['booking_nbr'].payment_type,
                booking_payment_short_name: trip[i]['booking_nbr'].payment_short_name,
                booking_payment_long_name: trip[i]['booking_nbr'].payment_long_name,
                //---------------------
                booking_discount_type: trip[i]['gmm_booking_discount_type'],
                booking_discount_amt: trip[i]['gmm_discount_amt'],
                booking_discount_pct: trip[i]['gmm_discount_pct'],
                //---------------------
                booking_note: trip[i]['note'],
                //---------------------
                booking_favour_status: trip[i]['booking_nbr'].favour_status,
                booking_favour_nbr: trip[i]['booking_nbr'].favour_nbr,
                //---------------------
                booking_favour_tx_status: trip[i]['booking_nbr'].favour_tx_status,
                booking_favour_tx_nbr: trip[i]['booking_nbr'].favour_tx_nbr,
                //---------------------
                booking_favour_cg_status: trip[i]['booking_nbr'].favour_cg_status,
                booking_favour_cg_nbr: trip[i]['booking_nbr'].favour_cg_nbr,
                booking_addOn_hour_tx: Number(extra_tx_hr),
                booking_addOn_hour_cg: Number(extra_cg_hr),
                //---------------------
                summary: summary_net_prc,
                dis_couponcode: Math.round(coupon_discount),
                dis_promotion: Math.round(promotion_discount),
                dis_member: Math.round(member_discount),
                dis_package: Math.round(package_discount),
                net: summary_dis_prc
            }


            item.push(array);
        }

        return item;
    }

    const get_netPrice = (trip) => {
        let total_prc = 0;
        let extra_tx_hr = 0;
        let extra_cg_hr = 0;
        let summary_net_prc = 0;
        let summary_dis_prc = 0;
        let promotion_discount = 0;
        let member_discount = 0;
        let coupon_discount = 0;
        let package_discount = 0;


        for (let i = 0; i < trip.length; i++) {
            if (trip[i]['booking_nbr']['gmm_booking_status'] !== 'CANCEL') {

                if (trip[i]['booking_nbr'].gmm_booking_cg_radio !== 'OFF') {
                    extra_tx_hr = ((trip[i]['booking_nbr'].gmm_booking_taxi_hradd === null) ? 0 : Number(trip[i]['booking_nbr'].gmm_booking_taxi_hradd));
                    extra_cg_hr = ((trip[i]['booking_nbr'].gmm_booking_cg_hradd === null) ? 0 : Number(trip[i]['booking_nbr'].gmm_booking_cg_hradd));
                } else {
                    extra_tx_hr = ((trip[i]['booking_nbr'].gmm_booking_taxi_hradd === null) ? 0 : Number(trip[i]['booking_nbr'].gmm_booking_taxi_hradd));
                    extra_cg_hr = 0
                }


                if (trip[i]['gmm_booking_discount_type'] === 'PROMOTION') {
                    if (trip[i]['gmm_discount_amt'] !== null) {
                        promotion_discount = trip[i]['gmm_discount_amt'];
                    } else {
                        promotion_discount = (trip[i]['gmm_discount_pct'] * trip[i]['booking_nbr']['gmm_booking_product_price']) / 100
                    }

                    summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                    summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) - Math.round(promotion_discount)) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)


                } else if (trip[i]['gmm_booking_discount_type'] === 'MEMBER') {
                    if (trip[i]['gmm_discount_amt'] !== null) {
                        member_discount = trip[i]['gmm_discount_amt'];
                    } else {
                        member_discount = (trip[i]['gmm_discount_pct'] * trip[i]['booking_nbr']['gmm_booking_product_price']) / 100
                    }

                    summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                    summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) - Math.round(member_discount)) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)


                } else if (trip[i]['gmm_booking_discount_type'] === 'COUPON') {
                    if (trip[i]['gmm_discount_amt'] !== null) {
                        coupon_discount = trip[i]['gmm_discount_amt'];
                    } else {
                        coupon_discount = (trip[i]['gmm_discount_pct'] * trip[i]['booking_nbr']['gmm_booking_product_price']) / 100
                    }

                    summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                    summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) - Math.round(coupon_discount)) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                } else if (trip[i]['gmm_booking_discount_type'] === 'PACKAGE') {
                    package_discount = trip[i]['gmm_discount_amt'];

                    summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                    summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) - Math.round(package_discount)) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                } else {
                    summary_net_prc = Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0)

                    summary_dis_prc = (Number(trip[i]['booking_nbr']['gmm_booking_product_price']) +
                        ((Number(extra_tx_hr) > 0) ? Number(extra_tx_hr) * Number(trip[i]['booking_nbr']['gmm_booking_taxi_hrprice']) : 0) +
                        ((Number(extra_cg_hr) > 0) ? Number(extra_cg_hr) * Number(trip[i]['booking_nbr']['gmm_booking_cg_hrprice']) : 0))
                }

                total_prc += summary_dis_prc
            }
        }

        return total_prc;
    }

    const get_count = (trip) => {
        let count = 0
        for (let i = 0; i < trip.length; i++) {
            if (trip[i]['booking_nbr']['gmm_booking_status'] !== 'CANCEL') {
                count++;
            }
        }

        return count;
    }

    const handleExpandClick = (index) => {

        let newArr = [...expanded]

        newArr[index] = !expanded[index]

        setExpanded(newArr);

    }

    const handleBookingCancel = () => {
        if (showInfo[0]['booking_status'] === 'SUCCESS') {
            if (moment(new Date()).format('YYYY-MM-DD HH:mm') <= showInfo[0]['booking_start']) {

                Swal.fire({
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off',
                        maxlength: 256,
                    },
                    title: 'ยืนยัน',
                    text: 'กรุณาระบุรายละเอียดสำหรับการยกเลิกการจอง',
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
                        BookingCancel(inv, output.value)
                    }
                });

            } else {
                alert_message('เอกสารหมดอายุการใช้งาน')
            }
        } else {
            if (moment(new Date()).format('YYYY-MM-DD HH:mm') <= showInfo[0]['booking_exp']) {

                Swal.fire({
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off',
                        maxlength: 256,
                    },
                    title: 'ยืนยัน',
                    text: 'กรุณาระบุรายละเอียดสำหรับการยกเลิกการจอง',
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
                        BookingCancel(inv, output.value)
                    }
                });

            } else {
                alert_message('เอกสารหมดอายุการใช้งาน')
            }
        }
    }

    const handleListCancel = (index, nbr) => {
        setArray({ ...arrayRecord, index: index, nbr: nbr });

        Swal.fire({
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
                maxlength: 256,
            },
            title: 'ยืนยัน',
            text: 'กรุณาระบุรายละเอียดสำหรับการยกเลิกการจอง',
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
                ListCancel(index, nbr, invStatus.gmm_inv_status, output.value)
            }
        });
    }

    const handleOpenBookingNote = (index, nbr) => {
        let newArr = [...showInfo];
        setArray({ ...arrayRecord, index: index, nbr: nbr });
        setMessage(newArr[index]['booking_note']);
        setMsgCount(newArr[index]['booking_note'].length)
        setOpenNote(true)
    }

    const handleCloseDialognote = () => {
        setOpenNote(false)
    }

    const handleCloseListemp = () => {

        setListemp(false)

        setTimeout(() => {
            setWord('')
            setEmp_empty([])
        }, 150)
    }

    const handleOpenFavourteTrip = (index, nbr, status) => {
        if (!status) {
            setArray({ ...arrayRecord, index: index, nbr: nbr });
            setOpenFavouriteTrip(true)
        } else {
            setArray({ ...arrayRecord, index: index, nbr: nbr });
            deletefavourite();
        }
    }

    const handleCloseDialogFavouriteTrip = () => {
        setTripname({ ...Tripname, name: '' })
        setOpenFavouriteTrip(false)
    }

    const handleChangeTextnoteInput = (event) => {
        let newArr = [...showInfo];
        newArr[arrayRecord.index]['booking_note'] = event.target.value;
        setShow(newArr);
        setMessage(event.target.value);
        setMsgCount(event.target.value.length);
    }

    const handleChangePayment = (type) => {
        if (moment(new Date()).format('YYYY-MM-DD HH:mm') <= invStatus.gmm_inv_exp_date) {
            Swal.fire({
                title: "ยืนยัน",
                text: "ท่านต้องการเปลี่ยนประเภทการชำระ หรือไม่?",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                //reverseButtons: true,
            }).then((output) => {
                if (output.isConfirmed) {
                    ChangePayment(inv, type)
                }
            })
        } else {
            alert_message('เอกสารหมดอายุการใช้งาน')
        }
    }

    const handleChangePaymentInvd = (inv, type, exp) => {
        if (moment(new Date()).format('YYYY-MM-DD HH:mm') <= exp) {
            Swal.fire({
                title: "ยืนยัน",
                text: "ท่านต้องการเปลี่ยนประเภทการชำระ หรือไม่?",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                //reverseButtons: true,
            }).then((output) => {
                if (output.isConfirmed) {
                    ChangePayment(inv, type)
                }
            })

        } else {
            alert_message('เอกสารหมดอายุการใช้งาน')
        }

    }

    const handleUsecredit = (event) => {
        const { target } = event;
        const { name } = target;
        if (name === "credit") {
            if (target.value.match("^[0-9]*$")) {
                if (keyValue(target.value)) {
                    if (Number(target.value) >= Number(bagWallet)) {
                        if (Number(Totalprice.calc) >= Number(bagWallet)) {
                            let sum = Number(Totalprice.calc) - Number(bagWallet)
                            setPrice({ ...Totalprice, net: sum });
                            setWallet(bagWallet);
                            setBaln(0);
                        } else {
                            setPrice({ ...Totalprice, net: 0 });
                            setWallet(Totalprice.calc);
                            setBaln(Number(bagWallet) - Number(Totalprice.calc))
                        }
                    } else {
                        if (Number(target.value) >= Number(Totalprice.calc)) {
                            setPrice({ ...Totalprice, net: 0 });
                            setWallet(Totalprice.calc);
                            setBaln(Number(bagWallet) - Number(Totalprice.calc))
                        } else {
                            let sum = Number(Totalprice.calc) - Number(target.value);
                            setPrice({ ...Totalprice, net: sum });
                            setWallet(target.value);
                            setBaln(Number(bagWallet) - Number(target.value))
                        }
                    }

                    if (target.value === '') {
                        setWallet(target.value);
                    }
                }
            }
        }
    }

    const handleUsecreditInvd = (event, ele, index) => {
        let newArr = [...invRef];
        const { target } = event;
        const { name } = target;
        if (name === "credit_invd") {
            if (target.value.match("^[0-9]*$")) {
                if (keyValue(target.value)) {
                    if (Number(target.value) >= Number(ele.bagWallet)) {
                        if (Number(ele.calc) >= Number(ele.bagWallet)) {
                            let sum = Number(ele.calc) - Number(ele.bagWallet)
                            newArr[index].net = sum
                            newArr[index].myCredit = newArr[index].bagWallet;
                            newArr[index].baln = newArr[index].bagWallet - newArr[index].myCredit;

                        } else {
                            newArr[index].net = 0
                            newArr[index].myCredit = ele.calc
                            newArr[index].baln = newArr[index].bagWallet - Number(ele.calc);

                        }
                    } else {

                        if (Number(target.value) >= Number(ele.calc)) {
                            newArr[index].net = 0
                            newArr[index].myCredit = ele.calc
                            newArr[index].baln = newArr[index].bagWallet - Number(ele.calc);

                        } else {
                            let sum = Number(ele.calc) - Number(target.value);
                            newArr[index].net = sum
                            newArr[index].myCredit = Number(target.value)
                            newArr[index].baln = newArr[index].bagWallet - Number(target.value);
                        }
                    }

                    if (target.value === '') {
                        newArr[index].myCredit = '';
                        setInvref(newArr)
                    } else {
                        setInvref(newArr)
                    }

                }
            }
        }
    }

    const handlePushValue = (event) => {
        if (Number(Totalprice.net) !== 0 && baln !== 0) {
            if (Number(Totalprice.calc) >= Number(bagWallet)) {
                let sum = Number(Totalprice.calc) - Number(bagWallet)
                setPrice({ ...Totalprice, net: sum });
                setWallet(Number(bagWallet));
                setBaln(0);
                setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })

            } else {
                setPrice({ ...Totalprice, net: 0 });
                setWallet(Number(Totalprice.calc))
                setBaln(Number(bagWallet) - Number(Totalprice.calc))
                setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })
            }
        }
    }

    const handlePushValueInvd = (ele, index) => {
        let newArr = [...invRef];
        if (newArr[index].net !== 0 && newArr[index].baln !== 0) {
            if (Number(ele.calc) >= Number(ele.bagWallet)) {
                let sum = Number(ele.calc) - Number(ele.bagWallet);
                newArr[index].net = sum
                newArr[index].myCredit = newArr[index].bagWallet
                newArr[index].baln = newArr[index].bagWallet - newArr[index].myCredit
            } else {
                newArr[index].net = 0
                newArr[index].myCredit = ele.calc
                newArr[index].baln = newArr[index].bagWallet - Number(ele.calc)
            }
        }


        setInvref(newArr)

    }

    const keyValue = (value) => {
        if (value !== '00' && value !== '01' && value !== '02' && value !== '03' && value !== '04' && value !== '05' &&
            value !== '06' && value !== '07' && value !== '08' && value !== '09') {
            return true
        } else {
            return false
        }
    }

    const alert_message = (txt) => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: txt,
            icon: "warning",
        })
    }

    //-------------------------------------------------

    const [openQRCode, setOpenQRCode] = useState(false);
    const [openQRCodeInvd, setOpenQRCodeInvd] = useState(false);
    const [dataPayment, setDataPayment] = useState([]);
    const [dataPaymentInvd, setDataPaymentInvd] = useState([]);

    const handlePayment = () => {
        if (moment(new Date()).format('YYYY-MM-DD HH:mm') <= invStatus.gmm_inv_exp_date) {
            if (invStatus.gmm_inv_payment_id === '2001') {
                var buy_hour = false;
                for (let i = 0; i < showInfo.length; i++) {
                    if (showInfo[i].booking_click_hr_tx !== 0 || showInfo[i].booking_click_hr_cg !== 0) {
                        buy_hour = true;
                    }
                }

                if (buy_hour) {
                    Swal.fire({
                        title: "ชำระ",
                        text: "ท่านต้องการชำระค่าบริการ หรือไม่?",
                        icon: "info",
                        showCancelButton: true,
                        confirmButtonText: "ตกลง",
                        cancelButtonText: "ยกเลิก",
                        //reverseButtons: true,
                    }).then((output) => {
                        if (output.isConfirmed) {
                            UpdatebookingWithqrcode()
                        }
                    })

                } else {
                    if (dataPayment.qrRawData === null) {

                        generate_qrcode();
                    } else {
                        setOpenQRCode(true);
                    }
                }
            }

            if (invStatus.gmm_inv_payment_id === '4001') {
                Swal.fire({
                    title: "ชำระ",
                    text: "ท่านต้องการชำระค่าบริการ หรือไม่?",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonText: "ตกลง",
                    cancelButtonText: "ยกเลิก",
                    //reverseButtons: true,
                }).then((output) => {
                    if (output.isConfirmed) {
                        confirm_payment_wallet(invStatus.gmm_inv_payment_id)
                    }
                })
            }
        } else {
            alert_message('เอกสารหมดอายุการใช้งาน')
        }
    }

    const handlePaymentInvd = (payment_id, rawData, ele) => {
        if (moment(new Date()).format('YYYY-MM-DD HH:mm') <= ele.gmm_inv_exp_date) {
            if (payment_id === '2001') {
                setDataPaymentInvd(rawData)
                setOpenQRCodeInvd(true);
            }

            if (payment_id === '4001') {
                Swal.fire({
                    title: "ชำระ",
                    text: "ท่านต้องการชำระค่าบริการ หรือไม่?",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonText: "ตกลง",
                    cancelButtonText: "ยกเลิก",
                    //reverseButtons: true,
                }).then((output) => {
                    if (output.isConfirmed) {
                        confirm_payment_walletInvd(payment_id, rawData.invoice, ele)
                    }
                })
            }
        } else {
            alert_message('เอกสารหมดอายุการใช้งาน')
        }
    }

    const handleCloseQRCode = () => {
        setOpenQRCode(false);
    }

    const handleCloseQRCodeInvd = () => {
        setOpenQRCodeInvd(false);
    }

    const SaveImageQRCode = (inv) => {
        var canvas = document.getElementById("canvas");
        var url = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = inv;
        link.href = url;
        link.click();
    }

    //------------------------------------------------
    // add on functions

    const handleAddFavTaxi = (index, nbr, status) => {
        if (!status) {
            setArray({ ...arrayRecord, index: index, nbr: nbr });
            addFavouriteTaxi()
        } else {
            setArray({ ...arrayRecord, index: index, nbr: nbr });
            deleteFavouriteTaxi();
        }
    }

    const handleAddFavCG = (index, nbr, status) => {
        if (!status) {
            setArray({ ...arrayRecord, index: index, nbr: nbr });
            addFavouriteCG()
        } else {
            setArray({ ...arrayRecord, index: index, nbr: nbr });
            deleteFavouriteCG();
        }
    }

    const handleSwap_emp = (index, nbr, keyWord) => {
        setArray({ ...arrayRecord, index: index, nbr: nbr });
        find_emp(index, keyWord)
    }

    const handleChangeEmp = (emp_id, emp_fname, emp_lname, emp_license, emp_tel, emp_type, user_id) => {
        ConfirmChangeEmp(emp_id, emp_fname, emp_lname, emp_license, emp_tel, emp_type, user_id)
    }

    //---------------------------------------------------------
    const [countHour, setHour] = useState(false);
    const handleAddhrTaxi = (index, nbr, old_hr, type) => {
        setArray({ ...arrayRecord, index: index, nbr: nbr });
        if (type === 'increase') {
            let value = showInfo[index].booking_addOn_hour_tx + 1
            if (value <= showInfo[index].booking_avg_max_tx) {

                checkHourTX(value, nbr, type, index)
                setHour(true)
            }
        }

        if (type === 'decrease') {
            if (showInfo[index].booking_addOn_hour_tx !== showInfo[index].booking_check_extra_tx_hr) {
                let value = showInfo[index].booking_addOn_hour_tx - 1
                checkHourTX(value, nbr, type, index)
            }
        }
    }

    const handleAddhrCG = (index, nbr, old_hr, type) => {
        setArray({ ...arrayRecord, index: index, nbr: nbr });
        if (type === 'increase') {
            let value = showInfo[index].booking_addOn_hour_cg + 1
            if (value <= showInfo[index].booking_avg_max_cg) {
                checkHourCG(value, nbr, type, index)
                setHour(true)
            }
        }

        if (type === 'decrease') {
            if (showInfo[index].booking_addOn_hour_cg !== showInfo[index].booking_check_extra_cg_hr) {
                let value = showInfo[index].booking_addOn_hour_cg - 1
                checkHourCG(value, nbr, type, index)

            }
        }
    }

    const handleAddOrder = () => {
        Swal.fire({
            title: "ยืนยัน",
            text: "ท่านต้องการซื้อชั่วโมงเพิ่ม หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                AddOrder()
            }
        })
    }


    async function AddOrder() {
        const payload = JSON.stringify({
            key: "addOrder",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            inv_id: inv,
            invStatus: invStatus,
            item: showInfo,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "เพิ่มคำสั่งซื้อสำเร็จ",
                icon: "success",
            }).then(() => {
                FirstLoad('stay');
            })

        } else {
            alert_message('ไม่สามารถเพิ่มคำสั่งซื้อได้')
        }
    }

    async function checkHourTX(count, nbr, type, index) {
        const payload = JSON.stringify({
            key: "changeHoursTaxi",
            booking: nbr,
            hours: count - showInfo[index].booking_check_extra_tx_hr,
        });

        const response = await fetch(api_url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            if (type === 'increase') {
                let newArr = [...showInfo];
                let value = count
                let price_hr = (1 * Number(newArr[index].booking_tx_price_hour));

                if (invStatus.gmm_inv_status === 'PENDING') {
                    newArr[index].booking_hrtx = Number(newArr[index].booking_hrtx) + 1
                    newArr[index].booking_extra_tx_hr = Number(newArr[index].booking_extra_tx_hr) + 1
                    newArr[index].booking_addOn_hour_tx = value;
                    newArr[index].summary = Number(newArr[index].summary) + price_hr;
                    newArr[index].net = Number(newArr[index].net) + price_hr;
                    newArr[index].booking_click_hr_tx = Number(newArr[index].booking_click_hr_tx) + 1
                    setPrice({ ...Totalprice, net: Totalprice.net + price_hr, calc: Totalprice.calc + price_hr })
                } else {
                    newArr[index].booking_hrtx = Number(newArr[index].booking_hrtx) + 1
                    newArr[index].booking_click_hr_tx = Number(newArr[index].booking_click_hr_tx) + 1
                    newArr[index].booking_addOn_hour_tx = value;
                }


                setShow(newArr);
            }

            if (type === 'decrease') {
                let newArr = [...showInfo];
                let value = count
                let price_hr = (1 * Number(newArr[index].booking_tx_price_hour))

                if (invStatus.gmm_inv_status === 'PENDING') {
                    newArr[index].booking_hrtx = Number(newArr[index].booking_hrtx) - 1
                    newArr[index].booking_extra_tx_hr = Number(newArr[index].booking_extra_tx_hr) - 1
                    newArr[index].summary = Number(newArr[index].summary) - price_hr;
                    newArr[index].net = Number(newArr[index].net) - price_hr;
                    newArr[index].booking_addOn_hour_tx = value;
                    newArr[index].booking_click_hr_tx = Number(newArr[index].booking_click_hr_tx) - 1
                    setPrice({ ...Totalprice, net: Totalprice.net - price_hr, calc: Totalprice.calc - price_hr })
                } else {
                    newArr[index].booking_hrtx = Number(newArr[index].booking_hrtx) - 1
                    newArr[index].booking_click_hr_tx = Number(newArr[index].booking_click_hr_tx) - 1
                    newArr[index].booking_addOn_hour_tx = value;
                }

                let trap = 0;
                for (let i = 0; i < showInfo.length; i++) {
                    trap += showInfo[i]['booking_addOn_hour_tx'] + showInfo[i]['booking_addOn_hour_cg'];
                }

                (trap === (newArr[index].booking_check_extra_tx_hr + newArr[index].booking_check_extra_cg_hr)) && setHour(false);
                setShow(newArr);
            }
        } else {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "ตารางงานเต็มไม่สามารถเพิ่มชั่วโมงการรอ",
                icon: "warning",
            })
        }
    }

    async function checkHourCG(count, nbr, type, index) {
        const payload = JSON.stringify({
            key: "changeHoursCG",
            booking: nbr,
            hours: count - showInfo[index].booking_check_extra_cg_hr,
        });

        const response = await fetch(api_url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            if (type === 'increase') {
                let newArr = [...showInfo];
                let value = count
                let price_hr = (1 * Number(newArr[index].booking_cg_price_hour));

                if (invStatus.gmm_inv_status === 'PENDING') {
                    newArr[index].booking_hrcg = Number(newArr[index].booking_hrcg) + 1
                    newArr[index].booking_extra_cg_hr = Number(newArr[index].booking_extra_cg_hr) + 1
                    newArr[index].summary = Number(newArr[index].summary) + price_hr;
                    newArr[index].net = Number(newArr[index].net) + price_hr;
                    newArr[index].booking_addOn_hour_cg = value;
                    newArr[index].booking_click_hr_cg = Number(newArr[index].booking_click_hr_cg) + 1
                    setPrice({ ...Totalprice, net: Totalprice.net + price_hr, calc: Totalprice.calc + price_hr })
                } else {
                    newArr[index].booking_hrcg = Number(newArr[index].booking_hrcg) + 1
                    newArr[index].booking_click_hr_cg = Number(newArr[index].booking_click_hr_cg) + 1
                    newArr[index].booking_addOn_hour_cg = value;
                }

                setShow(newArr);
            }

            if (type === 'decrease') {
                let newArr = [...showInfo];
                let value = count
                let price_hr = (1 * Number(newArr[index].booking_cg_price_hour))

                if (invStatus.gmm_inv_status === 'PENDING') {
                    newArr[index].booking_hrcg = Number(newArr[index].booking_hrcg) - 1
                    newArr[index].booking_extra_cg_hr = Number(newArr[index].booking_extra_cg_hr) - 1
                    newArr[index].summary = Number(newArr[index].summary) - price_hr;
                    newArr[index].net = Number(newArr[index].net) - price_hr;
                    newArr[index].booking_addOn_hour_cg = value;
                    newArr[index].booking_click_hr_cg = Number(newArr[index].booking_click_hr_cg) - 1
                    setPrice({ ...Totalprice, net: Totalprice.net - price_hr, calc: Totalprice.calc - price_hr })
                } else {
                    newArr[index].booking_hrcg = Number(newArr[index].booking_hrcg) - 1
                    newArr[index].booking_click_hr_cg = Number(newArr[index].booking_click_hr_cg) - 1
                    newArr[index].booking_addOn_hour_cg = value;
                }

                let trap = 0;
                for (let i = 0; i < showInfo.length; i++) {
                    trap += showInfo[i]['booking_addOn_hour_tx'] + showInfo[i]['booking_addOn_hour_cg'];
                }

                (trap === (newArr[index].booking_check_extra_tx_hr + newArr[index].booking_check_extra_cg_hr)) && setHour(false);
                setShow(newArr);
            }
        } else {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "ตารางงานเต็มไม่สามารถเพิ่มชั่วโมงการรอ",
                icon: "warning",
            })
        }
    }

    async function cancelHour(inv) {
        const payload = JSON.stringify({
            key: "cancelHour",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            inv: inv,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "ยกเลิกรายการสำเร็จ",
                icon: "success",
            }).then(() => {
                FirstLoad('stay');
            })
        }
    }



    // Collap
    const [collapSingle, setClsinger] = useState(true);

    const handleClsinger = () => {
        setClsinger(!collapSingle)
    }

    const handleClmultiple = (index) => {
        let newArr = [...expandedInvd]

        newArr[index] = !expandedInvd[index]

        setExpandedInvd(newArr);
    }

    //---------------------- attachfile ----------------------
    const handleuploadFile = (event, index) => {
        let file = event.target.files[0];
        if (file) {
            let size = file.size / 1024
            if (size <= 1024) {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.readyState === 2) {
                            setAttachfile({ ...attachfile, name: file.name, base64: reader.result, preview: reader.result });
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                alert_message('ไม่สามารถอัพโหลด เนื่องจากขนาดรูปภาพเกิน 1 MB')
            }
        } else {
            document.getElementById("InputFile").value = "";
        }
    }

    const handleDeleteImage = () => {
        setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })
        document.getElementById("InputFile").value = "";
    }

    const handleuploadFileInvd = (event, inv, index) => {
        let file = event.target.files[0];
        if (file) {

            let size = file.size / 1024
            if (size <= 1024) {
                if (file) {
                    let newArr = [...invRef];
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.readyState === 2) {
                            newArr[index]['img']['name'] = file.name;
                            newArr[index]['img']['base64'] = reader.result;
                            newArr[index]['img']['preview'] = reader.result;
                            setInvref(newArr)
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                alert_message('ไม่สามารถอัพโหลด เนื่องจากขนาดรูปภาพเกิน 1 MB')
            }
        } else {
            document.getElementById(inv).value = "";
        }
    }

    const handleDeleteImageInvd = (event, inv, index) => {
        let newArr = [...invRef];
        newArr[index]['img']['name'] = "";
        newArr[index]['img']['base64'] = "";
        newArr[index]['img']['preview'] = "";
        setInvref(newArr)
        document.getElementById(inv).value = "";
    }

    const handlePreviewOpen = () => {
        setPreview(true);
    }

    const handlePreviewClose = () => {
        setPreview(false)
    }

    const handlePreviewOpenInvd = (index) => {
        setArray({ ...arrayRecord, index: index });
        setPreviewInvd(true);
    }

    const handlePreviewCloseInvd = () => {
        setPreviewInvd(false)
    }

    const handleCancelHour = (inv) => {
        Swal.fire({
            title: "ยกเลิก",
            text: "ท่านต้องการยกเลิกรายการ หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                cancelHour(inv.gmm_inv_nbr)
            }
        })
    }

    const handleConfirmtrip = (row) => {
        Swal.fire({
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
                maxlength: 256,
            },
            title: 'ยืนยัน',
            text: 'กรุณาระบุรายละเอียดสำหรับการจบงาน',
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
                Confirmtrip(row, output.value);
            }
        });
    }


    return (
        <>
            <Loading classes={classes} status={isLoading} />

            <Box mb={2} className={classes.displayflexCenterCSS} >
                <Box className={classes.displayflexCenter}>
                    <Description />
                    <Typography className={classes.font_header}>{inv}</Typography>
                </Box>
                <Box>
                    {collapSingle ? <IconButton onClick={handleClsinger}>
                        <ExpandMore />
                    </IconButton> : <IconButton onClick={handleClsinger}>
                        <ExpandLess />
                    </IconButton>}
                </Box>
            </Box>

            <Collapse in={collapSingle} timeout="auto" unmountOnExit>
                <Card variant="outlined">
                    <CardContent style={{ paddingBottom: '16px' }} >
                        <Box className={classes.displayflexTitle}>
                            <Box >
                                <Typography className={classes.font_subheader}>&nbsp;เลขที่ชำระเงิน</Typography>
                            </Box>
                            <Box >
                                <Typography className={classes.font_subheader}>&nbsp;{inv}</Typography>
                            </Box>
                        </Box>

                        <Box className={classes.displayflexTitle}>
                            <Box >
                                <Typography className={classes.font_subheader}>&nbsp;วันที่จอง</Typography>
                            </Box>
                            <Box >
                                <Typography className={classes.font_subheader}>&nbsp;{invStatus.gmm_inv_create_date}</Typography>
                            </Box>
                        </Box>

                        <Box className={classes.displayflexTitle}>
                            <Box >
                                <Typography className={classes.font_subheader}>&nbsp;ชำระก่อนวันที่</Typography>
                            </Box>
                            <Box >
                                <Typography className={classes.font_subheader}>&nbsp;{invStatus.gmm_inv_exp_date}</Typography>
                            </Box>
                        </Box>

                        <Box className={classes.displayflexTitle}>
                            <Box >
                                <Typography className={classes.font_subheader}>&nbsp;สถานะการชำระ</Typography>
                            </Box>
                            <Box >



                                {(invStatus.gmm_inv_status === 'PENDING' && (moment(new Date()).format('YYYY-MM-DD HH:mm') <= invStatus.gmm_inv_exp_date)) &&
                                    <Box style={{ color: 'rgb(63, 81, 181)', display: 'flex', justifyContent: 'center' }}>
                                        <Info fontSize="small" /> &nbsp;
                                        รอการชำระเงิน
                                    </Box>
                                }

                                {(invStatus.gmm_inv_status === 'PENDING' && (moment(new Date()).format('YYYY-MM-DD HH:mm') >= invStatus.gmm_inv_exp_date)) &&
                                    <Box style={{ color: 'rgb(247 7 37)', display: 'flex', justifyContent: 'center' }}>
                                        <Info fontSize="small" /> &nbsp;
                                        หมดอายุการชำระ
                                    </Box>
                                }


                                {(invStatus.gmm_inv_status === 'SUCCESS') &&
                                    <Box style={{ color: 'rgb(33, 124, 37)', display: 'flex', justifyContent: 'center' }}>
                                        <Check fontSize="small" /> &nbsp;
                                        ชำระเงินแล้ว
                                    </Box>}
                                {(invStatus.gmm_inv_status === 'CANCEL') &&
                                    <Box style={{ color: '#e91e63', display: 'flex', justifyContent: 'center' }}>
                                        <Close fontSize="small" /> &nbsp;
                                        ยกเลิกการจอง
                                    </Box>}
                            </Box>
                        </Box>


                    </CardContent>
                </Card>
                <Box mb={1} />
                <DetailTrip classes={classes} />
                {showInfo.map((ele, index) => (
                    <Box mb={2} key={ele.booking_nbr}>
                        <List component="nav" className={classes.ListHeader} onClick={() => { handleExpandClick(index) }}>
                            <ListItem button >
                                <Grid container spacing={0}>
                                    <Grid item xs={8}>
                                        <Typography className={classes.font_normalXflex}>เลขที่การเดินทาง : {ele.booking_nbr}
                                            {ele.booking_status === 'CANCEL' && <span style={{ color: 'red' }}> (ยกเลิกการจอง)</span>}
                                            {ele.booking_status === 'COMPLETE' && <span style={{ color: 'green' }}> (เดินทางแล้ว)</span>}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        {(ele.booking_status !== 'CANCEL' && ele.booking_status !== 'COMPLETE') && <Typography className={classes.font_endXList}> ค่าบริการ :  {Number(ele.net).toLocaleString("en-US")}</Typography>}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography className={classes.font_normalXpd}>{ele.booking_product_name} {ele.booking_product_desc}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <Divider />
                        </List>

                        <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
                            <Card variant="outlined" className={classes.borderCard}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Card variant="outlined" >
                                                <CardContent style={{ paddingBottom: '16px' }} >
                                                    <SectionLineI classes={classes}
                                                        status={promise}
                                                        fav_status={ele.booking_favour_status}
                                                        func={handleOpenBookingNote}
                                                        trips={handleOpenFavourteTrip}
                                                        cancel={(showInfo.length === 1) ? handleBookingCancel : handleListCancel}
                                                        index={index}
                                                        nbr={ele.booking_nbr}
                                                        rawData={ele}
                                                        inv_exp={invStatus.gmm_inv_exp_date}
                                                        endtripMobile={handleConfirmtrip} />
                                                    <FormControl component="fieldset">
                                                        <Alert severity="success" className={classes.font_normal}>
                                                            <AlertTitle className={classes.font_local_header}>{ele.booking_product_name}</AlertTitle>
                                                            {ele.booking_product_desc}
                                                        </Alert>
                                                        <Divider />

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Box mt={2} className={classes.font_small}>เดินทางวันที่</Box></Grid>
                                                            <Grid item xs={6}><Box mt={2} className={classes.font_small}>เวลา</Box></Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{ele.booking_date}</Box></Grid>
                                                            <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{ele.booking_time} น.</Box></Grid>
                                                        </Grid>
                                                        {ele.booking_c &&
                                                            <>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={6}><Box mt={1} className={classes.font_normal}>สถานที่นัดผู้ดูแล : {ele.booking_point[ele.booking_startpoint].name}</Box></Grid>
                                                                    <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{ele.booking_starttime} น.</Box></Grid>
                                                                </Grid>
                                                            </>
                                                        }

                                                        <Box mt={2} mb={2} >
                                                            <Divider />
                                                        </Box>
                                                        <Box mt={1} mb={1} >
                                                            <List dense={true} style={{ padding: 0 }}>
                                                                <ListItem style={{ paddingLeft: 0 }}>
                                                                    <ListItemAvatar>
                                                                        <Avatar src="/image/picon.png" style={{ background: '#FFCB08' }}>
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={ele.booking_u + ele.booking_u_tel}
                                                                        secondary="ผู้จอง"
                                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                                </ListItem>
                                                            </List>
                                                        </Box>
                                                        <Box mt={1} mb={1} >
                                                            <List dense={true} style={{ padding: 0 }}>
                                                                <ListItem style={{ paddingLeft: 0 }}>
                                                                    <ListItemAvatar>
                                                                        <Avatar src="/image/passengericon.png" style={{ background: '#FFCB08' }}>
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={ele.booking_p + ele.booking_p_tel}
                                                                        secondary="ผู้โดยสาร"
                                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />

                                                                </ListItem>
                                                            </List>
                                                        </Box>
                                                        <Box mt={1} mb={1} >
                                                            <List dense={true} style={{ padding: 0 }}>
                                                                <ListItem style={{ paddingLeft: 0 }}>
                                                                    <ListItemAvatar>
                                                                        <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={ele.booking_t + ele.booking_t_tel}
                                                                        secondary={'คนขับรถ' + ' ' + ele.booking_licenseplate}
                                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                                    <ListItemIcon>
                                                                        {(ele.booking_status !== 'CANCEL' && ele.booking_status !== 'COMPLETE' && moment(new Date()).format('YYYY-MM-DD HH:mm') <= ele.booking_start) &&
                                                                            <>
                                                                                <IconButton style={{ background: 'aliceblue' }} title="เปลี่ยนคนขับรถ" onClick={() => { handleSwap_emp(index, ele.booking_nbr, 'Taxi') }}>
                                                                                    <SwapHoriz color="primary" />
                                                                                </IconButton>
                                                                                &nbsp; &nbsp;
                                                                            </>
                                                                        }

                                                                        <IconButton style={{ background: 'rgb(233 30 99 / 6%)' }} title="เพิ่มคนโปรด" onClick={() => { handleAddFavTaxi(index, ele.booking_nbr, ele.booking_favour_tx_status) }}>
                                                                            {ele.booking_favour_tx_status ? <Favorite color="secondary" /> : <FavoriteBorderOutlined color="secondary" />}
                                                                        </IconButton>
                                                                    </ListItemIcon>
                                                                </ListItem>
                                                            </List>
                                                        </Box>
                                                        {ele.booking_c &&
                                                            <Box mt={1} mb={1} >
                                                                <List dense={true} style={{ padding: 0 }}>
                                                                    <ListItem style={{ paddingLeft: 0 }}>
                                                                        <ListItemAvatar>
                                                                            <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                                            </Avatar>
                                                                        </ListItemAvatar>
                                                                        <ListItemText
                                                                            primary={ele.booking_c + ele.booking_c_tel}
                                                                            secondary="ผู้ดูแล"
                                                                            classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                                        <ListItemIcon >
                                                                            {(ele.booking_status !== 'CANCEL' && ele.booking_status !== 'COMPLETE' && moment(new Date()).format('YYYY-MM-DD HH:mm') <= ele.booking_start) &&
                                                                                <>
                                                                                    <IconButton style={{ background: 'aliceblue' }} title="เปลี่ยนผู้ดูแล" onClick={() => { handleSwap_emp(index, ele.booking_nbr, 'Caregiver') }}>
                                                                                        <SwapHoriz color="primary" />
                                                                                    </IconButton>
                                                                                    &nbsp; &nbsp;
                                                                                </>

                                                                            }
                                                                            <IconButton style={{ background: 'rgb(233 30 99 / 6%)' }} title="เพิ่มคนโปรด" onClick={() => { handleAddFavCG(index, ele.booking_nbr, ele.booking_favour_cg_status) }}>
                                                                                {ele.booking_favour_cg_status ? <Favorite color="secondary" /> : <FavoriteBorderOutlined color="secondary" />}
                                                                            </IconButton>
                                                                        </ListItemIcon>
                                                                    </ListItem>
                                                                </List>
                                                            </Box>
                                                        }

                                                        <Box mt={2} mb={0} >
                                                            <Divider />
                                                        </Box>
                                                        <Box mt={1} mb={1} >
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}><Box mt={1} className={classes.font_small}>ชั่วโมงให้บริการ</Box></Grid>
                                                            </Grid>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <List dense={true} style={{ padding: 0 }}>
                                                                        <ListItem style={{ paddingLeft: 0, paddingBottom: 0 }}>
                                                                            <ListItemText
                                                                                primary={(ele.booking_product_drop !== 2)
                                                                                    ? (ele.booking_addOn_hour_tx > 0)
                                                                                        ? <> คนขับรถ <span style={{ color: 'green' }}>(+)</span> : {"รอ " + (ele.booking_addOn_hour_tx + ele.booking_tx_default_hour) + " ชั่วโมง สะสมรวมตลอดการเดินทาง"}</>
                                                                                        : "คนขับรถ : " + "รอ " + (ele.booking_hrtx + ele.booking_tx_default_hour) + " ชั่วโมง สะสมรวมตลอดการเดินทาง"
                                                                                    : 'คนขับรถ : -'}
                                                                                classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                                            {(ele.booking_product_drop > 2 && ele.booking_status !== 'CANCEL' && ele.booking_status !== 'COMPLETE' && (moment(new Date()).format('YYYY-MM-DD HH:mm') <= moment(ele.booking_start).subtract(1, 'days').format('YYYY-MM-DD HH:mm'))) &&

                                                                                <ListItemIcon>
                                                                                    <IconButton style={{ background: 'aliceblue' }} title="ลดชั่วโมงคนขับ" onClick={() => { handleAddhrTaxi(index, ele.booking_nbr, ele.booking_hrtx, 'decrease') }}>
                                                                                        <Remove color="primary" />
                                                                                    </IconButton>
                                                                                    &nbsp; &nbsp;
                                                                                    <IconButton style={{ background: 'aliceblue' }} title="เพิ่มชั่วโมงคนขับ" onClick={() => { handleAddhrTaxi(index, ele.booking_nbr, ele.booking_hrtx, 'increase') }}>
                                                                                        <Add color="primary" />
                                                                                    </IconButton>
                                                                                </ListItemIcon>
                                                                            }
                                                                        </ListItem>
                                                                    </List>
                                                                </Grid>
                                                                {ele.booking_c &&
                                                                    <Grid item xs={12}>
                                                                        <List dense={true} style={{ padding: 0 }}>
                                                                            <ListItem style={{ paddingLeft: 0, paddingTop: 0 }}>
                                                                                <ListItemText
                                                                                    primary={(ele.booking_product_drop !== 2)
                                                                                        ? (ele.booking_addOn_hour_cg > 0)
                                                                                            ? <> คนขับรถ <span style={{ color: 'green' }}>(+)</span> : {"ให้บริการ " + (ele.booking_addOn_hour_cg + ele.booking_cg_default_hour) + " ชั่วโมง"}</>
                                                                                            : "ผู้ดูแล : " + "ให้บริการ " + (ele.booking_hrcg + ele.booking_cg_default_hour) + " ชั่วโมง"
                                                                                        : 'ผู้ดูแล : -'}
                                                                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                                                {(ele.booking_product_drop > 2 && ele.booking_status !== 'CANCEL' && ele.booking_status !== 'COMPLETE' && (moment(new Date()).format('YYYY-MM-DD HH:mm') <= moment(ele.booking_start).subtract(1, 'days').format('YYYY-MM-DD HH:mm'))) &&
                                                                                    <ListItemIcon >
                                                                                        <IconButton style={{ background: 'aliceblue' }} title="ลดชั่วโมงผู้ดูแล" onClick={() => { handleAddhrCG(index, ele.booking_nbr, ele.booking_hrcg, 'decrease') }}>
                                                                                            <Remove color="primary" />
                                                                                        </IconButton>
                                                                                        &nbsp; &nbsp;
                                                                                        <IconButton style={{ background: 'aliceblue' }} title="เพิ่มชั่วโมงผู้ดูแล" onClick={() => { handleAddhrCG(index, ele.booking_nbr, ele.booking_hrcg, 'increase') }}>
                                                                                            <Add color="primary" />
                                                                                        </IconButton>
                                                                                    </ListItemIcon>
                                                                                }
                                                                            </ListItem>
                                                                        </List>
                                                                    </Grid>}
                                                            </Grid>
                                                        </Box>
                                                    </FormControl>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Card variant="outlined" >
                                                <CardContent style={{ paddingBottom: '16px' }} >
                                                    <FormLabel className={classes.font_normal} ><SectionLineV classes={classes} /></FormLabel>
                                                    <Stepper activeStep={activeStep} orientation="vertical" connector={<ColorRouteConnector />} style={{ padding: '12px 0px 12px 0px' }}>
                                                        {ele.booking_point.map((label, index) => (
                                                            <Step key={index}>
                                                                <StepLabel StepIconComponent={RouteIcon}>
                                                                    <Box className={classes.font_normal}>
                                                                        <strong style={{ color: '#FE7569' }}>{label.name}</strong>  :
                                                                        <span className={classes.font_small}> {label.address}</span>
                                                                    </Box>
                                                                    <span className={classes.font_desc}>{label.rmks1 !== "" && <>{label.rmks1}</>}</span>
                                                                </StepLabel>
                                                            </Step>
                                                        ))}
                                                    </Stepper>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Card variant="outlined" >
                                                <CardContent style={{ paddingBottom: '16px' }} >
                                                    <FormLabel className={classes.font_normal} ><SectionLineVII classes={classes} /></FormLabel>
                                                    <FormControl component="fieldset">
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}><Box mt={1} className={classes.font_normal}>จำนวนผู้ติดตาม :
                                                                <span className={classes.font_small}> {ele.booking_follower} คน</span>
                                                            </Box></Grid>
                                                            <Grid item xs={12}><Box mt={1} className={classes.font_normal}>อุปกรณ์ที่นำไปด้วย :
                                                                <span className={classes.font_small}> {ele.booking_equipment}</span>
                                                            </Box></Grid>
                                                            <Grid item xs={12}><Box mt={1} className={classes.font_normal}>รายละเอียดเพิ่มเติม :
                                                                <span className={classes.font_small}> {ele.booking_desc}</span>
                                                            </Box></Grid>
                                                        </Grid>
                                                    </FormControl>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Card variant="outlined" >
                                                <CardContent style={{ paddingBottom: '16px' }} >
                                                    <FormLabel className={classes.font_normal} ><SectionLineEX classes={classes} /></FormLabel>
                                                    <FormControl component="fieldset">
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <Box mt={1} mb={1} pl={1}>
                                                                    {ele.booking_product_name}
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={3} className={classes.font_end}>
                                                                <Box mt={1} mb={1}>
                                                                    x1
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={3} className={classes.font_end}>
                                                                <Box mt={1} mb={1} pr={1}>
                                                                    {Number(ele.booking_product_price).toLocaleString("en-US")}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        {ele.booking_extra_tx_hr > 0 &&
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={6}>
                                                                    <Box mb={1} pl={1}>
                                                                        เพิ่มชั่วโมงคนขับรถ (ชม.ละ {Number(ele.booking_tx_price_hour).toLocaleString("en-US")})
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={3} className={classes.font_end}>
                                                                    <Box mb={1}>
                                                                        {'x' + ele.booking_extra_tx_hr}
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={3} className={classes.font_end}>
                                                                    <Box mb={1} pr={1}>
                                                                        {Number(ele.booking_taxi_hrprice).toLocaleString("en-US")}
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                        {(ele.booking_extra_cg_hr > 0) &&
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={6}>
                                                                    <Box mb={1} pl={1}>
                                                                        เพิ่มชั่วโมงผู้ดูแล (ชม.ละ {Number(ele.booking_cg_price_hour).toLocaleString("en-US")})
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={3} className={classes.font_end}>
                                                                    <Box mb={1}>
                                                                        {'x' + ele.booking_extra_cg_hr}
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={3} className={classes.font_end}>
                                                                    <Box mb={1} pr={1}>
                                                                        {Number(ele.booking_cg_hrprice).toLocaleString("en-US")}
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Box pd={1} pb={1}>
                                                                    <PageLine />
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={9} className={classes.font_end}>
                                                                <Box mb={1} pl={1}>
                                                                    รวมก่อนหักส่วนลด
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={3} className={classes.font_end}>
                                                                <Box mb={1} pr={1}>
                                                                    {Number(ele.summary).toLocaleString("en-US")}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={9} className={classes.font_end}>
                                                                <Box mb={1} pl={1}>
                                                                    ส่วนลดคูปองการเดินทาง
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={3} className={classes.font_end}>
                                                                <Box mb={1} pr={1}>
                                                                    {Number(ele.dis_package).toLocaleString("en-US")}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={9} className={classes.font_end}>
                                                                <Box mb={1} pl={1}>
                                                                    ใช้โค้ดส่วนลด
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={3} className={classes.font_end}>
                                                                <Box mb={1} pr={1}>
                                                                    {Number(ele.dis_couponcode).toLocaleString("en-US")}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={9} className={classes.font_end}>
                                                                <Box mb={1} pl={1}>
                                                                    ส่วนลดโปรโมชั่น
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={3} className={classes.font_end}>
                                                                <Box mb={1} pr={1}>
                                                                    {Number(ele.dis_promotion).toLocaleString("en-US")}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={9} className={classes.font_end}>
                                                                <Box mb={1} pl={1}>
                                                                    ส่วนลดสมาชิก
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={3} className={classes.font_end}>
                                                                <Box mb={1} pr={1}>
                                                                    {Number(ele.dis_member).toLocaleString("en-US")}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={9} className={classes.font_end}>
                                                                <Box mb={1} pl={1}>
                                                                    รวมหลังหักส่วนลด
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={3} className={classes.font_end}>
                                                                <Box mb={1} pr={1}>
                                                                    {Number(ele.net).toLocaleString("en-US")}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Box mt={1} className={classes.displayflexToal}>
                                                                    <Box pl={1}>
                                                                        <b>รวมทั้งสิ้น</b>
                                                                    </Box>
                                                                    <Box pr={1} style={{ fontSize: '24px' }}>
                                                                        ฿{Number(ele.net).toLocaleString("en-US")}
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </FormControl>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Collapse>
                    </Box>
                ))}

                <PaymentTitle classes={classes} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box className={classes.displayflexTitle}>
                            <Box className={classes.displayflexCenter}>
                                {(invStatus.gmm_inv_payment_id === null) && <img src="/image/coupon.png" width="32" heigth="32" />}
                                {(invStatus.gmm_inv_payment_id === '2001') && <img src="/image/qr_icon.svg.png" width="32" heigth="32" />}
                                {(invStatus.gmm_inv_payment_id === '1002') && <img src="/image/icon_bank/SCB.png" width="32" heigth="32" />}
                                {(invStatus.gmm_inv_payment_id === '1001') && <img src="/image/icon_bank/KBANK.png" width="32" heigth="32" />}
                                {(invStatus.gmm_inv_payment_id === '3001') && <img src="/image/visa.png" width="45" heigth="45" />}
                                {(invStatus.gmm_inv_payment_id === '4001') && <img src="/image/wallet.png" width="32" heigth="32" />}
                                &nbsp;&nbsp;
                                <Typography className={classes.font_normal}>
                                    {(invStatus.gmm_inv_payment_id === null) ? 'คูปองทริป' : invStatus.payment_long_name}
                                </Typography>
                            </Box>
                            <Box >
                                <Button variant="outlined" color="primary"
                                    onClick={() => { handleChangePayment(invStatus.gmm_inv_payment_id) }}
                                    disabled={
                                        (promise) ? true :
                                            (moment(new Date()).format('YYYY-MM-DD HH:mm') >= invStatus.gmm_inv_exp_date) ? true :
                                                (invStatus.gmm_inv_status === 'PENDING') ? false : true
                                    }>
                                    <Box className={classes.paymentBtn}>
                                        เปลี่ยนวิธีชำระ
                                    </Box>
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    {(invStatus.gmm_inv_payment_id === '4001' && invStatus.gmm_inv_status === 'PENDING') &&
                        <>
                            <Grid item xs={12}>
                                <PageLine />
                            </Grid>
                            <Grid item xs={12}>
                                <Box className={classes.displayflexTitle}>
                                    <Box pr={2}>
                                        เครดิตคงเหลือ : {Number(baln).toLocaleString("en-US")}
                                    </Box>
                                    <Box className={classes.displayflex}>
                                        <TextField
                                            name="credit"
                                            margin="dense"
                                            variant="outlined"
                                            value={myCredit}
                                            onChange={handleUsecredit}
                                            inputProps={{ maxLength: 7, className: classes.font_normal, }}
                                            disabled={
                                                (promise) ? true :
                                                    (moment(new Date()).format('YYYY-MM-DD HH:mm') >= invStatus.gmm_inv_exp_date) ? true :
                                                        (invStatus.gmm_inv_status === 'PENDING') ? false : true
                                            }
                                            InputProps={{
                                                className: classes.font_normal,
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        <Button
                                                            disabled={
                                                                (promise) ? true :
                                                                    (moment(new Date()).format('YYYY-MM-DD HH:mm') >= invStatus.gmm_inv_exp_date) ? true :
                                                                        (invStatus.gmm_inv_status === 'PENDING') ? false : true
                                                            }
                                                            className={classes.font_small_btn} variant="contained" color="primary" size="small"
                                                            onClick={handlePushValue}>
                                                            Max
                                                        </Button>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                            fullWidth
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                        </>
                    }

                    {(invStatus.gmm_inv_payment_id === '4001') &&
                        <>
                            <Grid item xs={12}>
                                <Box className={classes.displayflexTitle}>
                                    {(attachfile.name !== '') ?
                                        (invStatus.gmm_inv_status === 'PENDING') ?
                                            <Box>หลักฐานการโอน :
                                                <Chip
                                                    size="small"
                                                    style={{ marginLeft: '4px' }}
                                                    label={attachfile.name}
                                                    onDelete={handleDeleteImage}
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                            :
                                            <Box>หลักฐานการโอน :
                                                <Chip
                                                    size="small"
                                                    style={{ marginLeft: '4px' }}
                                                    label={attachfile.name}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>

                                        :

                                        <Typography style={{ marginTop: '-1px' }} className={classes.font_normal}>หลักฐานการโอน : </Typography>

                                    }
                                    <Box className={classes.displayflex}>
                                        {(invStatus.gmm_inv_status === 'PENDING') &&
                                            <>
                                                <Button
                                                    component="label"
                                                    disabled={(Totalprice.net === 0) ? true : false}
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.font_normalXflex}>

                                                    <AttachFile style={{ marginLeft: '3px' }} fontSize="small" />
                                                    <Hidden xsDown>
                                                        &nbsp;อัพโหลดรูปภาพ
                                                    </Hidden>

                                                    <input
                                                        id="InputFile"
                                                        onChange={(e) => { handleuploadFile(e) }}
                                                        type="file"
                                                        accept="image/x-png,image/gif,image/jpeg"
                                                        hidden
                                                    />
                                                </Button>
                                                &nbsp;&nbsp;
                                            </>
                                        }
                                        <Button
                                            onClick={handlePreviewOpen}
                                            disabled={attachfile.preview === ''}
                                            variant="contained"
                                            color="primary"
                                            className={classes.font_normalXflex}
                                        >
                                            <ImageSearch fontSize="small" />
                                            <Hidden xsDown>
                                                &nbsp;Preview
                                            </Hidden>

                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </>
                    }

                    <Grid item xs={12}>
                        <PageLine />
                    </Grid>
                    <Grid item xs={12}>
                        <Box className={classes.displayflexTitle}>
                            <Box className={classes.displayflexCenter}>
                                <Typography className={classes.font_net}> ยอดที่ต้องชำระ </Typography>
                            </Box>
                            <Box >
                                <Typography className={classes.font_net}>฿{Number(Totalprice.net).toLocaleString("en-US")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <PageLine />
                    </Grid>

                    {(invStatus.gmm_inv_status === 'PENDING' && invStatus.gmm_inv_payment_id !== '4001') &&
                        // (invStatus.gmm_inv_payment_id !== '2001' && dataPayment.qrRawData === null) ?
                        // <Grid item xs={12}>
                        //     <Box mt={0} className={classes.Submit}>
                        //         <Button variant="contained" color="primary"
                        //             onClick={handlePayment}
                        //             disabled={
                        //                 (promise) ? true :
                        //                     (moment(new Date()).format('YYYY-MM-DD HH:mm') >= invStatus.gmm_inv_exp_date) ? true :
                        //                         (invStatus.gmm_inv_payment_id !== '2001' && invStatus.gmm_inv_payment_id !== '4001') ? true : false
                        //             }>
                        //             <Box className={classes.paymentBtn}>
                        //                 xxxxxxxxxxxxxxxxxxxxx
                        //             </Box>
                        //         </Button>
                        //     </Box>
                        // </Grid>
                        // :
                        <Grid item xs={12}>
                            <Box mt={0} className={classes.Submit}>
                                <Button variant="contained" color="primary"
                                    onClick={handlePayment}
                                    disabled={
                                        (promise) ? true :
                                            (moment(new Date()).format('YYYY-MM-DD HH:mm') >= invStatus.gmm_inv_exp_date) ? true :
                                                (invStatus.gmm_inv_payment_id !== '2001' && invStatus.gmm_inv_payment_id !== '4001') ? true : false
                                    }>
                                    <Box className={classes.paymentBtn}>
                                        ชำระค่าบริการ
                                    </Box>
                                </Button>
                            </Box>
                        </Grid>
                    }

                    {(invStatus.gmm_inv_status === 'PENDING' && invStatus.gmm_inv_payment_id === '4001') &&
                        <Grid item xs={12}>
                            <Box mt={0} className={classes.Submit}>
                                <Button variant="contained" color="primary"
                                    onClick={handlePayment}
                                    disabled={
                                        (promise) ? true :
                                            (moment(new Date()).format('YYYY-MM-DD HH:mm') >= invStatus.gmm_inv_exp_date) ? true :
                                                (Totalprice.net !== 0) ?
                                                    (attachfile.base64 !== '') ? false : true
                                                    : false
                                    }>
                                    <Box className={classes.paymentBtn}>
                                        ชำระค่าบริการ
                                    </Box>
                                </Button>
                            </Box>
                        </Grid>
                    }


                </Grid>
            </Collapse>

            {invRef.map((ele, index) => (
                <Box mt={2} mb={2} key={ele.gmm_inv_nbr}>
                    <Box mb={2} className={classes.displayflexCenterCSS} >
                        <Box className={classes.displayflexCenter}>
                            <Description />
                            <Typography className={classes.font_header}>{ele.gmm_inv_nbr}</Typography>
                        </Box>
                        <Box>
                            {ele.collapMulti ? <IconButton onClick={() => { handleClmultiple(index) }}>
                                <ExpandMore />
                            </IconButton> : <IconButton onClick={() => { handleClmultiple(index) }}>
                                <ExpandLess />
                            </IconButton>}
                        </Box>
                    </Box>
                    <Collapse in={expandedInvd[index]} timeout="auto" unmountOnExit>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }} >
                                <Box className={classes.displayflexTitle}>
                                    <Box >
                                        <Typography className={classes.font_subheader}>&nbsp;เลขที่ชำระเงิน</Typography>
                                    </Box>
                                    <Box >
                                        <Typography className={classes.font_subheader}>&nbsp;{ele.gmm_inv_nbr}</Typography>
                                    </Box>
                                </Box>

                                <Box className={classes.displayflexTitle}>
                                    <Box >
                                        <Typography className={classes.font_subheader}>&nbsp;ชำระก่อนวันที่</Typography>
                                    </Box>
                                    <Box >
                                        <Typography className={classes.font_subheader}>&nbsp;{ele.gmm_inv_exp_date}</Typography>
                                    </Box>
                                </Box>

                                <Box className={classes.displayflexTitle}>
                                    <Box >
                                        <Typography className={classes.font_subheader}>&nbsp;สถานะการชำระ</Typography>
                                    </Box>
                                    <Box >
                                        {(ele.gmm_inv_status === 'PENDING') &&
                                            <Box style={{ color: 'rgb(63, 81, 181)', display: 'flex', justifyContent: 'center' }}>
                                                <Info fontSize="small" /> &nbsp;
                                                รอการชำระเงิน
                                            </Box>
                                        }
                                        {(ele.gmm_inv_status === 'SUCCESS') &&
                                            <Box style={{ color: 'rgb(33, 124, 37)', display: 'flex', justifyContent: 'center' }}>
                                                <Check fontSize="small" /> &nbsp;
                                                ชำระเงินแล้ว
                                            </Box>}
                                        {(ele.gmm_inv_status === 'CANCEL') &&
                                            <Box style={{ color: '#e91e63', display: 'flex', justifyContent: 'center' }}>
                                                <Close fontSize="small" /> &nbsp;
                                                ยกเลิกการจอง
                                            </Box>}
                                    </Box>
                                </Box>


                            </CardContent>
                        </Card>
                        <Box mb={1} />
                        <DetailTripHour classes={classes} status={promise} ele={ele} func={handleCancelHour} />
                        {ele.item.map((invd, index) => (
                            <Box mb={2} key={invd.gmm_invd_line}>
                                <List component="nav" className={classes.ListHeader} key={invd.gmm_invd_line}>
                                    <ListItem button >
                                        <Grid container spacing={0}>
                                            <Grid item xs={8}>
                                                <Typography className={classes.font_normalXflex}>{invd.gmm_invd_desc} x {(invd.gmm_invd_add_tx) ? invd.gmm_invd_add_tx : invd.gmm_invd_add_cg}</Typography>

                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography className={classes.font_endXList}> ค่าบริการ : {Number(invd.gmm_invd_disc_net).toLocaleString("en-US")}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography className={classes.font_normalXpd}>เลขที่การเดินทาง : {invd.gmm_invd_booking_ref}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                </List>
                            </Box>
                        ))}

                        <PaymentTitle classes={classes} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box className={classes.displayflexTitle}>
                                    <Box className={classes.displayflexCenter}>
                                        {(ele.gmm_inv_payment_id === '1001') && <img src="/image/icon_bank/KBANK.png" width="32" heigth="32" />}
                                        {(ele.gmm_inv_payment_id === '1002') && <img src="/image/icon_bank/SCB.png" width="32" heigth="32" />}
                                        {(ele.gmm_inv_payment_id === '2001') && <img src="/image/qr_icon.svg.png" width="32" heigth="32" />}
                                        {(ele.gmm_inv_payment_id === '3001') && <img src="/image/visa.png" width="45" heigth="45" />}
                                        {(ele.gmm_inv_payment_id === '4001') && <img src="/image/wallet.png" width="32" heigth="32" />}

                                        &nbsp;&nbsp;
                                        <Typography className={classes.font_normal}>
                                            {ele.payment_long_name}
                                        </Typography>
                                    </Box>
                                    <Box >
                                        <Button variant="outlined" color="primary"
                                            disabled={
                                                (promise) ? true :
                                                    (moment(new Date()).format('YYYY-MM-DD HH:mm') >= ele.gmm_inv_exp_date) ? true :
                                                        (ele.gmm_inv_status === 'PENDING') ? false : true
                                            }
                                            onClick={() => { handleChangePaymentInvd(ele.gmm_inv_nbr, ele.gmm_inv_payment_id, ele.gmm_inv_exp_date) }}>
                                            <Box className={classes.paymentBtn}>
                                                เปลี่ยนวิธีชำระ
                                            </Box>
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                            {(ele.gmm_inv_payment_id === '4001' && ele.gmm_inv_status === 'PENDING') &&
                                <>
                                    <Grid item xs={12}>
                                        <PageLine />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box className={classes.displayflexTitle}>
                                            <Box pr={2}>
                                                เครดิตคงเหลือ : {Number(ele.baln).toLocaleString("en-US")}
                                            </Box>
                                            <Box className={classes.displayflex}>
                                                <TextField
                                                    name="credit_invd"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={ele.myCredit}
                                                    onChange={(event) => { handleUsecreditInvd(event, ele, index) }}
                                                    inputProps={{ maxLength: 7, className: classes.font_normal, }}
                                                    disabled={
                                                        (promise) ? true :
                                                            (moment(new Date()).format('YYYY-MM-DD HH:mm') >= ele.gmm_inv_exp_date) ? true :
                                                                (ele.gmm_inv_status === 'PENDING') ? false : true
                                                    }
                                                    InputProps={{
                                                        className: classes.font_normal,
                                                        endAdornment: (
                                                            <InputAdornment position="start">
                                                                <Button
                                                                    disabled={
                                                                        (promise) ? true :
                                                                            (moment(new Date()).format('YYYY-MM-DD HH:mm') >= ele.gmm_inv_exp_date) ? true :
                                                                                (ele.gmm_inv_status === 'PENDING') ? false : true
                                                                    }
                                                                    className={classes.font_small_btn} variant="contained" color="primary" size="small"
                                                                    onClick={() => { handlePushValueInvd(ele, index) }}>
                                                                    Max
                                                                </Button>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    InputLabelProps={{
                                                        className: classes.font_normal,
                                                    }}
                                                    fullWidth
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>
                                </>
                            }

                            {(ele.gmm_inv_payment_id === '4001') &&
                                <>
                                    <Grid item xs={12}>
                                        <Box className={classes.displayflexTitle}>


                                            {(ele.img.name !== '') ?
                                                (ele.gmm_inv_status === 'PENDING') ?
                                                    <Box>หลักฐานการโอน :
                                                        <Chip
                                                            size="small"
                                                            style={{ marginLeft: '4px' }}
                                                            label={ele.img.name}
                                                            onDelete={(e) => { handleDeleteImageInvd(e, ele.gmm_inv_nbr, index) }}
                                                            color="secondary"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                    :
                                                    <Box>หลักฐานการโอน :
                                                        <Chip
                                                            size="small"
                                                            style={{ marginLeft: '4px' }}
                                                            label={ele.img.name}
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                :

                                                <Typography style={{ marginTop: '-1px' }} className={classes.font_normal}>หลักฐานการโอน : </Typography>

                                            }
                                            <Box className={classes.displayflex}>
                                                {(ele.gmm_inv_status === 'PENDING') &&
                                                    <>
                                                        <Button
                                                            component="label"
                                                            disabled={(ele.net === 0) ? true : false}
                                                            variant="contained"
                                                            color="primary"
                                                            className={classes.font_normalXflex}>

                                                            <AttachFile style={{ marginLeft: '3px' }} fontSize="small" />
                                                            <Hidden xsDown>
                                                                &nbsp;อัพโหลดรูปภาพ
                                                            </Hidden>

                                                            <input
                                                                id={ele.gmm_inv_nbr}
                                                                onChange={(e) => { handleuploadFileInvd(e, ele.gmm_inv_nbr, index) }}
                                                                type="file"
                                                                accept="image/x-png,image/gif,image/jpeg"
                                                                hidden
                                                            />
                                                        </Button>
                                                        &nbsp;&nbsp;
                                                    </>
                                                }
                                                <Button
                                                    onClick={() => { handlePreviewOpenInvd(index) }}
                                                    disabled={ele.img.preview === ''}
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.font_normalXflex}
                                                >
                                                    <ImageSearch fontSize="small" />
                                                    <Hidden xsDown>
                                                        &nbsp;Preview
                                                    </Hidden>

                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </>
                            }
                            <Grid item xs={12}>
                                <PageLine />
                            </Grid>
                            <Grid item xs={12}>
                                <Box className={classes.displayflexTitle}>
                                    <Box className={classes.displayflexCenter}>
                                        <Typography className={classes.font_net}> ยอดที่ต้องชำระ </Typography>
                                    </Box>
                                    <Box >
                                        {ele.gmm_inv_status === 'PENDING' && <Typography className={classes.font_net}>฿{Number(ele.net).toLocaleString("en-US")}</Typography>}
                                        {ele.gmm_inv_status === 'SUCCESS' && <Typography className={classes.font_net}>฿{Number(0).toLocaleString("en-US")}</Typography>}
                                        {ele.gmm_inv_status === 'CANCEL' && <Typography className={classes.font_net}>฿{Number(0).toLocaleString("en-US")}</Typography>}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <PageLine />
                            </Grid>
                            {(ele.gmm_inv_status === 'PENDING' && ele.gmm_inv_payment_id !== '4001') &&
                                <>
                                    <Grid item xs={12}>
                                        <Box mt={0} className={classes.Submit}>
                                            <Button variant="contained" color="primary"
                                                onClick={() => { handlePaymentInvd(ele.gmm_inv_payment_id, ele.payment, ele) }}
                                                disabled={
                                                    (promise) ? true :
                                                        (moment(new Date()).format('YYYY-MM-DD HH:mm') >= ele.gmm_inv_exp_date) ? true :
                                                            (ele.gmm_inv_payment_id !== '2001' && ele.gmm_inv_payment_id !== '4001') ? true : false
                                                }>
                                                <Box className={classes.paymentBtn}>
                                                    ชำระค่าบริการ
                                                </Box>
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PageLine />
                                    </Grid>
                                </>
                            }

                            {(ele.gmm_inv_status === 'PENDING' && ele.gmm_inv_payment_id === '4001') &&
                                <>
                                    <Grid item xs={12}>
                                        <Box mt={0} className={classes.Submit}>
                                            <Button variant="contained" color="primary"
                                                onClick={() => { handlePaymentInvd(ele.gmm_inv_payment_id, ele.payment, ele) }}
                                                disabled={
                                                    (promise) ? true :
                                                        (moment(new Date()).format('YYYY-MM-DD HH:mm') >= ele.gmm_inv_exp_date) ? true :
                                                            (ele.net !== 0) ?
                                                                (ele.img.base64 !== '') ? false : true
                                                                : false
                                                }>
                                                <Box className={classes.paymentBtn}>
                                                    ชำระค่าบริการ
                                                </Box>
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PageLine />
                                    </Grid>
                                </>
                            }

                        </Grid>
                    </Collapse>
                </Box>
            ))}

            {(invStatus.gmm_inv_status === 'SUCCESS' && countHour === true) &&
                <Box mt={4} className={classes.Submit}>
                    <Button variant="outlined" color="primary"
                        startIcon={<Add />}
                        onClick={handleAddOrder}
                        disabled={
                            (promise) ? true : false
                        }>
                        <Box className={classes.paymentBtn}>
                            เพิ่มคำสั่งซื้อ
                        </Box>
                    </Button>
                </Box>
            }


            <Dialog
                onClose={handleCloseDialogFavouriteTrip}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openFavouriteTrip}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseDialogFavouriteTrip}>
                    Favourite Trip
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <form id="FieldFavourite" onSubmit={SubmitFavouriteTrip}>
                        <TextField
                            name="desc"
                            margin="dense"
                            variant="outlined"
                            label="สร้างชื่อทริป"
                            value={Tripname.name}
                            onChange={(event) => {
                                setTripname({ ...Tripname, name: event.target.value })
                            }}
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
                    </form>
                </MuiDialogContent>
                <DialogActions>
                    <Button form="FieldFavourite" type="submit" variant="contained" className={classes.font_normal} color="primary" fullWidth>
                        บันทึก
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                onClose={handleCloseDialognote}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openNote}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseDialognote}>
                    จดบันทึก
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <TextField
                        name="desc"
                        variant="outlined"
                        placeholder="รายละเอียดเพิ่มเติม"
                        rows={3}
                        value={message}
                        onChange={handleChangeTextnoteInput}
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
                    <FormHelperText className={classes.font_smallRight}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                </MuiDialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={SubmitNote} className={classes.font_normal} color="primary" fullWidth>
                        บันทึก
                    </Button>
                </DialogActions>
            </Dialog>

            {/* #QRCODE */}
            <Dialog
                onClose={handleCloseQRCode}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openQRCode}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseQRCode}>
                    Payment QR Code
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Canvas_qrcode path={dataPayment} />
                </MuiDialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => { SaveImageQRCode(dataPayment.invoice) }} className={classes.font_normal} color="primary" fullWidth>
                        Download Image
                    </Button>
                </DialogActions>
            </Dialog>

            {/* #QRCODE_INVD */}
            <Dialog
                onClose={handleCloseQRCodeInvd}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openQRCodeInvd}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseQRCodeInvd}>
                    Payment QR Code
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Canvas_qrcode path={dataPaymentInvd} />
                </MuiDialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => { SaveImageQRCode(dataPaymentInvd.invoice) }} className={classes.font_normal} color="primary" fullWidth>
                        Download Image
                    </Button>
                </DialogActions>
            </Dialog>



            <Dialog
                onClose={handleCloseListemp}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openListemp}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseListemp}>
                    เปลี่ยน{wordDialog === 'Taxi' ? 'คนขับรถ' : 'ผู้ดูแล'}
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <List dense={true}>
                        {listemp_empty.map((detail, index) =>
                            <ListItem button onClick={() => { handleChangeEmp(detail.gmm_emp_id, detail.gmm_emp_fname, detail.gmm_emp_lname, detail.gmm_emp_licenseplate, detail.gmm_emp_tel, detail.gmm_emp_type, invStatus.gmm_inv_user_id) }} className={classes.ListMycoupon} key={detail.gmm_emp_id}>
                                <ListItemAvatar>
                                    <Avatar src={(wordDialog === 'Taxi') ? "/image/taxiicon.png" : "/image/cgicon.png"} style={{ background: '#FFCB08' }}>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={detail.gmm_emp_fname + ' ' + detail.gmm_emp_lname}
                                    secondary={(wordDialog === 'Taxi') ? 'คนขับรถ' : 'ผู้ดูแล'}
                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => { handleChangeEmp(detail.gmm_emp_id, detail.gmm_emp_fname, detail.gmm_emp_lname, null, detail.gmm_emp_tel, detail.gmm_emp_type, invStatus.gmm_inv_user_id) }}>
                                        <SwapHoriz color="primary" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )}
                    </List>
                    {listemp_empty.length === 0 &&
                        <Box className={classes.font_success} >
                            <Lottie
                                options={lottie_notfoundOptions}
                                height={200}
                                width={200}
                                isClickToPauseDisabled
                            />
                        </Box>
                    }
                </MuiDialogContent>
            </Dialog>

            {
                Preview &&
                <Lightbox
                    mainSrc={attachfile.preview}
                    onCloseRequest={handlePreviewClose}
                    animationDuration={100}
                    imageTitle={attachfile.name}
                    imagePadding={50}
                    reactModalStyle={custom_overlay}
                    enableZoom={true}
                />
            }

            {
                PreviewInvd &&
                <Lightbox
                    mainSrc={invRef[arrayRecord.index].img.preview}
                    onCloseRequest={handlePreviewCloseInvd}
                    animationDuration={100}
                    imageTitle={invRef[arrayRecord.index].img.name}
                    imagePadding={50}
                    reactModalStyle={custom_overlay}
                    enableZoom={true}
                />
            }
        </>

    );
}

