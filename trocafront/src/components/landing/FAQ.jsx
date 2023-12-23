import { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'

function FAQ() {
    const [active, setActive] = useState('0')
    
    const handleSelect = (key) => {
        if(key !== null) {
            setActive(key)
        }
    }

    return(
        <section id="faqSection">
            <div className="container">
                <div className="cs-seciton_heading cs-style1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                    <h3 className="cs-section_title cs-font_16 cs-font_14_sm cs-gradient_color">FAQ</h3>
                    <h2 className="cs-section_subtitle cs-m0 cs-font_36 cs-font_24_sm">Still have questions?</h2>
                </div>
                <div className="cs-height_50 cs-height_lg_30"></div>
                <div className="row cs-accordians cs-style1 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.4s">
                    <div className="col-lg-8 offset-lg-2">
                        <Accordion activeKey={active} flush onSelect={handleSelect}>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <div className="cs-accordian_head">
                                        <h2 className="cs-accordian_title cs-m0 cs-font_24 cs-font_18_sm"><span>Q1.</span> Why should I become a member?</h2>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    Any user can buy and sell NFTs within the marketplace but as a member you can use an AI to mint your own NFTs, trade your NFTs with other members, participate in live auctions and every time you sell an NFT, no commission will be charged.
                                </Accordion.Body>
                            </Accordion.Item>
                            <div className="cs-height_25 cs-height_lg_25"></div>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <div className="cs-accordian_head">
                                        <h2 className="cs-accordian_title cs-m0 cs-font_24 cs-font_18_sm"><span>Q2.</span> What is the cost of the membership?</h2>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    The membership cost is a one-time payment equivalent to 10 USD in ETH. Once you activate your membership, it will last forever.
                                </Accordion.Body>
                            </Accordion.Item>
                            <div className="cs-height_25 cs-height_lg_25"></div>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>
                                    <div className="cs-accordian_head">
                                        <h2 className="cs-accordian_title cs-m0 cs-font_24 cs-font_18_sm"><span>Q3.</span> Which wallets can I connect?</h2>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    At the moment, you can only connect using MetaMask but we are working to add more wallets. We want to provide you with all the tools you need to be able to trade your NFTs.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <div className="cs-height_25 cs-height_lg_25"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FAQ