import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import ListaPacientes from '../Pacientes/listaPacientes';

export default function MainRoutes() {
    return(
        <Switch>
            <Route exact path="/pacientes">
                <ListaPacientes/>
            </Route>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route path="*">
                <h1> Oops! La página que buscas no existe :(</h1>
            </Route>
        </Switch>
    );
    
}