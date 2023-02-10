/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Backdrop, Button, Box, TextField, Typography, Grid, IconButton, InputAdornment, Hidden,
  Table, TableSortLabel, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Close, Person, KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage, Save, Search, Settings, Visibility, VisibilityOff } from "@material-ui/icons";
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
  font_header: {
    fontFamily: 'SemiBold',
    margin: '10px',
    fontSize: '18px'
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
          <Person />
          <Typography className={classes.font_header}>สร้างบัญชีผู้ใช้งาน</Typography>
        </Box>
      </Box>
      <PageLine />
      <br />
    </>
  );
}

const Profile = {
  fname: '',
  lname: '',
  username: '',
  password: '',
  role: null
}

export default function AssignUser() {
  const url_admin = config.API_URL + "models/Admin/Admin_user.php";
  const url_menu = config.API_URL + "models/Menu/List_menu.php";

  const user = useSelector(({ PromiseReducer }) => PromiseReducer);
  const classes = useStyles();
  const state = useHistory();
  const { vision } = useParams();

  const [promise, setPromise] = useState(false)
  const [isLoading, setBoolean] = useState(false);
  const [swith, setValues] = useState({ showPassword: false });
  const [Form, setForm] = useState(Profile);
  const [datatable, setData] = useState([]);
  const [roleMaster, setRole] = useState([]);

  //- Table
  const [search, SetSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(''); // ให้มาถึง sort ตัวไหนก่อน
  const headCells = [
    { id: 'id', label: '#', width: '10%', align: "center" },
    { id: 'gmm_admin_fullname', label: 'ชื่อ - นามสกุล', width: '35%', align: "left" },
    { id: 'gmm_admin_role_name', label: 'ระดับผู้ใช้งาน', width: '30%', align: "left" },
    { id: 'gmm_admin_active', label: 'Active', width: '15%', align: "center" },
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
      key: "Controller",
      id: user.id != "" ? user.id : getLocalStorage().id,
    });

    const response = await fetch(url_menu, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();
    if (res.status) {
      setRole(res.mstr)
      setData(res.data);
      setBoolean(false);
    }
  }

  async function create_user() {
    setBoolean(true);
    const payload = JSON.stringify({
      key: "create_user",
      id: user.id != "" ? user.id : getLocalStorage().id,
      item: Form
    });

    const response = await fetch(url_admin, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();

    if (res.status) {
      setBoolean(false);
      Swal.fire({
        title: "เรียบร้อย",
        text: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
      }).then(() => {
        FirstLoad();
        Reload();
      })
    } else {
      setBoolean(false);
      Swal.fire({
        title: "แจ้งเตือน",
        text: "ไม่สามารถใช้ username นี้ได้",
        icon: "warning",
      })
    }
  }

  async function delete_user(id) {
    setBoolean(true);
    const payload = JSON.stringify({
      key: "delete_user",
      edit_id: user.id != "" ? user.id : getLocalStorage().id,
      id: id
    });

    const response = await fetch(url_admin, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();

    if (res.status) {
      setBoolean(false);
      Swal.fire({
        title: "เรียบร้อย",
        text: "ลบข้อมูลสำเร็จ",
        icon: "success",
      }).then(() => {
        FirstLoad();
        Reload();
      })
    } else {
      setBoolean(false);
      alert_message('ข้อมูลถูกใช้อยู่ในระบบ');
    }
  }

  async function active_user(status, id) {
    setBoolean(true);
    const payload = JSON.stringify({
      key: "active_user",
      edit_id: user.id != "" ? user.id : getLocalStorage().id,
      id: id,
      status: status
    });

    const response = await fetch(url_admin, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();

    if (res.status) {
      setBoolean(false);
      Swal.fire({
        title: "เรียบร้อย",
        text: "เปลี่ยนสถานะสำเร็จ",
        icon: "success",
      }).then(() => {
        FirstLoad();
        Reload();
      })
    }
  }

  const alert_message = (txt) => {
    Swal.fire({
      title: "แจ้งเตือน",
      text: txt,
      icon: "warning",
    })
  }

  const Reload = () => {
    setForm(Profile)
    setValues({ ...swith, showPassword: false })
  }

  const getLocalStorage = () => {
    return JSON.parse(localStorage.cnf_us);
  };

  //- Table
  const filtered = datatable.filter((row) => {
    return row.gmm_admin_fullname.toLowerCase().includes(search.toLowerCase()) ||
      row.gmm_admin_active.toLowerCase().includes(search.toLowerCase()) ||
      row.gmm_admin_role_name.toLowerCase().includes(search.toLowerCase())
  })

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleShowPassword = () => {
    setValues({
      showPassword: !swith.showPassword,
    });
  };

  const handleChangeInput = (event) => {
    const { target } = event;
    const { name } = target;
    if (name === 'pw') {
      if (target.value.match("^[a-zA-Z0-9]*$")) {
        setForm({ ...Form, password: target.value });
      }
    } else if (name === 'un') {
      if (target.value.match("^[a-zA-Z0-9]*$")) {
        setForm({ ...Form, username: target.value });
      }
    } else if (name === 'fn') {
      setForm({ ...Form, fname: target.value });
    } else if (name === 'ln') {
      setForm({ ...Form, lname: target.value });
    }


  }

  const handleRole = (event, item) => {
    setForm({ ...Form, role: item });
  }


  const handleActive = (row) => {
    Swal.fire({
      // title: "Update",
      text: "ท่านต้องการเปลี่ยนสถานะ หรือไม่?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      // //reverseButtons: true,
    }).then((output) => {
      if (output.isConfirmed) {
        active_user(row.gmm_admin_active, row.gmm_admin_id);
      }
    });
  }

  const handlePromise = (row) => {
    state.push('/Home/AdminRole/' + vision + '/' + row.gmm_admin_id);
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
        delete_user(row.gmm_admin_id);
      }
    });
  }

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
        create_user();

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
                    <StyledTableCell width='35%' align="left">
                      {row.gmm_admin_fullname}
                    </StyledTableCell>
                    <StyledTableCell width='30%' align="left">
                      {row.gmm_admin_role_name}
                    </StyledTableCell>
                    <StyledTableCell width='15%' align="center">
                      <Button
                        title="Active"
                        size="small"
                        variant={row.gmm_admin_active === 'ACTIVE' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => { handleActive(row) }}
                        className={classes.font_normal}
                        disabled={status}
                        fullWidth
                      >{row.gmm_admin_active}</Button>

                    </StyledTableCell>
                    <StyledTableCell width='5%' align="center" className={classes.padding_table}>
                      <IconButton title="กำหนดสิทธิ์" color='primary' onClick={() => handlePromise(row)} disabled={status}>
                        <Settings fontSize="small" />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell width='5%' align="center" className={classes.padding_table} >
                      <IconButton title="ลบข้อมูล" color='secondary' onClick={() => handleDelete(row)} disabled={status}>
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

  //- Submit
  function ButtonSubmit({ classes, status }) {
    return (
      <>
        <Box mt={1} mb={2} className={classes.Submit}>
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

  return (
    <>
      <Loading classes={classes} status={isLoading} />
      <Headers classes={classes} />
      <form onSubmit={Submit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              name="fn"
              label="ชื่อ"
              margin="dense"
              variant="outlined"
              autoComplete="off"
              value={Form.fname}
              onChange={handleChangeInput}
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
          <Grid item xs={12} sm={6}>
            <TextField
              name="ln"
              label="นามสกุล"
              margin="dense"
              variant="outlined"
              autoComplete="off"
              value={Form.lname}
              onChange={handleChangeInput}
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
          <Grid item xs={12} sm={6}>
            <TextField
              name="un"
              label="Username"
              margin="dense"
              variant="outlined"
              autoComplete="off"
              value={Form.username}
              onChange={handleChangeInput}
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
          <Grid item xs={12} sm={6}>
            <TextField
              name="pw"
              label="Password"
              margin="dense"
              variant="outlined"
              type={swith.showPassword ? "text" : "password"}
              value={Form.password}
              onChange={handleChangeInput}
              InputProps={{
                className: classes.font_normal,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} >
                      {swith.showPassword ? (
                        <Visibility fontSize="small" />
                      ) : (
                        <VisibilityOff fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 80, className: classes.font_normal, }}
              InputLabelProps={{
                className: classes.font_normal,
              }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              classes={{
                input: classes.font_normal,
                option: classes.font_normal,
              }}
              options={roleMaster}
              getOptionLabel={(value) => value.gmm_role_name}
              getOptionSelected={(option, value) =>
                option.gmm_role_id === value.gmm_role_id
              }
              value={Form.role}
              onChange={handleRole}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="ระดับผู้ใช้งาน"
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
            <ButtonSubmit classes={classes} status={promise} />
          </Grid>
        </Grid>
      </form>
      <PageLine />
      <Box mt={2}>
        <Grid container spacing={2}>
          <Hidden only={['xs', 'sm']}>
            <Grid item xs={8} sm={8} md={8} />
          </Hidden>
          <Grid item xs={12} sm={12} md={4} >
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
          <Grid item xs={12}>
            <ViewTable filtered={filtered} status={promise} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
   // eslint-disable-next-line