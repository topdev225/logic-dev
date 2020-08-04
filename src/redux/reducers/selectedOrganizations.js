const selectedOrganizations = (state = {organizations: []}, action) => {
  switch(action.type){
    case "ADD_ORGANIZATION":
      return {
        ...state,
        organizations: [...state.organizations, action.payload]
      }
    case "REMOVE_ORGANIZATION":
      return {
        ...state,
        organizations: state.organizations.filter(org => org.displayName !== action.payload)
      }
    case "ADD_ALL_ORGANIZATIONS":
      return {
        ...state,
        organizations: action.payload
      }
    case "RESET_ORGANIZATIONS":
      return {
        ...state,
        organizations: []
      }
    default:
      return state
  }
}

export default selectedOrganizations
