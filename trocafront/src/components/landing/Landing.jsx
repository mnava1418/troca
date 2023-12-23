import Main from './Main';
import Steps from './Steps';
import Networks from './Networks';
import FAQ from './FAQ'
import Contact from './Contact';
import Footer from './Footer';

//CSS
import '../../assets/css/plugins/bootstrap.min.css'
import '../../assets/css/plugins/slick.css'
import '../../assets/css/plugins/animate.css'
import '../../assets/css/style.css'
import '../../styles/Main.css'

function Landing() {
    return (
        <>
            <Main />
            <div className="cs-height_70 cs-height_lg_40"></div>
            <Steps />
            <div className="cs-height_70 cs-height_lg_40"></div>
            <Networks />
            <div className="cs-height_70 cs-height_lg_40"></div>
            <FAQ />
            <div className="cs-height_70 cs-height_lg_40"></div>
            <Contact />
            <div className="cs-height_70 cs-height_lg_40"></div>
            <Footer />
        </>
    )
}
        
export default Landing;
  