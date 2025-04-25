import React, { Component } from 'react';
import './LandingPage.css';
import jagdhanbNoBG from '../Assets/jagdhambNoBg.png';
import Navbar from '../Navbar/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PropTypes from "prop-types";

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} custom-arrow next-arrow`}
            style={{ ...style }}
            onClick={onClick}
        >
            &gt; {/* HTML entity for > */}
        </div>
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} custom-arrow prev-arrow`}
            style={{ ...style }}
            onClick={onClick}
        >
            &lt; {/* HTML entity for < */}
        </div>
    );
};


const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    appendDots: dots => (
        <div style={{ bottom: '10px' }}>
            <ul style={{ margin: "0px", padding: "0px" }}>{dots}</ul>
        </div>
    ),
    customPaging: i => (
        <div className="custom-dot" />
    ),
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1
            }
        }
    ]
};

class LandingPage extends Component {

    render() {
        return (
            <>
                <Navbar />
                <div className="full-width-carousel">
                    <Slider {...settings}>
                        <div className="full-width-slide">
                            <img src=
                                "https://thumbs.dreamstime.com/b/ramanbaug-dhol-tasha-pathak-procession-playing-streets-pune-hindu-festival-india-september-celebration-beating-drums-195774881.jpg"
                                alt="Slide 1"
                                className="slide-image" />
                        </div>
                        <div className="full-width-slide">
                            <img src=
                                "https://th.bing.com/th/id/OIP.ieBH5z8TZXfuaeiQzQ04dQHaE8?rs=1&pid=ImgDetMain"
                                alt="Slide 2"
                                className="slide-image" />
                        </div>
                        <div className="full-width-slide">
                            <img src=
                                "https://th.bing.com/th/id/OIP.129z0qIYq94GKISKvDb65gAAAA?rs=1&pid=ImgDetMain"
                                alt="Slide 3"
                                className="slide-image" />
                        </div>
                    </Slider>
                </div>
                <div className="video-image-container">
                    <div className="video-and-text">
                        <div className="video-responsive">
                            <iframe
                                width="853"
                                height="480"
                                src={`https://www.youtube.com/embed/NMTE66i9nAg`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                            />
                        </div>
                        <p className="below-video-text">Lorem Ipsum</p>
                        <p className="video-description">Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
                    </div>

                    <div className="image-gallery">
                        <img src="https://c8.alamy.com/comp/2CFJ3F7/pune-india-september-4-2017-closeup-of-a-member-from-shivmudra-dhol-tasha-pathak-happily-playing-dhol-drum-on-the-streets-of-pune-on-the-occasi-2CFJ3F7.jpg" alt="Image 1" />
                        <img src="https://c8.alamy.com/comp/2CFJ3F7/pune-india-september-4-2017-closeup-of-a-member-from-shivmudra-dhol-tasha-pathak-happily-playing-dhol-drum-on-the-streets-of-pune-on-the-occasi-2CFJ3F7.jpg" alt="Image 2" />
                        <img src="https://c8.alamy.com/comp/2CFJ3F7/pune-india-september-4-2017-closeup-of-a-member-from-shivmudra-dhol-tasha-pathak-happily-playing-dhol-drum-on-the-streets-of-pune-on-the-occasi-2CFJ3F7.jpg" alt="Image 3" />
                        <img src="https://c8.alamy.com/comp/2CFJ3F7/pune-india-september-4-2017-closeup-of-a-member-from-shivmudra-dhol-tasha-pathak-happily-playing-dhol-drum-on-the-streets-of-pune-on-the-occasi-2CFJ3F7.jpg" alt="Image 4" />
                        <img src="https://c8.alamy.com/comp/2CFJ3F7/pune-india-september-4-2017-closeup-of-a-member-from-shivmudra-dhol-tasha-pathak-happily-playing-dhol-drum-on-the-streets-of-pune-on-the-occasi-2CFJ3F7.jpg" alt="Image 5" />
                        <img src="https://c8.alamy.com/comp/2CFJ3F7/pune-india-september-4-2017-closeup-of-a-member-from-shivmudra-dhol-tasha-pathak-happily-playing-dhol-drum-on-the-streets-of-pune-on-the-occasi-2CFJ3F7.jpg" alt="Image 6" />
                    </div>
                </div>
                <p>hello</p>
            </>
        );
    }
}

export default LandingPage;
