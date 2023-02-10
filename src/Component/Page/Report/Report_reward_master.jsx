/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
    Container, Backdrop, Button, Box, Checkbox, Card, CardContent,
    FormControl, FormLabel, TextField, Typography, Grid, FormGroup, FormControlLabel
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Edit, Refresh, FileCopy, Sort } from "@material-ui/icons";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    TimePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import moment from 'moment';
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import exportToExcel from '../../exportToExcel/Excel_code';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    btnExport: {
        textTransform: 'none', background: '#045c04', color: 'white',
        fontFamily: 'Regular',
        fontSize: '14px',
        '&:hover': {
            backgroundColor: '#067406',

        },
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
    displayflexCenter: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'center'
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
                    <FileCopy />
                    <Typography className={classes.font_header}>รายงานข้อมูลรางวัล</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function Topic({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Sort fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;Filter</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}


const filterForm = {
    SortPartner: null,
}

export default function Report_reward_master() {
    const url = config.API_URL + "models/Report/Report_reward.php";
    const classes = useStyles();
    const { vision } = useParams();
    const [promise, setPromise] = useState(false)
    const [isLoading, setBoolean] = useState(false);
    const [Form, setForm] = useState(filterForm);
    const [Partner, setPartner] = useState([]);

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_data",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(100);
        const res = await response.json();
        if (res.status) {
            setPartner(res.partner)
            setBoolean(false);
        }
    }

    async function LoadData() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "LoadData",
            item: Form,
            reward: reward
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            const json = res.data;
            const body = res.body;
            const files_name = res.file;
            const sheet_name = res.sheet;


            exportToExcel(files_name, sheet_name, body, json);
            setBoolean(false);
        } else {
            alert_message('ไม่พบข้อมูล');
            setBoolean(false);
        }
    }

    const alert_message = (txt) => {
        Swal.fire({
            // title: "Not Found",
            text: txt,
            icon: "info",
        })
    }

    const Clear = () => {
        setForm(filterForm)
        setReward([
            { reward: 'สินค้า', code: 'PRODUCT', status: false },
            { reward: 'คูปอง', code: 'COUPON', status: false },
            { reward: 'Ecoupon', code: 'ECOUPON', status: false }
        ])
    }


    const handleSortPartner = (ev, item) => {
        setForm({ ...Form, SortPartner: item });
    };

    const SubmitExport = () => {
        LoadData();
    }

    function ButtonSubmit({ classes, status }) {
        return (
            <>
                <Box className={classes.displayflexCenter} >
                    <Button
                        variant="outlined"
                        color="primary"
                        disabled={status}
                        onClick={Clear}
                        className={classes.font_normal}
                        startIcon={<Refresh />}
                    >
                        ล้างข้อมูล
                    </Button>
                    &nbsp; &nbsp;
                    <Button
                        variant="contained"
                        disabled={status}
                        onClick={SubmitExport}
                        className={classes.btnExport}
                    >
                        <img src="/image/Excel-icon1.png" width="24" height="24" />&nbsp;  Export To Excel

                    </Button>
                </Box>
            </>
        )
    }

    const [reward, setReward] = useState([
        { reward: 'สินค้า', code: 'PRODUCT', status: false },
        { reward: 'คูปอง', code: 'COUPON', status: false },
        { reward: 'Ecoupon', code: 'ECOUPON', status: false }
    ]);

    const handleDay = index => event => {
        let newArr = [...reward];
        newArr[index]['status'] = event.target.checked;

        setReward(newArr);
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />
            <Grid container spacing={2}>


                <Grid item xs={12} >
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>
                            <FormControl>
                                <FormLabel className={classes.font_normal} ><Topic classes={classes} /></FormLabel>
                                <Container maxWidth="xs">
                                    <Box mt={1} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} >
                                            <Autocomplete
                                                classes={{
                                                    input: classes.font_normal,
                                                    option: classes.font_normal,
                                                }}
                                                options={Partner}
                                                getOptionLabel={(value) => value.gmm_partner_name}
                                                getOptionSelected={(option, value) =>
                                                    option.gmm_partner_id === value.gmm_partner_id
                                                }
                                                value={Form.SortPartner}
                                                onChange={handleSortPartner}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="รายชื่อ Partner"
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            className: classes.font_normal,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <Card>
                                                <CardContent>
                                                    <FormControl component="fieldset" style={{ width: 'auto' }} className={classes.font_normal}>
                                                        <FormGroup>
                                                            <Box mt={1} />
                                                            {reward.map((desc, index) =>
                                                                <FormControlLabel
                                                                    key={desc.reward}
                                                                    classes={{ label: classes.font_normal }}
                                                                    control={<Checkbox color="primary" checked={desc.status}
                                                                        onChange={handleDay(index)}
                                                                        name={desc.reward} />}
                                                                    label={desc.reward}
                                                                    size="small"
                                                                />
                                                            )}
                                                        </FormGroup>
                                                    </FormControl>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </FormControl>
                        </CardContent>
                    </Card>
                    <Box m={4} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <ButtonSubmit classes={classes} status={promise} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}