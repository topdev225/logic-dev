
const newAlert = (content, severity) => {
  return {
    type: "NEW_ALERT",
    payload: {
      content: content,
      severity: severity
    }
  }
}

const closeAlert = () => {
  return {
    type: "CLOSE_ALERT",
  }
}




export default {
  newAlert,
  closeAlert
}
