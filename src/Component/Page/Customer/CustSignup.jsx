/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {
  Backdrop, Button, Box, Card, CardContent, TextField, Typography, Grid,
  FormLabel, FormControlLabel, FormControl, Radio, RadioGroup,
} from "@material-ui/core";
import { Assignment, DataUsage, Person, Work, Wc, Save } from "@material-ui/icons";
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

function TopicI({ classes }) {
  return (
    <>
      <Box pt={0} pb={0}>
        <Box className={classes.displayflex}>
          <Person />
          <Typography className={classes.font_header}>ประวัติผู้ใช้งาน</Typography>
        </Box>
      </Box>
      <PageLine />
      <br />
    </>
  );
}

function TopicII({ classes }) {
  return (
    <>
      <Box pt={2} pb={0}>
        <Box className={classes.displayflex}>
          <Person />
          <Typography className={classes.font_header}>ข้อมูลเพื่อพัฒนาการบริการ</Typography>
        </Box>
      </Box>
      <PageLine />
      <br />
    </>
  );
}

function Headers({ classes }) {
  return (
    <>
      <Box pt={0} pb={0}>
        <Box className={classes.displayflex}>
          <Assignment fontSize="small" />
          <Typography className={classes.font_subheader}>&nbsp;ข้อมูลส่วนตัว *</Typography>
        </Box>
        <PageLine />
      </Box>

    </>
  );
}

function HeadersI({ classes }) {
  return (
    <>
      <Box pt={0} pb={0}>
        <Box className={classes.displayflex}>
          <Wc fontSize="small" />
          <Typography className={classes.font_subheader}>&nbsp;เพศ</Typography>
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
          <DataUsage fontSize="small" />
          <Typography className={classes.font_subheader}>&nbsp;ช่วงอายุ</Typography>
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
          <Work fontSize="small" />
          <Typography className={classes.font_subheader}>&nbsp;อาชีพ</Typography>
        </Box>
        <PageLine />
      </Box>

    </>
  );
}
//- Submit
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

const myVar = {
  id: '',
  fname: '',
  lname: '',
  tel: '',
  email: '',
  sex: '',
  age: '',
  job: '',
  errorTel: {
    status: false,
    message: '(ใช้สำหรับลงชื่อเข้าสู่ระบบ Mobile App)',
  },
  errorEmail: {
    status: false,
    message: '',
  }
}

