import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap';
import ListProgramas from './listProgramas';
import ListUniversidades from './listUniversidades';
import Cookies from 'js-cookie';
import '../styles/listas.css';
import { Redirect } from "react-router-dom";

export default class Listas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programas: [],
            universidades: [],
            nombrePrograma: ""
        }
    }

    componentDidMount() {
        let token = Cookies.get("JSESSIONID");
        if (token) {
            fetch('https://futureguide.herokuapp.com/programas',
                {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': token
                    })
                }).then(
                    resp => resp.json()
                )
                .then(json => {
                    this.setState({ programas: json })
                })
        }
    }

    actualizarUniversidades = (pUniversidades, pNombrePrograma) => {
        let token = Cookies.get("JSESSIONID");
        let universidadesNuevas;
        console.log(pNombrePrograma);
        if (token) {
            let urlServer = "https://futureguide.herokuapp.com";
            fetch(urlServer + `/programas/${pNombrePrograma}/universidades`, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': token
                })
            })
                .then(res => res.json())
                .then(json => {
                    universidadesNuevas = json;
                    this.setState({
                        universidades: universidadesNuevas,
                        nombrePrograma: pNombrePrograma
                    })
                })


        }
    }

    render() {
        let token = Cookies.get("JSESSIONID");
        if (!token) {
            return <Redirect to='/' />
        }
        return (
            <Row className="container-fluid listas" style={{ overflowY: "auto" }} role="main">
                <Col className="col-6" id="ListaProgramas">

                    <div className="scrollbar scrollbar-primary">
                        <ListProgramas funcionUniversidades={this.actualizarUniversidades} programas={this.state.programas}></ListProgramas>
                    </div>
                </Col>

                <Col className="col-6" id="ListaUniversidades">
                    <div className="scrollbar scrollbar-universidades">
                        <ListUniversidades nombrePrograma={this.state.nombrePrograma} universidades={this.state.universidades}></ListUniversidades>
                    </div>
                </Col>
            </Row>
        )
    }
}
