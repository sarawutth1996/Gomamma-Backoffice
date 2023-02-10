/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Backdrop, Button, Box, TextField, Typography, Grid, IconButton, InputAdornment,
    Menu, FormControl, FormHelperText, TableCell, TableRow
} from "@material-ui/core";
import { InsertEmoticon, Telegram } from "@material-ui/icons";
import Loader from "react-loader-spinner";
import Picker from 'emoji-picker-react';
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
    font_small: {
        fontFamily: 'Regular',
        fontSize: '12px',
        float: 'right'
    },
    hidd_pd: {
        padding: 0,
    },
    rebuild: {
        opacity: 1,
        transform: 'none',
        transition: 'opacity 317ms cubic- bezier(0.4, 0, 0.2, 1) 0ms, transform 211ms cubic- bezier(0.4, 0, 0.2, 1) 0ms',
        top: '200px !important',
        left: '458px',
        transformOrigin: '280px 180.812px'
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
                    <Telegram />
                    <Typography className={classes.font_header}>กำหนดข้อมูลแจ้งเตือน</Typography>
                </Box>
            </Box>
            <PageLine />
            <br />
        </>
    );
}

const Profile = {
    title: '',
    message: '',
}

export default function AdminSendAPI() {
    const url = config.API_URL + "sendAPI.php";
    const user = useSelector(({ PromiseReducer }) => PromiseReducer);
    const classes = useStyles();
    const { vision } = useParams();

    const [promise, setPromise] = useState(false)
    const [isLoading, setBoolean] = useState(false);
    const [Form, setForm] = useState(Profile);
    const [msgCount, setMsgCount] = useState(0);
    const [titleCount, setTitleCount] = useState(0);
    const [anchorElTitle, setAnchorElTitle] = React.useState(null);
    const [anchorElMgs, setAnchorElMgs] = React.useState(null);

    const openEmojiTitle = Boolean(anchorElTitle);
    const openEmojiMgs = Boolean(anchorElMgs);

    useEffect(() => {
        (vision === 'w') ? setPromise(false) : setPromise(true);
    }, [])

    async function sender() {
        setBoolean(true);
        const payload = JSON.stringify({
            title: Form.title,
            message: Form.message,
        });

        const response = await fetch(url, { method: "POST", body: payload });
        await sleep(350);
        const res = await response.json();

        if (res.status) {
            setBoolean(false);

            Swal.fire({
                title: "เรียบร้อย",
                text: "ส่งข้อมูลสำเร็จ",
                icon: "success",
            })
        }
    }

    // Title

    const EmojiTitle = (event, emojiObject) => {
        if (Form.title.length < 78) {
            let Merg = Form.title.length + emojiObject.emoji.length;

            setTitleCount(Merg)
            setForm({ ...Form, title: Form.title + emojiObject.emoji })
            setAnchorElTitle(null)
        } else {
            setAnchorElTitle(null)
        }
    };

    const handleEmojiTitle = (event) => {
        setAnchorElTitle(event.currentTarget);
    };

    const handleCloseTitle = () => {
        setAnchorElTitle(null);
    };

    // Message

    const EmojiMessage = (event, emojiObject) => {
        if (Form.message.length < 254) {
            let Merg = Form.message.length + emojiObject.emoji.length;

            setMsgCount(Merg)
            setForm({ ...Form, message: Form.message + emojiObject.emoji })
            setAnchorElMgs(null);
        } else {
            setAnchorElMgs(null);
        }
    };

    const handleEmojiMgs = (event) => {
        setAnchorElMgs(event.currentTarget);
    };

    const handleCloseMgs = () => {
        setAnchorElMgs(null);
    };

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
                sender();

            }
        });
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
                        startIcon={<Telegram />}
                    >
                        SUBMIT
                    </Button>
                </Box>
            </>
        )
    }

    return (
        <>
            <Loading classes={classes} status={isLoading} />
            <Headers classes={classes} />

            <FormControl component="fieldset">
                <form onSubmit={Submit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                margin="dense"
                                variant="outlined"
                                value={Form.title}
                                onChange={(e) => {
                                    setForm({ ...Form, title: e.target.value });
                                    setTitleCount(e.target.value.length);
                                }}
                                inputProps={{ maxLength: 80, className: classes.font_normal, }}
                                InputProps={{
                                    className: classes.font_normal,
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton aria-label="delete" size="small" onClick={handleEmojiTitle}>
                                                <InsertEmoticon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{
                                    className: classes.font_normal,
                                }}
                                fullWidth
                                required
                            />
                            <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {titleCount} / 80</FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Message"
                                margin="dense"
                                variant="outlined"
                                value={Form.message}
                                onChange={(e) => {
                                    setForm({ ...Form, message: e.target.value });
                                    setMsgCount(e.target.value.length);
                                }}
                                inputProps={{ maxLength: 256, className: classes.font_normal, }}
                                InputProps={{
                                    className: classes.font_normal,
                                    endAdornment: (
                                        <InputAdornment position="start" style={{ paddingTop: '46px' }}>
                                            <IconButton aria-label="delete" size="small" onClick={handleEmojiMgs}>
                                                <InsertEmoticon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{
                                    className: classes.font_normal,
                                }}
                                rows={4}
                                multiline
                                fullWidth
                                required
                            />
                            <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonSubmit classes={classes} status={promise} />
                        </Grid>
                        {/* <Grid item xs={12}>
                        <ViewTable filtered={filtered} status={promise} />
                    </Grid> */}
                    </Grid>
                </form>
            </FormControl>

            <Menu
                classes={{ list: classes.hidd_pd, paper: classes.rebuild }}
                anchorEl={anchorElTitle}
                open={openEmojiTitle}
                onClose={handleCloseTitle}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Box>
                    <Picker
                        disableSearchBar={true}
                        onEmojiClick={EmojiTitle} />
                </Box>
            </Menu>

            <Menu
                classes={{ list: classes.hidd_pd, paper: classes.rebuild }}
                anchorEl={anchorElMgs}
                open={openEmojiMgs}
                onClose={handleCloseMgs}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Box>
                    <Picker
                        disableSearchBar={true}
                        onEmojiClick={EmojiMessage} />
                </Box>
            </Menu>
        </>
    );
}
   // eslint-disable-next-line