import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';

export default function DepositWartningDialog(props) {
  const { open, depositFee, onConfirm, onCancel } = props;

  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{t('Pool-DepositWarningTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('Pool-DepositWarningText', { depositFee })}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {t('Dialog-Cancel')}
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus variant="outlined">
          {t('Dialog-Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
