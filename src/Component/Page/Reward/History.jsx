/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, Snackbar
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Info, Check, Close, Code, GetApp, KeyboardArrowRight, KeyboardArrowLeft, Loop, LastPage, FirstPage, Search, Room, FileCopyOutlined, NavigateBefore, NavigateNext } from "@material-ui/icons";
import RedeemIcon from '@material-ui/icons/Redeem';
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import TagCanvas from "./canvasUtils";
import 'react-image-lightbox/style.css';
import config from '../../config'

const custom_overlay = {
    overlay: {
        zIndex: 9999,
    },
}

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    Refresh: {
        color: theme.palette.grey[500],
    },

    font_otp: {
        fontFamily: 'SemiBold',
        fontSize: '20px',
        textAlign: 'center',
    }
});

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

const MuiDialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
}))(DialogActions);

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    banner: {
        width: '50%',
        // height: '200px',
        padding: theme.spacing(2),
    },
    cursor: {
        cursor: 'pointer'
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
    responsive_image: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '75%',
    },
    responsive_box: {
        position: 'relative',
        maxWidth: '15%',
        marginRight: '12px',

    },
    showImage: {
        textAlign: 'center',
        borderBottom: 'solid 1px #e6e6e6',
        marginBottom: '16px'
    },
    responsive_slide: {
        position: 'relative',
        maxWidth: '100%',
        marginBottom: '6px'
    },
    responsive_image_slide: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
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

    font_end_normal: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: "end",
    },
    font_ct_normal: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: "center",
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
                    <RedeemIcon />
                    <Typography className={classes.font_header}>ประวัติการแลกของรางวัล</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

