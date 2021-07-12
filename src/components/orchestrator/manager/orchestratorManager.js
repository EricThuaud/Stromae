import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAPI, useAPIRemoteData, useAuth } from 'utils/hooks';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { CookieConsent } from 'components/shared/cookieConsent';
import { LoaderSimple } from 'components/shared/loader';
import { Orchestrator } from './../collector';
import {
  EventsManager,
  INIT_ORCHESTRATOR_EVENT,
  INIT_SESSION_EVENT,
} from 'utils/events';
import {
  ORCHESTRATOR_COLLECT,
  ORCHESTRATOR_READONLY,
  READ_ONLY,
} from 'utils/constants';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100%',
    flexDirection: 'column',
  },
}));

const OrchestratorManger = () => {
  const classes = useStyles();
  const [source, setSource] = useState(false);
  const { readonly, idQ, idSU } = useParams();

  const LOGGER = EventsManager.createEventLogger({
    idQuestionnaire: idQ,
    idSurveyUnit: idSU,
    idOrchestrator:
      readonly === READ_ONLY ? ORCHESTRATOR_READONLY : ORCHESTRATOR_COLLECT,
  });

  const {
    suData,
    questionnaire,
    metadata,
    loading,
    errorMessage,
  } = useAPIRemoteData(idSU, idQ);
  const { putData, putStateData, postParadata } = useAPI(idSU, idQ);
  const { logout, oidcUser } = useAuth();
  const isAuthenticated = !!oidcUser?.profile;

  const [, /*sending*/ setSending] = useState(false);
  const [errorSending, setErrorSending] = useState(false);

  const sendData = async dataToSave => {
    setErrorSending(null);
    setSending(true);
    const { data, stateData } = dataToSave;
    const { /*status,*/ error: dataError } = await putData(data);
    const { /*status,*/ error: stateDataError } = await putStateData(stateData);
    const paradatas = LOGGER.getEventsToSend();
    const { error: paradataPostError } = await postParadata(paradatas);
    setSending(false);
    if (dataError || stateDataError || paradataPostError)
      setErrorSending('Error during sending');
    if (!paradataPostError) LOGGER.clear();
  };

  const logoutAndClose = async surveyUnit => {
    logout();
  };

  useEffect(() => {
    if (isAuthenticated && questionnaire) {
      LOGGER.addMetadata({ idSession: oidcUser?.session_state });
      LOGGER.log(INIT_SESSION_EVENT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, LOGGER, questionnaire]);

  useEffect(() => {
    if (!loading && questionnaire) {
      const { label: questionnaireTitle } = questionnaire;
      window.document.title = questionnaireTitle;
      setSource(questionnaire);
      LOGGER.log(INIT_ORCHESTRATOR_EVENT);
    }
  }, [questionnaire, loading, LOGGER]);

  return (
    <Box className={classes.root}>
      {loading && <LoaderSimple />}
      {!loading && errorMessage && <Typography>{errorMessage}</Typography>}
      {!loading && metadata && suData && questionnaire && source && (
        <Orchestrator
          stromaeData={suData}
          source={source}
          metadata={metadata}
          logoutAndClose={logoutAndClose}
          save={sendData}
          savingType="COLLECTED"
          preferences={['PREVIOUS', 'COLLECTED']}
          features={['VTL', 'MD']}
          pagination={true}
          readonly={readonly}
        />
      )}
      {errorSending && <h2>Error lors de l'envoie</h2>}
      <CookieConsent />
    </Box>
  );
};
export default OrchestratorManger;
