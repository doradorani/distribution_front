import React, { useEffect, useState } from 'react';
// import 'turn.js';
import '../../css/subpage/diary.css';
import DiaryBook from './diary/DiaryBook.jsx';
import DiaryBookDetail from './diary/DiaryBookDetail';
import SideMenu from './SideMenu';
import CalendarForDiary from './diary/CalendarForDiary.jsx';
import Graph from './diary/Graph';
import Note from './diary/Note';
import { useValidationItem } from '../../js/api/VlidationItem.js';
import { useDispatch } from 'react-redux';
import { userStateAction } from '../../js/api/redux_store/slice/userLoginSlice';
import { Link, Route, Routes } from 'react-router-dom';
import Children from './diary/Children';
import ChildrenModifyInfo from './diary/ChildrenModifyInfo.jsx';
import DiaryModfiyPost from './diary/DiaryModfiyPost.jsx';
import CalendarListVer from './diary/CalendarLocalVer.jsx';
import FourCutsImg from './diary/FourCutsImg.jsx';
import DiaryPost from './diary/DiaryPost.jsx';
import NoteModify from './diary/NoteModify.jsx';

const Diary = ({}) => {
    const validationUser = useValidationItem();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const sideMenu = <SideMenu selectedMenu={1} />;

    const adContents = (
        <div>
            <div>
                <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
            </div>
            <div>
                <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
            </div>
        </div>
    );
    return (
        <>
            <div className="diary_wrap">
                <div>
                    <img
                        className="diary_main_img"
                        src="https://s3.ap-northeast-2.amazonaws.com/agijagi-2023.10.31/agijagi_background/diary_nav_background7.png"
                    />
                </div>
                <div className="diary_flex">
                    {sideMenu}
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <DiaryBook
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/diary_book_detail/:childNo"
                            element={
                                <DiaryBookDetail
                                    isUpdate={isUpdate}
                                    setIsUpdate={setIsUpdate}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/modify_child_info/:childNo"
                            element={
                                <ChildrenModifyInfo
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/modify_child_info/:childNo/:diaryNo"
                            element={
                                <DiaryModfiyPost
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/write_diary/:childNo"
                            element={
                                <DiaryPost
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/register_child"
                            element={
                                <Children
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/calendar"
                            element={
                                <CalendarForDiary
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/album"
                            element={
                                <FourCutsImg
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/children_health_list"
                            element={
                                <CalendarListVer
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/children_health_note/:childNo"
                            element={
                                <Graph
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/register_child_health"
                            element={
                                <Note
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                        <Route
                            path="/modify_child_health/:childNo/:healthNo"
                            element={
                                <NoteModify
                                    adContents={adContents}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    validationUser={validationUser}
                                />
                            }
                        ></Route>
                    </Routes>
                </div>
            </div>
        </>
    );
};
export default Diary;
