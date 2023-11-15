import React, { useState, useEffect } from 'react';

const TimeRemainingDisplay = ({ timeDifference }) => {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return (
        <span style={{ color: '#000' }}>
            {days > 0 && <span>{days}일 </span>}
            {hours > 0 && <span>{hours}시간 </span>}
            {minutes > 0 && <span>{minutes}분 </span>}
            {seconds > 0 && <span>{seconds}초 </span>}
        </span>
    );
};

function CountdownTimer({ detailCobuy }) {
    const [remainingTime, setRemainingTime] = useState('');

    useEffect(() => {
        const updateRemainingTime = () => {
            const now = new Date();
            if (detailCobuy.adminCobuyEnd_Date) {
                if (now >= detailCobuy.adminCobuyEnd_Date) {
                    setRemainingTime(
                        <span>
                            <span style={{ color: '#ff4898' }}>[ 마감 ] </span>
                            <TimeRemainingDisplay timeDifference={0} />
                        </span>
                    );
                } else if (now < detailCobuy.adminCobuyStart_Date) {
                    const timeDifference = detailCobuy.adminCobuyStart_Date - now;
                    setRemainingTime(
                        <span>
                            <span style={{ color: '#ff4898' }}>
                                (개시까지&nbsp;
                                <TimeRemainingDisplay timeDifference={timeDifference} />
                                남았습니다)
                            </span>
                        </span>
                    );
                } else {
                    const timeDifference = detailCobuy.adminCobuyEnd_Date - now;
                    setRemainingTime(
                        <span>
                            <span style={{ color: '#ff4898' }}>
                                (마감까지&nbsp;
                                <TimeRemainingDisplay timeDifference={timeDifference} />
                                남았습니다)
                            </span>
                        </span>
                    );
                }
            }
        };

        const interval = setInterval(updateRemainingTime, 1000);
        updateRemainingTime();
        return () => clearInterval(interval);
    }, [detailCobuy.adminCobuyStart_Date, detailCobuy.adminCobuyEnd_Date]);

    return (
        <div className='countdown-timer'>
            <div className='countdown-dates'>
                {detailCobuy.adminCobuyStart} ~ {detailCobuy.adminCobuyEnd}
            </div>
            <div className='countdown-remaining-time' style={{ fontSize: '1.2em' }}>
                {remainingTime}
            </div>
        </div>
    );
}

export default CountdownTimer;

//ver 1 - 시간쪽 span 색 적용 불가능 코드
// import React, { useState, useEffect } from 'react';

// function CountdownTimer({ detailCobuy }) {
//     const [remainingTime, setRemainingTime] = useState('');

//     useEffect(() => {
//         const updateRemainingTime = () => {
//             const now = new Date(); // 현재 시간을 매번 새로 얻어옴
//             if (detailCobuy.adminCobuyEnd_Date) {
//                 if (now >= detailCobuy.adminCobuyEnd_Date) {
//                     setRemainingTime('[마감]');
//                 } else if (now < detailCobuy.adminCobuyStart_Date) {
//                     const timeDifference = detailCobuy.adminCobuyStart_Date - now;
//                     setRemainingTime(`(개시까지 ${formatTimeRemaining(timeDifference)} 남았습니다)`);
//                 } else {
//                     const timeDifference = detailCobuy.adminCobuyEnd_Date - now;
//                     setRemainingTime(`(마감까지 ${formatTimeRemaining(timeDifference)} 남았습니다)`);
//                 }
//             }
//         };

//         const interval = setInterval(updateRemainingTime, 1000); // 1초마다 업데이트
//         updateRemainingTime(); // 초기 업데이트
//         return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
//     }, [
//         detailCobuy.adminCobuyStart,
//         detailCobuy.adminCobuyEnd,
//         detailCobuy.adminCobuyStart_Date,
//         detailCobuy.adminCobuyEnd_Date,
//     ]);

//     const formatTimeRemaining = (timeDifference) => {
//         const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
//         return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
//     };

//     return (
//         <div className="countdown-timer">
//             <div className="countdown-dates">
//                 {detailCobuy.adminCobuyStart} ~ {detailCobuy.adminCobuyEnd}
//             </div>
//             <div className="countdown-remaining-time" style={{ fontSize: '1.2em', color: '#ff4898' }}>
//                 {remainingTime}
//             </div>
//         </div>
//     );
// }

// export default CountdownTimer;
