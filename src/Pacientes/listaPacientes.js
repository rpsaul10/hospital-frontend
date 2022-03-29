import React, { useState, useEffect } from 'react'  
import Table from '@material-ui/core/Table';  
import TableBody from '@material-ui/core/TableBody';  
import TableCell from '@material-ui/core/TableCell';  
import TableContainer from '@material-ui/core/TableContainer';  
import TableRow from '@material-ui/core/TableRow';  
import Paper from '@material-ui/core/Paper';
import TablePagination from '@mui/material/TablePagination';
import SortTable from '../Components/SortTable';
import EnhancedTableHead from '../Components/HeadSortTable';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button'
import { Link, Redirect, useLocation } from 'react-router-dom';
import axios from 'axios';

const headCells = [
  { id: 'noExpediente', numeric: false, label: 'No. Expediente' },
  { id: 'nombre', numeric: false, label: 'Nombre' },
  { id: 'apPaterno', numeric: false, label: 'Apellido Paterno' },
  { id: 'apMaerno', numeric: false, label: 'Apellido Materno' },
  { id: 'fechaNacimiento', numeric: false, label: 'Edad' },
  { id: 'fechaNacimiento', numeric: false, label: 'Fecha de Nacimiento' },
]

export default function ListaPacientes (props) {
  const [pacientes,setPacientes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('noExpediente');
  const [errorbd, setErrorbd] = useState(false);
  //const [token, setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  //const location = useLocation();
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    axios.get("https://localhost:5001/hospitalBoca/pacientes/all", {
      headers : {
        'Content-type': 'application/json',
        //'Authorization': `Bearer ${token}`
      }
    }).then (
      (response) => {
        if (response.status === 200) {
          setPacientes(response.data);
          setErrorbd(false);
        }
      },
      (error) => {
        if(!error.response) setErrorbd(true);
        /*else{
          if (error.response.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
            setToken('');
            setErrorbd(false);
          }
        }*/
      }
    );
  },[])
  

  const dateFormatter = (date) => {
    var formatter = new Intl.DateTimeFormat('en-mx', 'DD-MM-YYYY');
    return formatter.format(new Date (date));
  }

  const getAge = (d1) => {
    d1 = new Date(d1.slice(0,10))
    const d2 = new Date();
    const diff = d2.getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

    
  if(errorbd) return <Redirect to='/error'/>;
  /*if(!token){
    return(
      //console.log(location.pathname),
      <Redirect to={
        {
          pathname:'/login',
          state:{
            from: location
          }
        }
      }/>
    )
  }*/

  return (
    <Paper>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
          <EnhancedTableHead
            sx={visuallyHidden}
            order={order}
            orderBy={orderBy}
            headCells={headCells}
            onRequestSort={handleRequestSort}
          />
                  
          <TableBody>
            {SortTable.stableSort(pacientes, SortTable.getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map ((item) =>{
              return( 
                <TableRow key={item.noExpediente}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.apPaterno}</TableCell>
                  <TableCell>{item.apMaerno}</TableCell>
                  <TableCell>{getAge(item.fechaNacimiento)} años</TableCell>
                  <TableCell>{dateFormatter(item.fechaNacimiento)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
      rowsPerPageOptions={[5, 10, 50]}
      component="div"
      count={pacientes.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
    </Paper>
  );
}  