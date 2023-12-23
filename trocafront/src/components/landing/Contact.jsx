function Contact() {
    return(
        <section id="contactSection">
            <div className="container">
                <div className="cs-seciton_heading cs-style1 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                    <h3 className="cs-section_title cs-font_16 cs-font_14_sm cs-gradient_color">Contact Us</h3>
                    <h2 className="cs-section_subtitle cs-m0 cs-font_36 cs-font_24_sm">Get in touch</h2>
                </div>
                <br />
                <div className="row">
                    <p><span className="cs-medium">Mobile: </span><a href="https://api.whatsapp.com/send?text=Hi Martin!&phone=13474480991" target="_blank" rel="noreferrer" style={{color: 'white'}}> +1 347 448 0991</a></p>
                    <p><span className="cs-medium">Email: </span><a href="mailto:mnavapena@gmail.com" target="_blank" rel="noreferrer" style={{color: 'white'}}> mnavapena@gmail.com</a></p>
                </div>
            </div>
        </section>
    )
}

export default Contact