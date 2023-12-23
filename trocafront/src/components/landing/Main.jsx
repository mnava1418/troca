import { PATHS } from '../../config';
import Button from 'react-bootstrap/Button';

import '../../styles/Main.css'

import imgOne from '../../assets/img/hero_img_1.png'

function Main() {
    const openPortfolio = () => {
      window.location.href = PATHS.portfolio
    }

    const exploreMore = () => {
      const stepsSection = document.getElementById('startSection')

      if (stepsSection) {
        stepsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    return (
      <div className="cs-dark" style={{width: '100%'}}>
            <main className="full-screen-transparency cs-hero cs-style1 cs-type1 cs-bg" id="home">
                <div className="cs-dark_overlay"></div>
                <div className="container">
                    <div className="cs-hero_text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.35s">
                        <h2 className="cs-hero_secondary_title cs-font_24 cs-font_18_sm">Welcome to TROCA,</h2>
                        <h1 className="cs-hero_title cs-font_64 cs-font_36_sm cs-bold">The easiest way <br />to trade your NFTs.</h1>
                        <div className="cs-btn_group">
                            <Button variant="primary" style={{fontWeight: '600'}} onClick={exploreMore}>Explore More</Button>
                            <Button variant="outline-light" style={{fontWeight: '600'}} onClick={openPortfolio}>View Portfolio</Button>
                        </div>
                        <h3 className="cs-hero_subtitle cs-font_18 cs-font_16_sm cs-body_line_height">
                            Create your own NFTs and start trading <br />with other users from the network.
                        </h3>
                    </div>
                    <div className="cs-hero_img wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">
                        <img src={imgOne} alt="Troca" />
                    </div>
                </div>
                <div id="background-wrap">
                <div className="bubble x1"></div>
                <div className="bubble x2"></div>
                <div className="bubble x3"></div>
                <div className="bubble x4"></div>
                <div className="bubble x5"></div>
                <div className="bubble x6"></div>
                <div className="bubble x7"></div>
                <div className="bubble x8"></div>
                <div className="bubble x9"></div>
                <div className="bubble x10"></div>
            </div>
            </main>
        </div>
    );
  }
  
  export default Main;
  

  /**
  export default Landing;
  /**
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TROCA - NFT Exchange Platform</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #1e1e1e;
            color: #fff;
        }

        header {
            background-color: #3498db;
            text-align: center;
            padding: 2em;
        }

        h1, h2 {
            color: #fff;
        }

        section {
            max-width: 100%;
            margin: 2em auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }

        .card {
            width: 45%;
            margin: 1em;
            padding: 1.5em;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
            background-color: #2c3e50;
        }

        button {
            background-color: #3498db;
            color: #fff;
            padding: 0.8em 1.5em;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #2980b9;
        }

        footer {
            background-color: #3498db;
            text-align: center;
            padding: 1em;
            position: fixed;
            bottom: 0;
            width: 100%;
        }

        @media (max-width: 768px) {
            .card {
                width: 90%;
            }
        }
    </style>
</head>
<body>

    <header>
        <h1>TROCA - NFT Exchange Platform</h1>
        <p>Discover, buy, sell, and create NFTs easily and securely</p>
    </header>

    <section>
        <div class="card">
            <h2>Connect My Wallet</h2>
            <p>Safely connect to your favorite wallet to manage your NFTs.</p>
        </div>

        <div class="card">
            <h2>Buy NFTs</h2>
            <p>Explore and acquire unique NFTs from artists around the world.</p>
        </div>

        <div class="card">
            <h2>Participate in Auctions</h2>
            <p>Join exciting auctions where you can win amazing NFTs.</p>
        </div>

        <div class="card">
            <h2>Register and Become a Member</h2>
            <p>Join the TROCA community and unlock exclusive member features.</p>
            <button>Join Now</button>
        </div>
    </section>

    <section>
        <div class="card">
            <h2>Mint My Own NFTs</h2>
            <p>Create and customize your own NFTs easily and uniquely.</p>
        </div>

        <div class="card">
            <h2>Trade with Other Members</h2>
            <p>Connect with collectors and engage in exclusive NFT trades.</p>
        </div>

        <div class="card">
            <h2>Zero Commission</h2>
            <p>As a member, enjoy the freedom to sell without worrying about commissions.</p>
        </div>
    </section>

    <footer>
        <p>&copy; 2023 TROCA. All rights reserved.</p>
    </footer>

</body>
</html>

   */


/**<section>
        <div class="card">
            <h2>Connect My Wallet</h2>
            <p>Safely connect to your favorite wallet to manage your NFTs.</p>
        </div>

        <div class="card">
            <h2>Buy NFTs</h2>
            <p>Explore and acquire unique NFTs from artists around the world.</p>
        </div>

        <div class="card">
            <h2>Participate in Auctions</h2>
            <p>Join exciting auctions where you can win amazing NFTs.</p>
        </div>

        <div class="card">
            <h2>Register and Become a Member</h2>
            <p>Join the TROCA community and unlock exclusive member features.</p>
            <button>Join Now</button>
        </div>
    </section>

    <section>
        <div class="card">
            <h2>Mint My Own NFTs</h2>
            <p>Create and customize your own NFTs easily and uniquely.</p>
        </div>

        <div class="card">
            <h2>Trade with Other Members</h2>
            <p>Connect with collectors and engage in exclusive NFT trades.</p>
        </div>

        <div class="card">
            <h2>Zero Commission</h2>
            <p>As a member, enjoy the freedom to sell without worrying about commissions.</p>
        </div>
    </section>

    <footer>
        <p>&copy; 2023 TROCA. All rights reserved.</p>
    </footer> */