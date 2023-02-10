import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Hidden,
  Container,
} from "@material-ui/core";
import { ExitToApp, MenuOpen } from "@material-ui/icons";
import Swal from 'sweetalert2'
import clsx from "clsx";
import ListMenu from "./Menu";
import auth from "../authPath/auth";
import * as action from "../actions/action";

// Tracking ID


//- Admin
import AdminUser from "../Page/Admin/AdminUser";
import AdminRole from "../Page/Admin/AdminRole";
import AdminCalendar from "../Page/Admin/AdminCalendar";
import AdminTimeService from "../Page/Admin/AdminTimeService";
import AdminEvaluation from "../Page/Admin/AdminEvaluation";
import AdminFormEvaluation from "../Page/Admin/AdminFormEvaluation";
import AdminSummary from "../Page/Admin/AdminSummary";
import EditProfile from "../Page/Admin/EditProfile";
import Helps from "../Page/Help/Helps";
import AdminFeedback from "../Page/Admin/AdminFeedback";
import AdminFormFeedback from "../Page/Admin/AdminFormFeedback";
import AdminSendAPI from "../Page/Admin/AdminSendAPI";

//- Customer
import ManageCust from "../Page/Customer/ManageCust";
import BookingDetail from "../Page/Customer/BookingDetail";
import CustPassenger from "../Page/Customer/CustPassenger";
import CustSignup from "../Page/Customer/CustSignup";
import CustBooking from "../Page/Customer/CustBooking";
import CustHistory from "../Page/Customer/CustHistory";
import CustTracking from "../Page/Customer/CustTracking";
import Monitor from "../Page/Customer/Monitor";


//- Employee
import ManageEmployee from "../Page/Employee/ManageEmployee";
import ManageStatus from "../Page/Employee/ManageStatus";
import ManageLeave from "../Page/Employee/ManageLeave";
import EmpCalendar from "../Page/Employee/EmpCalendar";
import EmpSignup from "../Page/Employee/EmpSignup";
import EmpFolder from "../Page/Employee/EmpFolder";
import EmpSettings from "../Page/Employee/EmpSettings";
import ManageZone from "../Page/Employee/ManageZone";
import LeaveForm from "../Page/Employee/LeaveForm";
import SettingZone from "../Page/Employee/SettingZone";

//- Reward
import ManagePartner from "../Page/Reward/ManagePartner";
import ManageRedeem from "../Page/Reward/ManageRedeem";
import ManageReward from "../Page/Reward/ManageReward";
import Shipping from "../Page/Reward/Shipping";
import Redeem from "../Page/Reward/Redeem";
import Reward from "../Page/Reward/Reward";
import Partner from "../Page/Reward/Partner";
import History from "../Page/Reward/History";

//- Item
import ManageProduct from "../Page/Item/ManageProduct";
import ManagePromotion from "../Page/Item/ManagePromotion";
import ManagePackage from "../Page/Item/ManagePackage";
import ManageCoupon from "../Page/Item/ManageCoupon";
import ManageMember from "../Page/Item/ManageMember";


import Product from "../Page/Item/Product";
import Promotion from "../Page/Item/Promotion";
import Package from "../Page/Item/Package";
import Coupon from "../Page/Item/Coupon";
import Member from "../Page/Item/Member";


import Report_trip_record from "../Page/Report/Report_trip_record";
import Report_passenger_profile from "../Page/Report/Report_passenger_profile";
import Report_user_profile from "../Page/Report/Report_user_profile";
import Report_taxi_profile from "../Page/Report/Report_taxi_profile";
import Report_cg_profile from "../Page/Report/Report_cg_profile";

import Report_work_day from "../Page/Report/Report_work_day";
import Report_zone_emp from "../Page/Report/Report_zone_emp";
import Report_zone_master from "../Page/Report/Report_zone_master";

