import React, { useEffect, useState } from 'react';
import '../../../css/subpage/calendar.css';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import DiaryHeader from './DiaryHeader';
import Swal from 'sweetalert2';
import { useValidationUser } from '../../../js/api/ValidationApi';
// 자녀별로 색 다르게 => eventcolor

const CalendarListVer = ({ adContents, validationUser, setIsLoading, isLoading }) => {
    const validationUse = useValidationUser();
    const [healthCalendarData, setHealthCalendarData] = useState(null);
    const userLoginDispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        const getDiary = async () => {
            try {
                const validateResponse = validationUser('post', '/user/validate');
                try {
                    validationUser('get', '/childHealth/inoculationNotes').then((res) => {
                        if (res != undefined && res.success) {
                            setHealthCalendarData(res.data);
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
        const { groupId, id, title, display } = clickInfo.event;

        Swal.fire({
            title: title,
            text: display,
            showConfirmButton: true,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '수정',
            denyButtonText: '삭제',
            cancelButtonText: '닫기',
        }).then((res) => {
            if (res.isConfirmed) {
                navigate('/diary/modify_child_health/' + groupId + '/' + id);
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
                            validationUser('delete', '/childHealth/childNote/' + groupId + '/' + id).then((res) => {
                                if (res != undefined && res.success) {
                                    validationUser('get', '/childHealth/inoculationNotes').then((res) => {
                                        if (res != undefined && res.success) {
                                            setHealthCalendarData(res.data);
                                        }
                                    });
                                    Swal.fire({
                                        icon: 'success',
                                        title: '성공적으로 삭제되었습니다.',
                                        content: '*^^*',
                                        confirmButtonText: '확인',
                                    });
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

    let listContents = [];

    let color = ['#ff9aa3', 'skyblue', 'gold'];

    (healthCalendarData !== null && Array.isArray(healthCalendarData) ? healthCalendarData : []).map((idx) =>
        listContents.push({
            title:
                idx.cd_name +
                '\n' +
                (idx.inoculation_agency == null ? '' : '병원 : ' + idx.inoculation_order) +
                (idx.vaccination_nm == null ? '' : ' [' + idx.vaccination_nm + '] ') +
                (idx.inoculation_order == null ? '-' : idx.inoculation_order + '차 '),
            display:
                '키: ' + idx.height + (idx.wieght == undefined ? '' : ' 몸무게: ' + idx.wieght) + ' 두위: ' + idx.head,
            start: idx.reg_date,
            backgroundColor: color[idx.sequence - 1],
            allday: 1,
            id: idx.no,
            groupId: idx.cd_no,
        })
    );

    return (
        <>
            <div className="post_full_section">
                <div className="post_section">
                    <div style={{ paddingLeft: '1.7%' }}>
                        <DiaryHeader select={'육아 수첩'} src={'/test_imgs/png/diary1.png'} />
                    </div>
                    <div className="calendar_wrap">
                        <div className="calendar_section">
                            <div className="calendar_second_wrap">
                                <div id="calendar">
                                    <FullCalendar
                                        plugins={[listPlugin]}
                                        initialView={'listWeek'}
                                        headerToolbar={{
                                            start: 'today',
                                            center: 'title',
                                            end: 'prev,next',
                                        }}
                                        eventMinWidth={'10vh'}
                                        height={'85vh'}
                                        events={listContents}
                                        eventClick={eventClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {adContents}
        </>
    );
};

export default CalendarListVer;
