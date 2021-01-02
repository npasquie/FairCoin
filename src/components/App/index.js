import './App.css';
import {
    Col,
    Container,
    Row,
    Navbar
} from "react-bootstrap";
import FormPage from "../FormPage";
import {connect} from "react-redux";
import {NO_DEPLOYMENT} from "../../utils/constants";
import DeploymentPage from "../DeploymentPage";

function App({deploymentStatus}) {

    let appBody = <FormPage/>
    if (deploymentStatus !== NO_DEPLOYMENT)
        appBody = <DeploymentPage/>

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
                        {appBody}
                        <br/>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );
}

const mapStateToProps = state => ({
    deploymentStatus: state.deploymentStatus
})

export default connect(mapStateToProps,null)(App);
