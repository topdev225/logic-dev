const servicesHaveChanged = (state = {servicesHaveChanged: false}, action) => {
  switch(action.type){
    case "TOGGLE_SERVICES":
      return {
        ...state,
        servicesHaveChanged: action.payload
      }
    default:
      return state
  }
}

export default servicesHaveChanged
