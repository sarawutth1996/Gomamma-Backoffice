/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Backdrop, Box, Button, Container, Grid, Paper, TextField, Typography, IconButton, InputAdornment,
} from "@material-ui/core";
import { Person, Lock, Visibility, VisibilityOff } from "@material-ui/icons";
import auth from "./authPath/auth";
import Loader from "react-loader-spinner";
import Swal from 'sweetalert2'
import config from './config'

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%!important",
    height: "100%!important",
    backgroundColor: "#f1f2f3",
    minWidth: "320px",
    direction: "ltr",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  wrpFlex: {
    display: "flex",
    minHeight: "calc(100vh - 36px)",
  },
  wrpRound: {
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
  },
  wrpMiddle: {
    alignSelf: "center!important",
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      width: "500px",
    },
  },
  wrpController: {
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2, 0),
    },
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.text.secondary,
    border: "1px solid rgba(0,0,0,0.12)",
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
    },
  },
  divine_line: {
    alignSelf: "center",

    [theme.breakpoints.up("md")]: {
      paddingLeft: "28px!important",
      paddingRight: "6px!important",
    },

    [theme.breakpoints.down("sm")]: {
      paddingLeft: "12px!important",
      paddingRight: "12px!important",
    },
  },
  PaddingImage: {
    margin: theme.spacing(0),
    [theme.breakpoints.down("sm")]: {
      marginBottom: "12px",
    },
  },
  TextRt: {
    textAlign: "left",
    fontFamily: 'Regular',
    fontSize: '14px'
  },
  w100: {
    width: "100%!important",
    [theme.breakpoints.up("md")]: {
      borderRight: "1px solid #e0e0e0",
    },
  },
  footer: {
    textAlign: "right",
    paddingRight: "24px",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
  },
  font_normal: {
    fontFamily: 'Regular',
    fontSize: '14px'
  },
}));

function Copyright({ classes }) {
  return (
    <Typography variant="body2" color="textSecondary" className={classes.font_normal}>
      {"©"} {new Date().getFullYear()} {"   "}Double M Technology Management
      Co.,Ltd.
    </Typography>
  );
}

function ButtonLogin({ classes }) {
  return (
    <Button
      type="submit"
      className={classes.font_normal}
      style={{ textTransform: 'none' }}
      variant="contained"
      color="primary" fullWidth >
      Sign In
    </Button >
  );
}

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

export default function Login() {
  const url = config.API_URL + "models/Login/Login.php";
  const urlPath = useLocation();
  const classes = useStyles();
  const state = useHistory();
  const [isLoading, setBoolean] = useState(false);
  const [swith, setValues] = useState({ showPassword: false });
  const [Account, setLogin] = useState({ us: "", pw: "" });


  async function Login() {
    setBoolean(true);
    //--------------------------------
    const payload = JSON.stringify({
      key: "Login",
      us: Account.us,
      pw: Account.pw,
    });

    const response = await fetch(url, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();

    if (res.status) {
      setBoolean(false);
      //----------------------
      setLocalStorage(res.data);
      auth.login(() => {
        state.push("/Home");
      });
    } else {
      setBoolean(false);
      if (res.action === 'NONE') {
        Swal.fire({
          title: "แจ้งเตือน",
          text: res.message,
          icon: "warning",
        })
      }

      if (res.action === 'INACTIVE') {
        Swal.fire({
          title: "แจ้งเตือน",
          text: res.message,
          icon: "warning",
        })
      }
    }
  }

  const handleChange = (event) => {
    const { target } = event;
    const { name } = target;
    setLogin({
      ...Account,
      [name]: target.value,
    });
  };

  const ShowPassword = () => {
    setValues({
      showPassword: !swith.showPassword,
    });
  };

  const setLocalStorage = (items) => {
    const loadItem = JSON.stringify({
      id: items["id"],
      fname: items["fname"],
      lname: items["lname"],
      lv: items["lv"],
      vision: items["vision"],
      mail_leave: 0,
    });

    localStorage.setItem("cnf_us", loadItem);
  };

  const Submit = (event) => {
    event.preventDefault();
    //Data Test
    Login();

  };

  return (
    <section className={classes.root}>
      <Loading classes={classes} status={isLoading} />
      <main className={classes.wrpRound}>
        <Box className={classes.wrpFlex}>
          <Box className={classes.wrpMiddle}>
            <Container className={classes.wrpController}>
              <Paper elevation={0} className={classes.paper}>
                <form onSubmit={Submit}>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      className={classes.PaddingImage}
                    >
                      <img src="/image/GomammaWithText.png" alt="Gomamma" className={classes.w100} />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      className={classes.divine_line}
                    >
                      <Box className={classes.TextRt} mb={1}>
                        <Typography component="span" className={classes.font_normal}>
                          <strong>Username</strong>
                        </Typography>
                        <TextField
                          name="us"
                          variant="outlined"
                          margin="dense"
                          size="small"
                          value={Account.us}
                          onChange={handleChange}
                          InputProps={{
                            className: classes.font_normal,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person fontSize="small" style={{ color: 'gray' }} />
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            className: classes.font_normal,
                          }}
                          required
                          fullWidth
                        />
                      </Box>
                      <Box className={classes.TextRt} mb={2}>
                        <Typography component="span" className={classes.TextRt}>
                          <strong>Password</strong>
                        </Typography>

                        <TextField
                          name="pw"
                          variant="outlined"
                          margin="dense"
                          size="small"
                          value={Account.pw}
                          onChange={handleChange}
                          type={swith.showPassword ? "text" : "password"}
                          InputProps={{
                            className: classes.font_normal,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock fontSize="small" style={{ color: 'gray' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={ShowPassword}>
                                  {swith.showPassword ? (
                                    <Visibility fontSize="small" />
                                  ) : (
                                    <VisibilityOff fontSize="small" />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            className: classes.font_normal,
                          }}
                          required
                          fullWidth
                        />
                      </Box>
                      <Grid item xs={12}>
                        <ButtonLogin classes={classes} />
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Container>
          </Box>
        </Box>
      </main>
      <Box pb={2} className={classes.footer}>
        <Copyright classes={classes} />
      </Box>
    </section>
  );
}
