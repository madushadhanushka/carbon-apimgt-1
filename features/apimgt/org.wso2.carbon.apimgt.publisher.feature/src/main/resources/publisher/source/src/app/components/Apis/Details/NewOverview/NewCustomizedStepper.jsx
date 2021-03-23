import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { FormattedMessage } from 'react-intl';
import LaunchIcon from '@material-ui/icons/Launch';
import Alert from 'AppComponents/Shared/Alert';
import Grid from '@material-ui/core/Grid';
import StepConnector from '@material-ui/core/StepConnector';
import { useAPI } from 'AppComponents/Apis/Details/components/ApiContext';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import grey from '@material-ui/core/colors/grey';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AuthManager from 'AppData/AuthManager';
import Typography from '@material-ui/core/Typography';

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient(to left, #50BCEC 50%, #B1D31E 50%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( #B1D31E, #B1D31E)',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 56,
        height: 56,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        border: '6px solid #E2E2E2',
    },
    active: {
        backgroundColor: '#50BCEC',
        border: '6px solid #E2E2E2',
    },
    completed: {
        backgroundColor: '#B1D31E',
        border: '6px solid #E2E2E2',
    },
});

function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        />
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    iconTrue: {
        display: 'block',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#B1D31E',
        zIndex: 1,
        color: '#fff',
        width: 15,
        height: 15,
        borderRadius: '50%',
    },
    iconFalse: {
        color: '#fff',
        display: 'block',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: grey[500],
        zIndex: 1,
        width: 15,
        height: 15,
        borderRadius: '50%',
    },
}));


