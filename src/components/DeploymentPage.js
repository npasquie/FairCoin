import {connect} from "react-redux";
import {
    DEPLOYED,
    DEPLOYMENT_FAILED, DEPLOYMENT_SIGNED,
    DEPLOYMENT_STARTED,
    NO_DEPLOYMENT
} from "../utils/constants";
import {Button} from "react-bootstrap";
import {setDeploymentStatus} from "../actions/web3Actions";

function DeploymentPage({deploymentStatus,deployedAt,handleReturnButtonClicked}){
    let body
    switch (deploymentStatus){
        case DEPLOYMENT_FAILED:
            body = <p>Le déploiement a échoué. Ouvrez la console pour consulter
                l'erreur.</p>
            break
        case DEPLOYED:
            body = <p>Votre nouvelle monnaie est disponible à l'adresse : {deployedAt}</p>
            break
        case DEPLOYMENT_STARTED:
            body = <p>Veuillez signer la transaction de déploiement avec votre wallet.</p>
            break
        case DEPLOYMENT_SIGNED:
            body = <p>Transaction envoyée. En attente de la blockchain ...</p>
            break
        default:
            body = ''
    }

    return (
        <>
            <h1>Déploiement</h1>
            <br/>
            {body}
            <br/>
            <Button
                onClick={()=>{handleReturnButtonClicked()}}
            >Revenir au formulaire</Button>
        </>
    )
}

const mapStateToProps = state => ({
    deploymentStatus: state.deploymentStatus,
    deployedAt: state.deployedAt
})

const mapDispatchToProps = dispatch => ({
    handleReturnButtonClicked: () => dispatch(setDeploymentStatus(NO_DEPLOYMENT))
})

export default connect(mapStateToProps,mapDispatchToProps)(DeploymentPage)