const fetchedWizardData = (state = {data: []}, action) => {
  switch(action.type){
    case "POPULATE_DATA":
      return {
        ...state,
        data: action.payload
      }
    case "REFRESH_DATA":
      return {
        ...state,
        data: []
      }
    default:
      return state
  }
}

export default fetchedWizardData
