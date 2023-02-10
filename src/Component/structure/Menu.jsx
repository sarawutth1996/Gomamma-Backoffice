/* eslint-disable */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar, Box, Collapse, Divider, List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Typography, Badge,
} from "@material-ui/core";

import {
  Alarm, Assignment, AssignmentTurnedIn, ArrowDropUp, ArrowDropDown, Bookmarks,
  Feedback, FormatListNumbered, Directions, LocalTaxi, LocalOffer, Description, Dashboard, EmojiEvents,
  EventNote, Person, PersonAdd, MyLocation, AttachFile, Redeem, Telegram, StarHalf, ExpandMore, ExpandLess,
  SubdirectoryArrowRight, Help
} from "@material-ui/icons";
import ListIcon from '@material-ui/icons/List';
import * as action from "../actions/action";
import config from '../config'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  cspdlp: {
    paddingLeft: "12px",
    color: "white",
  },
  cspdlm: {
    paddingLeft: "9px",
  },
  csDashb: {
    color: "white",
    boxShadow:
      "0 12px 20px -10px rgb(217 173 30 / 15%), 0 4px 20px 0 rgb(0 0 0 / 15%), 0 7px 8px -5px rgb(185 135 1 / 15%)",
    backgroundColor: "#FFCB08",
    "&:hover": {
      backgroundColor: "#FFCB08",
    },
  },
  ThemeColWht: {
    color: "white",
  },
  ThemeColLine: {
    backgroundColor: "#414141",
  },
  ThemeColHeadd: {
    margin: theme.spacing(2, 0),
    color: "#bcc1c6",
    paddingLeft: "28px",
    fontFamily: 'Regular',
    fontSize: '14px'
  },
  ThemeHover: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
  },
  font_header: {
    fontFamily: 'SemiBold',
    margin: '10px',
    fontSize: '18px'
  },
  font_medium: {
    fontFamily: 'Regular',
    fontSize: '16px'
  },
  font_normal: {
    fontFamily: 'Regular',
    fontSize: '14px'
  }
}));

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}



function GetIcon(icon, classes) {
  switch (icon) {
    case 'Dashboard':
      return (<Dashboard className={classes.ThemeColWht} />);
    case 'Assignment':
      return (<Assignment className={classes.ThemeColWht} />);
    case 'EventNote':
      return (<EventNote className={classes.ThemeColWht} />);
    case 'EmojiEvents':
      return (<EmojiEvents className={classes.ThemeColWht} />);
    case 'Description':
      return (<Description className={classes.ThemeColWht} />);
    case 'PersonAdd':
      return (<PersonAdd className={classes.ThemeColWht} />);
    case 'MyLocation':
      return (<MyLocation className={classes.ThemeColWht} />);
    case 'AttachFile':
      return (<AttachFile className={classes.ThemeColWht} />);
    case 'Redeem':
      return (<Redeem className={classes.ThemeColWht} />);
    case 'LocalOffer':
      return (<LocalOffer className={classes.ThemeColWht} />);
    case 'ListIcon':
      return (<ListIcon className={classes.ThemeColWht} />);
    case 'Alarm':
      return (<Alarm className={classes.ThemeColWht} />);
    case 'LocalTaxi':
      return (<LocalTaxi className={classes.ThemeColWht} />);
    case 'AssignmentTurnedIn':
      return (<AssignmentTurnedIn className={classes.ThemeColWht} />);
    case 'Directions':
      return (<Directions className={classes.ThemeColWht} />);
    case 'FormatListNumbered':
      return (<FormatListNumbered className={classes.ThemeColWht} />);
    case 'Feedback':
      return (<Feedback className={classes.ThemeColWht} />);
    case 'Telegram':
      return (<Telegram className={classes.ThemeColWht} />);
    case 'StarHalf':
      return (<StarHalf className={classes.ThemeColWht} />);
    case 'Bookmarks':
      return (<Bookmarks className={classes.ThemeColWht} />);
    case 'Help':
      return (<Help className={classes.ThemeColWht} />);
    default:
      return '';
  }
}