import Report_invoice_record from "../Page/Report/Report_invoice_record";
import Report_package_master from "../Page/Report/Report_package_master";
import Report_coupon_master from "../Page/Report/Report_coupon_master";
import Report_promotion_master from "../Page/Report/Report_promotion_master";
import Report_trip_calculator from "../Page/Report/Report_trip_calculator";
import Report_count from "../Page/Report/Report_count";

import Report_partner_master from "../Page/Report/Report_partner_master";
import Report_reward_master from "../Page/Report/Report_reward_master";
import Report_redeem_record from "../Page/Report/Report_redeem_record";
import Report_assessment from "../Page/Report/Report_assessment";
import Report_score from "../Page/Report/Report_score";

const drawerWidth = 280;
const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    padding: '12px 0 12px 12px',
    backgroundColor: "rgb(38 38 38 )",
  },
  drawerContainer: {
    overflow: "auto",
    paddingRight: '12px',
    paddingLeft: '8px'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 280,
    },
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = ({ classes, Toggle, Logout }) => {
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={Toggle}
          className={classes.menuButton}
        >
          <MenuOpen />
        </IconButton>
        <Typography variant="h6" className={classes.title} noWrap>
          Go Mamma
        </Typography>
        <IconButton color="inherit" onClick={Logout}>
          <ExitToApp />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default function Layout(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const state = useHistory();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [Open, setOpen] = React.useState(true);

  useEffect(() => {
    const load = getLocalStorage();
    dispatch(action.setPromise(load));

    // eslint-disable-next-line
  }, []);

  const getLocalStorage = () => {
    return JSON.parse(localStorage.cnf_us);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setOpen(!Open);
  };

  const Logout = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Logout",
      text: "ท่านต้องการออกจากระบบ หรือไม่?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      //reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        auth.logout(() => {
          state.push("/");
        });
      }

    });

  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar classes={classes} Toggle={handleDrawerToggle} Logout={Logout} />
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Box className={classes.drawerContainer}>
            <ListMenu />
          </Box>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <Box className={classes.drawerContainer}>
            <ListMenu />
          </Box>
        </Drawer>
      </Hidden>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: mobileOpen,
        })}
      >
        <Container maxWidth="lg">
          <Toolbar />
          <Switch>
            <Route path="/Home/EditProfile" component={EditProfile} />
            <Route path="/Home/Helps/:vision" component={Helps} />

            <Route path="/Home/AdminUser/:vision" component={AdminUser} />
            <Route path="/Home/AdminTimeService/:vision" component={AdminTimeService} />
            <Route path="/Home/AdminEvaluation/:vision" component={AdminEvaluation} />
            <Route path="/Home/AdminFormEvaluation/:vision" component={AdminFormEvaluation} />
            <Route path="/Home/AdminSummary/:vision" component={AdminSummary} />
            <Route path="/Home/AdminFeedback/:vision" component={AdminFeedback} />
            <Route path="/Home/AdminFormFeedback/:vision" component={AdminFormFeedback} />
            <Route path="/Home/AdminCalendar/:vision" component={AdminCalendar} />
            <Route path="/Home/AdminSendAPI/:vision" component={AdminSendAPI} />
            <Route path="/Home/AdminRole/:vision/:id" component={AdminRole} />


            <Route path="/Home/ManageCust/:vision" component={ManageCust} />
            <Route path="/Home/BookingDetail/:vision/:inv" component={BookingDetail} />
            <Route path="/Home/CustPassenger/:vision/:uid/:pid" component={CustPassenger} />
            <Route path="/Home/CustSignup/:vision/:id" component={CustSignup} />
            <Route path="/Home/CustBooking/:vision" component={CustBooking} />
            <Route path="/Home/CustHistory/:vision" component={CustHistory} />
            <Route path="/Home/CustTracking/:vision" component={CustTracking} />


            <Route path="/Home/ManageEmployee/:vision" component={ManageEmployee} />
            <Route path="/Home/ManageStatus/:vision" component={ManageStatus} />
            <Route path="/Home/ManageLeave/:vision" component={ManageLeave} />
            <Route path="/Home/ManageZone/:vision" component={ManageZone} />
            <Route path="/Home/EmpCalendar/:vision" component={EmpCalendar} />
            <Route path="/Home/EmpSignup/:vision/:id" component={EmpSignup} />
            <Route path="/Home/EmpFolder/:vision/:id" component={EmpFolder} />
            <Route path="/Home/EmpSettings/:vision/:id" component={EmpSettings} />
            <Route path="/Home/LeaveForm/:vision/:id" component={LeaveForm} />
            <Route path="/Home/SettingZone/:vision/:id" component={SettingZone} />

            <Route path="/Home/ManageRedeem/:vision" component={ManageRedeem} />
            <Route path="/Home/ManagePartner/:vision" component={ManagePartner} />
            <Route path="/Home/ManageReward/:vision" component={ManageReward} />
            <Route path="/Home/Shipping/:vision" component={Shipping} />
            <Route path="/Home/Redeem/:vision/:id" component={Redeem} />
            <Route path="/Home/Reward/:vision/:id" component={Reward} />
            <Route path="/Home/Partner/:vision/:id" component={Partner} />
            <Route path="/Home/History/:vision/:id" component={History} />


            <Route path="/Home/ManageProduct/:vision" component={ManageProduct} />
            <Route path="/Home/ManagePromotion/:vision" component={ManagePromotion} />
            <Route path="/Home/ManagePackage/:vision" component={ManagePackage} />
            <Route path="/Home/ManageCoupon/:vision" component={ManageCoupon} />
            <Route path="/Home/ManageMember/:vision" component={ManageMember} />
            <Route path="/Home/Product/:vision/:id" component={Product} />
            <Route path="/Home/Promotion/:vision/:id" component={Promotion} />
            <Route path="/Home/Package/:vision/:id" component={Package} />
            <Route path="/Home/Coupon/:vision/:id" component={Coupon} />
            <Route path="/Home/Member/:vision/:id" component={Member} />


            <Route path="/Home/Report_trip_record/:vision" component={Report_trip_record} />
            <Route path="/Home/Report_passenger_profile/:vision" component={Report_passenger_profile} />
            <Route path="/Home/Report_user_profile/:vision" component={Report_user_profile} />
            <Route path="/Home/Report_taxi_profile/:vision" component={Report_taxi_profile} />
            <Route path="/Home/Report_cg_profile/:vision" component={Report_cg_profile} />
            <Route path="/Home/Report_work_day/:vision" component={Report_work_day} />
            <Route path="/Home/Report_zone_emp/:vision" component={Report_zone_emp} />
            <Route path="/Home/Report_zone_master/:vision" component={Report_zone_master} />
            <Route path="/Home/Report_invoice_record/:vision" component={Report_invoice_record} />
            <Route path="/Home/Report_package_master/:vision" component={Report_package_master} />
            <Route path="/Home/Report_coupon_master/:vision" component={Report_coupon_master} />
            <Route path="/Home/Report_promotion_master/:vision" component={Report_promotion_master} />
            <Route path="/Home/Report_trip_calculator/:vision" component={Report_trip_calculator} />
            <Route path="/Home/Report_count/:vision" component={Report_count} />
            <Route path="/Home/Report_partner_master/:vision" component={Report_partner_master} />
            <Route path="/Home/Report_reward_master/:vision" component={Report_reward_master} />
            <Route path="/Home/Report_redeem_record/:vision" component={Report_redeem_record} />
            <Route path="/Home/Report_assessment/:vision" component={Report_assessment} />
            <Route path="/Home/Report_score/:vision" component={Report_score} />




          </Switch>
        </Container>
        <Switch>
          <Route path="/Home/Monitor/:vision/:id" component={Monitor} />
        </Switch>


      </main>



    </div >
  );
}



Layout.propTypes = {
  window: PropTypes.func,
};
