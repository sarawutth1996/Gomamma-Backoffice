/* eslint-disable */
import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import { useParams } from "react-router-dom";
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import {
    Avatar, Backdrop, Box, Container,
    Typography, Grid,
    StepConnector, StepLabel, StepContent, Stepper, Step
} from "@material-ui/core";
import {
    CheckCircleOutline, AccessTime,
} from "@material-ui/icons";
import Loader from "react-loader-spinner";
import Lottie from 'react-lottie';
import lottie_notfound from '../Component/Page/Customer/notfound';
import PageLine from "../theme/PageLine";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import config from './config'


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
    root: {
        width: "100%!important",
        height: "100%!important",
        minWidth: "320px",
        direction: "ltr",
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    wrpFlex: {
        display: "flex",
        minHeight: "calc(100vh - 36px)",
    },
    wrpRound: {
        marginRight: "auto",
        marginLeft: "auto",
    },
    wrpMiddle: {
        alignSelf: "center!important",
        margin: "0 auto",
        [theme.breakpoints.down("sm")]: {
            width: "500px",
        },
    },
    wrpController: {
        [theme.breakpoints.up("md")]: {
            width: "100%",
        },
        [theme.breakpoints.down("md")]: {
            padding: theme.spacing(2, 0),
        },
    },
    paper: {
        padding: theme.spacing(3),
        textAlign: "center",
        color: theme.palette.text.secondary,
        border: "1px solid rgba(0,0,0,0.12)",
        [theme.breakpoints.down("md")]: {
            padding: theme.spacing(2),
        },
    },
    divine_line: {
        alignSelf: "center",

        [theme.breakpoints.up("md")]: {
            paddingLeft: "28px!important",
            paddingRight: "6px!important",
        },

        [theme.breakpoints.down("sm")]: {
            paddingLeft: "12px!important",
            paddingRight: "12px!important",
        },
    },
    PaddingImage: {
        margin: theme.spacing(0),
        [theme.breakpoints.down("sm")]: {
            marginBottom: "12px",
        },
    },
    TextRt: {
        textAlign: "left",
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    w100: {
        width: "100%!important",
        [theme.breakpoints.up("md")]: {
            borderRight: "1px solid #e0e0e0",
        },
    },
    footer: {
        background: '#dcdcdc42',
        textAlign: "center",
        paddingRight: "24px",
    },
    seizeUpper: {
        height: '100vh',

    },
    displayflex: {
        alignItems: 'center',
        display: 'flex'
    },
    font_semibold: {
        color: 'black',
        fontFamily: 'SemiBold',
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
    font_success: {
        fontFamily: 'SemiBold',
        textAlign: 'center',
        fontSize: '24px'
    },
    font_smallR: {
        fontFamily: 'Regular',
        fontSize: '14px',
        float: 'right'
    },
    space_bg: {
        background: '#f4ae3d',
        minHeight: '15vh'
    },
    imgResize: {
        width: '100%',
    },
    imgResize_store: {
        cursor: 'pointer',
        width: "100px",
        height: "100px",
        padding: '4px'
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
        cursor: 'pointer'
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        background: '#FFCB08',
        '&:hover': {
            background: '#FFCB08',
            // color: 'white',
        },
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


export default function Tracking() {

    const url = config.API_URL + "models/Tracking/Tracking.php";

    const classes = useStyles();
    const { id } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [activeStep, setActiveStep] = useState(null);
    const [count, setCount] = useState(null);
    const [PrimaryStep, setPrimaryStep] = useState([]);
    const [header, setHeader] = useState([]);
    const [Total, setTotal] = useState(null);
    const [showImage, setShowImage] = useState(null);
    const [preview, setPreview] = useState(false)
    const [lottie, setLottie] = useState(false)
    const [CGon, setCGon] = useState(false)
    const [TXon, setTXon] = useState(false)
    const theme = useTheme();

    useEffect(() => {
        FirstLoad();
    }, [])

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Trackid",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(300);
        const res = await response.json();
        if (res.status) {
            if (res.CGon === true && res.TXon === true) {
                setCGon(true)
                setTXon(true)
                setCount(res.count)
                setActiveStep(res.count)
                setPrimaryStep(res.data)


                setHeader(res.title)
                setBoolean(false);
                setLottie(false)

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

                let calc = (res.data.length - res.total)
                let sum = (res.data.length - calc)
                setTotal(sum)
            }
        } else {
            setBoolean(false);
            setLottie(true)
        }
    }

    async function ChangeRole(value) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeRole",
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
            setHeader(res.title)
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

    function Copyright({ classes }) {
        return (
            <Typography variant="body2" color="textSecondary" className={classes.font_normal}>
                Call center : 094-429-2296
            </Typography>
        );
    }

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

    const fabs = [
        {
            className: classes.fab,
            icon: <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }} />,
            label: 'Edit',
        },
        {
            className: classes.fab,
            icon: <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }} />,
            label: 'Add',
        },
    ];

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [value, setValue] = React.useState(0);

    const handleChange = () => {
        if (value === 1) {
            ChangeRole(0);
            setValue(0);
        } else if (value === 0) {
            ChangeRole(1);
            setValue(1);
        }

    };

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

    return (
        <>
            <section className={classes.root}>
                <Loading classes={classes} status={isLoading} />
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Box style={{ padding: '18px 36px 18px 36px' }}>
                            <img src="/image/Gomamma_banner.jpeg" className={classes.imgResize} />
                        </Box>
                    </Grid>
                </Grid>
                <main className={classes.wrpRound}>
                    <Box className={classes.wrpFlex}>
                        <Container maxWidth="xs">
                            {(TXon === true && CGon === true) &&
                                <>

                                    <Grid container spacing={0}>
                                        <Grid item xs={6}><Box mt={2} className={classes.font_semibold}>เลขที่การเดินทาง</Box></Grid>
                                        <Grid item xs={6}><Box mt={2} className={classes.font_smallR}>{header.id}</Box></Grid>
                                    </Grid>
                                    <Grid container spacing={0}>
                                        <Grid item xs={6}><Box mt={1} className={classes.font_semibold}>ผู้โดยสาร</Box></Grid>
                                        <Grid item xs={6}><Box mt={1} className={classes.font_smallR}>{header.name}</Box></Grid>
                                    </Grid>
                                    {value === 1 &&
                                        <Grid container spacing={0}>
                                            <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_semibold}>ผู้ดูแล</Box></Grid>
                                            <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_smallR}>{header.cgname}</Box></Grid>
                                            <Grid item xs={6}><Box className={classes.font_semibold}>เบอร์โทร</Box></Grid>
                                            <Grid item xs={6}><Box mb={2} className={classes.font_smallR}>{(header.tel_cg) && conv_formatTel(header.tel_cg)}</Box></Grid>
                                        </Grid>
                                    }

                                    {value === 0 &&
                                        <Grid container spacing={0}>
                                            <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_semibold}>คนขับรถ</Box></Grid>
                                            <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_smallR}>{header.taxiname}</Box></Grid>
                                            <Grid item xs={6}><Box className={classes.font_semibold}>ทะเบียน</Box></Grid>
                                            <Grid item xs={6}><Box className={classes.font_smallR}>{header.license_plate}</Box></Grid>
                                            <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_semibold}>เบอร์โทร</Box></Grid>
                                            <Grid item xs={6}><Box mt={1} mb={2} className={classes.font_smallR}>{(header.tel) && conv_formatTel(header.tel)}</Box></Grid>
                                        </Grid>
                                    }


                                    <Box >
                                        <PageLine />
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box p={2}>
                                                <Stepper activeStep={activeStep} orientation="vertical"
                                                    style={{ padding: '12px 0px 12px 0px' }}>
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
                                                                                    <img src={path} className={classes.imgResize_store} alt="picture" />
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

                                    </Grid>


                                </>
                            }

                            {(TXon === true && CGon === false) &&
                                <>

                                    <Grid container spacing={0}>
                                        <Grid item xs={6}><Box mt={2} className={classes.font_semibold}>เลขที่การเดินทาง</Box></Grid>
                                        <Grid item xs={6}><Box mt={2} className={classes.font_smallR}>{header.id}</Box></Grid>
                                    </Grid>
                                    <Grid container spacing={0}>
                                        <Grid item xs={6}><Box mt={1} className={classes.font_semibold}>ผู้โดยสาร</Box></Grid>
                                        <Grid item xs={6}><Box mt={1} className={classes.font_smallR}>{header.name}</Box></Grid>
                                    </Grid>
                                    <Grid container spacing={0}>
                                        <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_semibold}>คนขับรถ</Box></Grid>
                                        <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_smallR}>{header.taxiname}</Box></Grid>
                                        <Grid item xs={6}><Box className={classes.font_semibold}>ทะเบียน</Box></Grid>
                                        <Grid item xs={6}><Box className={classes.font_smallR}>{header.license_plate}</Box></Grid>
                                        <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_semibold}>เบอร์โทร</Box></Grid>
                                        <Grid item xs={6}><Box mt={1} mb={2} className={classes.font_smallR}>{(header.tel) && conv_formatTel(header.tel)}</Box></Grid>
                                    </Grid>
                                    <Box >
                                        <PageLine />
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box p={2}>
                                                <Stepper activeStep={activeStep} orientation="vertical"
                                                    style={{ padding: '12px 0px 12px 0px' }}>
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
                                                                                    <img src={path} className={classes.imgResize_store} alt="picture" />
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

                                    </Grid>

                                </>
                            }


                            {(TXon === false && CGon === true) &&
                                <>
                                    <>
                                        <Grid container spacing={0}>
                                            <Grid item xs={6}><Box mt={2} className={classes.font_semibold}>เลขที่การเดินทาง</Box></Grid>
                                            <Grid item xs={6}><Box mt={2} className={classes.font_smallR}>{header.id}</Box></Grid>
                                        </Grid>
                                        <Grid container spacing={0}>
                                            <Grid item xs={6}><Box mt={1} className={classes.font_semibold}>ผู้โดยสาร</Box></Grid>
                                            <Grid item xs={6}><Box mt={1} className={classes.font_smallR}>{header.name}</Box></Grid>
                                        </Grid>
                                        <Grid container spacing={0}>
                                            <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_semibold}>ผู้ดูแล</Box></Grid>
                                            <Grid item xs={6}><Box mt={1} mb={1} className={classes.font_smallR}>{header.cgname}</Box></Grid>
                                            <Grid item xs={6}><Box className={classes.font_semibold}>เบอร์โทร</Box></Grid>
                                            <Grid item xs={6}><Box mb={2} className={classes.font_smallR}>{(header.tel_cg) && conv_formatTel(header.tel_cg)}</Box></Grid>
                                        </Grid>
                                        <Box >
                                            <PageLine />
                                        </Box>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box p={2}>
                                                    <Stepper activeStep={activeStep} orientation="vertical"
                                                        style={{ padding: '12px 0px 12px 0px' }}>
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
                                                                                        <img src={path} className={classes.imgResize_store} alt="picture" />
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

                                        </Grid>
                                    </>
                                </>
                            }

                            {lottie &&
                                <>

                                    <Box className={classes.seizeUpper}>
                                        <Box mt={10}>
                                            <Lottie
                                                options={lottie_notfoundOptions}
                                                height={300}
                                                width={300}
                                                isClickToPauseDisabled
                                            />

                                        </Box>
                                        <Box className={classes.font_success}>ไม่พบข้อมูลการเดินทาง</Box>
                                    </Box>
                                </>
                            }

                        </Container>
                    </Box>

                    {(lottie === false && TXon === true && CGon === true) &&
                        <>
                            {fabs.map((fab, index) => (
                                <Zoom
                                    key={index}
                                    in={value === index}
                                    timeout={transitionDuration}
                                    style={{
                                        transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
                                    }}
                                    unmountOnExit
                                >
                                    <Fab onClick={handleChange} className={fab.className}>
                                        {fab.icon}
                                    </Fab>
                                </Zoom>
                            ))}
                        </>
                    }
                </main>
                <Box pb={2} pt={2} className={classes.footer}>
                    <Copyright classes={classes} />
                </Box>
            </section>



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
        </>
    );
}
