/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import {
  Button, Backdrop, Box, Chip, Collapse, TextField, Typography, Grid, IconButton,
  Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardArrowDown, KeyboardArrowUp, Settings, Save } from "@material-ui/icons";
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
    backgroundColor: '#ffffff',
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
  CollapseColor: {
    padding: '0px',
    backgroundColor: '#f8f8f8'
  },
  Chip_normal: {
    marginLeft: '5px',
    fontFamily: 'Regular',
    fontSize: '12px'
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
  padding_default: {
    padding: theme.spacing(3)
  },
  Pagination: {
    flexShrink: 0,
    marginLeft: theme.spacing(4),
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
          <Settings />
          <Typography className={classes.font_header}>กำหนดสิทธิ์ผู้ใช้งาน</Typography>
        </Box>
      </Box>
      <PageLine />
      <br />
    </>
  );
}


export default function AssignRole() {
  const url_admin = config.API_URL + "models/Admin/Admin_user.php";
  const classes = useStyles();
  const { vision, id } = useParams();
  const [promise, setPromise] = useState(false)
  const [isLoading, setBoolean] = useState(false);
  const [profile, setProfile] = useState([]);
  const [RoleMaster, setMaster] = useState([]);
  const [datatable, setData] = useState([]);
  const [roleID, setRole] = useState([]);


  useEffect(() => {
    FirstLoad();
    (vision === 'w') ? setPromise(false) : setPromise(true);
    // eslint-disable-next-line
  }, [])

  async function FirstLoad() {
    setBoolean(true);
    //--------------------------------
    const payload = JSON.stringify({
      key: "role_menu",
      id: id,
    });

    const response = await fetch(url_admin, { method: "POST", body: payload });
    await sleep(0);
    const res = await response.json();
    if (res.status) {
      setRole(res.pool);
      setData(res.data);
      setMaster(res.mstr);
      setProfile(res.userData)
      setBoolean(false);
    }
  }

  async function SaveRole() {
    setBoolean(true);
    //--------------------------------
    const payload = JSON.stringify({
      key: "Change_role",
      edit_id: getLocalStorage().id,
      id: id,
      item: roleID
    });

    const response = await fetch(url_admin, { method: "POST", body: payload });
    await sleep(0);
    const res = await response.json();
    if (res.status) {
      setBoolean(false);
      Swal.fire({
        title: "เรียบร้อย",
        text: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
      }).then(() => {
        FirstLoad();
      })

    }
  }

  const getLocalStorage = () => {
    return JSON.parse(localStorage.cnf_us);
  };

  const handlePick = (event, item, idx1, idx2) => {
    if (item) {
      let newArr = [...roleID];
      newArr[idx1]['role'][idx2] = item;
      setRole(newArr);
    }
  }

  const handleOpen = (open, idx1) => {
    let newArr = [...datatable];
    newArr[idx1]['open'] = !open
    setData(newArr);
  }

  const Submit = (event) => {
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
        SaveRole();
      }
    });
  }

  //- Submit
  function ButtonSubmit({ classes, status }) {
    return (
      <>
        <Box mt={1} mb={2} className={classes.Submit}>
          <Button
            onClick={Submit}
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

  function Sort({ classes, indx1, indx2, data }) {
    return (
      <Autocomplete
        value={data[indx1]['role'][indx2]}
        classes={{
          input: classes.font_normal,
          option: classes.font_normal,
        }}
        options={RoleMaster}
        getOptionLabel={(value) => value.gmm_role_statu_name}
        getOptionSelected={(option, value) =>
          option.gmm_role_statu_code === value.gmm_role_statu_code
        }
        onChange={(event, item) => { handlePick(event, item, indx1, indx2) }}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="dense"
            variant="outlined"
            InputLabelProps={{
              className: classes.font_normal,
            }}
            required
          />
        )}
      />
    );
  }

  function Row({ row, index, data }) {

    return (
      <>
        <StyledTableRow hover>
          <StyledTableCell width='10%' align="center">
            {index + 1}
          </StyledTableCell>
          <StyledTableCell width='80%' align="left">
            {row.name}
          </StyledTableCell>
          <StyledTableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => { handleOpen(row.open, index) }}>
              {row.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </StyledTableCell>
        </StyledTableRow>

        <StyledTableRow>
          <StyledTableCell className={classes.CollapseColor} colSpan={3}>
            <Collapse in={row.open} timeout="auto" className={classes.padding_default} unmountOnExit>
              <Table >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell width='60%' align="left"><b>รายชื่อเมนู</b></StyledTableCell>
                    <StyledTableCell width='40%' align="center"><b>กำหนดสิทธิ์</b></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {row.menu.map((list, indexs) => (
                    <StyledTableRow key={list.gmm_menu_id} className={classes.root}>
                      <StyledTableCell width='60%' align="left">
                        {list.gmm_menu_name}
                      </StyledTableCell>
                      <StyledTableCell width='40%' align="center" >
                        <Sort classes={classes} indx1={index} indx2={indexs} data={data} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </StyledTableCell>
        </StyledTableRow>
      </>
    )
  }



  return (
    <>
      <Loading classes={classes} status={isLoading} />
      <Headers classes={classes} />
      {profile.fname !== undefined &&
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component='label' className={classes.font_normal}>
              <strong>ชื่อ - นามสกุล :</strong> {profile.fname}  {profile.lname}
            </Typography>

          </Grid>
          <Grid item xs={12}>
            <Typography component='label' className={classes.font_normal}>
              <strong>ระดับผู้ใช้งาน :</strong>
              <Chip label={profile.lv} className={classes.Chip_normal} color="primary" ></Chip>
            </Typography>
          </Grid>
        </Grid>
      }
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box mt={2} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell width='10%' align="center">#</StyledTableCell>
                  <StyledTableCell width='80%' align="left">หัวข้อ</StyledTableCell>
                  <StyledTableCell />
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {datatable.map((row, index) => (
                  <Row key={row.gid} row={row} index={index} data={roleID} />
                ))}

                {datatable.length === 0 && (
                  <StyledTableRow style={{ height: 25 }}>
                    <StyledTableCell colSpan={3} align="center">
                      ไม่พบข้อมูล
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ButtonSubmit classes={classes} status={promise} />
        </Grid>
      </Grid>
    </>
  );
}
