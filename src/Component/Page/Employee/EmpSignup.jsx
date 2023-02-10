/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AppBar, Backdrop, Button, Box, Card, Checkbox, CardContent, TextField, Typography, Grid, IconButton, InputAdornment, Hidden, FormLabel, FormControlLabel, FormControl, Radio, RadioGroup,
    Tabs, Tab, FormGroup, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Slide
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { AttachFile, Assignment, AccountBalance, Person, HomeWork, Close, Payment, LibraryBooks, Save, SmokingRooms, SupervisedUserCircle, PermContactCalendar, MyLocation, SkipNext, SkipPrevious, } from "@material-ui/icons";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import config from '../../config';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
        background: '#dbdcdc',
    },
}))(DialogContent);

const custom_overlay = {
    overlay: {
        zIndex: 9999,
    },
}

const AntTabs = withStyles({
    indicator: {
        backgroundColor: 'white',
    },
})(Tabs);

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
    root: {
        flexGrow: 1,
        border: '1px solid #eeeeee'
    },
    ActionPage: {
        justifyContent: 'space-between'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    itemCenter: {
        alignItems: "center",
    },
    Submit: {
        textAlign: "center",
    },
    selectIcon: {
        marginRight: theme.spacing(2),
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
    displayflexEnd: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'flex-end',
        marginTop: '4px'
    },
    padding_table: {
        padding: theme.spacing(1)
    },
    Pagination: {
        flexShrink: 0,
        marginLeft: theme.spacing(4),
    },
    LayoutPDF: {
        display: "flex",
        justifyContent: 'center',
        background: '#dbdcdc',
        height: '100%'
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
    },
    font_mobile_otp: {
        fontFamily: 'Regular',
        fontSize: '24px',
        textAlign: 'center'
    },
}));

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
                <Box p={2} className={classes.font_normal}>{children}</Box>
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
                    <Person />
                    <Typography className={classes.font_header}>ลงทะเบียนพนักงาน</Typography>
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
                    <Assignment fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ข้อมูลส่วนตัว</Typography>
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
                    <SupervisedUserCircle fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;สังกัด</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersIII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <SmokingRooms fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;สูบบุหรี่หรือไม่</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersIV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Payment fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ใบอนุญาตขับขี่</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <AccountBalance fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ธนาคาร</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersVI({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <PermContactCalendar fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;บุคคลที่สามารถติดต่อได้ (กรณีฉุกเฉิน)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersVII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <HomeWork fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;ประสบการณ์ทำงาน</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersVIII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <LibraryBooks fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;วุฒิการศึกษา</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function HeadersXV({ classes }) {
    return (
        <>
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <AttachFile fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;เอกสารแนบ</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
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
                    startIcon={<Save />}
                >
                    บันทึก
                </Button>
            </Box>
        </>
    )
}

const FormAdsTx1 = {
    no: '',
    road: '',
    soi: '',
    prov: null,
    aump: null,
    tumb: null,
    zipcode: null,
}

const FormAdsTx2 = {
    no: '',
    road: '',
    soi: '',
    prov: null,
    aump: null,
    tumb: null,
    zipcode: null,
}

const FormAdsTx3 = {
    no: '',
    road: '',
    soi: '',
    prov: null,
    aump: null,
    tumb: null,
    zipcode: null,
    lat: '',
    lng: ''
}

const FormAdsCG1 = {
    no: '',
    road: '',
    soi: '',
    prov: null,
    aump: null,
    tumb: null,
    zipcode: null,
}

const FormAdsCG2 = {
    no: '',
    road: '',
    soi: '',
    prov: null,
    aump: null,
    tumb: null,
    zipcode: null,
}

const FormAdsCG3 = {
    no: '',
    road: '',
    soi: '',
    prov: null,
    aump: null,
    tumb: null,
    zipcode: null,
    lat: '',
    lng: ''
}

const TX = {
    id: '',
    fname: '',
    lname: '',
    citizen: '',
    sex: null,
    weight: '',
    height: '',
    age: '',
    tel: '',
    LineID: '',
    day: null,
    month: null,
    year: null,
    cradle: '',
    cooperative: '',
    lcp: '',
    smoking: 'N',
    lcp_num: '',
    lcp_public_num: '',
    exp_num: null,
    exp_public: null,
    bank_list: null,
    bank_name: '',
    bank_code: '',
    rel_fullname: '',
    rel_tel: '',
    rel_user: '',
    errorTel: {
        status: false,
        message: '',
    },
    errorTelRef: {
        status: false,
        message: '',
    },
}

const CG = {
    id: '',
    fname: '',
    lname: '',
    citizen: '',
    sex: null,
    weight: '',
    height: '',
    age: '',
    tel: '',
    LineID: '',
    day: null,
    month: null,
    year: null,
    smoking: 'N',
    bank_list: null,
    exp_year: '',
    exp_insite_year: '',
    hospital: '',
    Education: null,
    Certificate: '',
    bank_name: '',
    bank_code: '',
    rel_fullname: '',
    rel_tel: '',
    rel_user: '',
    errorTel: {
        status: false,
        message: '',
    },
    errorTelRef: {
        status: false,
        message: '',
    },
}

const CheckListTX = {
    checkedTaxiA: false,
    checkedTaxiB: false,
    checkedTaxiC: false,
}

const CheckListCG = {
    checkedCGA: false,
    checkedCGB: false,
    checkedCGC: false,
}

export default function Emp_signup() {
    const url = config.API_URL + "models/Employee/Employee.php";
    // const url = 'https://backoffice.go-mamma.com/php/models/Employee/Employee.php';
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const classes = useStyles();
    const citizenRef = useRef(null);
    const telRef = useRef(null);
    const rel_telRef = useRef(null);
    const { vision, id } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false);
    const [TopicLock, setLocked] = useState(false);
    const [myService, setMyService] = useState('TX');
    const [Indx, setIndex] = useState(0);
    //Master
    const [service, setService] = useState([]);
    const [smoking, setSmoking] = useState([]);
    const [prov, setProv] = useState([]);
    const [sex, setSex] = useState([]);
    const [days, setNumbers] = useState([]);
    const [month, setMonths] = useState([]);
    const [years, setYear] = useState([]);
    const [banks, setBanks] = useState([]);
    const [education, setEducation] = useState([]);
    const DataImgTX = [
        { Topic_id: '01', Topic: 'สำเนาเล่มจดทะเบียน', file: 'imageSrc1', base64: '', preview: '', status: true, type: "PDF" },
        { Topic_id: '02', Topic: 'สำเนาบัตรประชาชน', file: 'imageSrc2', base64: '', preview: '', status: true, type: "PDF" },
        { Topic_id: '03', Topic: 'สำเนาทะเบียนบ้าน', file: 'imageSrc3', base64: '', preview: '', status: true, type: "PDF" },
        { Topic_id: '04', Topic: 'รูปถ่าย', file: 'imageSrc4', base64: '', preview: '', status: true, type: "IMAGE" },
        { Topic_id: '05', Topic: 'ใบสมัคร', file: 'imageSrc5', base64: '', preview: '', status: true, type: "PDF" },
        { Topic_id: '06', Topic: 'Driver Card', file: 'imageSrc6', base64: '', preview: '', status: true, type: "IMAGE" },
    ];

    const DataImgCG = [
        { Topic_id: '01', Topic: 'สำเนาบัตรประชาชน', file: 'imageSrc1', base64: '', preview: '', status: true, type: "PDF" },
        { Topic_id: '02', Topic: 'รูปถ่าย', file: 'imageSrc2', base64: '', preview: '', status: true, type: "IMAGE" },
        { Topic_id: '03', Topic: 'ใบสมัคร', file: 'imageSrc3', base64: '', preview: '', status: true, type: "PDF" },
        { Topic_id: '04', Topic: 'วุฒิบัตร 1', file: 'imageSrc4', base64: '', preview: '', status: true, type: "PDF" },
        { Topic_id: '05', Topic: 'วุฒิบัตร 2', file: 'imageSrc5', base64: '', preview: '', status: true, type: "PDF" },
        { Topic_id: '06', Topic: 'CG Card', file: 'imageSrc6', base64: '', preview: '', status: true, type: "IMAGE" },
    ]

    useEffect(() => {
        FirstLoad(id);
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad(id) {

        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_employee_master",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (res.data.length !== 0) {
                if (res.myService === 'TX') {
                    setTaxi(res.data);
                    setLocked(true)
                    setAdsTaxi1(res.addr1);
                    setAdsTaxi2(res.addr2);
                    setAdsTaxi3(res.addr3);

                    setAumpTX1(res.aump1);
                    setTumbTX1(res.tumb1);
                    setZipcTX1(res.zipc1);

                    setAumpTX2(res.aump2);
                    setTumbTX2(res.tumb2);
                    setZipcTX2(res.zipc2);

                    setAumpTX3(res.aump3);
                    setTumbTX3(res.tumb3);
                    setZipcTX3(res.zipc3);

                    (res.tabA) ? setLockTab2(true) : setLockTab2(false);
                    (res.tabB === true || res.tabC === true) ? setLockTab3(true) : setLockTab3(false);

                    setDataTX(res.img);
                    setCheckedTaxi({ ...FormcheckTaxi, checkedTaxiA: res.tabA, checkedTaxiB: res.tabB, checkedTaxiC: res.tabC })

                } else {
                    setCG(res.data);
                    setLocked(true)
                    setAdsCG1(res.addr1)
                    setAdsCG2(res.addr2)
                    setAdsCG3(res.addr3)

                    setAumpCG1(res.aump1);
                    setTumbCG1(res.tumb1);
                    setZipcCG1(res.zipc1);

                    setAumpCG2(res.aump2);
                    setTumbCG2(res.tumb2);
                    setZipcCG2(res.zipc2);

                    setAumpCG3(res.aump3);
                    setTumbCG3(res.tumb3);
                    setZipcCG3(res.zipc3);

                    (res.tabA) ? setLockTab2(true) : setLockTab2(false);
                    (res.tabB === true || res.tabC === true) ? setLockTab3(true) : setLockTab3(false);

                    setDataCG(res.img);
                    setCheckedCG({ ...FormcheckCG, checkedCGA: res.tabA, checkedCGB: res.tabB, checkedCGC: res.tabC })
                }
            } else {
                setLocked(false)
            }

            setMyService(res.myService)
            setSex(res.sex);
            setService(res.svtype);
            setSmoking(res.smoking);
            setProv(res.prov);
            setNumbers(res.number);
            setMonths(res.month);
            setYear(res.year);
            setBanks(res.bank);
            setEducation(res.education);
            setBoolean(false);
        }
    }

    async function SaveData() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_employee",
            id: user.id != "" ? user.id : getLocalStorage().id,
            type: myService,
            item: (myService === 'TX' ? FormTX : FormCG),
            addr1: (myService === 'TX' ? addressTaxi1 : addressCG1),
            addr2: (myService === 'TX' ? addressTaxi2 : addressCG2),
            addr3: (myService === 'TX' ? addressTaxi3 : addressCG3),
            image: (myService === 'TX' ? datatableTX : datatableCG),
            KeyTabs: (myService === 'TX' ? FormcheckTaxi : FormcheckCG),
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: res.message,
                icon: "success",
            }).then(() => {
                state.push('/Home/ManageEmployee/' + vision);
            })
        } else {

            if (res.message === 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว') {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: res.message,
                    icon: "warning",
                    didClose: () => { telRef.current.focus() }
                })
            } else {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: res.message,
                    icon: "warning",
                    didClose: () => { citizenRef.current.focus() }
                })
            }

            setBoolean(false);
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleService = (event) => {

        setMyService(event.target.value);

        if (event.target.value === 'TX') {
            setCG(CG)
            setAdsCG1(FormAdsCG1)
            setAdsCG2(FormAdsCG2)
            setAdsCG2(FormAdsCG3)
            setCheckedCG(CheckListCG)
            setDataCG(DataImgCG)
            setTabCG(0)
        } else {
            setTaxi(TX)
            setAdsTaxi1(FormAdsTx1)
            setAdsTaxi2(FormAdsTx2)
            setAdsTaxi3(FormAdsTx3)
            setCheckedTaxi(CheckListTX)
            setDataTX(DataImgTX)
            setTabTX(0)
        }
    }

    const numberFormat = (value) => {
        if (value.length === 1 && value === '.') {
            return undefined;
        } else {
            if (value.match("^[0-9.]*$")) {
                if (value.match("^[0-9]*(\.[0-9]?)?$")) {
                    return value;
                }
            }
        }
    }

    const Submit = (event) => {
        event.preventDefault();

        if (myService === 'TX') { // PROFILE TAXI
            if (FormTX.errorTel.status === false && FormTX.errorTelRef.status === false) {
                if (addressTaxi1.no !== '' && addressTaxi1.road !== '' && addressTaxi1.soi !== '' && addressTaxi1.soi !== '' &&
                    addressTaxi1.prov !== null && addressTaxi1.aump !== null && addressTaxi1.tumb !== null && addressTaxi1.zipcode) {
                    if (addressTaxi2.no !== '' && addressTaxi2.road !== '' && addressTaxi2.soi !== '' && addressTaxi2.soi !== '' &&
                        addressTaxi2.prov !== null && addressTaxi2.aump !== null && addressTaxi2.tumb !== null && addressTaxi2.zipcode) {
                        if (addressTaxi3.no !== '' && addressTaxi3.road !== '' && addressTaxi3.soi !== '' && addressTaxi3.soi !== '' &&
                            addressTaxi3.prov !== null && addressTaxi3.aump !== null && addressTaxi3.tumb !== null && addressTaxi3.zipcode !== null
                            && addressTaxi3.lat !== '' && addressTaxi3.lng !== '') {
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
                            Swal.fire({
                                title: "ที่อยู่จุดออกรถ",
                                text: "กรุณากรอกรายละเอียดที่อยู่จุดออกรถ",
                                icon: "warning",
                            }).then(() => {
                                setTabTX(2);
                            })
                        }
                    } else {
                        Swal.fire({
                            title: "ที่อยู่ปัจจุบัน",
                            text: "กรุณากรอกรายละเอียดที่อยู่ปัจจุบัน",
                            icon: "warning",
                        }).then(() => {
                            setTabTX(1);
                        })
                    }
                } else {
                    Swal.fire({
                        title: "ที่อยู่ตามทะเบียนบ้าน",
                        text: "กรุณากรอกรายละเอียดที่อยู่ตามทะเบียนบ้าน",
                        icon: "warning",
                    }).then(() => {
                        setTabTX(0);
                    })
                }
            } else {
                (FormTX.errorTelRef.status) && rel_telRef.current.focus();
                (FormTX.errorTel.status) && telRef.current.focus();
            }
        } else {
            if (FormCG.errorTel.status === false && FormCG.errorTelRef.status === false) {
                if (addressCG1.no !== '' && addressCG1.road !== '' && addressCG1.soi !== '' && addressCG1.soi !== '' &&
                    addressCG1.prov !== null && addressCG1.aump !== null && addressCG1.tumb !== null && addressCG1.zipcode) {
                    if (addressCG2.no !== '' && addressCG2.road !== '' && addressCG2.soi !== '' && addressCG2.soi !== '' &&
                        addressCG2.prov !== null && addressCG2.aump !== null && addressCG2.tumb !== null && addressCG2.zipcode) {
                        if (addressCG3.no !== '' && addressCG3.road !== '' && addressCG3.soi !== '' && addressCG3.soi !== '' &&
                            addressCG3.prov !== null && addressCG3.aump !== null && addressCG3.tumb !== null && addressCG3.zipcode !== null
                            && addressCG3.lat !== '' && addressCG3.lng !== '') {
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
                            Swal.fire({
                                title: "ที่อยู่จุดออกไปทำงาน",
                                text: "กรุณากรอกรายละเอียดที่อยู่จุดออกไปทำงาน",
                                icon: "warning",
                            }).then(() => {
                                setTabTX(2);
                            })
                        }
                    } else {
                        Swal.fire({
                            title: "ที่อยู่ปัจจุบัน",
                            text: "กรุณากรอกรายละเอียดที่อยู่ปัจจุบัน",
                            icon: "warning",
                        }).then(() => {
                            setTabCG(1);
                        })
                    }
                } else {
                    Swal.fire({
                        title: "ที่อยู่ตามทะเบียนบ้าน",
                        text: "กรุณากรอกรายละเอียดที่อยู่ตามทะเบียนบ้าน",
                        icon: "warning",
                    }).then(() => {
                        setTabCG(0);
                    })
                }
            } else {
                (FormCG.errorTelRef.status) && rel_telRef.current.focus();
                (FormCG.errorTel.status) && telRef.current.focus();
            }
        }
    }

    // ----------------------------------------------------------
    //------------------------ TAXI -----------------------------
    // ----------------------------------------------------------
    const [FormTX, setTaxi] = useState(TX);
    const [addressTaxi1, setAdsTaxi1] = useState(FormAdsTx1);
    const [addressTaxi2, setAdsTaxi2] = useState(FormAdsTx2);
    const [addressTaxi3, setAdsTaxi3] = useState(FormAdsTx3);
    const [TabTX, setTabTX] = useState(0);
    const [LockTab2, setLockTab2] = useState(false);
    const [LockTab3, setLockTab3] = useState(false);
    const [PreviewImageTX, setPreviewTX] = useState(false);
    const [FormcheckTaxi, setCheckedTaxi] = useState(CheckListTX);
    const [datatableTX, setDataTX] = useState(DataImgTX);
    //Master 
    const [aumpTX1, setAumpTX1] = useState([]);
    const [aumpTX2, setAumpTX2] = useState([]);
    const [aumpTX3, setAumpTX3] = useState([]);

    const [tumbTX1, setTumbTX1] = useState([]);
    const [tumbTX2, setTumbTX2] = useState([]);
    const [tumbTX3, setTumbTX3] = useState([]);

    const [zipcTX1, setZipcTX1] = useState([]);
    const [zipcTX2, setZipcTX2] = useState([]);
    const [zipcTX3, setZipcTX3] = useState([]);

    // TX

    async function Load_aumpTX(code, index) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_aump",
            id: code
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            (index === 1) && setAumpTX1(res.aump);
            (index === 2) && setAumpTX2(res.aump);
            (index === 3) && setAumpTX3(res.aump);
        }
    }

    async function Load_tumbTX(code, index) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_tumb",
            id: code
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            (index === 1) && setTumbTX1(res.tumb);
            (index === 2) && setTumbTX2(res.tumb);
            (index === 3) && setTumbTX3(res.tumb);
        }
    }

    async function Load_zipTX(code, index) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_zipc",
            id: code.pro_tumbol_code
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (index === 1) {
                setZipcTX1(res.zip);
                setAdsTaxi1({ ...addressTaxi1, tumb: code, zipcode: res.zip[0] });
            }

            if (index === 2) {
                setZipcTX2(res.zip);
                setAdsTaxi2({ ...addressTaxi2, tumb: code, zipcode: res.zip[0] });
            }

            if (index === 3) {
                setZipcTX3(res.zip);
                setAdsTaxi3({ ...addressTaxi3, tumb: code, zipcode: res.zip[0], lat: '', lng: '' });
            }
        }
    }

    const handleChangeTX = (event, newValue) => {
        setTabTX(newValue);
    };

    const handleCheckedTaxi = (event) => {
        const { target } = event;
        const { name } = target;

        if (name === 'checkedTaxiA') {
            setCheckedTaxi({ ...FormcheckTaxi, checkedTaxiA: event.target.checked });
            //-----------------------------------------------------------------------
            if (event.target.checked) {
                setLockTab2(true)
                setAdsTaxi2({
                    ...addressTaxi2,
                    no: addressTaxi1.no,
                    road: addressTaxi1.road,
                    soi: addressTaxi1.soi,
                    prov: addressTaxi1.prov,
                    aump: addressTaxi1.aump,
                    tumb: addressTaxi1.tumb,
                    zipcode: addressTaxi1.zipcode
                })
            } else {
                setLockTab2(false)
                setAdsTaxi2(FormAdsTx2)
                setAumpTX2([]);
                setTumbTX2([]);
                setZipcTX2([]);

            }
        } else if (name === 'checkedTaxiB') {
            (event.target.checked) ?
                setCheckedTaxi({ ...FormcheckTaxi, checkedTaxiB: event.target.checked, checkedTaxiC: !event.target.checked }) :
                setCheckedTaxi({ ...FormcheckTaxi, checkedTaxiB: false })
            //-----------------------------------------------------------------------
            if (event.target.checked) {
                setLockTab3(true)
                setAdsTaxi3({
                    ...addressTaxi3,
                    no: addressTaxi1.no,
                    road: addressTaxi1.road,
                    soi: addressTaxi1.soi,
                    prov: addressTaxi1.prov,
                    aump: addressTaxi1.aump,
                    tumb: addressTaxi1.tumb,
                    zipcode: addressTaxi1.zipcode,
                    lat: '',
                    lng: ''
                })
            } else {
                setLockTab3(false)
                setAdsTaxi3(FormAdsTx3)
                setAumpTX3([]);
                setTumbTX3([]);
                setZipcTX3([]);
            }
        } else {
            (event.target.checked) ?
                setCheckedTaxi({ ...FormcheckTaxi, checkedTaxiC: event.target.checked, checkedTaxiB: !event.target.checked }) :
                setCheckedTaxi({ ...FormcheckTaxi, checkedTaxiC: false })
            //-----------------------------------------------------------------------
            if (event.target.checked) {
                setLockTab3(true)
                setAdsTaxi3({
                    ...addressTaxi3,
                    no: addressTaxi2.no,
                    road: addressTaxi2.road,
                    soi: addressTaxi2.soi,
                    prov: addressTaxi2.prov,
                    aump: addressTaxi2.aump,
                    tumb: addressTaxi2.tumb,
                    zipcode: addressTaxi2.zipcode,
                    lat: '',
                    lng: ''
                })
            } else {
                setLockTab3(false)
                setAdsTaxi3(FormAdsTx3)
                setAumpTX3([]);
                setTumbTX3([]);
                setZipcTX3([]);
            }
        }
    }

    const handleChangeInputTaxi = (event) => {
        const { target } = event;
        const { name } = target;

        if (name === "ctz") {
            (event.target.value.match("^[0-9]*$")) && setTaxi({ ...FormTX, citizen: event.target.value })
        } else if (name === "ag") {
            const formattedValue = (Number(target.value.replace(/\D/g, '')) || '').toLocaleString();
            setTaxi({ ...FormTX, age: formattedValue });
        } else if (name === "wi") {
            const isNumber = numberFormat(target.value)
            if (isNumber !== undefined) {
                setTaxi({ ...FormTX, weight: isNumber })
            }
        } else if (name === "tl") {
            if (target.value.match("^[0-9]*$")) {
                if (target.value.length === 0) {
                    setTaxi({
                        ...FormTX,
                        tel: target.value,
                        errorTel: { message: "", status: false },
                    });
                } else {
                    const fix_number = target.value.substr(0, 2);
                    if (fix_number !== "06" && fix_number !== "08" && fix_number !== "09") {

                        setTaxi({
                            ...FormTX,
                            tel: target.value,
                            errorTel: {
                                message: "หมวดหมายเลขโทรศัพท์ ไม่ถูกต้อง",
                                status: true,
                            },

                        });
                    } else {
                        if (fix_number === "06" || fix_number === "08" || fix_number === "09") {
                            if (target.value.length == 10) {
                                setTaxi({
                                    ...FormTX,
                                    tel: target.value,
                                    errorTel: { message: "", status: false },
                                });
                            } else {
                                setTaxi({
                                    ...FormTX,
                                    tel: target.value,
                                    errorTel: { message: "หมายเลขโทรศัพท์จำนวน 10 หลัก", status: true },
                                });
                            }
                        }
                    }
                }
            }
        } else if (name === "relt") {
            if (target.value.match("^[0-9]*$")) {
                const fix_number = target.value.substr(0, 2);
                if (target.value.length === 0) {
                    setTaxi({ ...FormTX, rel_tel: target.value, errorTelRef: { message: '', status: false } })
                } else {
                    if (fix_number !== "06" && fix_number !== "08" && fix_number !== "09") {
                        setTaxi({
                            ...FormTX,
                            rel_tel: target.value,
                            errorTelRef: {
                                message: "หมวดหมายเลขโทรศัพท์ ไม่ถูกต้อง",
                                status: true,
                            },

                        });
                    } else {
                        if (fix_number === "06" || fix_number === "08" || fix_number === "09") {
                            if (target.value.length == 10) {
                                setTaxi({
                                    ...FormTX,
                                    rel_tel: target.value,
                                    errorTelRef: { message: "", status: false },
                                });
                            } else {
                                setTaxi({
                                    ...FormTX,
                                    rel_tel: target.value,
                                    errorTelRef: { message: "หมายเลขโทรศัพท์จำนวน 10 หลัก", status: true },
                                });
                            }
                        }
                    }
                }
            }
        } else if (name === "relfn") {
            setTaxi({ ...FormTX, rel_fullname: target.value });
        } else if (name === "lid") {
            setTaxi({ ...FormTX, LineID: target.value });
        } else if (name === "hi") {
            const formattedValue = (Number(target.value.replace(/\D/g, '')) || '').toLocaleString();
            setTaxi({ ...FormTX, height: formattedValue });
        } else if (name === "lcp_num") {
            // (event.target.value.match("^[0-9]*$")) && setTaxi({ ...FormTX, lcp_num: event.target.value })
            setTaxi({ ...FormTX, lcp_num: target.value })
        } else if (name === "lcp_public_num") {
            // (event.target.value.match("^[0-9]*$")) && setTaxi({ ...FormTX, lcp_public_num: event.target.value })
            setTaxi({ ...FormTX, lcp_public_num: target.value })
        } else if (name === "relu") {
            setTaxi({ ...FormTX, rel_user: target.value });
        } else if (name === "lcp") {
            setTaxi({ ...FormTX, lcp: target.value });
        } else if (name === "cooperative") {
            setTaxi({ ...FormTX, cooperative: target.value });
        } else if (name === "cradle") {
            setTaxi({ ...FormTX, cradle: target.value });
        } else if (name === "fn") {
            setTaxi({ ...FormTX, fname: target.value });
        } else if (name === "ln") {
            setTaxi({ ...FormTX, lname: target.value });
        } else if (name === "bankn") {
            setTaxi({ ...FormTX, bank_name: target.value });
        } else if (name === "bankc") {
            setTaxi({ ...FormTX, bank_code: target.value });
        }

    }

    const handleSmokingTX = (event) => {
        setTaxi({ ...FormTX, smoking: event.target.value });
    }

    const handleYear = (event, item) => {
        setTaxi({ ...FormTX, year: item })
    }

    const handleMonth = (event, item) => {
        setTaxi({ ...FormTX, month: item })
    }

    const handleDay = (event, item) => {
        setTaxi({ ...FormTX, day: item })
    }

    const handleSex = (event, item) => {
        setTaxi({ ...FormTX, sex: item })
    }

    const handleBankTX = (event, item) => {
        setTaxi({ ...FormTX, bank_list: item })
    }

    const handleProvTx1 = (event, item) => {
        if (item) {
            setAdsTaxi1({ ...addressTaxi1, prov: item, aump: null, tumb: null, zipcode: null });
            Load_aumpTX(item.pro_province_code, 1);
        } else {
            setAdsTaxi1({ ...addressTaxi1, prov: item, aump: null, tumb: null, zipcode: null });
            setAumpTX1([]);
            setTumbTX1([]);
            setZipcTX1([]);
        }
    }

    const handleAumpTx1 = (event, item) => {
        if (item) {
            setAdsTaxi1({ ...addressTaxi1, aump: item, tumb: null, zipcode: null });
            Load_tumbTX(item.pro_aumphur_code, 1);
        } else {
            setAdsTaxi1({ ...addressTaxi1, aump: item, tumb: null, zipcode: null });
            setTumbTX1([]);
            setZipcTX1([]);
        }
    }

    const handleTumbTx1 = (event, item) => {
        if (item) {
            Load_zipTX(item, 1);
        } else {
            setAdsTaxi1({ ...addressTaxi1, tumb: item, zipcode: null });
            setZipcTX1([]);
        }
    }

    const handleZipcodeTx1 = (event, item) => {
        setAdsTaxi1({ ...addressTaxi1, zipcode: item })
    }

    const handleProvTx2 = (event, item) => {
        if (item) {
            setAdsTaxi2({ ...addressTaxi2, prov: item, aump: null, tumb: null, zipcode: null });
            Load_aumpTX(item.pro_province_code, 2);
        } else {
            setAdsTaxi2({ ...addressTaxi2, prov: item, aump: null, tumb: null, zipcode: null });
            setAumpTX2([]);
            setTumbTX2([]);
            setZipcTX2([]);
        }
    }

    const handleAumpTx2 = (event, item) => {
        if (item) {
            setAdsTaxi2({ ...addressTaxi2, aump: item, tumb: null, zipcode: null });
            Load_tumbTX(item.pro_aumphur_code, 2);
        } else {
            setAdsTaxi2({ ...addressTaxi2, aump: item, tumb: null, zipcode: null });
            setTumbTX2([]);
            setZipcTX2([]);
        }
    }

    const handleTumbTx2 = (event, item) => {
        if (item) {
            Load_zipTX(item, 2);
        } else {
            setAdsTaxi2({ ...addressTaxi2, tumb: item, zipcode: null });
            setZipcTX2([]);
        }
    }

    const handleZipcodeTx2 = (event, item) => {
        setAdsTaxi2({ ...addressTaxi2, zipcode: item })
    }

    const handleProvTx3 = (event, item) => {
        if (item) {
            setAdsTaxi3({ ...addressTaxi3, prov: item, aump: null, tumb: null, zipcode: null, lat: '', lng: '' });
            Load_aumpTX(item.pro_province_code, 3);
        } else {
            setAdsTaxi3({ ...addressTaxi3, prov: item, aump: null, tumb: null, zipcode: null, lat: '', lng: '' });
            setAumpTX3([]);
            setTumbTX3([]);
            setZipcTX3([]);
        }
    }

    const handleAumpTx3 = (event, item) => {
        if (item) {
            setAdsTaxi3({ ...addressTaxi3, aump: item, tumb: null, zipcode: null, lat: '', lng: '' });
            Load_tumbTX(item.pro_aumphur_code, 3);
        } else {
            setAdsTaxi3({ ...addressTaxi3, aump: item, tumb: null, zipcode: null, lat: '', lng: '' });
            setTumbTX3([]);
            setZipcTX3([]);
        }
    }

    const handleTumbTx3 = (event, item) => {
        if (item) {
            Load_zipTX(item, 3);
        } else {
            setAdsTaxi3({ ...addressTaxi3, tumb: item, zipcode: null, lat: '', lng: '' });
            setZipcTX3([]);
        }
    }

    const handleZipcodeTx3 = (event, item) => {
        setAdsTaxi3({ ...addressTaxi3, zipcode: item })
    }

    const handleExpNum = (date) => {
        setTaxi({ ...FormTX, exp_num: date });
    };

    const handleExpPubNum = (date) => {
        setTaxi({ ...FormTX, exp_public: date })
    }

    const handleuploadFileTX = (event, index) => {
        let file = event.target.files[0];
        if (file) {

            if (file.type === 'application/pdf') {
                if (file.name.match(/.(pdf)$/i)) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.readyState === 2) {
                            let newArr = [...datatableTX];
                            newArr[index]['file'] = file.name;
                            newArr[index]['base64'] = reader.result;
                            newArr[index]['preview'] = reader.result;
                            newArr[index]['status'] = false;
                            setDataTX(newArr);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                let size = file.size / 1024
                if (size <= 1024) {
                    if (file) {

                        const reader = new FileReader();
                        reader.onload = () => {
                            if (reader.readyState === 2) {
                                let newArr = [...datatableTX];
                                newArr[index]['file'] = file.name;
                                newArr[index]['base64'] = reader.result;
                                newArr[index]['preview'] = reader.result;
                                newArr[index]['status'] = false;
                                setDataTX(newArr);
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        document.getElementById("InputFileTX").value = "";
                    }
                } else {
                    Swal.fire({
                        title: "แจ้งเตือน",
                        text: 'ไม่สามารถอัพโหลด เนื่องจากขนาดรูปภาพเกิน 1 MB',
                        icon: "warning",
                    })
                }
            }

        } else {
            document.getElementById("InputFileTX").value = "";
        }
    }

    const handlePreviewOpenTX = (index) => {
        setIndex(index);
        setPreviewTX(true);
    }


    const [viewer, setViewer] = useState({ url_pdf: null, title: null })
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [openPdfviewer, setOpenPDF] = useState(false);
    //-------------------------------------------------

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const NextPage = () => {
        let pageCount = pageNumber + 1
        if (pageCount <= numPages) {
            setPageNumber(pageCount)
        }

    }

    const PrevPage = () => {
        let pageCount = pageNumber - 1
        if (pageCount !== 0) {
            setPageNumber(pageCount)
        }
    }

    const handlePreviewPDFOpen = (index, row) => {
        setIndex(index);
        setViewer({ ...viewer, url_pdf: row.preview, title: row.Topic })
        setOpenPDF(true);
    }

    const handlePreviewPDFClose = () => {
        setOpenPDF(false);
        setPageNumber(1)
    }


    const handlePreviewCloseTX = () => {
        setPreviewTX(false)
    }

    const handleDeleteImageTX = (item, index) => {
        Swal.fire({
            title: "ลบ",
            text: (item.type === 'PDF' ? "ท่านต้องลบเอกสาร หรือไม่?" : "ท่านต้องลบรูปภาพ หรือไม่?"),
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                let newArr = [...datatableTX];
                newArr[index]['base64'] = '';
                newArr[index]['file'] = '';
                newArr[index]['status'] = true;

                document.getElementById("InputFileTX").value = "";
                setDataCG(newArr);
            }
        });
    }

    // ----------------------------------------------------------
    //------------------------ CG -------------------------------
    // ----------------------------------------------------------
    const [FormCG, setCG] = useState(CG);
    const [addressCG1, setAdsCG1] = useState(FormAdsCG1);
    const [addressCG2, setAdsCG2] = useState(FormAdsCG2);
    const [addressCG3, setAdsCG3] = useState(FormAdsCG3);
    const [TabCG, setTabCG] = useState(0);
    const [PreviewImageCG, setPreviewCG] = useState(false);
    const [FormcheckCG, setCheckedCG] = useState(CheckListCG);
    const [datatableCG, setDataCG] = useState(DataImgCG);
    //Master 
    const [aumpCG1, setAumpCG1] = useState([]);
    const [aumpCG2, setAumpCG2] = useState([]);
    const [aumpCG3, setAumpCG3] = useState([]);

    const [tumbCG1, setTumbCG1] = useState([]);
    const [tumbCG2, setTumbCG2] = useState([]);
    const [tumbCG3, setTumbCG3] = useState([]);

    const [zipcCG1, setZipcCG1] = useState([]);
    const [zipcCG2, setZipcCG2] = useState([]);
    const [zipcCG3, setZipcCG3] = useState([]);

    // CG

    async function Load_aumpCG(code, index) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_aump",
            id: code
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            (index === 1) && setAumpCG1(res.aump);
            (index === 2) && setAumpCG2(res.aump);
            (index === 3) && setAumpCG3(res.aump);
        }
    }

    async function Load_tumbCG(code, index) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_tumb",
            id: code
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            (index === 1) && setTumbCG1(res.tumb);
            (index === 2) && setTumbCG2(res.tumb);
            (index === 3) && setTumbCG3(res.tumb);
        }
    }

    async function Load_zipCG(code, index) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_zipc",
            id: code.pro_tumbol_code
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (index === 1) {
                setZipcCG1(res.zip);
                setAdsCG1({ ...addressCG1, tumb: code, zipcode: res.zip[0] });
            }

            if (index === 2) {
                setZipcCG2(res.zip);
                setAdsCG2({ ...addressCG2, tumb: code, zipcode: res.zip[0] });
            }

            if (index === 3) {
                setZipcCG3(res.zip);
                setAdsCG3({ ...addressCG3, tumb: code, zipcode: res.zip[0], lat: '', lng: '' });
            }
        }
    }

    const handleChangeCG = (event, newValue) => {
        setTabCG(newValue);
    };

    const handleCheckedCG = (event) => {
        const { target } = event;
        const { name } = target;


        if (name === 'checkedCGA') {
            setCheckedCG({ ...FormcheckCG, checkedCGA: event.target.checked });
            //-----------------------------------------------------------------------
            if (event.target.checked) {
                setLockTab2(true)
                setAdsCG2({
                    ...addressCG2,
                    no: addressCG1.no,
                    road: addressCG1.road,
                    soi: addressCG1.soi,
                    prov: addressCG1.prov,
                    aump: addressCG1.aump,
                    tumb: addressCG1.tumb,
                    zipcode: addressCG1.zipcode
                })
            } else {
                setLockTab2(false)
                setAdsCG2(FormAdsCG2)
                setAumpCG2([]);
                setTumbCG2([]);
                setZipcCG2([]);

            }
        } else if (name === 'checkedCGB') {
            (event.target.checked) ?
                setCheckedCG({ ...FormcheckCG, checkedCGB: event.target.checked, checkedCGC: !event.target.checked }) :
                setCheckedCG({ ...FormcheckCG, checkedCGB: false })
            //-----------------------------------------------------------------------
            if (event.target.checked) {
                setLockTab3(true)
                setAdsCG3({
                    ...addressCG3,
                    no: addressCG1.no,
                    road: addressCG1.road,
                    soi: addressCG1.soi,
                    prov: addressCG1.prov,
                    aump: addressCG1.aump,
                    tumb: addressCG1.tumb,
                    zipcode: addressCG1.zipcode,
                    lat: '',
                    lng: ''
                })
            } else {
                setLockTab3(false)
                setAdsCG3(FormAdsCG3)
                setAumpCG3([]);
                setTumbCG3([]);
                setZipcCG3([]);
            }
        } else {
            (event.target.checked) ?
                setCheckedCG({ ...FormcheckCG, checkedCGC: event.target.checked, checkedCGB: !event.target.checked }) :
                setCheckedCG({ ...FormcheckCG, checkedCGC: false })
            //-----------------------------------------------------------------------
            if (event.target.checked) {
                setLockTab3(true)
                setAdsCG3({
                    ...addressCG3,
                    no: addressCG2.no,
                    road: addressCG2.road,
                    soi: addressCG2.soi,
                    prov: addressCG2.prov,
                    aump: addressCG2.aump,
                    tumb: addressCG2.tumb,
                    zipcode: addressCG2.zipcode,
                    lat: '',
                    lng: ''
                })
            } else {
                setLockTab3(false)
                setAdsCG3(FormAdsCG3)
                setAumpCG3([]);
                setTumbCG3([]);
                setZipcCG3([]);
            }
        }
    }

    const handleChangeInputCG = (event) => {
        const { target } = event;
        const { name } = target;

        if (name === "ctz") {
            (event.target.value.match("^[0-9]*$")) && setCG({ ...FormCG, citizen: event.target.value })
        } else if (name === "ag") {
            const formattedValue = (Number(target.value.replace(/\D/g, '')) || '').toLocaleString();
            setCG({ ...FormCG, age: formattedValue });
        } else if (name === "hi") {
            const formattedValue = (Number(target.value.replace(/\D/g, '')) || '').toLocaleString();
            setCG({ ...FormCG, height: formattedValue });
        } else if (name === "wi") {
            const isNumber = numberFormat(target.value)
            if (isNumber !== undefined) {
                setCG({ ...FormCG, weight: isNumber })
            }
        } else if (name === "tl") {
            if (target.value.match("^[0-9]*$")) {
                if (target.value.length === 0) {
                    setCG({
                        ...FormCG,
                        tel: target.value,
                        errorTel: { message: "", status: false },
                    });
                } else {
                    const fix_number = target.value.substr(0, 2);
                    if (fix_number !== "06" && fix_number !== "08" && fix_number !== "09") {

                        setCG({
                            ...FormCG,
                            tel: target.value,
                            errorTel: {
                                message: "หมวดหมายเลขโทรศัพท์ ไม่ถูกต้อง",
                                status: true,
                            },

                        });
                    } else {
                        if (fix_number === "06" || fix_number === "08" || fix_number === "09") {
                            if (target.value.length == 10) {
                                setCG({
                                    ...FormCG,
                                    tel: target.value,
                                    errorTel: { message: "", status: false },
                                });
                            } else {
                                setCG({
                                    ...FormCG,
                                    tel: target.value,
                                    errorTel: { message: "หมายเลขโทรศัพท์จำนวน 10 หลัก", status: true },
                                });
                            }
                        }
                    }
                }
            }
        } else if (name === "relt") {
            if (target.value.match("^[0-9]*$")) {
                const fix_number = target.value.substr(0, 2);
                if (target.value.length === 0) {
                    setCG({ ...FormCG, rel_tel: target.value, errorTelRef: { message: '', status: false } })
                } else {
                    if (fix_number !== "06" && fix_number !== "08" && fix_number !== "09") {
                        setCG({
                            ...FormCG,
                            rel_tel: target.value,
                            errorTelRef: {
                                message: "หมวดหมายเลขโทรศัพท์ ไม่ถูกต้อง",
                                status: true,
                            },

                        });
                    } else {
                        if (fix_number === "06" || fix_number === "08" || fix_number === "09") {
                            if (target.value.length == 10) {
                                setCG({
                                    ...FormCG,
                                    rel_tel: target.value,
                                    errorTelRef: { message: "", status: false },
                                });
                            } else {
                                setCG({
                                    ...FormCG,
                                    rel_tel: target.value,
                                    errorTelRef: { message: "หมายเลขโทรศัพท์จำนวน 10 หลัก", status: true },
                                });
                            }
                        }
                    }
                }
            }
        } else if (name === "lid") {
            setCG({ ...FormCG, LineID: target.value });
        } else if (name === "fn") {
            setCG({ ...FormCG, fname: target.value });
        } else if (name === "ln") {
            setCG({ ...FormCG, lname: target.value });
        } else if (name === "exp_year") {
            setCG({ ...FormCG, exp_year: target.value });
        } else if (name === "exp_insite_year") {
            setCG({ ...FormCG, exp_insite_year: target.value });
        } else if (name === "hospital") {
            setCG({ ...FormCG, hospital: target.value });
        } else if (name === "Certificate") {
            setCG({ ...FormCG, Certificate: target.value });
        } else if (name === "bankn") {
            setCG({ ...FormCG, bank_name: target.value });
        } else if (name === "bankc") {
            setCG({ ...FormCG, bank_code: target.value });
        } else if (name === "relu") {
            setCG({ ...FormCG, rel_user: target.value });
        } else if (name === "relfn") {
            setCG({ ...FormCG, rel_fullname: target.value });
        }

    }

    const handleSmokingCG = (event) => {
        setCG({ ...FormCG, smoking: event.target.value });
    }

    const handleBankCG = (event, item) => {
        setCG({ ...FormCG, bank_list: item })
    }

    const handleEducation = (event, item) => {
        setCG({ ...FormCG, Education: item })
    }

    const handleCGYear = (event, item) => {
        setCG({ ...FormCG, year: item })
    }

    const handleCGMonth = (event, item) => {
        setCG({ ...FormCG, month: item })
    }

    const handleCGDay = (event, item) => {
        setCG({ ...FormCG, day: item })
    }

    const handleCGSex = (event, item) => {
        setCG({ ...FormCG, sex: item })
    }

    const handleProvCG1 = (event, item) => {
        if (item) {
            setAdsCG1({ ...addressCG1, prov: item, aump: null, tumb: null, zipcode: null });
            Load_aumpCG(item.pro_province_code, 1);
        } else {
            setAdsCG1({ ...addressCG1, prov: item, aump: null, tumb: null, zipcode: null });
            setAumpCG1([]);
            setTumbCG1([]);
            setZipcCG1([]);
        }
    }

    const handleAumpCG1 = (event, item) => {
        if (item) {
            setAdsCG1({ ...addressCG1, aump: item, tumb: null, zipcode: null });
            Load_tumbCG(item.pro_aumphur_code, 1);
        } else {
            setAdsCG1({ ...addressCG1, aump: item, tumb: null, zipcode: null });
            setTumbCG1([]);
            setZipcCG1([]);
        }
    }

    const handleTumbCG1 = (event, item) => {
        setAdsCG1({ ...addressCG1, tumb: item })
        if (item) {
            Load_zipCG(item, 1);
        } else {
            setAdsCG1({ ...addressCG1, tumb: item, zipcode: null });
            setZipcCG1([]);
        }
    }

    const handleZipcodeCG1 = (event, item) => {
        setAdsCG1({ ...addressCG1, zipcode: item })
    }

    const handleProvCG2 = (event, item) => {
        if (item) {
            setAdsCG2({ ...addressCG2, prov: item, aump: null, tumb: null, zipcode: null });
            Load_aumpCG(item.pro_province_code, 2);
        } else {
            setAdsCG2({ ...addressCG2, prov: item, aump: null, tumb: null, zipcode: null });
            setAumpCG2([]);
            setTumbCG2([]);
            setZipcCG2([]);
        }
    }

    const handleAumpCG2 = (event, item) => {
        if (item) {
            setAdsCG2({ ...addressCG2, aump: item, tumb: null, zipcode: null });
            Load_tumbCG(item.pro_aumphur_code, 2);
        } else {
            setAdsCG2({ ...addressCG2, aump: item, tumb: null, zipcode: null });
            setTumbCG2([]);
            setZipcCG2([]);
        }
    }

    const handleTumbCG2 = (event, item) => {
        setAdsCG2({ ...addressCG2, tumb: item })
        if (item) {
            Load_zipCG(item, 2);
        } else {
            setAdsCG2({ ...addressCG2, tumb: item, zipcode: null });
            setZipcCG2([]);
        }
    }

    const handleZipcodeCG2 = (event, item) => {
        setAdsCG2({ ...addressCG2, zipcode: item })
    }

    const handleProvCG3 = (event, item) => {
        if (item) {
            setAdsCG3({ ...addressCG3, prov: item, aump: null, tumb: null, zipcode: null, lat: '', lng: '' });
            Load_aumpCG(item.pro_province_code, 3);
        } else {
            setAdsCG3({ ...addressCG3, prov: item, aump: null, tumb: null, zipcode: null, lat: '', lng: '' });
            setAumpCG3([]);
            setTumbCG3([]);
            setZipcCG3([]);
        }
    }

    const handleAumpCG3 = (event, item) => {
        if (item) {
            setAdsCG3({ ...addressCG3, aump: item, tumb: null, zipcode: null, lat: '', lng: '' });
            Load_tumbCG(item.pro_aumphur_code, 3);
        } else {
            setAdsCG3({ ...addressCG3, aump: item, tumb: null, zipcode: null, lat: '', lng: '' });
            setTumbCG3([]);
            setZipcCG3([]);
        }
    }

    const handleTumbCG3 = (event, item) => {
        setAdsCG3({ ...addressCG3, tumb: item })
        if (item) {
            Load_zipCG(item, 3);
        } else {
            setAdsCG3({ ...addressCG3, tumb: item, zipcode: null, lat: '', lng: '' });
            setZipcCG3([]);
        }
    }

    const handleZipcodeCG3 = (event, item) => {
        setAdsCG3({ ...addressCG3, zipcode: item })
    }

    const handleuploadFileCG = (event, index) => {
        let file = event.target.files[0];
        if (file) {

            if (file.type === 'application/pdf') {
                if (file.name.match(/.(pdf)$/i)) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.readyState === 2) {
                            let newArr = [...datatableCG];
                            newArr[index]['file'] = file.name;
                            newArr[index]['base64'] = reader.result;
                            newArr[index]['preview'] = reader.result;
                            newArr[index]['status'] = false;
                            setDataTX(newArr);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                let size = file.size / 1024
                if (size <= 1024) {
                    if (file) {

                        const reader = new FileReader();
                        reader.onload = () => {
                            if (reader.readyState === 2) {
                                let newArr = [...datatableCG];
                                newArr[index]['file'] = file.name;
                                newArr[index]['base64'] = reader.result;
                                newArr[index]['preview'] = reader.result;
                                newArr[index]['status'] = false;
                                setDataTX(newArr);
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        document.getElementById("InputFileCG").value = "";
                    }
                } else {
                    Swal.fire({
                        title: "แจ้งเตือน",
                        text: 'ไม่สามารถอัพโหลด เนื่องจากขนาดรูปภาพเกิน 1 MB',
                        icon: "warning",
                    })
                }
            }

        } else {
            document.getElementById("InputFileCG").value = "";
        }
    }

    const handlePreviewOpenCG = (index) => {
        setIndex(index);
        setPreviewCG(true);
    }

    const handlePreviewCloseCG = () => {
        setPreviewCG(false)
    }

    const handleDeleteImageCG = (item, index) => {
        Swal.fire({
            title: "ลบ",
            text: (item.type === 'PDF' ? "ท่านต้องลบเอกสาร หรือไม่?" : "ท่านต้องลบรูปภาพ หรือไม่?"),
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                let newArr = [...datatableCG];
                newArr[index]['preview'] = '';
                newArr[index]['base64'] = '';
                newArr[index]['file'] = '';
                newArr[index]['status'] = true;

                document.getElementById("InputFileCG").value = "";
                setDataCG(newArr);
            }
        });
    }

    const handleGetLocationTX = () => {
        let myAddress = addressTaxi3.no + ' ' + addressTaxi3.road + ' ' + addressTaxi3.soi + ' ' + addressTaxi3.prov.pro_province_desc + ' ' +
            addressTaxi3.aump.pro_aumphur_desc + ' ' + addressTaxi3.tumb.pro_tumbol_desc + ' ' + addressTaxi3.zipcode.pro_code
        let ReversCode = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyANcHgMKpxM2-2wipNHgT7vumZrM7f1Nlo&language=th&address=' + myAddress
        fetch(ReversCode).then(response => response.json()).then(location => {
            let position = location.results[0].geometry.location;
            setAdsTaxi3({ ...addressTaxi3, lat: position.lat, lng: position.lng })
        })
    }

    const handleGetLocationCG = () => {
        let myAddress = addressCG3.no + ' ' + addressCG3.road + ' ' + addressCG3.soi + ' ' + addressCG3.prov.pro_province_desc + ' ' +
            addressCG3.aump.pro_aumphur_desc + ' ' + addressCG3.tumb.pro_tumbol_desc + ' ' + addressCG3.zipcode.pro_code
        let ReversCode = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyANcHgMKpxM2-2wipNHgT7vumZrM7f1Nlo&language=th&address=' + myAddress
        fetch(ReversCode).then(response => response.json()).then(location => {
            let position = location.results[0].geometry.location;
            setAdsCG3({ ...addressCG3, lat: position.lat, lng: position.lng })
        })
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>
                            <FormControl>
                                <FormLabel className={classes.font_normal}  >เลือกประเภทบริการ</FormLabel>
                                <RadioGroup row aria-label="position" value={myService} onChange={handleService} defaultValue="top" >
                                    {service.map((type) =>
                                        <FormControlLabel key={type.gmm_svtype_id} value={type.gmm_svtype_id} disabled={TopicLock}
                                            classes={{ label: classes.font_normal }}
                                            control={<Radio color="primary" />}
                                            label={type.gmm_svtype_name} >
                                        </FormControlLabel>
                                    )}
                                </RadioGroup>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {
                myService === 'TX' && (
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
                        <form onSubmit={Submit}>
                            <Box mt={2}>
                                <Card variant="outlined">
                                    <CardContent style={{ paddingBottom: '16px' }}>
                                        <FormControl component="fieldset">
                                            <FormLabel className={classes.font_normal} ><HeadersI classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>

                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="fn"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ชื่อ"
                                                        autoComplete="off"
                                                        value={FormTX.fname}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="ln"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="นามสกุล"
                                                        autoComplete="off"
                                                        value={FormTX.lname}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="ctz"
                                                        variant="outlined"
                                                        margin="dense"
                                                        autoComplete="off"
                                                        inputRef={citizenRef}
                                                        label="รหัสบัตรประชาชน"
                                                        value={FormTX.citizen}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ minLength: 13, maxLength: 13 }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={days}
                                                        getOptionLabel={(value) => value.gmm_num_id}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_num_id === value.gmm_num_id
                                                        }
                                                        value={FormTX.day}
                                                        onChange={handleDay}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="วันเกิด"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={month}
                                                        getOptionLabel={(value) => value.gmm_month_name}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_month_id === value.gmm_month_id
                                                        }
                                                        value={FormTX.month}
                                                        onChange={handleMonth}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="เดือน"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={years}
                                                        getOptionLabel={(value) => value}
                                                        getOptionSelected={(option, value) =>
                                                            option === value
                                                        }
                                                        value={FormTX.year}
                                                        onChange={handleYear}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="ปี"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={sex}
                                                        getOptionLabel={(value) => value.gmm_sex_name}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_sex_id === value.gmm_sex_id
                                                        }
                                                        value={FormTX.sex}
                                                        onChange={handleSex}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="เพศ"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}

                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="ag"
                                                        label="อายุ"
                                                        value={FormTX.age}
                                                        onChange={handleChangeInputTaxi}
                                                        margin="dense"
                                                        variant="outlined"
                                                        autoComplete="off"
                                                        inputProps={{ maxLength: 3 }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Typography className={classes.font_normal}>ปี </Typography>
                                                                </InputAdornment>
                                                            ),
                                                            className: classes.font_normal,
                                                        }}
                                                        InputLabelProps={{ className: classes.font_normal }}

                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="wi"
                                                        label="น้ำหนัก"
                                                        value={FormTX.weight}
                                                        onChange={handleChangeInputTaxi}
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
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="hi"
                                                        label="ส่วนสูง"
                                                        autoComplete="off"
                                                        value={FormTX.height}
                                                        onChange={handleChangeInputTaxi}
                                                        margin="dense"
                                                        variant="outlined"
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
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        value={FormTX.tel}
                                                        onChange={handleChangeInputTaxi}
                                                        name="tl"
                                                        label="เบอร์โทรศัพท์"
                                                        margin="dense"
                                                        variant="outlined"
                                                        autoComplete="off"
                                                        inputRef={telRef}
                                                        disabled={TopicLock}
                                                        error={FormTX.errorTel.status}
                                                        helperText={FormTX.errorTel.message}
                                                        inputProps={{ maxLength: 10, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="lid"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="Line ID"
                                                        autoComplete="off"
                                                        value={FormTX.LineID}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
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
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={12} md={12}>
                                                    <Box className={classes.root}>
                                                        <AppBar position="static" color="primary">
                                                            <AntTabs
                                                                value={TabTX}
                                                                onChange={handleChangeTX}
                                                                variant="scrollable"
                                                                scrollButtons="auto"
                                                                aria-label="scrollable auto tabs example"
                                                            >
                                                                <Tab className={classes.font_normal} label="ที่อยู่ตามทะเบียนบ้าน" {...a11yProps(0)} />
                                                                <Tab className={classes.font_normal} label="ที่อยู่ปัจจุบัน" {...a11yProps(1)} />
                                                                <Tab className={classes.font_normal} label="ที่อยู่จุดออกรถ" {...a11yProps(2)} />
                                                            </AntTabs>
                                                        </AppBar>
                                                        <TabPanel value={TabTX} index={0} classes={classes}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="เลขที่"
                                                                        autoComplete="off"
                                                                        value={addressTaxi1.no}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi1({ ...addressTaxi1, no: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ถนน"
                                                                        autoComplete="off"
                                                                        value={addressTaxi1.road}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi1({ ...addressTaxi1, road: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ตรอก/ซอย"
                                                                        autoComplete="off"
                                                                        value={addressTaxi1.soi}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi1({ ...addressTaxi1, soi: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={prov}
                                                                        getOptionLabel={(value) => value.pro_province_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_province_code === value.pro_province_code
                                                                        }
                                                                        value={addressTaxi1.prov}
                                                                        onChange={handleProvTx1}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="จังหวัด"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={aumpTX1}
                                                                        getOptionLabel={(value) => value.pro_aumphur_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_aumphur_code === value.pro_aumphur_code
                                                                        }
                                                                        value={addressTaxi1.aump}
                                                                        onChange={handleAumpTx1}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="เขต/อำเภอ"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={tumbTX1}
                                                                        getOptionLabel={(value) => value.pro_tumbol_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_tumbol_code === value.pro_tumbol_code
                                                                        }
                                                                        value={addressTaxi1.tumb}
                                                                        onChange={handleTumbTx1}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="แขวง/ตำบล"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={zipcTX1}
                                                                        getOptionLabel={(value) => value.pro_code}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_code === value.pro_code
                                                                        }
                                                                        value={addressTaxi1.zipcode}
                                                                        onChange={handleZipcodeTx1}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="รหัสไปรษณีย์"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>

                                                            </Grid>
                                                        </TabPanel>
                                                        <TabPanel value={TabTX} index={1} classes={classes}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <FormGroup row>
                                                                        <FormControlLabel
                                                                            control={<Checkbox checked={FormcheckTaxi.checkedTaxiA} onChange={handleCheckedTaxi} name="checkedTaxiA" />}
                                                                            label="ที่อยู่ตามทะเบียนบ้าน"
                                                                            classes={{ label: classes.font_normal }}
                                                                        />
                                                                    </FormGroup>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="เลขที่"
                                                                        autoComplete="off"
                                                                        value={addressTaxi2.no}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi2({ ...addressTaxi2, no: event.target.value });
                                                                        }}
                                                                        disabled={LockTab2}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ถนน"
                                                                        autoComplete="off"
                                                                        value={addressTaxi2.road}
                                                                        disabled={LockTab2}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi2({ ...addressTaxi2, road: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ตรอก/ซอย"
                                                                        autoComplete="off"
                                                                        value={addressTaxi2.soi}
                                                                        disabled={LockTab2}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi2({ ...addressTaxi2, soi: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={prov}
                                                                        getOptionLabel={(value) => value.pro_province_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_province_code === value.pro_province_code
                                                                        }
                                                                        value={addressTaxi2.prov}
                                                                        onChange={handleProvTx2}
                                                                        disabled={LockTab2}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="จังหวัด"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={aumpTX2}
                                                                        getOptionLabel={(value) => value.pro_aumphur_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_aumphur_code === value.pro_aumphur_code
                                                                        }
                                                                        value={addressTaxi2.aump}
                                                                        onChange={handleAumpTx2}
                                                                        disabled={LockTab2}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="เขต/อำเภอ"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={tumbTX2}
                                                                        getOptionLabel={(value) => value.pro_tumbol_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_tumbol_code === value.pro_tumbol_code
                                                                        }
                                                                        value={addressTaxi2.tumb}
                                                                        onChange={handleTumbTx2}
                                                                        disabled={LockTab2}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="แขวง/ตำบล"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={zipcTX2}
                                                                        getOptionLabel={(value) => value.pro_code}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_code === value.pro_code
                                                                        }
                                                                        value={addressTaxi2.zipcode}
                                                                        onChange={handleZipcodeTx2}
                                                                        disabled={LockTab2}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="รหัสไปรษณีย์"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </TabPanel>
                                                        <TabPanel value={TabTX} index={2} classes={classes}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={8}>
                                                                    <FormGroup row>
                                                                        <FormControlLabel
                                                                            control={<Checkbox checked={FormcheckTaxi.checkedTaxiB} onChange={handleCheckedTaxi} name="checkedTaxiB" />}
                                                                            label="ที่อยู่ตามทะเบียนบ้าน"
                                                                            classes={{ label: classes.font_normal }}
                                                                        />
                                                                        <FormControlLabel
                                                                            control={<Checkbox checked={FormcheckTaxi.checkedTaxiC} onChange={handleCheckedTaxi} name="checkedTaxiC" />}
                                                                            label="ที่อยู่ปัจจุบัน"
                                                                            classes={{ label: classes.font_normal }}
                                                                        />
                                                                    </FormGroup>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4}>
                                                                    <Box className={classes.displayflexEnd}>
                                                                        <Button className={classes.font_normal}
                                                                            disabled={addressTaxi3.zipcode === null || addressTaxi3.no === ''}
                                                                            onClick={handleGetLocationTX}
                                                                            startIcon={<MyLocation />}
                                                                            color="primary" variant="contained" size="small">
                                                                            ค้นหาพิกัด
                                                                        </Button>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="เลขที่"
                                                                        autoComplete="off"
                                                                        value={addressTaxi3.no}
                                                                        disabled={LockTab3}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi3({ ...addressTaxi3, no: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ถนน"
                                                                        autoComplete="off"
                                                                        value={addressTaxi3.road}
                                                                        disabled={LockTab3}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi3({ ...addressTaxi3, road: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ตรอก/ซอย"
                                                                        autoComplete="off"
                                                                        value={addressTaxi3.soi}
                                                                        disabled={LockTab3}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi3({ ...addressTaxi3, soi: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={prov}
                                                                        getOptionLabel={(value) => value.pro_province_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_province_code === value.pro_province_code
                                                                        }
                                                                        value={addressTaxi3.prov}
                                                                        onChange={handleProvTx3}
                                                                        disabled={LockTab3}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="จังหวัด"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={aumpTX3}
                                                                        getOptionLabel={(value) => value.pro_aumphur_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_aumphur_code === value.pro_aumphur_code
                                                                        }
                                                                        value={addressTaxi3.aump}
                                                                        onChange={handleAumpTx3}
                                                                        disabled={LockTab3}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="เขต/อำเภอ"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={tumbTX3}
                                                                        getOptionLabel={(value) => value.pro_tumbol_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_tumbol_code === value.pro_tumbol_code
                                                                        }
                                                                        value={addressTaxi3.tumb}
                                                                        onChange={handleTumbTx3}
                                                                        disabled={LockTab3}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="แขวง/ตำบล"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={zipcTX3}
                                                                        getOptionLabel={(value) => value.pro_code}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_code === value.pro_code
                                                                        }
                                                                        value={addressTaxi3.zipcode}
                                                                        onChange={handleZipcodeTx3}
                                                                        disabled={LockTab3}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="รหัสไปรษณีย์"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="Latitude"
                                                                        autoComplete="off"
                                                                        value={addressTaxi3.lat}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi3({ ...addressTaxi3, lat: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="Longitude"
                                                                        autoComplete="off"
                                                                        value={addressTaxi3.lng}
                                                                        onChange={(event) => {
                                                                            setAdsTaxi3({ ...addressTaxi3, lng: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </TabPanel>
                                                    </Box>
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
                                            <FormLabel className={classes.font_normal} ><HeadersIII classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <RadioGroup row aria-label="position" value={FormTX.smoking} onChange={handleSmokingTX} defaultValue="top">
                                                        {smoking.map((smoking) =>
                                                            <FormControlLabel key={smoking.gmm_smoking_id} value={smoking.gmm_smoking_id}
                                                                classes={{ label: classes.font_normal }}
                                                                control={<Radio color="primary" />}
                                                                label={smoking.gmm_smoking_name} >
                                                            </FormControlLabel>
                                                        )}
                                                    </RadioGroup>
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
                                            <FormLabel className={classes.font_normal} ><HeadersII classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="cradle"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="สังกัดอู่"
                                                        autoComplete="off"
                                                        value={FormTX.cradle}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="cooperative"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="สหกรณ์"
                                                        autoComplete="off"
                                                        value={FormTX.cooperative}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="lcp"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ทะเบียน"
                                                        autoComplete="off"
                                                        value={FormTX.lcp}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
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
                                            <FormLabel className={classes.font_normal} ><HeadersIV classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="lcp_num"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="เลขที่ใบอนุญาตใบขับขี่"
                                                        autoComplete="off"
                                                        value={FormTX.lcp_num}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ minLength: 8, maxLength: 20 }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <KeyboardDatePicker
                                                        label="วันหมดอายุ"
                                                        placeholder="วัน/เดือน/ปี"
                                                        format="dd/MM/yyyy"
                                                        value={FormTX.exp_num}
                                                        onChange={handleExpNum}
                                                        margin="dense"
                                                        KeyboardButtonProps={{
                                                            "aria-label": "change date",
                                                        }}
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
                                                    <TextField
                                                        name="lcp_public_num"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="เลขที่ใบอนุญาตใบขับขี่สาธารณะ"
                                                        autoComplete="off"
                                                        value={FormTX.lcp_public_num}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ minLength: 8, maxLength: 20 }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <KeyboardDatePicker
                                                        label="วันหมดอายุ"
                                                        placeholder="วัน/เดือน/ปี"
                                                        format="dd/MM/yyyy"
                                                        value={FormTX.exp_public}
                                                        onChange={handleExpPubNum}
                                                        margin="dense"
                                                        KeyboardButtonProps={{
                                                            "aria-label": "change date",
                                                        }}
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
                                            </Grid>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Box mt={2}>
                                <Card variant="outlined">
                                    <CardContent style={{ paddingBottom: '16px' }}>
                                        <FormControl component="fieldset">
                                            <FormLabel className={classes.font_normal} ><HeadersV classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={banks}
                                                        getOptionLabel={(value) => value.gmm_bank_name}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_bank_code === value.gmm_bank_code
                                                        }
                                                        value={FormTX.bank_list}
                                                        onChange={handleBankTX}
                                                        renderOption={(option) => {
                                                            const picture =
                                                                "/image/icon_bank/" + option.gmm_bank_code + ".png";
                                                            return (
                                                                <>
                                                                    <img
                                                                        src={picture}
                                                                        className={classes.selectIcon}
                                                                    ></img>
                                                                    {option.gmm_bank_name}
                                                                </>
                                                            );
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="ธนาคาร"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Hidden only={['sm']}>
                                                    <Grid item xs={4} />
                                                </Hidden>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="bankn"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ชื่อบัญชี"
                                                        autoComplete="off"
                                                        value={FormTX.bank_name}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="bankc"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="เลขที่บัญชี"
                                                        autoComplete="off"
                                                        value={FormTX.bank_code}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
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
                                            <FormLabel className={classes.font_normal} ><HeadersVI classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="relfn"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ชื่อ - นามสกุล"
                                                        autoComplete="off"
                                                        value={FormTX.rel_fullname}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="relt"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="เบอร์โทรติดต่อ"
                                                        autoComplete="off"
                                                        value={FormTX.rel_tel}
                                                        onChange={handleChangeInputTaxi}
                                                        inputRef={rel_telRef}
                                                        error={FormTX.errorTelRef.status}
                                                        helperText={FormTX.errorTelRef.message}
                                                        inputProps={{ maxLength: 10, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />

                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <TextField
                                                        name="relu"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ความเกี่ยวข้อง"
                                                        autoComplete="off"
                                                        value={FormTX.rel_user}
                                                        onChange={handleChangeInputTaxi}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Box mt={2} mb={4}>
                                <Card variant="outlined">
                                    <CardContent style={{ paddingBottom: '16px' }}>
                                        <FormControl component="fieldset">
                                            <FormLabel className={classes.font_normal} ><HeadersXV classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} >
                                                    <TableContainer component={Paper}>
                                                        <Table aria-label="custom pagination table">
                                                            <TableBody>
                                                                {datatableTX.map((row, index) => (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell width='70%' align="left">
                                                                            {index + 1}. {row.Topic}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell width='20%' align="right">
                                                                            <Button
                                                                                component="label"
                                                                                variant="contained"
                                                                                color="primary"
                                                                                className={classes.font_normal}
                                                                                style={{
                                                                                    textTransform: 'none',
                                                                                    whiteSpace: 'pre'
                                                                                }}
                                                                                required
                                                                                fullWidth
                                                                            >

                                                                                {row.type === 'PDF' ? 'Upload PDF' : 'Upload Image'}
                                                                                <input
                                                                                    id="InputFileTX"
                                                                                    onChange={(e) => { handleuploadFileTX(e, index) }}
                                                                                    type="file"
                                                                                    accept={row.type === 'PDF' ? "application/pdf" : "image/x-png,image/gif,image/jpeg"}
                                                                                    hidden
                                                                                />
                                                                            </Button>
                                                                        </StyledTableCell>
                                                                        {row.type === 'PDF' ?
                                                                            <StyledTableCell width='10%' align="center">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    color="primary"
                                                                                    onClick={() => { handlePreviewPDFOpen(index, row) }}
                                                                                    className={classes.font_normal}
                                                                                    style={{
                                                                                        textTransform: 'none',
                                                                                    }}
                                                                                    disabled={row.status}
                                                                                >
                                                                                    Preview
                                                                                </Button>
                                                                            </StyledTableCell>
                                                                            :

                                                                            <StyledTableCell width='10%' align="center">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    color="primary"
                                                                                    onClick={() => { handlePreviewOpenTX(index) }}
                                                                                    className={classes.font_normal}
                                                                                    style={{
                                                                                        textTransform: 'none',
                                                                                    }}
                                                                                    disabled={row.status}
                                                                                >
                                                                                    Preview
                                                                                </Button>
                                                                            </StyledTableCell>
                                                                        }
                                                                        <StyledTableCell width='5%' align="center" style={{ paddingLeft: '0px' }}>
                                                                            <IconButton title="ลบข้อมูล" color='secondary' onClick={() => { handleDeleteImageTX(row, index) }} disabled={row.status}>
                                                                                <Close fontSize="small" />
                                                                            </IconButton>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>

                                                                ))}
                                                            </TableBody>

                                                        </Table>
                                                    </TableContainer>

                                                </Grid>

                                            </Grid>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Grid item xs={12} >
                                <ButtonSubmit classes={classes} status={promise} />
                            </Grid>
                        </form>
                    </MuiPickersUtilsProvider>

                )
            }

            {
                myService === 'CG' && (
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>

                        <form onSubmit={Submit}>
                            <Box mt={2}>
                                <Card variant="outlined">
                                    <CardContent style={{ paddingBottom: '16px' }}>
                                        <FormControl component="fieldset">
                                            <FormLabel className={classes.font_normal} ><HeadersI classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="fn"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ชื่อ"
                                                        autoComplete="off"
                                                        value={FormCG.fname}
                                                        onChange={handleChangeInputCG}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="ln"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="นามสกุล"
                                                        autoComplete="off"
                                                        value={FormCG.lname}
                                                        onChange={handleChangeInputCG}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="ctz"
                                                        variant="outlined"
                                                        margin="dense"
                                                        autoComplete="off"
                                                        inputRef={citizenRef}
                                                        label="รหัสบัตรประชาชน"
                                                        value={FormCG.citizen}
                                                        onChange={handleChangeInputCG}
                                                        inputProps={{ minLength: 13, maxLength: 13 }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={days}
                                                        getOptionLabel={(value) => value.gmm_num_id}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_num_id === value.gmm_num_id
                                                        }
                                                        value={FormCG.day}
                                                        onChange={handleCGDay}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="วันเกิด"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={month}
                                                        getOptionLabel={(value) => value.gmm_month_name}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_month_id === value.gmm_month_id
                                                        }
                                                        value={FormCG.month}
                                                        onChange={handleCGMonth}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="เดือน"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={years}
                                                        getOptionLabel={(value) => value}
                                                        getOptionSelected={(option, value) =>
                                                            option === value
                                                        }
                                                        value={FormCG.year}
                                                        onChange={handleCGYear}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="ปี"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={sex}
                                                        getOptionLabel={(value) => value.gmm_sex_name}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_sex_id === value.gmm_sex_id
                                                        }
                                                        value={FormCG.sex}
                                                        onChange={handleCGSex}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="เพศ"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}

                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="ag"
                                                        label="อายุ"
                                                        value={FormCG.age}
                                                        onChange={handleChangeInputCG}
                                                        margin="dense"
                                                        variant="outlined"
                                                        autoComplete="off"
                                                        inputProps={{ maxLength: 3 }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Typography className={classes.font_normal}>ปี </Typography>
                                                                </InputAdornment>
                                                            ),
                                                            className: classes.font_normal,
                                                        }}
                                                        InputLabelProps={{ className: classes.font_normal }}

                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="wi"
                                                        label="น้ำหนัก"
                                                        value={FormCG.weight}
                                                        onChange={handleChangeInputCG}
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
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="hi"
                                                        label="ส่วนสูง"
                                                        value={FormCG.height}
                                                        onChange={handleChangeInputCG}
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
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        value={FormCG.tel}
                                                        onChange={handleChangeInputCG}
                                                        name="tl"
                                                        label="เบอร์โทรศัพท์"
                                                        margin="dense"
                                                        variant="outlined"
                                                        autoComplete="off"
                                                        inputRef={telRef}
                                                        disabled={TopicLock}
                                                        error={FormCG.errorTel.status}
                                                        helperText={FormCG.errorTel.message}
                                                        inputProps={{ maxLength: 10, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="lid"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="Line ID"
                                                        autoComplete="off"
                                                        value={FormCG.LineID}
                                                        onChange={handleChangeInputCG}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
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
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={12} md={12}>
                                                    <Box className={classes.root}>
                                                        <AppBar position="static" color="primary">
                                                            <AntTabs
                                                                value={TabCG}
                                                                onChange={handleChangeCG}
                                                                variant="scrollable"
                                                                scrollButtons="auto"
                                                                aria-label="scrollable auto tabs example"
                                                            >
                                                                <Tab className={classes.font_normal} label="ที่อยู่ตามทะเบียนบ้าน" {...a11yProps(0)} />
                                                                <Tab className={classes.font_normal} label="ที่อยู่ปัจจุบัน" {...a11yProps(1)} />
                                                                <Tab className={classes.font_normal} label="ที่อยู่จุดออกไปทำงาน" {...a11yProps(2)} />
                                                            </AntTabs>
                                                        </AppBar>
                                                        <TabPanel value={TabCG} index={0} classes={classes}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="เลขที่"
                                                                        autoComplete="off"
                                                                        value={addressCG1.no}
                                                                        onChange={(event) => {
                                                                            setAdsCG1({ ...addressCG1, no: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ถนน"
                                                                        autoComplete="off"
                                                                        value={addressCG1.road}
                                                                        onChange={(event) => {
                                                                            setAdsCG1({ ...addressCG1, road: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ตรอก/ซอย"
                                                                        autoComplete="off"
                                                                        value={addressCG1.soi}
                                                                        onChange={(event) => {
                                                                            setAdsCG1({ ...addressCG1, soi: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={prov}
                                                                        getOptionLabel={(value) => value.pro_province_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_province_code === value.pro_province_code
                                                                        }
                                                                        value={addressCG1.prov}
                                                                        onChange={handleProvCG1}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="จังหวัด"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={aumpCG1}
                                                                        getOptionLabel={(value) => value.pro_aumphur_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_aumphur_code === value.pro_aumphur_code
                                                                        }
                                                                        value={addressCG1.aump}
                                                                        onChange={handleAumpCG1}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="เขต/อำเภอ"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={tumbCG1}
                                                                        getOptionLabel={(value) => value.pro_tumbol_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_tumbol_code === value.pro_tumbol_code
                                                                        }
                                                                        value={addressCG1.tumb}
                                                                        onChange={handleTumbCG1}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="แขวง/ตำบล"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={zipcCG1}
                                                                        getOptionLabel={(value) => value.pro_code}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_code === value.pro_code
                                                                        }
                                                                        value={addressCG1.zipcode}
                                                                        onChange={handleZipcodeCG1}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="รหัสไปรษณีย์"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </TabPanel>
                                                        <TabPanel value={TabCG} index={1} classes={classes}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <FormGroup row>
                                                                        <FormControlLabel
                                                                            control={<Checkbox checked={FormcheckCG.checkedCGA} onChange={handleCheckedCG} name="checkedCGA" />}
                                                                            label="ที่อยู่ตามทะเบียนบ้าน"
                                                                            classes={{ label: classes.font_normal }}
                                                                        />
                                                                    </FormGroup>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="เลขที่"
                                                                        autoComplete="off"
                                                                        value={addressCG2.no}
                                                                        disabled={LockTab2}
                                                                        onChange={(event) => {
                                                                            setAdsCG2({ ...addressCG2, no: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ถนน"
                                                                        autoComplete="off"
                                                                        value={addressCG2.road}
                                                                        disabled={LockTab2}
                                                                        onChange={(event) => {
                                                                            setAdsCG2({ ...addressCG2, road: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ตรอก/ซอย"
                                                                        autoComplete="off"
                                                                        value={addressCG2.soi}
                                                                        disabled={LockTab2}
                                                                        onChange={(event) => {
                                                                            setAdsCG2({ ...addressCG2, soi: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={prov}
                                                                        getOptionLabel={(value) => value.pro_province_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_province_code === value.pro_province_code
                                                                        }
                                                                        value={addressCG2.prov}
                                                                        disabled={LockTab2}
                                                                        onChange={handleProvCG2}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="จังหวัด"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={aumpCG2}
                                                                        getOptionLabel={(value) => value.pro_aumphur_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_aumphur_code === value.pro_aumphur_code
                                                                        }
                                                                        value={addressCG2.aump}
                                                                        disabled={LockTab2}
                                                                        onChange={handleAumpCG2}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="เขต/อำเภอ"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={tumbCG2}
                                                                        getOptionLabel={(value) => value.pro_tumbol_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_tumbol_code === value.pro_tumbol_code
                                                                        }
                                                                        value={addressCG2.tumb}
                                                                        disabled={LockTab2}
                                                                        onChange={handleTumbCG2}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="แขวง/ตำบล"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={zipcCG2}
                                                                        getOptionLabel={(value) => value.pro_code}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_code === value.pro_code
                                                                        }
                                                                        value={addressCG2.zipcode}
                                                                        disabled={LockTab2}
                                                                        onChange={handleZipcodeCG2}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="รหัสไปรษณีย์"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </TabPanel>
                                                        <TabPanel value={TabCG} index={2} classes={classes}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={8}>
                                                                    <FormGroup row>
                                                                        <FormControlLabel
                                                                            control={<Checkbox checked={FormcheckCG.checkedCGB} onChange={handleCheckedCG} name="checkedCGB" />}
                                                                            label="ที่อยู่ตามทะเบียนบ้าน"
                                                                            classes={{ label: classes.font_normal }}
                                                                        />
                                                                        <FormControlLabel
                                                                            control={<Checkbox checked={FormcheckCG.checkedCGC} onChange={handleCheckedCG} name="checkedCGC" />}
                                                                            label="ที่อยู่ปัจจุบัน"
                                                                            classes={{ label: classes.font_normal }}
                                                                        />
                                                                    </FormGroup>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4}>
                                                                    <Box className={classes.displayflexEnd}>
                                                                        <Button className={classes.font_normal}
                                                                            disabled={addressCG3.zipcode === null || addressCG3.no === ''}
                                                                            onClick={handleGetLocationCG}
                                                                            startIcon={<MyLocation />}
                                                                            color="primary" variant="contained" size="small">
                                                                            ค้นหาพิกัด
                                                                        </Button>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="เลขที่"
                                                                        autoComplete="off"
                                                                        value={addressCG3.no}
                                                                        disabled={LockTab3}
                                                                        onChange={(event) => {
                                                                            setAdsCG3({ ...addressCG3, no: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField

                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ถนน"
                                                                        autoComplete="off"
                                                                        value={addressCG3.road}
                                                                        disabled={LockTab3}
                                                                        onChange={(event) => {
                                                                            setAdsCG3({ ...addressCG3, road: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="ตรอก/ซอย"
                                                                        autoComplete="off"
                                                                        value={addressCG3.soi}
                                                                        disabled={LockTab3}
                                                                        onChange={(event) => {
                                                                            setAdsCG3({ ...addressCG3, soi: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={prov}
                                                                        getOptionLabel={(value) => value.pro_province_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_province_code === value.pro_province_code
                                                                        }
                                                                        value={addressCG3.prov}
                                                                        onChange={handleProvCG3}
                                                                        disabled={LockTab3}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="จังหวัด"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={aumpCG3}
                                                                        getOptionLabel={(value) => value.pro_aumphur_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_aumphur_code === value.pro_aumphur_code
                                                                        }
                                                                        value={addressCG3.aump}
                                                                        onChange={handleAumpCG3}
                                                                        disabled={LockTab3}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="เขต/อำเภอ"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={tumbCG3}
                                                                        getOptionLabel={(value) => value.pro_tumbol_desc}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_tumbol_code === value.pro_tumbol_code
                                                                        }
                                                                        value={addressCG3.tumb}
                                                                        onChange={handleTumbCG3}
                                                                        disabled={LockTab3}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="แขวง/ตำบล"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <Autocomplete
                                                                        classes={{
                                                                            input: classes.font_normal,
                                                                            option: classes.font_normal,
                                                                        }}
                                                                        options={zipcCG3}
                                                                        getOptionLabel={(value) => value.pro_code}
                                                                        getOptionSelected={(option, value) =>
                                                                            option.pro_code === value.pro_code
                                                                        }
                                                                        value={addressCG3.zipcode}
                                                                        onChange={handleZipcodeCG3}
                                                                        disabled={LockTab3}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="รหัสไปรษณีย์"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                                required
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="Latitude"
                                                                        autoComplete="off"
                                                                        value={addressCG3.lat}
                                                                        onChange={(event) => {
                                                                            setAdsCG3({ ...addressCG3, lat: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        label="Longitude"
                                                                        autoComplete="off"
                                                                        value={addressCG3.lng}
                                                                        onChange={(event) => {
                                                                            setAdsCG3({ ...addressCG3, lng: event.target.value });
                                                                        }}
                                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                        InputProps={{ className: classes.font_normal }}
                                                                        InputLabelProps={{ className: classes.font_normal }}
                                                                        required
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </TabPanel>
                                                    </Box>
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
                                            <FormLabel className={classes.font_normal} ><HeadersIII classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <RadioGroup row aria-label="position" value={FormCG.smoking} onChange={handleSmokingCG} defaultValue="top">
                                                        {smoking.map((smoking) =>
                                                            <FormControlLabel key={smoking.gmm_smoking_id} value={smoking.gmm_smoking_id}
                                                                classes={{ label: classes.font_normal }}
                                                                control={<Radio color="primary" />}
                                                                label={smoking.gmm_smoking_name} >
                                                            </FormControlLabel>
                                                        )}
                                                    </RadioGroup>
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
                                            <FormLabel className={classes.font_normal} ><HeadersVII classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="exp_year"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ประสบการณ์ทำงาน (ปี)"
                                                        type="number"
                                                        autoComplete="off"
                                                        value={FormCG.exp_year}
                                                        onChange={handleChangeInputCG}
                                                        inputProps={{ min: 0, max: 100, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="exp_insite_year"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ประสบการณ์ทำงานในโรงพยาบาล (ปี)"
                                                        type="number"
                                                        autoComplete="off"
                                                        value={FormCG.exp_insite_year}
                                                        onChange={handleChangeInputCG}
                                                        inputProps={{ min: 0, max: 100, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="hospital"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ชื่อโรงพยาบาล"
                                                        autoComplete="off"
                                                        value={FormCG.hospital}
                                                        onChange={handleChangeInputCG}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
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
                                            <FormLabel className={classes.font_normal} ><HeadersVIII classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={education}
                                                        getOptionLabel={(value) => value.gmm_education_name}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_education_id === value.gmm_education_id
                                                        }
                                                        value={FormCG.Education}
                                                        onChange={handleEducation}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="ระดับการศึกษา"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="Certificate"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ประกาศนียบัตร"
                                                        autoComplete="off"
                                                        value={FormCG.Certificate}
                                                        onChange={handleChangeInputCG}
                                                        inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
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
                                            <FormLabel className={classes.font_normal} ><HeadersV classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <Autocomplete
                                                        classes={{
                                                            input: classes.font_normal,
                                                            option: classes.font_normal,
                                                        }}
                                                        options={banks}
                                                        getOptionLabel={(value) => value.gmm_bank_name}
                                                        getOptionSelected={(option, value) =>
                                                            option.gmm_bank_id === value.gmm_bank_id
                                                        }
                                                        value={FormCG.bank_list}
                                                        onChange={handleBankCG}
                                                        renderOption={(option) => {
                                                            const picture =
                                                                "/image/icon_bank/" + option.gmm_bank_code + ".png";
                                                            return (
                                                                <>
                                                                    <img
                                                                        src={picture}
                                                                        className={classes.selectIcon}
                                                                    ></img>
                                                                    {option.gmm_bank_name}
                                                                </>
                                                            );
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="ธนาคาร"
                                                                margin="dense"
                                                                variant="outlined"
                                                                InputLabelProps={{ className: classes.font_normal }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Hidden only={['sm']}>
                                                    <Grid item xs={4} />
                                                </Hidden>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="bankn"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ชื่อบัญชี"
                                                        value={FormCG.bank_name}
                                                        onChange={handleChangeInputCG}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        name="bankc"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="เลขที่บัญชี"
                                                        value={FormCG.bank_code}
                                                        onChange={handleChangeInputCG}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
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
                                            <FormLabel className={classes.font_normal} ><HeadersVI classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="relfn"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ชื่อ - นามสกุล"
                                                        value={FormCG.rel_fullname}
                                                        onChange={handleChangeInputCG}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="relt"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="เบอร์โทรติดต่อ"
                                                        value={FormCG.rel_tel}
                                                        onChange={handleChangeInputCG}
                                                        inputRef={rel_telRef}
                                                        error={FormCG.errorTelRef.status}
                                                        helperText={FormCG.errorTelRef.message}
                                                        inputProps={{ maxLength: 10, className: classes.font_normal, }}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <TextField
                                                        name="relu"
                                                        variant="outlined"
                                                        margin="dense"
                                                        label="ความเกี่ยวข้อง"
                                                        value={FormCG.rel_user}
                                                        onChange={handleChangeInputCG}
                                                        InputProps={{ className: classes.font_normal }}
                                                        InputLabelProps={{ className: classes.font_normal }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Box>

                            <Box mt={2} mb={4}>
                                <Card variant="outlined">
                                    <CardContent style={{ paddingBottom: '16px' }}>
                                        <FormControl component="fieldset">
                                            <FormLabel className={classes.font_normal} ><HeadersXV classes={classes} /></FormLabel>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} >
                                                    <TableContainer component={Paper}>
                                                        <Table aria-label="custom pagination table">
                                                            <TableBody>
                                                                {datatableCG.map((row, index) => (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell width='70%' align="left">
                                                                            {index + 1}. {row.Topic}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell width='20%' align="right">
                                                                            <Button
                                                                                component="label"
                                                                                variant="contained"
                                                                                color="primary"
                                                                                className={classes.font_normal}
                                                                                style={{
                                                                                    textTransform: 'none',
                                                                                    whiteSpace: 'pre'
                                                                                }}
                                                                                fullWidth
                                                                            >


                                                                                {row.type === 'PDF' ? 'Upload PDF' : 'Upload Image'}
                                                                                <input
                                                                                    id="InputFileCG"
                                                                                    onChange={(e) => { handleuploadFileCG(e, index) }}
                                                                                    type="file"
                                                                                    accept={row.type === 'PDF' ? "application/pdf" : "image/x-png,image/gif,image/jpeg"}
                                                                                    hidden
                                                                                />

                                                                            </Button>
                                                                        </StyledTableCell>
                                                                        {row.type === 'PDF' ?
                                                                            <StyledTableCell width='10%' align="center">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    color="primary"
                                                                                    onClick={() => { handlePreviewPDFOpen(index, row) }}
                                                                                    className={classes.font_normal}
                                                                                    style={{
                                                                                        textTransform: 'none',
                                                                                    }}
                                                                                    disabled={row.status}
                                                                                >
                                                                                    Preview
                                                                                </Button>
                                                                            </StyledTableCell>
                                                                            :

                                                                            <StyledTableCell width='10%' align="center">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    color="primary"
                                                                                    onClick={() => { handlePreviewOpenCG(index) }}
                                                                                    className={classes.font_normal}
                                                                                    style={{
                                                                                        textTransform: 'none',
                                                                                    }}
                                                                                    disabled={row.status}
                                                                                >
                                                                                    Preview
                                                                                </Button>
                                                                            </StyledTableCell>
                                                                        }
                                                                        <StyledTableCell width='5%' align="center" style={{ paddingLeft: '0px' }}>
                                                                            <IconButton title="ลบข้อมูล" color='secondary' onClick={() => { handleDeleteImageCG(row, index) }} disabled={row.status}>
                                                                                <Close fontSize="small" />
                                                                            </IconButton>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>

                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>

                                            </Grid>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Grid item xs={12} >
                                <ButtonSubmit classes={classes} status={promise} />
                            </Grid>
                        </form>
                    </MuiPickersUtilsProvider>
                )
            }

            {/* Modal */}

            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={openPdfviewer}
                onClose={handlePreviewPDFClose}
                TransitionComponent={Transition}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handlePreviewPDFClose}>
                    {viewer.title}
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Box className={classes.LayoutPDF}  >

                        <Document file={viewer.url_pdf} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber} />
                        </Document>

                    </Box>

                </MuiDialogContent>
                <DialogActions className={classes.ActionPage}>

                    <Button
                        className={classes.font_normal}
                        color="primary"
                        variant="outlined"
                        size="small"
                        startIcon={<SkipPrevious />}
                        onClick={PrevPage}>ก่อนหน้า</Button>
                    <Box className={classes.font_normal}>
                        {pageNumber} / {numPages}
                    </Box>
                    <Button
                        className={classes.font_normal}
                        color="primary"
                        variant="outlined"
                        size="small"
                        endIcon={<SkipNext />}
                        onClick={NextPage}>ถัดไป</Button>

                </DialogActions>
            </Dialog>

            {
                PreviewImageTX &&
                <Lightbox
                    mainSrc={datatableTX[Indx].preview}
                    onCloseRequest={handlePreviewCloseTX}
                    animationDuration={100}
                    imageTitle="Preview"
                    imagePadding={50}
                    reactModalStyle={custom_overlay}
                    enableZoom={true}
                />
            }

            {
                PreviewImageCG &&
                <Lightbox
                    mainSrc={datatableCG[Indx].preview}
                    onCloseRequest={handlePreviewCloseCG}
                    animationDuration={100}
                    imageTitle="Preview"
                    imagePadding={50}
                    reactModalStyle={custom_overlay}
                    enableZoom={true}
                />
            }
        </>
    );
}




TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

