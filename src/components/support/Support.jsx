import { useSelector } from "react-redux"
import { Footer } from '../footer/Footer'
import s from './Support.module.scss'
import support_logo from './../../static/images/support_logo.png'
import Icon from "../icon/Icon"

import { useNavigate } from 'react-router-dom'
import { useContext } from "react"
import { OptionsContext } from "../../context/misc"
import { TelegramWebAppContext } from "../../context/telegram"
import config from "../../config"

export const Support = () => {
    const language = useSelector((state) => state.app.language)
	const options = useContext(OptionsContext)
	const webapp = useContext(TelegramWebAppContext)
    const navigate = useNavigate()

    function setLocale() {
        const loctext = {}
        if (language == "ru") {
            loctext.title = "Перейти в чат с поддержкой"
            loctext.subtitle = "Вы в любой момент можете вернуться в приложение, чтобы продолжить"
            loctext.button = "Написать менеджеру"
        } else if (language == "en") {
            loctext.title = "Go to chat with support"
            loctext.subtitle = "You can return to the app at any time to continue"
            loctext.button = "Write to the manager"
        }
        return loctext
    }

    const text = setLocale()

    return (
			<>
				<div className={s.wrapper} onClick={() => webapp.openTelegramLink(options.web_app_manager_link || config.DEFAULT_MANAGER)}>
					<div className={s.info}>
						<Icon>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="41"
								height="50"
								viewBox="0 0 41 50"
								fill="none">
								<path
									d="M20.3424 0.76442C9.1496 0.76442 0.0791016 9.88084 0.0791016 21.1219C0.0791016 32.363 9.1496 41.4795 20.3424 41.4795V49.9399L34.1952 35.977C38.1407 32.2641 40.6056 26.9818 40.6056 21.1219C40.6066 9.88084 31.5324 0.76442 20.3424 0.76442ZM20.2736 27.3812C18.6576 27.3812 17.1827 26.7644 16.0718 25.7511H16.069L15.6929 25.376L15.6446 25.3246L11.3796 21.1005H14.022C14.022 17.6321 16.8214 14.8207 20.2727 14.8207C23.7278 14.8207 26.5262 17.6331 26.5262 21.1005C26.5271 24.5688 23.7287 27.3812 20.2736 27.3812Z"
									fill="#54667A"
								/>
							</svg>
						</Icon>

						<div>{text.title}</div>
						<div className={s.subtitle}>{text.subtitle}</div>
					</div>

					<div className={s.bottom}>
						<div className={s.button}>{text.button}</div>
					</div>
				</div>
				<Footer />
			</>
		);
}