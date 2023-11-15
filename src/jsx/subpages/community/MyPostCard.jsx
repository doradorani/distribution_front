import React from 'react';
import { Link } from 'react-router-dom';

const MyPostCard = ({ data }) => {
    const myPostImgsPathArray = data?.imgs_path.split(',');
    const myPoststhumbnail = myPostImgsPathArray[0];
    return (
        <>
            <Link to={`/community/detail_post/${data.no}`} className="none_underline">
                <div className="my_posts_post_main_img">
                    <img src={myPoststhumbnail} />
                    <div>
                        <p className="flex" style={{ color: '#FFF', fontSize: '1.3em', fontWeight: 'bold' }}>
                            <img
                                src="/test_imgs/png/love.png"
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    marginRight: '5px',
                                    objectFit: 'cover',
                                }}
                            />
                            {data?.like_cnt} &nbsp;&nbsp;
                            <img
                                src="/test_imgs/png/chat.png"
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    marginRight: '5px',
                                    objectFit: 'cover',
                                }}
                            />
                            {data?.reply_cnt}
                        </p>
                    </div>
                    <span className="background_for_posts"></span>
                </div>
            </Link>
        </>
    );
};

export default MyPostCard;