export default function NewCustomizedStepper() {
    const classes = useStyles();
    const [api, updateAPI] = useAPI();
    const [isUpdating, setUpdating] = useState(false);
    const [deploymentsAvailable, setDeploymentsAvailable] = useState(false);
    const isEndpointAvailable = api.endpointConfig !== null;
    const isTierAvailable = api.policies.length !== 0;
    const steps = ['Develop', 'Deploy', 'Test', 'Publish'];

    let activeStep = 0;
    if (api && (api.type === 'WEBSUB' || isEndpointAvailable) && isTierAvailable && !deploymentsAvailable) {
        activeStep = 1;
    } else if ((api && !isEndpointAvailable && api.type !== 'WEBSUB') || (api && !isTierAvailable)) {
        activeStep = 0;
    } else if (api && (isEndpointAvailable || api.type === 'WEBSUB') && isTierAvailable
        && deploymentsAvailable && api.lifeCycleStatus !== 'PUBLISHED') {
        activeStep = 3;
    } else if (api.lifeCycleStatus === 'PUBLISHED' && api
        && (isEndpointAvailable || api.type === 'WEBSUB') && isTierAvailable && deploymentsAvailable) {
        activeStep = 4;
    }

    useEffect(() => {
        api.getRevisionsWithEnv(api.isRevision ? api.revisionedApiId : api.id).then((result) => {
            setDeploymentsAvailable(result.body.count > 0);
        });
    }, []);

    /**
 * Update the LifeCycle state of the API
 *
 */
    function updateLCStateOfAPI(apiId, state) {
        setUpdating(true);
        const promisedUpdate = api.updateLcState(apiId, state);
        promisedUpdate
            .then(() => {
                updateAPI()
                    .then()
                    .catch((error) => {
                        if (error.response) {
                            Alert.error(error.response.body.description);
                        } else {
                            Alert.error('Something went wrong while updating the API');
                        }
                        console.error(error);
                    });
                Alert.info('Lifecycle state updated successfully');
            })
            .finally(() => setUpdating(false))
            .catch((errorResponse) => {
                console.log(errorResponse);
                Alert.error(JSON.stringify(errorResponse.message));
            });
    }

    return (
        <div className={classes.root}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>
                            {label === 'Develop' && (
                                <div>
                                    <Grid
                                        container
                                        direction='row'
                                        justify='center'
                                    >
                                        <Grid item>
                                            {api ? (
                                                <CheckIcon className={classes.iconTrue} />
                                            ) : (
                                                <CloseIcon className={classes.iconFalse} />
                                            )}
                                        </Grid>
                                        <Box ml={1} mb={1}>
                                            <Grid>
                                                <Typography variant='h7'>
                                                    <FormattedMessage
                                                        id='Apis.Details.Overview.CustomizedStepper.Develop'
                                                        defaultMessage=' Develop'
                                                    />
                                                </Typography>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    {api.type !== 'WEBSUB' && (
                                        <Box ml={3}>
                                            <Grid
                                                container
                                                direction='row'
                                                justify='center'
                                                style={{ marginLeft: '2px' }}
                                            >
                                                <Grid item>
                                                    {isEndpointAvailable ? (
                                                        <CheckIcon className={classes.iconTrue} />
                                                    ) : (
                                                        <CloseIcon className={classes.iconFalse} />
                                                    )}
                                                </Grid>
                                                <Box ml={1} mb={1}>
                                                    <Grid item>
                                                        <Typography variant='h7'>
                                                            <FormattedMessage
                                                                id='Apis.Details.Overview.CustomizedStepper.Endpoint'
                                                                defaultMessage=' Endpoint'
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                </Box>
                                                <Box ml={1} mb={1}>
                                                    <Grid item>
                                                        <Link to={'/apis/' + api.id + '/endpoints'}>
                                                            <LaunchIcon
                                                                color='primary'
                                                                fontSize='small'
                                                            />
                                                        </Link>
                                                    </Grid>
                                                </Box>
                                            </Grid>
                                        </Box>
                                    )}
                                    <Box ml={6}>
                                        <Grid
                                            container
                                            direction='row'
                                            justify='center'
                                            style={{ marginLeft: '2px' }}
                                        >
                                            <Grid item>
                                                {isTierAvailable ? (
                                                    <CheckIcon className={classes.iconTrue} />
                                                ) : (
                                                    <CloseIcon className={classes.iconFalse} />
                                                )}
                                            </Grid>
                                            <Box ml={1}>
                                                <Grid item>
                                                    <Typography variant='h7'>
                                                        <FormattedMessage
                                                            id='Apis.Details.Overview.CustomizedStepper.Tier'
                                                            defaultMessage=' Business Plan'
                                                        />
                                                    </Typography>
                                                </Grid>
                                            </Box>
                                            <Grid item>
                                                <Link to={'/apis/' + api.id + '/subscriptions'}>
                                                    <Box ml={1}>
                                                        <LaunchIcon
                                                            color='primary'
                                                            fontSize='small'
                                                        />
                                                    </Box>
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </div>
                            )}
                            {label === 'Deploy' && (
                                <Tooltip
                                    title={deploymentsAvailable ? '' : 'Deploy a revision of this API to the Gateway'}
                                    placement='bottom'
                                >
                                    <Grid
                                        container
                                        direction='row'
                                        alignItems='center'
                                        justify='center'
                                    >
                                        <Box mb={1}>
                                            <Grid item>
                                                {deploymentsAvailable ? (
                                                    <CheckIcon className={classes.iconTrue} />
                                                ) : (
                                                    <CloseIcon className={classes.iconFalse} />
                                                )}
                                            </Grid>
                                        </Box>
                                        <Box ml={1} mb={1}>
                                            <Grid item>
                                                <Typography variant='h7'>
                                                    <FormattedMessage
                                                        id='Apis.Details.Overview.CustomizedStepper.Deploy'
                                                        defaultMessage=' Deploy'
                                                    />
                                                </Typography>
                                            </Grid>
                                        </Box>
                                        <Grid item>
                                            {(((api.type !== 'WEBSUB' && !isEndpointAvailable))
                                            || !isTierAvailable
                                            || AuthManager.isNotPublisher() || api.workflowStatus === 'CREATED')
                                                ? (
                                                    <Box ml={1}>
                                                        <LaunchIcon
                                                            color='default'
                                                            fontSize='small'
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Link to={'/apis/' + api.id + '/deployments'}>
                                                        <Box ml={1}>
                                                            <LaunchIcon
                                                                color='primary'
                                                                fontSize='small'
                                                            />
                                                        </Box>
                                                    </Link>
                                                )}
                                        </Grid>
                                    </Grid>
                                </Tooltip>
                            )}
                            {label === 'Test' && (
                                <Tooltip
                                    title={api.lifeCycleStatus === 'PUBLISHED' ? 'Cannot use test option while API'
                                        + ' is in published state' : ''}
                                    placement='bottom'
                                >
                                    <Grid
                                        container
                                        direction='row'
                                        alignItems='center'
                                        justify='center'
                                    >
                                        <Grid item>
                                            <Typography variant='h7'>
                                                <FormattedMessage
                                                    id='Apis.Details.Overview.CustomizedStepper.Test'
                                                    defaultMessage=' Test'
                                                />
                                            </Typography>
                                        </Grid>
                                        {api.lifeCycleStatus === 'PUBLISHED' || !deploymentsAvailable
                                            || !isEndpointAvailable
                                            || !isTierAvailable
                                            || (api.type !== 'HTTP' && api.type !== 'SOAP')
                                            ? (
                                                <Box ml={1}>
                                                    <LaunchIcon
                                                        color='default'
                                                        fontSize='small'
                                                    />
                                                </Box>
                                            ) : (
                                                <Link to={'/apis/' + api.id + '/test-console'}>
                                                    <Box ml={1}>
                                                        <LaunchIcon
                                                            color='primary'
                                                            fontSize='small'
                                                        />
                                                    </Box>
                                                </Link>
                                            )}
                                    </Grid>
                                </Tooltip>
                            )}
                            {label === 'Publish' && (
                                <div>
                                    {api.lifeCycleStatus !== 'PUBLISHED' ? (
                                        <Button
                                            size='small'
                                            variant='contained'
                                            color='primary'
                                            onClick={() => updateLCStateOfAPI(api.id, 'Publish')}
                                            disabled={((api.type !== 'WEBSUB' && !isEndpointAvailable))
                                                || !deploymentsAvailable
                                                || !isTierAvailable
                                                || api.isRevision || AuthManager.isNotPublisher()
                                                || api.workflowStatus === 'CREATED'}
                                        >
                                            Publish
                                            {isUpdating && <CircularProgress size={20} />}
                                        </Button>
                                    ) : (
                                        <Grid
                                            container
                                            direction='row'
                                            alignItems='center'
                                            justify='center'
                                        >
                                            <Grid item>
                                                <CheckIcon className={classes.iconTrue} />
                                            </Grid>
                                            <Box ml={1}>
                                                <Grid item>
                                                    <Typography variant='h7'>
                                                        <FormattedMessage
                                                            id='Apis.Details.Overview.CustomizedStepper.publish'
                                                            defaultMessage=' Published (Current API)'
                                                        />
                                                    </Typography>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    )}
                                </div>
                            )}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
}

NewCustomizedStepper.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    api: PropTypes.shape({
        id: PropTypes.string,
    }).isRequired,
};