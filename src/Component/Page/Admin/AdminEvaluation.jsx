/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import {
    Backdrop, Button, Box, Card, CardContent, FormControl, FormLabel, FormControlLabel, TextField, Typography, Grid, Paper, IconButton, Switch,
    Table, TableBody, TableCell, TableContainer, TableRow, TableHead, TableSortLabel, TableFooter, TablePagination, Radio, RadioGroup
} from "@material-ui/core";
import { Close, FormatListNumbered, Save, StarHalf, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Edit } from "@material-ui/icons";
//--------------------------------------------------------------------------------------------
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
import config from '../../config';

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
                    <FormatListNumbered />
                    <Typography className={classes.font_header}>กำหนดแบบประเมิน</Typography>
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
                    <StarHalf fontSize="small" />
                    <Typography className={classes.font_subheader}>&nbsp;เลือกประเภทการให้คะแนน</Typography>
                </Box>
                <PageLine />
            </Box>

        </>
    );
}

const value = {
    id: '',
    subject: '',
    choice: '',
    display: false,
    require: false
}

export default function AdminEvaluation() {
    const url = config.API_URL + "models/Admin/Admin_rating.php";
    const classes = useStyles();
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const { vision } = useParams();
    const [isLoading, setBoolean] = useState(false);
    const [datatable, setData] = useState([]);
    const [Form, setForm] = useState(value);
    const [Hidd, setHidd] = useState(false);
    const [noneEdit, setNoneEdit] = useState(false);
    const [promise, setPromise] = useState(false)
    const [choices, setChoice] = useState([]);
    const [group, setGroup] = useState([
        { id: 'GTX', desc: 'Taxi' },
        { id: 'GCG', desc: 'Caregiver' },
        { id: 'GCM', desc: 'Customer' },
    ]);
    const [service, setService] = useState([
        { id: 'S001', desc: 'Taxi' },
        { id: 'S002', desc: 'Caregiver' },
        { id: 'S003', desc: '(Taxi / Caregiver)' },
    ]);
    const [assessor, setAssessor] = useState({ item: null });
    const [subgroup, setSubgroup] = useState({ item: null });
    //------------
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน
    const headCells = [
        { id: 'id', label: '#', width: '10%', align: "center" },
        { id: 'gmm_rating_name', label: 'หัวข้อการประเมิน', width: '40%', align: "left" },
        { id: 'gmm_rating_type', label: 'ประเภท', width: '10%', align: "left" },
        { id: 'gmm_rating_display', label: 'display on mobile', width: '20%', align: "center" },
        { id: 'gmm_rating_require', label: 'require', width: '10%', align: "center" },
        { id: 'edit', label: '', width: '5%', align: "center" },
        { id: 'delete', label: '', width: '5%', align: "center" },
    ];

    useEffect(() => {
        FirstLoad();
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

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


            clear();
            setChoice(res.choice1)
            setBoolean(false);
        }
    }

    async function SecondaryLoad() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Payload_datatable",
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            setBoolean(false);
            setChoice(res.choice2)
            setData([]);
            clear_nonesubgroup();

        }
    }

    async function SelectGroup(item, subgroup) {
        if (item.id !== 'GCM') {
            FirstLoad();
            setBoolean(true);
            //--------------------------------
            const payload = JSON.stringify({
                key: "SelectGroup",
                group: item.id
            });

            const response = await fetch(url, { method: "POST", body: payload });
            await sleep(350);
            const res = await response.json();
            if (res.status) {
                if (res.data.length !== 0) {
                    setData(res.data);
                } else {
                    setData([]);
                }

                clear();
                setBoolean(false);
            }
        } else if (subgroup !== undefined) {
            setBoolean(true);
            //--------------------------------
            const payload = JSON.stringify({
                key: "SelectSubgroup",
                group: item.id,
                subgroup: subgroup.id
            });

            const response = await fetch(url, { method: "POST", body: payload });
            await sleep(350);
            const res = await response.json();
            if (res.status) {
                if (res.data.length !== 0) {
                    setData(res.data);
                } else {
                    setData([]);
                }

                clear_nonesubgroup();
                setBoolean(false);
            }

        } else if (item.id === 'GCM' && subgroup === undefined) {
            SecondaryLoad()
        }
    }

    async function SaveData() {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Create_master",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: Form,
            group: assessor.item,
            subgroup: (assessor.item.id === 'GCM') ? subgroup.item : null,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) {
            Swal.fire({
                title: "เรียบร้อย",
                text: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
            }).then(() => {
                if (subgroup.item === null) {
                    SelectGroup(assessor.item);
                } else {
                    SelectGroup(assessor.item, subgroup.item);
                }

            })

            setBoolean(false);
        }
    }

    async function ChangeDisplay(item, group) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeDisplay",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: item,
            group: group
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) { }
    }

    async function ChangeDisplaySubgroup(item, group, subgroup) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeDisplaySubgroup",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: item,
            group: group,
            subgroup: subgroup
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) { }
    }

    async function ChangeRequire(item, group) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeRequire",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: item,
            group: group
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) { }
    }

    async function ChangeRequireSubgroup(item, group, subgroup) {
        //--------------------------------
        const payload = JSON.stringify({
            key: "ChangeRequireSubgroup",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: item,
            group: group,
            subgroup: subgroup
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();
        if (res.status) { }
    }

    async function delete_rating(id, group) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Delete_rating",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: id,
            group: group
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
                SelectGroup(assessor.item);
            })

        } else {
            setBoolean(false);
            alert_message('ข้อมูลถูกใช้อยู่ในระบบ');
        }
    }

    async function delete_ratingSubgroups(id, group, subgroup) {
        setBoolean(true);
        //--------------------------------
        const payload = JSON.stringify({
            key: "Delete_ratingSubgroup",
            edit_id: user.id != "" ? user.id : getLocalStorage().id,
            item: id,
            group: group,
            subgroup: subgroup
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
                SelectGroup(assessor.item, subgroup.item);
            })

        } else {
            setBoolean(false);
            alert_message('ข้อมูลถูกใช้อยู่ในระบบ');
        }
    }

    const alert_message = (txt) => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: txt,
            icon: "warning",
        })
    }

    const clear = () => {
        setSubgroup({ ...subgroup, item: null })
        setNoneEdit(false);
        setHidd(false)
        setForm(value)
    }

    const clear_nonesubgroup = () => {
        setNoneEdit(false);
        setHidd(false)
        setForm(value)
    }

    const getLocalStorage = () => {
        return JSON.parse(localStorage.cnf_us);
    };

    const handleChoice = (event, item) => {
        setForm({ ...Form, choice: item })
    }

    const handleChangeSwitch = (event, row, index) => {
        if (subgroup.item === null) {
            ChangeDisplay(row, assessor.item.id);
            //-------------------------------
            let newArr = [...datatable];
            newArr[index]['gmm_rating_display'] = event.target.checked;
            setData(newArr);
        } else {
            ChangeDisplaySubgroup(row, assessor.item.id, subgroup.item.id);

            let newArr = [...datatable];
            newArr[index]['gmm_rating_display'] = event.target.checked;
            setData(newArr);
        }
    };

    const handleChangeRequire = (event, row, index) => {
        if (subgroup.item === null) {
            ChangeRequire(row, assessor.item.id);
            // -------------------------------
            let newArr = [...datatable];
            newArr[index]['gmm_rating_require'] = event.target.checked;
            setData(newArr);
        } else {
            ChangeRequireSubgroup(row, assessor.item.id, subgroup.item.id);

            let newArr = [...datatable];
            newArr[index]['gmm_rating_require'] = event.target.checked;
            setData(newArr);
        }
    };

    const handleEdit = (row) => {
        setNoneEdit(true);
        setHidd(true);
        setForm({ ...Form, id: row.gmm_rating_id, subject: row.gmm_rating_name, choice: row.gmm_rating_type, display: row.gmm_rating_display })
    }

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
                if (subgroup.item === null) {
                    delete_rating(row.gmm_rating_id, assessor.item.id);
                } else {
                    delete_ratingSubgroups(row.gmm_rating_id, assessor.item.id, subgroup.item.id);
                }

            }
        });
    }

    const handleSelectAssessor = (ev, item) => {
        if (item) {
            setAssessor({ ...assessor, item: item })
            SelectGroup(item);
        }
    }

    const handleSelectNpc = (ev, item) => {
        if (item) {
            setSubgroup({ ...subgroup, item: item })
            SelectGroup(assessor.item, item)
        }
    }

    const Submit = (event) => {
        event.preventDefault();
        if (datatable.length !== 10) {
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
            alert_maxlength();
        }
    }

    const alert_maxlength = () => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "ไม่สามารถเพิ่มรายการได้",
            icon: "warning",
        })
    }

    function ButtonSubmit({ classes, status }) {
        return (
            <>
                <Box className={classes.Submit}>
                    {Hidd === true ?
                        <>
                            {/* <Button
                                variant="outlined"
                                color="primary"
                                disabled={status}
                                onClick={() => { clear() }}
                                className={classes.font_normal}
                                startIcon={<Refresh />}
                            >
                                ล้างข้อมูล
                            </Button>
                            &nbsp; &nbsp; */}
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

    // Table
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
                                disabled={headCell.id === 'active' || headCell.id === 'passenger'}

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

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />
            <form onSubmit={Submit}>

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
                            value={assessor.item}
                            onChange={handleSelectAssessor}
                            renderInput={(params) => (
                                < TextField
                                    {...params}
                                    label="ผู้ประเมิน"
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
                    {assessor.item !== null && assessor.item.id === 'GCM' && <>
                        <Grid item xs={12} >
                            <Autocomplete
                                classes={{
                                    input: classes.font_normal,
                                    option: classes.font_normal,
                                }}
                                options={service}
                                getOptionLabel={(value) => value.desc}
                                getOptionSelected={(option, value) =>
                                    option.id === value.id
                                }
                                value={subgroup.item}
                                onChange={handleSelectNpc}
                                renderInput={(params) => (
                                    < TextField
                                        {...params}
                                        label="ผู้ถูกประเมิน"
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
                    </>}
                    <Grid item xs={12} >
                        <TextField
                            label="หัวข้อการประเมิน"
                            variant="outlined"
                            margin="dense"
                            value={Form.subject}
                            onChange={(e) => { setForm({ ...Form, subject: e.target.value }) }}
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
                </Grid>
                <Box mt={2} />
                <Card variant="outlined">
                    <CardContent style={{ paddingBottom: '16px' }}>
                        <FormLabel className={classes.font_normal} ><HeadersI classes={classes} /></FormLabel>
                        <FormControl component="fieldset">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <RadioGroup row aria-label="position" value={Form.choice} onChange={handleChoice} defaultValue="top">
                                        {choices.map((status) =>
                                            <FormControlLabel key={status.id} value={status.id}
                                                classes={{ label: classes.font_normal }}
                                                control={<Radio color="primary" disabled={noneEdit} required />}
                                                label={status.desc}
                                            >
                                            </FormControlLabel>
                                        )}
                                    </RadioGroup>
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
                <Box mt={1} />
                {datatable.length !== 0 && <>
                    <Grid container spacing={2}>
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
                                            ? stableSort(datatable, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : stableSort(datatable, getComparator(order, orderBy))).map((row, index) => (
                                                <StyledTableRow hover key={index}>
                                                    <StyledTableCell width='10%' align="center">
                                                        {index + 1}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='40%' align="left">
                                                        {row.gmm_rating_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='10%' align="left">
                                                        {row.gmm_rating_type}
                                                    </StyledTableCell>
                                                    <StyledTableCell width='20%' align="center">
                                                        <Switch
                                                            disabled={promise}
                                                            checked={row.gmm_rating_display}
                                                            onChange={(e) => { handleChangeSwitch(e, row, index) }}
                                                            color="primary"
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell width='10%' align="center">
                                                        <Switch
                                                            disabled={promise}
                                                            checked={row.gmm_rating_require}
                                                            onChange={(e) => { handleChangeRequire(e, row, index) }}
                                                            color="secondary"
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                                                        <IconButton title="แก้ไขข้อมูล" color='primary' onClick={() => { handleEdit(row) }} disabled={promise}>
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </StyledTableCell>
                                                    <StyledTableCell width='5%' align="center" className={classes.padding_table} >
                                                        <IconButton title="ลบข้อมูล" color='secondary' onClick={() => { handleDelete(row) }} disabled={promise}>
                                                            <Close fontSize="small" />
                                                        </IconButton>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}

                                        {datatable.length === 0 && (
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
                                                count={datatable.length}
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
                </>}

            </form>

        </>
    );
}