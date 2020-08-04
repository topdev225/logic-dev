const panelIsBeingEdited = (state = {
  value: false,
  index: null,
  edit: false,
  adding: false,
  deleting: false
}, action) => {
  switch(action.type){
    case "PANEL_IS_BEING_EDITED":
      return {
        ...state,
        value: action.payload.value,
        index: action.payload.index
      }
    case "PANEL_EDIT_TOGGLE":
      return {
        ...state,
        edit: action.payload
      }
    case "PANEL_IS_BEING_ADDED":
      return {
        ...state,
        adding: action.payload
      }
    case "PANEL_IS_BEING_DELETED":
      return {
        ...state,
        adding: action.payload
      }
    default:
      return state
  }
}

export default panelIsBeingEdited
