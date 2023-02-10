/* eslint-disable */
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Avatar, AppBar, Dialog, Toolbar, Backdrop, Button, Box, Chip, Collapse, Checkbox, Card, CardContent, Hidden,
    Divider, DialogTitle, DialogContent, DialogActions, FormGroup, FormControlLabel, FormControl, FormLabel,
    TextField, IconButton, Typography, Grid, FormHelperText, InputAdornment, StepConnector, StepLabel, Stepper,
    Step, Slide, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemAvatar, ListItemText, RadioGroup, Radio,
} from "@material-ui/core";
import AutocompleteInput, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    AttachFile, Add, ArrowBack, ArrowForward, ArrowForwardIos, AccountBalanceWallet, Book, Bookmark, Close, CheckCircle,
    Edit, Extension, Favorite, FavoriteBorderOutlined, LocalTaxi, AccessTime, InsertInvitation, LocationOn,
    Search, Settings, GroupAdd, Description, MonetizationOnOutlined, Remove, SportsKabaddi, FormatListNumbered,
    ArrowRight, BookmarkBorder, SyncAlt, ImageSearch
} from "@material-ui/icons";
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from 'moment';
import thLocale from "date-fns/locale/th";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import Dialog_edit from "./Dialog_edit"
import Dialog_create from "./Dialog_create"
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import config from '../../config';

//Google-map
import { Autocomplete, GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import Lottie from 'react-lottie';
import lottie_success from './success';
import lottie_failed from './failed';
import lottie_notfound from './notfound';
//----------------------------------------
import Canvas_qrcode from "./Canvas_qrcode";

const APIkey = 'AIzaSyANcHgMKpxM2-2wipNHgT7vumZrM7f1Nlo'
const libraries = ["places"];
const language = ["th"];

const custom_overlay = {
    overlay: {
        zIndex: 9999,
    },
}

const mapContainerStyle = {
    width: "100%",
    height: "100%"
}

const lottie_successOptions = {
    loop: true,
    autoplay: true,
    animationData: lottie_success,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const lottie_failedOptions = {
    loop: true,
    autoplay: true,
    animationData: lottie_failed,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const lottie_notfoundOptions = {
    loop: true,
    autoplay: true,
    animationData: lottie_notfound,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButtonMap: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: 'white',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
    Refresh: {
        color: theme.palette.grey[500],
    },

    font_otp: {
        fontFamily: 'SemiBold',
        fontSize: '18px',
        textAlign: 'center',
    }
});

const MuiDialogTitleMap = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classes.font_otp}>{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButtonMap} onClick={onClose}>
                    <Close />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
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

const MuiDialogContentMap = withStyles((theme) => ({
    root: {
        padding: theme.spacing(7.5, 0, 0, 0),
    },
}))(DialogContent);

const MuiDialogContentBks = withStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
    },
}))(DialogContent);

const MuiDialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(DialogContent);

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            // backgroundImage:
            //     'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            background: '#9faef3'
        },
    },
    completed: {
        '& $line': {
            // backgroundImage:
            //     'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            background: '#9faef3'
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

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

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        background: '#3f51b5'
        // backgroundImage:
        //     'linear-gradient(136deg, #ff5722 0%, #FFCB08 50%, rgb(244 244 244) 100%)',
        // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        background: '#3f51b5'
        // backgroundImage:
        //     'linear-gradient(136deg, #ff5722 0%, #FFCB08 50%, rgb(244 244 244) 100%)',
        // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
});

