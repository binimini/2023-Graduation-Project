
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
<img width="394" alt="스크린샷 2022-11-21 오후 3 48 47" src="https://user-images.githubusercontent.com/72961728/202983517-9f6f63fd-f17e-43dd-a12e-4fc1d6498baa.png">

  </a>


  <h3 align="center">ConCoder</h3>

  <p align="center">
    WebRTC와 WebSocket 을 이용한 실시간 알고리즘 화상 교육 웹 플랫폼
    <br />
    <br />
  </p>
</div>


ConCoder는 ConCurrency + Coder의 합성어로, "동시에 코딩하는 사람들" 이라는 의미를 가지고 있다. 

경희대학교 캡스톤디자인 수업 프로젝트의 일환으로 **화상통화와 동시 프로그래밍 서비스를 결합**하여 편리하게 하나의 웹 사이트에서 이용할 수 있는 서비스를 개발하였다. 


## Built With
높은 품질과 안정성을 보장하는 알고리즘 화상 교육 웹 서비스를 구현하기 위해 기본적인 웹 프레임워크에 WebRTC , Web Socket 통신, Multi-Thread 처리 등 여러 기술을 더하여 본 서비스를 개발하였다. 

### 기능
#### 메인 페이지
<img width="1250" alt="메인화면" src="https://github.com/binimini/2023-Graduation-Project/assets/69030160/7f852346-5982-4109-ad05-3618798c29e4">

#### 사용자 정보 연동
✨ 사용자 아이디를 입력 받아 사이트의 사용자 정보와 연동한다.

<img width="300" alt="사용자 정보 2" src="https://github.com/binimini/2023-Graduation-Project/assets/69030160/7342fb4b-c8e6-4ede-9e3a-dd71a598de2d">

#### 문제 카테고리 정보 연동
✨ 카테고리 목록 중 원하는 카테고리를 선택해 해당 카테고리 문제를 랜덤 추천 받을 수 있다.

<img width="300" height="600" alt="카테고리 목록" src="https://github.com/binimini/2023-Graduation-Project/assets/69030160/6d866cae-741b-499a-b814-2bc0fd9f8183">

<img width="300" height="600" alt="카테고리 문제 조회" src="https://github.com/binimini/2023-Graduation-Project/assets/69030160/eae1e767-2330-476e-a9cb-97d5a67fe7f5">


#### 실시간 ChatGPT 연결
✨ 실시간으로 질문해 답변받을 수 있도록 ChatGPT를 연결한다. 피드백 버튼으로 작성한 코드에 대해 피드백 받을 수 있다.

<img width="700" alt="gpt 연동 중" src="https://github.com/binimini/2023-Graduation-Project/assets/69030160/b2e98b69-03e1-4988-aaa1-60cc640c2a07">

<img width="700" alt="gpt 코드 피드백 시작" src="https://github.com/binimini/2023-Graduation-Project/assets/69030160/039c6f79-ce64-4560-921e-b733359a44f4">


#### 문제 추천
✨ 연동한 사용자 정보를 기반으로 적합한 문제를 추천받을 수 있다.

<img width="300" height="600" alt="문제 추천" src="https://github.com/binimini/2023-Graduation-Project/assets/69030160/301d5484-44ca-4bc1-849e-30f32cb7fb4d">


### Contact

##### ❣️ FRONTEND
민수빈 ✉️ tnqls5417@naver.com<br/>

##### ❣️ BACKEND
민수빈 ✉️ tnqls5417@naver.com<br/>


## 기반 프로젝트 : Concoder

### 기능
#### 메인 페이지
✨ 가장 왼쪽의 섹터에서 백준에 있는 문제들의 정보를 열람할 수 있다. **필터 검색**과 **번호 검색**을 지원하며, 필터 검색은 DB에서 티어 기준으로 랜덤 추천해준다. <br/> 

✨ 가운데에는 **코드 에디터**가 위치해있고, 아래에 컴파일 버튼과 스냅샷 버튼으로 해당 기능들을 이용할 수 있다. 컴파일시 우측 상단 컴파일 정보 섹터에 시간과 메모리 정보를 확인할 수 있으며, 컴파일 실패시 에러 로그를 보여준다.
<br/>

✨ 우측 중앙에 **테스트케이스**를 등록하면 컴파일시 각 테스트케이스의 성공 여부도 확인할 수 있다. 
<br/>

✨ 가장 우측 하단에는 채팅 기능을 제공한다.

<img width="1250" alt="KakaoTalk_Photo_2022-11-21-15-28-07 002" src="https://user-images.githubusercontent.com/72961728/202980432-dfa3bad8-4338-4cd6-8140-39de7339e605.png">

<br/>

#### 코드 스냅샷 및 불러오기 기능
<img width="1250" alt="KakaoTalk_Photo_2022-11-21-15-28-06 001" src="https://user-images.githubusercontent.com/72961728/202980416-86e45dba-4f7b-426b-b866-4ded989c008c.png">

<br/>

#### 타이머
<img width="1250" alt="KakaoTalk_Photo_2022-11-21-15-28-07 003" src="https://user-images.githubusercontent.com/72961728/202980441-6ac4ae5f-2c8c-414e-a337-a64d34a75659.png">

### Contact

##### ❣️ FRONTEND
정지원 ✉️ wjdwl001@khu.ac.kr<br/>
최지민 ✉️ 527wlals@khu.ac.kr

##### ❣️ BACKEND
민수빈 ✉️ tnqls5417@naver.com<br/>
신정아 ✉️ jeonga@khu.ac.kr




<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Spring]: https://img.shields.io/badge/Spring-20232A?style=for-the-badge&logo=spring&logoColor=6DB53D
[Spring-url]: https://reactjs.org/