export default function CustSignup() {
  const url = config.API_URL + "models/Customer/Customer_profile.php";
  const classes = useStyles();
  const user = useSelector(({ PromiseReducer }) => PromiseReducer);
  const state = useHistory();
  const { vision, id } = useParams();
  const [promise, setPromise] = useState(false)
  const [isLoading, setBoolean] = useState(false);
  const [Form, setForm] = useState(myVar);
  const [sex, setSexMaster] = useState([]);
  const [age, setAgeMaster] = useState([]);
  const [job, setJobMaster] = useState([]);
  const telRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    FirstLoad();
    (vision === 'w') ? setPromise(false) : setPromise(true);
  }, []);

  async function FirstLoad() {
    setBoolean(true);
    //--------------------------------
    const payload = JSON.stringify({
      key: "Load_user_master",
      id: id
    });

    const response = await fetch(url, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();
    if (res.status) {
      (res.data.length !== 0) && setForm(res.data);
      setSexMaster(res.sex)
      setAgeMaster(res.age);
      setJobMaster(res.job);
      setBoolean(false);
    }
  }

  async function SaveData() {
    setBoolean(true);
    //--------------------------------
    const payload = JSON.stringify({
      key: "Create_user",
      id: user.id != "" ? user.id : getLocalStorage().id,
      item: Form
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
        state.push('/Home/ManageCust/' + vision);
      })
    } else {
      setBoolean(false);
      Swal.fire({
        title: "แจ้งเตือน",
        text: "ไม่สามารถใช้เบอร์โทรศัพท์นี้ได้ กรุณาตรวจสอบ",
        icon: "warning",
      })
    }
  }

  const getLocalStorage = () => {
    return JSON.parse(localStorage.cnf_us);
  };

  const handleChangeInput = (event) => {
    const { target } = event;
    const { name } = target;

    if (name === "tl") {
      if (target.value.match("^[0-9]*$")) {
        if (target.value.length === 0) {
          setForm({
            ...Form,
            tel: target.value,
            errorTel: { message: "", status: false },
          });
        } else {
          const fix_number = target.value.substr(0, 2);
          if (fix_number !== "02" && fix_number !== "06" && fix_number !== "08" && fix_number !== "09") {

            setForm({
              ...Form,
              tel: target.value,
              errorTel: {
                message: "หมวดหมายเลขโทรศัพท์ ไม่ถูกต้อง",
                status: true,
              },

            });
          } else {
            if (fix_number === "06" || fix_number === "08" || fix_number === "09") {
              if (target.value.length == 10) {
                setForm({
                  ...Form,
                  tel: target.value,
                  errorTel: { message: "(ใช้สำหรับลงชื่อเข้าสู่ระบบ Mobile App)", status: false },
                });
              } else {
                setForm({
                  ...Form,
                  tel: target.value,
                  errorTel: { message: "หมายเลขโทรศัพท์จำนวน 10 หลัก", status: true },
                });
              }
            } else {
              if (fix_number === "02") {
                if (target.value.length == 9) {
                  setForm({
                    ...Form,
                    tel: target.value,
                    errorTel: { message: "(ใช้สำหรับลงชื่อเข้าสู่ระบบ Mobile App)", status: false },
                  });

                } else {
                  setForm({
                    ...Form,
                    tel: target.value,
                    errorTel: {
                      message: "หมายเลขโทรศัพท์จำนวน 9 หลัก",
                      status: true,
                    },

                  });
                }
              }
            }
          }
        }
      }

    } else if (name === 'em') {
      if (target.value.length === 0) {
        setForm({ ...Form, email: target.value, errorEmail: { message: '', status: false } })
      } else {
        (target.value.match((/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i))) ?
          setForm({ ...Form, email: target.value, errorEmail: { message: '', status: false } }) :
          setForm({ ...Form, email: target.value, errorEmail: { message: 'รูปแบบที่อยู่อีเมล์ให้ถูกต้อง', status: true } })
      }

    } else if (name === 'fn') {
      setForm({ ...Form, fname: target.value });
    } else if (name === 'ln') {
      setForm({ ...Form, lname: target.value });
    }
  }

  const handleSex = (event) => {
    setForm({ ...Form, sex: event.target.value });
  }

  const handleAge = (event) => {
    setForm({ ...Form, age: event.target.value });
  }

  const handleJob = (event) => {
    setForm({ ...Form, job: event.target.value });
  }

  const Submit = (event) => {
    event.preventDefault();
    if (Form.errorEmail.status === false && Form.errorTel.status === false) {
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

      if (Form.errorEmail.status) {
        emailRef.current.focus()
      }

      if (Form.errorTel.status) {
        telRef.current.focus()
      }
    }
  }

  return (
    <>


      <form onSubmit={Submit}>
        <Loading classes={classes} status={isLoading} />
        <TopicI classes={classes} />

        <Card variant="outlined">
          <CardContent style={{ paddingBottom: '16px' }}>
            <FormControl component="fieldset">
              <FormLabel className={classes.font_normal} ><Headers classes={classes} /></FormLabel>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    value={Form.fname}
                    onChange={handleChangeInput}
                    name="fn"
                    label="ชื่อ"
                    margin="dense"
                    variant="outlined"
                    autoComplete="off"
                    inputProps={{ maxLength: 80, className: classes.font_normal, }}
                    InputLabelProps={{
                      className: classes.font_normal,
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    value={Form.lname}
                    onChange={handleChangeInput}
                    name="ln"
                    label="นามสกุล"
                    margin="dense"
                    variant="outlined"
                    autoComplete="off"
                    inputProps={{ maxLength: 80, className: classes.font_normal, }}
                    InputLabelProps={{
                      className: classes.font_normal,
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    value={Form.tel}
                    onChange={handleChangeInput}
                    name="tl"
                    label="เบอร์โทรศัพท์"
                    margin="dense"
                    variant="outlined"
                    autoComplete="off"
                    inputRef={telRef}
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
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    value={Form.email}
                    onChange={handleChangeInput}
                    name="em"
                    label="Email"
                    margin="dense"
                    variant="outlined"
                    placeholder="Example@hotmail.com"
                    autoComplete="off"
                    inputRef={emailRef}
                    error={Form.errorEmail.status}
                    helperText={Form.errorEmail.message}
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
            </FormControl>
          </CardContent>
        </Card>
        <TopicII classes={classes} />
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <Card variant="outlined">
              <CardContent style={{ paddingBottom: '16px' }}>
                <FormControl>
                  <FormLabel className={classes.font_normal} ><HeadersI classes={classes} /></FormLabel>
                  <RadioGroup row aria-label="position" value={Form.sex} onChange={handleSex} defaultValue="top">
                    {sex.map((sex) =>
                      <FormControlLabel key={sex.gmm_sex_id} value={sex.gmm_sex_id}
                        classes={{ label: classes.font_normal }}
                        control={<Radio color="primary" />}
                        label={sex.gmm_sex_name} >
                      </FormControlLabel>
                    )}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent className={classes.Contentpdx16}>
                <FormControl component="fieldset">
                  <FormLabel className={classes.font_normal} ><HeadersII classes={classes} /></FormLabel>
                  <RadioGroup value={Form.age} onChange={handleAge} >
                    {age.map((age) =>
                      <FormControlLabel key={age.gmm_age_id} value={age.gmm_age_id}
                        classes={{ label: classes.font_normal }}
                        control={<Radio color="primary" />}
                        label={age.gmm_age_name} >
                      </FormControlLabel>
                    )}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent className={classes.Contentpdx16}>
                <FormControl component="fieldset">
                  <FormLabel className={classes.font_normal} ><HeadersIII classes={classes} /></FormLabel>
                  <RadioGroup value={Form.job} onChange={handleJob} >
                    {job.map((job) =>
                      <FormControlLabel key={job.gmm_job_id} value={job.gmm_job_id}
                        classes={{ label: classes.font_normal }}
                        control={<Radio color="primary" />}
                        label={job.gmm_job_name} >
                      </FormControlLabel>
                    )}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <ButtonSubmit classes={classes} status={promise} />
          </Grid>
        </Grid>
      </form>
    </>
  );
}
