import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import pokeball from '../pokeball.png';
import { firestore } from "../firebase";
import { AuthContext } from "../provider/AuthProvider";

const Home = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false);
    const [lists, setLists] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const [selected, setSelected] = useState("");
    const [selectedList, setSelectedList] = useState("");
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [exist, setExist] = useState(false);
    const [page, setPage] = useState(0);

    const fetchPokemonData = (pokemon) => {
        let url = pokemon.url;
        return fetch(url)
          .then(response => response.json())
            .then(
                pokeData => {  
                    setItems(items => [...items, pokeData])
            }
        )
    }
    
    const onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "search") {
            setSearch(value);
        }
    };

    const toggleModal = () =>{
        setModal(!modal);
    }

    const toggleModalName = (itemName) =>{
        setSelected(itemName);
        setModal(!modal);
    }
    
    const showModal = modal ? "block" : "none" ;

    const savePokemonOnList = () => {
        setMessage('');
        setErrorMessage(null);
        setExist(false);

        firestore.collection("pokemons").where("user", "==", currentUser.email).where("lista", "==", selectedList).where("pokemon", "==", selected)
        .get()
        .then((snapshot) => {
                if (snapshot.empty) {
                console.log('No matching documents.');
                addPokemon();
                setMessage("Pokemon adicionado com sucesso á lista: " + selectedList);
                toggleModal();
                return;
            } else {
                setErrorMessage("Erro: Este pokemon já está nesta lista!")
                toggleModal();
                return;
            }
        })

    }

    const addPokemon = () => {
        firestore.collection('pokemons')           
        .add({
            user: currentUser.email,
            lista: selectedList,
            pokemon: selected
        })
    }

    const searchPokemon = (event) => {
        setItems([]);
        event.preventDefault();

        fetch("https://pokeapi.co/api/v2/pokemon/" + search)
        .then(res => res.json())
        .then(
          (result) => { 
              if (search == '') {
                result.results.forEach(
                    (pokemon) => {
                          fetchPokemonData(pokemon);   
                      }
                  )
              } else {
                setItems(items => [...items, result])
              }
          },
        )
    }

    const onSelectHandler = (event) => {
        setSelectedList(event.target.value);
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
                setLists(lists => [...lists, doc.data()])
              });
              setSelectedList(snapshot.docs[0].data().name)
        });
    }

    const getPaginatedPokemon = (paginated) => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=" + (20 * paginated))
        .then(res => res.json())
        .then(
          (result) => {
            result.results.forEach(
                (pokemon) => {
                      fetchPokemonData(pokemon);   
                  }
              );

          },
          // Nota: é importante lidar com errros aqui
          // em vez de um bloco catch() para não receber
          // exceções de erros reais nos componentes.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
        setIsLoaded(true)
    }

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0")
        .then(res => res.json())
        .then(
          (result) => {
            result.results.forEach(
                (pokemon) => {
                      fetchPokemonData(pokemon);   
                  }
              );

          },
          // Nota: é importante lidar com errros aqui
          // em vez de um bloco catch() para não receber
          // exceções de erros reais nos componentes.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
        setIsLoaded(true)
        getLists();

    }, [])

    const proximo = () => {
        setPage(page + 1);
        setItems([]);
        return getPaginatedPokemon(page + 1);
    }

    const anterior = () => {
        if (page == 0) {
            return;
        }
        setPage(page - 1);
        setItems([]);
        return getPaginatedPokemon(page - 1);
    }

    if (error) {
    return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
    return <div>Loading...</div>;
    } else {
    return (
        <>
            {message !== '' && (
                <div className="alert alert-success text-center">
                  {message}
                </div>
            )}
            {errorMessage !== null && (
                <div className="alert alert-danger text-center">
                {errorMessage}
                </div>
            )}
            <img src={pokeball} className="App-logo" alt="logo" />

            <div className="searchbar">
                <form onSubmit={event => searchPokemon(event)}>
                    <input onChange={event => onChangeHandler(event)} className="search_input" type="text" name="search" placeholder="Pesquisar..."></input>
                    <button type="submit" href="#" className="search_icon"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></button>
                </form>
            </div>

            <div className="row justify-content-center next">
                <button className="btn btn-danger" onClick={() => anterior()}>Anterior</button>
                <br></br>
                <button className="btn btn-danger" onClick={() => proximo()}>Próximo</button>
            </div>
            <div className="row justify-content-center">
                {items.map(item => (
                    <div key={item.name} className="card text-center" style={{width: '20%', margin: '5px'}}>
                        <a href="#" onClick={event => toggleModalName(item.name)} >
                            <img className="card-img-top" src={item.sprites.front_default}></img>
                            <div className="card-body">
                                <p className="card-text text-uppercase">{item.name}</p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>



            <div className="modal" tabIndex="-1" role="dialog" style={{display: showModal}}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Adicionar {selected} na lista:</h5>
                    <button onClick={toggleModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                <select className="form-control" id="exampleFormControlSelect1" onChange={event => onSelectHandler(event)}>
                    {lists.map(item => (
                        <option value={item.name} key={item.name}>{item.name}</option>
                    ))}

                </select>                
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={savePokemonOnList}>Salvar</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={toggleModal}>Fechar</button>
                </div>
                </div>
            </div>
            </div>
        </>
        )
    }
}

export default Home;