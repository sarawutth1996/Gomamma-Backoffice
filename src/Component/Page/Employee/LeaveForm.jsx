/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    Backdrop, Button, Box, TextField, Typography, Grid, FormHelperText, Card, CardContent,
    FormLabel, FormControlLabel, FormControl, Radio, RadioGroup, InputAdornment, IconButton
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Assignment, Save, InsertInvitation, Copyright } from "@material-ui/icons";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    DatePicker,
    TimePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import moment from 'moment';
import * as action from "../../actions/action";
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
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
    font_header: {
        fontFamily: 'SemiBold',
        margin: '10px',
        fontSize: '18px'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    font_subheader: {
        fontFamily: 'Regular',
        margin: '4px',
        fontSize: '14px'
    },
    font_mobile_otp: {
        fontFamily: 'Regular',
        fontSize: '24px',
        textAlign: 'center'
    },
    font_small: {
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
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
                    <Assignment />
                    <Typography className={classes.font_header}>แบบฟอร์มการลา</Typography>
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
                    <Typography className={classes.font_subheader}>&nbsp;เลือก</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

const Leaveform = {
    id: '',
    service: null,
    employee: null,
    type: null,
    StartDate: null,
    timezone1: null,
    timezone2: null,
    event: '',
    desc: ''
}

export default function LeaveForm() {
    const url = config.API_URL + "models/Employee/Employee_leave_form.php";
    const classes = useStyles();
    const { vision, id } = useParams();
    const state = useHistory();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const dispatch = useDispatch();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [hiddInput, setHidd] = useState(false)
    const [Form, setForm] = useState(Leaveform);
    const [msgCount, setMsgCount] = useState(0);
    const [service, setService] = useState([]);
    const [leave, setLeave] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [lockTime1, setLockTime1] = useState(true);
    const [lockTime2, setLockTime2] = useState(true);
    const [Copy, setCopy] = useState({
        timezone1: null,
        timezone2: null,
    });

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, []);

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_form_master",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (res.data.length !== 0) {
                setMsgCount(res.data.desc.length)
                setForm(res.data)
                setHidd(true)
            }

            setLeave(res.leave)
            setService(res.service)
            setBoolean(false);
        }
    }

    async function list_employee(item) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "List_employee",
            type: item.gmm_svtype_name
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setForm({
                ...Form,
                service: item,
                employee: null,
                type: null,
                StartDate: null,
                timezone1: null,
                timezone2: null,
                event: ''
            })
            setLockTime1(true)
            setLockTime2(true)
            setEmployee(res.data)
            setBoolean(false);
        }
    }

    async function SaveData() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_leave_form",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: Form,
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
                const Payload = JSON.parse(localStorage.cnf_us);
                const isData = { ...Payload, mail_leave: Payload.mail_leave + 1 };
                localStorage.setItem("cnf_us", JSON.stringify(isData));
                dispatch(action.setPromise(isData));
                //---------------------------------------
                state.push('/Home/ManageLeave/' + vision);
            })
        } else {
            setBoolean(false);
            alert_message(res.message)
        }
    }

    async function schedule(date) {

        // setBoolean(true);
        const payload = JSON.stringify({
            key: "findschedule",
            tid: Form.employee.gmm_emp_id,
            date: 'วัน' + moment(date).format('dddd'),
            format: moment(date).format('YYYY/MM/DD')
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (Form.event === 'A') {
                setForm({ ...Form, StartDate: date, timezone1: res.data.gmm_emp_start_time, timezone2: res.data.gmm_emp_end_time })
                setCopy({ ...Copy, timezone1: res.data.gmm_emp_start_time, timezone2: res.data.gmm_emp_end_time })
                setLockTime1(true)
                setLockTime2(true)
            } else if (Form.event === 'F') {
                setForm({ ...Form, StartDate: date, timezone1: res.data.gmm_emp_start_time, timezone2: null })
                setCopy({ ...Copy, timezone1: res.data.gmm_emp_start_time, timezone2: res.data.gmm_emp_end_time })
                setLockTime1(true)
                setLockTime2(false)
            } else if (Form.event === 'B') {
                setForm({ ...Form, StartDate: date, timezone1: null, timezone2: res.data.gmm_emp_end_time })
                setCopy({ ...Copy, timezone1: res.data.gmm_emp_start_time, timezone2: res.data.gmm_emp_end_time })
                setLockTime1(false)
                setLockTime2(true)
            }
        } else {
            alert_message('ไม่มีการทำงาน ในวันที่ท่านต้องการลา');
        }
    }


    const alert_message = (txt) => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: txt,
            icon: "warning",
        })
    }


    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleService = (event, item) => {
        if (item) {
            list_employee(item)
        }
    };

    const handleEmployee = (event, item) => {
        setForm({ ...Form, employee: item });
    };

    const handleType = (event, item) => {
        setForm({ ...Form, type: item, });
    };

    const handleStartDate = (date) => {
        if (date !== 'Invalid Date' && date !== null) {
            schedule(date);
        }

    };

    const handlePickTime1 = (item) => {
        let timezone1 = moment(Copy.timezone1).format('HH:mm');
        let timezone2 = moment(Copy.timezone2).format('HH:mm');

        const minTime = moment(timezone1, "HH:mm");
        const maxTime = moment(timezone2, "HH:mm");

        if (minTime.isBefore(item) && maxTime.isAfter(item)) {
            setForm({ ...Form, timezone1: item });
        } else {
            alert_message('ไม่สามารถลาในช่วงเวลาดังกล่าว')
        }
    }

    const handlePickTime2 = (item) => {
        let timezone1 = moment(Copy.timezone1).format('HH:mm');
        let timezone2 = moment(Copy.timezone2).format('HH:mm');

        const minTime = moment(timezone1, "HH:mm");
        const maxTime = moment(timezone2, "HH:mm");

        if (minTime.isBefore(item) && maxTime.isAfter(item)) {
            setForm({ ...Form, timezone2: item });
        } else {
            alert_message('ไม่สามารถลาในช่วงเวลาดังกล่าว')
        }

    }

    const Submit = (event) => {
        event.preventDefault();
        if (Form.StartDate !== null && Form.timezone1 !== null && Form.timezone2 !== null) {
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
            alert_message('กรุณากรอกข้อมูลให้ครบถ้วน')
        }

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

    const handleEvent = (ev, item) => {

        if (Form.event !== '' && Form.StartDate !== null) {
            if (item === 'A') {
                setForm({ ...Form, timezone1: Copy.timezone1, timezone2: Copy.timezone2, event: item })
                setLockTime1(true)
                setLockTime2(true)
            } else if (item === 'B') {
                setForm({ ...Form, timezone1: null, timezone2: Copy.timezone2, event: item })
                setLockTime1(false)
                setLockTime2(true)
            } else if (item === 'F') {
                setForm({ ...Form, timezone1: Copy.timezone1, timezone2: null, event: item })
                setLockTime1(true)
                setLockTime2(false)
            }
        } else {
            setForm({ ...Form, event: item })
        }
    }

    const event_leave = [
        { id: 'A', desc: 'ลาทั้งวัน' },
        { id: 'F', desc: 'ลาช่วงเช้า' },
        { id: 'B', desc: 'ลาช่วงบ่าย' },
    ];

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />
            <form onSubmit={Submit}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
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
                                value={Form.service}
                                disabled={hiddInput}
                                onChange={handleService}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="ประเภทบริการ"
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
                        <Grid item xs={12} sm={12} md={12}>
                            <Autocomplete
                                classes={{
                                    input: classes.font_normal,
                                    option: classes.font_normal,
                                }}
                                options={employee}
                                getOptionLabel={(value) => value.gmm_emp_fullname}
                                getOptionSelected={(option, value) =>
                                    option.gmm_emp_id === value.gmm_emp_id
                                }
                                value={Form.employee}
                                disabled={hiddInput}
                                onChange={handleEmployee}
                                renderInput={(params) => (
                                    <TextField
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
                        <Grid item xs={12} sm={12} md={12}>
                            <Autocomplete
                                classes={{
                                    input: classes.font_normal,
                                    option: classes.font_normal,
                                }}
                                options={leave}
                                getOptionLabel={(value) => value.gmm_leave_name_th}
                                getOptionSelected={(option, value) =>
                                    option.gmm_leave_id === value.gmm_leave_id
                                }
                                value={Form.type}
                                disabled={hiddInput}
                                onChange={handleType}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="ประเภทการลา"
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

                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent style={{ paddingBottom: '16px' }}>
                                    <FormControl>
                                        <RadioGroup row aria-label="position" value={Form.event} onChange={handleEvent} defaultValue="top">
                                            {event_leave.map((event) =>
                                                <FormControlLabel key={event.id} value={event.id}
                                                    classes={{ label: classes.font_normal }}
                                                    control={<Radio color="primary" required />}
                                                    label={event.desc}
                                                    disabled={Form.employee === null || hiddInput}>
                                                </FormControlLabel>
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>


                        <Grid item xs={12}>
                            <DatePicker
                                label="วันที่"
                                placeholder="วัน/เดือน/ปี"
                                format="dd/MM/yyyy"
                                value={Form.StartDate}
                                onChange={handleStartDate}
                                margin="dense"
                                disabled={Form.event === '' || hiddInput === true}
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
                            <TimePicker
                                label="เริ่ม"
                                placeholder="__:__"
                                value={Form.timezone1}
                                onChange={handlePickTime1}
                                ampm={false}
                                format="HH:mm"
                                margin="dense"
                                inputVariant="outlined"
                                cancelLabel="ยกเลิก"
                                okLabel="ตกลง"
                                disabled={lockTime1 === true}
                                invalidDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                maxDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                minDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                InputProps={{
                                    className: classes.font_normal,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton disabled={lockTime1 === true}>
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

                        <Grid item xs={12} sm={6} md={6}>
                            <TimePicker
                                label="สิ้นสุด"
                                placeholder="__:__"
                                value={Form.timezone2}
                                onChange={handlePickTime2}
                                ampm={false}
                                format="HH:mm"
                                margin="dense"
                                inputVariant="outlined"
                                cancelLabel="ยกเลิก"
                                okLabel="ตกลง"
                                disabled={lockTime2 === true}
                                invalidDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                maxDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                minDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                                InputProps={{
                                    className: classes.font_normal,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton disabled={lockTime2 === true}>
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
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                name="desc"
                                variant="outlined"
                                placeholder="รายละเอียดเพิ่มเติม"
                                rows={3}
                                value={Form.desc}
                                onChange={(event) => {
                                    setForm({ ...Form, desc: event.target.value });
                                    setMsgCount(event.target.value.length);
                                }}
                                inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                InputProps={{
                                    className: classes.font_normal,
                                }}
                                InputLabelProps={{
                                    className: classes.font_normal,
                                }}
                                disabled={hiddInput}
                                multiline
                                fullWidth
                            />
                            <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                        </Grid>
                    </Grid>
                </MuiPickersUtilsProvider>
                {/* </FormControl>
                    </CardContent>
                </Card> */}
                {!hiddInput &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <ButtonSubmit classes={classes} status={promise} />
                        </Grid>
                    </Grid>
                }
            </form>
        </>
    );
}
