import React, { useEffect, useState } from 'react';
import '../../../css/subpage/calendar.css';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import Swal from 'sweetalert2';
import DiaryHeader from './DiaryHeader';
import ScrollToTop from '../../ScrollToTop';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import { useValidationUser } from '../../../js/api/ValidationApi';
// 자녀별로 색 다르게 => eventcolor

const CalendarForDiary = ({ validationUser, setIsLoading, isLoading }) => {
    const validationUse = useValidationUser();
    const [diaryCalendarData, setDiaryCalendarData] = useState(null);
    const userLoginDispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const getDiary = async () => {
            try {
                const validateResponse = validationUser('post', '/user/validate');
                try {
                    validationUser('get', '/diary/dailyDiaries').then((res) => {
                        if (res != undefined && res.success) {
                            setDiaryCalendarData(res.data);
                        }
                    });
                    setIsLoading(true);
                } catch (error) {
                    console.log('데이터 파싱 에러');
                    console.log(error);
                }
            } catch (error) {
                console.log(error);
                userLoginDispatch(userStateAction.setState(false));
            } finally {
                setIsLoading(false);
            }
        };
        getDiary();
    }, []);

    const eventClick = (clickInfo) => {
        const { title, display, id, groupId, constraint } = clickInfo.event;
        Swal.fire({
            title: title,
            text: display,
            imageUrl: constraint,
            imageWidth: 350,
            imageHeight: 350,
            showConfirmButton: true,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '수정',
            denyButtonText: '삭제',
            cancelButtonText: '닫기',
        }).then((res) => {
            if (res.isConfirmed) {
                navigate('/diary/modify_child_info/' + groupId + '/' + id);
            } else if (res.isDenied) {
                Swal.fire({
                    title: '정말 삭제하시겠습니까?',
                    text: '삭제하시면 복구가 불가능합니다.',
                    showConfirmButton: true,
                    showCancelButton: true,
                    cancelButtonText: '아니오',
                    confirmButtonText: '예',
                }).then((res) => {
                    if (res.isConfirmed) {
                        try {
                            validationUser('delete', '/diary/dailyDiary/' + groupId + '/' + id).then((res) => {
                                if (res != undefined && res.success) {
                                    validationUser('get', '/diary/dailyDiaries').then((res) => {
                                        if (res != undefined && res.success) {
                                            setDiaryCalendarData(res.data);
                                        }
                                    });
                                    Swal.fire({
                                        icon: 'success',
                                        title: '성공적으로 삭제되었습니다.',
                                        content: '*^^*',
                                        confirmButtonText: '확인',
                                    }).then();
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: '삭제하지 못했습니다.',
                                        content: '다시 시도해주세요',
                                        confirmButtonText: '확인',
                                    });
                                }
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            }
        });
    };

    let calendarContents = [];

    let color = ['#ff9aa3', 'skyblue', 'yellow'];

    (diaryCalendarData !== null && Array.isArray(diaryCalendarData) ? diaryCalendarData : []).map((idx) =>
        calendarContents.push({
            title: idx.cd_name + ' [' + idx.title + ']',
            display: idx.content,
            date: idx.reg_date,
            constraint: idx.img,
            color: color[idx.sequence - 1],
            allDay: 1,
            id: idx.no,
            groupId: idx.cd_no,
        })
    );

    return (
        <div className="post_full_section">
            <DiaryHeader select={'달력'} src={'/test_imgs/png/diary3.png'} />
            {diaryCalendarData == null ? (
                <div>로딩중</div>
            ) : (
                <div className="add_diary_container" style={{ width: '90%' }}>
                    <div className="calendar_wrap">
                        <div className="calendar_section">
                            <div className="calendar_second_wrap">
                                <div id="calendar">
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        initialView={'dayGridMonth'}
                                        headerToolbar={{
                                            start: 'today',
                                            center: 'title',
                                            end: 'prev,next',
                                        }}
                                        eventMinWidth={'10vh'}
                                        height={'85vh'}
                                        events={calendarContents}
                                        eventClick={eventClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarForDiary;
