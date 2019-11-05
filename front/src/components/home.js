import React, { Component } from 'react'
import '../styles/home.css';
import { Link } from "react-router-dom";
import logo from "../assets/imgs/FutureGuide.png"

import { Container } from 'react-bootstrap';
import Cookies from 'js-cookie'

export default class home extends Component {

    state = {
        isLoading: false,
        resultsSearched: [],
        programsByArea: [],
        programsBackUp: [],
        valueSearched: ""
    }


    saveSearch = (e) => {
        document.getElementById('searchButton').classList.add("disabled");
        this.setState({
            valueSearched: e.target.value
        }, () => {
            let esta = false;
            let programs = this.state.programsByArea;
            for (let index = 0; index < programs.length && !esta; index++) {
                let titles = programs[index].results;
                for (let j = 0; j < titles.length && !esta; j++) {
                    const element = titles[j];
                    if (element.title === this.state.valueSearched) {
                        esta = true;
                        document.getElementById('searchButton').classList.remove("disabled");
                    }
                }
            }
        });


    }
    search = () => {
        console.log("...");

    }

    componentDidMount() {
        //let token = Cookies.get('SESSIONID');
        fetch("http://localhost:3001/programas/area", {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZnIiwiaWF0IjoxNTcyODQ0ODc0LCJleHAiOjE1NzI4NTU2NzR9.7HlIqEWCt0Lp4NW0OrcYlhGKlzX__L6qNvnWHdXUu1g'
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.success === false) {
                    console.log(json);
                    //enrutar hacia el home 
                }
                else {
                    let objectFinal = [];
                    json.forEach(element => {
                        objectFinal.push({
                            name: element._id,
                            results: element.programs
                        })
                    });
                    this.setState({
                        programsByArea: objectFinal,
                        programsBackUp: objectFinal
                    });
                    console.log(this.state.programsByArea);
                }
            })
    }

    render() {
        //   let history = useHistory();
        return (
            <div role="main" id="homecontainer" className="container">
                <nav className="navbar sticky-top navbar-light bg-light">
                    <a className="navbar-brand" href="#">
                        <img src={logo}  height="60" className="d-inline-block align-top" alt="Futureguide logo" />
                    </a>
                    <form className="form-inline">
                        <button className="btn initialBtns" type="submit">Inicia sesión</button>
                        <Link to="/register">
                            <button className="btn initialBtns" type="submit">Registrate</button>
                        </Link>
                        
                    </form>
                </nav>
                <div id="homeContainer" className="d-flex justify-content-center align-items-center flex-wrap" >
                    <h1 id="slogan">Decide lo mejor para tu futuro.</h1>
                    <form>
                        <div className="form-group">
                            <input type="text" id="searchBar" placeholder="Busca tu programa de interés" list="options" onChange={this.saveSearch} aria-label="Barra de busqueda de programas"></input>
                            <datalist id="options">
                                {this.state.programsByArea.map((e, i) =>
                                    e.results.map((element, i) => <option key={i} value={element.title}>{e.name}</option>)
                                )}
                            </datalist>
                        </div>
                        <Link className="btn disabled" id="searchButton" aria-disabled="true" onClick={this.search} to={{
                            pathname: `/programa/${this.state.valueSearched}`,
                            state: {}
                        }}>Buscar</Link>
                    </form>
                </div>
            </div>
        )
    }
}