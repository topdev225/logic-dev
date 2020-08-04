const snackbarAlert = (state = {
  alertOpen: false,
  vertical: 'top',
  horizontal: 'center',
  alertContent: "",
  severity: ""
}, action) => {
  switch(action.type){
    case "NEW_ALERT":
      return {
        ...state,
        alertOpen: true,
        alertContent: action.payload.content,
        severity: action.payload.severity
        }
    case "CLOSE_ALERT":
      return {
        ...state,
        alertOpen: false,
      }
    default:
      return state
  }
}

export default snackbarAlert
