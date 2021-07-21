import './App.css';
import api from './services/api'
import React, { useState, useEffect } from 'react'
import { TextField, Button } from '@material-ui/core';
import { MdDelete } from 'react-icons/md';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

function App() {
  const [equipamentos, setEquipamento] = useState([]);
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState("")
  const [pat, setPat] = useState("")

  async function createEquipamento(d, p) {
    d = desc;
    p = pat;
    console.log(d + " - " + p)
    if (d !== "" && p !== "") {
      await api.post("/", { descricao: desc, patrimonio: pat })
        .then(res => console.log("teste"));
      getAll()
      setDesc("")
      setPat("")
    }
  }

  const deleteEquipamento = (id, d) => {
    console.log(id)

    confirmAlert({
      title: 'Atenção!',
      message: 'Tem certeza que deseja deletar o item ' + d + "?",
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            await api.delete(`/${id}`)
              .then(response => console.log(response.data));
            getAll()
          }
        },
        {
          label: 'Não',
          onClick: () => {
            console.log("cancelou")
          }
        }
      ]
    });
  }


  const getAll = async () => {
    setLoading(true)
    await api.get("/filter/all")
      .then((response) => setEquipamento(response.data))
      .catch((error) => console.log(error)).finally(setLoading(false));
  }

  useEffect(() => {
    getAll();
  }, [])

  const useStyles = makeStyles((theme) => ({
    inputText: {
      minWidth: "300px",
      borderColor: "#FFF",
      marginTop: "20px",
      fontVariant: "h3",
    },
    btnSalvar: {
      color: "white",
    }
    
  }))

  const classes = useStyles();


  return (
    <div className="main">
      <div className="form">
        <div className="body">
        <div className="title"><h2>Cadastro de Equipamentos</h2></div>
        <div className="inputs">
          <TextField className={classes.inputText} onChange={(e) => setDesc(e.target.value)} style={{ width: "100%", marginTop: "20px" }} fontVariant="primary" color='primary' placeholder="Digite o equipamento" id="outlined-basic" variant="outlined" label="Equipamento" />
          <TextField onChange={(e) => setPat(e.target.value)} style={{ width: "100%", marginTop: "20px" }} fontVariant="primary" color='primary' placeholder="Digite o patrimônio" id="outlined-basic" variant="outlined" label="Patrimônio" />
          
            <Button className={classes.btnSalvar}style={{ width: "7vw", minWidth: "100px", backgroundColor: "#777", marginTop: "20px" }} color="white" type="button" onClick={() => createEquipamento(desc, pat)} >SALVAR</Button>
          
        </div>
        {loading ? (<p>Carregando dados...</p>) : (
          <div className="mainList">
            {equipamentos.length > 0 ? (
              <li className="lista">
                {equipamentos.map(p => (
                  <div key={p._id} className="listContent">
                    <div className="listItem">
                    <div className="descricao"><p className="descricaoText">{p.descricao}</p></div>
                    <div className="created"><p className="createdText">{"Pat: " + p.patrimonio}</p></div>
                    </div>
                    <div className="delete"><Button onClick={() => deleteEquipamento(p._id, p.descricao)} type="button">
                      <MdDelete size="30" color="#a6282c"></MdDelete>
                    </Button></div>
                  </div>
                ))}
              </li>
            ) : (
              <p>Sem items para exibir...</p>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default App;
