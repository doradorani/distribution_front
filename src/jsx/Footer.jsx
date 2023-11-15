import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/common/common.css';
import '../css/common/footer.css';
import Swal from 'sweetalert2';

const Footer = () => {
    const aboutUs = () => [Swal.fire()];

    return (
        <footer>
            <div id="footer_wrap">
                <div className="footer_contents_wrap">
                    <div className="footer_title">
                        <div className="footer_main_title">AGIJAGI</div>
                        <div>
                            <div className="hover_cursor, none_underline" onClick={() => aboutUs()}>
                                ABOUT US
                            </div>
                            <div className="hover_cursor, none_underline">PROJECT</div>
                            <div className="hover_cursor, none_underline">CONTANT</div>
                            <div className="hover_cursor, none_underline">QnA</div>
                        </div>
                    </div>
                    <div>©All rights reserved</div>
                    <div className="footer_info_section">
                        <div>
                            <span>Tel. 051-895-3435</span>
                            <span>|</span>
                            <span>Fax. 051-895-3436</span>
                            <span>|</span>
                            <span>helper@agijagi.site</span>
                        </div>
                        <div>
                            <span>Busna, Korea</span>
                            <span>|</span>
                            <span>Biz Lisence 605-12-07070</span>
                        </div>
                        <div>
                            <span>Hosting By ONE_TEAM</span>
                        </div>
                    </div>
                    <hr className="footer_hr" />
                    <div className="footer_last_info_section">
                        <span>Term of use</span>
                        <span>|</span>
                        <span>Privacy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
