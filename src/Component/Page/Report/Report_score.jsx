/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import {
    Backdrop, Box, Typography, Grid, IconButton, Button
    , Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, Avatar
} from "@material-ui/core";
import { KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import exportToExcel from '../../exportToExcel/Excel_code';
import config from '../../config';

const StyledTableCell = withStyles((theme) => ({
    head: {
        fontFamily: "Regular",
        backgroundColor: 'rgb(38 38 38 )',
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: 'rgb(38 38 38 )',
            color: theme.palette.common.white,
        },
    },
    body: {
        fontFamily: "Regular",
        fontSize: 14,
    },
}))(TableCell);


const StyledTableSortLabel = withStyles((theme) => ({
    root: {
        color: 'white',
        "&:hover": {
            color: 'white',
        },
        '&$active': {
            color: 'white',
        },
    },
    active: {},
    icon: {
        color: 'inherit !important'
    },
}))(TableSortLabel);


const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
            fontFamily: "Regular",
            fontSize: 14,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    MuiTableSortLabelRoot: {
        color: 'white'
    },
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
    },

    displayflexTable: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'space-between'
    },

    displayflexCenter: {
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

function Headers({ classes, status, func }) {
    return (
        <>
            <Box pt={0} pb={0}>
                <Box className={classes.displayflexTable}>
                    <Box className={classes.displayflex}>
                        <img src="/image/ranking.png" width="30" height="30" /> &nbsp;
                        <Typography className={classes.font_header}>Taxi/CG Ranking</Typography>
                    </Box>
                    <Box>
                        <Button
                            variant="contained"
                            disabled={status}
                            onClick={func}
                            className={classes.btnExport}
                        >
                            <img src="/image/Excel-icon1.png" width="24" height="24" />&nbsp;  Export To Excel

                        </Button>
                    </Box>
                </Box>
            </Box>
            <PageLine />
        </>
    );
}




export default function Report_score() {
    const url = config.API_URL + "models/Report/Report_score.php";
    const classes = useStyles();
    const { vision } = useParams();
    const [promise, setPromise] = useState(false)
    const [isLoading, setBoolean] = useState(false);
    const [Datauser, setDatauser] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const headCells = [
        { id: 'avatar', label: '', width: '10%', align: "left" },
        { id: 'gmm_emp_type', label: 'บริการ', width: '15%', align: "left" },
        { id: 'gmm_emp_fullname', label: 'ชื่อ - นามสกุล', width: '30%', align: "left" },
        { id: 'gmm_emp_point', label: 'Score', width: '25%', align: "center" },
    ];

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
            setDatauser(res.data)
            setBoolean(false);
        }
    }


    async function LoadData() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "LoadData",
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

    const SubmitExport = () => {
        LoadData();
    }

    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'object') {
            if (b[orderBy].gmm_emp_role_name < a[orderBy].gmm_emp_role_name) {
                return -1;
            }
            if (b[orderBy].gmm_emp_role_name > a[orderBy].gmm_emp_role_name) {
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
                            <StyledTableSortLabel
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
                            </StyledTableSortLabel>
                        </StyledTableCell>
                    ))}
                </StyledTableRow>
            </TableHead>
        );
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

                                        <StyledTableCell width='10%' align="center">
                                            {(row.gmm_emp_type === 'Taxi') ?
                                                <Avatar src="/image/taxiicon.png" style={{ background: '#FFCB08' }} >
                                                </Avatar> :
                                                <Avatar src="/image/cgicon.png" style={{ background: '#FFCB08' }} >
                                                </Avatar>
                                            }

                                        </StyledTableCell>
                                        <StyledTableCell width='15%' align="left">
                                            {row.gmm_emp_type}
                                        </StyledTableCell>
                                        <StyledTableCell width='30%' align="left">
                                            {row.gmm_emp_fullname}
                                        </StyledTableCell>
                                        <StyledTableCell width='25%' align="center">
                                            <b>{row.gmm_emp_point}</b>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                            {filtered.length === 0 && (
                                <StyledTableRow style={{ height: 25 }}>
                                    <StyledTableCell colSpan={5} align="center">
                                        ไม่พบข้อมูล
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={5}
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



    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} status={promise} func={SubmitExport} />

            <Grid container spacing={2}>
                <Grid item xs={12} >
                    <ViewTable filtered={Datauser} status={promise} />
                </Grid>
            </Grid>
        </>
    );
}