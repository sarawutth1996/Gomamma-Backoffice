/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, Chip, Checkbox, TextField, Typography, Grid, IconButton,
    Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Add, Close, Directions, Edit, CheckBoxOutlineBlank, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Save, Refresh, BugReportTwoTone } from "@material-ui/icons";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
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
        fontSize: '12px'
    },
    font_Tablechip: {
        margin: '3px',
    },


    font_normal: {
        fontFamily: 'Regular',
        fontSize: '14px'
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
                    <Directions />
                    <Typography className={classes.font_header}>กำหนดโซน</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

export default function SettingZone() {
    const url = config.API_URL + "models/Employee/Employee_zone.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const state = useHistory();
    const classes = useStyles();
    const { vision, id } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [promise, setPromise] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');
    const headCells = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'prov', label: 'จังหวัด', width: '20%', align: "left" },
        { id: 'aump', label: 'เขต/อำเภอ', width: '20%', align: "left" },
        { id: 'tumb', label: 'แขวง/ตำบล', width: '40%', align: "left" },
        { id: 'edit', label: '', width: '5%', align: "center" },
        { id: 'delete', label: '', width: '5%', align: "center" },
    ];

    const [nbr, setNBR] = useState({ id: '' })
    const [Zone, setZone] = useState({ label: '' })
    const [Prov, setProv] = useState(null);
    const [Aump, setAump] = useState(null);
    const [Tumb, setTumb] = useState([]);

    const [Item, setItem] = useState([]);
    const [Hidd, setHidd] = useState(false);
    const [incl, setInclude] = useState([]);
    const [EditID, setID] = useState({ aumpID: 0, index: 0 });
    //---------------------------------------------------
    const [Provmstr, setProvmstr] = useState([]);
    const [Aumpmstr, setAumpmstr] = useState([]);
    const [Tumbmstr, setTumbmstr] = useState([]);


    const icon = <CheckBoxOutlineBlank fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
            if (res.datatable.length !== 0) {
                setNBR({ ...nbr, id: res.name.gmm_zone_id })
                setInclude(res.incl);
                setItem(res.datatable)
                setZone({ ...Zone, label: res.name.gmm_zone_name })
            }
            setProvmstr(res.prov)
            setBoolean(false);
        }
    }

    async function Load_aump(code) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_aump",
            id: code
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setAumpmstr(res.aump)
        }
    }

    async function Load_tumb(code) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "Load_tumb",
            id: code
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setTumbmstr(res.tumb)
            setTumb(res.tumb)
        }
    }

    async function SaveData() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_zone",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            nbr: nbr.id,
            label: Zone.label,
            group: Item,
            id: id,
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
                state.push('/Home/ManageZone/' + vision);
            })
        }
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    function reset() {
        setID({ ...EditID, aumpID: 0, index: 0 })
        setHidd(false)
        setProv(null)
        setAump(null)
        setTumb([])
        //---------
        setAumpmstr([])
        setTumbmstr([])
    }

    const handleProv = (event, item) => {
        if (item) {
            setProv(item)
            setAump(null)
            setTumb([])
            //...
            Load_aump(item.pro_province_code);
        } else {
            setAump(null)
            setTumb([])
        }
    }

    const handleAump = (event, item) => {
        if (item) {
            setAump(item)
            setTumb([])
            //...
            Load_tumb(item.pro_aumphur_code);

        } else {
            setTumb([])
        }
    }

    const handleItemArray = (event, item) => {
        setTumb(item)
    }

    const handleEdit = (row, index) => {
        setAumpmstr(row.aumpMSTR)
        setTumbmstr(row.tumbMSTR)
        //-----------------------
        setProv(row.prov)
        setAump(row.aump)
        setTumb(row.tumb)
        setHidd(true)
        setID({ ...EditID, aumpID: row.aump.pro_aumphur_code, index: index })
    }

    const handleDelete = (row, index) => {
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
                Swal.fire({
                    title: "เรียบร้อย",
                    text: "ลบข้อมูลสำเร็จ",
                    icon: "success",
                }).then((output) => {
                    let delete_objs = [...Item]
                    let delete_incl = [...incl]
                    delete_objs.splice(index, 1);
                    delete_incl.splice(index, 1);
                    setItem(delete_objs);
                    setInclude(delete_incl);
                    reset();
                });
            }
        });
    }

    const handleAdd = (event) => {
        event.preventDefault();
        const array = { prov: Prov, aump: Aump, tumb: Tumb, aumpMSTR: Aumpmstr, tumbMSTR: Tumbmstr }
        //---------------------------------------------------------------
        if (!Hidd) {
            if (incl.length !== 0) {
                if (!incl.includes(Aump.pro_aumphur_code)) {
                    setItem([...Item, array])
                    setInclude([...incl, Aump.pro_aumphur_code])
                    reset();
                } else {
                    Swal.fire({
                        title: "ข้อมูลซ้ำ",
                        text: "กรุณาตรวจสอบ และลองใหม่อีกครั้ง",
                        icon: "warning",
                    })
                }
            } else {
                setItem([...Item, array])
                setInclude([...incl, Aump.pro_aumphur_code])
                reset();
            }
        } else {
            if (EditID.aumpID === Aump.pro_aumphur_code) {
                let newArr = [...Item];
                newArr[EditID.index] = array
                setItem(newArr)
                reset();
            } else {
                if (!incl.includes(Aump.id)) {
                    let newObj = [...Item];
                    let newInc = [...incl];
                    newObj[EditID.index] = array
                    newInc[EditID.index] = Aump.pro_aumphur_code
                    setItem(newObj)
                    setInclude(newInc)
                    reset();
                } else {
                    Swal.fire({
                        title: "ข้อมูลซ้ำ",
                        text: "กรุณาตรวจสอบ และลองใหม่อีกครั้ง",
                        icon: "warning",
                    })
                }
            }
        }
    }

    const handleSubmit = (event) => {
        if (Item.length !== 0) {
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
                title: "แจ้งเตือน",
                text: "กรุณากรอกข้อมูล และลองใหม่อีกครั้ง",
                icon: "warning",
            })
        }
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

    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'object') {
            if (b[orderBy].pro_province_code < a[orderBy].pro_province_code) {
                return -1;
            }
            if (b[orderBy].pro_aumphur_code < a[orderBy].pro_aumphur_code) {
                return -1;
            }
            //----------
            if (b[orderBy].pro_province_code > a[orderBy].pro_province_code) {
                return 1;
            }

            if (b[orderBy].pro_aumphur_code > a[orderBy].pro_aumphur_code) {
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
                                disabled={headCell.id === 'tumb'}
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
                                        <StyledTableCell width='10%' align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.prov.pro_province_desc}
                                        </StyledTableCell>
                                        <StyledTableCell width='20%' align="left">
                                            {row.aump.pro_aumphur_desc}
                                        </StyledTableCell>
                                        <StyledTableCell width='40%' align="left">
                                            {row.tumb.map((list, index) => {
                                                return (
                                                    <Chip key={index}
                                                        className={classes.font_Tablechip}
                                                        classes={{ label: classes.font_chip }}
                                                        label={list.pro_tumbol_desc}

                                                    />
                                                )
                                            })}
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => handleEdit(row, index)} disabled={status}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell width='5%' align="center">
                                            <IconButton title="ลบข้อมูล" color='secondary' onClick={() => handleDelete(row, index)} disabled={status}>
                                                <Close fontSize="small" />
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

    function Addzone({ classes, status }) {
        return (
            <>
                <Box className={classes.Submit}>
                    {Hidd === true ?
                        <>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={status}
                                onClick={() => { reset() }}
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
                            startIcon={<Add />}
                        >
                            เพิ่มรายการ
                        </Button>
                    }
                </Box>
            </>
        )
    }

    function ButtonSubmit({ classes, status }) {
        return (
            <>
                <Box mt={1} className={classes.Submit}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={status}
                        className={classes.font_normal}
                        onClick={handleSubmit}
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
            <form onSubmit={handleAdd}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            variant="outlined"
                            label="ชื่อโซน"
                            autoComplete="off"
                            value={Zone.label}
                            onChange={(event) => { setZone({ ...Zone, label: event.target.value }) }}
                            inputProps={{ maxLength: 80, className: classes.font_normal, }}
                            InputProps={{
                                className: classes.font_normal,
                            }}
                            InputLabelProps={{
                                className: classes.font_normal,
                            }}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Autocomplete
                            classes={{
                                input: classes.font_normal,
                                option: classes.font_normal,
                            }}
                            options={Provmstr}
                            getOptionLabel={(value) => value.pro_province_desc}
                            getOptionSelected={(option, value) =>
                                option.pro_province_code === value.pro_province_code
                            }
                            value={Prov}
                            onChange={handleProv}
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
                    <Grid item xs={12} sm={12} md={12}>
                        <Autocomplete
                            classes={{
                                input: classes.font_normal,
                                option: classes.font_normal,
                            }}
                            options={Aumpmstr}
                            getOptionLabel={(value) => value.pro_aumphur_desc}
                            getOptionSelected={(option, value) =>
                                option.pro_aumphur_code === value.pro_aumphur_code
                            }
                            value={Aump}
                            onChange={handleAump}
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
                    <Grid item xs={12} sm={12} md={12}>
                        <Autocomplete
                            multiple
                            limitTags={4}
                            options={Tumbmstr}
                            disableCloseOnSelect
                            classes={{
                                input: classes.font_normal,
                                option: classes.font_normal,
                            }}
                            value={Tumb}
                            onChange={handleItemArray}
                            getOptionLabel={(option) => option.pro_tumbol_desc}
                            getOptionSelected={(option, value) =>
                                option.pro_tumbol_code === value.pro_tumbol_code
                            }
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        classes={{ label: classes.font_chip }}
                                        label={option.pro_tumbol_desc}
                                        size="small"
                                        {...getTagProps({ index })} />
                                ))}
                            renderOption={(option, { selected }) => (
                                <>
                                    <Checkbox
                                        icon={icon}
                                        color="primary"
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}

                                    />
                                    <Typography className={classes.font_normal}>{option.pro_tumbol_desc}</Typography>
                                </>
                            )}
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="แขวง/ตำบล"
                                    variant="outlined"
                                    margin="dense"
                                    InputLabelProps={{ className: classes.font_normal }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <Addzone classes={classes} status={promise} />
                    </Grid>
                    <Grid item xs={12} >
                        <ViewTable filtered={Item} status={promise} />
                    </Grid>
                    <Grid item xs={12} >
                        <ButtonSubmit classes={classes} status={promise} />
                    </Grid>
                </Grid>
            </form>
        </>
    );
}




