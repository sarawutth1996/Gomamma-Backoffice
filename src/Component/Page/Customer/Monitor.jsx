/* eslint-disable */
import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import { useParams } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Avatar, AppBar, Dialog, Toolbar, Backdrop, Button, Box, Container, Chip, Collapse, Checkbox, Card, CardContent, CardHeader, Divider, DialogTitle, DialogContent,
    DialogActions, Tabs, Tab, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemAvatar, ListItemText,
    FormGroup, FormControlLabel, FormControl, FormLabel, TextField, IconButton, Typography, Grid, FormHelperText,
    InputAdornment, StepConnector, StepLabel, Stepper, Step, StepContent, Fab, RadioGroup, Radio
} from "@material-ui/core";
import AutocompleteInput from '@material-ui/lab/Autocomplete';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Assignment, AccessTime, Close, CheckCircleOutline, Share, LocationOn, FormatListNumbered, Wc, Work, DataUsage, Person,
    DirectionsWalk, Favorite, SportsKabaddi, PhotoCamera, Chat, LibraryMusic, RecordVoiceOver, Cake

} from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import config from '../../config';

//Google-map
import { Autocomplete, GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Lottie from 'react-lottie';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

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

const AntTabs = withStyles({
    indicator: {
        // backgroundColor: '#FFCB08',
        border: 'solid 2px #FFCB08'
    },
})(Tabs);

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

const ColorRouteConnectorDefault = withStyles({
    active: {
        '& $line': {
            // backgroundImage:
            //     'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            borderColor: '#FFCB08'
        },
    },
    completed: {
        '& $line': {
            // backgroundImage:
            //     'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',

            borderColor: '#FFCB08'
        },
    },

    line: {
        marginTop: 0,
        marginLeft: '10px',
        borderLeftWidth: '4px',
    },
    vertical: {
        padding: '0 0 0 0'
    }
})(StepConnector);

const ColorRouteConnector = withStyles({
    active: {
        '& $line': {
            // backgroundImage:
            //     'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            borderColor: '#FFCB08'
        },
    },
    completed: {
        '& $line': {
            // backgroundImage:
            //     'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',

            borderColor: '#FFCB08'
        },
    },

    line: {
        marginTop: 0,
        marginLeft: '10px',
        borderColor: '#FFCB08',
        borderLeftWidth: '4px',
    },
    vertical: {
        padding: '0 0 0 0'
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

    TripSuccess: {
        background: '#FFCB08',
        // backgroundImage:
        //     'linear-gradient(136deg, #ff5722 0%, #FFCB08 50%, rgb(255 247 234) 100%)',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,.25)',
    }
});

const useStyles = makeStyles((theme) => ({
    ChipStyle: {
        background: 'white',
        width: '65%',
        fontFamily: 'Regular',
        fontSize: '14px',
        border: 'solid 1px #d5d5d5'
    },
    border_active: {
        borderTop: 'solid 3px #FFCB07',
        background: '#eeeeee !important'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    ListSelect: {
        paddingTop: '8px',
        paddingBottom: '8px',
        background: '#f6f6f6',
        '&:hover': {
            background: '#eeeeee',
        },
    },
    ListTrip: {
        padding: '6px',
        borderRight: 'solid 1px gainsboro'
    },
    seizeUpper: {
        height: '100vh',

    },
    displayflex: {
        display: "flex",
        alignItems: "center",
    },
    infodetail: {
        position: 'fixed',
        // left: '0',
        // bottom: '0',
        width: '100%',
        textAlign: 'center',
        // marginBottom: '60px'
    },
    trip_meesage: {
        zIndex: '1',
        position: 'relative',
        left: '0',
        bottom: '0',
        margin: '8px',
        textAlign: 'center'
    },
    root: {
        flexGrow: 1,
        border: '1px solid #eeeeee'
    },
    rootContentNull: {
        marginTop: '0px',
        borderLeft: '4px solid #bdbdbd',
        marginLeft: '22px',
        paddingLeft: '40px',
        paddingRight: '8px',
    },
    rootContentActive: {
        marginTop: '0px',
        borderLeft: '4px solid #FFCB08',
        marginLeft: '22px',
        paddingLeft: '40px',
        paddingRight: '8px',
    },
    rootContentWait: {
        marginTop: '0px',
        borderLeft: '4px solid #FFCB08',
        marginLeft: '22px',
        paddingLeft: '40px',
        paddingRight: '8px',
    },
    Hovercursor: {
        cursor: 'pointer',

    },
    imgResize: {
        cursor: 'pointer',
        width: "100px",
        height: "100px",
        padding: '4px'
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
    font_desc: {
        fontFamily: 'Regular',
        fontSize: '12px',
        wordBreak: 'break-all',
        color: 'gray'
    },
    fab: {
        zIndex: 2,
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        background: '#00a3ff',
        '&:hover': {
            background: '#32b5ff',
            // color: 'white',
        },
    },

}));

function Header({ classes, id }) {
    return (
        <>
            <Box pt={2} pb={0}>
                <Box className={classes.displayflex}>
                    <LocationOn style={{ color: '#FE7569' }} />
                    <Typography className={classes.font_header}>Tracking & Trace {(id !== undefined) && '(' + id + ')'} </Typography>
                </Box>
            </Box>
            <PageLine />
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

function TopicII({ classes }) {
    return (
        <>
            <Box pt={2} pb={0}>
                <Box className={classes.displayflex}>
                    <Person />
                    <Typography className={classes.font_header}>ข้อมูลเพื่อบริการพิเศษที่ถูกใจผู้โดยสาร (เป็นทางเลือก)</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
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

function DialogHeadersII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    {/* <Favorite fontSize="small" /> */}
                    <img src="/image/stethoscope.png" height="28" width="28" />
                    <Typography className={classes.font_subheader}>&nbsp;โรคประจำตัว (เลือกได้มากกว่า 1 ข้อ) *</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersIII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <DirectionsWalk />
                    <Typography className={classes.font_subheader}> ความสามารถในการเดิน *</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersIV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <img src="/image/helper.png" height="24" width="24" />
                    <Typography className={classes.font_subheader}>&nbsp;ความต้องการให้ผู้บริการช่วยพยุง/ประคอง *</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function DialogHeadersV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Assignment />
                    <Typography className={classes.font_subheader}>&nbsp;ความสนใจ (เลือกได้มากกว่า 1 ข้อ) </Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersVI({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <RecordVoiceOver />
                    <Typography className={classes.font_subheader}>&nbsp;คำที่ต้องการให้ใช้เรียกแทนชื่อ (ถ้ามี)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersVII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <LibraryMusic />
                    <Typography className={classes.font_subheader}>&nbsp;ประเภทเพลงที่ชื่นชอบ</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersVIII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Cake />
                    <Typography className={classes.font_subheader}>&nbsp;วัน-เดือนเกิด</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersIX({ classes }) {
    return (
        <>
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <Chat />
                    <Typography className={classes.font_subheader}>&nbsp;ข้อมูลอื่นๆ ที่ต้องการแจ้งให้ผู้บริการทราบ</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function DialogHeadersIIX({ classes }) {
    return (
        <>
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <PhotoCamera />
                    <Typography className={classes.font_subheader}>&nbsp;ต้องการให้ถ่ายภาพผู้โดยสารส่งให้ผู้จองระหว่างการเดินทางหรือไม่ ? *</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
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
                <Box p={0} className={classes.font_normal}>{children}</Box>
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

const profilepass = {
    id: '',
    fname: '',
    lname: '',
    sex: null,
    weight: '',
    height: '',
    age: null,
    tel: '',
    disease_question: '2',
    walk_question: '1',
    cg_question: '1',
    hobby_question: '2',
    camera_question: '1',
    disease_json: '', // โรคประจำตัว
    disease_other: '', // กรณีเลือกอื่นๆ
    hobby_json: null, // งานอดิเรก / ความสนใจ
    hobby_other: '', // กรณีเลือกอื่นๆ
    Message: '', //คำที่ต้องการให้ใช้เรียกแทนชื่อ
    music_json: null, // music json
    music_other: '', // กรณีเลือกอื่นๆ
    day: null, // วันเกิด
    month: null, // เดือนเกิด
    note: '', // รายละเอียดเพิ่มเติม
    errorTel: {
        status: false,
        message: '',
    },
    errorDisease: {
        message: '',
        status: false
    }
}



export default function Monitor() {
    const url_user = config.API_URL + "models/Customer/Customer_profile.php";
    const url = config.API_URL + "models/Tracking/Tracking.php";
    const { vision, id } = useParams();
    const classes = useStyles();
    const [promise, setPromise] = useState(false);
    const [isLoading, setBoolean] = useState(false);
    const [openShowUser, setOpenShowUser] = useState(false);
    const [openShowPassenger, setOpenShowPassenger] = useState(false);
    const [activeStep, setActiveStep] = useState(null);
    const [count, setCount] = useState(null);
    const [PrimaryStep, setPrimaryStep] = useState([]);
    const [Total, setTotal] = useState(null);
    //Google-Map

    const [open, setOpen] = useState(false);
    const [TabControl, setTabControl] = useState(0);
    const [header, setHeader] = useState([]);
    const [location, setLocation] = useState([]);

    const [showImage, setShowImage] = useState(null);
    const [preview, setPreview] = useState(false)
    const [lottie, setLottie] = useState(false)
    const [CGon, setCGon] = useState(false)
    const [TXon, setTXon] = useState(false)
    const [TrackID, setTrackID] = useState(null)
    const [showInfo, setShow] = useState({
        booking_nbr: null,
        booking_status: null,
        booking_product_name: null,
        booking_product_desc: null,
        booking_date: null,
        booking_time: null,
        booking_u_tel: "",
        booking_p_tel: "",
        booking_t_tel: "",
        booking_c_tel: "",
        booking_licenseplate: null,
        booking_user_id: null,
        booking_pass_id: null,
        booking_u: null,
        booking_p: null,
        booking_t: null,
        booking_c: null,
        booking_hrtx: null,
        booking_hrcg: null,
        booking_txhrdefault: null,
        booking_cghrdefault: null,
        booking_product_drop: null,
        booking_follower: null,
        booking_desc: null,
        booking_equipment: null,
        booking_point: [],
    })

    //Data Master
    const [sex, setSex] = useState([]);
    const [number, setNumbers] = useState([]);
    const [month, setMonths] = useState([]);
    const [music, setMusics] = useState([]);
    const [hobby, setHobbys] = useState([]);
    const [disease, setDisease] = useState([]);
    const [cg_question, setCg_question] = useState([]);
    const [walk_question, setWalk_question] = useState([]);
    const [camera_question, setCamera_question] = useState([]);
    const [disease_question, setDisease_question] = useState([]);
    const [Form, setForm] = useState(profilepass);
    const [msgCount, setMsgCount] = useState(0);
    const [year, setYear] = useState([]);
    const [showIconTX, setIconTX] = useState(false);
    const [showIconCG, setIconCG] = useState(false);
    const [showborder, setBorder] = useState({
        TX: true,
        CG: false
    });

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);

        const interval = setInterval(() => {
            startGetPosition();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Book_tracking",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(300);
        const res = await response.json();
        if (res.status) {
            // set value
            if (res.CGon === true && res.TXon === true) {
                setCGon(true)
                setTXon(true)
                setCount(res.count)
                setActiveStep(res.count)
                setPrimaryStep(res.data)
                setHeader(res.title)
                setBoolean(false);
                setLottie(false)
                setZoom(14)
                setCenters({ ...center, lat: Number(res.positionTX.lat), lng: Number(res.positionTX.lat) })

                let calc = (res.data.length - res.total)
                let sum = (res.data.length - calc)
                setTotal(sum)
            } else if (res.CGon === false && res.TXon === true) {
                setCGon(false)
                setTXon(true)
                setCount(res.count)
                setActiveStep(res.count)
                setPrimaryStep(res.data)
                setHeader(res.title)
                setBoolean(false);
                setLottie(false)
                setZoom(14)
                setCenters({ ...center, lat: Number(res.positionTX.lat), lng: Number(res.positionTX.lat) })

                let calc = (res.data.length - res.total)
                let sum = (res.data.length - calc)
                setTotal(sum)
            } else if (res.CGon === true && res.TXon === false) {
                setCGon(true)
                setTXon(false)
                setCount(res.count)
                setActiveStep(res.count)
                setPrimaryStep(res.data)
                setHeader(res.title)
                setBoolean(false);
                setLottie(false)
                setZoom(14)
                setCenters({ ...center, lat: Number(res.positionCG.lat), lng: Number(res.positionCG.lat) })

                let calc = (res.data.length - res.total)
                let sum = (res.data.length - calc)
                setTotal(sum)
            }

            let substr = res.Trip.desc.gmm_booking_travel_start.split(' ');
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let convert = new Date(res.Trip.desc.gmm_booking_travel_start);
            let date_format = convert.toLocaleDateString("th", options);

            setIconTX(res.Trip.desc.icon_tx)
            setIconCG(res.Trip.desc.icon_cg)
            setShow({
                ...showInfo,
                booking_nbr: res.Trip.desc.gmm_booking_nbr,
                booking_status: res.Trip.desc.gmm_booking_status,
                booking_product_name: res.Trip.desc.gmm_product_name,
                booking_product_desc: res.Trip.desc.gmm_product_desc,
                booking_date: date_format,
                booking_time: substr[1],
                booking_user_id: res.Trip.desc.gmm_user_id,
                booking_pass_id: res.Trip.desc.gmm_booking_passenger_id,
                //---------------------
                booking_u_tel: conv_formatTel(res.Trip.desc.gmm_user_tel),
                booking_p_tel: conv_formatTel(res.Trip.desc.gmm_passenger_tel),
                booking_t_tel: conv_formatTel(res.Trip.desc.gmm_tx_tel),
                booking_c_tel: (res.Trip.desc.gmm_booking_cg_radio === 'ON') ? conv_formatTel(res.Trip.desc.gmm_cg_tel) : null,
                booking_licenseplate: res.Trip.desc.gmm_emp_licenseplate,
                //---------------------
                booking_u: res.Trip.desc.gmm_user_fullname,
                booking_p: res.Trip.desc.gmm_passenger_fullname,
                booking_t: res.Trip.desc.gmm_tx_fullname,
                booking_c: (res.Trip.desc.gmm_booking_cg_radio === 'ON') ? res.Trip.desc.gmm_cg_fullname : null,
                //---------------------
                booking_hrtx: Number(res.Trip.desc.gmm_booking_taxi_hradd),
                booking_hrcg: (res.Trip.desc.gmm_booking_cg_radio === 'ON') ? Number(res.Trip.desc.gmm_booking_cg_hradd) : null,
                booking_txhrdefault: res.Trip.desc.gmm_booking_taxi_hrdefault,
                booking_cghrdefault: res.Trip.desc.gmm_booking_cg_hrdefault,
                booking_product_drop: res.Trip.desc.gmm_booking_product_drop,
                //---------------------
                booking_follower: (res.Trip.desc.gmm_booking_rmks_follower) ? res.Trip.desc.gmm_booking_rmks_follower : 0,
                booking_desc: (res.Trip.desc.gmm_booking_rmks_desc) ? res.Trip.desc.gmm_booking_rmks_desc : '-',
                booking_equipment: res.Trip.desc.gmm_booking_rmks_equipment,
                //---------------------
                booking_point: res.Trip.desc.point,
                booking_startpoint: Number(res.Trip.desc.gmm_booking_cg_startpoint) - 1,
                booking_starttime: res.Trip.desc.gmm_booking_cg_starttime,
            })


            setPositionTX({ ...positionTX, lat: Number(res.positionTX.lat), lng: Number(res.positionTX.lng) })
            setPositionCG({ ...positionCG, lat: Number(res.positionCG.lat), lng: Number(res.positionCG.lng) })
            setMessage((res.message) ? res.message.gmm_booking_ac_message1 : null)
            setLocation(res.location)
            setTrackID(res.trackID)
        } else {
            setBoolean(false);
            setLottie(true)
        }
    }

    async function ChangeRole(value) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeRoleID",
            id: id,
            value: value
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(300);
        const res = await response.json();
        if (res.status) {
            setCGon(true)
            setTXon(true)
            setCount(res.count)
            setActiveStep(res.count)
            setPrimaryStep(res.data)
            // setHeader(res.title)
            setBoolean(false);
            setLottie(false)

            let calc = (res.data.length - res.total)
            let sum = (res.data.length - calc)
            setTotal(sum)

        } else {
            setBoolean(false);
            setLottie(true)
        }
    }

    async function Profilepassenger() {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_passenger_master",
            id: showInfo.booking_pass_id
        });

        const response = await fetch(url_user, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (res.data.length !== 0) {
                setForm(res.data);
                setMsgCount(res.data.note.length);
            }

            setYear(res.year)
            setSex(res.sex)
            setNumbers(res.number)
            setMonths(res.month)
            setMusics(res.music)
            setHobbys(res.hobby)
            setDisease(res.disease)
            setWalk_question(res.walk)
            setCg_question(res.question2)
            setCamera_question(res.question2)
            setDisease_question(res.question1)
            setBoolean(false);
            setOpenShowPassenger(true)
        }
    }

    async function startGetPosition() {
        const payload = JSON.stringify({
            key: "GPS",
            id: id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            const routeTX = res.positionTX;
            const routeCG = res.positionCG;

            setPositionTX({ ...positionTX, lat: Number(routeTX.lat), lng: Number(routeTX.lng) })
            setPositionCG({ ...positionCG, lat: Number(routeCG.lat), lng: Number(routeCG.lng) })
            setMessage((res.message) ? res.message.gmm_booking_ac_message1 : null)
        }
    }

    function RouteIconDesc(props) {
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

    function RouteIcon(props) {
        const classes = useColorlibStepIconStyles();
        const { active, completed, icon } = props;

        return (
            <>
                {icon <= (count + 1) && count !== null ?
                    <div className={clsx(classes.root, classes.TripSuccess)}>
                        <CheckCircleOutline fontSize="large" />

                    </div>
                    :
                    <div className={clsx(classes.root, {
                        // [classes.active]: active,
                        // [classes.completed]: completed,
                    })}> <AccessTime fontSize="large" />
                    </div>
                }
            </>
        );
    }


    const ColorRouteConnectorDesc = withStyles({
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

    const handleChangeTabs = (event, newValue) => {
        setTabControl(newValue);
    };

    const handleActives = (label, index) => {
        if (label.gmm_booking_ac_action !== null) {
            setActiveStep(index)
        }
    }

    const handleClickImage = (path) => {
        setPreview(true)
        setShowImage(path);
    }

    const handlePreviewClose = () => {
        setPreview(false)
    }

    const handleOpenShowPassenger = () => {
        Profilepassenger()
    }

    const handleClosShowPassenger = () => {
        setOpenShowPassenger(false)
    }

    const handleShare = str => {
        const url = config.PATH_URL + 'Tracking/' + str
        window.open(url);
    }

    const handChangeRole = (value) => {
        if (value === 0) {
            setBorder({ ...showborder, TX: true, CG: false })
        } else {
            setBorder({ ...showborder, TX: false, CG: true })
        }
        //.
        ChangeRole(value)
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

    // Google Map
    const [zoom, setZoom] = useState(12);
    const [center, setCenters] = useState({ lat: 13.762459861106006, lng: 100.49094949418699 })
    const [positionTX, setPositionTX] = useState({ lat: null, lng: null })
    const [positionCG, setPositionCG] = useState({ lat: null, lng: null })
    const [messageTrip, setMessage] = useState(null)
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: APIkey,
        libraries,
        language,
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
        gestureHandling: "greedy",
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER // 'right-center' ,
        }
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Box className={classes.root}>
                <AppBar position="static" color="default">
                    <AntTabs
                        value={TabControl}
                        onChange={handleChangeTabs}
                        variant="fullWidth"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        <Tab className={classes.font_local_header} label="แผนที่" {...a11yProps(0)} />
                        <Tab className={classes.font_local_header} label="สถานะ" {...a11yProps(1)} />
                        <Tab className={classes.font_local_header} label="รายละเอียด" {...a11yProps(2)} />
                    </AntTabs>
                </AppBar>

                <TabPanel value={TabControl} index={0} classes={classes}>
                    <Box style={{ height: '70vh', width: '100%' }}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={zoom}
                            center={center}
                            options={options}
                        >
                            {messageTrip !== null &&
                                <Box className={classes.trip_meesage}>
                                    <Chip className={classes.ChipStyle} label={messageTrip} />
                                </Box>
                            }


                            {location.map((position) => (
                                <Box key={Number(position.gmm_location_route)}>

                                    <Marker
                                        position={{ lat: Number(position.gmm_location_lat), lng: Number(position.gmm_location_lng) }}
                                        icon={{
                                            url: "/image/map-marker.png",
                                            scaledSize: new window.google.maps.Size(30, 30),
                                            origin: new window.google.maps.Point(0, 0),
                                            anchor: new window.google.maps.Point(15, 12)
                                        }}
                                    />

                                    <InfoWindow
                                        position={{ lat: Number(position.gmm_location_lat), lng: Number(position.gmm_location_lng) }}
                                        closeButton="false"
                                    >
                                        <div className={classes.font_normal}> {position.gmm_location_route_name}

                                        </div>

                                    </InfoWindow>

                                </Box>


                            ))}



                            {(positionTX.lat && positionTX.lng) &&
                                <Box>
                                    <Marker
                                        position={{ lat: positionTX.lat, lng: positionTX.lng }}
                                        icon={{
                                            url: "/image/taxi.png",
                                            scaledSize: new window.google.maps.Size(40, 40),
                                            origin: new window.google.maps.Point(0, 0),
                                            anchor: new window.google.maps.Point(18, 12)
                                        }}
                                    />

                                    <InfoWindow
                                        position={{ lat: Number(positionTX.lat), lng: Number(positionTX.lng) }}
                                        closeButton="false"
                                    >
                                        <div className={classes.font_normal}> คนขับรถ
                                        </div>

                                    </InfoWindow>
                                </Box>
                            }


                            {(positionCG.lat && positionCG.lng) &&
                                <Box>
                                    <Marker
                                        position={{ lat: positionCG.lat, lng: positionCG.lng }}
                                        icon={{
                                            url: "/image/cgicon.png",
                                            scaledSize: new window.google.maps.Size(40, 40),
                                            origin: new window.google.maps.Point(0, 0),
                                            anchor: new window.google.maps.Point(18, 12)
                                        }}
                                    />

                                    <InfoWindow
                                        position={{ lat: Number(positionCG.lat), lng: Number(positionCG.lng) }}
                                        closeButton="false"
                                    >
                                        <div className={classes.font_normal}> ผู้ดูแล
                                        </div>

                                    </InfoWindow>
                                </Box>
                            }



                        </GoogleMap>
                    </Box>
                    <Box >
                        <Box>
                            <Card style={{
                                zIndex: '1',
                                position: 'relative',
                                left: '0',
                                bottom: '0',
                                margin: '0px'
                            }}>
                                <CardContent style={{ padding: 0 }}>
                                    <Grid container spacing={0} style={{ background: '#f7f7f7' }}>
                                        {(TXon === true && CGon === true) &&
                                            <>
                                                <Grid item xs={12} sm={12} md={4}>
                                                    <List style={{ padding: 0 }}>
                                                        <ListItem className={classes.ListTrip}>
                                                            <ListItemAvatar>
                                                                <Avatar src="/image/picon.png" style={{ background: '#FFCB08' }}>
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={header.username + showInfo.booking_u_tel}
                                                                secondary="ผู้จอง"
                                                                classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4}>
                                                    <List style={{ padding: 0 }}>
                                                        <ListItem className={classes.ListTrip}>
                                                            <ListItemAvatar>
                                                                <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={header.taxiname + showInfo.booking_t_tel}
                                                                secondary={'คนขับรถ' + ' ' + showInfo.booking_licenseplate}
                                                                classes={{ primary: classes.font_normal, secondary: classes.font_small }} />

                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4}>
                                                    <List style={{ padding: 0 }}>
                                                        <ListItem className={classes.ListTrip}>
                                                            <ListItemAvatar>
                                                                <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={header.cgname + showInfo.booking_c_tel}
                                                                secondary="ผู้ดูแล"
                                                                classes={{ primary: classes.font_normal, secondary: classes.font_small }} />

                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                            </>
                                        }

                                        {(TXon === true && CGon === false) && <>
                                            <Grid item xs={12} sm={6}>
                                                <List style={{ padding: 0 }}>
                                                    <ListItem className={classes.ListTrip}>
                                                        <ListItemAvatar>
                                                            <Avatar src="/image/picon.png" style={{ background: '#FFCB08' }}>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={header.username + showInfo.booking_u_tel}
                                                            secondary="ผู้จอง"
                                                            classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <List style={{ padding: 0 }}>
                                                    <ListItem className={classes.ListTrip}>
                                                        <ListItemAvatar>
                                                            <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={header.taxiname + showInfo.booking_t_tel}
                                                            secondary={'คนขับรถ' + ' ' + showInfo.booking_licenseplate}
                                                            classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                        </>}

                                        {(TXon === false && CGon === true) && <>
                                            <Grid item xs={12} sm={6}>
                                                <List style={{ padding: 0 }}>
                                                    <ListItem className={classes.ListTrip}>
                                                        <ListItemAvatar>
                                                            <Avatar src="/image/picon.png" style={{ background: '#FFCB08' }}>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={header.username + showInfo.booking_u_tel}
                                                            secondary="ผู้จอง"
                                                            classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <List style={{ padding: 0 }}>
                                                    <ListItem className={classes.ListTrip}>
                                                        <ListItemAvatar>
                                                            <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={header.cgname + showInfo.booking_c_tel}
                                                            secondary="ผู้ดูแล"
                                                            classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                        </>}

                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </TabPanel>
                <TabPanel value={TabControl} index={1} classes={classes}>
                    <Container maxWidth="lg">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Header classes={classes} id={header.id} />
                            </Grid>

                            {(TXon === true && CGon === true) &&
                                <>
                                    <Grid item xs={12} sm={4}>
                                        <List style={{ padding: 0 }}>
                                            <ListItem button className={classes.ListSelect} >
                                                <ListItemAvatar>
                                                    <Avatar src="/image/passengericon.png" style={{ background: '#FFCB08' }}>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={header.name + showInfo.booking_p_tel}
                                                    secondary="ผู้โดยสาร"
                                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                            </ListItem>
                                        </List>
                                    </Grid>


                                    {/* #eeeeee */}
                                    <Grid item xs={12} sm={4}>
                                        <List style={{ padding: 0 }}>
                                            <ListItem className={clsx(classes.ListSelect, { [classes.border_active]: showborder.TX })} button onClick={() => { handChangeRole(0) }}>
                                                <ListItemAvatar>
                                                    <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                    </Avatar>
                                                </ListItemAvatar>

                                                <ListItemText
                                                    primary={header.taxiname + showInfo.booking_t_tel}
                                                    secondary={'คนขับรถ' + ' ' + showInfo.booking_licenseplate}
                                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <List style={{ padding: 0 }} >
                                            <ListItem className={clsx(classes.ListSelect, { [classes.border_active]: showborder.CG })} button onClick={() => { handChangeRole(1) }}>
                                                <ListItemAvatar>
                                                    <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }} >
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={header.cgname + showInfo.booking_c_tel}
                                                    secondary="ผู้ดูแล"
                                                    classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box mb={4}>
                                            <Stepper activeStep={activeStep} orientation="vertical"
                                                style={{ padding: '0px 0px 12px 0px' }}>
                                                {PrimaryStep.map((label, index) => (
                                                    <Step key={index}
                                                        connector={
                                                            (count === (PrimaryStep.length - 1)) ? <ColorRouteConnector /> :
                                                                ((index) <= (Total)) ? <ColorRouteConnector /> :
                                                                    <ColorRouteConnectorDefault />
                                                        }
                                                    >
                                                        <StepLabel StepIconComponent={RouteIcon} className={classes.Hovercursor} onClick={() => { handleActives(label, index) }}>
                                                            <Box pl={1} className={classes.font_normal}>
                                                                <Box>
                                                                    <Box className={classes.font_semibold}>{label.gmm_product_status_message}</Box>
                                                                    <Box>
                                                                        <span className={classes.font_small}>
                                                                            {count === null ? 'รอการเดินทาง' :
                                                                                (label.gmm_booking_ac_action === null) ? 'อยู่ระหว่างการเดินทาง' :
                                                                                    'วันที่ ' + label.gmm_booking_ac_date + ' เวลา ' + label.gmm_booking_ac_time
                                                                            }


                                                                        </span>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        </StepLabel>
                                                        <StepContent className={clsx({
                                                            [classes.rootContentNull]: activeStep === null,
                                                            [classes.rootContentActive]: activeStep < count,
                                                            [classes.rootContentWait]: activeStep === count
                                                        })} >
                                                            <Typography className={classes.font_normal}>
                                                                {(label.gmm_location_address === null) ? 'ผู้โดยสาร คุณ ' + header.name : label.gmm_location_address}
                                                            </Typography>
                                                            {label.img.length !== 0 && <PageLine />}


                                                            {label.img.length !== 0 &&
                                                                <>
                                                                    <Grid container spacing={6} style={{ margin: '0px' }}>
                                                                        {label.img.map((path, index) => (
                                                                            <Grid key={index} onClick={() => { handleClickImage(path) }}>
                                                                                <img src={path} className={classes.imgResize} alt="picture" />
                                                                            </Grid>
                                                                        ))
                                                                        }
                                                                    </Grid>
                                                                </>
                                                            }

                                                        </StepContent>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        </Box>
                                    </Grid>
                                </>
                            }

                            {(TXon === true && CGon === false) && <>
                                <Grid item xs={12} sm={6}>
                                    <List style={{ padding: 0 }}>
                                        <ListItem button className={classes.ListSelect} >
                                            <ListItemAvatar>
                                                <Avatar src="/image/passengericon.png" style={{ background: '#FFCB08' }}>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={header.name + showInfo.booking_p_tel}
                                                secondary="ผู้โดยสาร"
                                                classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <List style={{ padding: 0 }}>
                                        <ListItem button className={clsx(classes.ListSelect, { [classes.border_active]: showborder.TX })}>
                                            <ListItemAvatar>
                                                <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={header.taxiname + showInfo.booking_t_tel}
                                                secondary={'คนขับรถ' + ' ' + showInfo.booking_licenseplate}
                                                classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12} >
                                    <Box mb={4}>
                                        <Stepper activeStep={activeStep} orientation="vertical"
                                            style={{ padding: '0px 0px 12px 0px' }}>
                                            {PrimaryStep.map((label, index) => (
                                                <Step key={index}
                                                    connector={
                                                        (count === (PrimaryStep.length - 1)) ? <ColorRouteConnector /> :
                                                            ((index) <= (Total)) ? <ColorRouteConnector /> :
                                                                <ColorRouteConnectorDefault />
                                                    }
                                                >
                                                    <StepLabel StepIconComponent={RouteIcon} className={classes.Hovercursor} onClick={() => { handleActives(label, index) }}>
                                                        <Box pl={1} className={classes.font_normal}>
                                                            <Box>
                                                                <Box className={classes.font_semibold}>{label.gmm_product_status_message}</Box>
                                                                <Box>
                                                                    <span className={classes.font_small}>
                                                                        {count === null ? 'รอการเดินทาง' :
                                                                            (label.gmm_booking_ac_action === null) ? 'อยู่ระหว่างการเดินทาง' :
                                                                                'วันที่ ' + label.gmm_booking_ac_date + ' เวลา ' + label.gmm_booking_ac_time
                                                                        }


                                                                    </span>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </StepLabel>
                                                    <StepContent className={clsx({
                                                        [classes.rootContentNull]: activeStep === null,
                                                        [classes.rootContentActive]: activeStep < count,
                                                        [classes.rootContentWait]: activeStep === count
                                                    })} >
                                                        <Typography className={classes.font_normal}>
                                                            {(label.gmm_location_address === null) ? 'ผู้โดยสาร คุณ ' + header.name : label.gmm_location_address}
                                                        </Typography>
                                                        {label.img.length !== 0 && <PageLine />}


                                                        {label.img.length !== 0 &&
                                                            <>
                                                                <Grid container spacing={6} style={{ margin: '0px' }}>
                                                                    {label.img.map((path, index) => (
                                                                        <Grid key={index} onClick={() => { handleClickImage(path) }}>
                                                                            <img src={path} className={classes.imgResize} alt="picture" />
                                                                        </Grid>
                                                                    ))
                                                                    }
                                                                </Grid>
                                                            </>
                                                        }

                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                </Grid>
                            </>}

                            {(TXon === false && CGon === true) && <>
                                <Grid item xs={12} sm={6}>
                                    <List style={{ padding: 0 }}>
                                        <ListItem button className={classes.ListSelect} >
                                            <ListItemAvatar>
                                                <Avatar src="/image/passengericon.png" style={{ background: '#FFCB08' }}>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={header.name + showInfo.booking_p_tel}
                                                secondary="ผู้โดยสาร"
                                                classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12}>
                                    <List style={{ padding: 0 }}>
                                        <ListItem button className={clsx(classes.ListSelect, { [classes.border_active]: showborder.CG })} >
                                            <ListItemAvatar>
                                                <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={header.cgname + showInfo.booking_c_tel}
                                                secondary="ผู้ดูแล"
                                                classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box mb={4}>
                                        <Stepper activeStep={activeStep} orientation="vertical"
                                            style={{ padding: '0px 0px 12px 0px' }}>
                                            {PrimaryStep.map((label, index) => (
                                                <Step key={index}
                                                    connector={
                                                        (count === (PrimaryStep.length - 1)) ? <ColorRouteConnector /> :
                                                            ((index) <= (Total)) ? <ColorRouteConnector /> :
                                                                <ColorRouteConnectorDefault />
                                                    }
                                                >
                                                    <StepLabel StepIconComponent={RouteIcon} className={classes.Hovercursor} onClick={() => { handleActives(label, index) }}>
                                                        <Box pl={1} className={classes.font_normal}>
                                                            <Box>
                                                                <Box className={classes.font_semibold}>{label.gmm_product_status_message}</Box>
                                                                <Box>
                                                                    <span className={classes.font_small}>
                                                                        {count === null ? 'รอการเดินทาง' :
                                                                            (label.gmm_booking_ac_action === null) ? 'อยู่ระหว่างการเดินทาง' :
                                                                                'วันที่ ' + label.gmm_booking_ac_date + ' เวลา ' + label.gmm_booking_ac_time
                                                                        }


                                                                    </span>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </StepLabel>
                                                    <StepContent className={clsx({
                                                        [classes.rootContentNull]: activeStep === null,
                                                        [classes.rootContentActive]: activeStep < count,
                                                        [classes.rootContentWait]: activeStep === count
                                                    })} >
                                                        <Typography className={classes.font_normal}>
                                                            {(label.gmm_location_address === null) ? 'ผู้โดยสาร คุณ ศราวุฒิ ปอยชีวะ' : label.gmm_location_address}
                                                        </Typography>
                                                        {label.img.length !== 0 && <PageLine />}


                                                        {label.img.length !== 0 &&
                                                            <>
                                                                <Grid container spacing={6} style={{ margin: '0px' }}>
                                                                    {label.img.map((path, index) => (
                                                                        <Grid key={index} onClick={() => { handleClickImage(path) }}>
                                                                            <img src={path} className={classes.imgResize} alt="picture" />
                                                                        </Grid>
                                                                    ))
                                                                    }
                                                                </Grid>
                                                            </>
                                                        }

                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                </Grid>
                            </>}




                        </Grid>
                    </Container>
                    {lottie &&
                        <>
                            <Box mt={0}>
                                <Lottie
                                    options={lottie_notfoundOptions}
                                    height={300}
                                    width={300}
                                    isClickToPauseDisabled
                                />

                            </Box>
                            <Box mb={4} className={classes.font_success}>ไม่พบข้อมูลการเดินทาง</Box>
                        </>
                    }
                </TabPanel>
                <TabPanel value={TabControl} index={2} classes={classes}>
                    <Box m={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card variant="outlined" >
                                    <CardContent style={{ paddingBottom: '16px' }} >
                                        <FormControl component="fieldset">
                                            <Alert severity="success" className={classes.font_normal}>
                                                <AlertTitle className={classes.font_local_header}>{showInfo.booking_product_name}</AlertTitle>
                                                {showInfo.booking_product_desc}
                                            </Alert>
                                            <Divider />

                                            <Grid container spacing={2}>
                                                <Grid item xs={6}><Box mt={2} className={classes.font_small}>เดินทางวันที่</Box></Grid>
                                                <Grid item xs={6}><Box mt={2} className={classes.font_small}>เวลา</Box></Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{showInfo.booking_date}</Box></Grid>
                                                <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{showInfo.booking_time} น.</Box></Grid>
                                            </Grid>
                                            {showInfo.booking_c &&
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}><Box mt={1} className={classes.font_normal}>สถานที่นัดผู้ดูแล : {showInfo.booking_point[showInfo.booking_startpoint].name}</Box></Grid>
                                                        <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{showInfo.booking_starttime} น.</Box></Grid>
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
                                                            primary={showInfo.booking_u + showInfo.booking_u_tel}
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
                                                            primary={showInfo.booking_p + showInfo.booking_p_tel}
                                                            secondary="ผู้โดยสาร"
                                                            classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                        <ListItemSecondaryAction onClick={handleOpenShowPassenger} style={{ cursor: 'pointer' }}>
                                                            <Assignment color="primary" />
                                                        </ListItemSecondaryAction>
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
                                                            primary={showInfo.booking_t + showInfo.booking_t_tel}
                                                            secondary={'คนขับรถ' + ' ' + showInfo.booking_licenseplate}
                                                            classes={{ primary: classes.font_normal, secondary: classes.font_small }} />
                                                        <ListItemSecondaryAction> {showIconTX && <Favorite color="secondary" />} </ListItemSecondaryAction>
                                                    </ListItem>
                                                </List>
                                            </Box>
                                            {showInfo.booking_c &&
                                                <Box mt={1} mb={1} >
                                                    <List dense={true} style={{ padding: 0 }}>
                                                        <ListItem style={{ paddingLeft: 0 }}>
                                                            <ListItemAvatar>
                                                                <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={showInfo.booking_c + showInfo.booking_c_tel}
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
                                                    <Grid item xs={6}> คนขับรถ : {(Number(showInfo.booking_product_drop) !== 2) ? 'รอ ' + (Number(showInfo.booking_hrtx) + Number(showInfo.booking_txhrdefault)) + ' ชั่วโมง สะสมรวมตลอดการเดินทาง' : '-'}</Grid>

                                                    {/* <Grid item xs={6}> คนขับรถ : {showInfo.booking_hrtx > 0 ? showInfo.booking_hrtx : '-'}</Grid> */}
                                                    {showInfo.booking_c && <Grid item xs={6}>ผู้ดูแล : {(Number(showInfo.booking_product_drop) !== 2) ? 'ให้บริการ ' + (Number(showInfo.booking_hrcg) + Number(showInfo.booking_cghrdefault)) + ' ชั่วโมง' : '-'}</Grid>}
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
                                        <Stepper activeStep={activeStep} orientation="vertical" connector={<ColorRouteConnectorDesc />} style={{ padding: '12px 0px 12px 0px' }}>
                                            {showInfo.booking_point.map((label, index) => (
                                                <Step key={index}>
                                                    <StepLabel StepIconComponent={RouteIconDesc}>
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
                                                    <span className={classes.font_small}> {showInfo.booking_follower} คน</span>
                                                </Box></Grid>
                                                <Grid item xs={12}><Box mt={1} className={classes.font_normal}>อุปกรณ์ที่นำไปด้วย :
                                                    <span className={classes.font_small}> {showInfo.booking_equipment}</span>
                                                </Box></Grid>
                                                <Grid item xs={12}><Box mt={1} className={classes.font_normal}>รายละเอียดเพิ่มเติม :
                                                    <span className={classes.font_small}> {showInfo.booking_desc}</span>
                                                </Box></Grid>
                                            </Grid>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </TabPanel>
            </Box>

            {lottie === false &&
                <Fab onClick={() => { handleShare(TrackID) }} className={classes.fab}>
                    <Share style={{ color: 'white', fontSize: 24 }} />
                </Fab>
            }

            {
                preview &&
                <Lightbox
                    mainSrc={showImage}
                    onCloseRequest={handlePreviewClose}
                    animationDuration={100}
                    imageTitle="Tracking_image"
                    imagePadding={50}
                    reactModalStyle={custom_overlay}
                    enableZoom={true}
                />
            }

            <Dialog
                onClose={handleClosShowPassenger}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openShowPassenger}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleClosShowPassenger}>
                    ข้อมูลผู้โดยสาร
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="fn"
                                        label="ชื่อ"
                                        value={Form.fname}
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
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
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="ln"
                                        label="นามสกุล"
                                        value={Form.lname}
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
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
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        value={Form.tel}
                                        name="tl"
                                        label="เบอร์โทรศัพท์"
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
                                        error={Form.errorTel.status}
                                        helperText={Form.errorTel.message}
                                        inputProps={{ maxLength: 10, className: classes.font_normal, }}
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
                                <Grid item xs={12} sm={6} md={4}>
                                    <AutocompleteInput
                                        classes={{
                                            input: classes.font_normal,
                                            option: classes.font_normal,
                                        }}
                                        options={sex}
                                        getOptionLabel={(value) => value.gmm_sex_name}
                                        getOptionSelected={(option, value) =>
                                            option.gmm_sex_id === value.gmm_sex_id
                                        }
                                        value={Form.sex}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="เพศ"
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


                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="wi"
                                        label="น้ำหนัก"
                                        value={Form.weight}
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
                                        inputProps={{ maxLength: 5 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <Typography className={classes.font_normal}>กก. </Typography>
                                                </InputAdornment>
                                            ),
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{ className: classes.font_normal }}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="hi"
                                        label="ส่วนสูง"
                                        value={Form.height}
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
                                        inputProps={{ maxLength: 3 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <Typography className={classes.font_normal}>ซม. </Typography>
                                                </InputAdornment>
                                            ),
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{ className: classes.font_normal }}
                                        fullWidth
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <AutocompleteInput
                                        classes={{
                                            input: classes.font_normal,
                                            option: classes.font_normal,
                                        }}
                                        options={year}
                                        getOptionLabel={(value) => value.year}
                                        getOptionSelected={(option, value) =>
                                            option.year === value.year
                                        }
                                        value={Form.age}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="ปีเกิด พ.ศ."
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
                            </Grid>
                        </CardContent>
                    </Card>
                    <Box mt={2}>
                        <Card variant="outlined" >
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl>
                                    <FormLabel className={classes.font_normal} ><DialogHeadersII classes={classes} /></FormLabel>
                                    <RadioGroup row aria-label="position" value={Form.disease_question} defaultValue="top">
                                        {disease_question.map((ans) =>
                                            <FormControlLabel key={ans.gmm_question_id} value={ans.gmm_question_id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" />}
                                                label={ans.gmm_question_name} >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                                {Form.disease_question === '1' && (
                                    <Box pt={2} pb={1}>
                                        <Card variant="outlined">
                                            <CardContent style={{ paddingBottom: '16px' }}>
                                                <FormControl component="fieldset" error={Form.errorDisease.status} className={classes.font_normal}>
                                                    <FormGroup>
                                                        {disease.map((disease, index) =>
                                                            <Box key={disease.gmm_disease_id} className={classes.displayflex}>
                                                                <FormControlLabel
                                                                    classes={{ label: classes.font_normal }}
                                                                    control={<Checkbox color="primary" checked={disease.status}
                                                                        name={disease.gmm_disease_id} />}
                                                                    label={disease.gmm_disease_name}
                                                                    size="small"
                                                                />
                                                                {disease.gmm_disease_id == '8' && disease.status == true &&
                                                                    <>
                                                                        {disease.group.map((item, indexSec) =>
                                                                            <Box key={item.gmm_disease_id}>
                                                                                <FormControlLabel
                                                                                    classes={{ label: classes.font_normal }}
                                                                                    control={<Checkbox color="primary" checked={item.status}
                                                                                        name={item.gmm_disease_id} />}
                                                                                    label={item.gmm_disease_desc}
                                                                                    size="small"
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </>
                                                                }
                                                                {disease.gmm_disease_id == '11' && disease.status == true &&
                                                                    <Box>
                                                                        <TextField
                                                                            value={Form.disease_other}
                                                                            margin="dense"
                                                                            variant="outlined"
                                                                            placeholder="โปรดระบุ"
                                                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                            InputProps={{
                                                                                className: classes.font_normal,
                                                                            }}
                                                                            InputLabelProps={{
                                                                                className: classes.font_normal,
                                                                            }}
                                                                            fullWidth
                                                                        />
                                                                    </Box>
                                                                }
                                                            </Box>
                                                        )}
                                                        <FormHelperText className={classes.font_normal}>{Form.errorDisease.message}</FormHelperText>
                                                    </FormGroup>
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersIII classes={classes} /></FormLabel>
                                    <RadioGroup value={Form.walk_question} required>
                                        {walk_question.map((walk) =>
                                            <FormControlLabel key={walk.gmm_walk_id} value={walk.gmm_walk_id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" />}
                                                label={walk.gmm_walk_name}
                                                required >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl>
                                    <FormLabel className={classes.font_normal} ><DialogHeadersIV classes={classes} /></FormLabel>
                                    <RadioGroup row aria-label="position" value={Form.cg_question} defaultValue="top">
                                        {cg_question.map((ans) =>
                                            <FormControlLabel key={ans.gmm_question_id} value={ans.gmm_question_id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" />}
                                                label={ans.gmm_question_name} >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersIIX classes={classes} /></FormLabel>
                                    <RadioGroup value={Form.camera_question} required>
                                        {camera_question.map((camera) =>
                                            <FormControlLabel key={camera.gmm_question_id} value={camera.gmm_question_id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" />}
                                                label={camera.gmm_question_name}
                                                required >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersIX classes={classes} /></FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <TextField
                                                value={Form.note}
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
                                            <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <TopicII classes={classes} />
                    <Box>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersVI classes={classes} /></FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                value={Form.Message}
                                                inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                InputProps={{
                                                    className: classes.font_normal,
                                                }}
                                                InputLabelProps={{
                                                    className: classes.font_normal,
                                                }}
                                                helperText="ตัวอย่าง เช่น ท่าน, อาม่า, คุณลุง, คุณยาย"
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl size="small" component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersV classes={classes} /></FormLabel>
                                    <Box pt={1} pb={1}>
                                        <Card variant="outlined">
                                            <CardContent style={{ paddingBottom: '16px' }}>
                                                <FormControl component="fieldset" className={classes.font_normal}>
                                                    <FormGroup>
                                                        {hobby.map((hobby, index) =>
                                                            <Box key={hobby.gmm_hobby_id} className={classes.displayflex}>
                                                                <FormControlLabel
                                                                    classes={{ label: classes.font_normal }}
                                                                    control={<Checkbox color="primary" checked={hobby.status}
                                                                        name={hobby.gmm_hobby_id} />}
                                                                    label={hobby.gmm_hobby_name}
                                                                    size="small"
                                                                />
                                                                {hobby.gmm_hobby_id == '10' && hobby.status == true &&
                                                                    <Box>
                                                                        <TextField
                                                                            value={Form.hobby_other}
                                                                            variant="outlined"
                                                                            margin="dense"
                                                                            placeholder="โปรดระบุ"
                                                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                            InputProps={{
                                                                                className: classes.font_normal,
                                                                            }}
                                                                            InputLabelProps={{
                                                                                className: classes.font_normal,
                                                                            }}
                                                                            fullWidth
                                                                        />
                                                                    </Box>
                                                                }
                                                            </Box>
                                                        )}
                                                    </FormGroup>
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </FormControl>

                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersVII classes={classes} /></FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <AutocompleteInput
                                                classes={{
                                                    input: classes.font_normal,
                                                    option: classes.font_normal,
                                                }}
                                                options={music}
                                                getOptionLabel={(value) => value.gmm_music_name}
                                                getOptionSelected={(option, value) =>
                                                    option.gmm_music_id === value.gmm_music_id
                                                }
                                                value={Form.music_json}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="ประเภท"
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            className: classes.font_normal,
                                                        }}
                                                    />
                                                )}

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <TextField
                                                label="ระบุนักร้องโปรด / เพลง"
                                                margin="dense"
                                                variant="outlined"
                                                value={Form.music_other}
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
                                    </Grid>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersVIII classes={classes} /></FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <AutocompleteInput
                                                classes={{
                                                    input: classes.font_normal,
                                                    option: classes.font_normal,
                                                }}
                                                options={number}
                                                getOptionLabel={(value) => value.gmm_num_id}
                                                getOptionSelected={(option, value) =>
                                                    option.gmm_num_id === value.gmm_num_id
                                                }
                                                value={Form.day}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="วันเกิด"
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            className: classes.font_normal,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <AutocompleteInput
                                                classes={{
                                                    input: classes.font_normal,
                                                    option: classes.font_normal,
                                                }}
                                                options={month}
                                                getOptionLabel={(value) => value.gmm_month_name}
                                                getOptionSelected={(option, value) =>
                                                    option.gmm_month_id === value.gmm_month_id
                                                }
                                                value={Form.month}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="เดือนเกิด"
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            className: classes.font_normal,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                </MuiDialogContent>
            </Dialog>
        </>
    );
}
