import { displayResult } from '../components/dialog.js';
export class ApiClient {
    constructor() {
        this.apiKey = 'your_secret_api_key';
        // const platform = localStorage.getItem('platform');
        let url_string = window.location.href
        let questionMarkCount = 0;
        let modified_url = url_string.replace(/\?/g, function(match) {
            questionMarkCount++;
            return questionMarkCount === 2 ? '&' : match;
        });
        const url = new URL(modified_url);
        const params = new URLSearchParams(url.search);
        const platform = params.get('platform');
        const baseUrlMap = {
            'STEEM': 'https://develop-imridd.eu.pythonanywhere.com/api/steem',
            'HIVE': 'https://develop-imridd.eu.pythonanywhere.com/api/hive'
        };
        this.baseUrl = baseUrlMap[platform] || (() => {
            console.error('Invalid start parameter:',platform);
            displayResult(
                { error: 'Invalid start parameter, please reload the page' },
                'error',
                true
            );
            return null;
        })();

        if (!this.baseUrl) {
            displayResult(
                { error: 'Error during initialization, please reload the page' },
                'error',
                true
            );
        }
    }

    async sendRequest(endpoint, method, data = null) {
        const telegramData = {
            'id': window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_id',
            'first_name': window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'default_first_name',
            'username': window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'default_username',
            'auth_date': window.Telegram?.WebApp?.initDataUnsafe?.auth_date || 'default_auth_date',
            'hash': window.Telegram?.WebApp?.initDataUnsafe?.hash || 'default_hash'
        };

        const idTelegram = localStorage.getItem('idTelegram');
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'API-Key': this.apiKey,
                'Id-Telegram': idTelegram,
                'Telegram-Data': window.Telegram?.WebApp?.initData,
            },
            body: data ? JSON.stringify(data) : null
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    login(idTelegram, username, postingKey) {
        return this.sendRequest('/login', 'POST', { id_telegram: idTelegram, username, posting_key: postingKey });
    }

    signerlogin(idTelegram, username, postingKey) {
        return this.sendRequest('/signerlogin', 'POST', { id_telegram: idTelegram, username, posting_key: postingKey });
    }

    logout(idTelegram, username) {
        return this.sendRequest('/logout', 'POST', { id_telegram: idTelegram, username });
    }

    saveDraft(username, title, tags, body, scheduledTime, timezone, community) {
        return this.sendRequest('/save_draft', 'POST', { username, title, tags, body, scheduled_time: scheduledTime, timezone, community });
    }

    getUserDrafts(username) {
        return this.sendRequest(`/get_user_drafts?username=${username}`, 'GET');
    }

    deleteDraft(id, username) {
        return this.sendRequest('/delete_draft', 'DELETE', { id, username });
    }

    postToSteem(username, title, body, tags, community) {
        console.log('Posting to Steem:', username, title, body, tags, community);
        return this.sendRequest('/post', 'POST', { username, title, body, tags, community });
    }

    createAccount(username, postingKey) {
        return this.sendRequest('/create_account', 'POST', { username, posting_key: postingKey });
    }

    readAccount(username) {
        return this.sendRequest(`/read_account?username=${username}`, 'GET');
    }

    updateAccount(username, postingKey) {
        return this.sendRequest('/update_account', 'PUT', { username, posting_key: postingKey });
    }

    deleteAccount(username) {
        return this.sendRequest('/delete_account', 'DELETE', { username });
    }

    checkLogin(idTelegram) {
        return this.sendRequest('/check_login', 'POST', { id_telegram: idTelegram });
    }

    listaComunities() {
        return this.sendRequest('/communities', 'GET');
    }

}