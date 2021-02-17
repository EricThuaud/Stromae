import errorMessage from './errorMessage';
import buttonMessage from './buttonMessage';
import visualizeMessage from './visualizeMessage';

const dictionary = {
  survey: {
    fr: 'Questionnaire',
    en: 'Survey',
  },

  cookieTitle: { fr: 'Utilisation des cookies', en: 'Cookie Usage' },
  cookieConsent: {
    fr: `Pour son bon fonctionnement, le site utilise des cookies, en remplissant le questionnaire, vous acceptez l'installation et l'utilisation de cookies sur votre poste.`,
    en: `For its proper functioning, the site uses cookies. By filling out the questionnaire, you accept the installation and use of cookies on your computer.`,
  },
  assistanceTitle: { fr: `Contacter l'assistance`, en: `Contact Support` },
  assistanceBody: {
    fr: `Vous êtes sur le point de contacter l'assistance, en êtes-vous sûr ?`,
    en: `Are you about to contact support, are you sure?`,
  },
  welcomeBackTitle: { fr: `Bienvenue`, en: `Welcome` },
  welcomeBackBody: {
    fr: `Vous avez déjà commencé à renseigner le questionnaire. \n\n Pour poursuivre votre saisie dans le questionnaire,\n\n que souhaitez-vous faire ?`,
    en: `You have already started to fill in the questionnaire. What do you want to do to continue your entry in the questionnaire?`,
  },
  ...errorMessage,
  ...buttonMessage,
  ...visualizeMessage,
};

export default dictionary;
