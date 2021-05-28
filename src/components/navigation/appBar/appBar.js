import React, { useContext, useState } from 'react';
import {
  AppBar,
  IconButton,
  ListItemIcon,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle, Help, ExitToApp } from '@material-ui/icons';
import { AssistanceConfirm } from 'components/modals/assistance';
import { Skeleton } from '@material-ui/lab';
import { useAuth } from 'utils/hooks';
import { HOUSEHOLD } from 'utils/constants';
import { NotYetImpl } from 'components/modals/notYetImpl';
import { OrchestratorContext } from 'components/orchestrator/collector';
import { SIMPLE_CLICK_EVENT, paradataHandler } from 'utils/events';

const utilInfo = (type, page) => {
  return { ...SIMPLE_CLICK_EVENT, id: `${type}-button`, page };
};

const useStyles = makeStyles(theme => ({
  title: { flexGrow: 1 },
}));

const AppBarMenu = ({ title }) => {
  const {
    metadata: { inseeContext },
    validated,
    currentPage,
  } = useContext(OrchestratorContext);
  const { oidcUser, logout } = useAuth();
  const isAuthenticated = oidcUser?.profile;
  const [anchorEl, setAnchorEl] = useState(null);
  const [assistance, setAssistance] = useState(false);
  const [nyi, setNyi] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = () => {
    if (isAuthenticated && inseeContext === HOUSEHOLD) {
      return (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={'menuId'}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={paradataHandler(logout)(utilInfo('logout', currentPage))}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <Typography variant="inherit">Déconnexion</Typography>
          </MenuItem>

          {false && <MenuItem onClick={handleMenuClose}>My account</MenuItem>}
        </Menu>
      );
    }
  };

  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {!validated && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setNyi(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" className={classes.title}>
            {title ? title : <Skeleton variant="text" />}
          </Typography>
          <IconButton
            aria-label="Assistance"
            color="inherit"
            onClick={paradataHandler(() => setAssistance(true))(
              utilInfo('assistance', currentPage)
            )}
          >
            <Help />
          </IconButton>
          {isAuthenticated && (
            <IconButton
              edge="end"
              aria-label="Compte de l'utilisateur"
              aria-controls={'menuId'}
              aria-haspopup="true"
              onClick={paradataHandler(handleProfileMenuOpen)(
                utilInfo('profile-menu', currentPage)
              )}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu()}
      <NotYetImpl open={nyi} setOpen={setNyi} />
      <AssistanceConfirm open={assistance} setOpen={setAssistance} />
    </>
  );
};
export default AppBarMenu;