const useStyles = makeStyles((theme) => ({
    avtcolor: {
        background: '#3f51b5',
        marginRight: '8px'
    },
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    card_bodyLeft: {
        height: '125px',
        borderRadius: '8px',
        border: 'none',
        background: '#2196f3',
        cursor: 'pointer',
        color: 'white',
        '&:hover': {
            backgroundColor: '#007fe4',
            boxShadow: '3px 3px 6px 0px rgba(0, 0, 0, 0.4)'
        },

    },
    card_bodyLeft_border: {
        height: '125px',
        borderRadius: '8px',
        border: 'solid 5px white',
        background: '#2196f3',
        cursor: 'pointer',
        color: 'white',
        backgroundColor: '#007fe4',
        boxShadow: '3px 3px 6px 0px rgba(0, 0, 0, 0.4)'
    },
    card_bodyRight: {
        height: '125px',
        borderRadius: '8px',
        border: 'none',
        background: '#e91e63',
        cursor: 'pointer',
        color: 'white',
        '&:hover': {
            backgroundColor: '#e6004e',
            boxShadow: '3px 3px 6px 0px rgba(0, 0, 0, 0.4)'
        }
    },
    card_bodyRight_border: {
        height: '125px',
        borderRadius: '8px',
        border: 'solid 5px white',
        background: '#e91e63',
        cursor: 'pointer',
        color: 'white',
        backgroundColor: '#e6004e',
        boxShadow: '3px 3px 6px 0px rgba(0, 0, 0, 0.4)'
    },
    card_content: {
        height: '125px',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        fontFamily: 'Regular',
        fontSize: '24px'
    },
    displayflexTitle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    divider: {
        height: 28,
        margin: 4,
    },
    footer: {
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        textAlign: 'center',
        marginBottom: '24px'

    },
    Step_body: {
        overflow: 'auto',
        paddingLeft: 0,
        paddingRight: 0,
        borderBottom: '1px solid #d9d9d9',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    numpad: {
        width: '100%', textAlign: 'center'
    },
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
    displayflexCenter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    displayflexHead: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    displayflexToal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: '8px 0 8px 0',
        background: '#edf7ed',
        borderRadius: '10px'
    },
    fav_hover: {
        fontFamily: 'regular',
        fontSize: '14px',
        // border: 'solid 1px #e0e0e0',
        cursor: 'pointer',
        '&:hover': {
            background: '#fafafa',
            // color: 'white',
        },
    },
    fav_setting: {
        background: 'rgb(247 247 247)',
        fontFamily: 'regular',
        fontSize: '14px',
        cursor: 'pointer',
        '&:hover': {
            background: '#e7e7e7',
            // color: 'white',
        },
    },
    messageflex: {
        display: "flex",
        marginRight: '4px',
    },
    padding_table: {
        padding: theme.spacing(1)
    },
    Pagination: {
        flexShrink: 0,
        marginLeft: theme.spacing(4),
    },
    infodetail: {
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        textAlign: 'center',
        marginBottom: '78px'
    },
    infoBox: {
        [theme.breakpoints.up('sm')]: {
            width: '40%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '70%',
        },
    },
    imageSize: {
        width: '50%'
    },
    divInput: {
        border: 'none',
        margin: theme.spacing(2),
    },
    SearchInput: {
        background: 'white',
        fontFamily: 'Regular',
        fontSize: '14px',
        [theme.breakpoints.up('sm')]: {
            width: '40%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    },
    StyleDetail: {
        borderLeft: '6px solid rgb(0, 120, 214)',
        backgroundColor: 'rgba(0, 120, 214, 0.1)',
        padding: '12px',
        fontFamily: 'Regular',
        fontSize: '14px',
        margin: '0px'
    },
    ListHeader: {
        paddingTop: '0px',
        paddingBottom: '0px',
        background: '#f6f6f6',
        '&:hover': {
            background: '#eeeeee',
        },
    },
    ListSelect: {
        paddingTop: '8px',
        paddingBottom: '8px',
        background: '#f6f6f6',
        '&:hover': {
            background: '#eeeeee',
        },
    },
    ListDiscount: {
        padding: '12px',
        background: 'aliceblue',
        border: 'solid 0.5px #e3e3e380',
        // borderRadius: '4px',
        marginTop: '16px'

    },
    ListCoupon: {
        padding: '12px',
        // background: 'aliceblue',
        border: 'solid 0.5px #e3e3e380',
        // borderRadius: '4px',
        marginTop: '0px'

    },
    ListMycoupon: {
        padding: '12px',
        // background: '#ffc87d38',
        border: 'solid 0.5px #a9a9a926',
        // borderRadius: '4px',
        marginTop: '8px',
    },
    ListDiscountDialog: {
        padding: '12px',
        background: '#fcfcfc',
        border: 'solid 0.5px #e3e3e380',
        // borderRadius: '4px',
        margin: '8px 0px',
        '&:hover': {
            background: '#efefef',
        },

    },

    ListDiscountActive: {
        border: 'solid 1px aliceblue',
        padding: '12px 12px 12px 24px'
    },
    qrcode_style: {
        textAlign: 'center',
    },
    none_padding: {
        paddingTop: '0px',
        paddingBottom: '0px',
    },
    none_coupon: {
        textAlign: 'center', padding: '12px', border: 'solid 1px whitesmoke'
    },
    borderPayment2: {
        textAlign: 'center', padding: '12px', border: 'solid 1px whitesmoke',
        alignItems: "center",
    },
    none_couponflex: {
        textAlign: 'center', padding: '12px', border: 'solid 1px whitesmoke',
        display: "flex",
        alignItems: "center",
    },
    paymentBtn: {
        fontFamily: 'Regular',
        fontSize: '1.3rem'
    },
    font_header: {
        fontFamily: 'SemiBold',
        margin: '10px',
        fontSize: '18px'
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
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    font_small: {
        color: 'gray',
        fontFamily: 'Regular',
        fontSize: '12px'
    },
    font_mormal_small: {
        fontFamily: 'Regular',
        fontSize: '12px'
    },

    font_smallR: {
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
    },
    font_smallBtn: {
        fontFamily: 'Regular',
        fontSize: '12px'
    },
    font_success: {
        fontFamily: 'SemiBold',
        textAlign: 'center',
        fontSize: '24px'
    },
    font_end: {
        textAlign: 'end'
    },
    font_small_btn: {
        fontFamily: 'Regular',
        fontSize: '10px',
    },
    font_normalXflex: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textTransform: 'none',
    },
    font_desc: {
        fontFamily: 'Regular',
        fontSize: '12px',
        wordBreak: 'break-all',
        color: 'gray'
    }
}));

function getSteps() {
    return ['บริการ', 'กรอกข้อมูล', 'Taxi/CG', 'ข้อมูลเพิ่มเติม', 'สรุป', 'ชำระค่าบริการ'];
}

function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;
    const icons = {
        1: <Settings />,
        2: <GroupAdd />,
        3: <LocalTaxi />,
        4: <Extension />,
        5: <Description />,
        6: <MonetizationOnOutlined />,

    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

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

function Loading({ classes, status }) {
    ;
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

function Topic1({ classes, title, FindService, status }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexHead}>
                    <Box className={classes.displayflexHead}>
                        <Avatar className={classes.avtcolor}>1</Avatar>
                        {title === '' && <Typography className={classes.font_header}>เลือกบริการ </Typography>}
                        {title === 'single' && <Typography className={classes.font_header}>เลือกบริการ : เดินทางเที่ยวเดียว </Typography>}
                        {title === 'multiple' && <Typography className={classes.font_header}>เลือกบริการ : เดินทางรับรอส่ง </Typography>}

                    </Box>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function Topic2({ classes }) {
    return (
        <>
            <Box pt={1} pb={0}>
                <Box className={classes.displayflex}>
                    <Avatar className={classes.avtcolor}>2</Avatar>
                    <Typography className={classes.font_header}>กรอกข้อมูล</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function Topic3({ classes }) {
    return (
        <>
            <Box pt={1} pb={0}>
                <Box className={classes.displayflex}>
                    <Avatar className={classes.avtcolor}>3</Avatar>
                    <Typography className={classes.font_header}>Taxi/CG</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function Topic4({ classes }) {
    return (
        <>
            <Box pt={1} pb={0}>
                <Box className={classes.displayflex}>
                    <Avatar className={classes.avtcolor}>4</Avatar>
                    <Typography className={classes.font_header}>ข้อมูลเพิ่มเติม</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function Topic5({ classes }) {
    return (
        <>
            <Box pt={1} pb={0}>
                <Box className={classes.displayflex}>
                    <Avatar className={classes.avtcolor}>5</Avatar>
                    <Typography className={classes.font_header}>สรุปการจอง</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function Topic6({ classes }) {
    return (
        <>
            <Box pt={1} pb={0}>
                <Box className={classes.displayflex}>
                    <Avatar className={classes.avtcolor}>6</Avatar>
                    <Typography className={classes.font_header}>ชำระค่าบริการ</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function TopicFavTaxi({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Typography className={classes.font_header}>คนขับรถคนโปรด</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function TopicAutoTaxi({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Typography className={classes.font_header}>คนขับรถคนอื่นๆ</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function TopicFavCG({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Typography className={classes.font_header}>เลือกผู้ดูแล CG</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function TopicAutoCG({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Typography className={classes.font_header}>ผู้ดูแลคนอื่นๆ</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

function HeadersI({ classes }) {
    return (
        <>
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <LocationOn fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;จุดหมายที่ใช้บริการ (ไม่รวมจุดเริ่มต้น)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersII({ classes }) {
    return (
        <>
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <AccessTime fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ชั่วโมงการรอ (เริ่มต้น 1 ชั่วโมง)</Typography>

                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersIII({ classes }) {
    return (
        <>
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <AccessTime fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ชั่วโมงการรอ (เริ่มต้น 5 ชั่วโมง)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersIV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <LocationOn fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ระบุสถานที่</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <SportsKabaddi fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ผู้ดูแล (เลือกได้ 1 รายการ)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function SectionLineI({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Book fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;รายละเอียดการเดินทาง</Typography>
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
                <Box className={classes.displayflex}>
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
                <Box className={classes.displayflex}>
                    <FormatListNumbered fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;รายละเอียดเพิ่มเติม</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function SectionLineVIII({ classes, credit }) {
    return (
        <>
            <Box pt={0} pb={0} className={classes.displayflexHead}>
                <Box className={classes.displayflex}>
                    <MonetizationOnOutlined fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;วิธีการชำระเงิน</Typography>

                </Box>
                {/* <Box>
                    <Typography className={classes.font_subheader}><b>เครดิตสะสม : </b> {credit}</Typography>
                </Box> */}

            </Box>
            <PageLine />
        </>
    );
}

function SectionLineEX({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <AccountBalanceWallet fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;รายละเอียดการบริการ</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function Optional1({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Add fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;เพิ่มชั่วโมงการรอ (Taxi)</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function Optional2({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Add fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;เพิ่มชั่วโมงการรอ (CG)</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

const booking = {
    book_service: '',
    book_add_cg: false,
    book_hr_drop: 0,
    book_hr_add_tx: 1,
    book_hr_add_cg: 5,
    book_hr_tx_add_format: { gmm_num_id: '1' },
    book_hr_cg_add_format: { gmm_num_id: '5' },
    //---------------
    book_user: null,
    book_passenger: null,
    book_date: null,
    book_date_format: null,
    book_time: null,
    book_time_format: null,
    //--------------
    book_cg_checkpoint: '',
    book_cg_meet_point: null,
    book_cg_meet_point_format: null,
    //--------------
    book_tx_radio: '',
    book_cg_radio: '',
    book_tx_data: null,
    book_cg_data: null,
    //--------------
    book_follow: { gmm_num_id: '0' },
    book_equipment: { gmm_equipment_id: '1', gmm_equipment_name: 'ไม่มีอุปกรณ์' },
    book_desc: '',
    //--------------
    book_type_payment: 'PAY',
    book_coupon_discount: '',
    book_coupon_json: null,
}

const Locknum = {
    min: 0, max: 0,
}

const Locktime = {
    min: 0, max: 0,
}

export default function CustBooking() {
    const api_url = config.PATH_URL
    const url = config.API_URL + "models/Customer/Customer_booking.php";
    const state = useHistory();
    const classes = useStyles();
    const { vision } = useParams();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const [attachfile, setAttachfile] = useState({ name: '', base64: '', preview: '' });
    const [edit_name, setNameEdit] = useState({ uid: '', pid: '', name: '' });
    const [edit, setEdit] = useState(false);
    const [create, setCreate] = useState(false);
    const [promise, setPromise] = useState(false);
    const [Preview, setPreview] = useState(false);
    const [isLoading, setBoolean] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [hoverLeft, setLeftHover] = useState(false);
    const [hoverRight, setRightHover] = useState(false);
    const [couponStatus, setStatus] = useState(false);
    const [colorStatus, setAlertColor] = useState(false);
    const [openDiscount, setOpenDiscount] = useState(false)
    const [openCoupon, setOpenCoupon] = useState(false)
    const [openSetting, setSetting] = useState(false)
    const [Locknumber, setLock] = useState(Locknum);
    const [Locktimer, setTimeStep] = useState(Locktime);
    const [minstep, setMinStep] = useState(5);
    const [Totalprice, setPrice] = useState({
        summary: 0,
        dis_couponcode: 0,
        dis_promotion: 0,
        dis_member: 0,
        dis_package: 0,
        net: 0
    });
    const [CreditTotalprice, setCreditPrice] = useState({ net: null, calc: null });
    const [msgCount, setMsgCount] = useState(0);
    const [msgCountFavourite, setMsgCountFVR] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState('PAY');
    const [AssignType, setAssignType] = useState(null);
    const [AssignStep, setAssignStep] = useState(1);
    const [Listemp, setEmployee] = useState({ driver: [], cg: [], dutation: [], dutationCg: [] });
    const [ListFavTX, setListFavTX] = useState([]);
    const [ListFavCG, setListFavCG] = useState([]);
    const [AutoTX, setAutoTX] = useState([]);
    const [AutoCG, setAutoCG] = useState([]);
    const [Form, setForm] = useState(booking);
    const [Bookmarks, setBookmarks] = useState([]);
    const [item, setItem] = useState([]);
    const [numb, setNumb] = useState([]);
    const [umstr, setUser] = useState([]);
    const [pmstr, setPassenger] = useState([]);
    const [numbTx, setNumbTaxi] = useState([]);
    const [numbCG, setNumbCG] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [dataPayment, setDataPayment] = useState([]);
    const [FavouriteTrip, setFavouriteTrip] = useState([]);
    const [CopyFavouriteTrip, setCopyFavouriteTrip] = useState([]);
    const [Promotion, setPromotion] = useState([]);
    const [Member, setMember] = useState([]);
    const [Mycoupon, setMycoupon] = useState([]);
    const [usecouponTrip, setCouponTrip] = useState([])
    const [discountType, setDiscountType] = useState({
        discount_type: null,
        discount_amt: null,
        discount_pct: null,
        discount_promotion: null,
        discount_member: null,
        discount_package: null,
        discount_coupon_id: null,
        discount_coupon_code: null,
    });
    const [selectDiscount, setSelected] = useState({
        default: true,
        promotion: false,
        member: false,
        coupon: false,
        package: false,
    })
    const [maxnumbTx, setMaxnumbTx] = useState(0);
    const [minnumbTx, setMinnumbTx] = useState(0);
    const [maxnumbCg, setMaxnumbCg] = useState(0);
    const [minnumbCg, setMinnumbCg] = useState(0);

    const [switchInput, setSwitchInput] = useState(false)
    const [Location, setLocation] = useState('');
    const [ItemDiscount, setListDiscount] = useState([]);
    const [showIconTX, setIconTX] = useState(false);
    const [showIconCG, setIconCG] = useState(false);

    const [myCredit, setWallet] = useState(0);
    const [bagWallet, setBag] = useState(0);
    const [baln, setBaln] = useState(0);

    const steps = getSteps();

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, []);

    async function FirstLoad() {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_data",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setForm({ ...Form, book_hr_drop: res.data });
            setUser(res.user);
            setNumb(res.number);
            setEquipment(res.equipment);
            setMinStep(Number(res.time.gmm_time_stepper));
            setTimeStep({ ...Locktimer, min: res.time.gmm_time_open, max: res.time.gmm_time_close });
        }
    }

    async function ChangeService(type) {
        setBoolean(true)
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeService",
            id: type,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            (type === 'multiple') && setLock({ ...Locknumber, max: res.avg.max, min: res.avg.min });
            setMaxnumbTx(Number(res.maxnumbTx));
            setMinnumbTx(Number(res.minnumbTx));
            //----------------------------------
            setMaxnumbCg(Number(res.maxnumbCg));
            setMinnumbCg(Number(res.minnumbCg));
            //----------------------------------
            setNumbTaxi(res.number_hr_tx);
            setNumbCG(res.number_hr_cg);
            setForm({
                ...Form,
                book_hr_drop: res.data[0]['gmm_product_drop'],
                book_service: type,
                book_add_cg: false,
                book_hr_add_cg: 5,
                book_hr_add_tx: 1
            });
            setItem([]);
            setBoolean(false);
        }
    }

    async function FindServices() {
        setBoolean(true)
        //--------------------------------
        const payload = JSON.stringify({
            key: "FindService",
            item: Form,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();

        if (res.status) {
            if (res.data.point.length !== 0) {

                let message1 = res.data.gmm_product_message2.replace("<price>", res.data.gmm_product_price);
                let message2 = message1.replace("<hr>", res.data.gmm_product_tx_default_hour);

                if (Form.book_add_cg) {
                    res.data['reformat'] = message2;
                    res.data['extra_tx_hr'] = Number(Form.book_hr_add_tx) - Number(res.data.gmm_product_tx_default_hour);
                    res.data['extra_cg_hr'] = Number(Form.book_hr_add_cg) - Number(res.data.gmm_product_cg_default_hour);
                } else {
                    res.data['reformat'] = message2;
                    res.data['extra_tx_hr'] = Number(Form.book_hr_add_tx) - Number(res.data.gmm_product_tx_default_hour);
                    res.data['extra_cg_hr'] = 0
                }

                if (res.promotion.status === true && res.member.status === true) {
                    if (res.promotion.data.discount === res.member.data.discount) {
                        let summary_net_prc = Number(res.data.gmm_product_price) +
                            ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                            ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                        let summary_dis_prc = (Number(res.data['gmm_product_price']) - res.promotion.data.discount) +
                            ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                            ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                        setSelected({
                            ...selectDiscount,
                            default: false,
                            promotion: true,
                            member: false,
                            coupon: false,
                            package: false
                        })
                        setPrice({
                            ...Totalprice,
                            summary: summary_net_prc,
                            dis_promotion: res.promotion.data.discount,
                            dis_member: 0,
                            dis_couponcode: 0,
                            dis_package: 0,
                            net: summary_dis_prc,
                        })
                        setDiscountType({
                            ...discountType,
                            discount_type: 'PROMOTION',
                            discount_amt: (Number(res.promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(res.promotion.data.gmm_promotion_product_discount_bath),
                            discount_pct: (Number(res.promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(res.promotion.data.gmm_promotion_product_discount_percent),
                            discount_promotion: res.promotion.data.gmm_promotion_id,
                            discount_member: null,
                            discount_package: null,
                            discount_coupon_id: null,
                            discount_coupon_code: null,
                        })
                        setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                    } else {
                        if (res.promotion.data.discount > res.member.data.discount) {
                            let summary_net_prc = Number(res.data.gmm_product_price) +
                                ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                                ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                            let summary_dis_prc = (Number(res.data['gmm_product_price']) - res.promotion.data.discount) +
                                ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                                ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                            setSelected({
                                ...selectDiscount,
                                default: false,
                                promotion: true,
                                member: false,
                                coupon: false,
                                package: false
                            })
                            setPrice({
                                ...Totalprice,
                                summary: summary_net_prc,
                                dis_promotion: res.promotion.data.discount,
                                dis_member: 0,
                                dis_couponcode: 0,
                                dis_package: 0,
                                net: summary_dis_prc,
                            })
                            setDiscountType({
                                ...discountType,
                                discount_type: 'PROMOTION',
                                discount_amt: (Number(res.promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(res.promotion.data.gmm_promotion_product_discount_bath),
                                discount_pct: (Number(res.promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(res.promotion.data.gmm_promotion_product_discount_percent),
                                discount_promotion: res.promotion.data.gmm_promotion_id,
                                discount_member: null,
                                discount_package: null,
                                discount_coupon_id: null,
                                discount_coupon_code: null,
                            })
                            setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                        } else {
                            let summary_net_prc = Number(res.data.gmm_product_price) +
                                ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                                ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                            let summary_dis_prc = (Number(res.data['gmm_product_price']) - res.member.data.discount) +
                                ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                                ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                            setSelected({
                                ...selectDiscount,
                                default: false,
                                promotion: false,
                                member: true,
                                coupon: false,
                                package: false
                            })
                            setPrice({
                                ...Totalprice,
                                summary: summary_net_prc,
                                dis_promotion: 0,
                                dis_member: res.member.data.discount,
                                dis_couponcode: 0,
                                dis_package: 0,
                                net: summary_dis_prc,
                            })


                            setDiscountType({
                                ...discountType,
                                discount_type: 'MEMBER',
                                discount_amt: (Number(res.member.data.gmm_member_product_discount_bath) === 0) ? null : Number(res.member.data.gmm_member_product_discount_bath),
                                discount_pct: (Number(res.member.data.gmm_member_product_discount_percent) === 0) ? null : Number(res.member.data.gmm_member_product_discount_percent),
                                discount_promotion: null,
                                discount_member: res.member.data.gmm_user_member_nbr,
                                discount_package: null,
                                discount_coupon_id: null,
                                discount_coupon_code: null,
                            })
                            setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                        }
                    }
                } else if (res.promotion.status === true && res.member.status === false) {
                    let summary_net_prc = Number(res.data.gmm_product_price) +
                        ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                    let summary_dis_prc = (Number(res.data['gmm_product_price']) - res.promotion.data.discount) +
                        ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                    setSelected({
                        ...selectDiscount,
                        default: false,
                        promotion: true,
                        member: false,
                        coupon: false,
                        package: false
                    })
                    setPrice({
                        ...Totalprice,
                        summary: summary_net_prc,
                        dis_promotion: res.promotion.data.discount,
                        dis_member: 0,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })
                    setDiscountType({
                        ...discountType,
                        discount_type: 'PROMOTION',
                        discount_amt: (Number(res.promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(res.promotion.data.gmm_promotion_product_discount_bath),
                        discount_pct: (Number(res.promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(res.promotion.data.gmm_promotion_product_discount_percent),
                        discount_promotion: res.promotion.data.gmm_promotion_id,
                        discount_member: null,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })
                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                } else if (res.promotion.status === false && res.member.status === true) {
                    let summary_net_prc = Number(res.data.gmm_product_price) +
                        ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                    let summary_dis_prc = (Number(res.data['gmm_product_price']) - res.member.data.discount) +
                        ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                    setSelected({
                        ...selectDiscount,
                        default: false,
                        promotion: false,
                        member: true,
                        coupon: false,
                        package: false
                    })
                    setPrice({
                        ...Totalprice,
                        summary: summary_net_prc,
                        dis_promotion: 0,
                        dis_member: res.member.data.discount,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })
                    setDiscountType({
                        ...discountType,
                        discount_type: 'MEMBER',
                        discount_amt: (Number(res.member.data.gmm_member_product_discount_bath) === 0) ? null : Number(res.member.data.gmm_member_product_discount_bath),
                        discount_pct: (Number(res.member.data.gmm_member_product_discount_percent) === 0) ? null : Number(res.member.data.gmm_member_product_discount_percent),
                        discount_promotion: null,
                        discount_member: res.member.data.gmm_user_member_nbr,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })
                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                } else {
                    let summary_dis_prc = Number(res.data.gmm_product_price) +
                        ((Number(res.data['extra_tx_hr']) > 0) ? Number(res.data['extra_tx_hr']) * Number(res.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(res.data['extra_cg_hr']) > 0) ? Number(res.data['extra_cg_hr']) * Number(res.data.gmm_product_cg_price_hour) : 0)

                    setSelected({
                        ...selectDiscount,
                        default: true,
                        promotion: false,
                        member: false,
                        coupon: false,
                        package: false
                    })

                    setDiscountType({
                        ...discountType,
                        discount_type: null,
                        discount_amt: null,
                        discount_pct: null,
                        discount_promotion: null,
                        discount_member: null,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })

                    setPrice({
                        ...Totalprice,
                        summary: summary_dis_prc,
                        dis_promotion: 0,
                        dis_member: 0,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })

                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                }

                setItem(res.data);
                getPassenger('first');
                setMember(res.member)
                setPromotion(res.promotion)
                setActiveStep(activeStep + 1);
            } else {
                alert_message('ไม่พบบริการที่ค้นหา');
                setItem([]);
                setPromotion([]);
            }

            setBoolean(false);
            setAlertColor(false);
            setStatus(false);
            setMycoupon([]);
            setCouponTrip([]);
            setSelectedIndex('PAY')
        }
    }

    async function FindTaxi() {
        setBoolean(true);
        let route = [];

        item.point.forEach(element => {
            route.push(element.location.position)
        })

        const payload = JSON.stringify({
            key: "calculateTaxiCg",
            position: {
                latlng: item.point[0].location.position,
                aumphur: item.point[0].location.subAddress.aumphur,
                tumbol: item.point[0].location.subAddress.district,
                date: moment(Form.book_date).format('YYYY-MM-DD'),
                time: Form.book_time_format,
                cgtime: Form.book_cg_meet_point_format
                // Form.book_cg_meet_point_format
            },
            trip: {
                gmm_product_cg_radio: (Form.book_add_cg ? 'ON' : 'OFF'),
                taxiHr: Number(Form.book_hr_add_tx),
                cgHr: Number(Form.book_hr_add_cg),
                cgLocation: Number(Form.book_cg_checkpoint) - 1,
            },
            route: route,
            user: Form.book_user.gmm_user_id
        });

        const response = await fetch(api_url, { method: "POST", body: payload });
        await sleep(1000);
        const res = await response.json();

        if (res.status === true) {
            setAssignType('true')
            setEmployee({
                ...Listemp,
                driver: res.taxi,
                cg: (res.cg) ? res.cg : [],
                dutation: (res.dutation) ? res.dutation : [],
                dutationCg: (res.dutationCg) ? res.dutationCg : []
            })
            setActiveStep(2);
        } else if (res.status === false) {
            setAssignType('false')
            setEmployee({ ...Listemp, driver: [], cg: [], dutation: [] })
            setActiveStep(2);
        } else if (res.status === 'FAVORITE-TAXI-CG') {
            setAssignStep(1)
            setAssignType('FAVORITE-TAXI-CG')
            setEmployee({
                ...Listemp,
                driver: [],
                cg: [],
                dutation: (res.dutation) ? res.dutation : [],
                dutationCg: (res.dutationCg) ? res.dutationCg : [],
            })
            setListFavTX(res.taxiFavorite);
            setListFavCG(res.cgFavorite);
            setAutoTX(res.taxi);
            setAutoCG(res.cg);
            setActiveStep(2);
        } else if (res.status === 'FAVORITE-TAXI') {
            setAssignType('FAVORITE-TAXI')
            setEmployee({
                ...Listemp,
                driver: [],
                cg: res.cg,
                dutation: (res.dutation) ? res.dutation : [],
                dutationCg: (res.dutationCg) ? res.dutationCg : [],
            })
            setListFavTX(res.taxiFavorite);
            setAutoTX(res.taxi);
            setActiveStep(2);
        } else if (res.status === 'FAVORITE-CG') {
            setAssignType('FAVORITE-CG')
            setEmployee({
                ...Listemp,
                driver: res.taxi,
                cg: [],
                dutation: (res.dutation) ? res.dutation : [],
                dutationCg: (res.dutationCg) ? res.dutationCg : [],
            })
            setListFavCG(res.cgFavorite);
            setAutoCG(res.cg);
            setActiveStep(2);
        } else if (res.status === 'INVALID TIME24HR') {
            alert_message(res.message)
        } else if (res.status === 'INVALID Holiday') {
            alert_message(res.message)
        }

        // true = เจอคนขับ-เจอผู้ดูแล ไม่มี Favorite
        // false =ไม่เจอคนขับ-ผู้ดูแล
        // FAVORITE-TAXI-CG = เจอคนขับ + Favorite || เจอผู้ดูแล  + Favorite
        // FAVORITE-TAXI = เจอคนขับ + Favorite || เจอผู้ดูแล ไม่มี Favorite
        // FAVORITE-CG = เจอผู้ดูแล + Favorite  || เจอคนขับ ไม่มี Favorite


        setBoolean(false);
    }

    async function getFavourite(uid) {
        const payload = JSON.stringify({
            key: "getFavourite",
            uid: uid,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            setBookmarks(res.data)
            setOpenBooks(true)
        } else {
            setBookmarks([])
            setOpenBooks(true)
        }
    }

    async function getPassenger(session, desc) {

        const payload = JSON.stringify({
            key: "getPassenger",
            uid: Form.book_user.gmm_user_id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            if (session === 'first') {
                setForm({
                    ...Form,
                    book_passenger: null,
                    book_date: null,
                    book_date_format: null,
                    book_time: null,
                    book_time_format: null,
                    //--------------
                    book_cg_checkpoint: '',
                    book_cg_meet_point: null,
                    book_cg_meet_point_format: null,
                    //--------------
                    book_tx_radio: '',
                    book_cg_radio: '',
                    book_tx_data: null,
                    book_cg_data: null,
                    //--------------
                    book_follow: { gmm_num_id: '0' },
                    book_equipment: { gmm_equipment_id: '1', gmm_equipment_name: 'ไม่มีอุปกรณ์' },
                    book_desc: '',
                    //--------------
                    book_type_payment: 'PAY',
                    book_coupon_discount: '',
                    book_coupon_json: null,
                })

                setPassenger(res.passenger);
            } else if (session === 'sec') {
                setPassenger(res.passenger);
                for (let i = 0; i < res.passenger.length; i++) {
                    if (Form.book_passenger) {
                        if (Form.book_passenger.gmm_passenger_id === res.passenger[i].gmm_passenger_id) {
                            setForm({ ...Form, book_passenger: res.passenger[i] })
                        }
                    }
                }
            } else if (session === 'favTrip') {
                setPassenger(res.passenger);

                for (let i = 0; i < res.passenger.length; i++) {
                    if (desc.book_passenger.gmm_passenger_id === res.passenger[i].gmm_passenger_id) {
                        setForm({
                            ...Form,

                            book_service: desc.book_service,
                            book_add_cg: desc.book_add_cg,
                            book_hr_drop: desc.book_hr_drop,
                            book_hr_add_tx: desc.book_hr_add_tx,
                            book_hr_add_cg: desc.book_hr_add_cg,
                            book_hr_tx_add_format: desc.book_hr_tx_add_format,
                            book_hr_cg_add_format: desc.book_hr_cg_add_format,
                            //------------------------------------------------
                            book_passenger: res.passenger[i],
                            book_cg_checkpoint: desc.book_cg_checkpoint,
                            //------------------------------------------------
                            book_follow: desc.book_follow,
                            book_equipment: desc.book_equipment,
                            book_desc: desc.book_desc
                        })
                    }
                }
            }
        }
    }

    async function getFavouriteTrip(uid) {
        setBoolean(true);
        const payload = JSON.stringify({
            key: "favouriteTrip",
            uid: uid,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();

        if (res.status) {
            setFavouriteTrip(res.data)
            setCopyFavouriteTrip(res.data)
            setBoolean(false);
        } else {
            setCopyFavouriteTrip([])
            setFavouriteTrip([])
            setBoolean(false);
        }
    }

    async function SaveFavourite(Address, Desc) {
        setOpenFavourite(false);

        const payload = JSON.stringify({
            key: "Create_favourite",
            uid: Form.book_user.gmm_user_id,
            Address: Address,
            Form: Desc,
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            let newArr = [...item.point];
            newArr[IndexFavourite.index]['bookmark']['id'] = res.bookmark.id;
            newArr[IndexFavourite.index]['bookmark']['status'] = res.bookmark.status;
            newArr[IndexFavourite.index]['location']['favourite'] = res.favourite;
            newArr[IndexFavourite.index]['rmk'] = res.favourite.desc;
            (Hidd === 1) && (getFavourite(Form.book_user.gmm_user_id));
            setItem({ ...item, point: newArr })
            setFmFavourite({ ...FmFavourite, name: '', desc: '' })
        }
    }

    async function SaveAddFavourite(Address, Desc) {
        setOpenFavourite(false);
        setOpen(false);

        const payload = JSON.stringify({
            key: "Create_favourite",
            uid: Form.book_user.gmm_user_id,
            Address: Address,
            Form: Desc,
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            setDatainfo({ addr: '' })
            setSearchs('');
            setMarkers({ lat: null, lng: null });
            getFavourite(Form.book_user.gmm_user_id);
            setFmFavourite({ ...FmFavourite, name: '', desc: '' });
        }
    }

    async function SaveEditFavourite(Address, Desc) {
        setOpenFavourite(false);
        setOpen(false);

        const payload = JSON.stringify({
            key: "Update_favourite",
            uid: Form.book_user.gmm_user_id,
            Address: Address,
            Form: Desc,
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            let newArr = [...item.point];
            for (let i = 0; i < newArr.length; i++) {
                if (newArr[i]['bookmark']['id'] === Desc.id) {
                    newArr[i]['rmk'] = Desc.desc;
                    newArr[i]['location']['favourite']['name'] = Desc.name;
                }
            }

            setDatainfo({ addr: '' })
            setSearchs('');
            setMarkers({ lat: null, lng: null });
            getFavourite(Form.book_user.gmm_user_id);
            setFmFavourite({ ...FmFavourite, name: '', desc: '' });
        }
    }

    async function SaveTrip() {
        setBoolean(true)
        const payload = JSON.stringify({
            key: "confirmTrip",
            item: Form,
            package: item,
            total: Totalprice,
            useCoupon: colorStatus,
            Driver: Listemp,
            discountTypes: discountType,
            credit_point: myCredit,
            img: (CreditTotalprice.net !== 0) ? attachfile : null,
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(500);
        const res = await response.json();
        if (res.status) {
            if (res.payment_type) {
                if (res.data.payload.status.code === 1000) {
                    Swal.fire({
                        title: "เรียบร้อย",
                        text: "Download QR Code เพื่อชำระเงิน",
                        icon: "success",
                    }).then(() => {
                        setBoolean(false);
                        setDataPayment(res.data.payload)
                        setActiveStep(activeStep + 1)
                    })
                } else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "กรุณาชำระค่าบริการในหน้ารายการจอง",
                        icon: "warning",
                    }).then(() => {
                        setBoolean(false);
                        state.push('/Home/BookingDetail/' + vision + '/' + res.data.params.ref1);
                    })
                }
            } else {
                Swal.fire({
                    title: "เรียบร้อย",
                    text: "บันทึกการจองสำเร็จ",
                    icon: "success",
                }).then(() => {
                    setBoolean(false);
                    setDataPayment([])
                    setActiveStep(activeStep + 1)
                })
            }
        } else {
            alert_message('ไม่สามารถชำระค่าบริการ กรุณาทำรายการใหม่อีกครั้ง')
            setBoolean(false)
        }
    }

    async function DeleteFavourite(uid, fid) {
        setBoolean(true)
        //-------------------------------
        const payload = JSON.stringify({
            key: "Delete_favourite",
            uid: uid,
            fid: fid,
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            let newArr = [...item.point];
            for (let i = 0; i < newArr.length; i++) {
                if (newArr[i]['bookmark']['id'] === fid) {
                    newArr[i]['bookmark']['id'] = null;
                    newArr[i]['bookmark']['status'] = false;
                    newArr[i]['location']['favourite'] = null;
                    newArr[i]['edit'] = true;
                }
            }

            setItem({ ...item, point: newArr })
            setBoolean(false);
        }
    }

    async function DeleteFavouriteBooks(uid, fid) {
        const payload = JSON.stringify({
            key: "Delete_favourite",
            uid: uid,
            fid: fid,
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            let newArr = [...item.point];
            for (let i = 0; i < newArr.length; i++) {
                if (newArr[i]['bookmark']['id'] === fid) {
                    newArr[i]['bookmark']['id'] = null;
                    newArr[i]['bookmark']['status'] = false;
                    newArr[i]['location']['favourite'] = null;
                    newArr[i]['edit'] = true;
                }
            }

            getFavourite(uid);
        }
    }

    async function checkCoupon() {
        const payload = JSON.stringify({
            key: "checkCouponCode",
            code: Form.book_coupon_discount,
            product: item.gmm_product_id,
            uid: Form.book_user.gmm_user_id,
            pid: Form.book_passenger.gmm_passenger_id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();

        if (res.status) {
            let calculate = Math.round((Number(res.data.gmm_coupon_discount_bath) !== 0) ?
                Number(Totalprice.summary) - Number(res.data.gmm_coupon_discount_bath) :
                Number(Totalprice.summary) - ((Number(Totalprice.summary) * Number(res.data.gmm_coupon_discount_percent)) / 100))

            setForm({ ...Form, book_coupon_json: res.data })
            setPrice({
                ...Totalprice,
                dis_couponcode: (Number(res.data.gmm_coupon_discount_bath) !== 0) ?
                    Number(res.data.gmm_coupon_discount_bath) :
                    Number(res.data.gmm_coupon_discount_percent),
                dis_promotion: 0,
                dis_member: 0,
                dis_package: 0,
                net: calculate
            })

            setSelected({
                ...selectDiscount,
                default: false,
                promotion: false,
                member: false,
                coupon: true,
                package: false
            })
            setDiscountType({
                ...discountType,
                discount_type: 'COUPON',
                discount_amt: (Number(res.data.gmm_coupon_discount_bath) === 0) ? null : Number(res.data.gmm_coupon_discount_bath),
                discount_pct: (Number(res.data.gmm_coupon_discount_percent) === 0) ? null : Number(res.data.gmm_coupon_discount_percent),
                discount_promotion: null,
                discount_member: null,
                discount_package: null,
                discount_coupon_id: res.data.gmm_coupon_id,
                discount_coupon_code: res.data.gmm_coupon_code,
            })
            setCreditPrice({ ...CreditTotalprice, net: Number(calculate), calc: Number(calculate) })
            setAlertColor(true);
            setMycoupon([]);
            setCouponTrip([]);

        } else {
            setForm({ ...Form, book_coupon_json: res.data })
            setAlertColor(false);
            setMycoupon([]);
            setCouponTrip([]);

        }

        setWallet(0)
        setBag(Form.book_user.gmm_user_credit)
        setBaln(Form.book_user.gmm_user_credit)
        setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })
        if (Form.book_type_payment === 'CREDIT') {
            document.getElementById("InputFile").value = "";
        }
        setStatus(true);
    }

    async function searchCoupon() {
        const payload = JSON.stringify({
            key: "searchCoupon",
            uid: Form.book_user.gmm_user_id,
            product: item.gmm_product_id,
        });


        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();

        if (res.status) {
            let obj = [];
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].tr_package_addr === item.gmm_product_id) {
                    obj.push(res.data[0]);
                    break;
                }
            }

            if (obj.length !== 0) {
                let diff = Number(obj[0].discamt) - Number(item.gmm_product_price);

                let summary_net_prc = Number(item['gmm_product_price']) +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                let summary_dis_prc = diff +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                setSelected({
                    ...selectDiscount,
                    default: false,
                    promotion: false,
                    member: false,
                    coupon: false,
                    package: true
                })


                setPrice({
                    ...Totalprice,
                    summary: summary_net_prc,
                    dis_couponcode: 0,
                    dis_promotion: 0,
                    dis_member: 0,
                    dis_package: Number(obj[0].discamt),
                    net: summary_dis_prc,
                })

                setDiscountType({
                    ...discountType,
                    discount_type: 'PACKAGE',
                    discount_amt: Number(obj[0].discamt),
                    discount_pct: null,
                    discount_promotion: null,
                    discount_member: null,
                    discount_package: obj[0],
                    discount_coupon_id: null,
                    discount_coupon_code: null,
                })

            } else {
                autoselect_discount();
            }

            setCouponTrip((obj.length !== 0) ? obj[0] : []);
            setMycoupon(res.data);
        } else {
            autoselect_discount();
        }
    }

    async function favtrip_active(id, nbr, status) {
        const payload = JSON.stringify({
            key: "favtrip_active",
            uid: id,
            nbr: nbr,
            status: status
        });


        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();

        if (res.status) {
            setFavouriteTrip(res.data)
        }
    }

    async function deletefavourite(id, nbr) {
        const payload = JSON.stringify({
            key: "deletefavourite",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            user: id,
            favour_nbr: nbr,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            setFavouriteTrip(res.data)
        } else {
            setSetting(false);
            setFavouriteTrip([])
            setCopyFavouriteTrip([])
        }
    }

    async function Editfavourite(id, nbr, name) {
        const payload = JSON.stringify({
            key: "Editfavourite",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            name: name,
            user: id,
            favour_nbr: nbr,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(50);
        const res = await response.json();
        if (res.status) {
            setFavouriteTrip(res.data)
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const FindService = (event) => {
        event.preventDefault();
        if (hoverLeft || hoverRight) {
            FindServices();
        } else {
            alert_message('กรุณาเลือกบริการ')
        }
    }

    const handleConfirmTrip = () => {
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
                SaveTrip()
            }
        })
    }

    const handleService = (value) => {
        if (value === 'single') {
            setLeftHover(true);
            setRightHover(false);
            ChangeService('single')
        }

        if (value === 'multiple') {
            setLeftHover(false);
            setRightHover(true);
            ChangeService('multiple')
        }
    };

    const handleaddOnCG = () => {
        setForm({ ...Form, book_add_cg: !Form.book_add_cg, book_hr_add_cg: 5, book_hr_cg_add_format: { gmm_num_id: '5' } })
    }

    const handleBookingTime = (item) => {
        const minTime = moment(Locktimer.min, "HH:mm");
        const maxTime = moment(Locktimer.max, "HH:mm");
        if (minTime.isBefore(item) && maxTime.isAfter(item)) {
            let raw_time = item.toLocaleTimeString("th", options);
            let split_time = raw_time.split(':');
            let times = split_time[0] + ':' + split_time[1]


            setForm({ ...Form, book_time: item, book_time_format: times })
        } else {
            alert_message('ขออภัยกรุณาจองบริการในเวลาทำการ 05:00 น. ถึง 20:00 น.')
        }
    }

    const handleBookingDate = (item) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const convert_date = item.toLocaleDateString("th", options);
        //--------------------------------
        setForm({ ...Form, book_date: item, book_date_format: convert_date });
    }

    const handleUser = (e, data) => {
        if (data) {
            setForm({
                ...Form,
                book_user: data,
                book_hr_add_cg: 5,
                book_hr_add_tx: 1,
            })

            getFavouriteTrip(data.gmm_user_id);
            setWallet(0)
            setBag(data.gmm_user_credit)
            setBaln(data.gmm_user_credit)
        } else {
            setForm({ ...Form, book_user: null })
            setFavouriteTrip([])

        }

    }

    const handlePassenger = (e, data) => {
        if (data) {
            let newArr = [...item.point];
            for (let i = 0; i < newArr.length; i++) {
                newArr[i]['bookmark']['id'] = null;
                newArr[i]['bookmark']['status'] = false;
                newArr[i]['location'] = null;
                newArr[i]['edit'] = true;
                newArr[i]['rmk'] = "";
            }

            setNameEdit({ uid: Form.book_user.gmm_user_id, pid: data.gmm_passenger_id, name: data.gmm_passenger_fullname })
            setForm({ ...Form, book_passenger: data })
            setItem({ ...item, point: newArr })
        }
    }


    //EDIT
    const handleChangeRemark = (e, index) => {
        let newArr = [...item.point];

        if (selectPosition !== null) {
            if (newArr.length > 2 && selectIndex === 0) {
                if (index === 0 || (index === (newArr.length - 1))) {
                    newArr[(newArr.length - 1)]['rmk'] = e.target.value;
                    newArr[0]['rmk'] = e.target.value;
                } else {
                    newArr[index]['rmk'] = e.target.value;
                }
            } else {
                if (newArr.length > 2) {
                    if (index === 0 || (index === (newArr.length - 1))) {
                        if (newArr[(newArr.length - 1)]['location']['address'] === newArr[0]['location']['address']) {
                            newArr[(newArr.length - 1)]['rmk'] = e.target.value;
                            newArr[0]['rmk'] = e.target.value;
                        } else {
                            newArr[index]['rmk'] = e.target.value;
                        }
                    } else {
                        newArr[index]['rmk'] = e.target.value;
                    }
                } else {
                    newArr[index]['rmk'] = e.target.value;
                }

            }

        } else {
            newArr[index]['rmk'] = e.target.value;
        }

        setItem({ ...item, point: newArr })
    }

    const handleEditRemark = (e, index) => {
        let newArr = [...item.point];
        newArr[index]['edit'] = !newArr[index]['edit'];
        setItem({ ...item, point: newArr })
    }

    const handleCGCheckpoint = (item) => {
        setForm({ ...Form, book_cg_checkpoint: item });
    }

    const handlePaymenttype = (type) => {
        setForm({ ...Form, book_type_payment: type, book_coupon_discount: '', book_coupon_json: null });
        setSelectedIndex(type)

        if (type === 'COUPON') { // coupon trip
            setWallet(0)
            setBag(Form.book_user.gmm_user_credit);
            setBaln(Form.book_user.gmm_user_credit);
            setStatus(false);
            setAlertColor(false);
            searchCoupon();
            setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })
        } else if (type === 'PAY') {
            setWallet(0)
            setBag(Form.book_user.gmm_user_credit);
            setBaln(Form.book_user.gmm_user_credit);
            autoselect_discount();
            setStatus(false);
            setAlertColor(false);
            setMycoupon([]);
            setCouponTrip([]);
            setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })
        } else if (type === 'CREDIT') {
            setStatus(false);
            setAlertColor(false);
            setMycoupon([]);
            setCouponTrip([]);
        }
    }

    const autoselect_discount = () => {
        if (Promotion.status === true && Member.status === true) {
            if (Promotion.data.discount === Member.data.discount) {
                let summary_net_prc = Number(item['gmm_product_price']) +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                setSelected({
                    ...selectDiscount,
                    default: false,
                    promotion: true,
                    member: false,
                    coupon: false,
                    package: false
                })
                setPrice({
                    ...Totalprice,
                    summary: summary_net_prc,
                    dis_promotion: Promotion.data.discount,
                    dis_member: 0,
                    dis_couponcode: 0,
                    dis_package: 0,
                    net: summary_dis_prc,
                })
                setDiscountType({
                    ...discountType,
                    discount_type: 'PROMOTION',
                    discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                    discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                    discount_promotion: Promotion.data.gmm_promotion_id,
                    discount_member: null,
                    discount_package: null,
                    discount_coupon_id: null,
                    discount_coupon_code: null,
                })
                setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
            } else {
                if (Promotion.data.discount > Member.data.discount) {
                    let summary_net_prc = Number(item['gmm_product_price']) +
                        ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                        ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                    let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                        ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                        ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                    setSelected({
                        ...selectDiscount,
                        default: false,
                        promotion: true,
                        member: false,
                        coupon: false,
                        package: false
                    })
                    setPrice({
                        ...Totalprice,
                        summary: summary_net_prc,
                        dis_promotion: Promotion.data.discount,
                        dis_member: 0,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })
                    setDiscountType({
                        ...discountType,
                        discount_type: 'PROMOTION',
                        discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                        discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                        discount_promotion: Promotion.data.gmm_promotion_id,
                        discount_member: null,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })
                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                } else {
                    let summary_net_prc = Number(item['gmm_product_price']) +
                        ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                        ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                    let summary_dis_prc = (Number(item['gmm_product_price']) - Member.data.discount) +
                        ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                        ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                    setSelected({
                        ...selectDiscount,
                        default: false,
                        promotion: false,
                        member: true,
                        coupon: false,
                        package: false
                    })
                    setPrice({
                        ...Totalprice,
                        summary: summary_net_prc,
                        dis_promotion: 0,
                        dis_member: Member.data.discount,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })
                    setDiscountType({
                        ...discountType,
                        discount_type: 'MEMBER',
                        discount_amt: (Number(Member.data.gmm_member_product_discount_bath) === 0) ? null : Number(Member.data.gmm_member_product_discount_bath),
                        discount_pct: (Number(Member.data.gmm_member_product_discount_percent) === 0) ? null : Number(Member.data.gmm_member_product_discount_percent),
                        discount_promotion: null,
                        discount_member: Member.data.gmm_user_member_nbr,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })
                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                }
            }
        } else if (Promotion.status === true && Member.status === false) {
            let summary_net_prc = Number(item['gmm_product_price']) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            setSelected({
                ...selectDiscount,
                default: false,
                promotion: true,
                member: false,
                coupon: false,
                package: false
            })
            setPrice({
                ...Totalprice,
                summary: summary_net_prc,
                dis_promotion: Promotion.data.discount,
                dis_member: 0,
                dis_couponcode: 0,
                dis_package: 0,
                net: summary_dis_prc,
            })
            setDiscountType({
                ...discountType,
                discount_type: 'PROMOTION',
                discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                discount_promotion: Promotion.data.gmm_promotion_id,
                discount_member: null,
                discount_package: null,
                discount_coupon_id: null,
                discount_coupon_code: null,
            })
            setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
        } else if (Promotion.status === false && Member.status === true) {
            let summary_net_prc = Number(item['gmm_product_price']) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            let summary_dis_prc = (Number(item['gmm_product_price']) - Member.data.discount) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            setSelected({
                ...selectDiscount,
                default: false,
                promotion: false,
                member: true,
                coupon: false,
                package: false
            })
            setPrice({
                ...Totalprice,
                summary: summary_net_prc,
                dis_promotion: 0,
                dis_member: Member.data.discount,
                dis_couponcode: 0,
                dis_package: 0,
                net: summary_dis_prc,

            })
            setDiscountType({
                ...discountType,
                discount_type: 'MEMBER',
                discount_amt: (Number(Member.data.gmm_member_product_discount_bath) === 0) ? null : Number(Member.data.gmm_member_product_discount_bath),
                discount_pct: (Number(Member.data.gmm_member_product_discount_percent) === 0) ? null : Number(Member.data.gmm_member_product_discount_percent),
                discount_promotion: null,
                discount_member: Member.data.gmm_user_member_nbr,
                discount_package: null,
                discount_coupon_id: null,
                discount_coupon_code: null,
            })
            setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
        } else {
            let summary_dis_prc = Number(item['gmm_product_price']) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            setSelected({
                ...selectDiscount,
                default: true,
                promotion: false,
                member: false,
                coupon: false,
                package: false
            })
            setPrice({
                ...Totalprice,
                summary: summary_dis_prc,
                dis_promotion: 0,
                dis_member: 0,
                dis_couponcode: 0,
                dis_package: 0,
                net: summary_dis_prc,
            })
            setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
        }
    }

    const handleDownload_QRCode = (inv) => {
        var canvas = document.getElementById("canvas");
        var url = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = inv;
        link.href = url;
        link.click();
    }
    //add hr 

    const handleIncrease_hrcg = () => {
        if (Form.book_hr_add_cg !== Number(maxnumbCg)) {
            let sum = (Number(Form.book_hr_add_cg) + 1)
            let num = sum.toString();
            setForm({ ...Form, book_hr_add_cg: Number(Form.book_hr_add_cg) + 1, book_hr_cg_add_format: { gmm_num_id: num } })
        }
    }

    const handleDecrease_hrcg = () => {
        if (Form.book_hr_add_cg !== Number(minnumbCg)) {
            let sum = (Number(Form.book_hr_add_cg) - 1)
            let num = sum.toString();
            setForm({ ...Form, book_hr_add_cg: Number(Form.book_hr_add_cg) - 1, book_hr_cg_add_format: { gmm_num_id: num } })
        }
    }

    const handleIncrease_hrtx = () => {
        if (Form.book_hr_add_tx !== Number(maxnumbTx)) {
            let sum = (Number(Form.book_hr_add_tx) + 1)
            let num = sum.toString();
            setForm({ ...Form, book_hr_add_tx: Number(Form.book_hr_add_tx) + 1, book_hr_tx_add_format: { gmm_num_id: num } })
        }
    }

    const handleDecrease_hrtx = () => {
        if (Form.book_hr_add_tx !== Number(minnumbTx)) {
            let sum = (Number(Form.book_hr_add_tx) - 1)
            let num = sum.toString();
            setForm({ ...Form, book_hr_add_tx: Number(Form.book_hr_add_tx) - 1, book_hr_tx_add_format: { gmm_num_id: num } })
        }
    }

    const handleIncrease_hrdrop = () => {
        if (Number(Form.book_hr_drop) !== Number(Locknumber.max)) {
            setForm({ ...Form, book_hr_drop: Number(Form.book_hr_drop) + 1 });
        }
    }

    const handleDecrease_hrdrop = () => {
        if (Number(Form.book_hr_drop) !== Number(Locknumber.min)) {
            setForm({ ...Form, book_hr_drop: Number(Form.book_hr_drop) - 1 })
        }
    }

    const handleChangeHrTaxi = (e, obj) => {
        if (obj) {


            if (Promotion.status === true && Member.status === true) {

                if (Promotion.data.discount === Member.data.discount) {

                    let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_tx_default_hour']);
                    let summary_net_prc = Number(item['gmm_product_price']) +
                        ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                        ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                    let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                        ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                        ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)


                    item['extra_tx_hr'] = addExtra;
                    setForm({
                        ...Form,
                        book_hr_add_tx: Number(obj.gmm_num_id),
                        book_hr_tx_add_format: obj,
                        book_type_payment: 'PAY',
                        book_coupon_discount: '',
                        book_coupon_json: null
                    })
                    setSelected({
                        ...selectDiscount,
                        default: false,
                        promotion: true,
                        member: false,
                        coupon: false,
                        package: false
                    })
                    setPrice({
                        ...Totalprice,
                        summary: summary_net_prc,
                        dis_promotion: Promotion.data.discount,
                        dis_member: 0,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })
                    setDiscountType({
                        ...discountType,
                        discount_type: 'PROMOTION',
                        discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                        discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                        discount_promotion: Promotion.data.gmm_promotion_id,
                        discount_member: null,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })

                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                } else {
                    if (Promotion.data.discount > Member.data.discount) {
                        let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_tx_default_hour']);
                        let summary_net_prc = Number(item['gmm_product_price']) +
                            ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                            ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                        let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                            ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                            ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)


                        item['extra_tx_hr'] = addExtra;

                        setForm({
                            ...Form,
                            book_hr_add_tx: Number(obj.gmm_num_id),
                            book_hr_tx_add_format: obj,
                            book_type_payment: 'PAY',
                            book_coupon_discount: '',
                            book_coupon_json: null
                        })
                        setSelected({
                            ...selectDiscount,
                            default: false,
                            promotion: true,
                            member: false,
                            coupon: false,
                            package: false
                        })
                        setPrice({
                            ...Totalprice,
                            summary: summary_net_prc,
                            dis_promotion: Promotion.data.discount,
                            dis_member: 0,
                            dis_couponcode: 0,
                            dis_package: 0,
                            net: summary_dis_prc,
                        })
                        setDiscountType({
                            ...discountType,
                            discount_type: 'PROMOTION',
                            discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                            discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                            discount_promotion: Promotion.data.gmm_promotion_id,
                            discount_member: null,
                            discount_package: null,
                            discount_coupon_id: null,
                            discount_coupon_code: null,
                        })
                        setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                    } else {
                        let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_tx_default_hour']);
                        let summary_net_prc = Number(item['gmm_product_price']) +
                            ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                            ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                        let summary_dis_prc = (Number(item['gmm_product_price']) - Member.data.discount) +
                            ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                            ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)


                        item['extra_tx_hr'] = addExtra;

                        setForm({
                            ...Form,
                            book_hr_add_tx: Number(obj.gmm_num_id),
                            book_hr_tx_add_format: obj,
                            book_type_payment: 'PAY',
                            book_coupon_discount: '',
                            book_coupon_json: null
                        })
                        setSelected({
                            ...selectDiscount,
                            default: false,
                            promotion: false,
                            member: true,
                            coupon: false,
                            package: false
                        })
                        setPrice({
                            ...Totalprice,
                            summary: summary_net_prc,
                            dis_promotion: 0,
                            dis_member: Member.data.discount,
                            dis_couponcode: 0,
                            dis_package: 0,
                            net: summary_dis_prc,
                        })
                        setDiscountType({
                            ...discountType,
                            discount_type: 'MEMBER',
                            discount_amt: (Number(Member.data.gmm_member_product_discount_bath) === 0) ? null : Number(Member.data.gmm_member_product_discount_bath),
                            discount_pct: (Number(Member.data.gmm_member_product_discount_percent) === 0) ? null : Number(Member.data.gmm_member_product_discount_percent),
                            discount_promotion: null,
                            discount_member: Member.data.gmm_user_member_nbr,
                            discount_package: null,
                            discount_coupon_id: null,
                            discount_coupon_code: null,
                        })
                        setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                    }
                }
            } else if (Promotion.status === true && Member.status === false) {

                let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_tx_default_hour']);
                let summary_net_prc = Number(item['gmm_product_price']) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)


                item['extra_tx_hr'] = addExtra;

                setForm({
                    ...Form,
                    book_hr_add_tx: Number(obj.gmm_num_id),
                    book_hr_tx_add_format: obj,
                    book_type_payment: 'PAY',
                    book_coupon_discount: '',
                    book_coupon_json: null
                })
                setSelected({
                    ...selectDiscount,
                    default: false,
                    promotion: true,
                    member: false,
                    coupon: false,
                    package: false
                })
                setPrice({
                    ...Totalprice,
                    summary: summary_net_prc,
                    dis_promotion: Promotion.data.discount,
                    dis_member: 0,
                    dis_couponcode: 0,
                    dis_package: 0,
                    net: summary_dis_prc,
                })
                setDiscountType({
                    ...discountType,
                    discount_type: 'PROMOTION',
                    discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                    discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                    discount_promotion: Promotion.data.gmm_promotion_id,
                    discount_member: null,
                    discount_package: null,
                    discount_coupon_id: null,
                    discount_coupon_code: null,
                })
                setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
            } else if (Promotion.status === false && Member.status === true) {
                let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_tx_default_hour']);
                let summary_net_prc = Number(item['gmm_product_price']) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

                let summary_dis_prc = (Number(item['gmm_product_price']) - Member.data.discount) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)


                item['extra_tx_hr'] = addExtra;

                setForm({
                    ...Form,
                    book_hr_add_tx: Number(obj.gmm_num_id),
                    book_hr_tx_add_format: obj,
                    book_type_payment: 'PAY',
                    book_coupon_discount: '',
                    book_coupon_json: null
                })
                setSelected({
                    ...selectDiscount,
                    default: false,
                    promotion: false,
                    member: true,
                    coupon: false,
                    package: false
                })
                setPrice({
                    ...Totalprice,
                    summary: summary_net_prc,
                    dis_promotion: 0,
                    dis_member: Member.data.discount,
                    dis_couponcode: 0,
                    dis_package: 0,
                    net: summary_dis_prc,
                })
                setDiscountType({
                    ...discountType,
                    discount_type: 'MEMBER',
                    discount_amt: (Number(Member.data.gmm_member_product_discount_bath) === 0) ? null : Number(Member.data.gmm_member_product_discount_bath),
                    discount_pct: (Number(Member.data.gmm_member_product_discount_percent) === 0) ? null : Number(Member.data.gmm_member_product_discount_percent),
                    discount_promotion: null,
                    discount_member: Member.data.gmm_user_member_nbr,
                    discount_package: null,
                    discount_coupon_id: null,
                    discount_coupon_code: null,
                })
                setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
            } else {
                let addExtra = Number(obj.gmm_num_id) - Number(item.gmm_product_tx_default_hour);

                let summary_dis_prc = Number(item['gmm_product_price']) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0);

                item['extra_tx_hr'] = addExtra;
                setForm({
                    ...Form,
                    book_hr_add_tx: Number(obj.gmm_num_id),
                    book_hr_tx_add_format: obj,
                    book_type_payment: 'PAY',
                    book_coupon_discount: '',
                    book_coupon_json: null
                })
                setSelected({
                    ...selectDiscount,
                    default: true,
                    promotion: false,
                    member: false,
                    coupon: false,
                    package: false
                })
                setPrice({
                    ...Totalprice,
                    summary: summary_dis_prc,
                    dis_promotion: 0,
                    dis_member: 0,
                    dis_couponcode: 0,
                    dis_package: 0,
                    net: summary_dis_prc
                })

                setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
            }

            setWallet(0)
            setBag(Form.book_user.gmm_user_credit);
            setBaln(Form.book_user.gmm_user_credit);
            setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })
            setSelectedIndex('PAY')
            setMycoupon([]);
            setCouponTrip([]);
            setAlertColor(false);
            setStatus(false)
        }
    }

    const handleChangeHrCG = (e, obj) => {
        if (obj) {
            if (Promotion.status === true && Member.status === true) {
                if (Promotion.data.discount === Member.data.discount) {
                    let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_cg_default_hour']);
                    let summary_net_prc = Number(item['gmm_product_price']) +
                        ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                        ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)

                    let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                        ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                        ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)


                    item['extra_cg_hr'] = addExtra;
                    setForm({
                        ...Form,
                        book_hr_add_cg: Number(obj.gmm_num_id),
                        book_hr_cg_add_format: obj,
                        book_type_payment: 'PAY',
                        book_coupon_discount: '',
                        book_coupon_json: null
                    })
                    setSelected({
                        ...selectDiscount,
                        default: false,
                        promotion: true,
                        member: false,
                        coupon: false,
                        package: false
                    })
                    setPrice({
                        ...Totalprice,
                        summary: summary_net_prc,
                        dis_promotion: Promotion.data.discount,
                        dis_member: 0,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })
                    setDiscountType({
                        ...discountType,
                        discount_type: 'PROMOTION',
                        discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                        discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                        discount_promotion: Promotion.data.gmm_promotion_id,
                        discount_member: null,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })
                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                } else {
                    if (Promotion.data.discount > Member.data.discount) {
                        let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_cg_default_hour']);
                        let summary_net_prc = Number(item['gmm_product_price']) +
                            ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                            ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)

                        let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                            ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                            ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)


                        item['extra_cg_hr'] = addExtra;
                        setForm({
                            ...Form,
                            book_hr_add_cg: Number(obj.gmm_num_id),
                            book_hr_cg_add_format: obj,
                            book_type_payment: 'PAY',
                            book_coupon_discount: '',
                            book_coupon_json: null
                        })
                        setSelected({
                            ...selectDiscount,
                            default: false,
                            promotion: true,
                            member: false,
                            coupon: false,
                            package: false
                        })
                        setPrice({
                            ...Totalprice,
                            summary: summary_net_prc,
                            dis_promotion: Promotion.data.discount,
                            dis_member: 0,
                            dis_couponcode: 0,
                            dis_package: 0,
                            net: summary_dis_prc,
                        })
                        setDiscountType({
                            ...discountType,
                            discount_type: 'PROMOTION',
                            discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                            discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                            discount_promotion: Promotion.data.gmm_promotion_id,
                            discount_member: null,
                            discount_package: null,
                            discount_coupon_id: null,
                            discount_coupon_code: null,
                        })
                        setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                    } else {
                        let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_cg_default_hour']);
                        let summary_net_prc = Number(item['gmm_product_price']) +
                            ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                            ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)

                        let summary_dis_prc = (Number(item['gmm_product_price']) - Member.data.discount) +
                            ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                            ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)


                        item['extra_cg_hr'] = addExtra;
                        setForm({
                            ...Form,
                            book_hr_add_cg: Number(obj.gmm_num_id),
                            book_hr_cg_add_format: obj,
                            book_type_payment: 'PAY',
                            book_coupon_discount: '',
                            book_coupon_json: null
                        })
                        setSelected({
                            ...selectDiscount,
                            default: false,
                            promotion: false,
                            member: true,
                            coupon: false,
                            package: false
                        })
                        setPrice({
                            ...Totalprice,
                            summary: summary_net_prc,
                            dis_promotion: 0,
                            dis_member: Member.data.discount,
                            dis_couponcode: 0,
                            dis_package: 0,
                            net: summary_dis_prc,
                        })
                        setDiscountType({
                            ...discountType,
                            discount_type: 'MEMBER',
                            discount_amt: (Number(Member.data.gmm_member_product_discount_bath) === 0) ? null : Number(Member.data.gmm_member_product_discount_bath),
                            discount_pct: (Number(Member.data.gmm_member_product_discount_percent) === 0) ? null : Number(Member.data.gmm_member_product_discount_percent),
                            discount_promotion: null,
                            discount_member: Member.data.gmm_user_member_nbr,
                            discount_package: null,
                            discount_coupon_id: null,
                            discount_coupon_code: null,
                        })
                        setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                    }
                }
            } else if (Promotion.status === true && Member.status === false) {
                let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_cg_default_hour']);
                let summary_net_prc = Number(item['gmm_product_price']) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)

                let summary_dis_prc = (Number(item['gmm_product_price']) - Promotion.data.discount) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)


                item['extra_cg_hr'] = addExtra;
                setForm({
                    ...Form,
                    book_hr_add_cg: Number(obj.gmm_num_id),
                    book_hr_cg_add_format: obj,
                    book_type_payment: 'PAY',
                    book_coupon_discount: '',
                    book_coupon_json: null
                })
                setSelected({
                    ...selectDiscount,
                    default: false,
                    promotion: true,
                    member: false,
                    coupon: false,
                    package: false
                })
                setPrice({
                    ...Totalprice,
                    summary: summary_net_prc,
                    dis_promotion: Promotion.data.discount,
                    dis_member: 0,
                    dis_couponcode: 0,
                    dis_package: 0,
                    net: summary_dis_prc,
                })
                setDiscountType({
                    ...discountType,
                    discount_type: 'PROMOTION',
                    discount_amt: (Number(Promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_bath),
                    discount_pct: (Number(Promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(Promotion.data.gmm_promotion_product_discount_percent),
                    discount_promotion: Promotion.data.gmm_promotion_id,
                    discount_member: null,
                    discount_package: null,
                    discount_coupon_id: null,
                    discount_coupon_code: null,
                })
                setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
            } else if (Promotion.status === false && Member.status === true) {
                let addExtra = Number(obj.gmm_num_id) - Number(item['gmm_product_cg_default_hour']);
                let summary_net_prc = Number(item['gmm_product_price']) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)

                let summary_dis_prc = (Number(item['gmm_product_price']) - Member.data.discount) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_tx_price_hour']) : 0) +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0)


                item['extra_cg_hr'] = addExtra;
                setForm({
                    ...Form,
                    book_hr_add_cg: Number(obj.gmm_num_id),
                    book_hr_cg_add_format: obj,
                    book_type_payment: 'PAY',
                    book_coupon_discount: '',
                    book_coupon_json: null
                })
                setSelected({
                    ...selectDiscount,
                    default: false,
                    promotion: false,
                    member: true,
                    coupon: false,
                    package: false
                })
                setPrice({
                    ...Totalprice,
                    summary: summary_net_prc,
                    dis_promotion: 0,
                    dis_member: Member.data.discount,
                    dis_couponcode: 0,
                    dis_package: 0,
                    net: summary_dis_prc,
                })
                setDiscountType({
                    ...discountType,
                    discount_type: 'MEMBER',
                    discount_amt: (Number(Member.data.gmm_member_product_discount_bath) === 0) ? null : Number(Member.data.gmm_member_product_discount_bath),
                    discount_pct: (Number(Member.data.gmm_member_product_discount_percent) === 0) ? null : Number(Member.data.gmm_member_product_discount_percent),
                    discount_promotion: null,
                    discount_member: Member.data.gmm_user_member_nbr,
                    discount_package: null,
                    discount_coupon_id: null,
                    discount_coupon_code: null,
                })
                setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
            } else {
                let addExtra = Number(obj.gmm_num_id) - Number(item.gmm_product_cg_default_hour);

                let summary_dis_prc = Number(item['gmm_product_price']) +
                    ((Number(addExtra) > 0) ? Number(addExtra) * Number(item['gmm_product_cg_price_hour']) : 0) +
                    ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0);

                item['extra_cg_hr'] = addExtra;
                setForm({
                    ...Form,
                    book_hr_add_cg: Number(obj.gmm_num_id),
                    book_hr_cg_add_format: obj,
                    book_type_payment: 'PAY',
                    book_coupon_discount: '',
                    book_coupon_json: null
                })
                setSelected({
                    ...selectDiscount,
                    default: true,
                    promotion: false,
                    member: false,
                    coupon: false,
                    package: false
                })
                setPrice({
                    ...Totalprice,
                    summary: summary_dis_prc,
                    dis_promotion: 0,
                    dis_member: 0,
                    dis_couponcode: 0,
                    dis_package: 0,
                    net: summary_dis_prc
                })
                setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
            }

            setWallet(0)
            setBag(Form.book_user.gmm_user_credit);
            setBaln(Form.book_user.gmm_user_credit);
            setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })
            setSelectedIndex('PAY')
            setMycoupon([]);
            setCouponTrip([]);
            setAlertColor(false);
            setStatus(false)
        }
    }

    const alert_message = (txt) => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: txt,
            icon: "warning",
        })
    }

    const handleSubmit1 = (event) => {
        event.preventDefault();
        let count = 0;
        let status = false;
        //--------------------
        for (let i = 0; i < item.point.length; i++) {
            if (item.point[i]['location'] !== null) {
                count++;
            }

            if (count === item.point.length) {
                status = true
            }
        }

        if (Form.book_date && Form.book_time) {
            if (Form.book_add_cg) {
                if (Form.book_cg_meet_point_format) {
                    if (status) {
                        FindTaxi()
                    } else {
                        alert_message('กรุณาระบุสถานที่เดินทาง')
                    }
                } else {
                    alert_message('กรุณาเลือกเวลานัดพบ')
                }
            } else {
                if (status) {
                    FindTaxi()
                } else {
                    alert_message('กรุณาระบุสถานที่เดินทาง')
                }
            }

        } else {
            alert_message('กรุณาเลือกวันที่/เวลาเดินทาง')
        }
    }

    const handleSubmit2 = (event) => {
        event.preventDefault();
        setActiveStep(activeStep + 1)
    }

    const handleSubmit3 = (event) => {
        event.preventDefault();
        getPassenger('sec');
        setActiveStep(activeStep + 1)

    }

    const handleBackToIntro = () => {
        setActiveStep(0);
        setNameEdit({ ...edit_name, uid: '', pid: '', name: '' })
        setEdit(false)
        setStatus(false)
        setAlertColor(false)
        setPrice({
            ...Totalprice, summary: 0,
            dis_couponcode: 0,
            dis_promotion: 0,
            dis_member: 0,
            dis_package: 0,
            net: 0
        })
        setMsgCount(0)
        setMsgCountFVR(0);
        setSelectedIndex('PAY')
        setEmployee({ ...Listemp, driver: [], cg: [], dutation: [] })
        setForm(booking);
        setBookmarks([]);
        setItem([]);
        setPassenger([]);
        setMember([]);
        setPromotion([]);
        setMycoupon([]);
        setCouponTrip([]);
        setFavouriteTrip([]);
        setLeftHover(false);
        setRightHover(false);
        setIndex(0)
        setPosition(null)
        setAssignStep(1)
        setAssignType(null)
        setListFavTX([]);
        setListFavCG([]);
        setAutoTX([]);
        setAutoCG([]);
    }

    const handlegoBack = () => {
        if (activeStep === 1) {
            setActiveStep(activeStep - 1);
            setIndex(0)
            setPosition(null)
        } else if (activeStep === 2) {
            setActiveStep(activeStep - 1);
            getPassenger('sec');
        } else if (activeStep === 3) {
            setActiveStep(activeStep - 2);
            getPassenger('sec');
        } else {
            setActiveStep(activeStep - 1);
        }
    }

    const handleChangeTaxi = () => {
        setAssignStep(1);
    }

    function ButtonNexts({ classes, status }) {
        return (
            <>
                <Box mt={4} mb={2} className={classes.Submit}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        endIcon={<ArrowForward fontSize="small" />}
                    >
                        ถัดไป
                    </Button>
                </Box>
            </>
        )
    }

    function ButtonBacks({ classes, status }) {
        return (
            <>
                <Box mt={4} mb={2} className={classes.Submit}>
                    <Button
                        onClick={handlegoBack}
                        variant="outlined"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        startIcon={<ArrowBack fontSize="small" />}
                    >
                        ย้อนกลับ
                    </Button>
                </Box>
            </>
        )
    }

    function ButtonChangeTaxi({ classes, status }) {
        return (
            <>
                <Box mt={4} mb={2} className={classes.Submit}>
                    <Button
                        onClick={handleChangeTaxi}
                        variant="outlined"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        startIcon={<ArrowBack fontSize="small" />}
                    >
                        เลือกคนขับใหม่
                    </Button>
                </Box>
            </>
        )
    }

    //Google-Map
    const [open, setOpen] = useState(false);
    const [openFavourite, setOpenFavourite] = useState(false);
    const [openBooks, setOpenBooks] = useState(false);
    const [openEdits, setOpenEdits] = useState(false);
    const [openEditsTrip, setOpenEditsTrip] = useState(false);
    const [Hidd, setHidd] = useState(0);
    const [zoom, setZoom] = useState(12);
    const [center, setCenters] = useState({ lat: 13.762459861106006, lng: 100.49094949418699 })
    const [marker, setMarkers] = useState({ lat: null, lng: null });
    const [search, setSearchs] = useState('')
    const [selectIndex, setIndex] = useState(0);
    const [IndexFavourite, setFavourite] = useState({ index: 0, address: '' });
    const [selectPosition, setPosition] = useState(null);
    const [FmFavourite, setFmFavourite] = useState({ id: '', name: '', desc: '' });
    const [dataInfo, setDatainfo] = useState({ addr: '' })
    const [onLoadcomplete, setLoad] = useState(null)
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: APIkey,
        libraries,
        language
    })
    if (loadError) return "Error loading maps";
    if (!isLoaded) return null

    const options = {
        styles: [
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.school",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.sports_complex",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.station.bus",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "saturation": "21"
                    },
                    {
                        "weight": "4.05"
                    }
                ]
            }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER // 'right-center' ,
        }

    }


    const onLoad = (e) => {
        setLoad(e)
    }

    const mergAddress = (place) => {
        var _address = '';
        //---------------------------------------------------------
        for (let i = 0; i < place.address_components.length; i++) {
            if (i > 0) {
                if ((i + 1) !== place.address_components.length) {
                    if (i === 2) {
                        _address += place.address_components[i].short_name + ' '

                    } else {
                        _address += place.address_components[i].long_name + ' '
                    }
                }
            }
        }

        return place.name + ' ' + _address
    }

    const onPlaceChanged = () => {
        if (onLoadcomplete !== null) {
            var place = onLoadcomplete.getPlace();
            var address = mergAddress(place)

            if (!place.geometry) {
                return;
            }

            let lat = place.geometry.location.lat();
            let lng = place.geometry.location.lng();
            let array = place.address_components;
            let Sentry = true;
            let countryname;

            const found = array.find((detail, index) => {
                if (detail.types[0] === 'administrative_area_level_1') {
                    return detail;
                }
            });



            if (found) {
                if (found.long_name === 'กรุงเทพมหานคร') {
                    if (array.length > 3) {
                        const aumphur = array.find((detail, index) => {
                            return detail.types.find(detail => {
                                if (detail == 'sublocality_level_1') {
                                    return detail;
                                }
                            });
                        });
                        const district = array.find((detail, index) => {
                            return detail.types.find(detail => {
                                if (detail == 'sublocality_level_2') {
                                    return detail;
                                }
                            });
                        });

                        if (district && aumphur) {

                            let find = aumphur.long_name.includes("เขต");

                            if (!find) {
                                aumphur.long_name = 'เขต' + aumphur.long_name
                            }

                            countryname = {
                                country: found.long_name.replace(/\s/g, ''),
                                aumphur: aumphur.long_name.replace(/\s/g, ''),
                                district: district.long_name.replace(/\s/g, '').replace('แขวง', '')
                            }
                        } else { //ไม่มีแขวง
                            Sentry = false;
                        }
                    } else {
                        Sentry = false;
                    }
                } else {
                    if (array.length > 2) {
                        if (found.long_name === 'นนทบุรี' || found.long_name === 'สมุทรปราการ') {
                            const aumphur = array.find((detail, index) => {
                                return detail.types.find(detail => {
                                    if (detail == 'administrative_area_level_2') {
                                        return detail;
                                    }
                                });
                            });
                            const district = array.find((detail, index) => {
                                return detail.types.find(detail => {
                                    if (
                                        detail == 'locality' ||
                                        detail == 'sublocality_level_1'
                                    ) {
                                        return detail;
                                    }
                                });
                            });

                            if (district && aumphur) {

                                countryname = {
                                    country: found.long_name.replace(/\s/g, ''),
                                    aumphur: aumphur.long_name.replace(/\s/g, '').replace('อำเภอ', ''),
                                    district: district.long_name.replace(/\s/g, '').replace('ตำบล', '')
                                }

                            } else { //ไม่มีแขวง
                                Sentry = false;
                            }
                        } else {
                            Sentry = false;
                        }
                    } else {
                        Sentry = false;
                    }
                }
            } else {
                Sentry = false;
            }

            const country = {
                position: { lat: lat, lng: lng },
                address: address,
                subAddress: countryname,
                favourite: null,
            };


            if (Sentry) {
                setDatainfo({ addr: address })
                setPosition(country)
                setMarkers({ ...marker, lat: lat, lng: lng });
                setCenters({ ...center, lat: lat, lng: lng });
                setZoom(13)
            } else {
                setDatainfo({ addr: '' })
                setMarkers({ ...marker, lat: null, lng: null });
                alert_message('ไม่สามารถระบุตำแหน่ง กรุณาลองใหม่อีกครั้ง')
            }

            setSearchs(address);
        }
    }

    const handleClickOpen = (index) => {
        let newArr = [...item.point];

        if (newArr[index].location !== null) {
            let detail = newArr[index].location
            setCenters({ ...center, lat: Number(detail.position.lat), lng: Number(detail.position.lng) })
            setMarkers({ ...marker, lat: Number(detail.position.lat), lng: Number(detail.position.lng) })
            setDatainfo({ ...dataInfo, addr: detail.address });
            setZoom(16);
        } else {
            setZoom(12);
            setCenters({ ...center, lat: 13.762459861106006, lng: 100.49094949418699 })
        }

        setHidd(0);
        setOpen(true);
        setIndex(index);
    };

    const handleClose = () => {
        setDatainfo({ addr: '' })
        setSearchs('');
        setMarkers({ lat: null, lng: null })
        setOpen(false);
        setHidd(0);
    };

    const handleClickOpenFavourite = (index) => {

        let newArr = [...item.point];
        if (newArr[index].location !== null) {
            if (Form.book_passenger !== null) {
                if (!newArr[index].bookmark.status) {
                    setFmFavourite({ ...FmFavourite, name: (newArr[index].location.favourite) ? newArr[index].location.favourite.name : '', desc: (newArr[index].rmk) ? newArr[index].rmk : '' })
                    setMsgCountFVR((newArr[index].rmk) ? newArr[index].rmk.length : 0)
                    setFavourite({ ...IndexFavourite, index: index, address: newArr[index].location.address })
                    setOpenFavourite(true);
                } else {
                    Swal.fire({
                        title: "ลบ",
                        text: "ท่านต้องการลบที่อยู่โปรด หรือไม่?",
                        icon: "info",
                        showCancelButton: true,
                        confirmButtonText: "ตกลง",
                        cancelButtonText: "ยกเลิก",
                        //reverseButtons: true,
                    }).then((output) => {
                        if (output.isConfirmed) {
                            DeleteFavourite(Form.book_user.gmm_user_id, newArr[index].bookmark.id);
                        }
                    });
                }
            } else {
                alert_message('กรุณาเลือกผู้โดยสาร')
            }
        }
    }

    const handleCloseFavourite = () => {
        setFmFavourite({ ...FmFavourite, name: '', desc: '' })
        setOpenFavourite(false);
    };

    const handleClickOpenBooks = (index) => {
        setIndex(index)
        getFavourite(Form.book_user.gmm_user_id);
    }

    const handleCloseBooks = () => {
        setOpenBooks(false);
    };

    const handleDeleteBooks = (item) => {
        Swal.fire({
            title: "ลบ",
            text: "ท่านต้องการลบที่อยู่โปรด หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                DeleteFavouriteBooks(item.favourite_user, item.favourite_nbr);
            }
        });
    }

    const handleEditBooks = (item) => {

        let detail = item.location;
        setFmFavourite({ ...FmFavourite, id: item.favourite_nbr, name: detail.favourite.name, desc: detail.favourite.desc })
        setCenters({ ...center, lat: Number(detail.position.lat), lng: Number(detail.position.lng) })
        setMarkers({ ...marker, lat: Number(detail.position.lat), lng: Number(detail.position.lng) })
        setDatainfo({ ...dataInfo, addr: detail.address });
        setPosition(item.location)
        setMsgCountFVR(detail.favourite.desc.length)
        setHidd(2);
        setZoom(16);
        setOpen(true);
    }


    const handleSeleteFavourite = (list) => {
        let newArr = [...item.point];
        if (newArr.length > 2 && selectIndex === 0) {
            newArr[(newArr.length - 1)]['location'] = list.location;
            newArr[(newArr.length - 1)]['edit'] = true;
            newArr[(newArr.length - 1)]['rmk'] = list.favourite_rmks1;
            newArr[(newArr.length - 1)]['bookmark']['id'] = list.favourite_nbr;
            newArr[(newArr.length - 1)]['bookmark']['status'] = true;
        }

        newArr[selectIndex]['location'] = list.location;
        newArr[selectIndex]['edit'] = true;
        newArr[selectIndex]['rmk'] = list.favourite_rmks1;
        newArr[selectIndex]['bookmark']['id'] = list.favourite_nbr;
        newArr[selectIndex]['bookmark']['status'] = true;


        setItem({ ...item, point: newArr })
        setPosition(list.location)
        setOpenBooks(false);
    }

    const handleADDFavourite = (nb) => {
        setHidd(nb)
        setCenters({ ...center, lat: 13.762459861106006, lng: 100.49094949418699 })
        setZoom(12);
        setOpen(true);
    }

    const handleOpenFmFavourite = () => {
        setFmFavourite({ ...FmFavourite, name: '', desc: '' })
        setMsgCountFVR(0);
        setOpenFavourite(true);
    }

    const handleEditFmFavourite = () => {

        setOpenFavourite(true);
    }

    const handleDrop = (event) => {
        let dropLat = event.latLng.lat();
        let dropLng = event.latLng.lng();
        ReversCode(dropLat, dropLng)
    }

    //EDIT
    const handleConfirmLocation = () => {
        let newArr = [...item.point];



        if (newArr.length > 2 && selectIndex === 0) {
            newArr[selectIndex]['rmk'] = '';
            newArr[(newArr.length - 1)]['rmk'] = '';
            newArr[(newArr.length - 1)]['location'] = selectPosition;
            newArr[(newArr.length - 1)]['bookmark']['id'] = null;
            newArr[(newArr.length - 1)]['bookmark']['status'] = false;
        } else {

            if (newArr.length > 2) {
                if (selectPosition['address'] === newArr[0]['location']['address']) {
                    newArr[(newArr.length - 1)]['rmk'] = newArr[0]['rmk'];
                } else {
                    newArr[selectIndex]['rmk'] = '';
                }
            } else {
                newArr[selectIndex]['rmk'] = '';
            }
        }


        newArr[selectIndex]['location'] = selectPosition;
        newArr[selectIndex]['bookmark']['id'] = null;
        newArr[selectIndex]['bookmark']['status'] = false;
        //-----------------------------------------------
        setDatainfo({ name: '', addr: '' })
        setSearchs('');
        setMarkers({ lat: null, lng: null })
        setItem({ ...item, point: newArr })
        setOpen(false)
    }

    const handlecheckCoupon = () => {
        if (Form.book_coupon_discount) {
            checkCoupon();
        }
    }

    const handleCancelCoupon = () => {
        autoselect_discount();
        setWallet(0)
        setBag(Form.book_user.gmm_user_credit)
        setBaln(Form.book_user.gmm_user_credit)
        setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })
        setForm({ ...Form, book_coupon_discount: '', book_coupon_json: null });
        setAlertColor(false);
        setStatus(false)
    }

    const SubmitFavourite = (event) => {
        event.preventDefault();
        //---------------------------
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
                let newArr = [...item.point];
                { Hidd === 0 && SaveFavourite(newArr[IndexFavourite.index].location, FmFavourite) }
                { Hidd === 1 && SaveAddFavourite(selectPosition, FmFavourite) }
                { Hidd === 2 && SaveEditFavourite(selectPosition, FmFavourite) }
            }
        });
    }

    function ReversCode(lat, lng) {
        const coordinates = lat + ',' + lng
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyANcHgMKpxM2-2wipNHgT7vumZrM7f1Nlo&language=th&latlng=' + coordinates + '&sensor=true';
        fetch(url).then(response => response.json()).then(location => {
            let array = location.results[0].address_components;
            let position = location.results[0].geometry.location;
            let Sentry = true;
            let countryname;
            const found = array.find((detail, index) => {
                if (detail.types[0] === 'administrative_area_level_1') {
                    return detail;
                }
            });

            if (found) {
                if (found.long_name === 'กรุงเทพมหานคร') {
                    if (array.length > 3) {
                        const aumphur = array.find((detail, index) => {
                            return detail.types.find(detail => {
                                if (detail == 'sublocality_level_1') {
                                    return detail;
                                }
                            });
                        });
                        const district = array.find((detail, index) => {
                            return detail.types.find(detail => {
                                if (detail == 'sublocality_level_2') {
                                    return detail;
                                }
                            });
                        });

                        if (district && aumphur) {

                            let find = aumphur.long_name.includes("เขต");

                            if (!find) {
                                aumphur.long_name = 'เขต' + aumphur.long_name
                            }

                            countryname = {
                                country: found.long_name.replace(/\s/g, ''),
                                aumphur: aumphur.long_name.replace(/\s/g, ''),
                                district: district.long_name.replace(/\s/g, '').replace('แขวง', '')
                            }
                        } else { //ไม่มีแขวง
                            Sentry = false;
                        }
                    } else {
                        Sentry = false;
                    }
                } else {
                    if (array.length > 2) {
                        if (found.long_name === 'นนทบุรี' || found.long_name === 'สมุทรปราการ') {
                            const aumphur = array.find((detail, index) => {
                                return detail.types.find(detail => {
                                    if (detail == 'administrative_area_level_2') {
                                        return detail;
                                    }
                                });
                            });
                            const district = array.find((detail, index) => {
                                return detail.types.find(detail => {
                                    if (
                                        detail == 'locality' ||
                                        detail == 'sublocality_level_1'
                                    ) {
                                        return detail;
                                    }
                                });
                            });

                            if (district && aumphur) {
                                countryname = {
                                    country: found.long_name.replace(/\s/g, ''),
                                    aumphur: aumphur.long_name.replace(/\s/g, '').replace('อำเภอ', ''),
                                    district: district.long_name.replace(/\s/g, '').replace('ตำบล', '')
                                }
                            } else { //ไม่มีแขวง
                                Sentry = false;
                            }
                        } else {
                            Sentry = false;
                        }
                    } else {
                        Sentry = false;
                    }
                }
            } else {
                Sentry = false;
            }

            const country = {
                position: { lat: position.lat, lng: position.lng },
                address: location.results[0].formatted_address,
                subAddress: countryname,
                favourite: null,
            };

            if (Sentry) {
                setDatainfo({ addr: location.results[0].formatted_address })
                setPosition(country)
                setMarkers({ ...marker, lat: lat, lng: lng });
                setCenters({ ...center, lat: lat, lng: lng });
                setSearchs('')
            } else {
                setSearchs('')
                setMarkers({ ...marker, lat: null, lng: null });
                setDatainfo({ addr: '' })
                alert_message('ไม่สามารถระบุตำแหน่ง กรุณาลองใหม่อีกครั้ง')
            }
        })
    }

    function ConfirmLocation({ classes, status }) {
        return (
            <>
                <Box className={classes.footer} >
                    <Button
                        className={classes.font_normal}
                        onClick={handleConfirmLocation}
                        disabled={status}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<LocationOn />}
                    >
                        ยืนยันตำแหน่ง
                    </Button>
                </Box>
            </>
        )
    }

    function AddLocation({ classes, status }) {
        return (
            <>
                <Box className={classes.footer} >
                    <Button
                        className={classes.font_normal}
                        onClick={handleOpenFmFavourite}
                        disabled={status}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<LocationOn />}
                    >
                        ยืนยันตำแหน่ง
                    </Button>
                </Box>
            </>
        )
    }

    function EditLocation({ classes, status }) {
        return (
            <>
                <Box className={classes.footer} >
                    <Button
                        className={classes.font_normal}
                        onClick={handleEditFmFavourite}
                        disabled={status}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<LocationOn />}
                    >
                        ยืนยันตำแหน่ง
                    </Button>
                </Box>
            </>
        )
    }

    function InfoDetail({ classes }) {
        return (
            <>
                <Box className={classes.infodetail}>
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card className={classes.infoBox}>
                            <CardContent style={{ paddingBottom: 16 }}>
                                <Chip color="primary" variant="outlined" label="สถานที่" size="small"
                                    classes={{ label: classes.font_smallBtn }}></Chip> {dataInfo.addr}
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </>
        )
    }

    function Button_download({ classes, status, dataPayment }) {
        return (
            <>
                <Box mt={2} mb={2} className={classes.Submit}>
                    <Button
                        onClick={() => { handleDownload_QRCode(dataPayment.invoice) }}
                        variant="contained"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        style={{
                            textTransform: 'none'
                        }}
                    >
                        Download Image
                    </Button>
                </Box>
            </>
        )
    }

    function Button_back({ classes, status }) {
        return (
            <>
                <Box mt={0} mb={2} className={classes.Submit}>
                    <Button
                        onClick={handleBackToIntro}
                        variant="outlined"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        style={{
                            textTransform: 'none'
                        }}
                    >
                        กลับสู่หน้าหลัก
                    </Button>
                </Box>
            </>
        )
    }


    //----------------------------------------

    async function SelectedService(type) {
        setBoolean(true)
        //--------------------------------
        const payload = JSON.stringify({
            key: "SelectedService",
            id: type,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            (type === 'multiple') && setLock({ ...Locknumber, max: res.avg.max, min: res.avg.min });
            setMaxnumbTx(Number(res.maxnumbTx));
            setMinnumbTx(Number(res.minnumbTx));
            //----------------------------------
            setMaxnumbCg(Number(res.maxnumbCg));
            setMinnumbCg(Number(res.minnumbCg));
            //----------------------------------
            setNumbTaxi(res.number_hr_tx);
            setNumbCG(res.number_hr_cg);
            setBoolean(false);
        }
    }

    const handleTrip = (desc) => {
        getPassenger('favTrip', desc);
        SelectedService((desc.item_product.data.gmm_product_drop === 2) ? 'single' : 'multiple')
        setActiveStep(1)
        setLeftHover(desc.button_focutL);
        setRightHover(desc.button_focutR);
        setItem(desc.item_product.data);
        setMember(desc.member)
        setPromotion(desc.promotion)
        setBoolean(false);
        setAlertColor(false);
        setStatus(false);
        setMycoupon([]);
        setCouponTrip([]);
        setForm({ ...Form, book_passenger: null })
        setNameEdit({
            ...edit_name,
            uid: Form.book_user.gmm_user_id,
            pid: desc.book_passenger.gmm_passenger_id,
            name: desc.book_passenger.gmm_passenger_fullname
        })

        //------------------------------
        if (desc.promotion.status === true && desc.member.status === true) {
            if (desc.promotion.data.discount === desc.member.data.discount) {
                let summary_net_prc = Number(desc.item_product.data.gmm_product_price) +
                    ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                    ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

                let summary_dis_prc = (Number(desc.item_product.data.gmm_product_price) - desc.promotion.data.discount) +
                    ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                    ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

                setSelected({
                    ...selectDiscount,
                    default: false,
                    promotion: true,
                    member: false,
                    coupon: false,
                    package: false
                })

                setPrice({
                    ...Totalprice,
                    summary: summary_net_prc,
                    dis_promotion: desc.promotion.data.discount,
                    dis_member: 0,
                    dis_couponcode: 0,
                    dis_package: 0,
                    net: summary_dis_prc,
                })
                setDiscountType({
                    ...discountType,
                    discount_type: 'PROMOTION',
                    discount_amt: (Number(desc.promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(desc.promotion.data.gmm_promotion_product_discount_bath),
                    discount_pct: (Number(desc.promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(desc.promotion.data.gmm_promotion_product_discount_percent),
                    discount_promotion: desc.promotion.data.gmm_promotion_id,
                    discount_member: null,
                    discount_package: null,
                    discount_coupon_id: null,
                    discount_coupon_code: null,
                })
                setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
            } else {
                if (desc.promotion.data.discount > desc.member.data.discount) {
                    let summary_net_prc = Number(desc.item_product.data.gmm_product_price) +
                        ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

                    let summary_dis_prc = (Number(desc.item_product.data.gmm_product_price) - desc.promotion.data.discount) +
                        ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

                    setSelected({
                        ...selectDiscount,
                        default: false,
                        promotion: true,
                        member: false,
                        coupon: false,
                        package: false
                    })
                    setPrice({
                        ...Totalprice,
                        summary: summary_net_prc,
                        dis_promotion: desc.promotion.data.discount,
                        dis_member: 0,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })
                    setDiscountType({
                        ...discountType,
                        discount_type: 'PROMOTION',
                        discount_amt: (Number(desc.promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(desc.promotion.data.gmm_promotion_product_discount_bath),
                        discount_pct: (Number(desc.promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(desc.promotion.data.gmm_promotion_product_discount_percent),
                        discount_promotion: desc.promotion.data.gmm_promotion_id,
                        discount_member: null,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })
                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                } else {
                    let summary_net_prc = Number(desc.item_product.data.gmm_product_price) +
                        ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

                    let summary_dis_prc = (Number(desc.item_product.data.gmm_product_price) - desc.member.data.discount) +
                        ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                        ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

                    setSelected({
                        ...selectDiscount,
                        default: false,
                        promotion: false,
                        member: true,
                        coupon: false,
                        package: false
                    })
                    setPrice({
                        ...Totalprice,
                        summary: summary_net_prc,
                        dis_promotion: 0,
                        dis_member: desc.member.data.discount,
                        dis_couponcode: 0,
                        dis_package: 0,
                        net: summary_dis_prc,
                    })
                    setDiscountType({
                        ...discountType,
                        discount_type: 'MEMBER',
                        discount_amt: (Number(desc.member.data.gmm_member_product_discount_bath) === 0) ? null : Number(desc.member.data.gmm_member_product_discount_bath),
                        discount_pct: (Number(desc.member.data.gmm_member_product_discount_percent) === 0) ? null : Number(desc.member.data.gmm_member_product_discount_percent),
                        discount_promotion: null,
                        discount_member: desc.member.data.gmm_user_member_nbr,
                        discount_package: null,
                        discount_coupon_id: null,
                        discount_coupon_code: null,
                    })
                    setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
                }
            }
        } else if (desc.promotion.status === true && desc.member.status === false) {
            let summary_net_prc = Number(desc.item_product.data.gmm_product_price) +
                ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

            let summary_dis_prc = (Number(desc.item_product.data.gmm_product_price) - desc.promotion.data.discount) +
                ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

            setSelected({
                ...selectDiscount,
                default: false,
                promotion: true,
                member: false,
                coupon: false,
                package: false
            })
            setPrice({
                ...Totalprice,
                summary: summary_net_prc,
                dis_promotion: desc.promotion.data.discount,
                dis_member: 0,
                dis_couponcode: 0,
                dis_package: 0,
                net: summary_dis_prc,
            })
            setDiscountType({
                ...discountType,
                discount_type: 'PROMOTION',
                discount_amt: (Number(desc.promotion.data.gmm_promotion_product_discount_bath) === 0) ? null : Number(desc.promotion.data.gmm_promotion_product_discount_bath),
                discount_pct: (Number(desc.promotion.data.gmm_promotion_product_discount_percent) === 0) ? null : Number(desc.promotion.data.gmm_promotion_product_discount_percent),
                discount_promotion: desc.promotion.data.gmm_promotion_id,
                discount_member: null,
                discount_package: null,
                discount_coupon_id: null,
                discount_coupon_code: null,
            })
            setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
        } else if (desc.promotion.status === false && desc.member.status === true) {
            let summary_net_prc = Number(desc.item_product.data.gmm_product_price) +
                ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

            let summary_dis_prc = (Number(desc.item_product.data.gmm_product_price) - desc.member.data.discount) +
                ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

            setSelected({
                ...selectDiscount,
                default: false,
                promotion: false,
                member: true,
                coupon: false,
                package: false
            })
            setPrice({
                ...Totalprice,
                summary: summary_net_prc,
                dis_promotion: 0,
                dis_member: desc.member.data.discount,
                dis_couponcode: 0,
                dis_package: 0,
                net: summary_dis_prc,
            })
            setDiscountType({
                ...discountType,
                discount_type: 'MEMBER',
                discount_amt: (Number(desc.member.data.gmm_member_product_discount_bath) === 0) ? null : Number(desc.member.data.gmm_member_product_discount_bath),
                discount_pct: (Number(desc.member.data.gmm_member_product_discount_percent) === 0) ? null : Number(desc.member.data.gmm_member_product_discount_percent),
                discount_promotion: null,
                discount_member: desc.member.data.gmm_user_member_nbr,
                discount_package: null,
                discount_coupon_id: null,
                discount_coupon_code: null,
            })
            setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
        } else {
            let summary_dis_prc = Number(desc.item_product.data.gmm_product_price) +
                ((Number(desc.item_product.data.extra_tx_hr) > 0) ? Number(desc.item_product.data.extra_tx_hr) * Number(desc.item_product.data.gmm_product_tx_price_hour) : 0) +
                ((Number(desc.item_product.data.extra_cg_hr) > 0) ? Number(desc.item_product.data.extra_cg_hr) * Number(desc.item_product.data.gmm_product_cg_price_hour) : 0)

            setSelected({
                ...selectDiscount,
                default: true,
                promotion: false,
                member: false,
                coupon: false,
                package: false
            })

            setDiscountType({
                ...discountType,
                discount_type: null,
                discount_amt: null,
                discount_pct: null,
                discount_promotion: null,
                discount_member: null,
                discount_package: null,
                discount_coupon_id: null,
                discount_coupon_code: null,
            })

            setPrice({
                ...Totalprice,
                summary: summary_dis_prc,
                dis_promotion: 0,
                dis_member: 0,
                dis_couponcode: 0,
                dis_package: 0,
                net: summary_dis_prc,
            })
            setCreditPrice({ ...CreditTotalprice, net: Number(summary_dis_prc), calc: Number(summary_dis_prc) })
        }


    };

    //----------------------------------------
    // discount promotion


    async function getDiscount(product_id, uid) {
        // setBoolean(true)
        //--------------------------------
        const payload = JSON.stringify({
            key: "getDiscount",
            id: product_id,
            user_id: uid
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            setListDiscount(res.data)
        }
    }


    const handleChangeDiscount = () => {
        setOpenDiscount(true);
        getDiscount(item['gmm_product_id'], edit_name['uid']);
    }

    const handleCloseDiscount = () => {
        setOpenDiscount(false);
    }

    const handleSelectDiscount = (key, desc) => {
        if (key === 'PROMOTION') {
            let summary_net_prc = Number(item['gmm_product_price']) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            let summary_dis_prc = (Number(item['gmm_product_price']) - desc.discount) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            setSelected({
                ...selectDiscount,
                default: false,
                promotion: true,
                member: false,
                coupon: false,
                package: false
            })
            setPrice({
                ...Totalprice,
                summary: summary_net_prc,
                dis_promotion: desc.discount,
                dis_member: 0,
                dis_couponcode: 0,
                dis_package: 0,
                net: summary_dis_prc,
            })
            setDiscountType({
                ...discountType,
                discount_type: 'PROMOTION',
                discount_amt: (Number(desc.gmm_promotion_product_discount_bath) === 0) ? null : Number(desc.gmm_promotion_product_discount_bath),
                discount_pct: (Number(desc.gmm_promotion_product_discount_percent) === 0) ? null : Number(desc.gmm_promotion_product_discount_percent),
                discount_promotion: desc.gmm_promotion_id,
                discount_member: null,
                discount_package: null,
                discount_coupon_id: null,
                discount_coupon_code: null,
            })
            setOpenDiscount(false)

        } else if (key === 'MEMBER') {
            let summary_net_prc = Number(item['gmm_product_price']) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            let summary_dis_prc = (Number(item['gmm_product_price']) - desc.discount) +
                ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
                ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

            setSelected({
                ...selectDiscount,
                default: false,
                promotion: false,
                member: true,
                coupon: false,
                package: false
            })
            setPrice({
                ...Totalprice,
                summary: summary_net_prc,
                dis_promotion: 0,
                dis_member: desc.discount,
                dis_couponcode: 0,
                dis_package: 0,
                net: summary_dis_prc,
            })
            setDiscountType({
                ...discountType,
                discount_type: 'MEMBER',
                discount_amt: (Number(desc.gmm_member_product_discount_bath) === 0) ? null : Number(desc.gmm_member_product_discount_bath),
                discount_pct: (Number(desc.gmm_member_product_discount_percent) === 0) ? null : Number(desc.gmm_member_product_discount_percent),
                discount_promotion: null,
                discount_member: desc.gmm_user_member_nbr,
                discount_package: null,
                discount_coupon_id: null,
                discount_coupon_code: null,
            })
            setOpenDiscount(false)
        }
    }

    //------------------------------------------
    // discount couponTrip

    const handleMyCoupon = () => {
        setOpenCoupon(true);
    }

    const handleCloseMyCoupon = () => {
        setOpenCoupon(false);
    }

    const handleSelectCouponTrip = (row) => {
        setCouponTrip(row);
        setOpenCoupon(false);

        let diff = Number(row.discamt) - Number(item.gmm_product_price);

        let summary_net_prc = Number(item['gmm_product_price']) +
            ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
            ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

        let summary_dis_prc = diff +
            ((Number(item['extra_tx_hr']) > 0) ? Number(item['extra_tx_hr']) * Number(item['gmm_product_tx_price_hour']) : 0) +
            ((Number(item['extra_cg_hr']) > 0) ? Number(item['extra_cg_hr']) * Number(item['gmm_product_cg_price_hour']) : 0)

        setSelected({
            ...selectDiscount,
            default: false,
            promotion: false,
            member: false,
            coupon: false,
            package: true
        })


        setPrice({
            ...Totalprice,
            summary: summary_net_prc,
            dis_couponcode: 0,
            dis_promotion: 0,
            dis_member: 0,
            dis_package: Number(row.discamt),
            net: summary_dis_prc,
        })

        setDiscountType({
            ...discountType,
            discount_type: 'PACKAGE',
            discount_amt: Number(row.discamt),
            discount_pct: null,
            discount_promotion: null,
            discount_member: null,
            discount_package: row,
            discount_coupon_id: null,
            discount_coupon_code: null,
        })
    }

    //---------------------- attachfile ----------------------

    const keyValue = (value) => {
        if (value !== '00' && value !== '01' && value !== '02' && value !== '03' && value !== '04' && value !== '05' &&
            value !== '06' && value !== '07' && value !== '08' && value !== '09') {
            return true
        } else {
            return false
        }
    }

    const handleUsecredit = (event) => {
        const { target } = event;
        const { name } = target;
        if (name === "credit") {
            if (target.value.match("^[0-9]*$")) {
                if (keyValue(target.value)) {
                    if (Number(target.value) >= Number(bagWallet)) {
                        if (Number(CreditTotalprice.calc) >= Number(bagWallet)) {
                            let sum = Number(CreditTotalprice.calc) - Number(bagWallet)
                            setCreditPrice({ ...CreditTotalprice, net: sum });
                            setWallet(bagWallet);
                            setBaln(0);
                        } else {
                            setCreditPrice({ ...CreditTotalprice, net: 0 });
                            setWallet(CreditTotalprice.calc);
                            setBaln(Number(bagWallet) - Number(CreditTotalprice.calc))
                        }
                    } else {
                        if (Number(target.value) >= Number(CreditTotalprice.calc)) {
                            setCreditPrice({ ...CreditTotalprice, net: 0 });
                            setWallet(CreditTotalprice.calc);
                            setBaln(Number(bagWallet) - Number(CreditTotalprice.calc))
                        } else {
                            let sum = Number(CreditTotalprice.calc) - Number(target.value);
                            setCreditPrice({ ...CreditTotalprice, net: sum });
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

    const handlePushValue = (event) => {
        if (Number(CreditTotalprice.net) !== 0 && baln !== 0) {
            if (Number(CreditTotalprice.calc) >= Number(bagWallet)) {
                let sum = Number(CreditTotalprice.calc) - Number(bagWallet)


                setCreditPrice({ ...CreditTotalprice, net: sum });
                setWallet(Number(bagWallet));
                setBaln(0);
                setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })

            } else {
                setCreditPrice({ ...CreditTotalprice, net: 0 });
                setWallet(Number(CreditTotalprice.calc))
                setBaln(Number(bagWallet) - Number(CreditTotalprice.calc))
                setAttachfile({ ...attachfile, name: '', base64: '', preview: '' })

            }

            document.getElementById("InputFile").value = "";
        }
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

    const handlePreviewOpen = () => {
        setPreview(true);
    }

    const handlePreviewClose = () => {
        setPreview(false)
    }

    //------------------------------------------

    const handlefavSetting = () => {
        setSetting(true);
    }

    const handleClosSettings = () => {
        setSetting(false);
        setCopyFavouriteTrip(FavouriteTrip)
    }

    const handleActiveFav = (item, index) => {
        let newArr = [...CopyFavouriteTrip];
        let count_active = 0;



        for (let i = 0; i < CopyFavouriteTrip.length; i++) {
            if (CopyFavouriteTrip[i].favour_status === 'ACTIVE') {
                count_active++;
            }
        }


        if (item.favour_status === 'INACTIVE') {
            if (count_active !== 3) {
                favtrip_active(item.favour_user_id, item.favour_nbr, item.favour_status)
                newArr[index].favour_status = (item.favour_status === 'INACTIVE') ? 'ACTIVE' : 'INACTIVE'
                setCopyFavouriteTrip(newArr)
            }
        } else {
            favtrip_active(item.favour_user_id, item.favour_nbr, item.favour_status)
            newArr[index].favour_status = (item.favour_status === 'INACTIVE') ? 'ACTIVE' : 'INACTIVE'
            setCopyFavouriteTrip(newArr)
        }


    }

    const handleDeleteFavTrip = (item, index) => {
        let newArr = [...CopyFavouriteTrip];
        newArr.splice(index, 1);
        setCopyFavouriteTrip(newArr);
        //-------------------------------------------------
        deletefavourite(item.favour_user_id, item.favour_nbr)
    }

    const handleEditFavTrip = (item, index) => {
        let newArr = [...CopyFavouriteTrip];
        setSetting(false);

        Swal.fire({
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
                maxlength: 256,
            },
            title: 'เปลี่ยนชื่อ',
            text: 'ระบุชื่อที่ต้องการเปลี่ยน',
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            preConfirm: (name) => {
                if (name === "") {
                    Swal.showValidationMessage(
                        `Request Message`
                    )
                }
            }
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed && output.value !== "") {
                newArr[index].favour_name = output.value;
                setCopyFavouriteTrip(newArr);
                //-------------------------------------------------
                Editfavourite(item.favour_user_id, item.favour_nbr, output.value)
            }
        });
    }

    //-----------------------------------------


    const handleSelectDriver = (emp, type) => {
        if (type === 'FAVORITE-TAXI') {
            setIconTX(true)
            setEmployee({ ...Listemp, driver: emp });
            setActiveStep(activeStep + 1)
        } else if (type === 'FAVORITE-TAXI-CG') {
            setIconTX(true)
            setEmployee({ ...Listemp, driver: emp });
            setAssignStep(2)
        }
    }

    const handleSelectDriverAuto = (type) => {
        if (type === 'FAVORITE-TAXI') {
            setIconTX(false)
            setEmployee({ ...Listemp, driver: AutoTX });
            setActiveStep(activeStep + 1)
        } else if (type === 'FAVORITE-TAXI-CG') {
            setIconTX(false)
            setEmployee({ ...Listemp, driver: AutoTX });
            setAssignStep(2)
        }
    }

    const handleSelectCG = (emp, type) => {
        if (type === 'FAVORITE-CG') {
            setIconCG(true)
            setEmployee({ ...Listemp, cg: emp });
            setActiveStep(activeStep + 1)
        } else if (type === 'FAVORITE-TAXI-CG') {
            setIconCG(true)
            setEmployee({ ...Listemp, cg: emp });
            setActiveStep(activeStep + 1)
        }
    }

    const handleSelectCGAuto = (type) => {
        if (type === 'FAVORITE-CG') {
            setIconCG(false)
            setEmployee({ ...Listemp, cg: AutoCG });
            setActiveStep(activeStep + 1)
        } else if (type === 'FAVORITE-TAXI-CG') {
            setIconCG(false)
            setEmployee({ ...Listemp, cg: AutoCG });
            setActiveStep(activeStep + 1)
        }
    }

    const handleChangeInput = () => {
        setSearchs('')
        setLocation('')
        setSwitchInput(!switchInput);
    }

    function isLatitude(lat) {
        return isFinite(lat) && Math.abs(lat) <= 90;
    }

    function isLongitude(lng) {
        return isFinite(lng) && Math.abs(lng) <= 180;
    }

    const FindLocation = () => {
        let SearchLocation = Location.split(',');

        if (SearchLocation.length === 2) {
            let dropLat = SearchLocation[0];
            let dropLng = SearchLocation[1];

            let checkInLat = isLatitude(dropLat);
            let checkInLng = isLongitude(dropLng);

            if (checkInLat && checkInLng) {
                ReversCode(Number(dropLat), Number(dropLng))
            }

        }
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

    const filterOptions = createFilterOptions({
        stringify: ({ gmm_user_fullname, gmm_user_tel }) => `${gmm_user_fullname} ${gmm_user_tel}`
    });


    return (
        <>
            <Loading classes={classes} status={isLoading} />

            <Stepper className={classes.Step_body} alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}  ><span className={classes.font_normal}>{label}</span></StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* STEP1 */}
            {activeStep === 0 &&
                <>
                    <Box mt={3} />
                    <form id="selectuser" onSubmit={FindService}>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined" className={hoverLeft === false ? classes.card_bodyLeft : classes.card_bodyLeft_border} onClick={() => { handleService('single') }} >
                                    <CardContent className={classes.card_content}>
                                        <span className={classes.messageflex}>เที่ยวเดียว</span>
                                        <span className={classes.displayflex}>{hoverLeft && <CheckCircle fontSize="large" />}</span>
                                    </CardContent >
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined" className={hoverRight === false ? classes.card_bodyRight : classes.card_bodyRight_border} onClick={() => { handleService('multiple') }}>
                                    <CardContent className={classes.card_content}>
                                        <span className={classes.messageflex}>รับรอส่ง</span>
                                        <span className={classes.displayflex}>{hoverRight && <CheckCircle fontSize="large" />}</span>

                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Box mt={2} />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Topic1 classes={classes} title={Form.book_service} FindService={FindService} status={promise} />
                            </Grid>
                        </Grid>

                        <Collapse in={FavouriteTrip.length !== 0 ? true : false} timeout="auto">
                            <Box mt={1} mb={2}>
                                <Grid container spacing={3}>
                                    {FavouriteTrip.slice(0, 3).map((detail, index) =>
                                        <Grid item xs={6} sm={3} key={detail.favour_nbr}>
                                            <Card className={classes.fav_hover} onClick={() => { handleTrip(detail) }}>
                                                <CardContent style={{
                                                    paddingBottom: 16,
                                                }}>
                                                    <span>{detail.favour_name}</span>

                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )}


                                    <Grid item xs={12} sm={3}>
                                        <Card className={classes.fav_setting} onClick={handlefavSetting}>
                                            <CardContent style={{
                                                paddingBottom: 16,
                                                textAlign: 'center'
                                            }}>
                                                <Box className={classes.displayflexCenter}>
                                                    <Settings color="primary" fontSize="small" /> &nbsp; ตั้งค่า
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                </Grid>
                                <Box mt={2}>
                                    <PageLine />
                                </Box>
                            </Box>
                        </Collapse>
                        <Box mt={1} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} >
                                <AutocompleteInput
                                    classes={{
                                        input: classes.font_normal,
                                        option: classes.font_normal,
                                    }}
                                    options={umstr}
                                    filterOptions={filterOptions}
                                    getOptionLabel={(value) => value.gmm_user_fullname}
                                    getOptionSelected={(option, value) =>
                                        option.gmm_user_id === value.gmm_user_id
                                    }
                                    value={Form.book_user}
                                    onChange={handleUser}
                                    renderInput={(params) => (
                                        < TextField
                                            {...params}
                                            label="ระบุผู้ใช้งาน"
                                            margin="dense"
                                            variant="outlined"
                                            helperText={(Form.book_user !== null) ? 'รหัสผู้จอง : ' + Form.book_user.gmm_user_id : null}
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                            required
                                        />
                                    )}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent style={{ paddingBottom: 16, background: '#f5f5f5' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                classes={{ label: classes.font_normal }}
                                                control={
                                                    <Checkbox color="primary"
                                                        checked={Form.book_add_cg}
                                                        onChange={handleaddOnCG}
                                                        disabled={(hoverLeft || hoverRight) ? false : true}
                                                    />
                                                }
                                                label="ต้องการผู้ดูแล (บริการเสริม)" />
                                        </FormGroup>
                                    </CardContent>
                                    <Collapse in={Form.book_add_cg} timeout="auto" unmountOnExit>
                                        <Divider />
                                        <Box p={2}>
                                            <FormLabel className={classes.font_normal} ><HeadersIII classes={classes} /></FormLabel>
                                            <Box className={classes.displayflex}>
                                                <Button variant="outlined" color="secondary" onClick={handleDecrease_hrcg}>
                                                    <Remove />
                                                </Button>
                                                <Box className={classes.numpad}>
                                                    {Form.book_hr_add_cg}
                                                </Box>
                                                <Button variant="outlined" color="primary" onClick={handleIncrease_hrcg}>
                                                    <Add />
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </Card>
                            </Grid>

                        </Grid>

                        <Collapse in={hoverRight} timeout="auto" style={{ marginTop: '18px' }} unmountOnExit>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Card variant="outlined" >
                                        <CardContent style={{ paddingBottom: '16px' }} >
                                            <FormLabel className={classes.font_normal} ><HeadersI classes={classes} /></FormLabel>
                                            <FormControl component="fieldset">
                                                <Box className={classes.displayflex} >
                                                    <Button variant="outlined" color="secondary" onClick={handleDecrease_hrdrop}>
                                                        <Remove />
                                                    </Button>
                                                    <Box className={classes.numpad}>
                                                        {Form.book_hr_drop - 1}
                                                    </Box>
                                                    <Button variant="outlined" color="primary" onClick={handleIncrease_hrdrop}>
                                                        <Add />
                                                    </Button>
                                                </Box>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card variant="outlined">
                                        <CardContent style={{ paddingBottom: '16px' }}>
                                            <FormLabel className={classes.font_normal} ><HeadersII classes={classes} /></FormLabel>
                                            <FormControl component="fieldset">
                                                <Box className={classes.displayflex}>
                                                    <Button variant="outlined" color="secondary" onClick={handleDecrease_hrtx}>
                                                        <Remove />
                                                    </Button>
                                                    <Box className={classes.numpad}>
                                                        {Form.book_hr_add_tx}
                                                    </Box>
                                                    <Button variant="outlined" color="primary" onClick={handleIncrease_hrtx}>
                                                        <Add />
                                                    </Button>
                                                </Box>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Collapse>

                        <Box mt={4} className={classes.Submit}>
                            <Button
                                variant="contained"
                                color="primary"
                                form="selectuser"
                                type="submit"
                                disabled={promise}
                                className={classes.font_normal}
                                size="large"
                            >
                                กรอกข้อมูล
                            </Button>
                        </Box>
                    </form>
                </>
            }

            {/* STEP2 */}
            {activeStep === 1 &&
                <>
                    <form onSubmit={handleSubmit1}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Topic2 classes={classes} />
                                </Grid>


                                <Grid item xs={12} >
                                    <Box className={classes.displayflex}>
                                        <AutocompleteInput
                                            classes={{
                                                input: classes.font_normal,
                                                option: classes.font_normal,
                                            }}
                                            style={{ width: '100%' }}
                                            options={pmstr}
                                            getOptionLabel={(value) => value.gmm_passenger_fullname}
                                            getOptionSelected={(option, value) =>
                                                option.gmm_passenger_id === value.gmm_passenger_id
                                            }
                                            value={Form.book_passenger}
                                            onChange={handlePassenger}
                                            renderInput={(params) => (
                                                < TextField
                                                    {...params}
                                                    label="ระบุผู้โดยสาร"
                                                    margin="dense"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        className: classes.font_normal,
                                                    }}
                                                    required
                                                />
                                            )}

                                        />
                                        &nbsp;&nbsp;
                                        <IconButton style={{ background: 'aliceblue' }} color="primary" variant="outlined" onClick={() => { setCreate(true) }}>
                                            <Add color="primary" fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="เลือกวันที่เดินทาง"
                                        placeholder="วัน/เดือน/ปี"
                                        format="dd/MM/yyyy"
                                        value={Form.book_date}
                                        onChange={handleBookingDate}
                                        margin="dense"
                                        inputVariant="outlined"
                                        cancelLabel="ยกเลิก"
                                        okLabel="ตกลง"
                                        minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0)}
                                        maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate(), 0, 0, 0)}
                                        invalidDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        maxDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        minDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        InputProps={{
                                            className: classes.font_normal,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <InsertInvitation />
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
                                <Grid item xs={12} sm={6}>
                                    <TimePicker
                                        label="เลือกเวลาเดินทาง"
                                        placeholder="__:__"
                                        value={Form.book_time}
                                        onChange={handleBookingTime}
                                        ampm={false}
                                        format="HH:mm"
                                        minutesStep={minstep}
                                        margin="dense"
                                        inputVariant="outlined"
                                        cancelLabel="ยกเลิก"
                                        okLabel="ตกลง"
                                        invalidDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        maxDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        minDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                        InputProps={{
                                            className: classes.font_normal,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <InsertInvitation />
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
                                <Grid item xs={12} >
                                    <FormLabel className={classes.font_normal} ><HeadersIV classes={classes} /></FormLabel>
                                    {item.point.map((desc, index) => (
                                        <Box key={index}>
                                            <Box className={classes.displayflexHead} key={index}>
                                                <Box>
                                                    <span className={classes.font_local_header}>{desc.name}</span>
                                                </Box>
                                                <Box className={classes.displayflexHead}>
                                                    <IconButton title={desc.bookmark.status ? 'ลบที่อยู่โปรด' : 'เพิ่มที่อยู่โปรด'} color="secondary"
                                                        onClick={() => { handleClickOpenFavourite(index) }} aria-label="favourite">
                                                        {desc.bookmark.status ? <Favorite color="secondary" /> : <FavoriteBorderOutlined color="secondary" />}
                                                    </IconButton>
                                                    &nbsp;
                                                    <IconButton title="จัดการที่อยู่โปรด" color="primary" onClick={() => { handleClickOpenBooks(index) }} aria-label="bookmark">
                                                        <Bookmark />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <List component="nav" className={classes.ListHeader} onClick={() => { handleClickOpen(index) }}>
                                                <ListItem button>
                                                    <ListItemAvatar>
                                                        <Avatar style={{ background: 'white' }}>
                                                            <LocationOn color="secondary" />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText style={{ paddingRight: '16px' }}
                                                        primary={desc.location && (desc.location.favourite ? desc.location.favourite.name : null)}
                                                        secondary={desc.location ? desc.location.address : desc.placeholder}
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_normal }} />
                                                    <ArrowForwardIos style={{ color: 'gray', fontSize: '1rem' }} />
                                                </ListItem>
                                            </List>
                                            <Box mt={1} mb={1} style={{ background: 'aliceblue' }}>
                                                <ListItem style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                                    <ListItemText >
                                                        <TextField
                                                            placeholder="เพิ่มรายละเอียด"
                                                            margin="dense"
                                                            value={desc.rmk}
                                                            onChange={(e) => { handleChangeRemark(e, index) }}
                                                            inputProps={{ maxLength: 60, className: classes.font_small, }}
                                                            InputProps={{
                                                                disabled: desc.edit,
                                                                className: classes.font_small,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_small,
                                                                shrink: true
                                                            }}

                                                            fullWidth
                                                        />
                                                    </ListItemText>
                                                    &nbsp; &nbsp; &nbsp;
                                                    <Button className={classes.font_smallBtn} onClick={(e) => { handleEditRemark(e, index) }} color="primary" variant="outlined" size="small">
                                                        {(desc.edit) ? 'แก้ไข' : 'ตกลง'}
                                                    </Button>
                                                </ListItem>
                                            </Box>
                                            <PageLine />
                                        </Box>
                                    ))}

                                </Grid>
                                {(item.length !== 0 && Form.book_add_cg) &&
                                    <>
                                        <Grid item xs={12} >
                                            <Card variant="outlined" >
                                                <CardContent style={{ paddingBottom: '16px' }} >
                                                    <FormLabel className={classes.font_normal} ><HeadersV classes={classes} /></FormLabel>
                                                    <RadioGroup value={Form.book_cg_checkpoint}>
                                                        {item.point.map((desc) => (
                                                            <List component="nav" className={classes.none_padding} dense={true} key={desc.cgnumber} onClick={() => { handleCGCheckpoint(desc.cgnumber) }}>
                                                                <ListItem button >
                                                                    <FormControlLabel value={desc.cgnumber}
                                                                        classes={{ label: classes.font_normal }}
                                                                        control={<Radio color="primary" required />}
                                                                    >
                                                                    </FormControlLabel>

                                                                    <ListItemText
                                                                        primary={'จุดนับพบ : ' + desc.name}
                                                                        // secondary={(desc.location) ? desc.location.address : null}
                                                                        classes={{ primary: classes.font_normal, secondary: classes.font_normal }} />

                                                                </ListItem>
                                                            </List>
                                                        ))}
                                                    </RadioGroup>
                                                    {Form.book_cg_checkpoint &&
                                                        <TimePicker
                                                            label="เวลานัดหมายผู้ดูแลที่จุดนัดพบ"
                                                            placeholder="__:__"
                                                            value={Form.book_cg_meet_point}
                                                            onChange={(e) => {
                                                                let raw_time = e.toLocaleTimeString("th", options);
                                                                let split_time = raw_time.split(':');
                                                                let times = split_time[0] + ':' + split_time[1]
                                                                setForm({ ...Form, book_cg_meet_point: e, book_cg_meet_point_format: times })
                                                            }}
                                                            ampm={false}
                                                            format="HH:mm"
                                                            minutesStep={minstep}
                                                            margin="dense"
                                                            inputVariant="outlined"
                                                            cancelLabel="ยกเลิก"
                                                            okLabel="ตกลง"
                                                            invalidDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                                            maxDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                                            minDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton>
                                                                            <InsertInvitation />
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
                                                    }

                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </>
                                }
                                {Form.book_hr_drop >= 2 &&
                                    <>
                                        <Grid item xs={12}>
                                            <Card variant="outlined" >
                                                <CardContent style={{ paddingBottom: '16px' }} >
                                                    <FormLabel className={classes.font_normal} ><Optional1 classes={classes} /></FormLabel>
                                                    <AutocompleteInput
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={numbTx}
                                                        getOptionLabel={(value) => value.gmm_num_id}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_num_id === value.gmm_num_id
                                                        }
                                                        value={Form.book_hr_tx_add_format}
                                                        onChange={handleChangeHrTaxi}
                                                        renderInput={(params) => (
                                                            < TextField
                                                                {...params}
                                                                label="จำนวนชั่วโมง"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{
                                                                    className: classes.font_normal,
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>


                                    </>
                                }

                                {Form.book_add_cg &&
                                    <Grid item xs={12}>
                                        <Card variant="outlined" >
                                            <CardContent style={{ paddingBottom: '16px' }} >
                                                <FormLabel className={classes.font_normal} ><Optional2 classes={classes} /></FormLabel>
                                                <AutocompleteInput
                                                    classes={{
                                                        input: classes.font_normal,
                                                        option: classes.font_normal,
                                                    }}
                                                    options={numbCG}
                                                    getOptionLabel={(value) => value.gmm_num_id}
                                                    getOptionSelected={(option, value) =>
                                                        option.gmm_num_id === value.gmm_num_id
                                                    }
                                                    value={Form.book_hr_cg_add_format}
                                                    onChange={handleChangeHrCG}
                                                    renderInput={(params) => (
                                                        < TextField
                                                            {...params}
                                                            label="จำนวนชั่วโมง"
                                                            margin="dense"
                                                            variant="outlined"
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                }

                            </Grid>
                        </MuiPickersUtilsProvider>
                        <Grid item xs={12}>
                            <Box className={classes.displayflexHead}>
                                <ButtonBacks classes={classes} status={promise} />
                                <ButtonNexts classes={classes} status={promise} />
                            </Box>
                        </Grid>
                    </form>
                </>
            }

            {activeStep === 2 &&
                <>
                    {AssignType === 'false' &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Topic3 classes={classes} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box className={classes.font_success} >
                                        <Lottie
                                            options={lottie_failedOptions}
                                            height={200}
                                            width={200}
                                            isClickToPauseDisabled
                                        />
                                        <Box >{(Form.book_add_cg ? 'ขออภัยไม่พบคนขับรถและผู้ดูแลให้บริการในพื้นที่ตามวันและเวลาดังกล่าว' : 'ขออภัยไม่พบคนขับรถให้บริการในพื้นที่ตามวันและเวลาดังกล่าว')}</Box>
                                        <span className={classes.font_normal}>(กรุณากดปุ่ม "ย้อนกลับ" และเลือก <u>วันที่/เวลา</u> และค้นหาใหม่อีกครั้ง)</span>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box className={classes.displayflexHead}>
                                        <ButtonBacks classes={classes} status={promise} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    }

                    {AssignType === 'true' &&
                        <>
                            <form onSubmit={handleSubmit2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Topic3 classes={classes} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box className={classes.font_success} >
                                            <Lottie
                                                options={lottie_successOptions}
                                                height={200}
                                                width={200}
                                                isClickToPauseDisabled
                                            />
                                            <Box >ค้นหาคนขับสำเร็จ</Box>
                                            <span className={classes.font_normal}>(หากต้องการทำรายการต่อ กรุณากดปุ่ม "ถัดไป")</span>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box className={classes.displayflexHead}>
                                            <ButtonBacks classes={classes} status={promise} />
                                            {Listemp.driver.length !== 0 && <ButtonNexts classes={classes} status={promise} />}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </>
                    }

                    {AssignType === 'FAVORITE-TAXI' &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Topic3 classes={classes} />
                                </Grid>
                                {AutoTX &&
                                    <>
                                        <Grid item xs={12}>
                                            <TopicAutoTaxi classes={classes} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <List style={{ padding: 0 }}>
                                                <ListItem button className={classes.ListSelect} onClick={() => { handleSelectDriverAuto('FAVORITE-TAXI') }}>
                                                    <ListItemAvatar>
                                                        <Avatar style={{ background: '#FFCB08' }}>
                                                            ?
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="คนขับรถคนอื่นๆ ที่ระบบหาให้"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </>
                                }

                                <Grid item xs={12}>
                                    <TopicFavTaxi classes={classes} />
                                </Grid>
                                {ListFavTX.map((emp) => (
                                    <Grid item xs={12} key={emp.gmm_emp_id}>
                                        <List dense={true} style={{ padding: 0 }}>
                                            <ListItem button className={classes.ListSelect} onClick={() => { handleSelectDriver(emp, 'FAVORITE-TAXI') }}>
                                                <ListItemAvatar>
                                                    <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={emp.gmm_emp_fname + ' ' + emp.gmm_emp_lname + conv_formatTel(emp.gmm_emp_tel)}
                                                    secondary={"คนขับรถ" + ' ' + emp.gmm_emp_licenseplate}
                                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                <ListItemIcon>
                                                    <Favorite color="secondary" />
                                                </ListItemIcon>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                ))}


                                <Grid item xs={12}>
                                    <Box className={classes.displayflexHead}>
                                        <ButtonBacks classes={classes} status={promise} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    }

                    {AssignType === 'FAVORITE-CG' &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Topic3 classes={classes} />
                                </Grid>
                                {AutoCG &&
                                    <>
                                        <Grid item xs={12}>
                                            <TopicAutoCG classes={classes} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <List style={{ padding: 0 }}>
                                                <ListItem button className={classes.ListSelect} onClick={() => { handleSelectCGAuto('FAVORITE-CG') }}>
                                                    <ListItemAvatar>
                                                        <Avatar style={{ background: '#FFCB08' }}>
                                                            ?
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="ผู้ดูแลคนอื่นๆ ที่ระบบหาให้"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </>
                                }

                                <Grid item xs={12}>
                                    <TopicFavCG classes={classes} />
                                </Grid>
                                {ListFavCG.map((emp) => (
                                    <Grid item xs={12} key={emp.gmm_emp_id}>
                                        <List dense={true} style={{ padding: 0 }}>
                                            <ListItem button className={classes.ListSelect} onClick={() => { handleSelectCG(emp, 'FAVORITE-CG') }}>
                                                <ListItemAvatar>
                                                    <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={emp.gmm_emp_fname + ' ' + emp.gmm_emp_lname + conv_formatTel(emp.gmm_emp_tel)}
                                                    secondary="ผู้ดูแล"
                                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                <ListItemIcon>
                                                    <Favorite color="secondary" />
                                                </ListItemIcon>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                ))}


                                <Grid item xs={12}>
                                    <Box className={classes.displayflexHead}>
                                        <ButtonBacks classes={classes} status={promise} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    }

                    {(AssignType === 'FAVORITE-TAXI-CG' && AssignStep === 1) &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Topic3 classes={classes} />
                                </Grid>

                                {AutoTX &&
                                    <>
                                        <Grid item xs={12}>
                                            <TopicAutoTaxi classes={classes} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <List style={{ padding: 0 }}>
                                                <ListItem button className={classes.ListSelect} onClick={() => { handleSelectDriverAuto('FAVORITE-TAXI-CG') }}>
                                                    <ListItemAvatar>
                                                        <Avatar style={{ background: '#FFCB08' }}>
                                                            ?
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="คนขับรถคนอื่นๆ ที่ระบบหาให้"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </>
                                }

                                <Grid item xs={12}>
                                    <TopicFavTaxi classes={classes} />
                                </Grid>
                                {ListFavTX.map((emp) => (
                                    <Grid item xs={12} key={emp.gmm_emp_id}>
                                        <List dense={true} style={{ padding: 0 }}>
                                            <ListItem button className={classes.ListSelect} onClick={() => { handleSelectDriver(emp, 'FAVORITE-TAXI-CG') }}>
                                                <ListItemAvatar>
                                                    <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={emp.gmm_emp_fname + ' ' + emp.gmm_emp_lname}
                                                    secondary="คนขับรถ"
                                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                <ListItemIcon>
                                                    <Favorite color="secondary" />
                                                </ListItemIcon>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                ))}

                                <Grid item xs={12}>
                                    <Box className={classes.displayflexHead}>
                                        <ButtonBacks classes={classes} status={promise} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    }

                    {(AssignType === 'FAVORITE-TAXI-CG' && AssignStep === 2) &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Topic3 classes={classes} />
                                </Grid>

                                {AutoCG &&
                                    <>
                                        <Grid item xs={12}>
                                            <TopicAutoCG classes={classes} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <List style={{ padding: 0 }}>
                                                <ListItem button className={classes.ListSelect} onClick={() => { handleSelectCGAuto('FAVORITE-TAXI-CG') }}>
                                                    <ListItemAvatar>
                                                        <Avatar style={{ background: '#FFCB08' }}>
                                                            ?
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="ผู้ดูแลคนอื่นๆ ที่ระบบหาให้"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </>
                                }

                                <Grid item xs={12}>
                                    <TopicFavCG classes={classes} />
                                </Grid>
                                {ListFavCG.map((emp) => (
                                    <Grid item xs={12} key={emp.gmm_emp_id}>
                                        <List dense={true} style={{ padding: 0 }}>
                                            <ListItem button className={classes.ListSelect} onClick={() => { handleSelectCG(emp, 'FAVORITE-TAXI-CG') }}>
                                                <ListItemAvatar>
                                                    <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={emp.gmm_emp_fname + ' ' + emp.gmm_emp_lname}
                                                    secondary="ผู้ดูแล"
                                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                <ListItemIcon>
                                                    <Favorite color="secondary" />
                                                </ListItemIcon>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                ))}


                                <Grid item xs={12}>
                                    <Box className={classes.displayflexHead}>
                                        <ButtonChangeTaxi classes={classes} status={promise} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    }

                </>
            }

            {
                activeStep === 3 &&
                <>
                    <form onSubmit={handleSubmit3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Topic4 classes={classes} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="desc"
                                    variant="outlined"
                                    placeholder="ชื่อผู้โดยสาร"
                                    value={edit_name.name}
                                    InputProps={{
                                        disabled: true,
                                        className: classes.font_normal,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => { setEdit(true) }}>
                                                    <Edit fontSize="small" color="primary" />
                                                </IconButton>
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
                                <AutocompleteInput
                                    classes={{
                                        input: classes.font_normal,
                                        option: classes.font_normal,
                                    }}
                                    options={numb}
                                    getOptionLabel={(value) => value.gmm_num_id}
                                    getOptionSelected={(option, value) =>
                                        option.gmm_num_id === value.gmm_num_id
                                    }
                                    value={Form.book_follow}
                                    onChange={(e, item) => {
                                        setForm({ ...Form, book_follow: item });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="จำนวนผู้ติดตาม"
                                            margin="dense"
                                            variant="outlined"
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                        />
                                    )}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <AutocompleteInput
                                    classes={{
                                        input: classes.font_normal,
                                        option: classes.font_normal,
                                    }}
                                    options={equipment}
                                    getOptionLabel={(value) => value.gmm_equipment_name}
                                    getOptionSelected={(option, value) =>
                                        option.gmm_equipment_id === value.gmm_equipment_id
                                    }
                                    value={Form.book_equipment}
                                    onChange={(e, item) => { setForm({ ...Form, book_equipment: item }) }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="อุปกรณ์ที่นำไปด้วย"
                                            margin="dense"
                                            variant="outlined"
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                        />
                                    )}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="desc"
                                    variant="outlined"
                                    placeholder="รายละเอียดเพิ่มเติม"
                                    rows={3}
                                    value={Form.book_desc}
                                    onChange={(event) => {
                                        setForm({ ...Form, book_desc: event.target.value });
                                        setMsgCount(event.target.value.length);
                                    }}
                                    inputProps={{ maxLength: 120, className: classes.font_normal, }}
                                    InputProps={{
                                        className: classes.font_normal,
                                    }}
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    multiline
                                    fullWidth
                                />
                                <FormHelperText className={classes.font_smallR}>จำนวนตัวอักษร {msgCount} / 120</FormHelperText>
                            </Grid>
                            <Grid item xs={12}>
                                <Box className={classes.displayflexHead}>
                                    <ButtonBacks classes={classes} status={promise} />
                                    <ButtonNexts classes={classes} status={promise} />
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </>
            }

            {
                activeStep === 4 &&
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Topic5 classes={classes} />
                        </Grid>
                        <Grid item xs={12}>
                            <Card variant="outlined" >
                                <CardContent style={{ paddingBottom: '16px' }} >
                                    <FormLabel className={classes.font_normal} ><SectionLineI classes={classes} /></FormLabel>
                                    <FormControl component="fieldset">
                                        <Alert severity="success" className={classes.font_normal}>
                                            <AlertTitle className={classes.font_local_header}>{item.gmm_product_name}</AlertTitle>
                                            {item.gmm_product_message1} {item.reformat}
                                        </Alert>
                                        <Divider />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}><Box mt={2} className={classes.font_small}>เดินทางวันที่</Box></Grid>
                                            <Grid item xs={6}><Box mt={2} className={classes.font_small}>เวลา</Box></Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{Form.book_date_format}</Box></Grid>
                                            <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{Form.book_time_format} น.</Box></Grid>
                                        </Grid>

                                        {Form.book_add_cg &&
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}><Box mt={1} className={classes.font_normal}>สถานที่นัดผู้ดูแล : {item.point[Form.book_cg_checkpoint - 1].name}</Box></Grid>
                                                    <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{Form.book_cg_meet_point_format} น.</Box></Grid>
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
                                                        primary={Form.book_user.gmm_user_fullname + conv_formatTel(Form.book_user.gmm_user_tel)}
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
                                                        primary={Form.book_passenger.gmm_passenger_fullname + conv_formatTel(Form.book_passenger.gmm_passenger_tel)}
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
                                                        primary={Listemp.driver.gmm_emp_fname + ' ' + Listemp.driver.gmm_emp_lname + conv_formatTel(Listemp.driver.gmm_emp_tel)}
                                                        secondary={"คนขับรถ" + ' ' + Listemp.driver.gmm_emp_licenseplate}
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                    <ListItemSecondaryAction> {showIconTX && <Favorite color="secondary" />} </ListItemSecondaryAction>
                                                </ListItem>
                                            </List>
                                        </Box>
                                        {Form.book_add_cg &&
                                            <Box mt={1} mb={1} >
                                                <List dense={true} style={{ padding: 0 }}>
                                                    <ListItem style={{ paddingLeft: 0 }}>
                                                        <ListItemAvatar>
                                                            <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={Listemp.cg.gmm_emp_fname + ' ' + Listemp.cg.gmm_emp_lname + conv_formatTel(Listemp.cg.gmm_emp_tel)}
                                                            secondary="ผู้ดูแล"
                                                            classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                        <ListItemSecondaryAction> {showIconCG && <Favorite color="secondary" />} </ListItemSecondaryAction>
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
                                                <Grid item xs={6}>คนขับรถ :  {(Number(item.gmm_product_drop) !== 2) ? 'รอ ' + (Number(item.extra_tx_hr) + Number(item.gmm_product_tx_default_hour)) + ' ชั่วโมง สะสมรวมตลอดการเดินทาง' : '-'} </Grid>

                                                {Form.book_add_cg && <Grid item xs={6}>ผู้ดูแล : {(Number(item.gmm_product_drop) !== 2) ? 'ให้บริการ ' + (Number(item.extra_cg_hr) + Number(item.gmm_product_cg_default_hour)) + ' ชั่วโมง' : '-'}</Grid>}
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
                                        {item.point.map((label, index) => (
                                            <Step key={index}>
                                                <StepLabel StepIconComponent={RouteIcon}>
                                                    <Box className={classes.font_normal}>
                                                        <strong style={{ color: '#FE7569' }}>{label.name}</strong>  :
                                                        <span className={classes.font_small}> {label.location.address}</span>
                                                    </Box>
                                                    <span className={classes.font_desc}>{label.rmk !== "" && <>{label.rmk}</>}</span>
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
                                                <span className={classes.font_small}> {Form.book_follow.gmm_num_id} คน</span>
                                            </Box></Grid>
                                            <Grid item xs={12}><Box mt={1} className={classes.font_normal}>อุปกรณ์ที่นำไปด้วย :
                                                <span className={classes.font_small}> {Form.book_equipment.gmm_equipment_name}</span>
                                            </Box></Grid>
                                            <Grid item xs={12}><Box mt={1} className={classes.font_normal}>รายละเอียดเพิ่มเติม :
                                                <span className={classes.font_small}> {(Form.book_desc ? Form.book_desc : '-')}</span>
                                            </Box></Grid>
                                        </Grid>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card variant="outlined" >
                                <CardContent style={{ paddingBottom: '16px' }} >
                                    <FormLabel className={classes.font_normal} ><SectionLineVIII classes={classes} credit={Number(Form.book_user.gmm_user_credit).toLocaleString("en-US")} /></FormLabel>
                                    <FormControl component="fieldset">
                                        <RadioGroup value={Form.book_type_payment}>
                                            <List component="nav" className={classes.none_padding} dense={true}>
                                                <ListItem button onClick={() => { handlePaymenttype('PAY') }} selected={selectedIndex === 'PAY'}>
                                                    <FormControlLabel value="PAY"
                                                        classes={{ label: classes.font_normal }}
                                                        control={<Radio color="primary" required />}>
                                                    </FormControlLabel>

                                                    <ListItemText
                                                        primary="ชำระเงิน"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_normal }} />
                                                </ListItem>
                                                <Collapse in={(Form.book_type_payment === 'PAY' ? true : false)} timeout="auto" unmountOnExit>
                                                    <Box mt={0} mb={1} className={classes.none_couponflex}>
                                                        <TextField
                                                            margin="dense"
                                                            variant="outlined"
                                                            placeholder="โค้ดส่วนลด"
                                                            value={Form.book_coupon_discount}
                                                            onChange={(e) => { setForm({ ...Form, book_coupon_discount: e.target.value.toLocaleUpperCase() }) }}
                                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                            InputProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            InputLabelProps={{
                                                                className: classes.font_normal,
                                                            }}
                                                            fullWidth
                                                        />
                                                        &nbsp;&nbsp;
                                                        {!colorStatus ? // false
                                                            <Box style={{ marginTop: '3px' }} >
                                                                <Button variant="contained" color="primary"
                                                                    className={classes.font_normal}
                                                                    onClick={handlecheckCoupon}
                                                                    style={{ textTransform: 'none', whiteSpace: 'pre' }}>
                                                                    ยืนยัน
                                                                </Button>
                                                            </Box> : // true
                                                            <Box style={{ marginTop: '3px' }} >
                                                                <Button variant="contained" color="secondary"
                                                                    className={classes.font_normal}
                                                                    onClick={handleCancelCoupon}
                                                                    style={{ textTransform: 'none', whiteSpace: 'pre' }}>
                                                                    ยกเลิก
                                                                </Button>
                                                            </Box>}


                                                    </Box>
                                                    {couponStatus &&
                                                        <Box mb={1}>
                                                            {colorStatus ?
                                                                <Alert severity="success" className={classes.font_normal}>
                                                                    {Form.book_coupon_json.gmm_coupon_name}
                                                                </Alert> :
                                                                <Alert severity="error" className={classes.font_normal}>
                                                                    {Form.book_coupon_json.gmm_coupon_name}
                                                                </Alert>}

                                                        </Box>
                                                    }

                                                </Collapse>
                                                {/*######################*/}
                                                {/*###### Dev zone ######*/}
                                                <ListItem button onClick={() => { handlePaymenttype('CREDIT') }} selected={selectedIndex === 'CREDIT'}>
                                                    <FormControlLabel value="CREDIT"
                                                        classes={{ label: classes.font_normal }}
                                                        control={<Radio color="primary" required />}>
                                                    </FormControlLabel>

                                                    <ListItemText
                                                        primary="ชำระด้วยเครดิตสะสม"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_normal }} />
                                                </ListItem>
                                                <Collapse in={(Form.book_type_payment === 'CREDIT' ? true : false)} timeout="auto" unmountOnExit>
                                                    <Box mt={0} mb={1} className={classes.borderPayment2}>
                                                        <Box mt={0} mb={1} className={classes.displayflex}>
                                                            <TextField
                                                                margin="dense"
                                                                variant="outlined"
                                                                placeholder="โค้ดส่วนลด"
                                                                value={Form.book_coupon_discount}
                                                                onChange={(e) => { setForm({ ...Form, book_coupon_discount: e.target.value.toLocaleUpperCase() }) }}
                                                                inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                InputProps={{
                                                                    className: classes.font_normal,
                                                                }}
                                                                InputLabelProps={{
                                                                    className: classes.font_normal,
                                                                }}
                                                                fullWidth
                                                            />
                                                            &nbsp;&nbsp;
                                                            {!colorStatus ? // false
                                                                <Box style={{ marginTop: '3px' }} >
                                                                    <Button variant="contained" color="primary"
                                                                        className={classes.font_normal}
                                                                        onClick={handlecheckCoupon}
                                                                        style={{ textTransform: 'none', whiteSpace: 'pre' }}>
                                                                        ยืนยัน
                                                                    </Button>
                                                                </Box> : // true
                                                                <Box style={{ marginTop: '3px' }} >
                                                                    <Button variant="contained" color="secondary"
                                                                        className={classes.font_normal}
                                                                        onClick={handleCancelCoupon}
                                                                        style={{ textTransform: 'none', whiteSpace: 'pre' }}>
                                                                        ยกเลิก
                                                                    </Button>
                                                                </Box>}


                                                        </Box>
                                                        {couponStatus &&
                                                            <Box mb={1}>
                                                                {colorStatus ?
                                                                    <Alert severity="success" className={classes.font_normal}>
                                                                        {Form.book_coupon_json.gmm_coupon_name}
                                                                    </Alert> :
                                                                    <Alert severity="error" className={classes.font_normal}>
                                                                        {Form.book_coupon_json.gmm_coupon_name}
                                                                    </Alert>}

                                                            </Box>
                                                        }
                                                        <Box className={classes.displayflexTitle}>
                                                            <Box className={classes.displayflex}>
                                                                <img src="/image/wallet.png" width="32" heigth="32" />
                                                                &nbsp;

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
                                                                    InputProps={{
                                                                        className: classes.font_normal,
                                                                        endAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <Button
                                                                                    fullWidth
                                                                                    className={classes.font_small_btn} variant="contained" color="primary" size="small"
                                                                                    onClick={handlePushValue}
                                                                                >
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


                                                        <Box mt={1} className={classes.displayflexTitle}>
                                                            <Box pr={2}>

                                                                {(attachfile.name !== '') ?
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

                                                                    <Typography style={{ marginTop: '-1px' }} className={classes.font_normal}>หลักฐานการโอน : </Typography>

                                                                }
                                                            </Box>
                                                            <Box className={classes.displayflex}>
                                                                <Button
                                                                    component="label"
                                                                    disabled={(CreditTotalprice.net === 0) ? true : false}
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
                                                    </Box>


                                                </Collapse>
                                                {/* ###################### */}
                                                {/* ###################### */}
                                                <ListItem button onClick={() => { handlePaymenttype('COUPON') }} selected={selectedIndex === 'COUPON'}>
                                                    <FormControlLabel value="COUPON"
                                                        classes={{ label: classes.font_normal }}
                                                        control={<Radio color="primary" required />}>
                                                    </FormControlLabel>

                                                    <ListItemText
                                                        primary="ใช้คูปอง"
                                                        classes={{ primary: classes.font_normal, secondary: classes.font_normal }} />
                                                </ListItem>
                                                <Collapse in={(Form.book_type_payment === 'COUPON' ? true : false)} timeout="auto" unmountOnExit>

                                                    <Box mt={1} mb={1} className={classes.displayflex}>
                                                        <ListItem className={classes.ListCoupon}>
                                                            <ListItemAvatar>
                                                                {(usecouponTrip.length !== 0) ? <img src={usecouponTrip.photoUrl} width="80" height="80" /> :
                                                                    <Avatar style={{ background: '#f6f6f6' }}>
                                                                        <img src="/image/coupon.png" width="25" height="25" />
                                                                    </Avatar>
                                                                }
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                style={{ marginLeft: '12px' }}
                                                                primary={(usecouponTrip.length !== 0) ? usecouponTrip.gmm_package_name : null}
                                                                secondary={(usecouponTrip.length !== 0) ? 'ส่วนลดมูลค่า : ' + Number(usecouponTrip.discamt).toLocaleString("en-US") : 'ท่านไม่มีคูปอง / คูปองไม่สามารถใช้งานได้'}
                                                                classes={{ primary: classes.font_normal, secondary: classes.font_normal }} />

                                                            <ListItemIcon onClick={handleMyCoupon} >
                                                                <Button variant="outlined" className={classes.font_normal} color="primary" size="small">
                                                                    คูปองทั้งหมด
                                                                </Button>
                                                            </ListItemIcon>
                                                        </ListItem>
                                                    </Box>
                                                </Collapse>


                                            </List>
                                        </RadioGroup>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>

                        {(selectDiscount.promotion || selectDiscount.member) && <>
                            <Grid item xs={12}>
                                <Card variant="outlined" >
                                    <CardContent style={{ paddingBottom: '16px' }} >
                                        <ListItem className={classes.ListDiscount} style={{ marginTop: '0px' }}>
                                            <ListItemText
                                                primary="รายการส่วนลดโปรโมชั่น / สมาชิก"
                                                classes={{ primary: classes.font_local_header, secondary: classes.font_normal }} />

                                            <ListItemIcon onClick={handleChangeDiscount} >
                                                <Button variant="outlined" className={classes.font_normal} color="primary" size="small">
                                                    ส่วนลด
                                                </Button>
                                            </ListItemIcon>
                                        </ListItem>

                                        <ListItem className={classes.ListDiscountActive}>
                                            <Box className={classes.font_normal}>
                                                {(selectDiscount.promotion) ? <>
                                                    <Box className={classes.displayflex}>
                                                        <ArrowRight fontSize="small" /> &nbsp; ส่วนลด : {Promotion.data.gmm_promotion_name}
                                                        {/* ( มูลค่า : {Promotion.data.discount} ) */}
                                                    </Box>
                                                </> : (selectDiscount.member) ?
                                                    <Box className={classes.displayflex}>
                                                        <ArrowRight fontSize="small" /> &nbsp; ส่วนลด : {Member.data.gmm_member_name}
                                                    </Box> : null}
                                            </Box>
                                        </ListItem>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                        }

                        <Grid item xs={12}>
                            <Card variant="outlined" >
                                <CardContent style={{ paddingBottom: '16px' }} >
                                    <FormLabel className={classes.font_normal} ><SectionLineEX classes={classes} /></FormLabel>
                                    <FormControl component="fieldset">
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box mt={1} mb={1} pl={1}>
                                                    {item.gmm_product_name}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={3} className={classes.font_end}>
                                                <Box mt={1} mb={1}>
                                                    x1
                                                </Box>
                                            </Grid>
                                            <Grid item xs={3} className={classes.font_end}>
                                                <Box mt={1} mb={1} pr={1}>
                                                    {Number(item.gmm_product_price).toLocaleString("en-US")}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        {item.extra_tx_hr > 0 &&
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Box mb={1} pl={1}>
                                                        เพิ่มชั่วโมงคนขับรถ (ชม.ละ {Number(item['gmm_product_tx_price_hour']).toLocaleString("en-US")})
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={3} className={classes.font_end}>
                                                    <Box mb={1}>
                                                        {'x' + item.extra_tx_hr}
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={3} className={classes.font_end}>
                                                    <Box mb={1} pr={1}>
                                                        {Number(item.gmm_product_tx_price_hour).toLocaleString("en-US")}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        }
                                        {item.extra_cg_hr > 0 &&
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Box mb={1} pl={1}>
                                                        เพิ่มชั่วโมงผู้ดูแล (ชม.ละ {Number(item['gmm_product_cg_price_hour']).toLocaleString("en-US")})
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={3} className={classes.font_end}>
                                                    <Box mb={1}>
                                                        {'x' + item.extra_cg_hr}
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={3} className={classes.font_end}>
                                                    <Box mb={1} pr={1}>
                                                        {Number(item.gmm_product_cg_price_hour).toLocaleString("en-US")}
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
                                                    {Number(Totalprice.summary).toLocaleString("en-US")}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        {colorStatus &&
                                            <Grid container spacing={2}>
                                                <Grid item xs={9} className={classes.font_end}>
                                                    <Box mb={1} pl={1}>
                                                        ใช้โค้ดส่วนลด
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={3} className={classes.font_end}>
                                                    <Box mb={1} pr={1}>
                                                        {Number(Totalprice.dis_couponcode).toLocaleString("en-US")}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        }
                                        {selectDiscount.package &&
                                            <Grid container spacing={2}>
                                                <Grid item xs={9} className={classes.font_end}>
                                                    <Box mb={1} pl={1}>
                                                        ส่วนลดคูปองการเดินทาง
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={3} className={classes.font_end}>
                                                    <Box mb={1} pr={1}>
                                                        {Number(Totalprice.dis_package).toLocaleString("en-US")}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        }
                                        <Grid container spacing={2}>
                                            <Grid item xs={9} className={classes.font_end}>
                                                <Box mb={1} pl={1}>
                                                    {/* {(Number(Promotion.data.gmm_promotion_product_discount_bath) === 0)
                                                        ? 'ส่วนลดโปรโมชั่น (%)' :
                                                        'ส่วนลดโปรโมชั่น'} */}
                                                    ส่วนลดโปรโมชั่น
                                                </Box>
                                            </Grid>
                                            <Grid item xs={3} className={classes.font_end}>
                                                <Box mb={1} pr={1}>
                                                    {Number(Totalprice.dis_promotion).toLocaleString("en-US")}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={9} className={classes.font_end}>
                                                <Box mb={1} pl={1}>
                                                    {/* {(Number(Member.data.gmm_member_product_discount_bath) === 0)
                                                        ? 'ส่วนลดสมาชิก (%)' :
                                                        'ส่วนลดสมาชิก'} */}
                                                    ส่วนลดสมาชิก
                                                </Box>
                                            </Grid>
                                            <Grid item xs={3} className={classes.font_end}>
                                                <Box mb={1} pr={1}>
                                                    {Number(Totalprice.dis_member).toLocaleString("en-US")}
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
                                                    {Number(Totalprice.net).toLocaleString("en-US")}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        {/* gainsboro */}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box mt={1} className={classes.displayflexToal}>
                                                    <Box pl={1}>
                                                        <b>รวมทั้งสิ้น</b>
                                                    </Box>
                                                    <Box pr={1} style={{ fontSize: '24px' }}>
                                                        {(Form.book_type_payment !== 'CREDIT') ? '฿' + Number(Totalprice.net).toLocaleString("en-US") :
                                                            '฿' + Number(CreditTotalprice.net).toLocaleString("en-US")}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className={classes.displayflexHead}>
                                <ButtonBacks classes={classes} status={promise} />
                                <Button
                                    variant="contained"
                                    onClick={handleConfirmTrip}
                                    disabled={
                                        (Form.book_type_payment === 'CREDIT') ?
                                            (CreditTotalprice.net !== 0) ?
                                                (attachfile.base64 !== '') ? false : true
                                                : false
                                            : false
                                    }

                                    color="primary">
                                    <Box className={classes.paymentBtn}>
                                        ชำระค่าบริการ
                                    </Box>
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            }

            {
                (activeStep === 5 && dataPayment.length === 0) &&

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box p={2} className={classes.font_success} >
                            <Lottie
                                options={lottie_successOptions}
                                height={200}
                                width={200}
                                isClickToPauseDisabled
                            />
                            <Box >ขอบคุณที่ใช้บริการ</Box>
                            <span className={classes.font_normal}>(หากต้องการทำรายการต่อ กรุณากดปุ่ม "กลับสู่หน้าหลัก")</span>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button_back classes={classes} status={promise} />
                    </Grid>
                </Grid>
            }

            {
                (activeStep === 5 && dataPayment.length !== 0) &&
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Topic6 classes={classes} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box m={2} className={classes.qrcode_style}>
                            <Canvas_qrcode path={(dataPayment.length !== 0) ? dataPayment.data : ''} />

                            <Box mt={1} className={classes.font_small}>( กดปุ่มเพื่อดาวน์โหลดรูปภาพ QR Code)</Box>

                            <Button_download classes={classes} status={promise} dataPayment={dataPayment.data} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button_back classes={classes} status={promise} />
                    </Grid>
                </Grid>
            }

            < Dialog_edit edit={edit} setEdit={setEdit} edit_name={edit_name} setNameEdit={setNameEdit} pid={edit_name.pid} uid={edit_name.uid} />

            < Dialog_create create={create} setCreate={setCreate} pid={'create'} uid={(Form.book_user) && Form.book_user.gmm_user_id} getPassenger={getPassenger} />

            {/* #TAGMAP */}
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <MuiDialogTitleMap onClose={handleClose}>
                            ค้นหาสถานที่
                        </MuiDialogTitleMap>
                    </Toolbar>
                </AppBar>
                <MuiDialogContentMap dividers>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={zoom}
                        center={center}
                        options={options}
                        onClick={handleDrop}
                    >
                        {!switchInput ?
                            <Autocomplete
                                onLoad={onLoad}
                                onPlaceChanged={onPlaceChanged}
                            >
                                <Box className={classes.divInput} >
                                    <TextField
                                        style={{ alignItems: 'center' }}
                                        placeholder="Search Google Maps"
                                        variant="outlined"
                                        value={search}
                                        onChange={(e) => {
                                            setSearchs(e.target.value);
                                        }}
                                        InputProps={{
                                            className: classes.SearchInput,
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton >
                                                        <Search />
                                                    </IconButton>

                                                    <Divider className={classes.divider} orientation="vertical" />
                                                    <IconButton onClick={handleChangeInput} >
                                                        {/* {(switchInput ?  : <Search />)} */}
                                                        <SyncAlt color="primary" />
                                                    </IconButton>

                                                </InputAdornment>
                                            ),
                                        }}
                                        InputLabelProps={{
                                            className: classes.SearchInput,
                                        }}
                                    />
                                </Box>
                            </Autocomplete>
                            :
                            <Box className={classes.divInput} >
                                <TextField
                                    style={{ alignItems: 'center', }}
                                    placeholder="พิกัด (Lat, Lng)"
                                    variant="outlined"
                                    value={Location}
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                    }}
                                    InputProps={{
                                        className: classes.SearchInput,
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton onClick={FindLocation}>
                                                    <Search />
                                                </IconButton>

                                                <Divider className={classes.divider} orientation="vertical" />

                                                <IconButton onClick={handleChangeInput} >
                                                    {/* {(switchInput ?  : <Search />)} */}
                                                    <SyncAlt color="primary" />
                                                </IconButton>

                                            </InputAdornment>
                                        ),
                                    }}
                                    InputLabelProps={{
                                        className: classes.SearchInput,
                                    }}
                                />
                            </Box>
                        }

                        {(marker.lat && marker.lng) &&
                            <Marker
                                position={{ lat: marker.lat, lng: marker.lng, }}
                                icon={{
                                    url: "/image/map-marker.png",
                                    scaledSize: new window.google.maps.Size(35, 35),
                                    // origin: new window.google.maps.Point(0, 0),
                                    // anchor: new window.google.maps.Point(18, 8)
                                }}
                            />
                        }

                        {dataInfo.addr && (<InfoDetail classes={classes} />)}
                        {Hidd === 0 && <ConfirmLocation classes={classes} status={(marker.lat ? false : true)} />}
                        {Hidd === 1 && <AddLocation classes={classes} status={(marker.lat ? false : true)} />}
                        {Hidd === 2 && <EditLocation classes={classes} status={(marker.lat ? false : true)} />}
                    </GoogleMap>
                </MuiDialogContentMap>
            </Dialog>

            {/* #TAGFAVOURITE */}
            <Dialog
                open={openFavourite}
                onClose={handleCloseFavourite}
                fullWidth={true}
                maxWidth="xs"
            >
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseFavourite}>
                    เพิ่มที่อยู่โปรด
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <form id="hook_favourite" onSubmit={SubmitFavourite}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {Hidd === 0 ?
                                    <p className={classes.StyleDetail}>{IndexFavourite.address}</p> :
                                    <p className={classes.StyleDetail}>{dataInfo.addr}</p>
                                }

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    variant="outlined"
                                    placeholder="ชื่อสถานที่"
                                    value={FmFavourite.name}
                                    onChange={(e) => { setFmFavourite({ ...FmFavourite, name: e.target.value }) }}
                                    inputProps={{ maxLength: 80, className: classes.font_normal, }}
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
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    variant="outlined"
                                    placeholder="รายละเอียดเพิ่มเติม"
                                    value={FmFavourite.desc}
                                    onChange={(e) => {
                                        setFmFavourite({ ...FmFavourite, desc: e.target.value });
                                        setMsgCountFVR(e.target.value.length);
                                    }}
                                    inputProps={{ maxLength: 60, className: classes.font_normal, }}
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
                                <FormHelperText className={classes.font_smallR}>จำนวนตัวอักษร {msgCountFavourite} / 60</FormHelperText>
                            </Grid>

                        </Grid>
                    </form>
                </MuiDialogContent>
                <DialogActions>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box mt={1} mb={1} className={classes.Submit}>
                                <Button
                                    form="hook_favourite"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.font_normal}
                                    startIcon={<Add />}

                                >
                                    เพิ่มที่อยู่โปรด
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* #TAGBOOKMARKS */}
            <Dialog
                onClose={handleCloseBooks}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openBooks}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseBooks}>
                    ที่อยู่โปรด
                </MuiDialogTitle>
                <MuiDialogContentBks dividers>
                    {Bookmarks.length !== 0 ?
                        <List dense={true}>
                            {Bookmarks.map((list, index) => (
                                <ListItem onClick={() => { handleSeleteFavourite(list) }} button key={index}>
                                    <ListItemAvatar>
                                        <Avatar style={{ background: 'white' }}>
                                            <LocationOn color="secondary" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={list.favourite_name} secondary={list.favourite_address}
                                        classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                    {openEdits ?
                                        <ListItemSecondaryAction>
                                            &nbsp;
                                            <IconButton onClick={() => { handleEditBooks(list) }}>
                                                <Edit color="primary" fontSize="small" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                        :
                                        <ListItemSecondaryAction>
                                            &nbsp;
                                            <IconButton onClick={() => { handleDeleteBooks(list) }}>
                                                <Close color="secondary" fontSize="small" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    }

                                </ListItem>
                            ))}
                        </List>
                        :
                        <Box className={classes.font_success} >
                            <Lottie
                                options={lottie_notfoundOptions}
                                height={200}
                                width={200}
                                isClickToPauseDisabled
                            />
                        </Box>
                    }
                </MuiDialogContentBks>
                <DialogActions>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box mt={1} mb={1} className={classes.Submit}>
                                {Bookmarks.length !== 0 &&
                                    <>
                                        <Button
                                            onClick={() => { setOpenEdits(!openEdits) }}
                                            variant="outlined"
                                            color="primary"
                                            className={classes.font_normal}
                                            startIcon={(openEdits ? <Close color="secondary" fontSize="small" /> : <Edit />)}
                                        >
                                            จัดการที่อยู่
                                        </Button>    &nbsp;&nbsp;
                                    </>
                                }
                                <Button
                                    onClick={() => { handleADDFavourite(1) }}
                                    variant="contained"
                                    color="primary"
                                    className={classes.font_normal}
                                    startIcon={<Add />}
                                >
                                    เพิ่มที่อยู่โปรด
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* #TAGDISCOUNT */}
            <Dialog
                onClose={handleCloseDiscount}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openDiscount}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseDiscount}>
                    รายการส่วนลด
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    {ItemDiscount.map((desc, index) =>
                        <Box key={index}>
                            {desc.type === 'MEMBER' ?
                                <ListItem className={classes.ListDiscountDialog} onClick={() => { handleSelectDiscount('MEMBER', desc) }}>
                                    <ListItemText
                                        primary="ส่วนลดสมาชิก"
                                        secondary={<>
                                            <span>ส่วนลด : {desc.discount} บาท  </span>
                                            <br />
                                            <span>ใช้ได้ถึงวันที : {desc.gmm_user_member_exp.monthdesc}  </span>
                                        </>}

                                        classes={{ primary: classes.font_local_header, secondary: classes.font_normal }} />

                                    <ListItemIcon >
                                        <Button variant="outlined" className={classes.font_normal} color="primary" size="small">
                                            เลือก
                                        </Button>
                                    </ListItemIcon>
                                </ListItem> :
                                <ListItem className={classes.ListDiscountDialog} onClick={() => { handleSelectDiscount('PROMOTION', desc) }}>
                                    <ListItemText
                                        primary="ส่วนลดโปรโมชั่น"
                                        secondary={<>
                                            <span>ส่วนลด : {desc.discount} บาท  </span>

                                            <br />
                                            <span>ใช้ได้ถึงวันที : {desc.gmm_promotion_end.monthdesc}  </span>
                                        </>}
                                        classes={{ primary: classes.font_local_header, secondary: classes.font_normal }} />

                                    <ListItemIcon >
                                        <Button variant="outlined" className={classes.font_normal} color="primary" size="small">
                                            เลือก
                                        </Button>
                                    </ListItemIcon>
                                </ListItem>}
                        </Box>
                    )}

                </MuiDialogContent>
            </Dialog>

            {/* #TAGCOUPON */}
            <Dialog
                onClose={handleCloseMyCoupon}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openCoupon}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseMyCoupon}>
                    คูปองทั้งหมด
                </MuiDialogTitle>
                <MuiDialogContent dividers>

                    {Mycoupon.map((detail, index) =>
                        <ListItem button onClick={() => { handleSelectCouponTrip(detail) }} className={classes.ListMycoupon} key={index} disabled={detail.tr_package_addr !== item.gmm_product_id}>
                            <ListItemAvatar>
                                {/* <Avatar src="/image/coupon.png" style={{ background: '#f5f5f5' }} >
                                </Avatar> */}
                                <img src={detail.photoUrl + '?' + new Date().getTime()} width="120" height="120" />
                            </ListItemAvatar>
                            <ListItemText
                                style={{ marginLeft: '24px' }}
                                primary={detail.gmm_package_name}
                                secondary={
                                    <>
                                        <span>สำหรับ : {detail.tr_package_name}  </span>
                                        <br />
                                        <span>หมดอายุการใช้งาน : {detail.monthdesc.monthdesc} {detail.monthdesc.time}  </span>
                                    </>}
                                classes={{ primary: classes.font_local_header, secondary: classes.font_mormal_small }} />


                        </ListItem>
                    )}

                    {Mycoupon.length === 0 && <Box className={classes.font_success} >
                        <Lottie
                            options={lottie_notfoundOptions}
                            height={200}
                            width={200}
                            isClickToPauseDisabled
                        />
                    </Box>}

                </MuiDialogContent>
            </Dialog>

            {/* #TAGFAVTRIP */}
            <Dialog
                onClose={handleClosSettings}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openSetting}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleClosSettings}>
                    จัดการทริป
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <List dense={true}>
                        {CopyFavouriteTrip.map((detail, index) =>

                            <ListItem button onClick={() => { handleActiveFav(detail, index) }} className={classes.ListMycoupon} key={detail.favour_nbr}>
                                <ListItemAvatar  >
                                    <Avatar style={{ background: '#fafafa' }} >
                                        {detail.favour_status === 'INACTIVE' ?
                                            <BookmarkBorder color="primary" />
                                            :
                                            <Bookmark color="primary" />
                                        }

                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={detail.favour_name}
                                    classes={{ primary: classes.font_local_header, secondary: classes.font_mormal_small }} />



                                {openEditsTrip ?
                                    <ListItemSecondaryAction>
                                        &nbsp;
                                        <IconButton onClick={() => { handleEditFavTrip(detail, index) }}>
                                            <Edit color="primary" fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                    :
                                    <ListItemSecondaryAction>
                                        &nbsp;
                                        <IconButton onClick={() => { handleDeleteFavTrip(detail, index) }}>
                                            <Close color="secondary" fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                }
                            </ListItem>
                        )}
                    </List>
                </MuiDialogContent>
                <DialogActions>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box mt={1} mb={1} className={classes.Submit}>
                                <Button
                                    onClick={() => { setOpenEditsTrip(!openEditsTrip) }}
                                    variant="outlined"
                                    color="primary"
                                    className={classes.font_normal}
                                    startIcon={(openEditsTrip ? <Close color="secondary" fontSize="small" /> : <Edit />)}
                                >
                                    จัดการทริป
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogActions>
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
        </>
    );
}


ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};

RouteIcon.propTypes = {
    /**
   * Whether this step is active.
   */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,

}
