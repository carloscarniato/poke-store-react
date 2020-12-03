import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";

const Home = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");

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

    const searchPokemon = (event) => {
        setItems([]);
        event.preventDefault();

        fetch("https://pokeapi.co/api/v2/pokemon/" + search)
        .then(res => res.json())
        .then(
          (result) => { 
              if (search == '') {
                setIsLoaded(true);
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

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon")
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              result.results.forEach(
                  (pokemon) => {
                        fetchPokemonData(pokemon);   
                    }
                )
            },
            // Nota: é importante lidar com errros aqui
            // em vez de um bloco catch() para não receber
            // exceções de erros reais nos componentes.
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
    }, [])

    if (error) {
    return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
    return <div>Loading...</div>;
    } else {
    return (
        <>
            <div className="searchbar">
                <form onSubmit={event => searchPokemon(event)}>
                    <input onChange={event => onChangeHandler(event)} className="search_input" type="text" name="search" placeholder="Pesquisar..."></input>
                    <button type="submit" href="#" className="search_icon"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></button>
                </form>
            </div>
            <div className="row justify-content-center">

                {items.map(item => (
                    <div key={item.name} className="card text-center" style={{width: '20%', margin: '5px'}}>
                        <img className="card-img-top" src={item.sprites.front_default}></img>
                        <div className="card-body">
                            <p className="card-text text-uppercase">{item.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
        )
    }
}

export default Home;