import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../../../css/subpage/graph.css';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import { useDispatch } from 'react-redux';
import DiaryHeader from './DiaryHeader';

const Container = styled.div`
    width: 90vw;
    max-width: 800px;
`;
// 최근 기록 중 10개나 20개 정도의 데이터를 받아서 default로 띄우기

const Graph = ({ adContents, isLoading, setIsLoading, validationUser }) => {
    const [childGraphData, setChildGraphData] = useState();
    const userLoginDispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        setChildGraphData(null);
        const getDiary = async () => {
            try {
                const validateResponse = validationUser('post', '/user/validate');
                try {
                    validationUser('get', '/childHealth/childNotes/' + params.childNo).then((res) => {
                        if (res != undefined && res.success) {
                            setChildGraphData(res.data);
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

    const graphClick = (no) => {
        try {
            validationUser('get', '/childHealth/childNotes/' + no).then((res) => {
                if (res != undefined && res.success) {
                    setChildGraphData(res.data);
                }
            });
            setIsLoading(true);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
        // setMethodUrl({ method: 'get', url: '/childHealth/childNotes/' + no });
    };
    const color = ['rgb(54, 162, 235)', 'rgb(162, 54, 54)', 'rgb(235, 162, 54)'];

    let graphData = [];
    if (childGraphData != null) {
        graphData = childGraphData.childNoteDtos;
    }
    let childList = [];
    if (childGraphData != null) {
        childList = childGraphData.childDtos;
    }

    let childName = graphData.length > 0 ? graphData[0].cd_name : null;

    const height = [];
    const weight = [];
    const head = [];

    (graphData !== null ? graphData : []).map((idx) =>
        height.push({
            x:
                new Date(idx.reg_date).getFullYear() +
                '-' +
                (new Date(idx.reg_date).getMonth() + 1) +
                '-' +
                new Date(idx.reg_date).getDate(),
            y: idx.height,
        })
    );
    (graphData !== null ? graphData : []).map((idx) =>
        weight.push({
            x:
                new Date(idx.reg_date).getFullYear() +
                '-' +
                (new Date(idx.reg_date).getMonth() + 1) +
                '-' +
                new Date(idx.reg_date).getDate(),
            y: idx.weight,
        })
    );
    (graphData !== null ? graphData : []).map((idx) =>
        head.push({
            x:
                new Date(idx.reg_date).getFullYear() +
                '-' +
                (new Date(idx.reg_date).getMonth() + 1) +
                '-' +
                new Date(idx.reg_date).getDate(),
            y: idx.head,
        })
    );
    const data =
        graphData != null
            ? {
                  datasets: [
                      {
                          type: 'line',
                          label: childName + ' 키',
                          borderColor: color[0],
                          borderWidth: 1,
                          data: height,
                      },
                      {
                          type: 'line',
                          label: childName + ' 몸무게',
                          borderColor: color[1],
                          borderWidth: 1,
                          data: weight,
                      },
                      {
                          type: 'line',
                          label: childName + ' 머리',
                          borderColor: color[2],
                          borderWidth: 1,
                          data: head,
                      },
                  ],
              }
            : null;

    return (
        <>
            <div className="post_full_section">
                <div className="post_section">
                    <div style={{ paddingLeft: '1.7%' }}>
                        <DiaryHeader select={'육아 수첩'} src={'/test_imgs/png/diary1.png'} />
                    </div>
                    <div className="diary_wrap">
                        <div className="diary_second_wrap">
                            <div className="diary_section" style={{ width: '100%' }}>
                                <div className="diary_section_header flex" style={{ margin: '10px 0' }}>
                                    <p className="yg_font" style={{ fontSize: '2rem' }}>
                                        {graphData.length > 0 && Array.isArray(graphData)
                                            ? '우리   ' + graphData[0].cd_name
                                            : '우리   아이'}
                                        &nbsp; 성장 기록
                                    </p>
                                    <div className="go_to_write_health_note" style={{ margin: 'auto 0' }}>
                                        <Link to="/diary/register_child_health">
                                            <input
                                                type="button"
                                                value="오늘의 건강 기록 작성"
                                                className="btn btn-primary"
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-secondary dropdown-toggle"
                                        type="button"
                                        id="dropdownMenu2"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ float: 'right' }}
                                    >
                                        {graphData.length > 0 && Array.isArray(graphData)
                                            ? graphData[0].cd_name
                                            : '아이 선택'}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                        {(childGraphData !== null ? childList : []).map((idx) => (
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    type="button"
                                                    onClick={() => graphClick(idx.no)}
                                                >
                                                    {idx.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="area_for_graph_detail">
                                    {graphData.length > 0 ? (
                                        <Container>
                                            <Line type="line" data={data} />
                                        </Container>
                                    ) : (
                                        <div
                                            className="yg_font bold"
                                            style={{ width: '90vw', maxWidth: '800px', textAlign: 'center' }}
                                        >
                                            <span style={{ lineHeight: '350px', height: '350px', fontSize: '1.6rem' }}>
                                                건강 기록을 작성해주세요
                                            </span>
                                        </div>
                                    )}
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

export default Graph;
