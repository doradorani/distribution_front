import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/common/common.css';
import '../css/home.css';
import { Link } from 'react-router-dom';
import useScrollFadeIn from './useScrollFadeIn';

const Home = ({ setSelectedUserLoginBtn }) => {
    const fadeIn1 = useScrollFadeIn('left');
    const fadeIn2 = useScrollFadeIn('left');
    const fadeIn3 = useScrollFadeIn('left');
    const fadeIn4 = useScrollFadeIn('right');
    const fadeIn5 = useScrollFadeIn('right');
    const fadeIn6 = useScrollFadeIn('right');
    const fadeIn7 = useScrollFadeIn('left');

    const elements = [fadeIn1, fadeIn2, fadeIn3, fadeIn4, fadeIn5, fadeIn6];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1, // 해당 비율 이상이 화면에 드러나면 감시됨
        };

        const callback = (entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // 현재 감시된 요소가 화면에 나타나면 500ms 후에 나타나도록 설정
                    setTimeout(() => {
                        elements[index].ref.current.style.transition = 'opacity 0.5s ease-in-out';
                        elements[index].ref.current.style.opacity = 1;
                    }, 500);
                    // 해당 요소 감시 중지
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(callback, observerOptions);

        // 모든 요소를 감시 대상으로 등록
        elements.forEach((element) => {
            if (element.ref.current) {
                observer.observe(element.ref.current);
            }
        });

        return () => observer.disconnect();
    }, [elements]);

    return (
        <div id="home_wrap">
            <div className="home_main_img">
                <img src="/test_imgs/baby_imgs/baby10.jpg" />
            </div>
            <div className="home_section1">
                <div className="main_home_subtitle">
                    <p>자녀의 소중한 순간을 기록해 주세요</p>
                    <p>아기자기</p>
                </div>
            </div>
            <div className="home_section2">
                <div className="home_section2_img">
                    <img src="/test_imgs/diary_imgs/diary1.jpg" />
                </div>
                <div className="home_section2_content">
                    <div ref={fadeIn1?.ref} style={fadeIn1?.style}>
                        Lorem ipsum dolor sit amet
                    </div>
                    <div ref={fadeIn2?.ref} style={fadeIn2?.style}>
                        Lorem ipsum dolor sit amet consectetur adipisicing
                    </div>
                    <Link to="/diary">
                        <button ref={fadeIn3?.ref} style={fadeIn3?.style}>
                            일기 작성하기
                        </button>
                    </Link>
                </div>
            </div>
            <div className="home_section3">
                <div className="home_section3_content">
                    <div ref={fadeIn4?.ref} style={fadeIn4?.style}>
                        Lorem ipsum dolor sit amet
                    </div>
                    <div ref={fadeIn5?.ref} style={fadeIn5?.style}>
                        Lorem ipsum dolor sit amet consectetur adipisicing
                    </div>
                    <Link to="/community">
                        <button ref={fadeIn6?.ref} style={fadeIn6?.style}>
                            커뮤니티 구경하기
                        </button>
                    </Link>
                </div>
                <div className="home_section3_img" ref={fadeIn7?.ref} style={fadeIn7?.style}>
                    <img src="/test_imgs/sns_imgs/baby_commu.jpg" />
                </div>
            </div>
            {/* <div className="home_section4"></div> */}
        </div>
    );
};

export default Home;
