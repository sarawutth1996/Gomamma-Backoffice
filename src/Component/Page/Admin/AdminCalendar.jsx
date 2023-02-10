/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Backdrop, Button, Box, Checkbox, TextField, Typography, Grid, IconButton, FormGroup, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, FormHelperText
} from "@material-ui/core";
import { Add, Close, EventNote, InsertInvitation } from "@material-ui/icons";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import { Calendar, momentLocalizer } from "react-big-calendar";
import DateFnsUtils from "@date-io/date-fns";
import thLocale from "date-fns/locale/th";
import Loader from "react-loader-spinner";
import PageLine from "../../../theme/PageLine";
import Swal from 'sweetalert2'
//--------------------------------------------------
import config from '../../config';
import moment from "moment";
import "moment/locale/th";
import "react-big-calendar/lib/css/react-big-calendar.css";


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
    fontFamily: 'Regular',
    fontSize: '18px',
    textAlign: 'left',
  }
});

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
  displayflexHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    alignItems: "normal",
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
  StyleDetail: {
    borderLeft: '6px solid rgb(0, 120, 214)',
    backgroundColor: 'rgba(0, 120, 214, 0.1)',
    padding: '12px',
    fontFamily: 'Regular',
    fontSize: '20px',
    fontWeight: 500,
    margin: '0px'
  }
  ,
  font_header: {
    fontFamily: 'SemiBold',
    margin: '10px',
    fontSize: '18px'
  },
  font_normal: {
    fontFamily: 'Regular',
    fontSize: '14px',
    textTransform: 'none',
  },
  font_chip: {
    fontFamily: 'Regular',
    fontSize: '12px'
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

function Headers({ classes, func, status }) {
  return (
    <>
      <Box pt={0} pb={0} className={classes.displayflexHead}>
        <Box className={classes.displayflexHead}>
          <EventNote />
          <Typography className={classes.font_header}>วันหยุดให้บริการ</Typography>
        </Box>
        <Box>
          <Button
            className={classes.font_normal}
            onClick={func}
            disabled={status}
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<Add />}

          >
            Create Event
          </Button>
        </Box>
      </Box>
      <PageLine />
      <br />
    </>
  );
}

