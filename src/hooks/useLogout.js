import { useAuthContext } from "./useAuthContext"

import { useWorkoutsContext } from "./useWorkoutsContext"

export const useLogout = () => {

    const { dispatch } = useAuthContext()
    const {dispatch: workoutsDispatch} = useWorkoutsContext()

    const logout = () => {

        // remove from local storage
        localStorage.removeItem('user')

        // remove from Auth state (dispatch logout function)
        dispatch({type: 'LOGOUT'})
        workoutsDispatch({type: 'SET_WORKOUTS', payload: null})
    }
    return { logout }
}