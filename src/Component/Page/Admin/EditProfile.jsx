/* eslint-disable */
import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import {
    Backdrop, Button, Box, Card, Checkbox, Collapse, Container, CardContent, Divider,
    FormControl, FormGroup, FormControlLabel, TextField, Typography, Grid, IconButton, CardHeader, InputAdornment
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Save, Edit, ExpandMore, AccountCircle, Cancel, CheckCircle } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import * as action from "../../actions/action";
import Swal from 'sweetalert2'
import config from '../../config';

const useStyles = makeStyles((theme) => ({
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
    padding_table: {
        padding: theme.spacing(1)
    },
    Pagination: {
        flexShrink: 0,
        marginLeft: theme.spacing(4),
    },
    IconSearch: {
        color: 'gray'
    },
    font_header: {
        fontFamily: 'SemiBold',
        margin: '10px',
        fontSize: '18px'
    },
    font_subheader: {
        fontFamily: 'SemiBold',
        fontSize: '16px'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    colorGreen: {
        color: 'green'
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
                    <Edit />
                    <Typography className={classes.font_header}>แก้ไขโปรไฟล์</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}
//- Submit
function ChangePassSubmit({ classes, status, statusNew, statusCFNew }) {
    return (
        <>
            <Box mt={2} mb={1} className={classes.Submit}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={status === false || statusNew === false || statusCFNew === false}
                    className={classes.font_normal}
                    startIcon={<Save />}
                >
                    เปลี่ยนรหัสผ่าน
                </Button>
            </Box>
        </>
    )
}

function ChangeProfileSubmit({ classes }) {
    return (
        <>
            <Box mt={2} mb={1} className={classes.Submit}>
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


const Password = {
    oldpassword: '',
    newpassword: '',
    confirmpassword: '',
}

const Profiles = {
    fname: '',
    lname: '',
}


export default function EditProfile() {
    const url_admin = config.API_URL + "models/Admin/Admin_user.php";
    const classes = useStyles();
    const userProfile = useSelector(({ PromiseReducer }) => PromiseReducer);
    const dispatch = useDispatch();
    const [isLoading, setBoolean] = useState(false);
    const [Profile, setProfile] = useState(Profiles);
    const [Form, setForm] = useState(Password);
    const [name, setName] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [status, setStatus] = useState(false);
    const [statusNew, setStatusNew] = useState(false);
    const [statusCFNew, setStatusCFNew] = useState(false);


    const [show, setShow] = useState({
        checkbox: false
    })

    useEffect(() => {
        FirstLoad();
    }, [])

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Show_username",
            id: userProfile.id != "" ? userProfile.id : getLocalStorage().id,
        });

        const response = await fetch(url_admin, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setOldPass(res.password);
            setName(res.name);
            setBoolean(false);
        }
    }

    async function ChangeName() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Change_profile",
            id: userProfile.id != "" ? userProfile.id : getLocalStorage().id,
            item: Profile
        });

        const response = await fetch(url_admin, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();

        if (res.status) {
            setBoolean(false);
            setLocalStorage(Profile);
        }
    }

    async function ChangePassword() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Change_password",
            id: userProfile.id != "" ? userProfile.id : getLocalStorage().id,
            item: Form
        });

        const response = await fetch(url_admin, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();

        if (res.status) {
            setBoolean(false);
            setForm(Password);
            setShow({ ...show, checkbox: false })
            setStatus(false);
            setStatusNew(false);
            setStatusCFNew(false);

            FirstLoad();

            Swal.fire({
                title: "เรียบร้อย",
                text: "เปลี่ยนรหัสผ่านสำเร็จ",
                icon: "success",
            })
        } else {
            setBoolean(false);

            Swal.fire({
                title: "แจ้งเตือน",
                text: "รหัสผ่านปัจจุบันไม่ถูกต้อง กรุณาตรวจสอบ",
                icon: "warning",
            })
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };


    const [expanded, setExpanded] = useState({
        one: false,
        two: true
    });

    const handleExpandClick = (key) => {
        if (key == 'one') {
            setProfile({ ...Profile, fname: userProfile.fname, lname: userProfile.lname })

            setExpanded({ ...expanded, one: !expanded.one });
        } else {
            setExpanded({ ...expanded, two: !expanded.two });
        }

    };

    const handleShowPassword = (event) => {
        setShow({ ...show, [event.target.name]: event.target.checked });
    }

    const handleInputOldPassword = (event) => {
        if (event.target.value.match("^[a-zA-Z0-9]*$")) {
            setForm({ ...Form, [event.target.name]: event.target.value });
            if (event.target.value === oldPass) {
                setStatus(true)
            } else {
                setStatus(false)
            }
        }
    }

    const handleInputNewPassword = (event) => {
        if (event.target.value.match("^[a-zA-Z0-9]*$")) {
            setForm({ ...Form, [event.target.name]: event.target.value });
            if (event.target.value !== '') {
                if (event.target.value === Form.confirmpassword) {
                    setStatusCFNew(true)
                    setStatusNew(true)
                } else {
                    setStatusNew(false)
                }
            } else {
                setStatusCFNew(false)
                setStatusNew(false)
            }

        }
    }

    const handleInputCFNewPassword = (event) => {
        if (event.target.value.match("^[a-zA-Z0-9]*$")) {
            setForm({ ...Form, [event.target.name]: event.target.value });
            if (event.target.value !== '') {
                if (event.target.value === Form.newpassword) {
                    setStatusCFNew(true)
                    setStatusNew(true)
                } else {
                    setStatusCFNew(false)
                }
            } else {
                setStatusCFNew(false)
                setStatusNew(false)
            }
        }
    }

    const handleInputProfile = (event) => {
        setProfile({ ...Profile, [event.target.name]: event.target.value });
    }

    const setLocalStorage = (item) => {
        const Payload = JSON.parse(localStorage.cnf_us);
        const isData = { ...Payload, fname: item.fname, lname: item.lname };
        localStorage.setItem("cnf_us", JSON.stringify(isData));
        dispatch(action.setPromise(isData));

        Swal.fire({
            title: "เรียบร้อย",
            text: "เปลี่ยนชื่อโปรไฟล์สำเร็จ",
            icon: "success",
        })
    };

    const ChangePass = (event) => {
        event.preventDefault();

        Swal.fire({
            // title: "Change Password",
            text: "ท่านต้องการเปลี่ยนรหัสผ่าน หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                ChangePassword();
            }
        });
    }

    const ChangeProfile = (event) => {
        event.preventDefault();
        Swal.fire({
            // title: "Change Profile",
            text: "ท่านต้องการเปลี่ยนชื่อโปรไฟล์ หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                ChangeName();
            }
        });

    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />


            <Card variant="outlined">
                <CardHeader
                    action={
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded.one,
                            })}
                            onClick={() => { handleExpandClick('one') }}
                            aria-expanded={expanded.one}
                            aria-label="show more"
                        >
                            <ExpandMore />
                        </IconButton>
                    }
                    title="การตั้งค่าบัญชีผู้ใช้ทั่วไป"
                    classes={{
                        title: classes.font_subheader,
                    }}
                />
                <Collapse in={expanded.one} timeout="auto" unmountOnExit>
                    <form onSubmit={ChangeProfile}>
                        <Divider />
                        <CardContent>
                            <Container maxWidth="sm">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} >
                                        <TextField
                                            name="fname"
                                            label="ชื่อ"
                                            variant="outlined"
                                            margin="dense"
                                            value={Profile.fname}
                                            onChange={handleInputProfile}
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
                                            name="lname"
                                            label="นามสกุล"
                                            variant="outlined"
                                            margin="dense"
                                            value={Profile.lname}
                                            onChange={handleInputProfile}
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
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} >
                                        <ChangeProfileSubmit classes={classes} />
                                    </Grid>
                                </Grid>
                            </Container>
                        </CardContent>
                    </form>
                </Collapse>
            </Card>
            <Box mt={2} />
            <Card variant="outlined">
                <CardHeader
                    action={
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded.two,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded.two}
                            aria-label="show more"
                        >
                            <ExpandMore />
                        </IconButton>
                    }
                    title="เปลี่ยนรหัสผ่าน"
                    classes={{
                        title: classes.font_subheader,
                    }}
                />
                <Collapse in={expanded.two} timeout="auto" unmountOnExit>
                    <form onSubmit={ChangePass}>
                        <Divider />
                        <CardContent>
                            <Container maxWidth="xs">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} >
                                        <TextField
                                            label="ชื่อบัญชี"
                                            variant="outlined"
                                            margin="dense"
                                            value={name}
                                            InputProps={{
                                                className: classes.font_normal,
                                            }}
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                            disabled={true}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} >
                                        <TextField
                                            name="oldpassword"
                                            label="รหัสผ่านปัจจุบัน"
                                            variant="outlined"
                                            margin="dense"
                                            type={show.checkbox ? "text" : "password"}
                                            value={Form.oldpassword}
                                            onChange={handleInputOldPassword}
                                            InputProps={{
                                                className: classes.font_normal,
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        {status === true ? <CheckCircle className={classes.colorGreen} /> : <Cancel color="secondary" />}
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} >
                                        <TextField
                                            name="newpassword"
                                            label="รหัสผ่านใหม่"
                                            variant="outlined"
                                            margin="dense"
                                            type={show.checkbox ? "text" : "password"}
                                            value={Form.newpassword}
                                            onChange={handleInputNewPassword}
                                            InputProps={{
                                                className: classes.font_normal,
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        {statusNew === true ? <CheckCircle className={classes.colorGreen} /> : <Cancel color="secondary" />}
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} >
                                        <TextField
                                            name="confirmpassword"
                                            label="ยืนยันรหัสผ่านใหม่"
                                            variant="outlined"
                                            margin="dense"
                                            type={show.checkbox ? "text" : "password"}
                                            value={Form.confirmpassword}
                                            onChange={handleInputCFNewPassword}
                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                            InputProps={{
                                                className: classes.font_normal,
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        {statusCFNew === true ? <CheckCircle className={classes.colorGreen} /> : <Cancel color="secondary" />}
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
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} >
                                    <Box mt={1}>
                                        <FormControl component="fieldset">
                                            <FormGroup aria-label="position" row>
                                                <FormControlLabel
                                                    control={<Checkbox color="primary"
                                                        checked={show.checkbox}
                                                        onChange={handleShowPassword}
                                                        name="checkbox"
                                                    />}
                                                    label="แสดงรหัสผ่าน"
                                                    classes={{ label: classes.font_normal }}
                                                    size="small"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} >
                                        <ChangePassSubmit classes={classes} status={status} statusNew={statusNew} statusCFNew={statusCFNew} />
                                    </Grid>
                                </Grid>
                            </Container>
                        </CardContent>
                    </form>
                </Collapse>

            </Card>
            <Box mt={2} />

        </>

    );
}
