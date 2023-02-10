const initiaState = {
  id: "",
  fname: "",
  lname: "",
  lv: "",
  vision: [],
  mail_leave: 0,
  feedback: 0
};

const PromiseReducer = (state = initiaState, { type, payload }) => {
  switch (type) {
    case "Payload_role":
      return {
        ...state,
        id: payload.id,
        fname: payload.fname,
        lname: payload.lname,
        lv: payload.lv,
        vision: payload.vision,
        mail_leave: payload.mail_leave,
        feedback: payload.feedback
      };
    default:
      return state;
  }
};



export default PromiseReducer;
