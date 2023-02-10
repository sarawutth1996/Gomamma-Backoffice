import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({

    displayflex: {
        height: '100vh',
        position: 'relative',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        color: '#636b6f'
    },
    code: {
        borderRight: ' 2px solid',
        fontSize: '26px',
        padding: '0 15px 0 15px',
        textAlign: 'center'
    },
    message: {

        fontFamily: 'Regular',
        fontSize: '18px',
        textAlign: 'center',
        padding: '10px'
    }
}));

export default function Error404() {
    const classes = useStyles();
    return (
        <>
            <Container maxWidth="sm">
                <div className={classes.displayflex}>
                    <div className={classes.code}> 404 </div>
                    <div className={classes.message}> Not Found </div>
                </div>
            </Container>
        </>
    );
}
