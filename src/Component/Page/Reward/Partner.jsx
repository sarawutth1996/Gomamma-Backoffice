/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, Card, CardContent, FormControl, FormLabel, TextField, Typography, Grid,
} from "@material-ui/core";
import { Description, Save, Subject } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import config from '../../config'

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
                    <Description />
                    <Typography className={classes.font_header}>กำหนดพาร์ทเนอร์</Typography>
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
                    <Subject fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ข้อมูลพาร์ทเนอร์</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

const partner = {
    partner_id: '',
    partner_name: '',
    partner_company: '',
    partner_contact: '',
    partner_tel: '',
    partner_email: '',
    partner_line: '',
    partner_group: '',
    partner_website: '',
    partner_facebook: '',
    partner_desc: '',
    errorTel: {
        status: false,
        message: '',
    },
    errorEmail: {
        status: false,
        message: '',
    }
}


export default function Partner() {
    const url = config.API_URL + "models/Reward/Reward_partner.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const classes = useStyles();
    const { vision, id } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const telRef = useRef(null);
    const emailRef = useRef(null);
    const [Form, setForm] = useState(partner);

    useEffect(() => {
        FirstLoad(id);
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad(id) {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_master",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (res.data.length !== 0) {
                setForm(res.data);
            }

            setBoolean(false);
        }
    }

    async function SaveData() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_partner",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: Form,
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
                state.push('/Home/ManagePartner/' + vision);
            })
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleChangeInput = (event) => {
        const { target } = event;
        const { name } = target;
        if (name === "partner_e") {
            if (target.value.length === 0) {
                setForm({ ...Form, partner_email: target.value, errorEmail: { message: '', status: false } })
            } else {
                (target.value.match((/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i))) ?
                    setForm({ ...Form, partner_email: target.value, errorEmail: { message: '', status: false } }) :
                    setForm({ ...Form, partner_email: target.value, errorEmail: { message: 'รูปแบบที่อยู่อีเมล์ให้ถูกต้อง', status: true } })
            }
        } else if (name === "partner_t") {
            if (target.value.match("^[0-9]*$")) {
                if (target.value.length === 0) {
                    setForm({
                        ...Form,
                        partner_tel: target.value,
                        errorTel: { message: "", status: false },
                    });
                } else {
                    const fix_number = target.value.substr(0, 2);
                    if (fix_number !== "02" && fix_number !== "06" && fix_number !== "08" && fix_number !== "09") {

                        setForm({
                            ...Form,
                            partner_tel: target.value,
                            errorTel: {
                                message: "หมวดหมายเลขโทรศัพท์ ไม่ถูกต้อง",
                                status: true,
                            },

                        });
                    } else {
                        if (fix_number === "06" || fix_number === "08" || fix_number === "09") {
                            if (target.value.length == 10) {
                                setForm({
                                    ...Form,
                                    partner_tel: target.value,
                                    errorTel: { message: "", status: false },
                                });
                            } else {
                                setForm({
                                    ...Form,
                                    partner_tel: target.value,
                                    errorTel: { message: "หมายเลขโทรศัพท์จำนวน 10 หลัก", status: true },
                                });
                            }
                        } else {
                            if (fix_number === "02") {
                                if (target.value.length == 9) {
                                    setForm({
                                        ...Form,
                                        partner_tel: target.value,
                                        errorTel: { message: "", status: false },
                                    });

                                } else {
                                    setForm({
                                        ...Form,
                                        partner_tel: target.value,
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
        }
    }

    const Submit = (event) => {
        event.preventDefault();
        if (Form.errorEmail.status === false && Form.errorTel.status === false) {
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
                    SaveData()
                }
            });
        } else {

            if (Form.errorEmail.status) {
                emailRef.current.focus()
            }

            if (Form.errorTel.status) {
                telRef.current.focus()
            }
        }

    }

    //- Submit
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
                                <Grid item xs={12} sm={6} md={6} >
                                    <TextField
                                        label="ชื่อที่แสดง"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        value={Form.partner_name}
                                        onChange={(event) => { setForm({ ...Form, partner_name: event.target.value }) }}
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
                                <Grid item xs={12} sm={6} md={6} >
                                    <TextField
                                        label="ชื่อบริษัท"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        value={Form.partner_company}
                                        onChange={(event) => { setForm({ ...Form, partner_company: event.target.value }) }}
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
                                <Grid item xs={12} sm={6} md={6} >
                                    <TextField
                                        label="ผู้ติดต่อ"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        value={Form.partner_contact}
                                        onChange={(event) => { setForm({ ...Form, partner_contact: event.target.value }) }}
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
                                <Grid item xs={12} sm={6} md={6} >
                                    <TextField
                                        name="partner_t"
                                        label="เบอร์โทรศัพท์"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        inputRef={telRef}
                                        value={Form.partner_tel}
                                        onChange={handleChangeInput}
                                        error={Form.errorTel.status}
                                        helperText={Form.errorTel.message}
                                        inputProps={{ maxLength: 10, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal
                                        }}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} >
                                    <TextField
                                        name="partner_e"
                                        label="Email"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        inputRef={emailRef}
                                        value={Form.partner_email}
                                        onChange={handleChangeInput}
                                        error={Form.errorEmail.status}
                                        helperText={Form.errorEmail.message}
                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal
                                        }}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} >
                                    <TextField
                                        label="Line ID"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        value={Form.partner_line}
                                        onChange={(event) => { setForm({ ...Form, partner_line: event.target.value }) }}
                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal
                                        }}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} >
                                    <TextField
                                        label="Website"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        value={Form.partner_website}
                                        onChange={(event) => { setForm({ ...Form, partner_website: event.target.value }) }}
                                        inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} >
                                    <TextField
                                        label="Facebook"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        value={Form.partner_facebook}
                                        onChange={(event) => { setForm({ ...Form, partner_facebook: event.target.value }) }}
                                        inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} >
                                    <TextField
                                        label="หมวด"
                                        variant="outlined"
                                        margin="dense"
                                        autoComplete="off"
                                        value={Form.partner_group}
                                        onChange={(event) => { setForm({ ...Form, partner_group: event.target.value }) }}
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
                                <Grid item xs={12} sm={12} md={12} >
                                    <TextField
                                        placeholder="รายละเอียดเพิ่มเติม"
                                        variant="outlined"
                                        rows={3}
                                        value={Form.partner_desc}
                                        onChange={(event) => { setForm({ ...Form, partner_desc: event.target.value }) }}
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
                                </Grid>
                            </Grid>
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
