import { initializeTelegram } from '../services/telegram.js';
import { displayResult } from '../components/dialog.js';
import { enableNavigationButtons, getListaComunities } from './utils.js';
import { showPage } from '../services/pageService.js';
import { appState } from './AppState.js';
import { setUsernameForImageUpload } from '../api/image-upload.js';
import { AccountManager } from '../pages/accountListPage.js';


class AppInitializer {
    constructor() {
        this.usernames = [];
        this.accountManager = new AccountManager();
    }

    static getInstance() {
        if (!AppInitializer.instance) {
            AppInitializer.instance = new AppInitializer();
        }
        return AppInitializer.instance;
    }

    async initializeApp() {
        try {
            const idTelegram = await initializeTelegram();
            localStorage.setItem('idTelegram', idTelegram);

            if (!idTelegram) {
                throw new Error('Unable to obtain Telegram ID');
            }

            this.showSpinner();

            const result = await appState.client.checkLogin(idTelegram);
            if (!result.usernames) {
                this.handleNoUsernamesFound();
                return;
            }
            this.initializeAccountList(result.usernames);
            this.setUsernames(result.usernames);
            enableNavigationButtons();
            this.initializeEnd(result);
        } catch (error) {
            this.handleInitializationError(error);
        } finally {
            this.hideSpinner();
        }
    }

    handleNoUsernamesFound() {
        this.hideSpinner();
        this.perfotmGoToLoginPage();
    }

    perfotmGoToLoginPage() {
        showPage('loginPage');
    }

    async initializeAccountList(usernames) {
        this.accountManager.platform_logo();
        usernames.forEach(username => this.accountManager.createAccountListItem(username));
    }

    handleInitializationError(error) {
        console.error('Error in handleInitializationError:', error);
        displayResult(
            { error: error.message },
            'error',
            true
        );
    }

    initializeEnd(result) {
        enableNavigationButtons();
        console.log('initializeEnd', result);
        window.listaComunities = getListaComunities();
        this.usernames = result.usernames;
        this.updateAccountList(this.usernames);
        if (this.usernames.length > 0) {
            this.selectFirstAccount(this.usernames);
        }
        this.hideSpinner();
        showPage('accountPage');
    }

    updateAccountList(usernames) {
        const accountList = document.getElementById('accountList');
        accountList.innerHTML = '';
        this.initializeAccountList(usernames);
    }

    selectFirstAccount(usernames) {
        window.usernameSelected = usernames[0];
        setUsernameForImageUpload(window.usernameSelected.username, localStorage.getItem('idTelegram'));
        const firstAccountContainer = document.getElementById('accountList').querySelector('.container-username');
        if (firstAccountContainer) {
            this.accountManager.selectAccount(window.usernameSelected, firstAccountContainer);
        }
    }

    showSpinner() {
        document.getElementById('spinner').classList.remove('hide');
    }

    hideSpinner() {
        document.getElementById('spinner').classList.add('hide');
    }

    getUsernames() {
        return this.usernames;
    }

    setUsernames(value) {
        this.usernames = value;
    }
}

const appInitializerInstance = AppInitializer.getInstance();
export default appInitializerInstance;

