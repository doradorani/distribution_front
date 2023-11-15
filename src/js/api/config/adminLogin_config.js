import { store } from '../redux_store/store'; // Redux 스토어의 경로로 변경

//redux의 상태 값으로 저장된 것을 config에 담아 전역적으로 사용할 수 있게 함
//subscribe : store에 변화가 일어날 때(state값이 변경될 때) 자동으로 실행
//hook 안에서는 hook을 호출할 수 없는 점을 확인
store.subscribe(() => {
    adminLogin_config.state = store.getState().adminLogin.adminState;
    adminLogin_config.grade = store.getState().adminLogin.adminGrade;
    adminLogin_config.account = store.getState().adminLogin.adminAccount;
});

const adminLogin_config = {
    state: false,
    grade: 0,
    account: '',
};

export default adminLogin_config;