export default function ListMenu() {
  const url = config.API_URL + "models/Employee/Employee_leave_form.php";
  const classes = useStyles();
  const state = useHistory();
  const PoolData = useSelector(({ PromiseReducer }) => PromiseReducer);
  const dispatch = useDispatch();
  const name = PoolData.fname + " " + PoolData.lname
  const [openState, setState] = useState(false);
  const [ListProfile, openMenuProfile] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [exvision, setExvision] = useState(null);
  // const [Extramenu, setExtramenu] = useState([
  //   { id: '1', gmm_menu_name: "Trip record", gmm_menu_path: "/Home/Report_trip_record", gmm_menu_vision: "w" },
  //   { id: '2', gmm_menu_name: "Invoice record", gmm_menu_path: "/Home/Report_invoice_record", gmm_menu_vision: "w" },
  //   { id: '3', gmm_menu_name: "Passenger profile", gmm_menu_path: "/Home/Report_passenger_profile", gmm_menu_vision: "w" },
  //   { id: '4', gmm_menu_name: "User profile", gmm_menu_path: "/Home/Report_user_profile", gmm_menu_vision: "w" },
  //   { id: '5', gmm_menu_name: "Taxi profile", gmm_menu_path: "/Home/Report_taxi_profile", gmm_menu_vision: "w" },
  //   { id: '6', gmm_menu_name: "CG profile", gmm_menu_path: "/Home/Report_cg_profile", gmm_menu_vision: "w" },
  //   { id: '7', gmm_menu_name: "Work day", gmm_menu_path: "/Home/Report_work_day", gmm_menu_vision: "w" },
  //   { id: '8', gmm_menu_name: "Zone master", gmm_menu_path: "/Home/Report_zone_master", gmm_menu_vision: "w" },
  //   { id: '9', gmm_menu_name: "Zone report", gmm_menu_path: "/Home/Report_zone_emp", gmm_menu_vision: "w" },
  //   { id: '10', gmm_menu_name: "Coupon Master", gmm_menu_path: "/Home/Report_package_master", gmm_menu_vision: "w" },
  //   { id: '11', gmm_menu_name: "Discount code Master", gmm_menu_path: "/Home/Report_coupon_master", gmm_menu_vision: "w" },
  //   { id: '12', gmm_menu_name: "Promotion Master", gmm_menu_path: "/Home/Report_promotion_master", gmm_menu_vision: "w" },
  //   { id: '13', gmm_menu_name: "Timing & Distance", gmm_menu_path: "/Home/Report_trip_calculator", gmm_menu_vision: "w" },
  //   { id: '14', gmm_menu_name: "Search Count", gmm_menu_path: "/Home/Report_count", gmm_menu_vision: "w" },
  //   { id: '15', gmm_menu_name: "Partner Master", gmm_menu_path: "/Home/Report_partner_master", gmm_menu_vision: "w" },
  //   { id: '16', gmm_menu_name: "Reward Master", gmm_menu_path: "/Home/Report_reward_master", gmm_menu_vision: "w" },
  //   { id: '17', gmm_menu_name: "Redeem record", gmm_menu_path: "/Home/Report_redeem_record", gmm_menu_vision: "w" },
  //   { id: '18', gmm_menu_name: "Assessment", gmm_menu_path: "/Home/Report_assessment", gmm_menu_vision: "w" },
  //   { id: '19', gmm_menu_name: "Taxi/CG Ranking", gmm_menu_path: "/Home/Report_score", gmm_menu_vision: "w" },
  // ]);


  const [Extramenu, setExtramenu] = useState([
    { id: '1', gmm_menu_name: "Trip record", gmm_menu_path: "/Home/Report_trip_record", gmm_menu_vision: "w" },
    { id: '2', gmm_menu_name: "Invoice record", gmm_menu_path: "/Home/Report_invoice_record", gmm_menu_vision: "w" },
    { id: '3', gmm_menu_name: "Passenger profile", gmm_menu_path: "/Home/Report_passenger_profile", gmm_menu_vision: "w" },
    { id: '4', gmm_menu_name: "User profile", gmm_menu_path: "/Home/Report_user_profile", gmm_menu_vision: "w" },
    { id: '5', gmm_menu_name: "Taxi profile", gmm_menu_path: "/Home/Report_taxi_profile", gmm_menu_vision: "w" },
    { id: '6', gmm_menu_name: "CG profile", gmm_menu_path: "/Home/Report_cg_profile", gmm_menu_vision: "w" },
    { id: '7', gmm_menu_name: "Work day", gmm_menu_path: "/Home/Report_work_day", gmm_menu_vision: "w" },
    { id: '8', gmm_menu_name: "Zone master", gmm_menu_path: "/Home/Report_zone_master", gmm_menu_vision: "w" },
    { id: '9', gmm_menu_name: "Zone report", gmm_menu_path: "/Home/Report_zone_emp", gmm_menu_vision: "w" },
    { id: '10', gmm_menu_name: "Coupon Master", gmm_menu_path: "/Home/Report_package_master", gmm_menu_vision: "w" },
    { id: '11', gmm_menu_name: "Discount code Master", gmm_menu_path: "/Home/Report_coupon_master", gmm_menu_vision: "w" },
    { id: '12', gmm_menu_name: "Promotion Master", gmm_menu_path: "/Home/Report_promotion_master", gmm_menu_vision: "w" },
    { id: '13', gmm_menu_name: "Timing & Distance", gmm_menu_path: "/Home/Report_trip_calculator", gmm_menu_vision: "w" },
    { id: '14', gmm_menu_name: "Search Count", gmm_menu_path: "/Home/Report_count", gmm_menu_vision: "w" },
    { id: '15', gmm_menu_name: "Redeem record", gmm_menu_path: "/Home/Report_redeem_record", gmm_menu_vision: "w" },
    { id: '16', gmm_menu_name: "Assessment", gmm_menu_path: "/Home/Report_assessment", gmm_menu_vision: "w" },
    { id: '17', gmm_menu_name: "Taxi/CG Ranking", gmm_menu_path: "/Home/Report_score", gmm_menu_vision: "w" },
  ]);




  useEffect(() => {
    FirstLoad('PENDING');
  }, []);

  async function FirstLoad(status) {

    //--------------------------------
    const payload = JSON.stringify({
      key: "Payload_report_leave",
      status: status
    });

    const response = await fetch(url, { method: "POST", body: payload });
    await sleep(0);
    const res = await response.json();
    if (res.status) {
      const Payload = JSON.parse(localStorage.cnf_us);
      const isData = { ...Payload, mail_leave: Number(res.count), feedback: Number(res.count_feedback) };
      localStorage.setItem("cnf_us", JSON.stringify(isData));
      dispatch(action.setPromise(isData));
    }
  }


  const handleClick = () => {
    openMenuProfile(!ListProfile);
  };

  const handleListItemClick = (event, pm) => {
    if (pm.gmm_menu_path !== "/Home/Report") {
      state.push(pm.gmm_menu_path + '/' + pm.gmm_menu_vision);
    } else {
      setExvision(pm.gmm_menu_vision)
      setState(!openState)
    }

    setSelectedIndex(pm.gmm_menu_line_index);

  };

  const handleListReportClick = (row) => {
    state.push(row.gmm_menu_path + '/' + exvision);
  }

  const handleEdit = (event) => {
    state.push('/Home/EditProfile');
  }

  return (
    <Box>
      <Divider className={classes.ThemeColLine} />
      <ListItem button onClick={handleClick}>
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: "#FFCB08" }}>
            <Person />
          </Avatar>
        </ListItemAvatar>
        <ListItemText className={classes.ThemeColWht}>
          <Typography className={classes.font_normal}>{name}</Typography>
        </ListItemText>
        {ListProfile ? (
          <ArrowDropUp className={classes.ThemeColWht} />
        ) : (
          <ArrowDropDown className={classes.ThemeColWht} />
        )}
      </ListItem>
      <Collapse in={ListProfile} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem className={classes.ThemeHover} onClick={handleEdit} button>
            <ListItemIcon className={classes.cspdlp}>ED</ListItemIcon>
            <ListItemText className={classes.ThemeColWht}>
              <Typography className={classes.font_normal}>แก้ไขโปรไฟล์</Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Collapse>
      <Divider className={classes.ThemeColLine} />
      <Box mt={2}>
        <List component="nav">
          <ListItem className={classes.csDashb} button>
            <ListItemIcon className={classes.cspdlm}>
              <Dashboard className={classes.ThemeColWht} />
            </ListItemIcon>
            <ListItemText className={classes.ThemeColWht}>
              <Typography className={classes.font_medium} >Backoffice</Typography>
            </ListItemText>
          </ListItem>
          {/* ############################################## */}
          {/* ###################  ADMIN  ################## */}
          {/* ############################################## */}
          {PoolData.vision.map((pm, index) =>
            <div key={index} >
              <ListItemText >
                <Typography className={classes.ThemeColHeadd}> {pm.name}</Typography>
              </ListItemText>
              {pm.menu.map((sub_menu, index) =>
                (sub_menu.gmm_menu_vision !== 'h') && (
                  <ListItem
                    key={index}
                    selected={selectedIndex === sub_menu.gmm_menu_line_index}
                    onClick={(event) => handleListItemClick(event, sub_menu)}
                    className={classes.ThemeHover}
                    button
                  >
                    <ListItemIcon className={classes.cspdlm}>
                      {sub_menu.gmm_menu_name == 'อนุมัติการลา' &&

                        <Badge color="secondary" badgeContent={PoolData.mail_leave} showZero={false}>
                          {GetIcon(sub_menu.gmm_menu_icon, classes)}
                        </Badge>}

                      {sub_menu.gmm_menu_name == 'การร้องเรียน' &&

                        <Badge color="secondary" badgeContent={PoolData.feedback} showZero={false}>
                          {GetIcon(sub_menu.gmm_menu_icon, classes)}
                        </Badge>}

                      {sub_menu.gmm_menu_name !== 'อนุมัติการลา' && sub_menu.gmm_menu_name !== 'การร้องเรียน' && GetIcon(sub_menu.gmm_menu_icon, classes)}



                    </ListItemIcon>
                    <ListItemText className={classes.ThemeColWht}>
                      <Typography className={classes.font_normal}>  {sub_menu.gmm_menu_name}</Typography>
                    </ListItemText>
                    {sub_menu.gmm_menu_name === 'รายงาน' &&
                      <ListItemIcon style={{ justifyContent: 'end' }} className={classes.cspdlm} >
                        {openState ?
                          <ExpandMore className={classes.ThemeColWht} fontSize="small" /> :
                          <ExpandLess className={classes.ThemeColWht} fontSize="small" />}

                      </ListItemIcon>
                    }
                  </ListItem>


                )
              )}

            </div>
          )}
        </List>
        <Collapse in={openState} timeout="auto" unmountOnExit >
          {Extramenu.map((ele) => (
            <List dense={false} component="nav" style={{ padding: 0 }} key={ele.id}>
              <ListItem className={classes.ThemeHover} onClick={() => { handleListReportClick(ele) }} button>
                {/* style={{ paddingLeft: 56 }} */}
                <ListItemIcon className={classes.cspdlm}>
                  <SubdirectoryArrowRight className={classes.ThemeColWht} fontSize="small" />
                </ListItemIcon>
                <ListItemText className={classes.ThemeColWht}>
                  <Typography className={classes.font_normal}>{ele.gmm_menu_name}</Typography>
                </ListItemText>
              </ListItem>
            </List>
          ))}
        </Collapse>
      </Box>
    </Box >
  );

}