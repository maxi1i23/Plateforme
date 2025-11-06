import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Admin from '../components/dashboard/Admin'
import Agent from '../components/dashboard/Agent'
import Manager from '../components/dashboard/Manager'
import NotAuthorized from './NotAuthorized'

const Dashboard = () => {
    const { user } = useContext(AuthContext)

    if(user.role === 'Admin') return <Admin/>
    if(user.role === 'Manager') return <Manager/>
    if(user.role === 'Agent') return <Agent/>

    return <NotAuthorized/>
}

export default Dashboard
