import { useSelector } from "react-redux"
import { Footer } from '../footer/Footer'
import s from './About.module.scss'


import { useNavigate } from 'react-router-dom'

export const About = () => {
    const language = useSelector((state) => state.app.language)
    const navigate = useNavigate()

    function setLocale() {
        const loctext = {}
        if (language == "ru") {
            loctext.title = "Как работает наш сервис"
            loctext.t1 = "Клиент формирует запрос на аренду."
            loctext.t2 = "Сервис в автоматическом режиме опрашивает ближайшие сервисы проката по наличию байка с нужными параметрами."
            loctext.t3 = "Несколько сервисов принимают приглашение, подтверждая тем самым, что скутер  находится в наличии и готов к аренде."
            loctext.t4 = "После того, как сервис проката подтвердил аренду, клиент получает предложение с фотографией и указанием технического состояния скутера. Указана цена исходя из всего срока аренды."
            loctext.t5 = "В итоге клиент получает качественную подборку предложений под свои параметры."
            loctext.t6 = "Оплата только после доставки клиенту."
        } else if (language == "en") {
            loctext.title = "How our service works"
            loctext.t1 = "The client forms a rental request."
            loctext.t2 = "The service automatically polls the nearest rental services based on the availability of a bike with the necessary parameters."
            loctext.t3 = "Several services accept the invitation, thereby confirming that the scooter is available and ready for rent."
            loctext.t4 = "After the rental service has confirmed the rental, the client receives an offer with a photo and an indication of the technical condition of the scooter. The price is based on the entire rental period."
            loctext.t5 = "As a result, the client receives a high-quality selection of offers for their parameters."
            loctext.t6 = "Payment is made only after delivery to the customer."
        }
        return loctext
    }

    const text = setLocale()

    return (
        <>
        <div className={s.wrapper} onClick={() => navigate("/support")}>
            <div className={s.title}>{text.title}</div>
            <div className={s.item}>
                <div className={s.number}>1</div>
                <div className={s.text}>{text.t1}</div>
            </div>

            <div className={s.item}>
                <div className={s.number}>2</div>
                <div className={s.text}>{text.t2}</div>
            </div>

            <div className={s.item}>
                <div className={s.number}>3</div>
                <div className={s.text}>{text.t3}</div>
            </div>

            <div className={s.item}>
                <div className={s.number}>4</div>
                <div className={s.text}>{text.t4}</div>
            </div>

            <div className={s.item}>
                <div className={s.number}>5</div>
                <div className={s.text}>{text.t5}</div>
            </div>

            <div className={s.item}>
                <div className={s.number}>6</div>
                <div className={s.text}>{text.t6}</div>
            </div>

            
        </div>
        <Footer />
        </>
    )
}