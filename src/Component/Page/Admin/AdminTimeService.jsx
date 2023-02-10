/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
    Backdrop, Button, Box, Card, CardContent, FormControl, FormLabel, TextField, Typography, Grid, FormHelperText
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { AccessTime, Save, Alarm } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import config from '../../config';

const useStyles = makeStyles((theme) => ({
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
        fontFamily: 'Regular',
        margin: '4px',
        fontSize: '14px'
    },
    font_normal: {
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
                    <Alarm />
                    <Typography className={classes.font_header}>กำหนดเวลาบริการ</Typography>
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
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <AccessTime fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;เลือกช่วงเวลาเปิดการจอง</Typography>
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
                    <AccessTime fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;เลือกหน่วยนาที (Stepper)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}


const value = {
    open: '00:00',
    close: '00:00',
    stepper: null,
}

export default function AdminTimeService() {
    const url = config.API_URL + "models/Admin/Admin_time.php";
    const classes = useStyles();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const { vision } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [stepper, setMinute] = useState([]);
    const [Form, setForm] = useState(value);
    const [promise, setPromise] = useState(false)

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "timing",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            (res.data.length !== 0) && setForm(res.data);
            setMinute(res.stepper)
            setBoolean(false);

        }
    }

    async function SaveData() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "setup_time",
            id: user.id != "" ? user.id : getLocalStorage().id,
            item: Form
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
            })
            setBoolean(false);
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleMinuteStep = (event, item) => {
        setForm({ ...Form, stepper: item });
    }

    const handleTime = (event) => {
        setForm({ ...Form, [event.target.name]: event.target.value })
    }

    const Submit = (event) => {
        event.preventDefault();
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

    }

    function ButtonSubmit({ classes, status }) {
        return (
            <>
                <Box mt={1} mb={2} className={classes.Submit}>
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

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />
            <form onSubmit={Submit}>
                <Card variant="outlined">
                    <CardContent style={{ paddingBottom: '16px' }}>
                        <FormLabel className={classes.font_normal} ><HeadersI classes={classes} /></FormLabel>
                        <FormControl component="fieldset">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6} >
                                    <TextField
                                        name="open"
                                        label="เปิด"
                                        variant="outlined"
                                        margin="dense"
                                        type="time"
                                        value={Form.open}
                                        onChange={handleTime}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                            shrink: true,
                                        }}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} >

                                    <TextField
                                        name="close"
                                        label="ถึง"
                                        variant="outlined"
                                        margin="dense"
                                        type="time"
                                        value={Form.close}
                                        onChange={handleTime}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                            shrink: true,
                                        }}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                        {/* </Container> */}
                    </CardContent>
                </Card>
                <Box mt={2} />
                <Card variant="outlined">
                    <CardContent style={{ paddingBottom: '16px' }}>
                        <FormLabel className={classes.font_normal} ><HeadersII classes={classes} /></FormLabel>
                        <FormControl component="fieldset">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6} >
                                    <Autocomplete
                                        classes={{
                                            input: classes.font_normal,
                                            option: classes.font_normal,
                                        }}
                                        options={stepper}
                                        getOptionLabel={(value) => value}
                                        getOptionSelected={(option, value) =>
                                            option === value
                                        }
                                        value={Form.stepper}
                                        onChange={handleMinuteStep}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Minute Step"
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
                            <FormHelperText className={classes.font_normal}> * สำหรับระบบการจอง ในส่วนการ "เลือกเวลา"</FormHelperText>
                        </FormControl>
                    </CardContent>
                </Card>
                <Box mt={2} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} >
                        <ButtonSubmit classes={classes} status={promise} />
                    </Grid>
                </Grid>

            </form>

        </>
    );
}
