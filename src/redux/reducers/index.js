import dataDisplayType from './dataDisplayType'
import selectedOrganizations from './selectedOrganizations'
import selectedDevices from './selectedDevices'
import selectedServices from './selectedServices'
import selectedSeries from './selectedSeries'
import populatedServices from './populatedServices'
import fetchedWizardData from './fetchedWizardData'
import servicesHaveChanged from './servicesHaveChanged'
import fetchedDashboardData from './fetchedDashboardData'
import layoutChangeHasFinished from './layoutChangeHasFinished'
import aChangeHasBeenMade from './aChangeHasBeenMade'
import panelName from './panelName'
import seriesColors from './seriesColors'
import graphOptions from './graphOptions'
import snackbarAlert from './snackbarAlert'
import panelIsBeingEdited from './panelIsBeingEdited'


import {combineReducers} from 'redux'


const rootReducer = combineReducers({
    dataDisplayType,
    selectedOrganizations,
    selectedDevices,
    selectedServices,
    selectedSeries,
    populatedServices,
    fetchedWizardData,
    servicesHaveChanged,
    panelName,
    fetchedDashboardData,
    layoutChangeHasFinished,
    aChangeHasBeenMade,
    seriesColors,
    graphOptions,
    snackbarAlert,
    panelIsBeingEdited
})


export default rootReducer
