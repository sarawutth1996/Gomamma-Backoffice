/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Avatar, Backdrop, Button, Box, Chip, TextField, Typography, Grid, IconButton, InputAdornment, FormControl, FormLabel, Divider, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, Card, CardContent, Checkbox,
    Dialog, DialogTitle, DialogContent, DialogActions, StepConnector, StepLabel, Stepper, Step, Radio, RadioGroup, FormHelperText, FormGroup,
    FormControlLabel
} from "@material-ui/core";
import {
    Info, Assignment, Close, DoneAll, AccessTime, MyLocation, KeyboardArrowRight, KeyboardArrowLeft,
    LocationOn, FormatListNumbered, LastPage, FirstPage, Search, Check, Person,
    DirectionsWalk, Favorite, SportsKabaddi, PhotoCamera, Chat, LibraryMusic, RecordVoiceOver, Cake
} from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Alert, AlertTitle } from '@material-ui/lab';
import config from '../../config';
//Google-map
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
const APIkey = 'AIzaSyANcHgMKpxM2-2wipNHgT7vumZrM7f1Nlo'
const libraries = ["places"];
const language = ["th"];

const mapContainerStyle = {
    width: "100%",
    height: "100%"
}

var interval
//-------------------------------------------------------------------


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

const ColorRouteConnectorDesc = withStyles({
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
    ChipStyle: {
        background: 'white',
        // width: '65%',
        fontFamily: 'Regular',
        fontSize: '14px',
        border: 'solid 1px #d5d5d5'
    },
    trip_meesage: {
        zIndex: '1',
        position: 'relative',
        left: '0',
        bottom: '0',
        margin: '8px',
        // textAlign: 'center'
    },
    itemCenter: {
        alignItems: "center",
    },
    IconSearch: {
        color: 'gray'
    },
    Showmore: {
        background: '#9fdefb80',
        cursor: 'pointer',
        textAlign: 'center',
        borderRadius: '2px',
        marginTop: '4px',
        '&:hover': {
            background: '#ace5ff',
        },
    },
    CardStyle: {
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px'
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
    font_semibold: {
        fontFamily: 'SemiBold',
        fontSize: '12px'
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
    font_header: {
        fontFamily: 'SemiBold',
        margin: '10px',
        fontSize: '18px'
    },
    font_small: {
        color: 'gray',
        fontFamily: 'Regular',
        fontSize: '12px'
    },
    font_smallR: {
        color: 'gray',
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },
    font_medium: {
        fontFamily: 'Regular',
        fontSize: '12px'
    },
    font_chip: {
        fontFamily: 'Regular',
        fontSize: '12px'
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

function Headers({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <MyLocation />
                    <Typography className={classes.font_header}>ติดตามการเดินทาง</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

function Booking_nbr({ classes, nbr }) {
    return (
        <>
            <Box className={classes.displayflex}>
                <Typography className={classes.font_header}>เลขที่การเดินทาง {nbr}</Typography>
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

function DialogHeadersII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <img src="/image/stethoscope.png" height="28" width="28" />
                    <Typography className={classes.font_subheader}>&nbsp;โรคประจำตัว (เลือกได้มากกว่า 1 ข้อ) *</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersIII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <DirectionsWalk />
                    <Typography className={classes.font_subheader}> ความสามารถในการเดิน *</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersIV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <img src="/image/helper.png" height="24" width="24" />
                    <Typography className={classes.font_subheader}>&nbsp;ความต้องการให้ผู้บริการช่วยพยุง/ประคอง *</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function DialogHeadersV({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Assignment />
                    <Typography className={classes.font_subheader}>&nbsp;ความสนใจ (เลือกได้มากกว่า 1 ข้อ) </Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersVI({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <RecordVoiceOver />
                    <Typography className={classes.font_subheader}>&nbsp;คำที่ต้องการให้ใช้เรียกแทนชื่อ (ถ้ามี)</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersVII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <LibraryMusic />
                    <Typography className={classes.font_subheader}>&nbsp;ประเภทเพลงที่ชื่นชอบ</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersVIII({ classes }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflex}>
                    <Cake />
                    <Typography className={classes.font_subheader}>&nbsp;ข้อมูลเพื่อบริการพิเศษ</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

function DialogHeadersIX({ classes }) {
    return (
        <>
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <Chat />
                    <Typography className={classes.font_subheader}>&nbsp;ข้อมูลอื่นๆ ที่ต้องการแจ้งให้ผู้บริการทราบ</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function DialogHeadersIIX({ classes }) {
    return (
        <>
            <Box pt={0} pb={1}>
                <Box className={classes.displayflex}>
                    <PhotoCamera />
                    <Typography className={classes.font_subheader}>&nbsp;ต้องการให้ถ่ายภาพผู้โดยสารส่งให้ผู้จองระหว่างการเดินทางหรือไม่ ? *</Typography>
                </Box>
                <PageLine />
            </Box>
        </>
    );
}

function TopicII({ classes }) {
    return (
        <>
            <Box pt={2} pb={0}>
                <Box className={classes.displayflex}>
                    <Person />
                    <Typography className={classes.font_header}>ข้อมูลเพื่อบริการพิเศษที่ถูกใจผู้โดยสาร (เป็นทางเลือก)</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

const profilepass = {
    id: '',
    fname: '',
    lname: '',
    sex: null,
    weight: '',
    height: '',
    age: '',
    tel: '',
    disease_question: '2',
    walk_question: '1',
    cg_question: '1',
    hobby_question: '2',
    camera_question: '1',
    disease_json: '', // โรคประจำตัว
    disease_other: '', // กรณีเลือกอื่นๆ
    hobby_json: null, // งานอดิเรก / ความสนใจ
    hobby_other: '', // กรณีเลือกอื่นๆ
    Message: '', //คำที่ต้องการให้ใช้เรียกแทนชื่อ
    music_json: null, // music json
    music_other: '', // กรณีเลือกอื่นๆ
    day: null, // วันเกิด
    month: null, // เดือนเกิด
    note: '', // รายละเอียดเพิ่มเติม
    errorTel: {
        status: false,
        message: '',
    },
    errorDisease: {
        message: '',
        status: false
    }
}



export default function CustTracking() {
    const url_user = config.API_URL + "models/Customer/Customer_profile.php";
    const url = config.API_URL + "models/Customer/Customer_tracking.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const classes = useStyles();
    const state = useHistory();
    const { vision } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [datatable, setData] = useState([]);
    const [TrackOnline, setTracking] = useState([]);
    const [search, SetSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const [activeStep, setActiveStep] = useState(null);
    const [year, setYear] = useState([]);
    // Dialog 
    const [openShowPassenger, setOpenShowPassenger] = useState(false);
    const [sex, setSex] = useState([]);
    const [number, setNumbers] = useState([]);
    const [month, setMonths] = useState([]);
    const [music, setMusics] = useState([]);
    const [hobby, setHobbys] = useState([]);
    const [disease, setDisease] = useState([]);
    const [cg_question, setCg_question] = useState([]);
    const [walk_question, setWalk_question] = useState([]);
    const [camera_question, setCamera_question] = useState([]);
    const [disease_question, setDisease_question] = useState([]);
    const [Form, setForm] = useState(profilepass);
    const [msgCount, setMsgCount] = useState(0);

    // Controller 
    const [online, setOnline] = useState({ TX: 0, CG: 0 })
    const [service, setService] = useState([]);
    const [Panel, setControlPanel] = useState({
        service: { gmm_svtype_id: 'ALLIN', gmm_svtype_name: 'แสดงทั้งหมด' }
    });


    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
        return () => { clearInterval(interval); };
    }, []);

    async function FirstLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_datatable",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            res.service_mstr.unshift({ gmm_svtype_id: 'ALLIN', gmm_svtype_name: 'แสดงทั้งหมด' });
            setOnline({ ...online, TX: res.online_status.TX, CG: res.online_status.CG })
            setService(res.service_mstr);
            setTracking(res.working)
            setData(res.data)
            setBoolean(false);
            intervalPosition('ALLIN');
        }
    }

    async function startGetPosition(id) {
        const payload = JSON.stringify({
            key: "filter",
            id: id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            setTracking(res.filter)
        }
    }

    async function Profilepassenger() {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_passenger_master",
            id: showInfo.booking_pass_id
        });

        const response = await fetch(url_user, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            if (res.data.length !== 0) {
                setForm(res.data);
                setMsgCount(res.data.note.length);
            }

            setYear(res.year)
            setSex(res.sex)
            setNumbers(res.number)
            setMonths(res.month)
            setMusics(res.music)
            setHobbys(res.hobby)
            setDisease(res.disease)
            setWalk_question(res.walk)
            setCg_question(res.question2)
            setCamera_question(res.question2)
            setDisease_question(res.question1)
            setBoolean(false);
            setOpenShowPassenger(true)
        }
    }

    const filtered = datatable.filter((row) => {
        return row.gmm_booking_nbr.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_user_fullname.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_emp_fullname.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_product_name.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_travel_start_nfm.toLowerCase().includes(search.toLowerCase()) ||
            row.gmm_booking_status_track.toLowerCase().includes(search.toLowerCase())
    })

    const handleTracking = (row) => {
        state.push('/Home/Monitor/' + vision + '/' + row.gmm_booking_nbr);
    }



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const headCells = [
        { id: 'gmm_booking_nbr', label: '#', width: '5%', align: "center" },
        { id: 'gmm_user_fullname', label: 'ผู้จอง', width: '20%', align: "left" },
        { id: 'gmm_emp_fullname', label: 'คนขับรถ', width: '15%', align: "left" },
        { id: 'gmm_booking_product_name', label: 'Products', width: '15%', align: "left" },
        { id: 'gmm_booking_travel_start_nfm', label: 'วันที่เดินทาง', width: '20%', align: "center" },
        { id: 'gmm_booking_status', label: 'สถานะ', width: '20%', align: "center" },
        { id: 'edit', label: '', width: '5%', align: "center" },
    ];

    function intervalPosition(id) {

        interval = setInterval(() => {
            startGetPosition(id);
        }, 5000);
    }

    function RouteIconDesc(props) {
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

    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'object') {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
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
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                                hideSortIcon={true}

                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        </StyledTableCell>
                    ))}
                </StyledTableRow>
            </TableHead>
        );
    }

    function TablePaginationActions(props) {
        const theme = useTheme();
        const { count, page, rowsPerPage, onChangePage } = props;

        const handleFirstPageButtonClick = (event) => {
            onChangePage(event, 0);
        };

        const handleBackButtonClick = (event) => {
            onChangePage(event, page - 1);
        };

        const handleNextButtonClick = (event) => {
            onChangePage(event, page + 1);
        };

        const handleLastPageButtonClick = (event) => {
            onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };

        return (
            <div className={classes.Pagination}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="first page"
                >
                    {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
                </IconButton>
                <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="next page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="last page"
                >
                    {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
                </IconButton>
            </div>
        );
    }

    function ViewTable({ filtered, status }) {
        return (
            <>
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
                            {(rowsPerPage > 0
                                ? stableSort(filtered, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : stableSort(filtered, getComparator(order, orderBy))).map((row, index) => (
                                    <StyledTableRow hover key={index}>
                                        <StyledTableCell width='5%' align="center">
                                            {row.gmm_booking_nbr}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.gmm_user_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_emp_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_booking_product_name}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="center">
                                            {row.gmm_booking_travel_start_nfm}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="center">

                                            {(row.gmm_booking_status_track === 'กำลังเดินทาง') &&
                                                <Box style={{ color: 'rgb(246 172 16)', display: 'flex', justifyContent: 'center' }}>
                                                    <Info fontSize="small" /> &nbsp;
                                                    {row.gmm_booking_status_track}
                                                </Box>}

                                            {(row.gmm_booking_status_track === 'รอเดินทาง') &&
                                                <Box style={{ color: 'rgb(33, 124, 37)', display: 'flex', justifyContent: 'center' }}>
                                                    <AccessTime fontSize="small" /> &nbsp;
                                                    {row.gmm_booking_status_track}
                                                </Box>}

                                            {(row.gmm_booking_status_track === 'เดินทางแล้ว') &&
                                                <Box style={{ color: 'rgb(63, 81, 181)', display: 'flex', justifyContent: 'center' }}>
                                                    <Check fontSize="small" /> &nbsp;
                                                    {row.gmm_booking_status_track}
                                                </Box>}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                            <IconButton title="รายละเอียดการเดินทาง" color='primary' onClick={() => { handleTracking(row) }}>
                                                <Search fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={7} align="center">
                                        ไม่พบข้อมูล
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={7}
                                    count={filtered.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </>
        )
    }

    // Google Map
    const [zoom, setZoom] = useState(10);
    const [center, setCenters] = useState({ lat: 13.762459861106006, lng: 100.49094949418699 });
    const [showMore, setShowMore] = useState(false)
    const [showInfo, setShow] = useState({
        booking_nbr: null,
        booking_status: null,
        booking_product_name: null,
        booking_product_desc: null,
        booking_date: null,
        booking_time: null,
        booking_u_tel: null,
        booking_p_tel: null,
        booking_t_tel: null,
        booking_c_tel: null,
        booking_licenseplate: null,
        booking_user_id: null,
        booking_pass_id: null,
        booking_u: null,
        booking_p: null,
        booking_t: null,
        booking_c: null,
        booking_product_drop: null,
        booking_hrtx: null,
        booking_hrcg: null,
        booking_follower: null,
        booking_desc: null,
        booking_equipment: null,
        booking_point: [],
        booking_startpoint: null,
        booking_starttime: null,

    })
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: APIkey,
        libraries,
        language,
    })

    if (loadError) return "Error loading maps";
    if (!isLoaded) return null

    const options = {
        styles: [
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.school",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.sports_complex",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.station.bus",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "saturation": "21"
                    },
                    {
                        "weight": "4.05"
                    }
                ]
            }
        ],
        disableDefaultUI: true,
        gestureHandling: "greedy",
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER // 'right-center' ,
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



    const handleClickShowmore = (row) => {
        var substr = row.desc.gmm_booking_travel_start.split(' ');
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var convert = new Date(row.desc.gmm_booking_travel_start);
        var date_format = convert.toLocaleDateString("th", options);

        setShow({
            ...showInfo,
            booking_nbr: row.desc.gmm_booking_nbr,
            booking_status: row.desc.gmm_booking_status,
            booking_product_name: row.desc.gmm_product_name,
            booking_product_desc: row.desc.gmm_product_desc,
            booking_date: date_format,
            booking_time: substr[1],
            booking_user_id: row.desc.gmm_user_id,
            booking_pass_id: row.desc.gmm_booking_passenger_id,
            //---------------------
            booking_u_tel: conv_formatTel(row.desc.gmm_user_tel),
            booking_p_tel: conv_formatTel(row.desc.gmm_passenger_tel),
            booking_t_tel: conv_formatTel(row.desc.gmm_tx_tel),
            booking_c_tel: (row.desc.gmm_booking_cg_radio === 'ON') ? conv_formatTel(row.desc.gmm_cg_tel) : null,
            booking_licenseplate: row.desc.gmm_emp_licenseplate,
            //---------------------
            booking_u: row.desc.gmm_user_fullname,
            booking_p: row.desc.gmm_passenger_fullname,
            booking_t: row.desc.gmm_tx_fullname,
            booking_c: (row.desc.gmm_booking_cg_radio === 'ON') ? row.desc.gmm_cg_fullname : null,
            //---------------------
            booking_product_drop: row.desc.gmm_booking_product_drop,
            booking_hrtx: Number(row.desc.gmm_booking_taxi_hradd) + Number(row.desc.gmm_booking_taxi_hrdefault),
            booking_hrcg: (row.desc.gmm_booking_cg_radio === 'ON') ? Number(row.desc.gmm_booking_cg_hradd) + Number(row.desc.gmm_booking_cg_hrdefault) : null,
            booking_startpoint: Number(row.desc.gmm_booking_cg_startpoint - 1),
            booking_starttime: row.desc.gmm_booking_cg_starttime,
            //---------------------
            booking_follower: (row.desc.gmm_booking_rmks_follower) ? row.desc.gmm_booking_rmks_follower : 0,
            booking_desc: (row.desc.gmm_booking_rmks_desc) ? row.desc.gmm_booking_rmks_desc : '-',
            booking_equipment: row.desc.gmm_booking_rmks_equipment,
            booking_point: row.desc.point
        })
        setShowMore(true)
    }

    const handleCloseShowmore = () => {
        setShowMore(false)
    }

    const handleSelect_service = (ev, item) => {
        if (item) {
            clearInterval(interval)
            setControlPanel({ ...Panel, service: item })
            filter(item.gmm_svtype_id)
            intervalPosition(item.gmm_svtype_id);
        }
    }

    const handleLinkToTrip = () => {
        const url = config.PATH_URL + 'Home/Monitor/' + vision + '/' + showInfo.booking_nbr
        window.open(url);
    }

    const handleOpenShowPassenger = () => {
        Profilepassenger()
    }

    const handleClosShowPassenger = () => {
        setOpenShowPassenger(false)
    }

    async function filter(id) {
        const payload = JSON.stringify({
            key: "filter",
            id: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            setTracking(res.filter)
        }
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />


            <Card className={classes.CardStyle} variant="elevation" >
                <CardContent style={{ paddingBottom: '16px' }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Autocomplete
                                classes={{
                                    input: classes.font_normal,
                                    option: classes.font_normal,
                                }}
                                options={service}
                                value={Panel.service}
                                onChange={handleSelect_service}
                                getOptionLabel={(value) => value.gmm_svtype_name}
                                getOptionSelected={(option, value) =>
                                    option.gmm_svtype_id === value.gmm_svtype_id
                                }
                                renderOption={(option) => {
                                    return (
                                        <>
                                            {(option.gmm_svtype_id !== 'TX' && option.gmm_svtype_id !== 'CG') &&
                                                <>
                                                    <Avatar style={{ background: '#FFCB08' }}>
                                                        <DoneAll />
                                                    </Avatar> &nbsp; แสดงทั้งหมด

                                                </>
                                            }

                                            {option.gmm_svtype_id === 'TX' &&
                                                <>
                                                    <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }}>
                                                    </Avatar> &nbsp; Taxi
                                                </>
                                            }

                                            {option.gmm_svtype_id === 'CG' &&
                                                <>
                                                    <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }}>
                                                    </Avatar> &nbsp; Caregiver
                                                </>
                                            }

                                        </>
                                    );
                                }}
                                renderInput={(params) => (
                                    < TextField
                                        {...params}
                                        label="บริการ"
                                        margin="dense"
                                        variant="outlined"
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                    />
                                )}

                            />

                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                    <Box style={{ height: '65vh', width: '100%' }}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={zoom}
                            center={center}
                            options={options}
                        >

                            <Box className={classes.trip_meesage}>
                                <Chip
                                    avatar={<Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }} />}
                                    className={classes.ChipStyle} label={'Online : ' + online.TX} />
                                &nbsp;
                                <Chip
                                    avatar={<Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }} />}
                                    className={classes.ChipStyle} label={'Online : ' + online.CG} />
                            </Box>

                            {TrackOnline.map((position, index) => (
                                <Box key={index}>
                                    <Marker
                                        position={{ lat: Number(position.lat), lng: Number(position.lng) }}
                                        icon={{
                                            url: (position.service === 'Taxi' ? "/image/taxi.png" : "/image/cgicon.png"),
                                            scaledSize: new window.google.maps.Size(35, 35),
                                            origin: new window.google.maps.Point(0, 0),
                                            anchor: new window.google.maps.Point(18, 8)
                                        }}
                                    />

                                    {position.service === 'Taxi' &&
                                        <InfoWindow
                                            position={{ lat: Number(position.lat), lng: Number(position.lng) }}
                                        >

                                            <Box className={classes.font_medium}>
                                                <span className={classes.font_semibold}>คนขับรถ :</span> {position.gmm_emp_fullname}
                                                <Box className={classes.Showmore}
                                                    onClick={() => { handleClickShowmore(position) }}
                                                >ดูเพิ่มเติม</Box>
                                            </Box>

                                        </InfoWindow>
                                    }

                                    {position.service === 'Caregiver' &&
                                        <InfoWindow
                                            position={{ lat: Number(position.lat), lng: Number(position.lng) }}
                                        >

                                            <Box className={classes.font_medium}>
                                                <span className={classes.font_semibold}>ผู้ดูแล :</span> {position.gmm_emp_fullname}
                                                <Box className={classes.Showmore}
                                                    onClick={() => { handleClickShowmore(position) }}
                                                >ดูเพิ่มเติม</Box>

                                            </Box>


                                        </InfoWindow>
                                    }
                                </Box>
                            ))}


                        </GoogleMap>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2} className={classes.itemCenter}>
                {/* <Hidden only={['xs']}>
                    <Grid item xs={8} />
                </Hidden> */}
                <Grid item xs={12} sm={12} md={12}>
                    <TextField
                        margin="dense"
                        variant="outlined"
                        placeholder="ค้นหา"
                        onChange={(e) => SetSearch(e.target.value)}
                        InputProps={{
                            className: classes.font_normal,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" className={classes.IconSearch} />
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{
                            className: classes.font_normal,
                        }}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <ViewTable filtered={filtered} status={promise} />
                </Grid>
            </Grid>

            <Dialog
                onClose={handleCloseShowmore}
                fullWidth={true}
                maxWidth="md"
                open={showMore}>
                <MuiDialogTitle onClose={handleCloseShowmore}>
                    รายละเอียดการเดินทาง
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card variant="outlined" >
                                <CardContent style={{ paddingBottom: '16px' }} >
                                    <FormControl component="fieldset">
                                        <Booking_nbr classes={classes} nbr={showInfo.booking_nbr} />
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
                                            <Grid item xs={6}><Box mt={1} className={classes.font_normal}>{showInfo.booking_time} น.</Box></Grid>
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
                                                <ListItemSecondaryAction>
                                                    <IconButton onClick={handleOpenShowPassenger} style={{ background: '#f5f5f5' }}>
                                                        <Assignment color="primary" />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
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
                                                <Grid item xs={6}> คนขับรถ : {(Number(showInfo.booking_product_drop) !== 2) ? 'รอ ' + Number(showInfo.booking_hrtx) + ' ชั่วโมง สะสมรวมตลอดการเดินทาง' : '-'}</Grid>

                                                {/* <Grid item xs={6}> คนขับรถ : {showInfo.booking_hrtx > 0 ? showInfo.booking_hrtx : '-'}</Grid> */}
                                                {showInfo.booking_c && <Grid item xs={6}>ผู้ดูแล : {(Number(showInfo.booking_product_drop) !== 2) ? 'ให้บริการ ' + Number(showInfo.booking_hrcg) + ' ชั่วโมง' : '-'}</Grid>}
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
                                    <Stepper activeStep={activeStep} orientation="vertical" connector={<ColorRouteConnectorDesc />} style={{ padding: '12px 0px 12px 0px' }}>
                                        {showInfo.booking_point.map((label, index) => (
                                            <Step key={index}>
                                                <StepLabel StepIconComponent={RouteIconDesc}>
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
                <DialogActions>
                    <Button form="FieldFavourite" onClick={handleLinkToTrip} variant="contained" className={classes.font_normal} color="primary" fullWidth>
                        ติดตามการเดินทาง
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                onClose={handleClosShowPassenger}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openShowPassenger}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleClosShowPassenger}>
                    ข้อมูลผู้โดยสาร
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Card variant="outlined">
                        <CardContent style={{ paddingBottom: '16px' }}>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="fn"
                                        label="ชื่อ"
                                        value={Form.fname}
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
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
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="ln"
                                        label="นามสกุล"
                                        value={Form.lname}
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
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
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        value={Form.tel}
                                        name="tl"
                                        label="เบอร์โทรศัพท์"
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
                                        error={Form.errorTel.status}
                                        helperText={Form.errorTel.message}
                                        inputProps={{ maxLength: 10, className: classes.font_normal, }}
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
                                <Grid item xs={12} sm={6} md={4}>
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
                                        value={Form.sex}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="เพศ"
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
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="hi"
                                        label="ส่วนสูง"
                                        value={Form.height}
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
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="wi"
                                        label="น้ำหนัก"
                                        value={Form.weight}
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

                                <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        classes={{
                                            input: classes.font_normal,
                                            option: classes.font_normal,
                                        }}
                                        options={year}
                                        getOptionLabel={(value) => value.year}
                                        getOptionSelected={(option, value) =>
                                            option.year === value.year
                                        }
                                        value={Form.age}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="ปีเกิด พ.ศ."
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
                    <Box mt={2}>
                        <Card variant="outlined" >
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl>
                                    <FormLabel className={classes.font_normal} ><DialogHeadersII classes={classes} /></FormLabel>
                                    <RadioGroup row aria-label="position" value={Form.disease_question} defaultValue="top">
                                        {disease_question.map((ans) =>
                                            <FormControlLabel key={ans.gmm_question_id} value={ans.gmm_question_id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" />}
                                                label={ans.gmm_question_name} >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                                {Form.disease_question === '1' && (
                                    <Box pt={2} pb={1}>
                                        <Card variant="outlined">
                                            <CardContent style={{ paddingBottom: '16px' }}>
                                                <FormControl component="fieldset" error={Form.errorDisease.status} className={classes.font_normal}>
                                                    <FormGroup>
                                                        {disease.map((disease, index) =>
                                                            <Box key={disease.gmm_disease_id} className={classes.displayflex}>
                                                                <FormControlLabel
                                                                    classes={{ label: classes.font_normal }}
                                                                    control={<Checkbox color="primary" checked={disease.status}
                                                                        name={disease.gmm_disease_id} />}
                                                                    label={disease.gmm_disease_name}
                                                                    size="small"
                                                                />
                                                                {disease.gmm_disease_id == '8' && disease.status == true &&
                                                                    <>
                                                                        {disease.group.map((item, indexSec) =>
                                                                            <Box key={item.gmm_disease_id}>
                                                                                <FormControlLabel
                                                                                    classes={{ label: classes.font_normal }}
                                                                                    control={<Checkbox color="primary" checked={item.status}
                                                                                        name={item.gmm_disease_id} />}
                                                                                    label={item.gmm_disease_desc}
                                                                                    size="small"
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </>
                                                                }
                                                                {disease.gmm_disease_id == '11' && disease.status == true &&
                                                                    <Box>
                                                                        <TextField
                                                                            value={Form.disease_other}
                                                                            margin="dense"
                                                                            variant="outlined"
                                                                            placeholder="โปรดระบุ"
                                                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                            InputProps={{
                                                                                className: classes.font_normal,
                                                                            }}
                                                                            InputLabelProps={{
                                                                                className: classes.font_normal,
                                                                            }}
                                                                            fullWidth
                                                                        />
                                                                    </Box>
                                                                }
                                                            </Box>
                                                        )}
                                                        <FormHelperText className={classes.font_normal}>{Form.errorDisease.message}</FormHelperText>
                                                    </FormGroup>
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersIII classes={classes} /></FormLabel>
                                    <RadioGroup value={Form.walk_question} required>
                                        {walk_question.map((walk) =>
                                            <FormControlLabel key={walk.gmm_walk_id} value={walk.gmm_walk_id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" />}
                                                label={walk.gmm_walk_name}
                                                required >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl>
                                    <FormLabel className={classes.font_normal} ><DialogHeadersIV classes={classes} /></FormLabel>
                                    <RadioGroup row aria-label="position" value={Form.cg_question} defaultValue="top">
                                        {cg_question.map((ans) =>
                                            <FormControlLabel key={ans.gmm_question_id} value={ans.gmm_question_id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" />}
                                                label={ans.gmm_question_name} >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersIIX classes={classes} /></FormLabel>
                                    <RadioGroup value={Form.camera_question} required>
                                        {camera_question.map((camera) =>
                                            <FormControlLabel key={camera.gmm_question_id} value={camera.gmm_question_id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" />}
                                                label={camera.gmm_question_name}
                                                required >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersIX classes={classes} /></FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <TextField
                                                value={Form.note}
                                                placeholder="รายละเอียดเพิ่มเติม"
                                                variant="outlined"
                                                rows={3}
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
                                            <FormHelperText className={classes.font_smallR}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <TopicII classes={classes} />
                    <Box>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersVI classes={classes} /></FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                value={Form.Message}
                                                inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                InputProps={{
                                                    className: classes.font_normal,
                                                }}
                                                InputLabelProps={{
                                                    className: classes.font_normal,
                                                }}
                                                helperText="ตัวอย่าง เช่น ท่าน, อาม่า, คุณลุง, คุณยาย"
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
                                <FormControl size="small" component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersV classes={classes} /></FormLabel>
                                    <Box pt={1} pb={1}>
                                        <Card variant="outlined">
                                            <CardContent style={{ paddingBottom: '16px' }}>
                                                <FormControl component="fieldset" className={classes.font_normal}>
                                                    <FormGroup>
                                                        {hobby.map((hobby, index) =>
                                                            <Box key={hobby.gmm_hobby_id} className={classes.displayflex}>
                                                                <FormControlLabel
                                                                    classes={{ label: classes.font_normal }}
                                                                    control={<Checkbox color="primary" checked={hobby.status}
                                                                        name={hobby.gmm_hobby_id} />}
                                                                    label={hobby.gmm_hobby_name}
                                                                    size="small"
                                                                />
                                                                {hobby.gmm_hobby_id == '10' && hobby.status == true &&
                                                                    <Box>
                                                                        <TextField
                                                                            value={Form.hobby_other}
                                                                            variant="outlined"
                                                                            margin="dense"
                                                                            placeholder="โปรดระบุ"
                                                                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                                                            InputProps={{
                                                                                className: classes.font_normal,
                                                                            }}
                                                                            InputLabelProps={{
                                                                                className: classes.font_normal,
                                                                            }}
                                                                            fullWidth
                                                                        />
                                                                    </Box>
                                                                }
                                                            </Box>
                                                        )}
                                                    </FormGroup>
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </FormControl>

                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersVII classes={classes} /></FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <Autocomplete
                                                classes={{
                                                    input: classes.font_normal,
                                                    option: classes.font_normal,
                                                }}
                                                options={music}
                                                getOptionLabel={(value) => value.gmm_music_name}
                                                getOptionSelected={(option, value) =>
                                                    option.gmm_music_id === value.gmm_music_id
                                                }
                                                value={Form.music_json}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="ประเภท"
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            className: classes.font_normal,
                                                        }}
                                                    />
                                                )}

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <TextField
                                                label="ระบุนักร้องโปรด / เพลง"
                                                margin="dense"
                                                variant="outlined"
                                                value={Form.music_other}
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
                                    </Grid>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card variant="outlined">
                            <CardContent style={{ paddingBottom: '16px' }}>
                                <FormControl component="fieldset">
                                    <FormLabel className={classes.font_normal} ><DialogHeadersVIII classes={classes} /></FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <Autocomplete
                                                classes={{
                                                    input: classes.font_normal,
                                                    option: classes.font_normal,
                                                }}
                                                options={number}
                                                getOptionLabel={(value) => value.gmm_num_id}
                                                getOptionSelected={(option, value) =>
                                                    option.gmm_num_id === value.gmm_num_id
                                                }
                                                value={Form.day}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="วันเกิด"
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            className: classes.font_normal,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
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
                                                value={Form.month}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="เดือนเกิด"
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            className: classes.font_normal,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                </MuiDialogContent>
            </Dialog>

        </>
    );
}

