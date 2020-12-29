import './App.css';
import {
    Form,
    FormControl,
    Col,
    Container,
    Row,
    Button,
    Navbar
} from "react-bootstrap";
import {
    WEB3_FETCH_FAILED,
    WEB3_FETCHING,
    WEB3_LOADED,
    WEB3_NOT_FETCHED
} from "../../utils/constants";
import {connect} from 'react-redux'
import {fetchWeb3} from "../../actions/web3Actions";

function App({statusFetchWeb3, handleActivateWeb3}) {

    let pageBody
    switch (statusFetchWeb3){
        case WEB3_NOT_FETCHED:
            pageBody = <Button
                variant={"primary"}
                onClick={handleActivateWeb3}>
                Activer la connexion Ethereum
            </Button>
            break
        case WEB3_FETCHING:
            pageBody = <h3>En attente de la connexion web3 ...</h3>
            break
        case WEB3_FETCH_FAILED:
            pageBody = <>
                <h3>Echec de la connexion web3.</h3>
                <p>Si vous ne savez pas ce que cela veut dire, rendez vous sur&nbsp;
                    <a href={"http://www.metamask.io"}>metamask.io</a></p>
            </>
            break
        case WEB3_LOADED:
            pageBody = <><h1>Rendez le monde plus juste</h1>
                <h2>Créez une monnaie sociale</h2>
                <Form>
                    <Form.Group controlId={"name"}>
                        <Form.Label>Nom de la monnaie :</Form.Label>
                        <FormControl
                            type={"text"}
                            placeholder={"euro"}/>
                    </Form.Group>
                    <Form.Group controlId={"symbol"}>
                        <Form.Label>Symbole</Form.Label>
                        <FormControl type={"text"} placeholder={"EUR"}/>
                    </Form.Group>
                    <Form.Group controlId={"address"}>
                        <Form.Label>
                            Adresse de récipiendaire 1
                        </Form.Label>
                        <FormControl
                            type={"text"}
                            placeholder={"0x13aA399f57AEEfDde78F611999B30e0A50BCe59D"}/>
                    </Form.Group>
                    <Form.Group controlId={"add-address"}>
                        <Button variant={"secondary"}>
                            Ajouter un récipiendaire
                        </Button>
                    </Form.Group>
                    <Form.Group controlId={"totalSupply"}>
                        <Form.Label>
                            Quantité totale de monnaie
                        </Form.Label>
                        <FormControl
                            type={"text"}
                            placeholder={"50000000000000"}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Col sm={8}>
                                <Form.Label>
                                    Taux de redistribution annuel
                                </Form.Label>
                                <FormControl type="range"/>
                            </Col>
                            <Col xs={"auto"}>
                                <FormControl type={"number"}/>%
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Déployer
                    </Button>
                </Form></>
            break
    }

    return (
        <div className="App">
            <Navbar bg="light">
                <Navbar.Brand>FairCoin</Navbar.Brand>
            </Navbar>
            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={8}>
                        <br/>
                        {pageBody}
                        <br/>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );
}

const mapStateToProps = state => ({
    statusFetchWeb3: state.connexionStatus
})

const mapDispatchToProps = dispatch => ({
    handleActivateWeb3: () => dispatch(fetchWeb3())
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
