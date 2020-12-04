import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../firebase";
import { AuthContext } from "../provider/AuthProvider";

const Listas = () => {
    const [listName, setListName] = useState("");
    const [lists, setLists] = useState([]);
    const [pokemons, setPokemons] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const [input, setInput] = useState(false);
    const [error, setError] = useState(null);
    const [iconName, setIconName] = useState("");
    const [message, setMessage] = useState('');
    const [accordeon, setAccordeon] = useState(false);

    const onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "listName") {
            setListName(value);
        } 
    };
    const saveList = (event) => {
        const exist = lists.some(v => (v.name === listName));
        setError(null);
        setMessage("");
        if (exist) {
            setError("Erro: Você já possui uma lista com esse nome!")
            event.preventDefault();
        } else {
            event.preventDefault();
            firestore.collection('listas')
            .add({
                name: listName,
                user: currentUser.email
            })
            setListName("");
            setLists([]);
            getLists();
            toggleInput();
            setMessage("Lista adicionada com sucesso!")
        }
    }

    const getLists = () => {
        firestore.collection("listas").where("user", "==", currentUser.email)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
              }
          
              snapshot.forEach(doc => {
                setLists(lists => [...lists, doc.data()]);
              });
        });
    }

    const getPokemons = () => {
        firestore.collection("pokemons").where("user", "==", currentUser.email)
        .get()
        .then((snapshot) => {
                if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            } else {
                snapshot.forEach(doc => {
                    setPokemons(pokemons => [...pokemons, doc.data()])
                });
                return;
            }
        })
    }

    const deletePokemon = (pokemon, lista) => {
        firestore.collection("pokemons").where("pokemon", "==", pokemon).where("lista", "==", lista).where("user", "==", currentUser.email)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            } else {
                snapshot.forEach(doc => {
                    doc.ref.delete();
                })
            }
            setMessage("Pokemon excluido com sucesso!");
            setLists([]);
            setPokemons([])
            getLists();
            getPokemons();
       })
    }

    const count = (name) => {
      return pokemons.filter((obj) => obj.lista === name).length;
    }

    useEffect(() => {
        getLists();
        getPokemons();
        setIconName(faPlus);
    }, [])

    const toggleInput = () => {
        setInput(!input);
        setIconName(iconName == faMinus ? faPlus : faMinus);
    }

    const deleteList = (listName) => {
        firestore.collection("listas").where("name", "==", listName).where("user", "==", currentUser.email)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            } else {
                snapshot.forEach(doc => {
                    doc.ref.delete();
                })
            }
       })

       firestore.collection("pokemons").where("lista", "==", listName).where("user", "==", currentUser.email)
       .get()
       .then((snapshot) => {
           if (snapshot.empty) {
               console.log('No matching documents.');
               return;
           } else {
               snapshot.forEach(doc => {
                   doc.ref.delete();
               })
           }
           setMessage("Lista excluida com sucesso!");
           setLists([]);
           setPokemons([])
           getLists();
           getPokemons();
      })
    }

    const show = input ? "show" : "" ;
    const showAccordeon = accordeon ? "show" : "" ;

    return (
        <>
            {message !== '' && (
                <div className="alert alert-success text-center">
                  {message}
                </div>
            )}
            {error !== null && (
                <div className="alert alert-danger text-center">
                {error}
                </div>
            )}
            <div className="row justify-content-center" >
                <a href="#" onClick={toggleInput} className="add_lista"><FontAwesomeIcon icon={iconName}></FontAwesomeIcon></a>
            </div>
            <div >
                <form onSubmit={event => saveList(event)} className={"input-group collapse" + show} style={{marginBottom: "30px"}}>
                    <input key={show} onChange={event => onChangeHandler(event)} value={listName} type="text" name="listName" className="form-control" placeholder="Noma da lista..." required></input>
                    <div className="input-group-append">
                        <button type="submit" className="btn btn-danger">Adicionar</button>
                    </div>
                </form>
            </div>
            <h3>Minhas Listas</h3>
            <div id="accordion">
                {lists.map(item => (
                    <div key={item.name} class="card">
                      <div href="#" class="card-header" id="headingOne" >
                          <div class="justify-content-between d-flex align-items-center">
                            <h4>{item.name}</h4>
                            <div>
                            <span class="badge badge-primary badge-pill">{count(item.name)}</span>
                            <FontAwesomeIcon onClick={() => deleteList(item.name)} icon={faTrash} ></FontAwesomeIcon>
                            </div>

                          </div>
                      </div>  
                      <div id={"collapse" + item.name } class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                        <div class="card-body">
                            <div className="row justify-content-center">
                                {pokemons.map((pokemon,index) => {
                                    if (item.name === pokemon.lista && count(item.name) != 0) {
                                        return (
                                            <div key={pokemon.pokemon} className="card text-center" style={{width: '20%', margin: '5px'}}>
                                                <a href="#"  onClick={() => deletePokemon(pokemon.pokemon, pokemon.lista)} style={{color: '#000000'}}>
                                                    <div className="card-body">
                                                    <p className="card-text text-uppercase">{pokemon.pokemon} <FontAwesomeIcon icon={faTrash} ></FontAwesomeIcon></p>
                                                        

                                                    </div>
                                                </a>
                                            </div>
                                        )
                                    } else {
                                    }
                                })
                                }
                                {count(item.name) == 0 ? <p>Nenhum pokemon nesta lista!</p> : ''}
                            </div>
                        </div>
                      </div>
                    </div>
                ))}
            </div>
    </>
    )
}

export default Listas;