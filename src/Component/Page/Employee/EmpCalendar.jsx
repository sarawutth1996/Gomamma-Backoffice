/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
    useParams, useLocation, useHistory
} from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Avatar, Backdrop, Button, Box, Checkbox, Card, CardContent, Divider, TextField, Typography, Grid, IconButton, FormGroup, FormLabel, FormControlLabel, FormControl, Radio, RadioGroup,
    Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, FormHelperText, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemAvatar, ListItemText,
    StepConnector, StepLabel, Stepper, Step, Slide,
} from "@material-ui/core";
import {
    Book, Close, EventNote, Favorite, LocationOn,
    FormatListNumbered
} from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
//-----------------------------------------------------------
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/th";
import config from '../../config';

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
        fontFamily: 'Regular',
        fontSize: '18px',
        textAlign: 'left',
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

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    displayflexHead: {
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
    StyleDetail: {
        borderLeft: '6px solid rgb(0, 120, 214)',
        backgroundColor: 'rgba(0, 120, 214, 0.1)',
        padding: '12px',
        fontFamily: 'Regular',
        fontSize: '20px',
        fontWeight: 500,
        margin: '0px'
    }
    ,
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

    font_smallR: {
        color: 'gray',
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: 'start'
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

function Headers({ classes, status }) {
    return (
        <>
            <Box pt={0} pb={0} className={classes.displayflexHead}>
                <Box className={classes.displayflexHead}>
                    <EventNote />
                    <Typography className={classes.font_header}>ปฏิทินการจอง</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}


function SectionLineI({ classes, docno, status, payment_exp }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexHead}>

                    <Box className={classes.displayflexCenter}>
                        <Book fontSize="small" />
                        <Typography className={classes.font_subheader}>&nbsp; {docno}</Typography>
                    </Box>
                    <Box>
                        {(status === 'PENDING' && (moment(new Date()).format('YYYY-MM-DD HH:mm') <= payment_exp)) && <>
                            <span>สถานะ : </span>
                            <span style={{ color: 'rgb(246 172 16)' }}>รอชำระ</span>
                        </>}
                        {(status === 'PENDING' && (moment(new Date()).format('YYYY-MM-DD HH:mm') >= payment_exp)) && <>
                            <span>สถานะ : </span>
                            <span style={{ color: 'rgb(247 7 37)' }}>หมดอายุการชำระ</span>
                        </>}
                        {status === 'SUCCESS' && <>
                            <span>สถานะ : </span>
                            <span style={{ color: 'rgb(33, 124, 37)' }}>รอเดินทาง</span>
                        </>}
                        {status === 'COMPLETE' && <>
                            <span>สถานะ : </span>
                            <span style={{ color: '#3f51b5' }}>เดินทางแล้ว</span>
                        </>}
                        {status === 'CANCEL' && <>
                            <span>สถานะ : </span>
                            <span style={{ color: 'rgb(155 155 155)' }}>ยกเลิก</span>
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

export default function EmpCalendar() {
    const url = config.API_URL + "models/Employee/Employee_calendar.php";
    const classes = useStyles();
    const { vision } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false);
    const [InfoData, setOpenInfo] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [events, setEvent] = useState([]);
    const [resourceMap, setResource] = useState([]);
    const [service, setService] = useState([]);
    const [empmstr, setEmpmstr] = useState([]);
    const [openLeave, setOpenLeave] = useState(false);
    const [showIconTX, setIconTX] = useState(false);
    const [showIconCG, setIconCG] = useState(false);
    const [Form, setForm] = useState({
        type: { gmm_svtype_id: 'TX', gmm_svtype_name: 'Taxi' },
        employee: { gmm_emp_id: 'ALLIN', gmm_emp_fullname: 'แสดงทั้งหมด' }
    });

    const [showInfo, setShow] = useState({
        booking_nbr: null,
        booking_status: null,
        booking_exp: null,
        booking_product_name: null,
        booking_product_desc: null,
        booking_date: null,
        booking_time: null,
        booking_time_end: null,
        booking_u_tel: null,
        booking_p_tel: null,
        booking_u: null,
        booking_p: null,
        booking_t: null,
        booking_c: null,
        booking_hrtx: null,
        booking_hrcg: null,
        booking_startpoint: null,
        booking_starttime: null,
        booking_txhrdefault: null,
        booking_cghrdefault: null,
        booking_product_drop: null,
        booking_follower: null,
        booking_desc: null,
        booking_equipment: null,
        booking_point: [],
    })

    const [showLeave, setShowLeave] = useState({
        emp_title: null,
        emp_desc: null,
        emp_name: null
    })


    const [dayOff, setDayOff] = useState([]);
    const localizer = momentLocalizer(moment);

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, []);

    async function FirstLoad() {
        setBoolean(true)
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_event",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            const list_emp = res.employee
            const item = [];
            const list = [];

            if (res.events.length !== 0) {
                for (let i = 0; i < res.events.length; i++) {


                    let makeData = {
                        id: res.events[i]['id'],
                        title: res.events[i]['title'],
                        start: new Date(res.events[i]['start']),
                        end: new Date(res.events[i]['end']),
                        resourceId: res.events[i]['resourceId'],
                        desc: res.events[i]['desc'],
                        leave: false
                    }
                    item[i] = makeData

                    if (res.events.length === (i + 1)) {
                        for (let x = 0; x < res.dayLeave.length; x++) {
                            let LeaveData = {
                                id: Number(res.events[i]['id'] + 1),
                                title: res.dayLeave[x]['firstname'] + ' ' + res.dayLeave[x]['gmm_leave_type'],
                                start: new Date(res.dayLeave[x]['gmm_leave_date']),
                                end: new Date(res.dayLeave[x]['gmm_leave_date_to']),
                                resourceId: res.dayLeave[x]['gmm_leave_addr'],
                                desc: {
                                    name: res.dayLeave[x]['gmm_leave_fullname'],
                                    desc: res.dayLeave[x]['gmm_leave_desc']
                                },
                                leave: true
                            }
                            item[i + (x + 1)] = LeaveData
                        }
                    }


                }
            } else {
                for (let x = 0; x < res.dayLeave.length; x++) {
                    let LeaveData = {
                        id: Number(x + 1),
                        title: res.dayLeave[x]['firstname'] + ' ' + res.dayLeave[x]['gmm_leave_type'],
                        start: new Date(res.dayLeave[x]['gmm_leave_date']),
                        end: new Date(res.dayLeave[x]['gmm_leave_date_to']),
                        resourceId: res.dayLeave[x]['gmm_leave_addr'],
                        desc: {
                            name: res.dayLeave[x]['gmm_leave_fullname'],
                            desc: res.dayLeave[x]['gmm_leave_desc']
                        },
                        leave: true
                    }

                    item[x] = LeaveData
                }
            }





            list_emp.unshift({ gmm_emp_id: 'ALLIN', gmm_emp_fullname: 'แสดงทั้งหมด' });

            setEvent(item);
            setResource(res.resourceMap);
            setService(res.type);
            setEmpmstr(list_emp);
            setDayOff(res.dayOff)
            setBoolean(false)
        }
    }

    async function ChangeTpye(item) {
        setBoolean(true)

        const payload = JSON.stringify({
            key: "ChangeTpye",
            type: item.gmm_svtype_name,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            const list_emp = res.employee
            var slot = [];
            var list = [];

            if (res.events.length !== 0) {
                for (let i = 0; i < res.events.length; i++) {
                    let makeData = {
                        id: res.events[i]['id'],
                        title: res.events[i]['title'],
                        start: new Date(res.events[i]['start']),
                        end: new Date(res.events[i]['end']),
                        resourceId: res.events[i]['resourceId'],
                        desc: res.events[i]['desc'],
                    }

                    slot[i] = makeData
                    if (res.events.length === (i + 1)) {
                        for (let x = 0; x < res.dayLeave.length; x++) {
                            let LeaveData = {
                                id: Number(res.events[i]['id'] + 1),
                                title: res.dayLeave[x]['firstname'] + ' ' + res.dayLeave[x]['gmm_leave_type'],
                                start: new Date(res.dayLeave[x]['gmm_leave_date']),
                                end: new Date(res.dayLeave[x]['gmm_leave_date_to']),
                                resourceId: res.dayLeave[x]['gmm_leave_addr'],
                                desc: {
                                    name: res.dayLeave[x]['gmm_leave_fullname'],
                                    desc: res.dayLeave[x]['gmm_leave_desc']
                                },
                                leave: true
                            }
                            slot[i + (x + 1)] = LeaveData
                        }
                    }
                }
            } else {
                for (let x = 0; x < res.dayLeave.length; x++) {
                    let LeaveData = {
                        id: Number(x + 1),
                        title: res.dayLeave[x]['firstname'] + ' ' + res.dayLeave[x]['gmm_leave_type'],
                        start: new Date(res.dayLeave[x]['gmm_leave_date']),
                        end: new Date(res.dayLeave[x]['gmm_leave_date_to']),
                        resourceId: res.dayLeave[x]['gmm_leave_addr'],
                        desc: {
                            name: res.dayLeave[x]['gmm_leave_fullname'],
                            desc: res.dayLeave[x]['gmm_leave_desc']
                        },
                        leave: true
                    }

                    slot[x] = LeaveData
                }
            }

            // for (let i = 0; i < res.employee.length; i++) {
            //     list[i] = res.employee[i]

            //     if (res.employee.length === (i + 1)) {
            //         list[i + 1] = { gmm_emp_id: 'ALLIN', gmm_emp_fullname: 'แสดงทั้งหมด' }
            //     }
            // }

            list_emp.unshift({ gmm_emp_id: 'ALLIN', gmm_emp_fullname: 'แสดงทั้งหมด' });

            setEvent(slot);
            setResource(res.resourceMap);
            setForm({ ...Form, type: item, employee: { gmm_emp_id: 'ALLIN', gmm_emp_fullname: 'แสดงทั้งหมด' } })
            setBoolean(false)
            setEmpmstr(list_emp);
        }
    }

    async function ChangeDisplay(item) {
        setBoolean(true)

        const payload = JSON.stringify({
            key: "ChangeDisplay",
            type: Form.type,
            item: item.gmm_emp_id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            const slot = [];
            if (res.events.length !== 0) {
                for (let i = 0; i < res.events.length; i++) {
                    let makeData = {
                        id: res.events[i]['id'],
                        title: res.events[i]['title'],
                        start: new Date(res.events[i]['start']),
                        end: new Date(res.events[i]['end']),
                        resourceId: res.events[i]['resourceId'],
                        desc: res.events[i]['desc'],
                    }

                    slot[i] = makeData
                    if (res.events.length === (i + 1)) {
                        for (let x = 0; x < res.dayLeave.length; x++) {
                            let LeaveData = {
                                id: Number(res.events[i]['id'] + 1),
                                title: res.dayLeave[x]['firstname'] + ' ' + res.dayLeave[x]['gmm_leave_type'],
                                start: new Date(res.dayLeave[x]['gmm_leave_date']),
                                end: new Date(res.dayLeave[x]['gmm_leave_date_to']),
                                resourceId: res.dayLeave[x]['gmm_leave_addr'],
                                desc: {
                                    name: res.dayLeave[x]['gmm_leave_fullname'],
                                    desc: res.dayLeave[x]['gmm_leave_desc']
                                },
                                leave: true
                            }
                            slot[i + (x + 1)] = LeaveData
                        }
                    }
                }
            } else {
                for (let x = 0; x < res.dayLeave.length; x++) {
                    let LeaveData = {
                        id: Number(x + 1),
                        title: res.dayLeave[x]['firstname'] + ' ' + res.dayLeave[x]['gmm_leave_type'],
                        start: new Date(res.dayLeave[x]['gmm_leave_date']),
                        end: new Date(res.dayLeave[x]['gmm_leave_date_to']),
                        resourceId: res.dayLeave[x]['gmm_leave_addr'],
                        desc: {
                            name: res.dayLeave[x]['gmm_leave_fullname'],
                            desc: res.dayLeave[x]['gmm_leave_desc']
                        },
                        leave: true
                    }
                    slot[x] = LeaveData
                }
            }

            setEvent(slot);
            setResource(res.resourceMap);
            setForm({ ...Form, employee: item })
            setBoolean(false)
        }
    }


    const eventPropGetter = (event, start, end, isSelected) => {
        var display = (event.leave) ? 'red' :
            (event.desc.gmm_booking_status === 'PENDING') ? 'rgb(246 172 16)' :
                (event.desc.gmm_booking_status === 'SUCCESS') ? 'rgb(33, 124, 37)' :
                    (event.desc.gmm_booking_status === 'COMPLETE') ? '#3f51b5' :
                        (event.desc.gmm_booking_status === 'CANCEL') && 'rgb(155 155 155)';

        var style = { backgroundColor: display, fontSize: '12px' };
        return {
            style: style
        };
    }

    const customDayPropGetter = (date) => {
        let match = moment(date).format("YYYY-MM-DD");
        let output = dayOff.find((element, index) => {
            if (element === match) {
                return dayOff[index];
            }
        });

        if (match === output)
            return {
                className: 'special-day',
                style: {
                    backgroundColor: 'rgb(120 120 120)'
                },
            };
        else return {};
    };

    const SelectEvent = (event) => {
        if (!event.leave) {
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let substr = event.desc.gmm_booking_travel_start.split(' ');
            let substr_end = event.desc.gmm_booking_travel_end.split(' ');

            let convert = new Date(event.desc.gmm_booking_travel_start);
            let date_format = convert.toLocaleDateString("th", options);

            setIconTX(event.desc.icon_tx)
            setIconCG(event.desc.icon_cg)
            setShow({
                ...showInfo,
                booking_nbr: event.desc.gmm_booking_nbr,
                booking_status: event.desc.gmm_booking_status,
                booking_exp: event.desc.gmm_booking_exp_date,
                booking_product_name: event.desc.gmm_product_name,
                booking_product_desc: event.desc.gmm_product_desc,
                booking_date: date_format,
                booking_time: substr[1],
                booking_time_end: substr_end[1],
                //---------------------
                booking_u_tel: conv_formatTel(event.desc.gmm_user_tel),
                booking_p_tel: conv_formatTel(event.desc.gmm_passenger_tel),
                booking_t_tel: conv_formatTel(event.desc.gmm_tx_tel),
                booking_c_tel: (event.desc.gmm_booking_cg_radio === 'ON') ? conv_formatTel(event.desc.gmm_cg_tel) : null,
                booking_licenseplate: event.desc.gmm_emp_licenseplate,
                //---------------------
                booking_u: event.desc.gmm_user_fullname,
                booking_p: event.desc.gmm_passenger_fullname,
                booking_t: event.desc.gmm_tx_fullname,
                booking_c: (event.desc.gmm_booking_cg_radio === 'ON') ? event.desc.gmm_cg_fullname : null,
                //---------------------
                booking_hrtx: Number(event.desc.gmm_booking_taxi_hradd),
                booking_hrcg: (event.desc.gmm_booking_cg_radio === 'ON') ? Number(event.desc.gmm_booking_cg_hradd) : null,
                booking_startpoint: Number(event.desc.gmm_booking_cg_startpoint - 1),
                booking_starttime: event.desc.gmm_booking_cg_starttime,
                booking_txhrdefault: Number(event.desc.gmm_booking_taxi_hrdefault),
                booking_cghrdefault: Number(event.desc.gmm_booking_cg_hrdefault),
                booking_product_drop: event.desc.gmm_booking_product_drop,
                //---------------------
                booking_follower: (event.desc.gmm_booking_rmks_follower) ? event.desc.gmm_booking_rmks_follower : 0,
                booking_desc: (event.desc.gmm_booking_rmks_desc) ? event.desc.gmm_booking_rmks_desc : '-',
                booking_equipment: event.desc.gmm_booking_rmks_equipment,
                booking_point: event.desc.point
            })
            setOpenInfo(true);
        } else {
            setShowLeave({
                ...showLeave,
                emp_title: event.title,
                emp_desc: event.desc.desc,
                emp_name: event.desc.name
            })
            setOpenLeave(true)
        }
    }

    const handleClose = () => {
        setOpenInfo(false);
    }

    const handleType = (e, item) => {
        if (item) {
            ChangeTpye(item);
        }
    }

    const handleChangeDisplay = (e, item) => {
        if (item) {
            ChangeDisplay(item);
        }
    }

    const CloseLeave = () => {
        setOpenLeave(false);
    }

    const formats = {
        dayRangeHeaderFormat: ({ start, end }) => {
            return (moment(start).format('DD') + ' - ' + moment(end).format('DD') + ' ' + moment(start).format('MMMM'));
        },

        dayHeaderFormat: (date, empty, localizer) => {
            return (moment(date).format('dddd')) + ' ' + localizer.format(date, 'D', 'th') + ' ' + moment(date).format('MMMM');
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


    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} status={promise} />
            <Card variant="elevation" >
                <CardContent style={{ paddingBottom: '16px' }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                classes={{
                                    input: classes.font_normal,
                                    option: classes.font_normal,
                                }}
                                options={service}
                                getOptionLabel={(value) => value.gmm_svtype_name}
                                getOptionSelected={(option, value) =>
                                    option.gmm_svtype_id === value.gmm_svtype_id
                                }
                                value={Form.type}
                                onChange={handleType}
                                renderInput={(params) => (
                                    < TextField
                                        {...params}
                                        label="ประเภท"
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
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                classes={{
                                    input: classes.font_normal,
                                    option: classes.font_normal,
                                }}
                                options={empmstr}
                                getOptionLabel={(value) => value.gmm_emp_fullname}
                                getOptionSelected={(option, value) =>
                                    option.gmm_emp_id === value.gmm_emp_id
                                }
                                value={Form.employee}
                                onChange={handleChangeDisplay}
                                renderInput={(params) => (
                                    < TextField
                                        {...params}
                                        label="รายชื่อพนักงาน"
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

            <Box mt={3} />
            <Calendar
                eventPropGetter={eventPropGetter}
                dayPropGetter={customDayPropGetter}
                events={events}
                localizer={localizer}
                defaultView={'month'}
                views={['month', 'day']}
                messages={{
                    today: "Today",
                    previous: "<",
                    next: ">",
                    day: "Day",
                    month: "Month",
                }}
                formats={formats}
                style={{ height: '75vh' }}
                timeslots={6}
                defaultDate={new Date()}
                onDoubleClickEvent={SelectEvent}
                resources={resourceMap}
                resourceIdAccessor="resourceId"
                resourceTitleAccessor="resourceTitle"
            />

            <Dialog
                onClose={handleClose}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="customized-dialog-title"
                open={InfoData}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Detail Booking
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card variant="outlined" >
                                <CardContent style={{ paddingBottom: '16px' }} >
                                    <FormLabel className={classes.font_normal} >
                                        <SectionLineI classes={classes} docno={showInfo.booking_nbr} status={showInfo.booking_status} payment_exp={showInfo.booking_exp} />
                                    </FormLabel>
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
                                            <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{showInfo.booking_time} - {showInfo.booking_time_end} น.</Box></Grid>
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
                                                {showInfo.booking_c && <Grid item xs={6}>ผู้ดูแล : {(Number(showInfo.booking_product_drop) !== 2) ? 'ให้บริการ ' + (Number(showInfo.booking_hrcg) + Number(showInfo.booking_cghrdefault)) + ' ชั่วโมง' : '-'}</Grid>}
                                                {/* <Grid item xs={6}>คนขับรถ : {showInfo.booking_hrtx === 0 ? '-' : showInfo.booking_hrtx}</Grid>
                                                {showInfo.booking_c && <Grid item xs={6}>ผู้ดูแล : {showInfo.booking_hrcg === 0 ? '-' : showInfo.booking_hrcg}</Grid>} */}
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
                                        {showInfo.booking_point.map((label, index) => (
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
                </MuiDialogContent>
            </Dialog>

            <Dialog
                onClose={CloseLeave}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openLeave}>
                <MuiDialogTitle id="customized-dialog-title" onClose={CloseLeave}>
                    Detail Leave
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <p className={classes.StyleDetail}>
                        ชื่อ - นามสกุล : {showLeave.emp_name}
                    </p>
                    <Box mt={2} className={classes.font_smallR}>
                        {/* <span >ประเภทการลา : {showLeave.emp_title}</span> */}
                        <TextField
                            margin="dense"
                            defaultValue={'ประเภทการลา : ' + showLeave.emp_title}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                                className: classes.font_small,
                            }}
                            InputLabelProps={{
                                className: classes.font_normal,
                            }}
                        />
                    </Box>
                    <Box mt={2} >
                        <TextField
                            label="รายละเอียด"
                            multiline
                            rows={3}
                            defaultValue={showLeave.emp_desc}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                                className: classes.font_normal,
                            }}
                            InputLabelProps={{
                                className: classes.font_normal,
                                shrink: true
                            }}
                        />
                        {/* <strong>รายละเอียด : </strong> {showLeave.emp_desc ? showLeave.emp_desc : '-'} */}

                    </Box>
                </MuiDialogContent>
            </Dialog>
        </>
    );


}
