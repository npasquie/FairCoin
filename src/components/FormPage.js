import {useState} from "react";
import {
    WEB3_FETCH_FAILED,
    WEB3_FETCHING,
    WEB3_LOADED
} from "../utils/constants";
import {
    Button,
    Col,
    Form,
    FormControl,
} from "react-bootstrap";
import {deployCurrency, fetchWeb3} from "../actions/web3Actions";
import {connect} from "react-redux";

function FormPage({statusFetchWeb3, handleActivateWeb3, handleFormSubmit, web3}) {
    const [recipients, setRecipients] = useState([''])
    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [totalSupply, setTotalSupply] = useState(50000000000)
    const [redistributionRate,setRedistributionRate] = useState(4)

    let pageBody
    switch (statusFetchWeb3){
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
            pageBody = <>
                <Form>
                    <Form.Group controlId={"name"}>
                        <Form.Label>Nom de la monnaie</Form.Label>
                        <FormControl
                            value={name}
                            onChange={e=>{
                                setName(e.target.value)
                            }}
                            type={"text"}
                            placeholder={"euro"}/>
                    </Form.Group>
                    <Form.Group controlId={"symbol"}>
                        <Form.Label>Symbole</Form.Label>
                        <FormControl
                            type={"text"}
                            placeholder={"EUR"}
                            value={symbol}
                            onChange={e=>{
                                setSymbol(e.target.value)
                            }}/>
                    </Form.Group>
                    {recipients.map((recipient,i) =>
                        <Form.Group controlId={"address"+i} key={i}>
                            <Form.Label>
                                Adresse de récipiendaire {i+1}&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button variant="outline-danger"
                                        onClick={()=>{
                                            let newRecipients = [...recipients]
                                            newRecipients.splice(i,1)
                                            setRecipients(newRecipients)
                                        }}>
                                    Supprimer
                                </Button>
                            </Form.Label>
                            <FormControl
                                type={"text"}
                                placeholder={"0x13aA399f57AEEfDde78F611999B30e0A50BCe59D"}
                                value={recipients[i]}
                                onChange={e => {
                                    let newRecipients = [...recipients]
                                    newRecipients[i] = e.target.value
                                    setRecipients(newRecipients)
                                }}/>
                        </Form.Group>)}
                    <Form.Group controlId={"add-address"}>
                        <Button
                            variant={"secondary"}
                            onClick={()=>{setRecipients([...recipients,''])}}>
                            Ajouter un récipiendaire
                        </Button>
                    </Form.Group>
                    <Form.Group controlId={"totalSupply"}>
                        <Form.Label>
                            Quantité totale de monnaie
                        </Form.Label>
                        <FormControl
                            type={"number"}
                            value={totalSupply}
                            onChange={e=>{
                                setTotalSupply(e.target.value)
                            }}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Col sm={8}>
                                <Form.Label>
                                    Taux de redistribution annuel
                                </Form.Label>
                                <FormControl
                                    type="range"
                                    value={redistributionRate}
                                    onChange={e=>{
                                        setRedistributionRate(e.target.value)
                                    }}/>
                            </Col>
                            <Col xs={"auto"}>
                                <FormControl
                                    type={"number"}
                                    value={redistributionRate}
                                    onChange={e=>{
                                        setRedistributionRate(e.target.value)
                                    }}/>%
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Button variant="primary"
                            onClick={() => {
                                handleFormSubmit({
                                    name: name,
                                    symbol: symbol,
                                    recipients: recipients,
                                    _totalSupply: totalSupply,
                                    _redistributionRate: redistributionRate,
                                    web3:web3
                                })}}>
                        Déployer
                    </Button>
                </Form></>
            break
        default:
            pageBody = <><br/><Button
                variant={"primary"}
                onClick={handleActivateWeb3}>
                Activer la connexion Ethereum
            </Button></>
    }

    return (
        <div className="FormPage">
            <h1>Rendez le monde plus juste</h1>
            <h2>Créez une monnaie sociale</h2>
            {pageBody}
        </div>
    );
}

const mapStateToProps = state => ({
    statusFetchWeb3: state.connexionStatus,
    web3: state.web3
})

const mapDispatchToProps = dispatch => ({
    handleActivateWeb3: () => dispatch(fetchWeb3()),
    handleFormSubmit: (args) => dispatch(deployCurrency(args))
})

export default connect(mapStateToProps,mapDispatchToProps)(FormPage);