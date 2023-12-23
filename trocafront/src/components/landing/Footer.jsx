import logo from '../../img/logoTransparent.png'

function Footer() {
    return(
        <footer className="cs-footer text-center">
            <div className="container">
            <div className="cs-height_70 cs-height_lg_40"></div>
            <div className="cs-footer_logo wow fadeInUp d-flex flex-row justify-content-center align-items-center" data-wow-duration="1s" data-wow-delay="0.2s">
                <div>
                <img
                    alt="TROCA"
                    src={logo}
                    width="60"
                    height="60"
                    className="d-inline-block align-top"
                />{' '}
                </div>
                <h2 style={{fontWeight: 'bold'}}>TROCA</h2>
            </div>
            <div className="cs-height_25 cs-height_lg_25"></div>
            <div className="cs-height_30 cs-height_lg_30"></div>
            <ul className="cs-footer_menu cs-primary_font cs-primary_color cs-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
                <li><a href="#home">Home</a></li>
                <li><a href="#startSection">Start</a></li>
                <li><a href="#networkSection">Networks</a></li>
                <li><a href="#faqSection">FAQ</a></li>
                <li><a href="#contactSection">Contact</a></li>
            </ul>
            </div>
            <div className="cs-height_85 cs-height_lg_25"></div>
            <div className="container wow fadeIn" data-wow-duration="1s" data-wow-delay="0.5s">
            <div className="cs-copyright text-center">{`Copyright © ${new Date().getFullYear()}. All Rights Reserved by Martin Nava`}</div>
            </div>
            <div className="cs-height_70 cs-height_lg_40"></div>
        </footer>
    )
}

export default Footer