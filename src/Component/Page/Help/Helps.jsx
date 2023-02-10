/* eslint-disable */
import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useParams, useHistory, theme } from "react-router-dom";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import {
    Backdrop, Button, Box, Card, Checkbox, Collapse, Container, CardContent, Divider, FormHelperText, Paper, Switch,
    FormControl, FormGroup, FormControlLabel, TextField, Typography, Grid, IconButton, CardHeader, InputAdornment,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, Slide
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
    Edit, CloudUpload, Close, Save, Help, ExpandMore, LastPage, FirstPage, KeyboardArrowRight,
    KeyboardArrowLeft, Refresh, SkipNext, SkipPrevious, InsertDriveFile
} from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import * as action from "../../actions/action";
import Swal from 'sweetalert2'
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

const StyledTableCell = withStyles(() => ({
    head: {
        backgroundColor: '#fcfcfc',
        fontFamily: "Regular",
        fontSize: 14,
    },
    body: {
        // border: 'solid 1px #e0e0e0',
        fontFamily: "Regular",
        fontSize: 14,
    }

}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        '&:nth-of-type(odd)': {
            fontFamily: "Regular",
            fontSize: 14,
            border: 'soild'
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    ActionPage: {
        justifyContent: 'space-between'
    },
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
    LayoutPDF: {
        display: "flex",
        justifyContent: 'center',
        background: '#dbdcdc',
        height: '100%'
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
                    <Help />
                    <Typography className={classes.font_header}>Help & Manual</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

const create_faq = {
    id: '',
    title: '',
    desc: '',
    display: false,
}



export default function Helps() {
    const url = config.API_URL + "models/Help/Help.php";
    const classes = useStyles();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const { vision } = useParams();
    const [promise, setPromise] = useState(false)
    const [isLoading, setBoolean] = useState(false);
    const [Hidd, setHidd] = useState(false);
    const [HiddPDF, setHiddPDF] = useState(false);
    const [openPdfviewer, setOpenPDF] = useState(false);
    const [FAQ, setFAQ] = useState(create_faq);
    const [item, setData] = useState([]);
    const [filedocument, setDocument] = useState([]);
    const [msgCount, setMsgCount] = useState(0);
    const [expanded, setExpanded] = useState({
        one: true,
        two: true
    });

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
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setDocument(res.file)
            setData(res.data)
            setBoolean(false);
        }
    }

    async function onLoadFAQ() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "onLoadFAQ",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            setData(res.data)
            setBoolean(false);
        }
    }

    async function onLoadPDF() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "onLoadPDF",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(150);
        const res = await response.json();
        if (res.status) {
            setDocument(res.data)
            setBoolean(false);
        }
    }

    async function ConfirmFAQ() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_FAQ",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: FAQ
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
                onLoadFAQ();
                Clear();
            })

            setBoolean(false);
        }
    }

    async function ConfirmUploadfile() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_upload_file",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: filePDF
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
                onLoadPDF();
                ClearPDF();
            })

            setBoolean(false);
        } else {
            Swal.fire({
                title: "แจ้งเตือน",
                text: res.message,
                icon: "warning",
            })

            setBoolean(false);
        }
    }

    async function ConfirmRename() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "file_rename",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: filePDF
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
                onLoadPDF();
                ClearPDF();
            })

            setBoolean(false);
        } else {
            Swal.fire({
                title: "แจ้งเตือน",
                text: res.message,
                icon: "warning",
            })

            setBoolean(false);
        }
    }

    async function ChangeDisplay(item) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeDisplay",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: item,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) { }
    }

    async function ChangeDisplayPDF(item) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeDisplayPDF",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: item,
            display: (!item.gmm_file_display) ? 'ON' : 'OFF'
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) { }
    }

    async function delete_faq(id) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Delete_faq",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: "ลบข้อมูลสำเร็จ",
                icon: "success",
            }).then(() => {
                onLoadFAQ();
            })

        }
    }

    async function delete_pdf(id) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Delete_pdf",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: id,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: "ลบข้อมูลสำเร็จ",
                icon: "success",
            }).then(() => {
                onLoadPDF();
            })

        }
    }

    const Clear = () => {
        setHidd(false);
        setMsgCount(0);
        setFAQ(create_faq);
    }

    const ClearPDF = () => {
        setHiddPDF(false);
        setFilePDF({ ...filePDF, id: '', type: null, name: '', base64: '', preview: '', display: false })
        setUnlock(true);
        document.getElementById("InputFile").value = "";
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleExpandClick = (key) => {
        if (key == 'one') {
            setExpanded({ ...expanded, one: !expanded.one });
        } else {
            setExpanded({ ...expanded, two: !expanded.two });
        }

    };

    const handleChangeSwitch = (event, row, index) => {
        ChangeDisplay(row);
        //-------------------------------
        let newArr = [...item];
        newArr[index]['faq_display'] = event.target.checked;
        setData(newArr);
    };

    const handleChangeSwitchPDF = (event, row, index) => {
        ChangeDisplayPDF(row);
        let newArr = [...filedocument];
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i]['gmm_file_type'] === row['gmm_file_type']) {
                if (index === i) {
                    newArr[index]['gmm_file_display'] = event.target.checked;
                } else {
                    newArr[i]['gmm_file_display'] = false;
                }
            }
        }

        setDocument(newArr);

    };

    const handleDelete = (row) => {
        Swal.fire({
            title: "ลบ",
            text: "ท่านต้องการลบข้อมูล หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                delete_faq(row.faq_id)
            }
        });
    }

    const handleDeletePDF = (row) => {
        Swal.fire({
            title: "ลบ",
            text: "ท่านต้องการลบข้อมูล หรือไม่?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            //reverseButtons: true,
        }).then((output) => {
            if (output.isConfirmed) {
                delete_pdf(row.gmm_file_part)
            }
        });
    }

    const handleEdit = (row) => {
        setHidd(true);
        setFAQ({ ...FAQ, id: row.faq_id, title: row.faq_title, desc: row.faq_desc })
        setMsgCount(row.faq_desc.length)
    }

    const handleEditPDF = (row) => {
        document.getElementById("InputFile").value = "";
        setUnlock(false);
        setHiddPDF(true);
        setFilePDF({
            ...filePDF,
            id: row.gmm_file_part,
            type: (row.gmm_file_type === 'PACKAGE') ? { id: 'PACKAGE', desc: 'สำหรับ Package สินค้า' } : { id: 'MANUAL', desc: 'สำหรับคู่มือแนะนำการใช้งาน' },
            name: row.gmm_file_name,
            base64: '',
            pewview: '',
        })
    }

    const SubmitFAQ = (event) => {
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
                ConfirmFAQ();
            }
        });
    }


    const SubmitUpload = (event) => {
        event.preventDefault();
        //--------------------
        if (filePDF.base64) {
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
                    ConfirmUploadfile();
                }
            });
        } else {
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
                    ConfirmRename();
                }
            });
        }

    }


    // Table Form 2

    const [pageForm2, setPageForm2] = useState(0);
    const [rowsPerPageForm2, setRowsPerPageForm2] = useState(5);
    const [orderForm2, setOrderForm2] = React.useState('asc');
    const [orderByForm2, setOrderByForm2] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน


    const headCellExpects = [
        { id: 'id', label: '#', width: '5%', align: "center" },
        { id: 'faq_title', label: 'หัวข้อ', width: '25%', align: "left" },
        { id: 'faq_desc', label: 'คำอธิบาย', width: '40%', align: "left" },
        { id: 'faq_display', label: 'display on mobile', width: '20%', align: "center" },
        { id: 'edit', label: '', width: '5%', align: "center" },
        { id: 'delete', label: '', width: '5%', align: "center" },
    ];

    function EnhancedTableHeadForm2(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCellExpects.map((headCell) => (
                        <StyledTableCell
                            key={headCell.id}
                            width={headCell.width}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'default'}
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

    const handleRequestSortForm2 = (event, property) => {
        const isAsc = orderByForm2 === property && orderForm2 === 'asc';
        setOrderForm2(isAsc ? 'desc' : 'asc');
        setOrderByForm2(property);
    };

    const handleChangePageForm2 = (event, newPage) => {
        setPageForm2(newPage);
    };

    const handleChangeRowsPerPageForm2 = (event) => {
        setRowsPerPageForm2(parseInt(event.target.value, 10));
        setPageForm2(0);
    };

    function TablePaginationActionsForm2(props) {
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


    // Table Form 3

    const [pageForm3, setPageForm3] = useState(0);
    const [rowsPerPageForm3, setRowsPerPageForm3] = useState(5);
    const [orderForm3, setOrderForm3] = React.useState('asc');
    const [orderByForm3, setOrderByForm3] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน


    const headCellPDF = [
        { id: 'id', label: '#', width: '5%', align: "center" },
        { id: 'gmm_file_name', label: 'รายการ', width: '40%', align: "left" },
        { id: 'gmm_file_type', label: 'ประเภทเอกสาร', width: '15%', align: "left" },
        { id: 'gmm_file_display', label: 'display on mobile', width: '20%', align: "center" },
        { id: 'view', label: 'view', width: '10%', align: "center" },
        { id: 'edit', label: '', width: '5%', align: "center" },
        { id: 'delete', label: '', width: '5%', align: "center" },
    ];

    function EnhancedTableHeadForm3(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <StyledTableRow>

                    {headCellPDF.map((headCell) => (
                        <StyledTableCell
                            key={headCell.id}
                            width={headCell.width}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'default'}
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

    const handleRequestSortForm3 = (event, property) => {
        const isAsc = orderByForm3 === property && orderForm3 === 'asc';
        setOrderForm3(isAsc ? 'desc' : 'asc');
        setOrderByForm3(property);
    };

    const handleChangePageForm3 = (event, newPage) => {
        setPageForm3(newPage);
    };

    const handleChangeRowsPerPageForm3 = (event) => {
        setRowsPerPageForm3(parseInt(event.target.value, 10));
        setPageForm3(0);
    };

    function TablePaginationActionsForm3(props) {
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

    //-----------------------------------------------------------------------------
    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'object') {
            if (b[orderBy].id < a[orderBy].id) {
                return -1;
            }
            if (b[orderBy].id > a[orderBy].id) {
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
    //-----------------------------------------------------------------------------

    function ButtonSubmit({ classes, status }) {
        return (
            <>
                <Box className={classes.Submit}>
                    {Hidd === true ?
                        <>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={status}
                                onClick={() => { Clear() }}
                                className={classes.font_normal}
                                startIcon={<Refresh />}
                            >
                                ล้างข้อมูล
                            </Button>
                            &nbsp; &nbsp;
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={status}
                                className={classes.font_normal}
                                startIcon={<Edit />}
                            >
                                แก้ไขข้อมูล
                            </Button>
                        </>
                        :
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
                    }
                </Box>
            </>
        )
    }

    function ButtonSubmitPDF({ classes, status }) {
        return (
            <>
                <Box className={classes.Submit}>
                    {HiddPDF === true ?
                        <>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={status}
                                onClick={() => { ClearPDF() }}
                                className={classes.font_normal}
                                startIcon={<Refresh />}
                            >
                                ล้างข้อมูล
                            </Button>
                            &nbsp; &nbsp;
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={status}
                                className={classes.font_normal}
                                startIcon={<Edit />}
                            >
                                แก้ไขข้อมูล
                            </Button>
                        </>
                        :
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
                    }
                </Box>
            </>
        )
    }

    function ButtonUpload({ classes, status, unlock }) {
        return (
            <>
                <Box className={classes.Submit}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={(status === true) ? status : (unlock === true) ? true : false}
                        className={classes.font_normal}
                        startIcon={<CloudUpload />}
                        style={{
                            textTransform: 'none',
                        }}
                    >
                        Upload
                    </Button>
                </Box>
            </>
        )
    }

    const [filePDF, setFilePDF] = useState({ id: '', type: null, name: '', base64: '', preview: '', display: false });
    const [unlock, setUnlock] = useState(true);

    const group = [
        { id: 'PACKAGE', desc: 'แนะนำ Package' },
        { id: 'MANUAL', desc: 'คู่มือการใช้งาน' }]

    const handleuploadFile = (event, index) => {
        let file = event.target.files[0];
        if (file) {
            if (file.name.match(/.(pdf)$/i)) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        const char = file.name.split(".pdf");
                        setFilePDF({ ...filePDF, name: char[0], base64: reader.result, preview: reader.result })
                        setUnlock(false)
                    }
                };
                reader.readAsDataURL(file);
            }
        } else {
            document.getElementById("InputFile").value = "";
        }
    }

    const handleSelectType = (event, item) => {
        if (item) {
            setFilePDF({ ...filePDF, type: item })
        }
    }

    const [viewer, setViewer] = useState({ url_pdf: null, title: null })
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

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

    const handleOpenPDF = (row) => {
        setViewer({ ...viewer, url_pdf: row.pdf_url, title: row.gmm_file_name })
        setOpenPDF(true);
    }

    const handleClosePDF = () => {
        setOpenPDF(false);
        setPageNumber(1)
    }

    const [htmlText, setHTML] = useState('<p>Hello world</p><ul><li><strong>Bullet 1</strong></li><li><strong>Bullet 2</strong></li></ul><h2>H1 HEADER 1</h2><h3>H2 HEADER 2<br><br>&nbsp;</h3>')

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />

            {/* <div dangerouslySetInnerHTML={{ __html: htmlText }} /> */}

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
                    title="อัพโหลดไฟล์ PDF"
                    classes={{
                        title: classes.font_subheader,
                    }}
                />
                <Collapse in={expanded.one} timeout="auto" unmountOnExit>
                    <Divider />
                    <Box m={4} >
                        <Container maxWidth="xs" style={{ padding: '0px' }}>
                            <form onSubmit={SubmitUpload}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <Autocomplete
                                            classes={{
                                                input: classes.font_normal,
                                                option: classes.font_normal,
                                            }}
                                            options={group}
                                            getOptionLabel={(value) => value.desc}
                                            getOptionSelected={(option, value) =>
                                                option.id === value.id
                                            }
                                            value={filePDF.type}
                                            onChange={handleSelectType}
                                            renderOption={(option) => {
                                                return (
                                                    <>
                                                        {option.id === 'PACKAGE' && 'แนะนำ Package'}
                                                        {option.id === 'MANUAL' && 'คู่มือการใช้งาน'}
                                                    </>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                < TextField
                                                    {...params}
                                                    label="ประเภทเอกสาร"
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
                                    <Grid item xs={12} >
                                        <TextField

                                            label="ชื่อเอกสาร"
                                            margin="dense"
                                            variant="outlined"
                                            autoComplete="off"
                                            value={filePDF.name}
                                            onChange={(event) => {
                                                setFilePDF({ ...filePDF, name: event.target.value });
                                            }}
                                            inputProps={{ readOnly: unlock, maxLength: 80, className: classes.font_normal, }}
                                            InputProps={{
                                                className: classes.font_normal,
                                                endAdornment: (
                                                    <InputAdornment position="end" style={{ padding: '4px' }}>
                                                        <Button
                                                            component="label"
                                                            variant="contained"
                                                            color="primary"
                                                            disabled={promise}
                                                            className={classes.font_small}
                                                            style={{
                                                                textTransform: 'none',
                                                                padding: '5px'
                                                            }}
                                                            fullWidth
                                                            required
                                                        >
                                                            Choose File
                                                            <input
                                                                id="InputFile"
                                                                onChange={(e) => { handleuploadFile(e) }}
                                                                type="file"
                                                                accept=".pdf"
                                                                hidden
                                                            />
                                                        </Button>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            InputLabelProps={{
                                                className: classes.font_normal,
                                            }}
                                            fullWidth
                                            required
                                        />
                                        <FormHelperText className={classes.font_small}>* อัพโหลดได้เฉพาะ .pdf เท่านั้น</FormHelperText>
                                    </Grid>

                                    {HiddPDF ?
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={12} md={12} >
                                                <ButtonSubmitPDF classes={classes} status={promise} />
                                            </Grid>
                                        </Grid>
                                        :
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={12} md={12} >
                                                <ButtonUpload classes={classes} status={promise} unlock={unlock} />
                                            </Grid>
                                        </Grid>
                                    }





                                </Grid>
                            </form>
                        </Container>
                        <Box mt={3} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} >
                                <TableContainer component={Paper}>
                                    <Table aria-label="custom pagination table">
                                        <EnhancedTableHeadForm3
                                            classes={classes}
                                            order={orderForm3}
                                            orderBy={orderByForm3}
                                            onRequestSort={handleRequestSortForm3}
                                        />
                                        <TableBody>
                                            {(rowsPerPageForm3 > 0
                                                ? stableSort(filedocument, getComparator(orderForm3, orderByForm3)).slice(pageForm3 * rowsPerPageForm3, pageForm3 * rowsPerPageForm3 + rowsPerPageForm3)
                                                : stableSort(filedocument, getComparator(orderForm3, orderByForm3)))
                                                .map((row, index) => (
                                                    <StyledTableRow hover key={index}>
                                                        <StyledTableCell width='5%' align="center">
                                                            {index + 1}
                                                        </StyledTableCell>
                                                        <StyledTableCell width='40%' align="left" >
                                                            {row.gmm_file_name}
                                                        </StyledTableCell>
                                                        <StyledTableCell width='15%' align="left" >
                                                            {row.gmm_file_type === 'PACKAGE' && 'แนะนำ Package'}
                                                            {row.gmm_file_type === 'MANUAL' && 'คู่มือการใช้งาน'}
                                                        </StyledTableCell>
                                                        <StyledTableCell width='20%' align="center">
                                                            <Switch
                                                                disabled={promise}
                                                                checked={row.gmm_file_display}
                                                                onChange={(e) => { handleChangeSwitchPDF(e, row, index) }}
                                                                color="primary"
                                                            />
                                                        </StyledTableCell>
                                                        <StyledTableCell width='10%' align="center" >
                                                            <Button color="secondary" variant="outlined" size="small" onClick={() => { handleOpenPDF(row) }}>
                                                                pdf
                                                            </Button>
                                                        </StyledTableCell>
                                                        <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => { handleEditPDF(row) }} disabled={promise}>
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </StyledTableCell>
                                                        <StyledTableCell width='5%' align="center" >
                                                            <IconButton title="ลบข้อมูล" color='secondary'
                                                                onClick={() => { handleDeletePDF(row) }}
                                                                disabled={promise}>
                                                                <Close fontSize="small" />
                                                            </IconButton>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}

                                            {filedocument.length === 0 && (
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
                                                    count={filedocument.length}
                                                    rowsPerPage={rowsPerPageForm3}
                                                    page={pageForm3}
                                                    SelectProps={{
                                                        inputProps: { 'aria-label': 'rows per page' },
                                                        native: true,
                                                    }}
                                                    onChangePage={handleChangePageForm3}
                                                    onChangeRowsPerPage={handleChangeRowsPerPageForm3}
                                                    ActionsComponent={TablePaginationActionsForm3}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Box>
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
                    title="FAQ คำถามที่พบบ่อย"
                    classes={{
                        title: classes.font_subheader,
                    }}
                />
                <Collapse in={expanded.two} timeout="auto" unmountOnExit>
                    <form onSubmit={SubmitFAQ}>
                        <Divider />
                        <Box p={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <TextField
                                        label="หัวข้อ"
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
                                        value={FAQ.title}
                                        onChange={(event) => {
                                            setFAQ({ ...FAQ, title: event.target.value });
                                        }}
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
                                <Grid item xs={12} >
                                    <TextField
                                        multiline
                                        rows={3}
                                        label="คำอธิบาย"
                                        margin="dense"
                                        variant="outlined"
                                        autoComplete="off"
                                        value={FAQ.desc}
                                        onChange={(event) => {
                                            setFAQ({ ...FAQ, desc: event.target.value });
                                            setMsgCount(event.target.value.length);
                                        }}
                                        inputProps={{ maxLength: 500, className: classes.font_normal, }}
                                        InputProps={{
                                            className: classes.font_normal,
                                        }}
                                        InputLabelProps={{
                                            className: classes.font_normal,
                                        }}
                                        fullWidth
                                        required
                                    />
                                    <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 500</FormHelperText>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} >
                                    <ButtonSubmit classes={classes} status={promise} />
                                </Grid>
                            </Grid>
                            <Box mt={2} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} >
                                    <TableContainer component={Paper}>
                                        <Table aria-label="custom pagination table">
                                            <EnhancedTableHeadForm2
                                                classes={classes}
                                                order={orderForm2}
                                                orderBy={orderByForm2}
                                                onRequestSort={handleRequestSortForm2}
                                            />
                                            <TableBody>
                                                {(rowsPerPageForm2 > 0
                                                    ? stableSort(item, getComparator(orderForm2, orderByForm2)).slice(pageForm2 * rowsPerPageForm2, pageForm2 * rowsPerPageForm2 + rowsPerPageForm2)
                                                    : stableSort(item, getComparator(orderForm2, orderByForm2)))
                                                    .map((row, index) => (
                                                        <StyledTableRow hover key={index}>
                                                            <StyledTableCell width='5%' align="center">
                                                                {index + 1}
                                                            </StyledTableCell>
                                                            <StyledTableCell width='25%' align="left" >
                                                                {row.faq_title}
                                                            </StyledTableCell>
                                                            <StyledTableCell width='40%' align="left" >
                                                                {row.faq_desc}
                                                            </StyledTableCell>
                                                            <StyledTableCell width='20%' align="center">
                                                                <Switch
                                                                    disabled={promise}
                                                                    checked={row.faq_display}
                                                                    onChange={(e) => { handleChangeSwitch(e, row, index) }}
                                                                    color="primary"
                                                                />
                                                            </StyledTableCell>
                                                            <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                                                <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => { handleEdit(row) }} disabled={promise}>
                                                                    <Edit fontSize="small" />
                                                                </IconButton>
                                                            </StyledTableCell>
                                                            <StyledTableCell width='5%' align="center" >
                                                                <IconButton title="ลบข้อมูล" color='secondary' onClick={() => { handleDelete(row) }} disabled={promise}>
                                                                    <Close fontSize="small" />
                                                                </IconButton>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}

                                                {item.length === 0 && (
                                                    <StyledTableRow style={{ height: 25 }}>
                                                        <StyledTableCell colSpan={6} align="center">
                                                            ไม่พบข้อมูล
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                )}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                        colSpan={6}
                                                        count={item.length}
                                                        rowsPerPage={rowsPerPageForm2}
                                                        page={pageForm2}
                                                        SelectProps={{
                                                            inputProps: { 'aria-label': 'rows per page' },
                                                            native: true,
                                                        }}
                                                        onChangePage={handleChangePageForm2}
                                                        onChangeRowsPerPage={handleChangeRowsPerPageForm2}
                                                        ActionsComponent={TablePaginationActionsForm2}
                                                    />
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>

                        </Box>
                    </form>
                </Collapse>
            </Card>
            <Box mt={2} />


            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={openPdfviewer}
                onClose={handleClosePDF}
                TransitionComponent={Transition}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleClosePDF}>
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
        </>

    );
}

