import { useEffect, useRef } from 'react';
import config from '../../config';
import { post } from '../../lib/api';


export function TelegramLoginButton({ buttonSize = 'large', requestAccess = 'write' }) {
    const wrapperRef = useRef()
    window.onTelegramAuth = user => {
        post('/users/loginByWidget', {}, user).then(
            user => {
                if(window.localStorage) {
                    window.localStorage.setItem('auth_token', user.token)
                }
                window.location.href = `${window.location.href}`
            }
        ).catch(alert)
    }
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', config.BOT_USERNAME);
        script.setAttribute('data-size', buttonSize);
        script.setAttribute('data-request-access', requestAccess);
        script.setAttribute(
            'data-onauth',
            'onTelegramAuth(user)'
        );
        script.async = true;
        wrapperRef.current.appendChild(script)
    }, [])
    return (
        <div ref={wrapperRef}></div>
    )
}
