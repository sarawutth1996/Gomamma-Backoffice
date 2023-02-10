/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import {
    Backdrop, Button, Box, TextField, Typography, Grid, FormHelperText
} from "@material-ui/core";
import { Save, Feedback } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
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
    },
    font_small: {
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
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

function Headers({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Feedback />
                    <Typography className={classes.font_header}>แบบฟอร์มส่งคำร้องเรียน</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

const content = {
    title: '',
    from: '',
    message: '',
}

export default function AdminFormFeedback() {
    const url = config.API_URL + "models/Admin/Admin_Feedback.php";
    const classes = useStyles();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const { vision } = useParams();
    const dispatch = useDispatch();
    const [isLoading, setBoolean] = useState(false);
    const [Form, setForm] = useState(content);
    const [msgCount, setMsgCount] = useState(0);
    const [promise, setPromise] = useState(false)

    useEffect(() => {
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function SaveData() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_feedback",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: Form
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {

            setBoolean(false);

            Swal.fire({
                title: "เรียบร้อย",
                text: 'บันทึกข้อมูลสำเร็จ',
                icon: "success",
            }).then(() => {
                const Payload = JSON.parse(localStorage.cnf_us);
                const isData = { ...Payload, feedback: Payload.feedback + 1 };
                localStorage.setItem("cnf_us", JSON.stringify(isData));
                dispatch(action.setPromise(isData));

                state.push('/Home/AdminFeedback/' + vision);
            })
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

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
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            label="หัวข้อ"
                            variant="outlined"
                            margin="dense"
                            value={Form.title}
                            onChange={(e) => {
                                setForm({ ...Form, title: e.target.value });
                            }}
                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                            InputProps={{
                                className: classes.font_normal,
                            }}
                            InputLabelProps={{
                                className: classes.font_normal,
                                shrink: true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            label="จาก"
                            variant="outlined"
                            margin="dense"
                            value={Form.from}
                            onChange={(e) => {
                                setForm({ ...Form, from: e.target.value });
                            }}
                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                            InputProps={{
                                className: classes.font_normal,
                            }}
                            InputLabelProps={{
                                className: classes.font_normal,
                                shrink: true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: '8px' }}>
                        <TextField
                            variant="outlined"
                            value={Form.message}
                            onChange={(e) => {
                                setForm({ ...Form, message: e.target.value });
                                setMsgCount(e.target.value.length);
                            }}
                            inputProps={{ maxLength: 256, className: classes.font_normal, }}
                            InputProps={{
                                className: classes.font_normal,
                            }}
                            InputLabelProps={{
                                className: classes.font_normal,
                            }}
                            rows={4}
                            multiline
                            fullWidth
                        />
                        <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} >
                        <ButtonSubmit classes={classes} status={promise} />
                    </Grid>
                </Grid>

            </form>

        </>
    );
}
