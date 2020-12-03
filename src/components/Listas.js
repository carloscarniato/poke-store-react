import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../firebase";
import { AuthContext } from "../provider/AuthProvider";

const Listas = () => {
    const [listName, setListName] = useState("");
    const [lists, setLists] = useState([]);
    const {currentUser} = useContext(AuthContext);

    const onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "listName") {
            setListName(value);
        } 
    };
    const saveList = () => {
        const exist = lists.some(v => (v.name === listName));
        if (exist) {
            return setListName("");
        } else {
            firestore.collection('listas')
            .add({
                name: listName,
                user: currentUser.email
            })
            setLists([]);
            getLists();

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
                setLists(lists => [...lists, doc.data()])
              });
            });
    }

    useEffect(() => {
        getLists();
    }, [])


    return (
        <>
            <div className="input-group mb-3">
                <input onChange={event => onChangeHandler(event)} type="text" name="listName" className="form-control" placeholder="Noma da lista..."></input>
                <div className="input-group-append">
                    <button onClick={saveList} className="btn btn-danger" type="button">Adicionar</button>
                </div>
            </div>
            <div className="list-group">
                {lists.map(item => (
                    <a key={item.name} href="#" className="list-group-item list-group-item-action">{item.name}</a>
                ))}
            </div>
    </>
    )
}

export default Listas;