export default function AdminCalendar() {
  const url = config.API_URL + "models/Admin/Admin_calendar.php";
  const user = useSelector(({ PromiseReducer }) => PromiseReducer);
  const classes = useStyles();
  const { vision } = useParams();
  const localizer = momentLocalizer(moment);
  const [promise, setPromise] = useState(false)
  const [isLoading, setBoolean] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [view, setView] = useState(['month', 'week', 'day', 'agenda']);
  const [Edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [formatDate, setFormatDate] = useState('dd/MM/yyyy');
  const [showDetail, setShowDetail] = useState({ id: '', title: '', start: null, end: null, allDay: false, desc: '', start_format: null, end_format: null, pattern: '' });
  const [Log, setLog] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
  })
  const [Myevent, setEvent] = useState([])
  const [Count, setCount] = useState({ id: '' })
  const [Form, setForm] = useState({
    id: 0,
    title: '',
    allDay: true,
    repeat: false,
    year: 1,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
    // start: new Date('2022-01-13T05:08:00'),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
    desc: ''
  })

  useEffect(() => {
    FirstLoad();
    (vision === 'w') ? setPromise(false) : setPromise(true);
  }, []);


  async function FirstLoad() {
    //--------------------------------
    const payload = JSON.stringify({
      key: "Payload_event",
    });

    const response = await fetch(url, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();
    if (res.status) {
      setCount({ ...Count, id: res.maxID.gmm_holiday_id + 1 })
      setForm({ ...Form, id: res.maxID.gmm_holiday_id + 1 })

      const event = res.data;
      const item = [];
      for (let i = 0; i < event.length; i++) {
        let makeData = {
          id: event[i]['gmm_holiday_id'],
          title: event[i]['gmm_holiday_name'],
          allDay: (event[i]['gmm_holiday_allday'] === 'YES') ? true : false,
          start: new Date(event[i]['gmm_holiday_start']),
          end: new Date(event[i]['gmm_holiday_end']),
          desc: event[i]['gmm_holiday_desc']
        }

        item[i] = makeData
      }

      setEvent(item)
    }
  }

  async function SaveData() {
    setBoolean(true);
    setOpenDetail(false);
    setOpen(false);

    //--------------------------------
    const payload = JSON.stringify({
      key: "Create_event",
      edit_id: user.id != "" ? user.id : getLocalStorage().id,
      item: Form,
    });

    const response = await fetch(url, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();
    if (res.status) {

      let PushEvent = {
        id: Count.id,
        allDay: Form.allDay,
        start: Form.start,
        end: Form.end,
        title: Form.title,
        desc: Form.desc
      }

      setEvent([...Myevent, PushEvent])
      setBoolean(false);
      clear('add');
    }
  }

  async function SaveRepeat(item) {
    setBoolean(true);
    setOpenDetail(false);
    setOpen(false);

    //--------------------------------
    const payload = JSON.stringify({
      key: "Create_repeat_event",
      edit_id: user.id != "" ? user.id : getLocalStorage().id,
      item: item,
    });

    const response = await fetch(url, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();
    if (res.status) {
      let newArr = [...Myevent];
      for (let i = 0; i < item.length; i++) {
        newArr.push(item[i])
      }

      setEvent(newArr)
      setBoolean(false);
      clear('repeat', item.length);
    }
  }

  async function EditData() {
    setBoolean(true);
    setOpenDetail(false);
    setOpen(false);

    const payload = JSON.stringify({
      key: "Create_event",
      edit_id: user.id != "" ? user.id : getLocalStorage().id,
      item: Form,
    });

    const response = await fetch(url, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();
    if (res.status) {
      let newArr = [...Myevent];
      let handle = '';

      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i].id === showDetail.id) {
          handle = i
          break;
        }
      }

      newArr[handle]['id'] = Form.id
      newArr[handle]['title'] = Form.title
      newArr[handle]['allDay'] = Form.allDay
      newArr[handle]['start'] = Form.start
      newArr[handle]['end'] = Form.end
      newArr[handle]['desc'] = Form.desc

      setEvent(newArr)
      setBoolean(false);
      clear('close');
    }
  }

  async function Delete(id) {
    setBoolean(true);
    setOpenEdit(false);

    const payload = JSON.stringify({
      key: "Delete_event",
      edit_id: user.id != "" ? user.id : getLocalStorage().id,
      id: id,
    });

    const response = await fetch(url, { method: "POST", body: payload });
    await sleep(350);
    const res = await response.json();
    if (res.status) {
      let newArr = [...Myevent];
      let handle = '';

      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i].id === showDetail.id) {
          handle = i
          break;
        }
      }

      newArr.splice(handle, 1)

      setEvent(newArr)
      setBoolean(false);
      clear('add');
    }
  }

  const getLocalStorage = () => {
    return JSON.parse(localStorage.cnf_us);
  };

  const Repeat_year = () => {
    let date_start = Form.start;
    let date_end = Form.end;

    let start_d = date_start.getDate(); // วัน
    let start_m = date_start.getMonth(); // เดือน
    let start_y = date_start.getFullYear(); // เดือน
    let start_h = date_start.getHours(); // ชม.
    let start_i = date_start.getMinutes(); // นาที.
    let start_s = date_start.getSeconds(); // วิ.

    let end_d = date_end.getDate(); // วัน
    let end_m = date_end.getMonth(); // เดือน
    let end_y = date_end.getFullYear(); // เดือน
    let end_h = date_end.getHours(); // ชม.
    let end_i = date_end.getMinutes(); // นาที.
    let end_s = date_end.getSeconds(); // วิ.

    let newArr = [];
    for (let i = 0; i <= Form.year; i++) {
      let start = new Date(start_y + i, start_m, start_d, start_h, start_i, start_s);
      let end = new Date(end_y + i, end_m, end_d, end_h, end_i, end_s);
      let PushEvent = {
        id: Count.id + i,
        allDay: Form.allDay,
        start: start,
        end: end,
        title: Form.title,
        desc: Form.desc
      }

      newArr.push(PushEvent)
    }

    return newArr
  }

  const handleCreateEvent = () => {
    setOpen(true);
  }

  const handleSubmitEvent = (event) => {

    event.preventDefault();
    if (!Edit) {
      if (Form.repeat) {
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
            const NewArr = Repeat_year();
            SaveRepeat(NewArr);
          }
        });

      } else {
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
      }
    } else {
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
          EditData();
        }
      });
    }
  }

  const handleAllDay = () => {
    if (Form.allDay === false) { // allDay
      setLog({ ...Log, start: Form.start, end: Form.end });
      setFormatDate('dd/MM/yyyy');
      setForm({ ...Form, allDay: !Form.allDay, start: Form.start, end: Form.end });

    } else { // non-allDay
      setLog({ ...Log, start: Form.start, end: Form.end });
      setFormatDate('dd/MM/yyyy HH:mm');
      setForm({ ...Form, allDay: !Form.allDay, start: Log.start, end: Log.end });
    }
  }

  const handleRepeat = () => {
    if (Form.repeat === false) { // allDay
      setForm({ ...Form, repeat: !Form.repeat });
    } else {
      setForm({ ...Form, repeat: !Form.repeat });
    }
  }

  const MoreDetail = () => {
    setOpenDetail(false);
    setOpen(true);
  }

  const MoreDetailEdit = () => {
    setForm({
      ...Form,
      title: showDetail.title,
      allDay: showDetail.allDay,
      start: showDetail.start_format,
      end: showDetail.end_format,
      desc: showDetail.desc
    })
    setMsgCount(showDetail.desc.length)
    setFormatDate(showDetail.pattern);
    setOpenEdit(false);
    setEdit(true);
    setOpen(true);
  }

  const CloseDialog = () => {
    setOpen(false);
    clear('close');
  }

  const CloseDialogDetail = () => {
    setOpenDetail(false);
    clear('close');
  }

  const CloseDialogEdit = () => {
    setOpenEdit(false);
    clear('close');
  }

  const convert_timezone = (date) => {
    let time = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(11, 16)

    return time
  }

  const decrease_day = (date) => {
    let newFormat = new Date(date.getTime() - 1)

    return newFormat;
  }

  const SelectEvent = (event) => {

    if (event.allDay) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date_start_string = event.start.toLocaleDateString("th", options);
      const date_end_string = event.end.toLocaleDateString("th", options);
      setLog({ ...Log, start: event.start, end: event.end })
      setForm({ ...Form, id: event.id, allDay: true, start: event.start, end: decrease_day(event.end), desc: event.desc })
      setShowDetail({
        ...showDetail,
        id: event.id,
        title: event.title,
        start: date_start_string,
        end: date_end_string,
        allDay: event.allDay,
        desc: event.desc,
        start_format: event.start,
        end_format: event.end,
        pattern: 'dd/MM/yyyy'
      })
      setOpenEdit(true);
    } else {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date_start_string = event.start.toLocaleDateString("th", options) + ' (' + convert_timezone(event.start) + ' น.)';
      const date_end_string = event.end.toLocaleDateString("th", options) + ' (' + convert_timezone(event.end) + ' น.)';
      setLog({ ...Log, start: event.start, end: event.end })
      setForm({ ...Form, id: event.id, allDay: true, start: event.start, end: decrease_day(event.end), desc: event.desc })
      setShowDetail({
        ...showDetail,
        id: event.id,
        title: event.title,
        start: date_start_string,
        end: date_end_string,
        allDay: event.allDay,
        desc: event.desc,
        start_format: event.start,
        end_format: event.end,
        pattern: 'dd/MM/yyyy HH:mm'
      })
      setOpenEdit(true);
    }
  }

  const AddEvent = (event) => {

    if (event.action === 'doubleClick') {
      if (convert_timezone(event.start) === '00:00' && convert_timezone(event.end) === '00:00') {
        setFormatDate('dd/MM/yyyy');
        setLog({ ...Log, start: event.start, end: decrease_day(event.end) })
        setForm({ ...Form, allDay: true, start: event.start, end: decrease_day(event.end) })
      } else {
        setFormatDate('dd/MM/yyyy HH:mm');
        setLog({ ...Log, start: event.start, end: event.end })
        setForm({ ...Form, allDay: false, start: event.start, end: event.end })
      }
      setOpenDetail(true);
    }

    if (event.action === 'select') {
      if (convert_timezone(event.start) === '00:00' && convert_timezone(event.end) === '00:00') {
        setFormatDate('dd/MM/yyyy');
        setLog({ ...Log, start: event.start, end: decrease_day(event.end) })
        setForm({ ...Form, allDay: true, start: event.start, end: decrease_day(event.end) })

      } else {
        setFormatDate('dd/MM/yyyy HH:mm');
        setLog({ ...Log, start: event.start, end: event.end })
        setForm({ ...Form, allDay: false, start: event.start, end: event.end })
      }
      setOpenDetail(true);
    }
  }

  const DeleteEvent = (event) => {
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
        Delete(showDetail.id);
      }
    });
  }

  const handleStartDate = (date) => {
    setLog({ ...Log, start: date });
    setForm({ ...Form, start: date });
  }

  const handleEndDate = (date) => {
    setLog({ ...Log, end: date });
    setForm({ ...Form, end: date });
  }

  const keyValue = (value) => {
    if (value !== '0' && value !== '00' && value !== '01' && value !== '02' && value !== '03' && value !== '04' && value !== '05' &&
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

  function clear(e, n) {
    setLog({ start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0), end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59), });
    setFormatDate('dd/MM/yyyy');
    setEdit(false)
    if (e === 'add') {
      setForm({
        ...Form,
        id: Form.id + 1,
        title: '',
        allDay: true,
        repeat: false,
        year: 1,
        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
        desc: ''
      })
      setCount({ ...Count, id: Count.id + 1 })

    } else if (e === 'repeat') {
      setForm({
        ...Form,
        id: Form.id + n,
        title: '',
        allDay: true,
        repeat: false,
        year: 1,
        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
        desc: ''
      })

      setCount({ ...Count, id: Count.id + n })
    } else {
      setForm({
        ...Form,
        id: Count.id,
        title: '',
        allDay: true,
        repeat: false,
        year: 1,
        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
        desc: ''
      })
    }

    setMsgCount(0)
  }

  const formats = {

    dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
      return (moment(start).format('DD') + ' - ' + moment(end).format('DD') + ' ' + moment(start).format('MMMM'));
    },

    dayHeaderFormat: (date, empty, localizer) => {
      return (moment(date).format('dddd')) + ' ' + localizer.format(date, 'D', 'th') + ' ' + moment(date).format('MMMM');
    }
  }

  const eventPropGetter = (event, start, end, isSelected) => {
    var style = { fontSize: '12px' };
    return {
      style: style
    };
  }

  function EventAgenda({ event }) {
    return (
      <span>
        <span style={{ color: 'magenta' }}>{event.title}</span>
        <p style={{ fontSize: '14px' }}>{event.desc}</p>
      </span>
    )
  }

  return (
    <>
      <Loading classes={classes} status={isLoading} />
      <Headers classes={classes} func={handleCreateEvent} status={promise} />
      <Calendar
        eventPropGetter={eventPropGetter}
        // dayPropGetter={customDayPropGetter}
        formats={formats}
        selectable
        views={view}
        events={Myevent}
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        onSelectSlot={AddEvent}
        onDoubleClickEvent={SelectEvent}
        style={{ height: "65vh" }}
        messages={{
          today: "Today",
          previous: "<",
          next: ">",
          month: "Month",
          week: "Week",
          day: "Day"
        }}
        showMultiDayTimes={true}
        components={{
          agenda: {
            event: EventAgenda,
          },
        }}

      />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
        <Dialog
          onClose={CloseDialog}
          fullWidth={true}
          maxWidth="sm"
          aria-labelledby="customized-dialog-title"
          open={open}>
          <MuiDialogTitle id="customized-dialog-title" onClose={CloseDialog}>
            {(!Edit) ? 'New Event' : 'Edit Event'}
          </MuiDialogTitle>
          <MuiDialogContent dividers>
            <form id="hook" onSubmit={handleSubmitEvent}>
              <Grid container spacing={2}>
                <Grid item xs={12} >
                  <TextField
                    name="Title"
                    label="Title"
                    margin="dense"
                    variant="outlined"
                    value={Form.title}
                    onChange={(event) => {
                      setForm({ ...Form, title: event.target.value });
                    }}
                    inputProps={{ maxLength: 80, className: classes.font_normal, }}
                    InputProps={{
                      className: classes.font_normal,
                    }}
                    InputLabelProps={{
                      className: classes.font_normal,
                      shrink: true
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DateTimePicker
                    label="Start"
                    format={formatDate}
                    value={Form.start}
                    onChange={handleStartDate}
                    margin="dense"
                    inputVariant="outlined"
                    cancelLabel="ยกเลิก"
                    okLabel="ตกลง"
                    ampm={false}
                    invalidDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                    maxDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                    minDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                    InputProps={{
                      className: classes.font_normal,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <InsertInvitation />
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
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DateTimePicker
                    label="End"
                    format={formatDate}
                    value={Form.end}
                    onChange={handleEndDate}
                    margin="dense"
                    inputVariant="outlined"
                    cancelLabel="ยกเลิก"
                    okLabel="ตกลง"
                    ampm={false}
                    invalidDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                    maxDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                    minDateMessage="รูปแบบไม่ถูกต้อง กรุณาตรวจสอบ"
                    InputProps={{
                      className: classes.font_normal,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <InsertInvitation />
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
                </Grid>
                <Grid item xs={12} >
                  <FormGroup>
                    <Box className={classes.displayflex}>
                      <FormControlLabel
                        classes={{ label: classes.font_normal }} control={
                          <Checkbox color="primary"
                            checked={Form.allDay}
                            onChange={handleAllDay}
                          />
                        }
                        label="All day" />
                      <FormControlLabel
                        classes={{ label: classes.font_normal }} control={
                          <Checkbox color="primary"
                            checked={Form.repeat}
                            onChange={handleRepeat}
                          />
                        }
                        label="Repeat" />
                    </Box>
                  </FormGroup>
                  {(Form.repeat) &&
                    <TextField
                      name="year"
                      label="Reapeat every : Year(s)"
                      margin="dense"
                      variant="outlined"
                      type="number"
                      value={Form.year}
                      onChange={(event) => {
                        (keyValue(event.target.value)) && setForm({ ...Form, year: event.target.value });
                      }}
                      onKeyDown={(e) => { formatInput(e) }}
                      inputProps={{ min: 1, className: classes.font_normal, }}
                      InputProps={{
                        className: classes.font_normal,
                      }}
                      InputLabelProps={{
                        className: classes.font_normal,
                        shrink: true
                      }}
                      fullWidth
                      required
                    />}
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    name="desc"
                    variant="outlined"
                    placeholder="Description"
                    rows={3}
                    value={Form.desc}
                    onChange={(event) => {
                      setForm({ ...Form, desc: event.target.value });
                      setMsgCount(event.target.value.length);
                    }}
                    inputProps={{ maxLength: 256, className: classes.font_normal, }}
                    InputProps={{
                      className: classes.font_normal,
                    }}
                    InputLabelProps={{
                      className: classes.font_normal,
                      shrink: true
                    }}
                    multiline
                    fullWidth
                  />
                  <FormHelperText className={classes.font_small}>จำนวนตัวอักษร {msgCount} / 256</FormHelperText>
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
            >
              Save
            </Button>
            <Button
              className={classes.font_normal}
              onClick={CloseDialog}
              variant="outlined"
              color="primary">
              Cancel
            </Button>
          </MuiDialogActions>
        </Dialog>
      </MuiPickersUtilsProvider>

      <Dialog
        onClose={CloseDialogDetail}
        fullWidth={true}
        maxWidth="xs"
        aria-labelledby="customized-dialog-title"
        open={openDetail}>
        <MuiDialogTitle id="customized-dialog-title" onClose={CloseDialogDetail}>
          New Event
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <form id="hookDetail" onSubmit={handleSubmitEvent}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  name="Title"
                  label="Add Title"
                  margin="dense"
                  variant="outlined"
                  value={Form.title}
                  onChange={(event) => {
                    setForm({ ...Form, title: event.target.value });
                  }}
                  inputProps={{ maxLength: 80, className: classes.font_normal, }}
                  InputProps={{
                    className: classes.font_normal,
                  }}
                  InputLabelProps={{
                    className: classes.font_normal,
                    shrink: true
                  }}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </form>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button
            disabled={promise}
            onClick={MoreDetail}
            className={classes.font_normal}
            variant="outlined"
            color="primary"
          >
            More Detail
          </Button>
          <Button
            disabled={promise}
            form="hookDetail"
            type="submit"
            className={classes.font_normal}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </MuiDialogActions>
      </Dialog>

      <Dialog
        onClose={CloseDialogEdit}
        fullWidth={true}
        maxWidth="xs"
        aria-labelledby="customized-dialog-title"
        open={openEdit}>
        <MuiDialogTitle id="customized-dialog-title" onClose={CloseDialogEdit}>
          Detail Event
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <p className={classes.StyleDetail}> {showDetail.title}</p>
          <Box mt={3} className={classes.displayflex}>
            <EventNote color="action" fontSize="small" />&nbsp;&nbsp;
            {(showDetail.start !== showDetail.end) ?
              <span className={classes.font_normal}>{showDetail.start} - {showDetail.end} {(showDetail.allDay) && '(ทั้งวัน)'}</span> :
              <span className={classes.font_normal}>{showDetail.start} {(showDetail.allDay) && '(ทั้งวัน)'}</span>
            }
          </Box>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button
            disabled={promise}
            onClick={MoreDetailEdit}
            className={classes.font_normal}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
          <Button
            disabled={promise}
            onClick={DeleteEvent}
            className={classes.font_normal}
            variant="outlined"
            color="primary"
          >
            Delete
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  );
}
