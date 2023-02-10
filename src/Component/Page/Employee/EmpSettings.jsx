/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, Chip, TextField, Typography, Grid, Hidden, InputAdornment, IconButton,
    Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper, Switch
} from "@material-ui/core";
import { Save, EventNote, Room, InsertInvitation, Keyboard } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker,
    KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import moment from 'moment';
import config from '../../config';

const StyledTableCell = withStyles(() => ({
    head: {
        backgroundColor: '#fcfcfc',
        fontFamily: "Regular",
        fontSize: 14,
    },
    body: {
        fontFamily: "Regular",
        fontSize: 14,
    }

}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        '&:nth-of-type(odd)': {
            fontFamily: "Regular",
            fontSize: 14,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
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
    font_header: {
        fontFamily: 'SemiBold',
        margin: '10px',
        fontSize: '18px'
    },
    font_chip: {
        fontFamily: 'Regular',
        fontSize: '12px',
    },
    font_subtitle: {
        fontFamily: 'Regular',
        fontSize: '14px',
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: "center",
    },
    font_mobile_otp: {
        fontFamily: 'Regular',
        fontSize: '24px',
        textAlign: 'center'
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
                    <EventNote />
                    <Typography className={classes.font_header}>กำหนดวันทำงาน</Typography>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}

export default function EmpSettings() {
    const url = config.API_URL + "models/Employee/Employee.php";
    const classes = useStyles();
    const { vision, id } = useParams();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false);
    const [headerData, setHeader] = useState([]);
    const [datatable, setData] = useState([]);
    const [Zone, setZone] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const headCells = [
        { id: 'day', label: 'รายการ', width: '30%', align: "center" },
        { id: 'start', label: 'เริ่ม', width: '25%', align: "center" },
        { id: 'end', label: 'ถึง', width: '25%', align: "center" },
        { id: 'Active', label: 'Active', width: '20%', align: "center" },
    ];

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_emp_schedule",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setZone(res.zone)
            setHeader(res.header);
            setData(res.data)
            setBoolean(false);
        }
    }

    async function SaveData() {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Update_schedule",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: datatable,
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: 'บันทึกข้อมูลสำเร็จ',
                icon: "success",
            }).then(() => {
                FirstLoad(id);
            })
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleTimeStart = (index, event) => {
        let TimeString = moment(event).format('YYYY/MM/DD HH:mm');

        let newArr = [...datatable];
        newArr[index]['gmm_emp_start_time'] = TimeString;
        setData(newArr);
    }

    const handleTimeEnd = (index, event) => {
        let TimeString = moment(event).format('YYYY/MM/DD HH:mm');
        let newArr = [...datatable];
        newArr[index]['gmm_emp_end_time'] = TimeString;
        setData(newArr);
    }

    const handleChangeSwitch = (event, index) => {
        let newArr = [...datatable];
        newArr[index]['gmm_emp_active'] = event.target.checked;
        setData(newArr);
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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'object') {
            if (b[orderBy].role < a[orderBy].role) {
                return -1;
            }
            if (b[orderBy].role > a[orderBy].role) {
                return 1;
            }
            return 0;
        } else {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        }


    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);

        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function EnhancedTableHead(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCells.map((headCell) => (
                        <StyledTableCell
                            key={headCell.id}
                            width={headCell.width}
                            align={headCell.align}
                        >
                            {headCell.label}
                        </StyledTableCell>
                    ))}
                </StyledTableRow>
            </TableHead>
        );
    }

    function ButtonSubmit({ classes, status }) {
        return (
            <>
                <Box mt={2} mb={2} className={classes.Submit}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        onClick={Submit}
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
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
                <Loading classes={classes} status={isLoading} />
                <Headers classes={classes} />

                <Box mt={3} mb={2} >
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={4} md={4} >
                            <Typography className={classes.font_subtitle}><strong>ชื่อ - นามสกุล :</strong> {headerData.gmm_emp_fullname}</Typography>
                        </Grid>
                        {(headerData.gmm_emp_licenseplate !== null) ?
                            <Grid item xs={12} sm={4} md={4} >
                                <Typography className={classes.font_subtitle}><strong>ทะเบียน : </strong>{headerData.gmm_emp_licenseplate}</Typography>
                            </Grid>
                            :
                            <Hidden xsDown>
                                <Grid item xs={12} sm={4} md={4} >
                                </Grid>
                            </Hidden>
                        }

                        <Hidden xsDown>
                            <Grid item xs={12} sm={4} md={4} >
                            </Grid>
                        </Hidden>
                        <Grid item xs={12} sm={4} md={4}>
                            <Typography className={classes.font_subtitle}><strong>จังหวัด : </strong> {headerData.gmm_emp_address_prov_desc_line3}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Typography className={classes.font_subtitle}><strong> เขต/อำเภอ :</strong> {headerData.gmm_emp_address_aump_desc_line3}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Typography className={classes.font_subtitle}><strong>แขวง/ตำบล :</strong>  {headerData.gmm_emp_address_tumb_desc_line3}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className={classes.displayflex}>
                                <Typography className={classes.font_subtitle}> <strong>โซน :</strong>
                                </Typography>
                                &nbsp;
                                {Zone.length === 0 ? '-' : Zone.map((list, index) => {
                                    return (
                                        <Box key={index}>
                                            <Chip
                                                icon={<Room fontSize="small" />}
                                                classes={{ label: classes.font_chip }}
                                                label={list.zone_name}
                                                color="primary"
                                            />
                                            &nbsp;
                                        </Box>
                                    )
                                })}

                            </Box>

                        </Grid>
                    </Grid>
                </Box>



                <PageLine />
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box mt={2} />
                        <TableContainer component={Paper}>
                            <Table aria-label="custom pagination table">
                                <EnhancedTableHead
                                    classes={classes}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {datatable.map((row, index) => (
                                        <StyledTableRow hover key={index}>
                                            <StyledTableCell width='30%' align="left">
                                                {row.gmm_emp_day}
                                            </StyledTableCell>
                                            <StyledTableCell width='25%' align="center">
                                                <KeyboardTimePicker
                                                    placeholder="__:__"
                                                    value={row.gmm_emp_start_time}
                                                    onChange={(event) => { handleTimeStart(index, event) }}
                                                    ampm={false}
                                                    format="HH:mm"
                                                    margin="dense"
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
                                            </StyledTableCell>
                                            <StyledTableCell width='25%' align="center">
                                                <KeyboardTimePicker
                                                    placeholder="__:__"
                                                    value={row.gmm_emp_end_time}
                                                    onChange={(event) => { handleTimeEnd(index, event) }}
                                                    ampm={false}
                                                    format="HH:mm"
                                                    margin="dense"
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
                                            </StyledTableCell>
                                            <StyledTableCell width='20%' align="center">
                                                <Switch
                                                    checked={row.gmm_emp_active}
                                                    onChange={(e) => { handleChangeSwitch(e, index) }}
                                                    color="primary"
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} >
                        <ButtonSubmit classes={classes} status={promise} />
                    </Grid>
                </Grid>
            </MuiPickersUtilsProvider>
        </>
    );
}