export default function History() {
    const url = config.API_URL + "models/Reward/Reward_redeem.php";
    const classes = useStyles();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const { vision, id } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [openAddress, setOpenAddress] = useState(false);
    const [openCode, setOpenCode] = useState(false);
    const [Refund, setRefund] = useState({ point: 0, desc: '' });

    const [Rows, setRow] = useState([]);
    const [openDetail, setDetail] = useState(false)

    //- varrible
    const [search, SetSearch] = useState('');
    const [datatable, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const headCells = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'image', label: 'รูปภาพ', width: '10%', align: "left" },
        { id: 'gmm_reward_item_coupon_name', label: 'รายการ', width: '30%', align: "left" },
        { id: 'gmm_reward_item_type', label: 'ประเภท', width: '15%', align: "center" },
        { id: 'gmm_user_temp_point', label: 'Point', width: '15%', align: "center" },
        { id: 'gmm_user_temp_status', label: 'สถานะ', width: '15%', align: "center" },
        { id: 'gmm_user_temp_create_date', label: 'วันที่แลก', width: '15%', align: "center" },
        { id: 'download', label: 'Download', width: '5%', align: "center" },
    ];

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {
        // setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_history",
            uid: id
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            setData(res.data);
            setBoolean(false);
        }
    }

    async function Refund_item() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Refund_item",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            uid: id,
            item: Rows,
            Refund: Refund
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "คืนคะแนนสำเร็จ",
                icon: "success",
            }).then((output) => {
                FirstLoad();
                setDetail(false);
                setBoolean(false);
            });
        } else {
            setBoolean(false);
            alert_message(res.message)
        }
    }

    const alert_message = (txt) => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: txt,
            icon: "warning",
        })
    }

    const [snackbars, setSnackbars] = React.useState({
        openToast: false,
        vertical: 'bottom',
        horizontal: 'right',
    });

    const { vertical, horizontal, openToast } = snackbars;
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = str => {
        const el = document.getElementById('refCopy');
        el.value = str;
        el.select();
        document.execCommand('copy');

        setCopySuccess('คัดลอกสำเร็จ')
        setOpenCode(false)
        setOpenAddress(false)
        setSnackbars({ ...snackbars, openToast: true })
    };

    const CloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbars({ ...snackbars, openToast: false })
    };

    const handleDownload = (row, index) => {
        if (row.gmm_reward_item_type === 'ECOUPON') {
            var canvas = document.getElementById(row.gmm_user_temp_desc02);
            var url = canvas.toDataURL("image/png");
            var link = document.createElement('a');
            link.download = 'e-coupon.png';
            link.href = url;
            link.click();
        } else {
            let url = row.image
            fetch(url)
                .then(resp => resp.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    // the filename you want
                    a.download = 'download_image.png';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(() => alert('error : security'));
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    //Detail

    const handlePreviewOpen = (row) => {
        setImages(row.image_slide)
        setSelectedImage(row.image)
        setRefund({ ...Refund, point: row.gmm_user_temp_point })
        setRow(row)
        setDetail(true)
    }

    const handlePreviewClose = () => {
        setDetail(false)
        setSelectedImageIndex(0)
        setRefund({ ...Refund, point: 0, desc: '' })
    }

    // Code

    const OpenCode = (row) => {
        setRow(row)
        setOpenCode(true)
        setSnackbars({ ...snackbars, openToast: false })
    }

    const CloseCode = () => {
        setOpenCode(false)
        setCopySuccess('')
    }

    // Address

    const OpenAddress = (row) => {
        setRow(row)
        setOpenAddress(true)
        setSnackbars({ ...snackbars, openToast: false })
    }

    const CloseAddress = () => {
        setOpenAddress(false)
        setCopySuccess('')
    }

    //- Refund

    const handleSmRefund = (event) => {
        event.preventDefault();
        //--------------------

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
                Refund_item()

            }
        })
    }


    //- Table
    const filtered = datatable.filter((row) => {
        return row.gmm_reward_item_coupon_name.toLowerCase().includes(search.toLowerCase())
    })

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


    //---------------------------------
    //---------------------------------
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const carouselItemsRef = useRef([]);
    const [images, setImages] = useState([]);

    const handleRightClick = () => {
        if (images && images.length > 0) {
            let newIdx = selectedImageIndex + 1;
            if (newIdx >= images.length) {
                newIdx = 0;
            }
            handleSelectedImageChange(newIdx);
        }
    };

    const handleLeftClick = () => {
        if (images && images.length > 0) {
            let newIdx = selectedImageIndex - 1;
            if (newIdx < 0) {
                newIdx = images.length - 1;
            }
            handleSelectedImageChange(newIdx);
        }
    };

    const handleSelectedImageChange = (newIdx) => {
        if (images && images.length > 0) {
            setSelectedImage(images[newIdx]);
            setSelectedImageIndex(newIdx);
            if (carouselItemsRef?.current[newIdx]) {
                carouselItemsRef?.current[newIdx]?.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
            }
        }
    };


    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />
            <Grid container spacing={2}>
                <Hidden only={['xs', 'sm']}>
                    <Grid item xs={8} sm={8} md={8} />
                </Hidden>
                <Grid item xs={12} sm={12} md={4} >
                    <TextField
                        margin="dense"
                        variant="outlined"
                        placeholder="ค้นหารายการ..."
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
                <Grid item xs={12}>


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
                                        <StyledTableRow hover key={index} >
                                            <StyledTableCell width='10%' align="center" className={classes.cursor} onClick={() => { handlePreviewOpen(row) }}>
                                                {index + 1}
                                            </StyledTableCell>
                                            <StyledTableCell width='10%' align="left" className={classes.cursor} onClick={() => { handlePreviewOpen(row) }}>
                                                {(row.gmm_reward_item_type === 'ECOUPON') ?
                                                    <TagCanvas message={row} ></TagCanvas>
                                                    :
                                                    <img src={row.image} alt="GoMamma" className={classes.responsive_image} ></img>
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell width='30%' align="left" className={classes.cursor} onClick={() => { handlePreviewOpen(row) }}>
                                                {row.gmm_reward_item_coupon_name}
                                            </StyledTableCell>

                                            <StyledTableCell width='15%' align="center" className={classes.cursor} onClick={() => { handlePreviewOpen(row) }} >
                                                {(row.gmm_reward_item_type === 'PRODUCT') && 'สินค้า'}
                                                {(row.gmm_reward_item_type === 'COUPON') && 'คูปอง'}
                                                {(row.gmm_reward_item_type === 'ECOUPON') && 'E-Coupon'}
                                            </StyledTableCell>
                                            <StyledTableCell width='15%' align="center" className={classes.cursor} onClick={() => { handlePreviewOpen(row) }}>
                                                {row.gmm_user_temp_point.toLocaleString("en-US")}
                                            </StyledTableCell>
                                            <StyledTableCell width='15%' align="center">
                                                {((row.gmm_user_temp_status === 'PENDING' && row.gmm_reward_item_type === 'PRODUCT') || (row.gmm_user_temp_status === 'PENDING' && row.gmm_reward_item_type === 'COUPON')) &&
                                                    <Box style={{ color: 'rgb(63, 81, 181)', display: 'flex', justifyContent: 'center' }}>
                                                        <Info fontSize="small" /> &nbsp;
                                                        รอจัดส่ง
                                                    </Box>
                                                }
                                                {((row.gmm_user_temp_status === 'COMPLETE' && row.gmm_reward_item_type === 'PRODUCT') || (row.gmm_user_temp_status === 'COMPLETE' && row.gmm_reward_item_type === 'COUPON')) &&
                                                    <Box style={{ color: 'rgb(33, 124, 37)', display: 'flex', justifyContent: 'center' }}>
                                                        <Check fontSize="small" /> &nbsp;
                                                        จัดส่งแล้ว
                                                    </Box>
                                                }
                                                {(row.gmm_user_temp_status === 'COMPLETE' && row.gmm_reward_item_type === 'ECOUPON') &&
                                                    <Box style={{ color: 'rgb(33, 124, 37)', display: 'flex', justifyContent: 'center' }}>
                                                        <Check fontSize="small" /> &nbsp;
                                                        แลกสำเร็จ
                                                    </Box>
                                                }




                                                {/* {(row.gmm_reward_item_type === 'PRODUCT') && <IconButton title="Address" color='primary' onClick={() => { OpenAddress(row) }} disabled={promise}>
                                                    <Room fontSize="small" />
                                                </IconButton>}
                                                {(row.gmm_reward_item_type !== 'PRODUCT') && <IconButton title="Code" color='primary' disabled={row.gmm_reward_item_type === 'COUPON' || promise === true} onClick={() => { OpenCode(row) }}>
                                                    <Code fontSize="small" />
                                                </IconButton>} */}
                                            </StyledTableCell>
                                            <StyledTableCell width='15%' align="center">
                                                {row.gmm_user_temp_create_date}
                                            </StyledTableCell>

                                            <StyledTableCell width='5%' align="center">
                                                <IconButton title="Download" color='primary' onClick={() => { handleDownload(row) }} disabled={promise}>
                                                    <GetApp fontSize="small" />
                                                </IconButton>
                                            </StyledTableCell>

                                        </StyledTableRow>
                                    ))}

                                {filtered.length === 0 && (
                                    <StyledTableRow style={{ height: 25 }}>
                                        <StyledTableCell colSpan={8} align="center">
                                            ไม่พบข้อมูล
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={8}
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
                </Grid>
            </Grid>

            {/* Detail */}
            <Dialog
                onClose={handlePreviewClose}
                fullWidth={true}
                maxWidth="sm"
                aria-labelledby="customized-dialog-title"
                open={openDetail}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handlePreviewClose}>
                    รายละเอียด
                </MuiDialogTitle>
                <MuiDialogContent dividers>

                    <form id="hook" onSubmit={handleSmRefund}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {Rows.gmm_reward_item_type === 'PRODUCT' &&
                                    <>
                                        <Box className={classes.showImage}>
                                            <img src={selectedImage} className={classes.banner}></img>
                                        </Box>

                                        <Box className={classes.responsive_slide}>
                                            <div className="carousel">
                                                <div className="carousel__images">

                                                    {images &&
                                                        images.map((image, idx) => (
                                                            <Box key={idx}
                                                                onClick={() => handleSelectedImageChange(idx)}
                                                                style={{ backgroundImage: `url(${image})` }}
                                                                className={`carousel__image ${selectedImageIndex === idx && "carousel__image-selected"
                                                                    }`}
                                                                ref={(el) => (carouselItemsRef.current[idx] = el)}
                                                            />
                                                        ))}
                                                </div>
                                                <IconButton
                                                    size="small"
                                                    onClick={handleLeftClick}
                                                    style={{ position: 'absolute', left: '10px', background: 'rgb(0,0,0,0.2)' }}
                                                    className="carousel__button carousel__button-left"
                                                >
                                                    <NavigateBefore style={{ color: 'white' }} />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    onClick={handleRightClick}
                                                    style={{ position: 'absolute', right: '10px', background: 'rgb(0,0,0,0.2)' }}
                                                    className="carousel__button carousel__button-right"
                                                >
                                                    <NavigateNext style={{ color: 'white' }} />
                                                </IconButton>

                                            </div>
                                        </Box>
                                        <br />
                                    </>

                                }
                                {Rows.gmm_reward_item_type === 'COUPON' && <Box style={{ textAlign: 'center' }}>
                                    <img src={Rows.image} alt="GoMamma" className={classes.responsive_image} ></img>
                                </Box>}
                                {Rows.gmm_reward_item_type === 'ECOUPON' && <TagCanvas message={Rows} ></TagCanvas>}
                                <Box mt={1} />
                                <Alert severity="info">
                                    <Typography className={classes.font_normal}>
                                        <b>คำอธิบาย :</b>
                                        {Rows.gmm_reward_item_type === 'PRODUCT' && ' สินค้า '}
                                        {Rows.gmm_reward_item_type === 'COUPON' && ' คูปอง '}
                                        {Rows.gmm_reward_item_type === 'ECOUPON' && ' E-Coupon '}
                                        รายการนี้มีมูลค่า <strong>{(Rows.length !== 0) && Rows.gmm_user_temp_point}</strong> คะแนน

                                        {/* toLocaleString("en-US") */}
                                    </Typography>
                                    <Typography className={classes.font_normal}>หากท่านต้องการคืนคะแนนให้กับลูกค้า กดปุ่ม "คืนคะแนน" พร้อมระบุรายละเอียด</Typography>
                                </Alert>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="desc"
                                    placeholder="รายละเอียดเพิ่มเติม"
                                    variant="outlined"
                                    rows={2}
                                    value={Refund.desc}
                                    onChange={(event) => { setRefund({ ...Refund, desc: event.target.value }) }}
                                    InputProps={{
                                        className: classes.font_normal,
                                    }}
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                    }}
                                    multiline
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                    </form>
                </MuiDialogContent>
                <MuiDialogActions>
                    <Button
                        form="hook"
                        type="submit"
                        className={classes.font_normal}
                        variant="contained"
                        color="primary"
                        disabled={promise}
                        startIcon={<Loop fontSize="small" />}
                        style={{ textTransform: 'none' }}
                        fullWidth
                    >
                        คืนคะแนน
                    </Button>
                </MuiDialogActions>
            </Dialog>

            {/* Code */}
            <Dialog
                onClose={CloseCode}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openCode}>
                <MuiDialogTitle id="customized-dialog-title" onClose={CloseCode}>
                    Code
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="รหัสคูปอง"
                                id="refCopy"
                                variant="outlined"
                                margin="dense"
                                value={Rows.gmm_user_temp_desc02}
                                inputProps={{ className: classes.font_ct_normal, }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => { copyToClipboard(Rows.gmm_user_temp_desc02) }}>
                                                <FileCopyOutlined fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{
                                    className: classes.font_normal,
                                    shrink: true
                                }}
                                required
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </MuiDialogContent>
            </Dialog>

            {/* Adress */}
            <Dialog
                onClose={CloseAddress}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={openAddress}>
                <MuiDialogTitle id="customized-dialog-title" onClose={CloseAddress}>
                    ที่อยู่
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="ที่อยู่จัดส่ง"
                                id="refCopy"
                                variant="outlined"
                                margin="dense"
                                value={Rows.gmm_user_temp_desc03}
                                inputProps={{ className: classes.font_ct_normal, }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => { copyToClipboard(Rows.gmm_user_temp_desc03) }}>
                                                <FileCopyOutlined fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{
                                    className: classes.font_normal,
                                    shrink: true
                                }}
                                required
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </MuiDialogContent>
            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={openToast}
                autoHideDuration={2500}
                onClose={CloseToast}
                key={vertical + horizontal}
            >
                <Alert severity="success" className={classes.font_normal}>
                    {copySuccess}
                </Alert>
            </Snackbar>



        </>
    );
}
