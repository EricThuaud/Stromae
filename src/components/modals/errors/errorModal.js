import {
  Criticality,
  TypeOfControl,
} from '@inseefr/lunatic/lib/use-lunatic/type-source';
import { List, ListItem, ListItemIcon, makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ErrorRounded, Warning } from '@material-ui/icons';
import { Button } from 'components/designSystem/Button';
import { buttonDictionary, errorDictionary } from 'i18n';
import { useCallback } from 'react';
import { paradataHandler, SIMPLE_CLICK_EVENT } from 'utils/events';

const useStyles = makeStyles((theme) => ({
  warn: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

function Icon({ isCritical, ...props }) {
  if (isCritical) return <ErrorRounded {...props} />;
  return <Warning {...props} />;
}

function Error({ errorMessage, typeOfControl, criticality }) {
  const classes = useStyles();
  const isCritical =
    typeOfControl === TypeOfControl.FORMAT && criticality === Criticality.ERROR;
  const classesUsed = isCritical ? classes.error : classes.warn;
  return (
    <ListItem className={classesUsed}>
      <ListItemIcon>
        <Icon isCritical={isCritical} className={classesUsed} />
      </ListItemIcon>
      <div>{errorMessage}</div>
    </ListItem>
  );
}

function ComponentErrors({ errors }) {
  const content = errors.map(function (error, index) {
    return <Error {...error} key={index} />;
  }, []);
  return <List>{content}</List>;
}

const ErrorsModal = ({
  onClose,
  goNext,
  currentPage,
  errors: orignalErrors = {},
}) => {
  const utilInfo = useCallback(
    (type) => {
      return {
        ...SIMPLE_CLICK_EVENT,
        idParadataObject: `${type}-error-modal-button`,
        page: currentPage,
      };
    },
    [currentPage]
  );

  const { currentErrors, isCritical } = orignalErrors;

  const ignoreErrors = useCallback(
    (event) => {
      // pass skipValidation to "true" to skip validation and change page
      goNext(event, true);
    },
    [goNext]
  );

  const correctErrors = useCallback(() => {
    onClose();
  }, [onClose]);

  const content = Object.entries(currentErrors).map(function ([id, errors]) {
    return <ComponentErrors errors={errors} key={id} />;
  }, []);

  return (
    <Dialog
      open
      onClose={paradataHandler(onClose)(utilInfo('close'))}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle id='alert-dialog-slide-title'>
        {errorDictionary.errorModalTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description' component='div'>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={paradataHandler(correctErrors)(utilInfo('correct'))}>
          {buttonDictionary.MODAL_CORRECT}
        </Button>
        {!isCritical && (
          <Button onClick={paradataHandler(ignoreErrors)(utilInfo('ignore'))}>
            {buttonDictionary.MODAL_IGNORE}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ErrorsModal;
