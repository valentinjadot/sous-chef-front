import React, { useEffect, useState } from "react";
import SimpleDialog from "./SimpleDialog";

// MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";

// Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

// Whatsapp API
import { postMessage } from "../api/postMessage";

// Utils
import { orderSummary } from "../utils/orderSummary";

const Participant = () => {
  useEffect(() => {
    const firebaseConfig = {
      databaseURL: `${process.env.REACT_APP_FIREBASE_DB_URL}`,
    };
    const app = initializeApp(firebaseConfig);
    const firebaseData = ref(getDatabase());

    get(child(firebaseData, `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setParticipants([snapshot.val()][0]);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }); //TODO: no quiero renderizar siempre, solo cuando cambien los participantes pero no lo puedo dejar como dependencia

  const [participants, setParticipants] = useState([]);
  const [open, setOpen] = useState(false);

  const submitMessageHandler = () => {
    const order = orderSummary(participants);
    postMessage(order);
  };

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1).toString();
  let tomorrowDate = tomorrow.toDateString();

  return (
    <div className="App">
      <p>Comidas para mañana! 🐷 🥬</p>
      <p>Fecha del pedido: {tomorrowDate}</p>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Almuerzo</TableCell>
              <TableCell align="right">Cena</TableCell>
              <TableCell align="right">TA Almuerzo</TableCell>
              <TableCell align="right">TA Cena</TableCell>
              <TableCell align="right">Vegano</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants?.map((person, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {person.name}
                </TableCell>
                <TableCell align="right">
                  <Switch defaultChecked={person.lunch} color="warning" />
                </TableCell>
                <TableCell align="right">
                  <Switch defaultChecked={person.dinner} color="warning" />
                </TableCell>
                <TableCell align="right">
                  <Switch defaultChecked={person.ta_lunch} color="warning" />
                </TableCell>
                <TableCell align="right">
                  <Switch defaultChecked={person.ta_dinner} color="warning" />
                </TableCell>
                <TableCell align="right">
                  <Switch defaultChecked={person.vegan} color="warning" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br></br>
      <Button variant="contained" color="warning" onClick={() => setOpen(true)}>
        Agregar invitado
      </Button>
      <br></br>
      <br></br>
      <SimpleDialog open={open} onClose={() => setOpen(false)} />

      <Button
        variant="contained"
        color="success"
        onClick={submitMessageHandler}
      >
        Enviar a Hugo
      </Button>
    </div>
  );
};

export default Participant;
