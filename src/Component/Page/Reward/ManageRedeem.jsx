/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Badge, Backdrop, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, FormHelperText
} from "@material-ui/core";
import { Mail, Close, Person, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Save, Search, Loop, Refresh } from "@material-ui/icons";
import RedeemIcon from '@material-ui/icons/Redeem';
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import config from '../../config'

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
    Submit: {
        textAlign: "center",
    },
    displayflex: {
        display: "flex",
        alignItems: "center",
    },
    displayflexHead: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
    font_header: {
        fontFamily: 'SemiBold',
        margin: '10px',
        fontSize: '18px'
    },
    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
    },

    font_ct_normal: {
        fontFamily: 'Regular',
        fontSize: '14px',
        textAlign: "end",
    },
    font_small: {
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
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

function Headers({ classes, status, count, func }) {
    return (
        <>
            <Box className={classes.displayflexHead}>
                <Box className={classes.displayflexHead}>
                    <Person />
                    <Typography className={classes.font_header}>รายชื่อสมาชิก</Typography>
                </Box>

                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        form="selectuser"
                        type="submit"
                        onClick={func}
                        disabled={status}
                        className={classes.font_normal}
                        size="large"
                    >
                        <Badge color="secondary" badgeContent={count} showZero={false}>
                            <Mail fontSize="small" />
                        </Badge> &nbsp; รายการที่ต้องจัดส่ง

                    </Button>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

export default function ManageRedeem() {
    const url = config.API_URL + "models/Reward/Reward_redeem.php";
    const classes = useStyles();
    const state = useHistory();
    const { vision } = useParams();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false)
    const [open, setOpen] = useState(false);
    const [Refund, setRefund] = useState({ point: '', desc: '' });
    const [RPoint, setRPoint] = useState({ index: 0, data: '' });
    const [msgCount, setMsgCount] = useState(0);
    const [MailBadge, setBadge] = useState(0);
    //- varrible
    const [search, SetSearch] = useState('');
    const [datatable, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const headCells = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'name', label: 'ชื่อ - นามสกุล', width: '60%', align: "left" },
        { id: 'point', label: 'Point', width: '20%', align: "center" },
        { id: 'refund', label: 'Refund', width: '5%', align: "center" },
        { id: 'redeem', label: 'Redeem', width: '5%', align: "center" },
    ];


    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function FirstLoad() {
        setBoolean(true);
        //------------------------------
        const payload = JSON.stringify({
            key: "Payload_datatable",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            setBadge(res.count)
            setData(res.data);
            setBoolean(false);
        }
    }

    async function Refund_point() {
        // setBoolean(true);
        //------------------------------
        const payload = JSON.stringify({
            key: "Refund_point",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            uid: RPoint.data.gmm_user_id,
            item: Refund
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(0);
        const res = await response.json();
        if (res.status) {
            setOpen(false)
            setBoolean(false);
            Swal.fire({
                title: "เรียบร้อย",
                text: "คืนคะแนนสำเร็จ",
                icon: "success",
            }).then((output) => {
                if (output.isConfirmed) {
                    FirstLoad();
                    handleCloseRefund();
                }
            });

        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleRedeem = (row) => {
        state.push('/Home/Redeem/' + vision + '/' + row.gmm_user_id);
    }

    const handleOpenRefund = (row, index) => {
        setRPoint({ ...RPoint, index: index, data: row })
        setOpen(true)
    }

    const handleCloseRefund = () => {
        handleRefresh();
    }

    const handleRefresh = () => {
        setRefund({ ...Refund, point: '', desc: '' })
        setMsgCount(0)
        setOpen(false)
    }

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
                Refund_point();
            }
        })


    }

    const handleShipping = () => {
        state.push('/Home/Shipping/' + vision);
    }

    //- Table
    const filtered = datatable.filter((row) => {
        return row.gmm_user_fullname.toLowerCase().includes(search.toLowerCase())
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

    function ViewTable({ filtered }) {
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
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='70%' align="left">
                                            {row.gmm_user_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="center">
                                            {row.gmm_user_point.toLocaleString("en-US")}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            <IconButton title="Refund" color='primary' onClick={() => { handleOpenRefund(row, index) }} disabled={promise}>
                                                <Loop fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            <IconButton title="Redeem" color='primary' onClick={() => { handleRedeem(row) }} disabled={promise}>
                                                <RedeemIcon fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
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

    const keyValue = (value) => {
        if (value !== '00' && value !== '01' && value !== '02' && value !== '03' && value !== '04' && value !== '05' &&
            value !== '06' && value !== '07' && value !== '08' && value !== '09') {
            return true
        } else {
            return false
        }
    }

    const formatInput = (e) => {
        // Prevent characters that are not numbers ("e", ".", "+" & "-") ✨
        let checkIfNum;
        if (e.key !== undefined) {
            // Check if it's a "e", ".", "+" or "-"
            checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
        }
        else if (e.keyCode !== undefined) {
            // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
            checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
        }
        return checkIfNum && e.preventDefault();
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} status={promise} count={MailBadge} func={handleShipping} />
            <Grid container spacing={2}>
                <Hidden only={['xs', 'sm']}>
                    <Grid item xs={8} sm={8} md={8} />
                </Hidden>
                <Grid item xs={12} sm={12} md={4} >
                    <TextField
                        margin="dense"
                        variant="outlined"
                        placeholder="ค้นหารายชื่อ..."
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
                    <ViewTable filtered={filtered} />
                </Grid>
            </Grid>
            <Dialog
                onClose={handleCloseRefund}
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={open}>
                <MuiDialogTitle id="customized-dialog-title" onClose={handleCloseRefund}>
                    Refund
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                    <form id="hook" onSubmit={handleSmRefund}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="จำนวนคะแนนที่ต้องการคืน"
                                    margin="dense"
                                    variant="outlined"
                                    type="number"
                                    value={Refund.point}
                                    onChange={(e) => { (keyValue(e.target.value)) && setRefund({ ...Refund, point: e.target.value }); }}
                                    onKeyDown={(e) => { formatInput(e) }}
                                    inputProps={{
                                        className: classes.font_normal,
                                        min: "0"
                                    }} // the change is here
                                    InputLabelProps={{
                                        className: classes.font_normal,
                                        shrink: true
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="desc"
                                    placeholder="รายละเอียดเพิ่มเติม"
                                    variant="outlined"
                                    rows={2}
                                    value={Refund.desc}
                                    onChange={(event) => {
                                        setRefund({ ...Refund, desc: event.target.value })
                                        setMsgCount(event.target.value.length);
                                    }}

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
                                <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                            </Grid>
                        </Grid>
                    </form>
                </MuiDialogContent>
                <MuiDialogActions>
                    <Button
                        className={classes.font_normal}
                        onClick={handleRefresh}
                        variant="outlined"
                        color="primary"
                        startIcon={<Refresh />}>
                        ล้างข้อมูล
                    </Button>
                    <Button
                        form="hook"
                        type="submit"
                        className={classes.font_normal}
                        variant="contained"
                        color="primary">
                        บันทึก
                    </Button>
                </MuiDialogActions>
            </Dialog>
        </>
    );
}
